const path = require('path');
const fs = require('fs');

const basename = path.basename(__filename);

const modules = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && (file.slice(-3) === '.js' || file.indexOf('.') === -1))
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const module = require(path.join(__dirname, file));
    modules[module.id] = module;
  });

module.exports = modules;
