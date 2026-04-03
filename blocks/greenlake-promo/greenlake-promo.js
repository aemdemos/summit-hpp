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
    const logoPicParent = leftPictures[0].parentElement;
    if (logoPicParent === leftCell) {
      leftCell.insertBefore(logoWrap, leftPictures[0]);
      logoWrap.appendChild(leftPictures[0]);
    } else {
      logoPicParent.replaceWith(logoWrap);
      logoWrap.appendChild(leftPictures[0]);
    }
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

    // Video lightbox
    playBtn.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'greenlake-promo-lightbox';
      overlay.innerHTML = `<div class="greenlake-promo-lightbox-content">
        <button class="greenlake-promo-lightbox-close" aria-label="Close video">&times;</button>
        <div class="greenlake-promo-lightbox-video">
          <video controls autoplay>
            <source src="https://www.hpe.com/content/dam/hpe/shared-publishing/video/greenlake-explainer.mp4" type="video/mp4">
          </video>
        </div>
      </div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.greenlake-promo-lightbox-close')) {
          const video = overlay.querySelector('video');
          if (video) video.pause();
          overlay.remove();
        }
      });
      document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
          const video = overlay.querySelector('video');
          if (video) video.pause();
          overlay.remove();
          document.removeEventListener('keydown', closeOnEsc);
        }
      });
    });

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

  // Collect elements before any DOM mutations
  const rightPicture = rightCell.querySelector('picture');
  const heading = rightCell.querySelector('h3');
  const ctaLink = rightCell.querySelector('a');
  const ctaWrap = ctaLink ? ctaLink.closest('p') : null;

  // Clear and rebuild the right panel
  rightCell.innerHTML = '';

  if (rightPicture) {
    const screenshotWrap = document.createElement('div');
    screenshotWrap.classList.add('greenlake-promo-screenshot');
    screenshotWrap.appendChild(rightPicture);
    rightCell.appendChild(screenshotWrap);
  }

  if (heading) {
    heading.classList.add('greenlake-promo-heading');
    rightCell.appendChild(heading);
  }

  if (ctaWrap) {
    ctaWrap.classList.add('greenlake-promo-cta');
    if (ctaLink) ctaLink.classList.add('button');
    rightCell.appendChild(ctaWrap);
  } else if (ctaLink) {
    ctaLink.classList.add('button');
    const p = document.createElement('p');
    p.classList.add('greenlake-promo-cta');
    p.appendChild(ctaLink);
    rightCell.appendChild(p);
  }
}
