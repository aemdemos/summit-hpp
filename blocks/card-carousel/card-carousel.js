import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createSliderControls, initSlider, showSlide } from '../../scripts/slider.js';

/**
 * Card Carousel block — large cards with background images, gradient overlays,
 * white text, prev/next navigation, and dot indicators.
 *
 * Content structure (each row = one slide):
 *   col 0: <picture> (background image)
 *   col 1: <h4>, <p> description, <p><a> CTA
 *
 * @param {Element} block The card-carousel block element
 */
export default function decorate(block) {
  const blockId = getBlockId('card-carousel');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `carousel-${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.children];
  if (!rows.length) return;

  const isSingleSlide = rows.length < 2;

  const container = document.createElement('div');
  container.classList.add('card-carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('card-carousel-slides');
  slidesWrapper.setAttribute('tabindex', '0');
  slidesWrapper.setAttribute('aria-label', 'Card carousel slides');

  if (!isSingleSlide) {
    const { buttonsContainer } = createSliderControls(rows.length, {
      indicatorsAriaLabel: `Card Carousel Slide Controls for ${blockId}`,
    });
    container.append(buttonsContainer);
  }

  rows.forEach((row, idx) => {
    const cols = [...row.children];
    const slide = document.createElement('li');
    slide.classList.add('card-carousel-slide');
    slide.dataset.slideIndex = idx;
    moveInstrumentation(row, slide);

    // Background image
    const imageCol = cols[0];
    if (imageCol) {
      const picture = imageCol.querySelector('picture');
      if (picture) {
        const bgWrap = document.createElement('div');
        bgWrap.classList.add('card-carousel-card-bg');
        bgWrap.append(picture);
        slide.append(bgWrap);
      }
    }

    // Gradient overlay
    const overlay = document.createElement('div');
    overlay.classList.add('card-carousel-card-overlay');
    slide.append(overlay);

    // Content
    const contentCol = cols[1];
    if (contentCol) {
      const content = document.createElement('div');
      content.classList.add('card-carousel-card-content');

      const titleEl = contentCol.querySelector('h4, h3, h2, h5, h6');
      if (titleEl) {
        titleEl.classList.add('card-carousel-card-title');
        content.append(titleEl);
      }

      const paragraphs = [...contentCol.querySelectorAll('p')];
      const ctaParagraph = paragraphs.find((p) => p.querySelector('a'));
      paragraphs.forEach((p) => {
        if (p !== ctaParagraph && p.textContent.trim()) {
          p.classList.add('card-carousel-card-desc');
          content.append(p);
        }
      });

      if (ctaParagraph) {
        const ctaLink = ctaParagraph.querySelector('a');
        if (ctaLink) {
          ctaLink.classList.add('card-carousel-card-cta');
          const ctaWrap = document.createElement('p');
          ctaWrap.classList.add('card-carousel-card-cta-wrap');
          ctaWrap.append(ctaLink);
          content.append(ctaWrap);
        }
      }

      slide.append(content);
    }

    slidesWrapper.append(slide);
    row.remove();
  });

  // Optimize images
  slidesWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  container.append(slidesWrapper);
  block.prepend(container);

  const sliderOpts = {
    slidesContainer: '.card-carousel-slides',
    slideSelector: '.card-carousel-slide',
    indicatorsContainer: '.carousel-slide-indicators',
    indicatorItemSelector: '.carousel-slide-indicator',
    prevSelector: '.slide-prev',
    nextSelector: '.slide-next',
  };

  if (!isSingleSlide) {
    initSlider(block, sliderOpts);

    // Keyboard navigation
    slidesWrapper.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = parseInt(block.dataset.activeSlide, 10) || 0;
      const next = e.key === 'ArrowLeft' ? current - 1 : current + 1;
      showSlide(block, next, 'smooth', sliderOpts);
    });

    // Gradient edge masks — toggle based on scroll position
    function updateGradientMasks() {
      const { scrollLeft, scrollWidth, clientWidth } = slidesWrapper;
      const atStart = scrollLeft <= 2;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
      slidesWrapper.classList.toggle('at-start', atStart);
      slidesWrapper.classList.toggle('at-end', atEnd);
    }

    slidesWrapper.addEventListener('scroll', updateGradientMasks, { passive: true });
    updateGradientMasks();
  }
}
