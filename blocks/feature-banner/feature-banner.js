/**
 * Decorates the feature-banner block.
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
}
