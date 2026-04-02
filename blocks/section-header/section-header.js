/**
 * Section Header block — simple heading + description text.
 * Strips EDS auto-button styling from inline links so they render as plain text links.
 * @param {Element} block The section-header block element
 */
export default function decorate(block) {
  // Remove button classes from inline links so they stay as plain text links
  block.querySelectorAll('a.button').forEach((link) => {
    link.classList.remove('button', 'primary', 'secondary');
    const wrapper = link.closest('.button-container');
    if (wrapper) {
      // Unwrap: move children out and remove the button-container wrapper
      const parent = wrapper.parentElement;
      while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, wrapper);
      }
      wrapper.remove();
    }
  });
}
