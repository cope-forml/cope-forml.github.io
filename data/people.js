const fs = require('fs');
const yaml = require('js-yaml');

module.exports = () => {
  return yaml.load(fs.readFileSync(__dirname + '/people.yaml', 'utf8'));
};
