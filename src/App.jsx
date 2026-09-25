import { useEffect, useRef } from 'react';
import manualHtml from './manual.generated.html?raw';
const normalize = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const escape = (value = '') => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);
const languageKey = 'clickie_manual_lang';
function App() {
  const containerRef = useRef(null);
  useEffect(() => {
    const root = containerRef.current;
    const shells = [...root.querySelectorAll('.manual-shell')];
    let lang = 'es';
    let cleanup = () => {};
    const readHash = () => {
      try {
        return decodeURIComponent(location.hash.slice(1));
      } catch {
        return '';
      }
    };
    const storage = value => {
      try {
        if (value) localStorage.setItem(languageKey, value);else return localStorage.getItem(languageKey);
      } catch {
        return null;
      }
    };
    function activate(nextLang, preserveArticle = false) {
      const previousShell = shells.find(shell => !shell.hidden);
      const previousId = previousShell?.querySelector('.section:not([hidden])')?.id;
      cleanup();
      lang = nextLang === 'en' ? 'en' : 'es';
      shells.forEach(shell => {
        shell.hidden = shell.dataset.lang !== lang;
      });
      root.querySelectorAll('.lang-select').forEach(select => {
        select.value = lang;
      });
      document.documentElement.lang = lang;
      const shell = shells.find(item => item.dataset.lang === lang);
      const sections = [...shell.querySelectorAll('.section')];
      const navLinks = [...shell.querySelectorAll('.sidebar a[href^="#"]')];
      const toc = shell.querySelector('.article-toc');
      const pagination = shell.querySelector('.article-pagination');
      const menuButton = shell.querySelector('.contents-toggle');
      const backdrop = shell.querySelector('.sidebar-backdrop');
      const searchForm = shell.querySelector('.top-search-form');
      const input = shell.querySelector('.top-search-input');
      const dropdown = shell.querySelector('.top-search-dropdown');
      const suggestions = shell.querySelector('.top-search-suggestions');
      const status = shell.querySelector('.top-search-status');
      const dialog = shell.querySelector('.screen-dialog');
      let zoomTrigger = null;
      let results = [];
      let selectedResult = -1;
      let currentSection = null;
      const entries = sections.map(node => ({
        node,
        title: node.querySelector('h1').textContent,
        group: node.dataset.group,
        headings: normalize([...node.querySelectorAll('h2,h3')].map(heading => heading.textContent).join(' ')),
        text: normalize(node.textContent)
      }));
      const menu = open => {
        shell.classList.toggle('menu-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        backdrop.hidden = !open;
      };
      const hideResults = () => {
        dropdown.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        selectedResult = -1;
      };
      const navigate = id => {
        if (readHash() === id) renderRoute(true);else location.hash = id;
      };
      const expandParents = node => {
        for (let parent = node?.parentElement; parent && parent !== shell; parent = parent.parentElement) if (parent.classList.contains('nav-group-children')) {
          parent.hidden = false;
          const toggle = shell.querySelector(`[data-nav-toggle="${parent.id}"]`);
          toggle?.setAttribute('aria-expanded', 'true');
          toggle?.classList.add('is-open');
        }
      };
      function renderRoute(moveFocus = false) {
        let id = readHash();
        if (id === `${lang}-inicio`) id = `${lang}-index`;
        let target = id ? document.getElementById(id) : null;
        if (!target || !shell.contains(target)) target = shell.querySelector(`#${lang}-index`);
        const section = target?.closest('.section') || sections[0];
        const changed = section !== currentSection;
        currentSection = section;
        shell.querySelector('.skip-link').href = `#${section.id}`;
        sections.forEach(node => {
          node.hidden = node !== section;
        });
        navLinks.forEach(link => {
          const active = link.hash === `#${section.id}`;
          link.classList.toggle('active', active);
          if (active) {
            link.setAttribute('aria-current', 'page');
            expandParents(link);
          } else link.removeAttribute('aria-current');
        });
        document.title = `${section.querySelector('h1').textContent} · Clickie v4.2.4`;
        const headings = [...section.querySelectorAll('.prose h2[id],.prose h3[id]')];
        toc.innerHTML = headings.length ? `<div class="toc-title">${lang === 'es' ? 'En esta página' : 'On this page'}</div>` + headings.map(heading => `<a href="#${heading.id}" class="${heading.tagName === 'H3' ? 'toc-sub' : ''}">${escape(heading.textContent)}</a>`).join('') : '';
        const index = sections.indexOf(section);
        pagination.innerHTML = [sections[index - 1], sections[index + 1]].map((node, i) => node ? `<a href="#${node.id}"><small>${lang === 'es' ? i ? 'Siguiente' : 'Anterior' : i ? 'Next' : 'Previous'}</small>${escape(node.querySelector('h1').textContent)}</a>` : '<span></span>').join('');
        menu(false);
        hideResults();
        requestAnimationFrame(() => {
          if (target && target !== section && section.contains(target)) {
            target.scrollIntoView({
              block: 'start'
            });
          } else if (changed || moveFocus) {
            window.scrollTo({
              top: 0,
              behavior: 'instant'
            });
          }
          if (moveFocus) {
            section.querySelector('h1').focus({
              preventScroll: true
            });
          }
        });
      }
      function routeChanged() {
        const prefix = readHash().split('-')[0];
        if ((prefix === 'es' || prefix === 'en') && prefix !== lang) {
          activate(prefix);
          storage(prefix);
          return;
        }
        renderRoute(true);
      }
      function renderSearch() {
        const query = normalize(input.value.trim());
        if (query.length < 2) {
          results = [];
          hideResults();
          status.textContent = '';
          return;
        }
        const tokens = query.split(/\s+/);
        results = entries.map(entry => ({
          entry,
          score: (normalize(entry.title).includes(query) ? 100 : 0) + tokens.reduce((score, token) => score + (entry.headings.includes(token) ? 20 : 0), 0)
        })).filter(item => tokens.every(token => item.entry.text.includes(token))).sort((a, b) => b.score - a.score).slice(0, 7).map(item => item.entry);
        suggestions.innerHTML = results.map((entry, i) => `<li><button type="button" class="top-search-suggestion" data-result="${i}"><span class="suggestion-title">${escape(entry.title)}</span><span class="suggestion-meta">${escape(entry.group)}</span></button></li>`).join('');
        dropdown.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        selectedResult = -1;
        if (!results.length) suggestions.innerHTML = `<li class="search-empty">${lang === 'es' ? 'No se encontraron resultados.' : 'No results found.'}</li>`;
        status.textContent = results.length ? `${results.length} ${lang === 'es' ? 'resultados' : 'results'}` : lang === 'es' ? 'No se encontraron resultados.' : 'No results found.';
      }
      function submitSearch(event) {
        event.preventDefault();
        if (!input.value.trim()) {
          status.textContent = lang === 'es' ? 'Escribe una función o tarea.' : 'Enter a feature or task.';
          return;
        }
        const chosenIndex = selectedResult;
        renderSearch();
        const picked = results[Math.max(0, chosenIndex)];
        if (picked) {
          navigate(picked.node.id);
          hideResults();
        }
      }
      function keySearch(event) {
        if (event.key === 'Escape') {
          hideResults();
          return;
        }
        if (!results.length || dropdown.hidden) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          selectedResult = selectedResult < 0 ? event.key === 'ArrowDown' ? 0 : results.length - 1 : (selectedResult + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
          [...suggestions.querySelectorAll('button')].forEach((button, i) => button.classList.toggle('active', i === selectedResult));
        }
      }
      function click(event) {
        const toggle = event.target.closest('[data-nav-toggle]');
        if (toggle) {
          const group = shell.querySelector(`#${toggle.dataset.navToggle}`);
          const open = toggle.getAttribute('aria-expanded') !== 'true';
          toggle.setAttribute('aria-expanded', String(open));
          toggle.classList.toggle('is-open', open);
          group.hidden = !open;
          return;
        }
        if (event.target.closest('.contents-toggle')) {
          menu(!shell.classList.contains('menu-open'));
          return;
        }
        if (event.target.closest('.sidebar-backdrop')) {
          menu(false);
          menuButton.focus();
          return;
        }
        const result = event.target.closest('[data-result]');
        if (result) {
          navigate(results[Number(result.dataset.result)].node.id);
          return;
        }
        const marker = event.target.closest('.screen-marker');
        if (marker && !dialog.contains(marker)) {
          const figure = marker.closest('.annotated-screen');
          figure.querySelectorAll('[data-point]').forEach(node => node.classList.toggle('selected', node.dataset.point === marker.dataset.point));
          const item = figure.querySelector(`.screen-legend [data-point="${marker.dataset.point}"]`);
          item?.focus({
            preventScroll: true
          });
          item?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
          return;
        }
        const enlarge = event.target.closest('.screen-enlarge');
        if (enlarge) {
          zoomTrigger = enlarge;
          const figure = enlarge.closest('figure');
          dialog.querySelector('.screen-dialog-content').innerHTML = figure.querySelector('.screen-stage').outerHTML;
          dialog.querySelectorAll('.screen-marker').forEach(marker => {
            marker.tabIndex = -1;
            marker.setAttribute('aria-hidden', 'true');
          });
          dialog.showModal();
          return;
        }
        if (event.target.closest('.screen-close') || event.target === dialog) {
          dialog.close();
          return;
        }
        const link = event.target.closest('a[href^="#"]');
        if (link && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          navigate(link.hash.slice(1));
        }
      }
      function outside(event) {
        if (!searchForm.contains(event.target)) hideResults();
      }
      function escapeMenu(event) {
        if (event.key === 'Escape' && shell.classList.contains('menu-open')) {
          menu(false);
          menuButton.focus();
        }
      }
      function closed() {
        dialog.querySelector('.screen-dialog-content').innerHTML = '';
        zoomTrigger?.focus();
      }
      shell.addEventListener('click', click);
      input.addEventListener('input', renderSearch);
      input.addEventListener('keydown', keySearch);
      searchForm.addEventListener('submit', submitSearch);
      document.addEventListener('click', outside);
      document.addEventListener('keydown', escapeMenu);
      window.addEventListener('hashchange', routeChanged);
      dialog.addEventListener('close', closed);
      cleanup = () => {
        menu(false);
        if (dialog.open) dialog.close();
        shell.removeEventListener('click', click);
        input.removeEventListener('input', renderSearch);
        input.removeEventListener('keydown', keySearch);
        searchForm.removeEventListener('submit', submitSearch);
        document.removeEventListener('click', outside);
        document.removeEventListener('keydown', escapeMenu);
        window.removeEventListener('hashchange', routeChanged);
        dialog.removeEventListener('close', closed);
      };
      if (preserveArticle && previousId) {
        const nextId = previousId.replace(/^(es|en)-/, `${lang}-`);
        history.replaceState(null, '', `#${nextId}`);
      }
      renderRoute();
    }
    const changeLanguage = event => {
      if (event.target.matches('.lang-select')) {
        activate(event.target.value, true);
        storage(lang);
      }
    };
    root.addEventListener('change', changeLanguage);
    const prefix = readHash().split('-')[0];
    activate(['es', 'en'].includes(prefix) ? prefix : storage() || 'es');
    return () => {
      cleanup();
      root.removeEventListener('change', changeLanguage);
    };
  }, []);
  return <div ref={containerRef} className="manual-root" dangerouslySetInnerHTML={{
    __html: manualHtml
  }} />;
}
export default App;
