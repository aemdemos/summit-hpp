/**
 * News Carousel block — horizontally scrolling card track with prev/next navigation.
 * @param {Element} block The news-carousel block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row = heading, last row = footer CTA, middle rows = cards
  const headingRow = rows[0];
  const footerRow = rows[rows.length - 1];
  const cardRows = rows.slice(1, rows.length - 1);

  // --- Heading ---
  const heading = headingRow.querySelector('h2');
  if (heading) {
    heading.classList.add('news-carousel-heading');
  }

  // --- Build card track ---
  const track = document.createElement('div');
  track.classList.add('news-carousel-track');

  cardRows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const card = document.createElement('div');
    card.classList.add('news-carousel-card');

    // Image
    const imageCol = cols[0];
    const picture = imageCol.querySelector('picture');
    if (picture) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('news-carousel-card-image');
      imageWrap.append(picture);
      card.append(imageWrap);
    }

    // Content: title + optional description + CTA
    const contentCol = cols[1];
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('news-carousel-card-content');

    const titleEl = contentCol.querySelector('h6, h5, h4, h3, h2');
    if (titleEl) {
      titleEl.classList.add('news-carousel-card-title');
      contentWrap.append(titleEl);
    }

    // Optional description paragraphs (not the CTA link paragraph)
    const paragraphs = [...contentCol.querySelectorAll('p')];
    const ctaParagraph = paragraphs.find((p) => p.querySelector('a'));
    paragraphs.forEach((p) => {
      if (p !== ctaParagraph) {
        p.classList.add('news-carousel-card-description');
        contentWrap.append(p);
      }
    });

    // CTA link
    if (ctaParagraph) {
      const ctaLink = ctaParagraph.querySelector('a');
      if (ctaLink) {
        ctaLink.classList.add('news-carousel-card-cta');
        const ctaWrap = document.createElement('p');
        ctaWrap.classList.add('news-carousel-card-cta-wrap');
        ctaWrap.append(ctaLink);
        contentWrap.append(ctaWrap);
      }
    }

    card.append(contentWrap);
    track.append(card);
    row.remove();
  });

  // --- Track wrapper (for gradient overlays) ---
  const trackWrapper = document.createElement('div');
  trackWrapper.classList.add('news-carousel-track-wrapper');
  trackWrapper.append(track);

  // --- Navigation buttons ---
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('news-carousel-btn', 'news-carousel-btn-prev');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.type = 'button';

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('news-carousel-btn', 'news-carousel-btn-next');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.type = 'button';

  // --- Footer CTA ---
  const footerLink = footerRow.querySelector('a');

  // --- Control bar: nav buttons (left) + explore link (right) ---
  const controlBar = document.createElement('div');
  controlBar.classList.add('news-carousel-controls');

  const navContainer = document.createElement('div');
  navContainer.classList.add('news-carousel-nav');
  navContainer.append(prevBtn, nextBtn);
  controlBar.append(navContainer);

  if (footerLink) {
    footerLink.classList.add('news-carousel-explore');
    controlBar.append(footerLink);
  }

  // --- Assemble ---
  headingRow.remove();
  footerRow.remove();

  block.append(trackWrapper);
  block.append(controlBar);

  // Reinsert heading at top
  if (heading) {
    block.prepend(heading);
  }

  // --- Scroll behaviour with gradient state ---
  function updateButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const atStart = scrollLeft <= 1;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;

    // Update gradient visibility
    trackWrapper.classList.toggle('at-start', atStart);
    trackWrapper.classList.toggle('at-end', atEnd);
  }

  function scrollByCard(direction) {
    const card = track.querySelector('.news-carousel-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const scrollAmount = (card.offsetWidth + gap) * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));
  track.addEventListener('scroll', updateButtons, { passive: true });

  // Defer initial button state until layout is complete
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateButtons();
    });
  });
}
