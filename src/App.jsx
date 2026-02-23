import { useEffect, useRef } from 'react';
import manualHtml from './manual.generated.html?raw';

const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const tokenize = (value = '') => normalizeText(value).split(/\s+/).filter((token) => token.length > 1);

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) {
      return undefined;
    }

    const navItems = Array.from(root.querySelectorAll('.nav-item'));
    const sections = Array.from(root.querySelectorAll('[id]'));

    let observer;
    if ('IntersectionObserver' in window && navItems.length > 0 && sections.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const id = entry.target.id;
            navItems.forEach((item) => {
              const isActive = item.getAttribute('href') === `#${id}`;
              item.classList.toggle('active', isActive);
            });
          });
        },
        { threshold: 0.15, rootMargin: '-60px 0px -65% 0px' }
      );

      sections.forEach((section) => observer.observe(section));
    }

    const clickHandlers = navItems.map((item) => {
      const onClick = () => {
        navItems.forEach((navItem) => navItem.classList.remove('active'));
        item.classList.add('active');
      };

      item.addEventListener('click', onClick);
      return { item, onClick };
    });

    const searchForm = root.querySelector('.top-search-form');
    const searchInput = root.querySelector('.top-search-input');
    const searchStatus = root.querySelector('.top-search-status');
    const searchDropdown = root.querySelector('.top-search-dropdown');
    const suggestionsList = root.querySelector('.top-search-suggestions');

    const navById = new Map(
      navItems.map((item) => {
        const href = item.getAttribute('href') || '';
        const id = href.startsWith('#') ? href.slice(1) : href;
        return [id, (item.textContent || '').replace(/\s+/g, ' ').trim()];
      })
    );

    const indexedSections = Array.from(root.querySelectorAll('.hero[id], .section[id]')).map((node) => {
      const id = node.id;
      const title =
        (node.querySelector('h1, h2, h3')?.textContent || '').replace(/\s+/g, ' ').trim() ||
        navById.get(id) ||
        id;
      const subtitle = (node.querySelector('.sec-desc, .hero-desc')?.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
      const navLabel = navById.get(id) || '';
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();

      return {
        id,
        node,
        title,
        subtitle,
        navLabel,
        titleNorm: normalizeText(title),
        navNorm: normalizeText(navLabel),
        searchNorm: normalizeText([title, subtitle, navLabel, text].join(' ')),
      };
    });

    let currentSuggestions = [];
    let highlightedIndex = -1;

    const hideSuggestions = () => {
      currentSuggestions = [];
      if (searchDropdown) {
        searchDropdown.hidden = true;
      }
      if (suggestionsList) {
        suggestionsList.innerHTML = '';
      }
      highlightedIndex = -1;
    };

    const setStatus = (text) => {
      if (searchStatus) {
        searchStatus.textContent = text;
      }
    };

    const setHighlight = (nextIndex) => {
      highlightedIndex = nextIndex;
      const buttons = suggestionsList?.querySelectorAll('.top-search-suggestion') || [];
      buttons.forEach((button, index) => {
        button.classList.toggle('active', index === highlightedIndex);
      });
      if (highlightedIndex >= 0 && buttons[highlightedIndex]) {
        buttons[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    };

    const scoreEntry = (entry, rawQuery) => {
      const queryNorm = normalizeText(rawQuery);
      const tokens = tokenize(rawQuery);
      if (!queryNorm) {
        return 0;
      }

      let score = 0;
      if (entry.id === queryNorm) {
        score += 130;
      }
      if (entry.titleNorm === queryNorm) {
        score += 110;
      }
      if (entry.titleNorm.startsWith(queryNorm)) {
        score += 90;
      }
      if (entry.navNorm.startsWith(queryNorm)) {
        score += 70;
      }
      if (entry.searchNorm.includes(queryNorm)) {
        score += 45;
      }

      tokens.forEach((token) => {
        if (entry.titleNorm.includes(token)) {
          score += 24;
        } else if (entry.navNorm.includes(token)) {
          score += 16;
        } else if (entry.searchNorm.includes(token)) {
          score += 8;
        }
      });

      return score;
    };

    const getSuggestions = (rawQuery) =>
      indexedSections
        .map((entry) => ({ entry, score: scoreEntry(entry, rawQuery) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(({ entry }) => entry);

    const renderSuggestions = (items) => {
      currentSuggestions = items;

      if (!suggestionsList || !searchDropdown) {
        return;
      }

      if (items.length === 0) {
        hideSuggestions();
        return;
      }

      suggestionsList.innerHTML = items
        .map(
          (item, index) => `
            <li role="option" aria-selected="false">
              <button type="button" class="top-search-suggestion" data-index="${index}">
                <span class="suggestion-title">${escapeHtml(item.title)}</span>
                <span class="suggestion-meta">#${escapeHtml(item.id)}</span>
              </button>
            </li>
          `
        )
        .join('');

      searchDropdown.hidden = false;
      setHighlight(-1);
    };

    const goToSection = (entry) => {
      entry.node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (searchInput) {
        searchInput.value = entry.title;
      }
      setStatus(`Ir a: ${entry.title}`);
      hideSuggestions();
    };

    const runSearch = (event) => {
      event.preventDefault();
      const term = searchInput?.value?.trim() || '';

      if (!term) {
        setStatus('Escribe algo para buscar');
        return;
      }

      if (currentSuggestions.length === 0) {
        renderSuggestions(getSuggestions(term));
      }

      const picked = highlightedIndex >= 0 ? currentSuggestions[highlightedIndex] : currentSuggestions[0];
      if (picked) {
        goToSection(picked);
      } else {
        setStatus('Sin resultados para esa búsqueda');
      }
    };

    const onInput = () => {
      const term = searchInput?.value?.trim() || '';
      if (term.length < 2) {
        hideSuggestions();
        setStatus('');
        return;
      }

      const suggestions = getSuggestions(term);
      renderSuggestions(suggestions);
      if (suggestions.length === 0) {
        setStatus('Sin coincidencias');
      } else {
        setStatus(`${suggestions.length} sugerencias`);
      }
    };

    const onKeyDown = (event) => {
      if (currentSuggestions.length === 0) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = highlightedIndex + 1 >= currentSuggestions.length ? 0 : highlightedIndex + 1;
        setHighlight(next);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const next = highlightedIndex - 1 < 0 ? currentSuggestions.length - 1 : highlightedIndex - 1;
        setHighlight(next);
      } else if (event.key === 'Escape') {
        hideSuggestions();
      } else if (event.key === 'Enter' && highlightedIndex >= 0) {
        event.preventDefault();
        goToSection(currentSuggestions[highlightedIndex]);
      }
    };

    const onSuggestionsClick = (event) => {
      const target = event.target.closest('.top-search-suggestion');
      if (!target) {
        return;
      }
      const index = Number(target.getAttribute('data-index'));
      if (!Number.isNaN(index) && currentSuggestions[index]) {
        goToSection(currentSuggestions[index]);
      }
    };

    const onOutsideClick = (event) => {
      if (!searchForm?.contains(event.target)) {
        hideSuggestions();
      }
    };

    searchForm?.addEventListener('submit', runSearch);
    searchInput?.addEventListener('input', onInput);
    searchInput?.addEventListener('keydown', onKeyDown);
    searchInput?.addEventListener('focus', onInput);
    suggestionsList?.addEventListener('click', onSuggestionsClick);
    document.addEventListener('click', onOutsideClick);

    return () => {
      observer?.disconnect();
      clickHandlers.forEach(({ item, onClick }) => item.removeEventListener('click', onClick));
      searchForm?.removeEventListener('submit', runSearch);
      searchInput?.removeEventListener('input', onInput);
      searchInput?.removeEventListener('keydown', onKeyDown);
      searchInput?.removeEventListener('focus', onInput);
      suggestionsList?.removeEventListener('click', onSuggestionsClick);
      document.removeEventListener('click', onOutsideClick);
    };
  }, []);

  return <div ref={containerRef} className="manual-root" dangerouslySetInnerHTML={{ __html: manualHtml }} />;
}

export default App;
