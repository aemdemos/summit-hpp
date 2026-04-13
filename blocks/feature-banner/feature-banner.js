/**
 * Decorates the feature-banner block.
 * Two variants determined by heading level:
 *   h3 → light variant ("AI for every use case") — white bg, dark text
 *   h2 → dark variant ("HPE Services") — keeps dark-alt bg, white text, teal gradient
 * @param {Element} block The feature-banner block element
 */
export default async function decorate(block) {
  // Wrap all children in an inner container for max-width centering
  const inner = document.createElement('div');
  inner.className = 'feature-banner-inner';

  while (block.firstElementChild) {
    inner.append(block.firstElementChild);
  }

  block.append(inner);

  // Determine variant by heading level and add class to section
  // (CSS nested :has() is not supported — must use JS)
  const section = block.closest('.section');
  if (section) {
    if (block.querySelector('h3')) {
      section.classList.add('feature-banner-light');
    } else if (block.querySelector('h2')) {
      section.classList.add('feature-banner-dark');
    }
  }
}
