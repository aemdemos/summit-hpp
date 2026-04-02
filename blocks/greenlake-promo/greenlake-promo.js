/**
 * Decorates the GreenLake Promo block.
 * Two-panel layout: left (dark) with logo + description + video thumbnail,
 * right (lighter) with screenshot + heading + CTA.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const row = rows[0];
  const cells = [...row.children];
  if (cells.length < 2) return;

  const [leftCell, rightCell] = cells;

  // --- Left Panel ---
  leftCell.classList.add('greenlake-promo-left');

  const leftPictures = leftCell.querySelectorAll('picture');
  const leftParagraphs = leftCell.querySelectorAll('p');

  // First picture is the logo
  if (leftPictures.length > 0) {
    const logoWrap = document.createElement('div');
    logoWrap.classList.add('greenlake-promo-logo');
    leftPictures[0].parentElement.replaceWith(logoWrap);
    logoWrap.appendChild(leftPictures[0]);
  }

  // Find the description paragraph (the one with substantial text, not just a picture)
  [...leftParagraphs].forEach((p) => {
    if (p.textContent.trim().length > 50 && !p.querySelector('picture')) {
      p.classList.add('greenlake-promo-description');
    }
  });

  // Second picture is the video thumbnail
  if (leftPictures.length > 1) {
    const thumbWrap = document.createElement('div');
    thumbWrap.classList.add('greenlake-promo-video');

    const thumbInner = document.createElement('div');
    thumbInner.classList.add('greenlake-promo-video-thumb');
    thumbInner.appendChild(leftPictures[1]);

    // Play button overlay
    const playBtn = document.createElement('button');
    playBtn.classList.add('greenlake-promo-play');
    playBtn.setAttribute('aria-label', 'Play video');
    const playIcon = document.createElement('span');
    playIcon.classList.add('greenlake-promo-play-icon');
    playBtn.appendChild(playIcon);
    thumbInner.appendChild(playBtn);

    thumbWrap.appendChild(thumbInner);

    // Video info text
    const videoInfo = document.createElement('div');
    videoInfo.classList.add('greenlake-promo-video-info');

    const videoTitle = document.createElement('p');
    videoTitle.classList.add('greenlake-promo-video-title');
    videoTitle.textContent = 'GreenLake explained';

    const videoSubtitle = document.createElement('p');
    videoSubtitle.classList.add('greenlake-promo-video-subtitle');
    videoSubtitle.textContent = 'Become hybrid by design with GreenLake';

    const videoDuration = document.createElement('span');
    videoDuration.classList.add('greenlake-promo-video-duration');
    videoDuration.textContent = '02:17';

    videoInfo.append(videoTitle, videoSubtitle, videoDuration);
    thumbWrap.appendChild(videoInfo);

    // Replace the parent of the second picture with our video card
    leftCell.appendChild(thumbWrap);
  }

  // --- Right Panel ---
  rightCell.classList.add('greenlake-promo-right');

  const rightPicture = rightCell.querySelector('picture');
  if (rightPicture) {
    const screenshotWrap = document.createElement('div');
    screenshotWrap.classList.add('greenlake-promo-screenshot');
    rightPicture.parentElement.replaceWith(screenshotWrap);
    screenshotWrap.appendChild(rightPicture);
  }

  const heading = rightCell.querySelector('h3');
  if (heading) {
    heading.classList.add('greenlake-promo-heading');
  }

  // CTA link -> button
  const ctaLink = rightCell.querySelector('a');
  if (ctaLink) {
    ctaLink.classList.add('button');
    const ctaWrap = ctaLink.closest('p');
    if (ctaWrap) {
      ctaWrap.classList.add('greenlake-promo-cta');
    }
  }
}
