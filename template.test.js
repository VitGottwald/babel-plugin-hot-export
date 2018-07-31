const template = require("babel-template");
const generate = require("babel-generator").default;
const t = require("babel-types");

it("replaces identifiers in a template", () => {
  const buildRequire = template(`
    var IMPORT_NAME = require(SOURCE);
  `);

  const ast = buildRequire({
    IMPORT_NAME: t.identifier("myModule"),
    SOURCE: t.stringLiteral("my-module")
  });

  expect(generate(ast).code).toMatchSnapshot();
});
