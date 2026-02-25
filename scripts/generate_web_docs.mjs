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

function normalizeDocPath(docPath = '') {
  return docPath.replace(/\\/g, '/').replace(/^\.\/+/, '').replace(/^\/+/, '');
}

function isExternalHref(href = '') {
  return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(href);
}

function rewriteInternalDocLinks(html, currentDocPath, docPathToSectionId) {
  const normalizedCurrent = normalizeDocPath(currentDocPath);
  const currentDir = path.posix.dirname(normalizedCurrent);

  return html.replace(/href="([^"]+)"/g, (fullMatch, rawHref) => {
    const href = String(rawHref || '').trim();
    if (!href || href.startsWith('#') || isExternalHref(href)) {
      return fullMatch;
    }

    const [hrefNoHash] = href.split('#');
    const [hrefPath] = hrefNoHash.split('?');
    if (!/\.md$/i.test(hrefPath)) {
      return fullMatch;
    }

    let resolvedDocPath = '';
    if (hrefPath.startsWith('/')) {
      resolvedDocPath = normalizeDocPath(hrefPath);
    } else {
      resolvedDocPath = normalizeDocPath(path.posix.normalize(path.posix.join(currentDir, hrefPath)));
    }

    if (resolvedDocPath.startsWith('..')) {
      return fullMatch;
    }

    const targetSectionId = docPathToSectionId.get(resolvedDocPath);
    if (!targetSectionId) {
      return fullMatch;
    }

    return `href="#${targetSectionId}"`;
  });
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

function getInterpolationExamples() {
  return [
    {
      key: 'lineal',
      title: 'Lineal',
      description: 'Une los puntos conocidos con una transicion progresiva entre ambos extremos.',
      svg: `
        <svg viewBox="0 0 220 84" aria-hidden="true" focusable="false">
          <polyline points="10,62 58,28 112,44 168,18 210,24" class="interp-line known"/>
          <line x1="58" y1="28" x2="112" y2="44" class="interp-line estimated"/>
          <circle cx="58" cy="28" r="4" class="interp-point"/>
          <circle cx="112" cy="44" r="4" class="interp-point"/>
        </svg>
      `,
    },
    {
      key: 'continuidad',
      title: 'Continuidad',
      description: 'Conserva el ultimo valor conocido hasta que aparece un nuevo dato valido.',
      svg: `
        <svg viewBox="0 0 220 84" aria-hidden="true" focusable="false">
          <polyline points="10,58 52,30 52,30 120,30 120,30 162,44 210,20" class="interp-line known"/>
          <line x1="52" y1="30" x2="120" y2="30" class="interp-line estimated"/>
          <circle cx="52" cy="30" r="4" class="interp-point"/>
          <circle cx="120" cy="30" r="4" class="interp-point soft"/>
        </svg>
      `,
    },
    {
      key: 'agujero-negro',
      title: 'Agujero negro',
      description: 'No rellena los faltantes: mantiene un corte visible en la serie temporal.',
      svg: `
        <svg viewBox="0 0 220 84" aria-hidden="true" focusable="false">
          <polyline points="10,54 56,26" class="interp-line known"/>
          <polyline points="140,40 182,22 210,26" class="interp-line known"/>
          <line x1="56" y1="26" x2="140" y2="40" class="interp-gap"/>
          <circle cx="56" cy="26" r="4" class="interp-point"/>
          <circle cx="140" cy="40" r="4" class="interp-point"/>
        </svg>
      `,
    },
    {
      key: 'relleno-cero',
      title: 'Relleno cero',
      description: 'Completa los intervalos faltantes con valor cero para continuidad operativa.',
      svg: `
        <svg viewBox="0 0 220 84" aria-hidden="true" focusable="false">
          <line x1="10" y1="68" x2="210" y2="68" class="interp-axis"/>
          <polyline points="10,56 60,24 106,68 156,68 210,20" class="interp-line known"/>
          <line x1="60" y1="24" x2="156" y2="68" class="interp-line estimated"/>
          <circle cx="106" cy="68" r="4" class="interp-point zero"/>
          <circle cx="156" cy="68" r="4" class="interp-point zero"/>
        </svg>
      `,
    },
  ];
}

function getMonitoringFpotExample() {
  return {
    monitorName: 'Control de Factor de Potencia',
    metricName: 'F. de Pot.',
    monitorType: 'Alerta',
    sampleWindow: '10 min',
    sampleFrequency: '5 min',
    thresholdValue: '0.93',
    breachPercent: '10%',
    triggerState: 'ALARMA',
    svg: `
      <svg viewBox="0 0 560 210" aria-hidden="true" focusable="false">
        <rect x="22" y="18" width="516" height="160" class="mon-grid-bg"/>
        <line x1="22" y1="58" x2="538" y2="58" class="mon-threshold"/>
        <text x="30" y="52" class="mon-threshold-label">Umbral 0.93</text>

        <polyline points="30,42 76,48 122,62 168,54 214,50 260,64 306,68 352,46 398,52 444,72 490,60 530,56" class="mon-series"/>

        <circle cx="122" cy="62" r="5" class="mon-point-breach"/>
        <circle cx="260" cy="64" r="5" class="mon-point-breach"/>
        <circle cx="306" cy="68" r="5" class="mon-point-breach"/>
        <circle cx="444" cy="72" r="5" class="mon-point-breach"/>

        <line x1="120" y1="190" x2="520" y2="190" class="mon-axis"/>
        <line x1="120" y1="184" x2="120" y2="196" class="mon-tick"/>
        <line x1="320" y1="184" x2="320" y2="196" class="mon-tick"/>
        <line x1="520" y1="184" x2="520" y2="196" class="mon-tick"/>
        <text x="95" y="206" class="mon-axis-label">-10 min</text>
        <text x="302" y="206" class="mon-axis-label">-5 min</text>
        <text x="506" y="206" class="mon-axis-label">Ahora</text>
      </svg>
    `,
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

  if (normalizedType === 'interpolation-examples') {
    const cardsHtml = getInterpolationExamples()
      .map(
        (item) => `
          <article class="interp-card interp-${item.key}">
            <div class="interp-chart">${item.svg}</div>
            <div class="interp-name">${escapeHtml(item.title)}</div>
            <div class="interp-text">${escapeHtml(item.description)}</div>
          </article>
        `
      )
      .join('\n');

    return `
      <div class="interp-block">
        <div class="interp-title">Ejemplos graficos de interpolacion</div>
        <div class="interp-grid">${cardsHtml}</div>
      </div>
    `;
  }

  if (normalizedType === 'monitoring-example-fpot') {
    const example = getMonitoringFpotExample();
    return `
      <div class="mon-example">
        <div class="mon-title">Ejemplo visual - Monitoreo de ${escapeHtml(example.metricName)}</div>
        <div class="mon-grid">
          <article class="mon-step">
            <div class="mon-step-kicker">Paso 1</div>
            <div class="mon-step-name">Monitoreo</div>
            <ul>
              <li><strong>Nombre:</strong> ${escapeHtml(example.monitorName)}</li>
              <li><strong>Tipo:</strong> ${escapeHtml(example.monitorType)}</li>
              <li><strong>Ventana:</strong> ${escapeHtml(example.sampleWindow)}</li>
              <li><strong>Frecuencia:</strong> ${escapeHtml(example.sampleFrequency)}</li>
            </ul>
          </article>

          <article class="mon-step">
            <div class="mon-step-kicker">Paso 2</div>
            <div class="mon-step-name">Regla</div>
            <ul>
              <li><strong>Nombre:</strong> ${escapeHtml(example.metricName)}</li>
              <li><strong>Metodo:</strong> Menor que</li>
              <li><strong>Limite:</strong> ${escapeHtml(example.thresholdValue)}</li>
              <li><strong>Umbral:</strong> ${escapeHtml(example.breachPercent)} de puntos bajo limite</li>
            </ul>
          </article>

          <article class="mon-step">
            <div class="mon-step-kicker">Paso 3</div>
            <div class="mon-step-name">Disparador</div>
            <ul>
              <li><strong>Tipo:</strong> Comunicacion</li>
              <li><strong>Estado:</strong> ${escapeHtml(example.triggerState)}</li>
              <li><strong>Patron:</strong> Horario operativo o todo el dia</li>
              <li><strong>Destino:</strong> Colaboradores responsables</li>
            </ul>
          </article>
        </div>

        <div class="mon-chart-wrap">
          <div class="mon-chart-legend">
            <span class="legend-item"><span class="legend-dot normal"></span> Valor dentro de limite</span>
            <span class="legend-item"><span class="legend-dot breach"></span> Valor por debajo de 0.93</span>
            <span class="legend-item"><span class="legend-line"></span> Evaluacion cada 5 min en ventana de 10 min</span>
          </div>
          <div class="mon-chart">${example.svg}</div>
          <p class="mon-caption">
            Si en los ultimos 10 minutos al menos el 10% de los puntos de <strong>${escapeHtml(example.metricName)}</strong> cae por debajo de <strong>${escapeHtml(example.thresholdValue)}</strong>,
            el monitoreo pasa a estado <strong>${escapeHtml(example.triggerState)}</strong> y ejecuta comunicacion.
          </p>
        </div>
      </div>
    `;
  }

  return marked.parse(parsedBody);
}

function renderMarkdownWithBlocks(markdownText) {
  const lines = markdownText.split('\n');
  const htmlParts = [];
  const markdownBuffer = [];
  let idx = 0;

  const flushMarkdownBuffer = () => {
    if (markdownBuffer.length === 0) {
      return;
    }
    htmlParts.push(marked.parse(markdownBuffer.join('\n')));
    markdownBuffer.length = 0;
  };

  while (idx < lines.length) {
    const currentLine = lines[idx];
    const startMatch = currentLine.trim().match(/^:::([a-zA-Z0-9_-]+)(?:\s+(.*))?$/);

    if (!startMatch) {
      markdownBuffer.push(currentLine);
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
      markdownBuffer.push(currentLine);
      idx += 1;
      continue;
    }

    flushMarkdownBuffer();
    const blockHtml = renderDirective(type, args, blockLines.join('\n'));
    htmlParts.push(blockHtml.trim());
    idx = endIdx + 1;
  }

  flushMarkdownBuffer();
  return htmlParts.join('\n');
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

function parseNavEntry(label, value, groupName, docItems, docPathToSectionId) {
  if (typeof value === 'string') {
    const docPath = normalizeDocPath(value);
    const sectionId = slugify(docPath.replace(/\.md$/i, '').replace(/\/index$/i, ''));

    docItems.push({ group: groupName, label, docPath, sectionId });
    docPathToSectionId.set(docPath, sectionId);

    return { type: 'link', label, sectionId };
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const children = [];
  for (const childEntry of value) {
    if (!childEntry || typeof childEntry !== 'object' || Array.isArray(childEntry)) {
      continue;
    }

    for (const [childLabel, childValue] of Object.entries(childEntry)) {
      const parsedChild = parseNavEntry(
        childLabel,
        childValue,
        groupName,
        docItems,
        docPathToSectionId
      );
      if (parsedChild) {
        children.push(parsedChild);
      }
    }
  }

  if (children.length === 0) {
    return null;
  }

  return { type: 'group', label, children };
}

function parseNav(nav) {
  const docItems = [];
  const docPathToSectionId = new Map();
  const sidebarGroups = [];
  const inicioGroup = { groupName: 'Inicio', entries: [] };

  for (const section of nav || []) {
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      continue;
    }

    for (const [sectionName, sectionValue] of Object.entries(section)) {
      if (typeof sectionValue === 'string') {
        const parsedEntry = parseNavEntry(
          sectionName,
          sectionValue,
          'Inicio',
          docItems,
          docPathToSectionId
        );
        if (parsedEntry) {
          inicioGroup.entries.push(parsedEntry);
        }
        continue;
      }

      if (!Array.isArray(sectionValue)) {
        continue;
      }

      const sectionEntries = [];
      for (const entry of sectionValue) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
          continue;
        }

        for (const [entryLabel, entryValue] of Object.entries(entry)) {
          const parsedEntry = parseNavEntry(
            entryLabel,
            entryValue,
            sectionName,
            docItems,
            docPathToSectionId
          );
          if (parsedEntry) {
            sectionEntries.push(parsedEntry);
          }
        }
      }

      if (sectionEntries.length > 0) {
        sidebarGroups.push({ groupName: sectionName, entries: sectionEntries });
      }
    }
  }

  if (inicioGroup.entries.length > 0) {
    sidebarGroups.unshift(inicioGroup);
  }

  return { docItems, docPathToSectionId, sidebarGroups };
}

function renderSidebarEntries(entries, activeState, treeState, level = 0) {
  return entries
    .map((entry) => {
      if (entry.type === 'link') {
        const isFirst = !activeState.assigned;
        if (isFirst) {
          activeState.assigned = true;
        }

        if (level > 0) {
          const activeClass = isFirst ? ' active' : '';
          return `<a class="nav-sub${activeClass}" href="#${entry.sectionId}">${escapeHtml(entry.label)}</a>`;
        }

        const activeClass = isFirst ? ' active' : '';
        return `<a class="nav-item${activeClass}" href="#${entry.sectionId}"><span class="nav-icon">◆</span>${escapeHtml(entry.label)}</a>`;
      }

      if (entry.type === 'group') {
        const groupId = `nav-group-${treeState.counter}`;
        treeState.counter += 1;
        const nestedHtml = renderSidebarEntries(entry.children || [], activeState, treeState, level + 1);
        const parentClass = level > 0 ? 'nav-sub nav-sub-parent nav-group-toggle' : 'nav-item nav-item-parent nav-group-toggle';
        const iconHtml = level > 0 ? '' : '<span class="nav-icon">◆</span>';
        return `
          <div class="nav-group">
            <button type="button" class="${parentClass}" data-nav-toggle="${groupId}" aria-expanded="false">
              ${iconHtml}
              <span class="nav-label">${escapeHtml(entry.label)}</span>
              <span class="nav-caret">▸</span>
            </button>
            <div class="nav-group-children" id="${groupId}" hidden>
              ${nestedHtml}
            </div>
          </div>
        `;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n      ');
}

async function build() {
  const mkdocsRaw = await fs.readFile(MKDOCS_CONFIG, 'utf-8');
  const mkdocsConfig = yaml.load(mkdocsRaw) || {};
  const { docItems, docPathToSectionId, sidebarGroups } = parseNav(mkdocsConfig.nav || []);
  const sectionsHtml = [];

  let heroTitle = 'Manual de uso';
  const heroEmphasis = 'Clickie';
  let heroDesc =
    'Guia completa para operar la plataforma: metricas, gemelos digitales, monitoreos, visor de datos, activos y configuracion.';

  for (let idx = 0; idx < docItems.length; idx += 1) {
    const { group, label, docPath, sectionId } = docItems[idx];
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

    const bodyNoH1 = removeFirstH1(parsed.content);
    const bodyHtml = rewriteInternalDocLinks(
      renderMarkdownWithBlocks(bodyNoH1),
      docPath,
      docPathToSectionId
    );
    const icon = ICON_BY_GROUP[group] || '◆';
    const dividerHtml = idx < docItems.length - 1 ? '<div class="divider"></div>' : '';

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

  const activeState = { assigned: false };
  const treeState = { counter: 0 };
  const navHtml = sidebarGroups
    .map(({ groupName, entries }) => {
      const links = renderSidebarEntries(entries, activeState, treeState);
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
