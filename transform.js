/** This babel-plugin adds
    `import { hot } from 'react-hot-loader';`

const _Name = hot(module)(Name);
export { _Name as Name };

*/
const p = require("path");

module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "Hot Export React Components",
    visitor: {
      Program(path, state) {
        if (
          state.opts.files.every(file => p.resolve(file) !== p.resolve(state.file.opts.filename))
        ) {
          return;
        }
        path.unshiftContainer(
          "body",
          t.ImportDeclaration(
            [t.ImportSpecifier(t.Identifier("hot"), t.Identifier("hot"))],
            t.StringLiteral("react-hot-loader")
          )
        );
      },
      ExportDefaultDeclaration(path, state) {
        if (
          state.opts.files.every(file => p.resolve(file) !== p.resolve(state.file.opts.filename))
        ) {
          return;
        }
        if (t.isClassDeclaration(path.get("declaration"))) {
          const declaration = path.get("declaration").node;
          const identifier = () => declaration.id || t.Identifier("__component");
          declaration.id = identifier();
          path.insertBefore(declaration);
          path.node.declaration = t.CallExpression(
            t.CallExpression(t.Identifier("hot"), [t.Identifier("module")]),
            [identifier()]
          );
        }
      }
    }
  };
};
