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
        const declarationPath = path.get("declaration");
        if (t.isClassDeclaration(declarationPath) || t.isFunctionDeclaration(declarationPath)) {
          const declaration = declarationPath.node;
          const id = declaration.id || path.scope.generateUidIdentifierBasedOnNode(path.node.id);
          declaration.id = id;
          path.insertBefore(declaration);
          path.node.declaration = t.CallExpression(
            t.CallExpression(t.Identifier("hot"), [t.Identifier("module")]),
            [id]
          );
        }
      }
    }
  };
};
