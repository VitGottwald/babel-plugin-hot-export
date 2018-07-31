/** This babel-plugin adds
    `import { hot } from 'react-hot-loader';`
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
      }
    }
  };
};
}
