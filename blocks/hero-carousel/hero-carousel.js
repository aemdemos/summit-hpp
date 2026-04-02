/**
 * Hero Carousel Block
 * Full-bleed hero with background image, text overlay, and CTA.
 * Supports multiple slides (single static slide for Summit demo).
 * @param {Element} block The hero-carousel block element
 */
export default async function decorate(block) {
  const slides = [...block.children];

  slides.forEach((slide) => {
    const [imageCell, contentCell] = [...slide.children];

    // Mark the slide
    slide.classList.add('hero-carousel-slide');

    // Set up image as background
    if (imageCell) {
      imageCell.classList.add('hero-carousel-bg');
      const img = imageCell.querySelector('img');
      if (img) {
        img.loading = 'eager';
      }
    }

    // Set up content overlay
    if (contentCell) {
      contentCell.classList.add('hero-carousel-content');

      // Wrap content in a constrained container
      const inner = document.createElement('div');
      inner.classList.add('hero-carousel-content-inner');
      while (contentCell.firstChild) {
        inner.appendChild(contentCell.firstChild);
      }
      contentCell.appendChild(inner);

      // Style CTA links as buttons
      inner.querySelectorAll('a').forEach((a) => {
        const p = a.closest('p');
        if (p) {
          a.classList.add('button');
          p.classList.add('hero-carousel-cta');
        }
      });
    }
  });
}
