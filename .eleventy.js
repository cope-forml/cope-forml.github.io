const fs = require('fs');
const { DateTime } = require('luxon');
const bibtexParse = require('bibtex-parse-js');
const path = require('path');
const markdownIt = require('markdown-it');


module.exports = function (eleventyConfig) {
  const md = markdownIt({ html: true, breaks: false, linkify: true });
  eleventyConfig.setLibrary('md', md);

  // Pass‑through static assets
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  // Date filter → {{ 'now' | date('yyyy') }} or {{ page.date | date('yyyy‑LL‑dd') }}
  eleventyConfig.addFilter('date', (value, fmt = 'yyyy-LL-dd') => {
    if (value === 'now') return DateTime.now().toFormat(fmt);
    const dt = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromISO(String(value));
    return dt.toFormat(fmt);
  });

  // Collections ------------------------------------------------
 
    eleventyConfig.addCollection('people', api => {
    // Debug log to check if people data is loaded
    // console.log('api.people:', api.people);
    return Array.isArray(api.people) ? api.people : [];
  });
  // topics.yaml → collections.topicList
eleventyConfig.addCollection('topicList', api => api.topics || []);

// eleventyConfig.addCollection('news', function(api) {
//   const files = api.getAll().map(item => item.inputPath);
//   console.log('All input files:', files);

//   const news = api.getFilteredByGlob('./src/content/newslist/*.md');
//   console.log('All news files:', news);
//   console.log('News found:', news.length, news.map(n => n.inputPath));
//   return news.sort((a, b) => b.date - a.date);
// });

eleventyConfig.addCollection('news', function(api) {
  const news = api.getFilteredByGlob('./src/content/newslist/*.md');
  news.forEach(n => {
    if (typeof n.data.featured === "string") {
      n.data.featured = n.data.featured.toLowerCase() === "true";
    }
  });
  return news.sort((a, b) => b.date - a.date);
});

eleventyConfig.addCollection('openings', api => {
  const openings = api.getFilteredByGlob('./src/content/openinglist/*.md');
  return openings.sort((a, b) => b.date - a.date);
});

eleventyConfig.addCollection('blog', api => {
  const posts = api.getFilteredByGlob('./src/content/blog/*.md');
  return posts
    .filter(p => p.data && p.data.ready === true)
    .sort((a, b) => b.date - a.date);
});

  // Shortcodes ------------------------------------------------
  eleventyConfig.addPairedShortcode('callout', (content, title = '', variant = '') => {
    const variantClass = variant ? ` callout-${variant}` : '';
    const titleHtml = title ? `<p class="callout-title">${title}</p>` : '';
    const bodyHtml = md.render(content);
    return `<div class="callout${variantClass}">${titleHtml}${bodyHtml}</div>`;
  });

  eleventyConfig.addPairedShortcode('figure', (content, src, alt = '') => {
    const caption = content ? md.renderInline(content) : '';
    const captionHtml = caption ? `<figcaption>${caption}</figcaption>` : '';
    return `<figure class="blog-figure"><img src="${src}" alt="${alt}"/>${captionHtml}</figure>`;
  });

const slugify = require("slugify");



const fs = require('fs');
const bibtexParse = require('bibtex-parse-js');

eleventyConfig.addCollection('publications', () => {
  const bibPath = 'data/publications.bib';
  if (!fs.existsSync(bibPath)) return [];
  return bibtexParse.toJSON(fs.readFileSync(bibPath,'utf8')).map(e => {
    // First word of title
    const firstWord = (e.entryTags.title || '')
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z0-9]/g, '') || 'paper';

    // Last name of first author (assuming "Last, First and ..." format)
    let lastName = 'author';
    if (e.entryTags.author) {
      const firstAuthor = e.entryTags.author.split(' and ')[0];
      // Handles "Last, First" and also "First Last"
      lastName = (firstAuthor.split(',')[0] || firstAuthor.split(' ')[1] || firstAuthor).replace(/[^a-zA-Z0-9]/g, '');
    }

    // Year (fallback to 'xxxx')
    const year = e.entryTags.year || 'xxxx';

    // Slugify
    const slug = slugify(`${firstWord}-${lastName}-${year}`, { lower: true, strict: true });

    return {
      ...e,
      slug,
      topics: (e.entryTags.topic||'').split(',').map(s=>s.trim()).filter(Boolean),
      tags:   (e.entryTags.tags ||'').split(',').map(s=>s.trim()).filter(Boolean)
    };
  });
});


  return {
    dir: { input:'src', includes:'layouts', data:'../data', output:'_site' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
