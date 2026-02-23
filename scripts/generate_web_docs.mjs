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

function parseDirectiveArgs(raw = '') {
  const args = {};
  const argRegex = /([a-zA-Z0-9_-]+)=("([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match = argRegex.exec(raw);

  while (match) {
    const key = match[1];
    const value = match[3] ?? match[4] ?? match[5] ?? '';
    args[key] = value;
    match = argRegex.exec(raw);
  }

  return args;
}

function parseOrderedItems(raw = '') {
  const lines = raw.split('\n');
  const items = [];
  let idx = 0;

  while (idx < lines.length) {
    const match = lines[idx].match(/^\s*\d+\.\s+(.*)$/);
    if (!match) {
      idx += 1;
      continue;
    }

    const buffer = [match[1].trim()];
    idx += 1;

    while (idx < lines.length && !/^\s*\d+\.\s+/.test(lines[idx])) {
      const nextLine = lines[idx].trim();
      if (nextLine) {
        buffer.push(nextLine);
      }
      idx += 1;
    }

    const item = buffer.join(' ').replace(/\s+/g, ' ').trim();
    if (item) {
      items.push(item);
    }
  }

  return items;
}

function parseBulletItems(raw = '') {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

function parseTitleBody(raw = '') {
  const strongMatch = raw.match(/^\*\*(.+?)\*\*:?[\s]*(.*)$/);
  if (strongMatch) {
    return {
      title: strongMatch[1].trim(),
      body: strongMatch[2].trim(),
    };
  }

  const colonMatch = raw.match(/^([^:]{3,}):\s*(.*)$/);
  if (colonMatch) {
    return {
      title: colonMatch[1].trim(),
      body: colonMatch[2].trim(),
    };
  }

  return {
    title: raw.trim(),
    body: '',
  };
}

function parseAccessBox(raw = '') {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      label: 'Acceso',
      url: '',
      description: '',
    };
  }

  const linkMatch = lines[0].match(/^\[(.+?)\]\((.+?)\)$/);

  return {
    label: linkMatch?.[1] || lines[0],
    url: linkMatch?.[2] || lines[0],
    description: lines.slice(1).join(' '),
  };
}

function renderDirective(type, args, body) {
  const normalizedType = type.toLowerCase();
  const parsedBody = body.trim();

  if (normalizedType === 'module-strip') {
    return `<div class="module-strip">${marked.parse(parsedBody)}</div>`;
  }

  if (normalizedType === 'info') {
    return `<div class="infobox">${marked.parse(parsedBody)}</div>`;
  }

  if (normalizedType === 'info-yellow') {
    return `<div class="infobox yellow">${marked.parse(parsedBody)}</div>`;
  }

  if (normalizedType === 'intro-principle') {
    const icon = args.icon || '◆';
    return `
      <div class="intro-principle">
        <div class="intro-principle-icon">${escapeHtml(icon)}</div>
        <div class="intro-principle-text">${marked.parse(parsedBody)}</div>
      </div>
    `;
  }

  if (normalizedType === 'access-box') {
    const access = parseAccessBox(parsedBody);
    const safeLabel = escapeHtml(access.label);
    const safeUrl = escapeHtml(access.url);
    const safeDescription = escapeHtml(access.description || 'Ingreso oficial a la plataforma.');

    return `
      <div class="access-box">
        <div class="access-icon">↗</div>
        <div>
          <a class="access-url" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>
          <div class="access-text">${safeDescription}</div>
        </div>
      </div>
    `;
  }

  if (normalizedType === 'steps') {
    const items = parseOrderedItems(parsedBody);
    if (items.length === 0) {
      return marked.parse(parsedBody);
    }

    const stepHtml = items
      .map((item, index) => {
        const parsedItem = parseTitleBody(item);
        const title = escapeHtml(parsedItem.title);
        const bodyHtml = parsedItem.body ? marked.parseInline(parsedItem.body) : '';
        const connector = index < items.length - 1 ? '<div class="step-line"></div>' : '';

        return `
          <div class="step">
            <div class="step-left">
              <div class="step-num">${index + 1}</div>
              ${connector}
            </div>
            <div class="step-body">
              <div class="step-title">${title}</div>
              ${bodyHtml ? `<div class="step-text">${bodyHtml}</div>` : ''}
            </div>
          </div>
        `;
      })
      .join('\n');

    return `<div class="steps">${stepHtml}</div>`;
  }

  if (normalizedType === 'cards') {
    const cols = Number.parseInt(args.cols || '2', 10);
    const className = cols >= 3 ? 'card-grid three' : 'card-grid';
    const items = parseBulletItems(parsedBody);

    if (items.length === 0) {
      return marked.parse(parsedBody);
    }

    const cardsHtml = items
      .map((item) => {
        const parsedItem = parseTitleBody(item);
        const title = escapeHtml(parsedItem.title);
        const bodyHtml = parsedItem.body ? marked.parseInline(parsedItem.body) : '';

        return `
          <article class="card">
            <div class="card-title"><span class="dot"></span>${title}</div>
            ${bodyHtml ? `<div class="card-text">${bodyHtml}</div>` : ''}
          </article>
        `;
      })
      .join('\n');

    return `<div class="${className}">${cardsHtml}</div>`;
  }

  if (normalizedType === 'learning-path') {
    const title = args.title || 'Camino de aprendizaje recomendado';
    const items = parseOrderedItems(parsedBody);

    if (items.length === 0) {
      return marked.parse(parsedBody);
    }

    const stepsHtml = items
      .map((item, index) => {
        const parsedItem = parseTitleBody(item);
        const itemTitle = escapeHtml(parsedItem.title);
        const itemBody = parsedItem.body ? marked.parseInline(parsedItem.body) : '';
        const arrow = index < items.length - 1 ? '<div class="lp-arrow">→</div>' : '';

        return `
          <article class="lp-step">
            <div class="lp-num">${index + 1}</div>
            <div class="lp-step-title">${itemTitle}</div>
            ${itemBody ? `<div class="lp-step-text">${itemBody}</div>` : ''}
          </article>
          ${arrow}
        `;
      })
      .join('\n');

    return `
      <div class="learning-path">
        <div class="lp-title">${escapeHtml(title)}</div>
        <div class="lp-steps">${stepsHtml}</div>
      </div>
    `;
  }

  return marked.parse(parsedBody);
}

function renderMarkdownWithBlocks(markdownText) {
  const lines = markdownText.split('\n');
  const output = [];
  let idx = 0;

  while (idx < lines.length) {
    const currentLine = lines[idx];
    const startMatch = currentLine.trim().match(/^:::([a-zA-Z0-9_-]+)(?:\s+(.*))?$/);

    if (!startMatch) {
      output.push(currentLine);
      idx += 1;
      continue;
    }

    const type = startMatch[1];
    const args = parseDirectiveArgs(startMatch[2] || '');
    const blockLines = [];
    let endIdx = idx + 1;

    while (endIdx < lines.length && lines[endIdx].trim() !== ':::') {
      blockLines.push(lines[endIdx]);
      endIdx += 1;
    }

    if (endIdx >= lines.length) {
      output.push(currentLine);
      idx += 1;
      continue;
    }

    const blockHtml = renderDirective(type, args, blockLines.join('\n'));
    output.push(blockHtml);
    idx = endIdx + 1;
  }

  return marked.parse(output.join('\n'));
}

function extractHeroDescription(content) {
  const cleaned = content
    .replace(/^:::[^\n]*$/gm, '')
    .replace(/^\s*:::\s*$/gm, '')
    .trim();

  const paragraph = cleaned
    .split('\n\n')
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith('#') && !part.startsWith('<'));

  return paragraph ? paragraph.replace(/\s+/g, ' ') : '';
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
      const paragraph = extractHeroDescription(parsed.content);
      if (paragraph) {
        heroDesc = paragraph;
      }
    }

    const sectionId = slugify(docPath.replace(/\.md$/i, '').replace(/\/index$/i, ''));

    if (!sidebarGroups.has(group)) {
      sidebarGroups.set(group, []);
    }
    sidebarGroups.get(group).push({ label, sectionId });

    const bodyNoH1 = removeFirstH1(parsed.content);
    const bodyHtml = renderMarkdownWithBlocks(bodyNoH1);
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
