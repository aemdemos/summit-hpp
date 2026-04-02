/**
 * Decorates the product-cards block.
 * Each row contains one card with an image cell and a content cell.
 * @param {Element} block The product-cards block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('product-card');

    const [imageCell, contentCell] = [...row.children];

    if (imageCell) {
      imageCell.classList.add('product-card-image');
      const img = imageCell.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'lazy');
      }
    }

    if (contentCell) {
      contentCell.classList.add('product-card-content');

      // Find the last paragraph containing a link — treat it as the CTA
      const paragraphs = [...contentCell.querySelectorAll('p')];
      const ctaParagraph = [...paragraphs].reverse().find((p) => p.querySelector('a') && !p.querySelector('picture'));

      if (ctaParagraph) {
        ctaParagraph.classList.add('product-card-cta');
        const ctaLink = ctaParagraph.querySelector('a');
        if (ctaLink) {
          ctaLink.classList.add('product-card-link');
        }
      }
    }
  });
}
