import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';

/**
 * Card Carousel block — bento grid layout matching original HPE "bentoBox".
 *
 * Original uses a CSS Grid with 5 cards in a 2-column bento arrangement,
 * background images, dark text on transparent bg, and prev/next navigation
 * that shifts between grid "pages."
 *
 * Content structure (each row = one card):
 *   col 0: <picture> (background image)
 *   col 1: <h4>, <p> description, <p><a> CTA
 *
 * @param {Element} block The card-carousel block element
 */
export default function decorate(block) {
  const blockId = getBlockId('card-carousel');
  block.setAttribute('id', blockId);

  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.classList.add('card-carousel-grid');

  rows.forEach((row, idx) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.classList.add('card-carousel-card');
    card.dataset.cardIndex = idx;
    moveInstrumentation(row, card);

    // Background image — absolute positioned within card
    const imageCol = cols[0];
    if (imageCol) {
      const picture = imageCol.querySelector('picture');
      if (picture) {
        const bgWrap = document.createElement('div');
        bgWrap.classList.add('card-carousel-card-bg');
        bgWrap.append(picture);
        card.append(bgWrap);
      }
    }

    // Content overlay
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
          ctaLink.classList.remove('button', 'primary', 'secondary');
          ctaLink.classList.add('card-carousel-card-cta');
          const ctaWrap = document.createElement('p');
          ctaWrap.classList.add('card-carousel-card-cta-wrap');
          ctaWrap.append(ctaLink);
          content.append(ctaWrap);
        }
      }

      card.append(content);
    }

    grid.append(card);
    row.remove();
  });

  // Optimize images
  grid.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(grid);
}
