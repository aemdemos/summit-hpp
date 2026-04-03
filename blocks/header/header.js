import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggles the mobile nav open/closed.
 * @param {Element} nav The nav element
 * @param {boolean|null} forceExpanded Force a specific state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * Closes mobile nav on Escape key.
 * @param {KeyboardEvent} e keyboard event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (nav && nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      toggleMenu(nav, false);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

/**
 * Loads and decorates the HPE header block.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  if (fragment) {
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  }

  // Classify nav sections: brand, sections (links)
  const classes = ['brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Clean up brand link — remove EDS button decoration
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      const btnParent = brandLink.closest('.button-container');
      if (btnParent) btnParent.className = '';
    }
  }

  // Clean up nav section links — remove EDS button decoration
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.button-container').forEach((bc) => {
      bc.classList.remove('button-container');
      const btn = bc.querySelector('.button');
      if (btn) btn.classList.remove('button');
    });

    // Convert nav links to dropdown buttons (except Services which is a direct link)
    const navList = navSections.querySelector('ul');
    if (navList) {
      [...navList.children].forEach((li) => {
        const link = li.querySelector('a');
        if (!link) return;
        const text = link.textContent.trim();
        const hasDropdown = ['GreenLake', 'Solutions', 'Products', 'Support', 'Company'].includes(text);
        if (hasDropdown) {
          const dropBtn = document.createElement('button');
          dropBtn.type = 'button';
          dropBtn.className = 'nav-drop-toggle';
          dropBtn.textContent = text;
          dropBtn.setAttribute('aria-expanded', 'false');
          dropBtn.setAttribute('aria-haspopup', 'true');

          const dropPanel = document.createElement('div');
          dropPanel.className = 'nav-drop-panel';
          dropPanel.setAttribute('role', 'menu');
          dropPanel.hidden = true;
          const panelMsg = document.createElement('p');
          panelMsg.className = 'nav-drop-placeholder';
          panelMsg.textContent = `${text} menu`;
          dropPanel.append(panelMsg);

          dropBtn.addEventListener('click', () => {
            const expanded = dropBtn.getAttribute('aria-expanded') === 'true';
            // Close all other dropdowns
            navList.querySelectorAll('.nav-drop-toggle').forEach((b) => {
              b.setAttribute('aria-expanded', 'false');
              const panel = b.nextElementSibling;
              if (panel) panel.hidden = true;
            });
            if (!expanded) {
              dropBtn.setAttribute('aria-expanded', 'true');
              dropPanel.hidden = false;
            }
          });

          link.replaceWith(dropBtn);
          li.append(dropPanel);
        }
      });

      // Close dropdowns on click outside
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
          navList.querySelectorAll('.nav-drop-toggle').forEach((b) => {
            b.setAttribute('aria-expanded', 'false');
            const panel = b.nextElementSibling;
            if (panel) panel.hidden = true;
          });
        }
      });
    }
  }

  // Build utility nav (search + language)
  const navTools = document.createElement('div');
  navTools.classList.add('nav-tools');

  // Search button
  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'nav-tools-search';
  searchBtn.setAttribute('aria-label', 'Search');
  const searchIcon = document.createElement('span');
  searchIcon.className = 'icon icon-search';
  searchBtn.append(searchIcon);
  navTools.append(searchBtn);

  // Language selector
  const langLink = document.createElement('a');
  langLink.href = '/us/en/home.html';
  langLink.className = 'nav-tools-lang';
  langLink.textContent = 'EN';
  langLink.setAttribute('aria-label', 'Select language');
  navTools.append(langLink);

  nav.append(navTools);

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.type = 'button';
  hamburgerBtn.setAttribute('aria-controls', 'nav');
  hamburgerBtn.setAttribute('aria-label', 'Open navigation');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.className = 'nav-hamburger-icon';
  hamburgerBtn.append(hamburgerIcon);
  hamburger.append(hamburgerBtn);
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);

  // Set initial state
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));
  window.addEventListener('keydown', closeOnEscape);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
