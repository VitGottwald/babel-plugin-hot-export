import * as babel from "babel-core";
import prettier from "prettier";

import fs from "fs";

const fixture = name => fs.readFileSync(`./__fixtures__/${name}`, "utf8");
const test = (input, output) =>
  expect(
    prettier.format(
      babel.transform(input, {
        filename: "filename.js",
        babelrc: false,
        retainLines: true,
        plugins: ["./transform.js"]
      }).code,
      { parser: "babylon" }
    )
  ).toEqual(output);

describe("babel plugin tests", () => {
  it("should hot-export bound reference", function() {
    const input = fixture("variableReference.input.js");
    const output = fixture("variableReference.output.js");

    test(input, output);
  });
  it("should hot-export function declaration", function() {
    const input = fixture("functionDeclaration.input.js");
    const output = fixture("functionDeclaration.output.js");

    test(input, output);
  });
});
