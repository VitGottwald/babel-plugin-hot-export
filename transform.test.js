import * as babel from "babel-core";
import prettier from "prettier";

import fs from "fs";

const fixture = name => fs.readFileSync(`./__fixtures__/${name}`, "utf8");

describe("babel plugin tests", () => {
  it("should hot-export variable reference", function() {
    const input = fixture("variableReference.input.js");
    const output = fixture("variableReference.output.js");

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
  });
});
