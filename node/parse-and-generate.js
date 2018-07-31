const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const generate = require('babel-generator').default;

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);
traverse(ast, {
    enter(path) {
        if (t.isIdentifier(path.node, {name: 'n'})) {
            path.node.name = 'x';
        }
    },
});
const source = generate(
    ast,
    {
        retainLines: false,
        compact: 'auto',
        concise: false,
        quites: 'double',
    },
    code
);

console.log(source.code);
