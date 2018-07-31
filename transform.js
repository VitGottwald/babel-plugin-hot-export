/** This babel-plugin adds
    `import { hot } from 'react-hot-loader';`

const _Name = hot(module)(Name);
export { _Name as Name };

*/

export default function(babel) {
  const { types: t } = babel;

  return {
    name: "Hot Export React Components",
    visitor: {
      Program(path) {
        path.node.body.unshift(
          t.ImportDeclaration(
            [t.ImportSpecifier(t.Identifier("hot"), t.Identifier("hot"))],
            t.StringLiteral("react-hot-loader")
          )
        );
      },
      ExportDefaultDeclaration(path) {
        const node = path.node;
        node.declaration = decoratedWithHot(t, node.declaration);
      }
    }
  };
}

const decoratedWithHot = (t, declaration) =>
  t.CallExpression(t.CallExpression(t.Identifier("hot"), [t.Identifier("module")]), [declaration]);
