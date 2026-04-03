import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Builds the top bar section with logo, action links, social icons
 * @param {Element} section The raw section element
 * @returns {Element} The decorated top bar
 */
function buildTopBar(section) {
  const topBar = document.createElement('div');
  topBar.className = 'footer-top-bar';

  // Logo
  const logoP = section.querySelector('p:has(a img)');
  if (logoP) {
    const logoLink = logoP.querySelector('a');
    const logoDiv = document.createElement('div');
    logoDiv.className = 'footer-logo';
    logoDiv.append(logoLink);
    topBar.append(logoDiv);
  }

  const lists = section.querySelectorAll('ul');
  const paragraphs = [...section.querySelectorAll('p')];

  // Action links (first ul)
  if (lists.length > 0) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'footer-actions';
    const actionList = lists[0];
    [...actionList.children].forEach((li) => {
      const link = li.querySelector('a');
      if (link) {
        const isButton = li.querySelector('strong');
        if (isButton) {
          link.className = 'footer-action-button';
        } else {
          link.className = 'footer-action-link';
        }
        actionsDiv.append(link);
      }
    });
    topBar.append(actionsDiv);
  }

  // Animation & motion toggle
  const motionDiv = document.createElement('div');
  motionDiv.className = 'footer-motion';
  const motionLabel = document.createElement('span');
  motionLabel.className = 'footer-motion-label';
  motionLabel.textContent = 'Animation & motion';
  motionDiv.append(motionLabel);

  const motionToggle = document.createElement('div');
  motionToggle.className = 'footer-motion-toggle';
  const offLabel = document.createElement('span');
  offLabel.textContent = 'Off';
  offLabel.className = 'footer-motion-off';
  const onLabel = document.createElement('span');
  onLabel.textContent = 'On';
  onLabel.className = 'footer-motion-on';
  const switchEl = document.createElement('button');
  switchEl.className = 'footer-motion-switch';
  switchEl.setAttribute('role', 'switch');
  switchEl.setAttribute('aria-checked', 'true');
  switchEl.setAttribute('aria-label', 'Animation & motion');
  switchEl.addEventListener('click', () => {
    const checked = switchEl.getAttribute('aria-checked') === 'true';
    switchEl.setAttribute('aria-checked', checked ? 'false' : 'true');
    document.documentElement.classList.toggle('reduce-motion', checked);
  });
  motionToggle.append(offLabel, switchEl, onLabel);
  motionDiv.append(motionToggle);
  topBar.append(motionDiv);

  // Social icons (second ul)
  if (lists.length > 1) {
    const socialDiv = document.createElement('div');
    socialDiv.className = 'footer-social';

    // Find the "Follow HPE on" text
    const followText = paragraphs.find((p) => p.textContent.trim().startsWith('Follow'));
    if (followText) {
      const label = document.createElement('span');
      label.className = 'footer-social-label';
      label.textContent = followText.textContent.trim();
      socialDiv.append(label);
    }

    const socialList = document.createElement('div');
    socialList.className = 'footer-social-icons';
    [...lists[1].children].forEach((li) => {
      const link = li.querySelector('a');
      if (link) {
        link.className = 'footer-social-link';
        socialList.append(link);
      }
    });
    socialDiv.append(socialList);
    topBar.append(socialDiv);
  }

  return topBar;
}

/**
 * Builds the nav columns section
 * @param {Element} section The raw section element
 * @returns {Element} The decorated nav columns
 */
function buildNavColumns(section) {
  const navColumns = document.createElement('div');
  navColumns.className = 'footer-nav';

  const headings = section.querySelectorAll('h3');
  headings.forEach((heading) => {
    const column = document.createElement('div');
    column.className = 'footer-nav-column';

    // Column heading
    const title = document.createElement('h4');
    title.className = 'footer-nav-title';
    title.textContent = heading.textContent;

    // Accordion button for mobile
    const toggle = document.createElement('button');
    toggle.className = 'footer-nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', heading.textContent);
    toggle.append(title);

    const arrow = document.createElement('span');
    arrow.className = 'footer-nav-arrow';
    toggle.append(arrow);

    column.append(toggle);

    // Links list
    const list = heading.nextElementSibling;
    if (list && list.tagName === 'UL') {
      list.className = 'footer-nav-list';
      list.setAttribute('role', 'list');
      column.append(list);
    }

    // Mobile accordion toggle
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      // Close all other columns
      navColumns.querySelectorAll('.footer-nav-toggle').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
      });
      if (!expanded) {
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    navColumns.append(column);
  });

  return navColumns;
}

/**
 * Builds the copyright bar section
 * @param {Element} section The raw section element
 * @returns {Element} The decorated copyright bar
 */
function buildCopyrightBar(section) {
  const copyrightBar = document.createElement('div');
  copyrightBar.className = 'footer-copyright';

  const paragraphs = section.querySelectorAll('p');
  const list = section.querySelector('ul');

  // Copyright text
  if (paragraphs.length > 0) {
    const copyText = document.createElement('p');
    copyText.className = 'footer-copyright-text';
    copyText.textContent = paragraphs[0].textContent;
    copyrightBar.append(copyText);
  }

  // Legal links
  if (list) {
    const legalNav = document.createElement('nav');
    legalNav.className = 'footer-legal';
    legalNav.setAttribute('aria-label', 'Legal');
    const legalList = document.createElement('ul');
    legalList.className = 'footer-legal-list';
    [...list.children].forEach((li) => {
      const link = li.querySelector('a');
      if (link) {
        const legalItem = document.createElement('li');
        legalItem.append(link);
        legalList.append(legalItem);
      }
    });
    legalNav.append(legalList);
    copyrightBar.append(legalNav);
  }

  // Language selector
  if (paragraphs.length > 1) {
    const langLink = paragraphs[paragraphs.length - 1].querySelector('a');
    if (langLink) {
      const langDiv = document.createElement('div');
      langDiv.className = 'footer-language';
      langLink.className = 'footer-language-link';
      langDiv.append(langLink);
      copyrightBar.append(langDiv);
    }
  }

  return copyrightBar;
}

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  if (!fragment) return;

  const footer = document.createElement('div');

  // Get sections from fragment
  const sections = fragment.querySelectorAll(':scope .section');
  const sectionElements = sections.length > 0
    ? [...sections]
    : [...fragment.querySelectorAll(':scope > div > div')];

  if (sectionElements.length >= 1) {
    footer.append(buildTopBar(sectionElements[0]));
  }

  if (sectionElements.length >= 2) {
    footer.append(buildNavColumns(sectionElements[1]));
  }

  // Separator
  const hr = document.createElement('hr');
  hr.className = 'footer-separator';
  footer.append(hr);

  if (sectionElements.length >= 3) {
    footer.append(buildCopyrightBar(sectionElements[2]));
  }

  block.append(footer);
}
