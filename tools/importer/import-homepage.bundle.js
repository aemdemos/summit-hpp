var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "HPE Homepage",
    urls: ["https://www.hpe.com/us/en/home.html"]
  };
  function createBlock(document, blockName, rows) {
    const cells = [[blockName], ...rows];
    return WebImporter.DOMUtils.createTable(cells, document);
  }
  function sectionBreak(document) {
    return document.createElement("hr");
  }
  function sectionMetadata(document, style) {
    return WebImporter.DOMUtils.createTable(
      [["Section Metadata"], ["style", style]],
      document
    );
  }
  function img(document, src, alt) {
    const el = document.createElement("img");
    el.src = src;
    el.alt = alt || "";
    return el;
  }
  function link(document, href, text) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  }
  function p(document, ...children) {
    const el = document.createElement("p");
    children.forEach((c) => {
      if (typeof c === "string") el.append(c);
      else el.append(c);
    });
    return el;
  }
  function h(document, level, text) {
    const el = document.createElement(`h${level}`);
    el.textContent = text;
    return el;
  }
  function frag(document, ...nodes) {
    const d = document.createElement("div");
    nodes.forEach((n) => {
      if (n) d.append(n);
    });
    return d;
  }
  function parseHeroCarousel(main, document) {
    const section = main.querySelector(".adaptiveMarqueeCarousel");
    if (!section) return;
    const slides = section.querySelectorAll(".adaptive-marquee");
    const rows = [];
    slides.forEach((slide) => {
      const bgImg = slide.querySelector(".bg-image img, .uc-bg-wrapper img");
      const heading = slide.querySelector("h1");
      const desc = slide.querySelector(".cb-text p, .am-content p");
      const cta = slide.querySelector(".am-cta a, .cb-cta a");
      const imgCell = bgImg ? img(document, bgImg.src, bgImg.alt || "") : "";
      const contentCell = frag(
        document,
        heading ? h(document, 1, heading.textContent.trim()) : null,
        desc ? p(document, desc.textContent.trim()) : null,
        cta ? p(document, link(document, cta.href, cta.textContent.trim())) : null
      );
      rows.push([imgCell, contentCell]);
    });
    if (rows.length > 0) {
      return createBlock(document, "Hero Carousel", rows);
    }
    return null;
  }
  function parseNewsCarousel(main, document) {
    const newsHeading = [...main.querySelectorAll("h2")].find(
      (el) => el.textContent.includes("Latest news")
    );
    if (!newsHeading) return null;
    const section = newsHeading.closest(".backgroundWrapper") || newsHeading.parentElement;
    const cards = section.querySelectorAll('[class*="card-carousel"] li > div, [class*="news-card"], .esl-carousel li > div');
    const headerContent = frag(document, h(document, 2, "Latest news"));
    const rows = [[headerContent]];
    cards.forEach((card) => {
      const cardImg = card.querySelector("img");
      const cardH6 = card.querySelector("h6");
      const cardLink = card.querySelector("a[href]");
      const cardDesc = card.querySelector("p");
      const imgCell = cardImg ? img(document, cardImg.src, cardImg.alt || "") : "";
      const parts = [];
      if (cardH6) parts.push(h(document, 6, cardH6.textContent.trim()));
      if (cardDesc && cardDesc.textContent.trim().length > 5 && cardDesc !== (cardH6 == null ? void 0 : cardH6.parentElement)) {
      }
      if (cardLink) parts.push(p(document, link(document, cardLink.href, cardLink.textContent.trim())));
      const contentCell = frag(document, ...parts);
      if (parts.length > 0) rows.push([imgCell, contentCell]);
    });
    const exploreCta = section.querySelector('a[href*="newsroom"]');
    if (exploreCta) {
      rows.push([p(document, link(document, exploreCta.href, "Explore more news"))]);
    }
    return createBlock(document, "News Carousel", rows);
  }
  function parseFeatureBanner(main, document) {
    const section = main.querySelector(".contentBlock");
    if (!section) return null;
    const heading = section.querySelector("h3, h2");
    const desc = section.querySelector(".cb-text p, .typo5 p");
    const cta = section.querySelector(".cb-cta a, a[href]");
    const contentCell = frag(
      document,
      heading ? h(document, 3, heading.textContent.trim()) : null,
      desc ? p(document, desc.textContent.trim()) : null
    );
    const ctaCell = cta ? frag(document, p(document, link(document, cta.href, cta.textContent.trim()))) : "";
    return createBlock(document, "Feature Banner", [[contentCell, ctaCell]]);
  }
  function parseCardCarousel(main, document) {
    const section = main.querySelector(".bentoBox");
    if (!section) return null;
    const slides = section.querySelectorAll(".bb-slide, .esl-carousel li");
    const rows = [];
    slides.forEach((slide) => {
      const bgImg = slide.querySelector(".bg-image img, img");
      const heading = slide.querySelector("h4, h3");
      const desc = slide.querySelector("p");
      const cta = slide.querySelector("a[href]");
      const imgCell = bgImg ? img(document, bgImg.src, bgImg.alt || "") : "";
      const contentCell = frag(
        document,
        heading ? h(document, 4, heading.textContent.trim()) : null,
        desc ? p(document, desc.textContent.trim()) : null,
        cta ? p(document, link(document, cta.href, cta.textContent.trim())) : null
      );
      rows.push([imgCell, contentCell]);
    });
    return createBlock(document, "Card Carousel", rows);
  }
  function parseSolutionsGrid(main, document) {
    const solHeading = [...main.querySelectorAll("h2")].find(
      (el) => el.textContent.includes("solutions from edge")
    );
    if (!solHeading) return null;
    const section = solHeading.closest(".backgroundWrapper") || solHeading.parentElement;
    const headerDesc = section.querySelector(".cb-text p, p");
    const headerContent = frag(
      document,
      h(document, 2, "HPE solutions from edge to cloud"),
      headerDesc ? p(document, "Explore the ways HPE can help you open up opportunities across edge to cloud.") : null
    );
    const rows = [[headerContent]];
    const tiles = section.querySelectorAll('[class*="bento-tile"], [class*="card-item"], [class*="tile"]');
    tiles.forEach((tile) => {
      const tileImg = tile.querySelector("img");
      const tileH3 = tile.querySelector("h3");
      const tileDesc = tile.querySelector("p");
      const tileCta = tile.querySelector("a[href]");
      const imgCell = tileImg ? img(document, tileImg.src, tileImg.alt || "") : "";
      const contentCell = frag(
        document,
        tileH3 ? h(document, 3, tileH3.textContent.trim()) : null,
        tileDesc ? p(document, tileDesc.textContent.trim()) : null,
        tileCta ? p(document, link(document, tileCta.href, tileCta.textContent.trim())) : null
      );
      rows.push([imgCell, contentCell]);
    });
    return createBlock(document, "Solutions Grid", rows);
  }
  function parseGreenLakePromo(main, document) {
    const glHeading = [...main.querySelectorAll("h3")].find(
      (el) => el.textContent.includes("Hybrid cloud, simplified")
    );
    if (!glHeading) return null;
    const section = glHeading.closest(".backgroundWrapper") || glHeading.parentElement;
    const logo = section.querySelector('[class*="gl-logo"] img, [class*="greenlake-logo"] img');
    const desc = section.querySelector('[class*="gl-text"] p, [class*="description"] p');
    const videoThumb = section.querySelectorAll("img");
    const screenshot = section.querySelector('[class*="screenshot"] img, [class*="gl-right"] img');
    const leftParts = [];
    if (logo) leftParts.push(img(document, logo.src, "GreenLake logo"));
    const descText = desc ? desc.textContent.trim() : "GreenLake is the cloud delivering a unified platform experience\u2014enabling you to simplify IT, help reduce costs and transform faster.";
    leftParts.push(p(document, descText));
    const allImgs = [...section.querySelectorAll("img")];
    const thumbImg = allImgs.find((i) => i.alt && i.alt.includes("explained"));
    if (thumbImg) leftParts.push(img(document, thumbImg.src, "GreenLake explained"));
    const leftCell = frag(document, ...leftParts);
    const screenshotImg = allImgs.find((i) => i.alt && i.alt.toLowerCase().includes("screenshot"));
    const cta = section.querySelector('a[href*="greenlake"]');
    const rightCell = frag(
      document,
      screenshotImg ? img(document, screenshotImg.src, "GreenLake screenshot") : null,
      h(document, 3, "Hybrid cloud, simplified"),
      cta ? p(document, link(document, cta.href, "Visit GreenLake")) : null
    );
    return createBlock(document, "GreenLake Promo", [[leftCell, rightCell]]);
  }
  function parseCustomerStories(main, document) {
    const section = main.querySelector(".customerStories");
    if (!section) return null;
    const intro = section.querySelector(".uc-cs-intro");
    const introH2 = intro ? intro.querySelector("h2") : null;
    const introP = intro ? intro.querySelector("p") : null;
    const viewAllCta = section.querySelector('a[href*="customer-case-studies"]');
    const headerCell = frag(
      document,
      introH2 ? h(document, 2, introH2.textContent.trim()) : h(document, 2, "Customer stories"),
      introP ? p(document, introP.textContent.trim()) : null,
      viewAllCta ? p(document, link(document, viewAllCta.href, "View all customer stories")) : null
    );
    const rows = [[headerCell]];
    const tabs = section.querySelectorAll('[role="tab"]');
    const panels = section.querySelectorAll('[role="tabpanel"], .uc-cs-tab-content');
    tabs.forEach((tab, i) => {
      const tabName = tab.textContent.trim();
      const panel = panels[i] || section.querySelector(`[data-index="${i}"]`);
      const tabNameCell = tabName;
      const parts = [];
      if (panel) {
        const panelHeadings = panel.querySelectorAll("h3, h4");
        const panelPs = panel.querySelectorAll("p");
        const panelLists = panel.querySelectorAll("ul");
        const panelImgs = panel.querySelectorAll("img");
        panelHeadings.forEach((ph) => parts.push(h(document, 3, ph.textContent.trim())));
        panelPs.forEach((pp) => {
          const text = pp.textContent.trim();
          if (text.length > 5) parts.push(p(document, text));
        });
        panelLists.forEach((ul) => {
          const list = document.createElement("ul");
          ul.querySelectorAll("li").forEach((li) => {
            const listItem = document.createElement("li");
            listItem.textContent = li.textContent.trim();
            list.appendChild(listItem);
          });
          parts.push(list);
        });
      } else {
        parts.push(p(document, tabName));
      }
      const contentCell = frag(document, ...parts);
      rows.push([tabNameCell, contentCell]);
    });
    return createBlock(document, "Customer Stories", rows);
  }
  function parseSectionHeader(main, document) {
    const section = main.querySelector(".textOnly");
    if (!section) return null;
    const heading = section.querySelector("h2");
    const desc = section.querySelector("p");
    const inlineLink = section.querySelector("a[href]");
    const contentCell = frag(
      document,
      heading ? h(document, 2, heading.textContent.trim()) : null,
      desc ? p(document, desc.textContent.trim()) : null
    );
    const allPs = section.querySelectorAll("p");
    if (allPs.length > 1 && inlineLink) {
      const linkP = p(document, "Lease and financing available through ");
      linkP.append(link(document, inlineLink.href, inlineLink.textContent.trim()));
      linkP.append(".");
      contentCell.append(linkP);
    }
    return createBlock(document, "Section Header", [[contentCell]]);
  }
  function parseProductCards(main, document, variant) {
    const grids = main.querySelectorAll(".cardGrid");
    const results = [];
    grids.forEach((grid) => {
      const cols = grid.querySelector(".columns-2") ? "two-up" : "three-up";
      const items = grid.querySelectorAll(".card-grid-item");
      const rows = [];
      items.forEach((item) => {
        const cardImg = item.querySelector("img");
        const cardH3 = item.querySelector("h3");
        const cardDesc = item.querySelector("p");
        const cardCta = item.querySelector("a[href]");
        const imgCell = cardImg ? img(document, cardImg.src, cardImg.alt || "") : "";
        const contentCell = frag(
          document,
          cardH3 ? h(document, 3, cardH3.textContent.trim()) : null,
          cardDesc ? p(document, cardDesc.textContent.trim()) : null,
          cardCta ? p(document, link(document, cardCta.href, cardCta.textContent.trim())) : null
        );
        rows.push([imgCell, contentCell]);
      });
      if (rows.length > 0) {
        results.push({ table: createBlock(document, `Product Cards (${cols})`, rows), cols });
      }
    });
    return results;
  }
  function parseServicesBanner(main, document) {
    const section = main.querySelector(".adaptiveMarqueeComponent");
    if (!section) return null;
    const heading = section.querySelector("h2, h3");
    const desc = section.querySelector("p");
    const cta = section.querySelector("a[href]");
    const contentCell = frag(
      document,
      heading ? h(document, 2, heading.textContent.trim()) : null,
      desc ? p(document, desc.textContent.trim()) : null
    );
    const ctaCell = cta ? frag(document, p(document, link(document, cta.href, cta.textContent.trim()))) : "";
    return createBlock(document, "Feature Banner", [[contentCell, ctaCell]]);
  }
  var import_homepage_default = {
    transform: ({ document, url, html, params }) => {
      const main = document.querySelector("main") || document.body;
      const result = document.createElement("div");
      const hero = parseHeroCarousel(main, document);
      if (hero) result.append(hero);
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "dark"));
      const news = parseNewsCarousel(main, document);
      if (news) result.append(news);
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "dark-alt"));
      const featureBanner = parseFeatureBanner(main, document);
      if (featureBanner) result.append(featureBanner);
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "dark-alt"));
      const cardCarousel = parseCardCarousel(main, document);
      if (cardCarousel) result.append(cardCarousel);
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "light"));
      const solutions = parseSolutionsGrid(main, document);
      if (solutions) result.append(solutions);
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "dark"));
      const greenLake = parseGreenLakePromo(main, document);
      if (greenLake) result.append(greenLake);
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "dark"));
      const customerStories = parseCustomerStories(main, document);
      if (customerStories) result.append(customerStories);
      result.append(sectionBreak(document));
      const sectionHeader = parseSectionHeader(main, document);
      if (sectionHeader) result.append(sectionHeader);
      const productCards = parseProductCards(main, document);
      productCards.forEach((pc) => {
        result.append(sectionBreak(document));
        result.append(pc.table);
      });
      result.append(sectionBreak(document));
      result.append(sectionMetadata(document, "dark-alt"));
      const services = parseServicesBanner(main, document);
      if (services) result.append(services);
      result.append(sectionBreak(document));
      const meta = {};
      meta.Title = "Hewlett Packard Enterprise (HPE)";
      meta.Description = "HPE is a leader in essential enterprise technology, bringing together the power of AI, cloud, and networking to help organizations unlock their boldest ambitions.";
      meta["og:title"] = "Hewlett Packard Enterprise";
      meta["og:description"] = meta.Description;
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) {
        const imgEl = document.createElement("img");
        imgEl.src = ogImg.content;
        meta["og:image"] = imgEl;
      }
      const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
      result.append(metaBlock);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: result,
        path,
        report: {
          title: "Hewlett Packard Enterprise (HPE)",
          template: PAGE_TEMPLATE.name
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
