/**
 * Solutions Grid block — displays solution tiles in a 5-column grid layout.
 *
 * Supports two content structures:
 *   1. Header inside block: Row 0 has H2 (legacy) — extracted as header above tiles
 *   2. Header outside block: All rows are tiles — header is section default content
 *
 * @param {Element} block The solutions-grid block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // --- Optional header row (first row with H2) ---
  let headerRow = null;
  if (rows[0].querySelector('h2')) {
    headerRow = rows.shift();
    headerRow.classList.add('solutions-grid-header');
  }

  // --- Tile rows ---
  const tilesGrid = document.createElement('div');
  tilesGrid.classList.add('solutions-grid-tiles');

  rows.forEach((row) => {
    const [imageCell, contentCell] = [...row.children];
    if (!imageCell || !contentCell) return;

    // Build tile element
    const tile = document.createElement('div');
    tile.classList.add('solutions-grid-tile');

    // Background image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      picture.classList.add('solutions-grid-tile-bg');
      tile.append(picture);
    }

    // Dark overlay
    const overlay = document.createElement('div');
    overlay.classList.add('solutions-grid-tile-overlay');
    tile.append(overlay);

    // Content layer
    const content = document.createElement('div');
    content.classList.add('solutions-grid-tile-content');

    // Move heading and paragraphs into content
    const heading = contentCell.querySelector('h3');
    const paragraphs = [...contentCell.querySelectorAll('p')];

    if (heading) content.append(heading);

    // Separate description paragraphs from CTA paragraph (last p with a link)
    paragraphs.forEach((p) => {
      const link = p.querySelector('a');
      if (link) {
        p.classList.add('solutions-grid-tile-cta');
        // Strip button class if auto-applied by EDS
        link.classList.remove('button', 'primary', 'secondary');
      }
      content.append(p);
    });

    tile.append(content);

    // Make entire tile clickable via the first link found
    const tileLink = content.querySelector('a');
    if (tileLink) {
      const wrapper = document.createElement('a');
      wrapper.href = tileLink.href;
      wrapper.classList.add('solutions-grid-tile-link');
      wrapper.setAttribute('aria-label', tileLink.textContent);
      wrapper.append(tile);
      tilesGrid.append(wrapper);
    } else {
      tilesGrid.append(tile);
    }
  });

  // Replace original rows with structured markup
  block.textContent = '';
  if (headerRow) block.append(headerRow);
  block.append(tilesGrid);
}
