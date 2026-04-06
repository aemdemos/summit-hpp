/**
 * Hero Carousel Block
 * Full-bleed hero with background image, text overlay, and CTA.
 * Supports multiple slides with prev/next navigation and dot indicators.
 * @param {Element} block The hero-carousel block element
 */
export default async function decorate(block) {
  const slides = [...block.children];
  if (slides.length === 0) return;

  slides.forEach((slide, i) => {
    const [imageCell, contentCell] = [...slide.children];

    slide.classList.add('hero-carousel-slide');
    if (i === 0) slide.classList.add('active');

    if (imageCell) {
      imageCell.classList.add('hero-carousel-bg');
      const img = imageCell.querySelector('img');
      if (img) img.loading = i === 0 ? 'eager' : 'lazy';
    }

    if (contentCell) {
      contentCell.classList.add('hero-carousel-content');
      const inner = document.createElement('div');
      inner.classList.add('hero-carousel-content-inner');
      while (contentCell.firstChild) {
        inner.appendChild(contentCell.firstChild);
      }
      contentCell.appendChild(inner);

      inner.querySelectorAll('a').forEach((a) => {
        const p = a.closest('p');
        if (p) {
          a.classList.add('button');
          p.classList.add('hero-carousel-cta');
        }
      });
    }
  });

  // Only add carousel controls if there are multiple slides
  if (slides.length <= 1) return;

  let current = 0;
  let autoplayTimer = null;

  // Dot indicators (built first so goTo can reference them)
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'hero-carousel-dots';
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = `hero-carousel-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsWrap.append(dot);
    return dot;
  });

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 6000);
  }

  // Wire up dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  // Navigation arrows
  const nav = document.createElement('div');
  nav.className = 'hero-carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'hero-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'hero-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  nav.append(prevBtn, nextBtn);
  block.append(nav);
  block.append(dotsWrap);

  startAutoplay();
}
