import { getBlockId } from '../../scripts/scripts.js';

/**
 * Build a rich panel with grid layout (KDDI-style).
 * @param {HTMLElement} panel
 * @param {Array<Element>} children
 */
function buildRichPanel(panel, children) {
  // Parse content into sections based on h3/h4 boundaries
  const sections = [];
  let current = null;

  children.forEach((child) => {
    const tag = child.tagName?.toLowerCase();
    if (tag === 'h3' || tag === 'h4') {
      if (current) sections.push(current);
      current = { heading: child, elements: [] };
    } else if (current) {
      current.elements.push(child);
    } else if (!sections.length || !sections[0].isIntro) {
      sections.push({ isIntro: true, heading: null, elements: [child] });
      current = null;
    } else {
      sections[0].elements.push(child);
    }
  });
  if (current) sections.push(current);

  // Find intro (first h3 + description before Objectives)
  const introSection = sections.find((s) => s.heading?.tagName === 'H3'
    && !['Objectives', 'Outcomes', 'Solution'].includes(s.heading.textContent.trim()));
  const objectivesSection = sections.find((s) => s.heading?.textContent.trim() === 'Objectives');
  const outcomesSection = sections.find((s) => s.heading?.textContent.trim() === 'Outcomes');
  const quoteSection = sections.find((s) => s.heading?.tagName === 'H4');
  const solutionSection = sections.find((s) => s.heading?.textContent.trim() === 'Solution');

  // Build grid
  const grid = document.createElement('div');
  grid.className = 'customer-stories-grid';

  // Story intro (left column, spans 2 rows on desktop)
  if (introSection) {
    const intro = document.createElement('div');
    intro.className = 'customer-stories-intro';
    intro.append(introSection.heading);
    introSection.elements.forEach((el) => intro.append(el));

    // Gather any pre-heading intro elements
    const preIntro = sections.find((s) => s.isIntro);
    if (preIntro) {
      preIntro.elements.forEach((el) => intro.append(el));
    }

    grid.append(intro);
  }

  // Objectives (right column, top)
  if (objectivesSection) {
    const obj = document.createElement('div');
    obj.className = 'customer-stories-objectives';
    obj.append(objectivesSection.heading);
    objectivesSection.elements.forEach((el) => obj.append(el));
    grid.append(obj);
  }

  // Outcomes (right column, bottom)
  if (outcomesSection) {
    const out = document.createElement('div');
    out.className = 'customer-stories-outcomes';
    out.append(outcomesSection.heading);
    outcomesSection.elements.forEach((el) => out.append(el));
    grid.append(out);
  }

  panel.append(grid);

  // Quote (full width)
  if (quoteSection) {
    const quote = document.createElement('div');
    quote.className = 'customer-stories-quote';
    quote.append(quoteSection.heading);
    quoteSection.elements.forEach((el) => quote.append(el));
    panel.append(quote);
  }

  // Solution (small panel)
  if (solutionSection) {
    const sol = document.createElement('div');
    sol.className = 'customer-stories-solution';
    sol.append(solutionSection.heading);
    solutionSection.elements.forEach((el) => sol.append(el));
    panel.append(sol);
  }
}

/**
 * Build a simple panel for non-KDDI stories.
 * @param {HTMLElement} panel
 * @param {Array<Element>} children
 */
function buildSimplePanel(panel, children) {
  const simple = document.createElement('div');
  simple.className = 'customer-stories-simple';
  children.forEach((child) => simple.append(child));
  panel.append(simple);
}

/**
 * Builds the tab bar from story labels.
 * @param {string} blockId
 * @param {Array<{label: string, content: Element}>} stories
 * @returns {HTMLElement}
 */
function buildTabList(blockId, stories) {
  const tablist = document.createElement('div');
  tablist.className = 'customer-stories-tablist';
  tablist.setAttribute('role', 'tablist');

  stories.forEach((story, i) => {
    const btn = document.createElement('button');
    btn.className = 'customer-stories-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('type', 'button');
    btn.id = `tab-${blockId}-${i}`;
    btn.setAttribute('aria-controls', `panel-${blockId}-${i}`);
    btn.setAttribute('aria-selected', String(i === 0));
    btn.textContent = story.label;
    tablist.append(btn);
  });

  return tablist;
}

/**
 * Wraps a content element in a panel div with proper ARIA.
 * @param {string} blockId
 * @param {number} index
 * @param {Element} content
 * @returns {HTMLElement}
 */
function buildPanel(blockId, index, content) {
  const panel = document.createElement('div');
  panel.className = 'customer-stories-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.id = `panel-${blockId}-${index}`;
  panel.setAttribute('aria-labelledby', `tab-${blockId}-${index}`);
  panel.setAttribute('aria-hidden', String(index !== 0));

  // Structure the panel content into a grid layout
  const children = [...content.children];

  // Detect if this is a rich panel (has multiple h3s, ul, h4 quote)
  const headings3 = content.querySelectorAll('h3');
  const hasQuote = content.querySelector('h4');
  const hasLists = content.querySelectorAll('ul');
  const isRich = headings3.length >= 3 && hasQuote && hasLists.length >= 1;

  if (isRich) {
    buildRichPanel(panel, children);
  } else {
    buildSimplePanel(panel, children);
  }

  return panel;
}

/**
 * Loads and decorates the customer-stories block.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const blockId = getBlockId('customer-stories');
  block.setAttribute('id', blockId);

  const rows = [...block.children];
  if (rows.length < 2) return;

  // Detect if row 0 is a header (has H2) or a story tab (has 2 cells with tab label)
  const firstRowHasHeader = rows[0].querySelector('h2');
  let header = null;
  const storyStartIndex = firstRowHasHeader ? 1 : 0;

  if (firstRowHasHeader) {
    const headerRow = rows[0];
    const headerContent = headerRow.querySelector(':scope > div');

    header = document.createElement('div');
    header.className = 'customer-stories-header';

    const headerText = document.createElement('div');
    headerText.className = 'customer-stories-header-text';

    const headerCta = document.createElement('div');
    headerCta.className = 'customer-stories-header-cta';

    if (headerContent) {
      [...headerContent.children].forEach((child) => {
        if (child.tagName === 'P' && child.querySelector('a')) {
          const link = child.querySelector('a');
          link.classList.add('button');
          headerCta.append(child);
        } else {
          headerText.append(child);
        }
      });
    }

    header.append(headerText);
    header.append(headerCta);
  }

  // Story rows (cell[0] = tab label, cell[1] = content)
  const stories = [];
  for (let i = storyStartIndex; i < rows.length; i += 1) {
    const cells = [...rows[i].children];
    if (cells.length >= 2) {
      stories.push({
        label: cells[0].textContent.trim(),
        content: cells[1],
      });
    }
  }

  // Build tab list
  const tablist = buildTabList(blockId, stories);

  // Build panels
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'customer-stories-panels';

  stories.forEach((story, i) => {
    const panel = buildPanel(blockId, i, story.content);
    panelsContainer.append(panel);
  });

  // Tab click handler
  tablist.addEventListener('click', (e) => {
    const btn = e.target.closest('button.customer-stories-tab');
    if (!btn || !tablist.contains(btn)) return;

    const panelId = btn.getAttribute('aria-controls');
    if (!panelId) return;

    const targetPanel = document.getElementById(panelId);
    if (!targetPanel) return;

    // Deselect all tabs and hide all panels
    tablist.querySelectorAll('button.customer-stories-tab').forEach((tab) => {
      tab.setAttribute('aria-selected', 'false');
    });
    panelsContainer.querySelectorAll('.customer-stories-panel').forEach((p) => {
      p.setAttribute('aria-hidden', 'true');
    });

    // Select clicked tab and show panel
    btn.setAttribute('aria-selected', 'true');
    targetPanel.setAttribute('aria-hidden', 'false');
  });

  // Keyboard navigation
  tablist.addEventListener('keydown', (e) => {
    const tabs = [...tablist.querySelectorAll('button.customer-stories-tab')];
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let newIndex = -1;
    if (e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    }

    if (newIndex !== -1) {
      e.preventDefault();
      tabs[newIndex].focus();
      tabs[newIndex].click();
    }
  });

  // Replace block content
  block.textContent = '';
  if (header) block.append(header);
  block.append(tablist);
  block.append(panelsContainer);

  // Override dark section context — original has transparent bg with dark text
  const section = block.closest('.section');
  if (section) {
    section.classList.add('customer-stories-light');
  }
}
