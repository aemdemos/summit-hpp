import { getBlockId } from '../../scripts/scripts.js';

/**
 * Create an image tile for the scrollable grid.
 * @param {Element} imgEl — a <p> containing <picture>/<img>, or <picture> directly
 * @param {string} extraClass — optional extra CSS class
 * @returns {HTMLElement}
 */
function createImageTile(imgEl, extraClass = '') {
  const tile = document.createElement('div');
  tile.className = `customer-stories-tile customer-stories-tile-img ${extraClass}`.trim();
  if (imgEl.tagName === 'PICTURE' || imgEl.tagName === 'IMG') {
    tile.append(imgEl);
  } else {
    const pic = imgEl.querySelector('picture') || imgEl.querySelector('img');
    if (pic) tile.append(pic);
  }
  return tile;
}

/**
 * Create a text tile for the scrollable grid.
 * @param {string} className
 * @param {Element[]} elements — heading, paragraphs, lists to put inside
 * @returns {HTMLElement}
 */
function createTextTile(className, elements) {
  const tile = document.createElement('div');
  tile.className = `customer-stories-tile ${className}`;
  elements.forEach((el) => tile.append(el));
  return tile;
}

/**
 * Build a rich panel with horizontally scrollable bento grid (KDDI-style).
 * Images are extracted from sections and placed as separate sibling tiles,
 * matching the original's 11-tile alternating text/image pattern.
 *
 * Row 1: [Intro-text] [Intro-img] [Objectives-text] [Objectives-img] [Outcomes-text]
 * Row 2: [Logo-img] [Quote-text] [Quote-img] [Solution-text] [Solution-img]
 *
 * @param {HTMLElement} panel
 * @param {Array<Element>} children
 */
function buildRichPanel(panel, children) {
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

  const introSection = sections.find((s) => s.heading?.tagName === 'H3'
    && !['Objectives', 'Outcomes', 'Solution'].includes(s.heading.textContent.trim()));
  const objectivesSection = sections.find((s) => s.heading?.textContent.trim() === 'Objectives');
  const outcomesSection = sections.find((s) => s.heading?.textContent.trim() === 'Outcomes');
  const quoteSection = sections.find((s) => s.heading?.tagName === 'H4');
  const solutionSection = sections.find((s) => s.heading?.textContent.trim() === 'Solution');

  // Helper: separate images from text elements in a section
  const splitImages = (sec) => {
    if (!sec) return { textEls: [], imgEls: [] };
    const allEls = [sec.heading, ...sec.elements].filter(Boolean);
    const textEls = [];
    const imgEls = [];
    allEls.forEach((el) => {
      const hasPicture = el.querySelector?.('picture') || el.querySelector?.('img:not([class])');
      const isPicture = el.tagName === 'PICTURE' || el.tagName === 'IMG';
      if ((hasPicture || isPicture) && !el.querySelector?.('h3, h4, ul, strong')) {
        imgEls.push(el);
      } else {
        textEls.push(el);
      }
    });
    return { textEls, imgEls };
  };

  // Split each section into text and images
  const intro = splitImages(introSection);
  const preIntro = sections.find((s) => s.isIntro);
  if (preIntro) {
    preIntro.elements.forEach((el) => {
      const hasImg = el.querySelector?.('picture') || el.querySelector?.('img');
      if (!hasImg) intro.textEls.push(el);
    });
  }
  const objectives = splitImages(objectivesSection);
  const outcomes = splitImages(outcomesSection);
  const quote = splitImages(quoteSection);
  const solution = splitImages(solutionSection);

  // Build the flat grid with alternating text/image tiles
  // Row 1: intro-text, intro-img, objectives-text, objectives-img, outcomes-text
  const introText = createTextTile('customer-stories-intro', intro.textEls);
  panel.append(introText);

  if (intro.imgEls.length > 0) {
    panel.append(createImageTile(intro.imgEls[0], 'customer-stories-tile-wide'));
  }

  const objText = createTextTile('customer-stories-objectives', objectives.textEls);
  panel.append(objText);

  if (objectives.imgEls.length > 0) {
    panel.append(createImageTile(objectives.imgEls[0], 'customer-stories-tile-wide'));
  }

  const outText = createTextTile('customer-stories-outcomes', outcomes.textEls);
  panel.append(outText);

  // Row 2: logo-img (from outcomes), quote-text, quote-img, solution-text, solution-img
  if (outcomes.imgEls.length > 0) {
    panel.append(createImageTile(outcomes.imgEls[0], 'customer-stories-tile-logo'));
  }

  const quoteText = createTextTile('customer-stories-quote', quote.textEls);
  panel.append(quoteText);

  if (quote.imgEls.length > 0) {
    panel.append(createImageTile(quote.imgEls[0]));
  }

  const solText = createTextTile('customer-stories-solution', solution.textEls);
  panel.append(solText);

  if (solution.imgEls.length > 0) {
    panel.append(createImageTile(solution.imgEls[0], 'customer-stories-tile-wide'));
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
 * Wraps content in a panel div with proper ARIA.
 */
function buildPanel(blockId, index, content) {
  const panel = document.createElement('div');
  panel.className = 'customer-stories-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.id = `panel-${blockId}-${index}`;
  panel.setAttribute('aria-labelledby', `tab-${blockId}-${index}`);
  panel.setAttribute('aria-hidden', String(index !== 0));

  const contentChildren = [...content.children];
  const headings3 = content.querySelectorAll('h3');
  const hasQuote = content.querySelector('h4');
  const hasLists = content.querySelectorAll('ul');
  const isRich = headings3.length >= 3 && hasQuote && hasLists.length >= 1;

  if (isRich) {
    buildRichPanel(panel, contentChildren);
  } else {
    buildSimplePanel(panel, contentChildren);
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

  const tablist = buildTabList(blockId, stories);

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

    tablist.querySelectorAll('button.customer-stories-tab').forEach((tab) => {
      tab.setAttribute('aria-selected', 'false');
    });
    panelsContainer.querySelectorAll('.customer-stories-panel').forEach((p) => {
      p.setAttribute('aria-hidden', 'true');
    });

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

  // Override dark section context
  const section = block.closest('.section');
  if (section) {
    section.classList.add('customer-stories-light');
  }
}
