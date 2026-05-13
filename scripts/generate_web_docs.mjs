import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MKDOCS_CONFIG = path.join(ROOT, 'mkdocs.yml');
const OUTPUT_FILE = path.join(ROOT, 'src', 'manual.generated.html');
const referencedStaticAssets = new Set();

const ICON_BY_GROUP = {
  Inicio: '◆',
  Home: '◆',
  Conceptos: '◆',
  Concepts: '◆',
  Análisis: '▦',
  Analysis: '▦',
  Automatización: '◉',
  Automation: '◉',
  Modelado: '✦',
  Modeling: '✦',
  Organización: '◈',
  Organization: '◈',
  Configuración: '⚙',
  Configuration: '⚙',
  'API v4': '⧉',
  Changelog: '≡',
};

const UI_TEXT = {
  es: {
    topSubtitle: 'Manual de uso · v4',
    searchAria: 'Buscar en el manual',
    searchPlaceholder: 'Buscar contenido del manual...',
    searchButton: 'Buscar',
    searchSuggestions: 'Sugerencias de búsqueda',
    heroTag: '◆ Documentación oficial · Plataforma Clickie',
    heroVersion: 'v4 · Plataforma Clickie',
    languageLabel: 'Idioma',
    languageEs: 'Español',
    languageEn: 'English',
  },
  en: {
    topSubtitle: 'User manual · v4',
    searchAria: 'Search in manual',
    searchPlaceholder: 'Search documentation content...',
    searchButton: 'Search',
    searchSuggestions: 'Search suggestions',
    heroTag: '◆ Official documentation · Clickie Platform',
    heroVersion: 'v4 · Clickie Platform',
    languageLabel: 'Language',
    languageEs: 'Español',
    languageEn: 'English',
  },
};

const LABEL_TRANSLATIONS = {
  en: {
    Inicio: 'Home',
    Conceptos: 'Concepts',
    Introducción: 'Introduction',
    'Métricas y fórmulas': 'Metrics and formulas',
    'Selector de métricas': 'Metrics selector',
    Análisis: 'Analysis',
    'Visor de datos': 'Data viewer',
    'Paneles y reportes': 'Dashboards and reports',
    Automatización: 'Automation',
    Monitoreos: 'Monitoring',
    Modelado: 'Modeling',
    'Gemelos digitales': 'Digital twins',
    'Variables dinámicas en superposiciones': 'Dynamic overlay variables',
    Organización: 'Organization',
    Activos: 'Assets',
    Configuración: 'Configuration',
    'Configuración de cuenta': 'Account settings',
    'Datos y fuentes': 'Data and sources',
    Boletines: 'Newsletters',
    'Vista general': 'Overview',
    'Bloques de contenido': 'Content blocks',
    'Grupos de destinatarios': 'Recipient groups',
    Plantillas: 'Templates',
    'Introducción API': 'API introduction',
    Endpoints: 'Endpoints',
    'API Changelog': 'API changelog',
  },
};

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

const stripHtml = (value = '') => value.replace(/<[^>]*>/g, '');

const stripMarkdownSyntax = (value = '') =>
  value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const slugifyAnchor = (value = '') => slugify(stripMarkdownSyntax(stripHtml(String(value))));

function removeFirstH1(markdownText) {
  const lines = markdownText.split('\n');
  const idx = lines.findIndex((line) => line.startsWith('# '));
  if (idx === -1) {
    return markdownText;
  }
  return [...lines.slice(0, idx), ...lines.slice(idx + 1)].join('\n').replace(/^\s+/, '');
}

function normalizeMarkdownForRendering(markdownText = '') {
  return markdownText.replace(/^(```+|~~~+)(#{1,6}\s+)/gm, '$1\n$2');
}

function normalizeDocPath(docPath = '') {
  return docPath.replace(/\\/g, '/').replace(/^\.\/+/, '').replace(/^\/+/, '');
}

function resolveDocPathForLocale(docPath, locale) {
  const normalized = normalizeDocPath(docPath);

  if (locale === 'es') {
    if (normalized.startsWith('api/')) {
      return `api-es/${normalized.slice('api/'.length)}`;
    }
    return normalized;
  }

  if (normalized.startsWith('api/')) {
    return normalized;
  }
  return `en/${normalized}`;
}

function translateLabel(label, locale) {
  return LABEL_TRANSLATIONS[locale]?.[label] || label;
}

function isExternalHref(href = '') {
  return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(href);
}

function splitHref(href = '') {
  const hashIndex = href.indexOf('#');
  const hrefWithoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : '';
  const queryIndex = hrefWithoutHash.indexOf('?');

  return {
    path: queryIndex >= 0 ? hrefWithoutHash.slice(0, queryIndex) : hrefWithoutHash,
    query: queryIndex >= 0 ? hrefWithoutHash.slice(queryIndex) : '',
    hash,
  };
}

function normalizeHashAnchor(hash = '') {
  if (!hash) {
    return '';
  }

  try {
    return slugifyAnchor(decodeURIComponent(hash));
  } catch {
    return slugifyAnchor(hash);
  }
}

function getCounterpartDocPathForAnchors(docPath = '') {
  const normalized = normalizeDocPath(docPath);

  if (normalized.startsWith('api-es/')) {
    return `api/${normalized.slice('api-es/'.length)}`;
  }

  if (normalized.startsWith('en/')) {
    return normalized.slice('en/'.length);
  }

  return normalized;
}

function extractMarkdownHeadings(markdownText = '') {
  const headings = [];
  const lines = markdownText.split('\n');
  let fenced = false;
  let fenceMarker = '';

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!fenced) {
        fenced = true;
        fenceMarker = marker;
      } else if (marker === fenceMarker) {
        fenced = false;
        fenceMarker = '';
      }
      continue;
    }

    if (fenced) {
      continue;
    }

    const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!headingMatch) {
      continue;
    }

    headings.push({
      depth: headingMatch[1].length,
      text: headingMatch[2].trim(),
    });
  }

  return headings;
}

function extractHashLinkAliases(markdownText = '') {
  const aliasesByLabelSlug = new Map();
  const withoutCodeBlocks = markdownText.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '');
  const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
  let match = linkRegex.exec(withoutCodeBlocks);

  while (match) {
    const labelSlug = slugifyAnchor(match[1]);
    const targetSlug = normalizeHashAnchor(match[2]);

    if (labelSlug && targetSlug) {
      const aliases = aliasesByLabelSlug.get(labelSlug) || new Set();
      aliases.add(targetSlug);
      aliasesByLabelSlug.set(labelSlug, aliases);
    }

    match = linkRegex.exec(withoutCodeBlocks);
  }

  return aliasesByLabelSlug;
}

async function readDocBodyWithoutH1(docPath) {
  const absolutePath = path.join(DOCS_DIR, docPath);

  try {
    const raw = await fs.readFile(absolutePath, 'utf-8');
    return normalizeMarkdownForRendering(removeFirstH1(matter(raw).content));
  } catch {
    return '';
  }
}

async function buildHeadingTargets(docPath, markdownText, sectionId) {
  const currentHeadings = extractMarkdownHeadings(markdownText);
  const hashAliasesByLabelSlug = extractHashLinkAliases(markdownText);
  const counterpartDocPath = getCounterpartDocPathForAnchors(docPath);
  const counterpartBody =
    counterpartDocPath !== normalizeDocPath(docPath)
      ? await readDocBodyWithoutH1(counterpartDocPath)
      : '';
  const counterpartHeadings = counterpartBody ? extractMarkdownHeadings(counterpartBody) : [];
  const usedIds = new Map();

  const toUniqueId = (slug) => {
    const baseId = `${sectionId}-${slug || 'section'}`;
    const count = usedIds.get(baseId) || 0;
    usedIds.set(baseId, count + 1);
    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };

  return currentHeadings.map((heading, index) => {
    const primarySlug = slugifyAnchor(counterpartHeadings[index]?.text || heading.text);
    const currentSlug = slugifyAnchor(heading.text);
    const primaryId = toUniqueId(primarySlug);
    const aliasIds = [];
    const extraAliasSlugs = new Set([
      ...(hashAliasesByLabelSlug.get(currentSlug) || []),
      ...(hashAliasesByLabelSlug.get(primarySlug) || []),
    ]);

    if (currentSlug && currentSlug !== primarySlug) {
      aliasIds.push(toUniqueId(currentSlug));
    }

    extraAliasSlugs.forEach((aliasSlug) => {
      if (aliasSlug && aliasSlug !== primarySlug && aliasSlug !== currentSlug) {
        aliasIds.push(toUniqueId(aliasSlug));
      }
    });

    return { primaryId, aliasIds };
  });
}

function createMarkdownRenderer(headingTargets) {
  const renderer = new marked.Renderer();
  let headingIndex = 0;

  renderer.heading = function heading({ tokens, depth }) {
    const html = this.parser.parseInline(tokens);
    const target = headingTargets[headingIndex] || {};
    const fallbackId = `heading-${headingIndex + 1}`;
    const primaryId = target.primaryId || fallbackId;
    const aliasHtml = (target.aliasIds || [])
      .map((id) => `<span class="heading-anchor-alias" id="${escapeHtml(id)}"></span>`)
      .join('');

    headingIndex += 1;
    return `${aliasHtml}<h${depth} id="${escapeHtml(primaryId)}">${html}</h${depth}>\n`;
  };

  return {
    parse: (markdownText) => marked.parse(markdownText, { renderer }),
    parseInline: (markdownText) => marked.parseInline(markdownText),
  };
}

function resolveRelativeDocAsset(currentDocPath, hrefPath) {
  const normalizedCurrent = normalizeDocPath(currentDocPath);
  const currentDir = path.posix.dirname(normalizedCurrent);
  const resolvedPath = hrefPath.startsWith('/')
    ? normalizeDocPath(hrefPath)
    : normalizeDocPath(path.posix.normalize(path.posix.join(currentDir, hrefPath)));

  return resolvedPath.startsWith('..') ? '' : resolvedPath;
}

function rewriteInternalDocLinks(html, currentDocPath, currentSectionId, docPathToSectionId) {
  const normalizedCurrent = normalizeDocPath(currentDocPath);
  const currentDir = path.posix.dirname(normalizedCurrent);

  return html.replace(/href="([^"]+)"/g, (fullMatch, rawHref) => {
    const href = String(rawHref || '').trim();
    if (!href || isExternalHref(href)) {
      return fullMatch;
    }

    if (href.startsWith('#')) {
      const targetAnchor = normalizeHashAnchor(href.slice(1));
      return targetAnchor ? `href="#${currentSectionId}-${targetAnchor}"` : fullMatch;
    }

    const { path: hrefPath, query, hash } = splitHref(href);
    if (!hrefPath) {
      return fullMatch;
    }

    if (!/\.md$/i.test(hrefPath)) {
      const resolvedAssetPath = resolveRelativeDocAsset(currentDocPath, hrefPath);
      if (!resolvedAssetPath) {
        return fullMatch;
      }

      referencedStaticAssets.add(resolvedAssetPath);
      return `href="./${resolvedAssetPath}${query}${hash ? `#${hash}` : ''}"`;
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

    const targetAnchor = normalizeHashAnchor(hash);
    return `href="#${targetSectionId}${targetAnchor ? `-${targetAnchor}` : ''}"`;
  });
}

function rewriteRelativeMediaSources(html, currentDocPath) {
  const normalizedCurrent = normalizeDocPath(currentDocPath);
  const currentDir = path.posix.dirname(normalizedCurrent);

  return html.replace(/src="([^"]+)"/g, (fullMatch, rawSrc) => {
    const src = String(rawSrc || '').trim();
    if (!src || src.startsWith('#') || src.startsWith('/') || isExternalHref(src)) {
      return fullMatch;
    }

    const [srcNoHash] = src.split('#');
    const [srcPath] = srcNoHash.split('?');
    if (!srcPath) {
      return fullMatch;
    }

    const suffix = src.slice(srcPath.length);
    const resolvedSrcPath = normalizeDocPath(path.posix.normalize(path.posix.join(currentDir, srcPath)));
    if (resolvedSrcPath.startsWith('..')) {
      return fullMatch;
    }

    return `src="./${resolvedSrcPath}${suffix}"`;
  });
}

async function copyReferencedStaticAssets() {
  await Promise.all(
    Array.from(referencedStaticAssets).map(async (assetPath) => {
      const src = path.join(DOCS_DIR, assetPath);
      const dst = path.join(PUBLIC_DIR, assetPath);

      try {
        const stat = await fs.stat(src);
        if (!stat.isFile()) {
          return;
        }
      } catch {
        return;
      }

      await fs.mkdir(path.dirname(dst), { recursive: true });
      await fs.copyFile(src, dst);
    })
  );
}

const DEFAULT_MARKDOWN_RENDERER = {
  parse: (markdownText) => marked.parse(markdownText),
  parseInline: (markdownText) => marked.parseInline(markdownText),
};

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

function getInterpolationExamples(locale = 'es') {
  const isEnglish = locale === 'en';
  return [
    {
      key: 'lineal',
      title: isEnglish ? 'Linear' : 'Lineal',
      description: isEnglish
        ? 'Connects known points with a progressive transition between both ends.'
        : 'Une los puntos conocidos con una transicion progresiva entre ambos extremos.',
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
      title: isEnglish ? 'Continuity' : 'Continuidad',
      description: isEnglish
        ? 'Keeps the latest known value until a new valid datapoint appears.'
        : 'Conserva el último valor conocido hasta que aparece un nuevo dato válido.',
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
      title: isEnglish ? 'Black hole' : 'Agujero negro',
      description: isEnglish
        ? 'Does not fill missing values: keeps a visible gap in the timeline.'
        : 'No rellena los faltantes: mantiene un corte visible en la serie temporal.',
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
      title: isEnglish ? 'Zero fill' : 'Relleno cero',
      description: isEnglish
        ? 'Fills missing intervals with zero to keep operational continuity.'
        : 'Completa los intervalos faltantes con valor cero para continuidad operativa.',
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

function getMonitoringFpotExample(locale = 'es') {
  const isEnglish = locale === 'en';
  return {
    monitorName: 'Control de Factor de Potencia',
    metricName: 'F. de Pot.',
    monitorType: 'Alerta',
    sampleWindow: '10 min',
    sampleFrequency: '5 min',
    thresholdValue: '0.93',
    breachPercent: '10%',
    triggerState: isEnglish ? 'ALARM' : 'ALARMA',
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

function renderDirective(type, args, body, locale = 'es', markdownRenderer = DEFAULT_MARKDOWN_RENDERER) {
  const isEnglish = locale === 'en';
  const normalizedType = type.toLowerCase();
  const parsedBody = body.trim();

  if (normalizedType === 'module-strip') {
    return `<div class="module-strip">${markdownRenderer.parse(parsedBody)}</div>`;
  }

  if (normalizedType === 'info') {
    return `<div class="infobox">${markdownRenderer.parse(parsedBody)}</div>`;
  }

  if (normalizedType === 'info-yellow') {
    return `<div class="infobox yellow">${markdownRenderer.parse(parsedBody)}</div>`;
  }

  if (normalizedType === 'intro-principle') {
    const icon = args.icon || '◆';
    return `
      <div class="intro-principle">
        <div class="intro-principle-icon">${escapeHtml(icon)}</div>
        <div class="intro-principle-text">${markdownRenderer.parse(parsedBody)}</div>
      </div>
    `;
  }

  if (normalizedType === 'access-box') {
    const access = parseAccessBox(parsedBody);
    const safeLabel = escapeHtml(access.label);
    const safeUrl = escapeHtml(access.url);
    const safeDescription = escapeHtml(
      access.description ||
        (isEnglish ? 'Official access to the platform.' : 'Ingreso oficial a la plataforma.')
    );

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
      return markdownRenderer.parse(parsedBody);
    }

    const stepHtml = items
      .map((item, index) => {
        const parsedItem = parseTitleBody(item);
        const title = escapeHtml(parsedItem.title);
        const bodyHtml = parsedItem.body ? markdownRenderer.parseInline(parsedItem.body) : '';
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
      return markdownRenderer.parse(parsedBody);
    }

    const cardsHtml = items
      .map((item) => {
        const parsedItem = parseTitleBody(item);
        const title = escapeHtml(parsedItem.title);
        const bodyHtml = parsedItem.body ? markdownRenderer.parseInline(parsedItem.body) : '';

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
    const title = args.title || (isEnglish ? 'Recommended learning path' : 'Camino de aprendizaje recomendado');
    const items = parseOrderedItems(parsedBody);

    if (items.length === 0) {
      return markdownRenderer.parse(parsedBody);
    }

    const stepsHtml = items
      .map((item, index) => {
        const parsedItem = parseTitleBody(item);
        const itemTitle = escapeHtml(parsedItem.title);
        const itemBody = parsedItem.body ? markdownRenderer.parseInline(parsedItem.body) : '';
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
    const cardsHtml = getInterpolationExamples(locale)
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
        <div class="interp-title">${isEnglish ? 'Graphical interpolation examples' : 'Ejemplos gráficos de interpolación'}</div>
        <div class="interp-grid">${cardsHtml}</div>
      </div>
    `;
  }

  if (normalizedType === 'monitoring-example-fpot') {
    const example = getMonitoringFpotExample(locale);
    return `
      <div class="mon-example">
        <div class="mon-title">${isEnglish ? 'Visual example' : 'Ejemplo visual'} - ${isEnglish ? 'Monitoring' : 'Monitoreo'} ${isEnglish ? 'of' : 'de'} ${escapeHtml(example.metricName)}</div>
        <div class="mon-grid">
          <article class="mon-step">
            <div class="mon-step-kicker">${isEnglish ? 'Step' : 'Paso'} 1</div>
            <div class="mon-step-name">${isEnglish ? 'Monitoring' : 'Monitoreo'}</div>
            <ul>
              <li><strong>${isEnglish ? 'Name' : 'Nombre'}:</strong> ${escapeHtml(example.monitorName)}</li>
              <li><strong>${isEnglish ? 'Type' : 'Tipo'}:</strong> ${escapeHtml(example.monitorType)}</li>
              <li><strong>${isEnglish ? 'Window' : 'Ventana'}:</strong> ${escapeHtml(example.sampleWindow)}</li>
              <li><strong>${isEnglish ? 'Frequency' : 'Frecuencia'}:</strong> ${escapeHtml(example.sampleFrequency)}</li>
            </ul>
          </article>

          <article class="mon-step">
            <div class="mon-step-kicker">${isEnglish ? 'Step' : 'Paso'} 2</div>
            <div class="mon-step-name">${isEnglish ? 'Rule' : 'Regla'}</div>
            <ul>
              <li><strong>${isEnglish ? 'Name' : 'Nombre'}:</strong> ${escapeHtml(example.metricName)}</li>
              <li><strong>${isEnglish ? 'Method' : 'Método'}:</strong> ${isEnglish ? 'Lower than' : 'Menor que'}</li>
              <li><strong>${isEnglish ? 'Limit' : 'Límite'}:</strong> ${escapeHtml(example.thresholdValue)}</li>
              <li><strong>${isEnglish ? 'Threshold' : 'Umbral'}:</strong> ${escapeHtml(example.breachPercent)} ${isEnglish ? 'of points below limit' : 'de puntos bajo límite'}</li>
            </ul>
          </article>

          <article class="mon-step">
            <div class="mon-step-kicker">${isEnglish ? 'Step' : 'Paso'} 3</div>
            <div class="mon-step-name">${isEnglish ? 'Trigger' : 'Disparador'}</div>
            <ul>
              <li><strong>${isEnglish ? 'Type' : 'Tipo'}:</strong> ${isEnglish ? 'Communication' : 'Comunicación'}</li>
              <li><strong>${isEnglish ? 'State' : 'Estado'}:</strong> ${escapeHtml(example.triggerState)}</li>
              <li><strong>${isEnglish ? 'Pattern' : 'Patrón'}:</strong> ${isEnglish ? 'Operational schedule or full day' : 'Horario operativo o todo el día'}</li>
              <li><strong>${isEnglish ? 'Target' : 'Destino'}:</strong> ${isEnglish ? 'Responsible collaborators' : 'Colaboradores responsables'}</li>
            </ul>
          </article>
        </div>

        <div class="mon-chart-wrap">
          <div class="mon-chart-legend">
            <span class="legend-item"><span class="legend-dot normal"></span> ${isEnglish ? 'Value within limit' : 'Valor dentro de límite'}</span>
            <span class="legend-item"><span class="legend-dot breach"></span> ${isEnglish ? 'Value below 0.93' : 'Valor por debajo de 0.93'}</span>
            <span class="legend-item"><span class="legend-line"></span> ${isEnglish ? 'Evaluation every 5 min in a 10 min window' : 'Evaluacion cada 5 min en ventana de 10 min'}</span>
          </div>
          <div class="mon-chart">${example.svg}</div>
          <p class="mon-caption">
            ${
              isEnglish
                ? `If in the last 10 minutes at least 10% of points for <strong>${escapeHtml(example.metricName)}</strong> are below <strong>${escapeHtml(example.thresholdValue)}</strong>, monitoring changes to <strong>${escapeHtml(example.triggerState)}</strong> and triggers communication.`
                : `Si en los últimos 10 minutos al menos el 10% de los puntos de <strong>${escapeHtml(example.metricName)}</strong> cae por debajo de <strong>${escapeHtml(example.thresholdValue)}</strong>, el monitoreo pasa a estado <strong>${escapeHtml(example.triggerState)}</strong> y ejecuta comunicación.`
            }
          </p>
        </div>
      </div>
    `;
  }

  return markdownRenderer.parse(parsedBody);
}

function renderMarkdownWithBlocks(
  markdownText,
  locale = 'es',
  markdownRenderer = DEFAULT_MARKDOWN_RENDERER
) {
  const lines = markdownText.split('\n');
  const htmlParts = [];
  const markdownBuffer = [];
  let idx = 0;

  const flushMarkdownBuffer = () => {
    if (markdownBuffer.length === 0) {
      return;
    }
    htmlParts.push(markdownRenderer.parse(markdownBuffer.join('\n')));
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
    const blockHtml = renderDirective(
      type,
      args,
      blockLines.join('\n'),
      locale,
      markdownRenderer
    );
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

function parseNavEntry(label, value, groupName, docItems, docPathToSectionId, locale) {
  const displayLabel = translateLabel(label, locale);
  if (typeof value === 'string') {
    const sourceDocPath = normalizeDocPath(value);
    const docPath = resolveDocPathForLocale(sourceDocPath, locale);
    const sectionId = slugify(
      `${locale}-${sourceDocPath.replace(/\.md$/i, '').replace(/\/index$/i, '')}`
    );

    docItems.push({ group: groupName, label: displayLabel, docPath, sectionId });
    docPathToSectionId.set(docPath, sectionId);

    return { type: 'link', label: displayLabel, sectionId };
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
        docPathToSectionId,
        locale
      );
      if (parsedChild) {
        children.push(parsedChild);
      }
    }
  }

  if (children.length === 0) {
    return null;
  }

  return { type: 'group', label: displayLabel, children };
}

function parseNav(nav, locale) {
  const docItems = [];
  const docPathToSectionId = new Map();
  const sidebarGroups = [];
  const inicioGroupName = translateLabel('Inicio', locale);
  const inicioGroup = { groupName: inicioGroupName, entries: [] };

  for (const section of nav || []) {
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      continue;
    }

    for (const [sectionName, sectionValue] of Object.entries(section)) {
      const displaySectionName = translateLabel(sectionName, locale);
      if (typeof sectionValue === 'string') {
        const parsedEntry = parseNavEntry(
          sectionName,
          sectionValue,
          inicioGroupName,
          docItems,
          docPathToSectionId,
          locale
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
            displaySectionName,
            docItems,
            docPathToSectionId,
            locale
          );
          if (parsedEntry) {
            sectionEntries.push(parsedEntry);
          }
        }
      }

      if (sectionEntries.length > 0) {
        sidebarGroups.push({ groupName: displaySectionName, entries: sectionEntries });
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

async function buildLocaleShell(locale, nav) {
  const ui = UI_TEXT[locale];
  const { docItems, docPathToSectionId, sidebarGroups } = parseNav(nav, locale);
  const sectionsHtml = [];

  let heroTitle = locale === 'es' ? 'Manual de uso' : 'User manual';
  const heroEmphasis = 'Clickie';
  let heroDesc =
    locale === 'es'
      ? 'Guía completa para operar la plataforma: métricas, gemelos digitales, monitoreos, visor de datos, activos y configuración.'
      : 'Complete guide to operate the platform: metrics, digital twins, monitoring, data viewer, assets and configuration.';
  const heroSectionId = `${locale}-inicio`;

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

    if (docPath === resolveDocPathForLocale('index.md', locale)) {
      const h1 = parsed.content.match(/^#\s+(.+)$/m);
      if (h1?.[1]) {
        heroTitle = h1[1].trim();
      }
      const paragraph = extractHeroDescription(parsed.content);
      if (paragraph) {
        heroDesc = paragraph;
      }
    }

    const bodyNoH1 = normalizeMarkdownForRendering(removeFirstH1(parsed.content));
    const headingTargets = await buildHeadingTargets(docPath, bodyNoH1, sectionId);
    const markdownRenderer = createMarkdownRenderer(headingTargets);
    const bodyMarkdownHtml = renderMarkdownWithBlocks(bodyNoH1, locale, markdownRenderer);
    const bodyWithRewrittenLinks = rewriteInternalDocLinks(
      bodyMarkdownHtml,
      docPath,
      sectionId,
      docPathToSectionId
    );
    const bodyHtml = rewriteRelativeMediaSources(bodyWithRewrittenLinks, docPath);
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

  return `
<section class="manual-shell" data-lang="${locale}" ${locale === 'es' ? '' : 'hidden'}>
  <header class="topbar">
    <a class="sb-logo" href="#${heroSectionId}">
      <div class="sb-badge">C</div>
      <div>
        <div class="sb-title">Clickie</div>
        <div class="sb-sub">${escapeHtml(ui.topSubtitle)}</div>
      </div>
    </a>

    <form class="top-search-form" role="search" aria-label="${escapeHtml(ui.searchAria)}">
      <input class="top-search-input" type="search" placeholder="${escapeHtml(ui.searchPlaceholder)}" autocomplete="off" aria-label="${escapeHtml(ui.searchAria)}" />
      <button class="top-search-btn" type="submit">${escapeHtml(ui.searchButton)}</button>
      <div class="top-search-dropdown" hidden>
        <ul class="top-search-suggestions" role="listbox" aria-label="${escapeHtml(ui.searchSuggestions)}"></ul>
      </div>
    </form>

    <div class="topbar-controls">
      <label class="lang-label" for="lang-select-${locale}">${escapeHtml(ui.languageLabel)}</label>
      <select id="lang-select-${locale}" class="lang-select" aria-label="${escapeHtml(ui.languageLabel)}">
        <option value="es">${escapeHtml(ui.languageEs)}</option>
        <option value="en">${escapeHtml(ui.languageEn)}</option>
      </select>
      <div class="top-search-status" aria-live="polite"></div>
    </div>
  </header>

  <aside class="sidebar">
    <nav>${navHtml}
    </nav>
  </aside>

  <main class="main">
    <header class="hero" id="${heroSectionId}">
      <div class="hero-tag">${escapeHtml(ui.heroTag)}</div>
      <h1>${escapeHtml(heroTitle)}<br><em>${escapeHtml(heroEmphasis)}</em></h1>
      <p class="hero-desc">${escapeHtml(heroDesc)}</p>
      <div class="hero-version">${escapeHtml(ui.heroVersion)}</div>
    </header>

    <div class="content">${sectionsHtml.join('')}
    </div>
  </main>
</section>`;
}

async function build() {
  const mkdocsRaw = await fs.readFile(MKDOCS_CONFIG, 'utf-8');
  const mkdocsConfig = yaml.load(mkdocsRaw) || {};
  const nav = mkdocsConfig.nav || [];

  const [shellEs, shellEn] = await Promise.all([
    buildLocaleShell('es', nav),
    buildLocaleShell('en', nav),
  ]);

  const html = `<!-- Generated from /docs by scripts/generate_web_docs.mjs -->
${shellEs}
${shellEn}
`;

  await copyReferencedStaticAssets();
  await fs.writeFile(OUTPUT_FILE, html, 'utf-8');
  console.log(`Generated ${OUTPUT_FILE}`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
