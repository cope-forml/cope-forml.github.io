const fs = require('fs');
const { DateTime } = require('luxon');
const bibtexParse = require('bibtex-parse-js');
const path = require('path');


module.exports = function (eleventyConfig) {
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

eleventyConfig.addCollection('openings', api => api.getFilteredByGlob('./content/openings/*.md').sort((a,b)=>b.date-a.date));

  eleventyConfig.addCollection('publications', () => {
    const bibPath = 'data/publications.bib';
    if (!fs.existsSync(bibPath)) return [];
    return bibtexParse.toJSON(fs.readFileSync(bibPath,'utf8')).map(e=>({
      ...e,
      slug: (e.entryTags.title||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
      topics: (e.entryTags.topic||'').split(',').map(s=>s.trim()).filter(Boolean),
      tags:   (e.entryTags.tags ||'').split(',').map(s=>s.trim()).filter(Boolean)
    }));
  });

  return {
    pathPrefix: "/cope-forml-group-site/",
    dir: { input:'src', includes:'layouts', data:'../data', output:'_site' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};