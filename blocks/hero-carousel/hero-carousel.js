/**
 * Hero Carousel Block — matches HPE source structure exactly.
 *
 * Source layout per slide:
 *   slide (position:relative, display:flex, flex-direction:row, overflow:hidden)
 *     picture/img (position:absolute, inset:0, object-fit:cover — fills entire slide)
 *     .content (position:relative, z-index:1, flex child — text sits on left)
 *
 * Nav arrows sit at bottom-left INSIDE the carousel (position:absolute).
 *
 * @param {Element} block The hero-carousel block element
 */

/**
 * Extracts the background image from its cell and prepends it to the slide.
 * @param {Element} slide The slide element
 * @param {Element} imageCell The cell containing the image
 * @param {boolean} eager Whether to load eagerly (first slide)
 */
function extractSlideImage(slide, imageCell, eager) {
  const picture = imageCell.querySelector('picture');
  const img = imageCell.querySelector('img');
  if (picture) {
    picture.classList.add('hero-carousel-bg-picture');
    if (img) {
      img.classList.add('hero-carousel-bg-img');
      img.loading = eager ? 'eager' : 'lazy';
    }
    slide.prepend(picture);
  } else if (img) {
    img.classList.add('hero-carousel-bg-img');
    img.loading = eager ? 'eager' : 'lazy';
    slide.prepend(img);
  }
  imageCell.remove();
}

/**
 * Decorates a single slide — extracts image, styles content, adds CTA arrows.
 * @param {Element} slide The slide row element
 * @param {number} index Slide index (0-based)
 */
function decorateSlide(slide, index) {
  const [imageCell, contentCell] = [...slide.children];

  slide.classList.add('hero-carousel-slide');
  if (index === 0) slide.classList.add('active');

  if (imageCell) extractSlideImage(slide, imageCell, index === 0);

  if (contentCell) {
    contentCell.classList.add('hero-carousel-content');
    contentCell.querySelectorAll('a').forEach((a) => {
      const p = a.closest('p');
      if (p) {
        a.classList.add('button');
        p.classList.add('hero-carousel-cta');
        const arrow = document.createElement('span');
        arrow.className = 'hero-carousel-arrow';
        a.append(arrow);
      }
    });
  }
}

export default async function decorate(block) {
  const slides = [...block.children];
  if (slides.length === 0) return;

  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'hero-carousel-slides';

  slides.forEach((slide, i) => {
    decorateSlide(slide, i);
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
