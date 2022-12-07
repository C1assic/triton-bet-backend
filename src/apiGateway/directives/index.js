const path = require('path');
const fs = require('fs');

const basename = path.basename(__filename);

const directives = {};
const modules = [];
const transformers = [];

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && (file.slice(-3) === '.js' || file.indexOf('.') === -1))
  .map((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const directive = require(path.join(__dirname, file));
    return directive;
  })
  .sort(({ priority: priorityA = 0 }, { priority: priorityB = 0 }) => priorityA - priorityB)
  .forEach((directive) => {
    directives[directive.name] = directive;
    modules.push(directive.module);
    transformers.push(directive.transformer);
  });

const transformer = (schema) => {
  let newSchema = schema;
  transformers.forEach((directiveTransformer) => {
    newSchema = directiveTransformer(newSchema);
  });
  return newSchema;
};

module.exports = {
  transformers,
  transformer,
  directives,
  modules,
};
