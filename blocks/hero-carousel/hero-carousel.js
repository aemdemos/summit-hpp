/**
 * Hero Carousel Block — matches HPE source structure exactly.
 *
 * Source layout per slide:
 *   slide (position:relative, display:flex, flex-direction:row, overflow:hidden)
 *     img  (position:absolute, inset:0, object-fit:cover — fills entire slide)
 *     .content (position:relative, z-index:1, flex child — text sits on left)
 *
 * Nav arrows sit at bottom-left INSIDE the carousel (position:absolute).
 *
 * @param {Element} block The hero-carousel block element
 */
export default async function decorate(block) {
  const slides = [...block.children];
  if (slides.length === 0) return;

  // Wrap all slides in a slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'hero-carousel-slides';

  slides.forEach((slide, i) => {
    const [imageCell, contentCell] = [...slide.children];

    slide.classList.add('hero-carousel-slide');
    if (i === 0) slide.classList.add('active');

    // Image: pull img out of its cell, make it a direct child of slide
    // so it can be position:absolute covering the entire slide
    if (imageCell) {
      const img = imageCell.querySelector('img');
      if (img) {
        img.classList.add('hero-carousel-bg-img');
        img.loading = i === 0 ? 'eager' : 'lazy';
        slide.prepend(img);
      }
      imageCell.remove();
    }

    // Content: becomes the flex child with text
    if (contentCell) {
      contentCell.classList.add('hero-carousel-content');

      // Style CTA links as pill buttons with arrow
      contentCell.querySelectorAll('a').forEach((a) => {
        const p = a.closest('p');
        if (p) {
          a.classList.add('button');
          p.classList.add('hero-carousel-cta');
          // Add arrow span matching source structure
          const arrow = document.createElement('span');
          arrow.className = 'hero-carousel-arrow';
          a.append(arrow);
        }
      });
    }

    slidesContainer.append(slide);
  });

  block.textContent = '';
  block.append(slidesContainer);

  // Only add carousel controls if there are multiple slides
  if (slides.length <= 1) return;

  let current = 0;
  let autoplayTimer = null;

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 6000);
  }

  // Navigation arrows — bottom-left inside the carousel (position:absolute)
  const nav = document.createElement('div');
  nav.className = 'hero-carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'hero-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'hero-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  nav.append(prevBtn, nextBtn);
  block.append(nav);

  startAutoplay();
}
