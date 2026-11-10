const assert = require('node:assert/strict');
const fs = require('node:fs');
const bibtex = require('bibtex-parse-js');

// Run after npm run build: check the actual rendered cards and copied citations.
const source = bibtex.toJSON(fs.readFileSync('data/publications.bib', 'utf8'));
const html = fs.readFileSync('_site/publications/index.html', 'utf8');
const cards = [...html.matchAll(/<article\b[^>]*class="paper-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
const decode = value => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const records = new Map(source.map(entry => [entry.citationKey, entry]));
assert.equal(records.size, source.length, 'Citation keys must be unique');
assert.equal(cards.length, source.length, 'Every record must render exactly once');
const rendered = new Map();

for (const card of cards) {
  const value = card.match(/data-bibtex="([^"]*)"/);
  assert.ok(value, 'Every paper needs an exportable citation');
  const [citation] = bibtex.toJSON(decode(value[1]));
  const entry = records.get(citation.citationKey);
  assert.ok(entry, `Unknown citation: ${citation.citationKey}`);
  assert.ok(!rendered.has(citation.citationKey), 'No duplicated papers');
  rendered.set(citation.citationKey, card);
  assert.equal(citation.entryType, entry.entryType);
  for (const field of ['title', 'author', 'year', 'journal', 'booktitle', 'doi', 'url', 'volume', 'pages']) {
    assert.equal(citation.entryTags[field], entry.entryTags[field], `${entry.citationKey}: ${field}`);
  }
  assert.equal(citation.entryTags.eprint, entry.entryTags.arxiv);
  assert.ok(!citation.entryTags.venueextra, 'Workshop badges must not overwrite citation venues');
  if (entry.entryTags.journal) assert.equal(citation.entryType.toLowerCase(), 'article');
  if (entry.entryTags.booktitle) assert.equal(citation.entryType.toLowerCase(), 'inproceedings');
}

for (const [key, primary] of [['dmitriev2024growth', 'colt'], ['hu2024provable', 'icml']]) {
  const venues = [...rendered.get(key).matchAll(/data-venue="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(venues, [primary, 'tpdp'], `${key}: preserve the main conference and separate workshop`);
}
assert.equal(records.get('dmitriev2025echo').entryTags.year, '2026');
assert.equal(records.get('li2024delta').entryTags.year, '2026');
assert.ok(records.get('li2024delta').entryTags.author.includes('Zeng, Pengcheng'));
assert.ok(records.get('neel2025protecting').entryTags.author.startsWith('Alex, Neel and '));
assert.ok(!rendered.get('radic2026forget').includes('data-venue="icml"'), 'Workshop acceptance is not main-track ICML');
console.log(`Checked ${cards.length} publication cards, citation exports, and venue regressions.`);
