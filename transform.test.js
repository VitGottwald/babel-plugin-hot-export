import * as babel from "babel-core";
import prettier from "prettier";
import util from "util";

import fs from "fs";
const readFile = util.promisify(fs.readFile);
const fixture = name => readFile(`./__fixtures__/${name}`, "utf8");

const test = (done, input, output) =>
  Promise.all([fixture(input), fixture(output)]).then(files => {
    expect(
      prettier.format(
        babel.transform(files[0], {
          filename: "filename.js",
          babelrc: false,
          retainLines: true,
          plugins: ["./transform.js"]
        }).code,
        { parser: "babylon" }
      )
    ).toEqual(files[1]);
    done();
  });

describe("hot-exports", () => {
  it("bound reference", done => {
    test(done, "variableReference.input.js", "variableReference.output.js");
  });
  it("function declaration", done => {
    test(done, "functionDeclaration.input.js", "functionDeclaration.output.js");
  });
  it("class declaration", done => {
    test(done, "classDeclaration.input.js", "classDeclaration.output.js");
  });
});
