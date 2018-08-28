/** This babel-plugin adds
    `import { hot } from 'react-hot-loader';`

const _Name = hot(module)(Name);
export { _Name as Name };

*/
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "Hot Export React Components",
    visitor: {
      Program(path, state) {
        console.log(state.file.opts.filename);
        path.node.body.unshift(
          t.ImportDeclaration(
            [t.ImportSpecifier(t.Identifier("hot"), t.Identifier("hot"))],
            t.StringLiteral("react-hot-loader")
          )
        );
      },
      ExportDefaultDeclaration(path) {
        const declaration = path.get("declaration");
        if (t.isClassDeclaration(declaration)) {
          path.replaceWithMultiple([classDeclaration(t, declaration.node), hotExport(t)]);
        } else if (t.isFunctionDeclaration(declaration)) {
          path.replaceWithMultiple([functionDeclaration(t, declaration.node), hotExport(t)]);
        } else {
          path.replaceWithMultiple([constDeclaration(t, path.node.declaration), hotExport(t)]);
        }
        path.stop();
      }
    }
  };
};

const constDeclaration = (t, declaration) =>
  t.VariableDeclaration("const", [t.VariableDeclarator(t.Identifier("_component"), declaration)]);

const classDeclaration = (t, cls) =>
  t.VariableDeclaration("const", [
    t.VariableDeclarator(
      t.Identifier("_component"),
      t.ClassExpression(cls.id, cls.superClass, cls.body, []) // no decorators
    )
  ]);

const functionDeclaration = (t, fn) =>
  t.VariableDeclaration("const", [
    t.VariableDeclarator(
      t.Identifier("_component"),
      t.FunctionExpression(fn.id, fn.params, fn.body, fn.generator, fn.async)
    )
  ]);

const hotExport = t =>
  t.ExportDefaultDeclaration(
    t.CallExpression(t.CallExpression(t.Identifier("hot"), [t.Identifier("module")]), [
      t.Identifier("_component")
    ])
  );
