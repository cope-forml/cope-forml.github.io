const fs = require('fs');
const yaml = require('js-yaml');

module.exports = () => {
  // Adjust path if needed for your project structure
  return yaml.load(fs.readFileSync(__dirname + '/topics.yaml', 'utf8'));
};
