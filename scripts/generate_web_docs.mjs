import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const MKDOCS_CONFIG = path.join(ROOT, 'mkdocs.yml');
const OUTPUT_FILE = path.join(ROOT, 'src', 'manual.generated.html');

const ICON_BY_GROUP = {
  Inicio: '◆',
  Conceptos: '◆',
  Analisis: '▦',
  Automatizacion: '◉',
  Modelado: '✦',
  Organizacion: '◈',
  Configuracion: '⚙',
  Changelog: '≡',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function removeFirstH1(markdownText) {
  const lines = markdownText.split('\n');
  const idx = lines.findIndex((line) => line.startsWith('# '));
  if (idx === -1) {
    return markdownText;
  }
  return [...lines.slice(0, idx), ...lines.slice(idx + 1)].join('\n').replace(/^\s+/, '');
}

function flattenNav(nav) {
  const items = [];

  for (const section of nav || []) {
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      continue;
    }

    for (const [sectionName, sectionValue] of Object.entries(section)) {
      if (typeof sectionValue === 'string') {
        items.push({ group: 'Inicio', label: sectionName, docPath: sectionValue });
        continue;
      }

      if (Array.isArray(sectionValue)) {
        for (const entry of sectionValue) {
          if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            continue;
          }

          for (const [label, docPath] of Object.entries(entry)) {
            if (typeof docPath === 'string') {
              items.push({ group: sectionName, label, docPath });
            }
          }
        }
      }
    }
  }

  return items;
}

async function build() {
  const mkdocsRaw = await fs.readFile(MKDOCS_CONFIG, 'utf-8');
  const mkdocsConfig = yaml.load(mkdocsRaw) || {};
  const navItems = flattenNav(mkdocsConfig.nav || []);

  const sidebarGroups = new Map();
  const sectionsHtml = [];

  let heroTitle = 'Manual de uso';
  const heroEmphasis = 'Clickie';
  let heroDesc =
    'Guia completa para operar la plataforma: metricas, gemelos digitales, monitoreos, visor de datos, activos y configuracion.';

  for (let idx = 0; idx < navItems.length; idx += 1) {
    const { group, label, docPath } = navItems[idx];
    const absolutePath = path.join(DOCS_DIR, docPath);

    try {
      await fs.access(absolutePath);
    } catch {
      continue;
    }

    const raw = await fs.readFile(absolutePath, 'utf-8');
    const parsed = matter(raw);
    const title = String(parsed.data?.title || label);

    if (docPath === 'index.md') {
      const h1 = parsed.content.match(/^#\s+(.+)$/m);
      if (h1?.[1]) {
        heroTitle = h1[1].trim();
      }
      const paragraph = parsed.content
        .split('\n\n')
        .map((part) => part.trim())
        .find((part) => part && !part.startsWith('#'));
      if (paragraph) {
        heroDesc = paragraph.replace(/\s+/g, ' ');
      }
    }

    const sectionId = slugify(docPath.replace(/\.md$/i, '').replace(/\/index$/i, ''));

    if (!sidebarGroups.has(group)) {
      sidebarGroups.set(group, []);
    }
    sidebarGroups.get(group).push({ label, sectionId });

    const bodyNoH1 = removeFirstH1(parsed.content);
    const bodyHtml = marked.parse(bodyNoH1);
    const icon = ICON_BY_GROUP[group] || '◆';
    const dividerHtml = idx < navItems.length - 1 ? '<div class="divider"></div>' : '';

    sectionsHtml.push(`
    <section class="section" id="${sectionId}">
      <div class="sec-header">
        <div class="sec-icon">${icon}</div>
        <div>
          <div class="sec-label">${escapeHtml(group)}</div>
          <h2>${escapeHtml(title)}</h2>
          <div class="sec-desc">${escapeHtml(label)}</div>
        </div>
      </div>
      <div class="prose">${bodyHtml}</div>
    </section>
    ${dividerHtml}`);
  }

  const navHtml = [...sidebarGroups.entries()]
    .map(([groupName, entries]) => {
      const links = entries
        .map((entry, idx) => {
          const activeClass = idx === 0 && groupName === 'Inicio' ? ' active' : '';
          return `<a class="nav-item${activeClass}" href="#${entry.sectionId}"><span class="nav-icon">◆</span>${escapeHtml(entry.label)}</a>`;
        })
        .join('\n      ');

      return `
    <div class="nav-sec">
      <div class="nav-sec-title">${escapeHtml(groupName)}</div>
      ${links}
    </div>`;
    })
    .join('');

  const html = `<!-- Generated from /docs by scripts/generate_web_docs.mjs -->
<header class="topbar">
  <a class="sb-logo" href="#inicio">
    <div class="sb-badge">C</div>
    <div>
      <div class="sb-title">Clickie</div>
      <div class="sb-sub">Manual de uso · v4</div>
    </div>
  </a>

  <form class="top-search-form" role="search" aria-label="Buscar en el manual">
    <input class="top-search-input" type="search" placeholder="Buscar contenido del manual..." autocomplete="off" aria-label="Buscar contenido del manual" />
    <button class="top-search-btn" type="submit">Buscar</button>
    <div class="top-search-dropdown" hidden>
      <ul class="top-search-suggestions" role="listbox" aria-label="Sugerencias de busqueda"></ul>
    </div>
  </form>

  <div class="top-search-status" aria-live="polite"></div>
</header>

<aside class="sidebar">
  <nav>${navHtml}
  </nav>
</aside>

<main class="main">
  <header class="hero" id="inicio">
    <div class="hero-tag">◆ Documentacion oficial · Plataforma Clickie</div>
    <h1>${escapeHtml(heroTitle)}<br><em>${escapeHtml(heroEmphasis)}</em></h1>
    <p class="hero-desc">${escapeHtml(heroDesc)}</p>
    <div class="hero-version">v4 · Plataforma Clickie</div>
  </header>

  <div class="content">${sectionsHtml.join('')}
  </div>
</main>
`;

  await fs.writeFile(OUTPUT_FILE, html, 'utf-8');
  console.log(`Generated ${OUTPUT_FILE}`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
