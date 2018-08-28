import * as babel from "babel-core";
import prettier from "prettier";
import util from "util";

import fs from "fs";
const readFile = util.promisify(fs.readFile);
const fixture = name => readFile(`./__fixtures__/${name}`, "utf8");

const test = (done, input, output = null) => {
  if (output === null) {
    output = `${input}.output.js`;
    input = `${input}.input.js`;
  }

  Promise.all([fixture(input), fixture(output)]).then(files => {
    expect(
      prettier.format(
        babel.transform(files[0], {
          filename: "filename.js",
          babelrc: false,
          retainLines: true,
          plugins: [["./transform.js", {karel: "karel"}]]
        }).code,
        { parser: "babylon" }
      )
    ).toEqual(files[1]);
    done();
  });
};

describe("hot-exports", () => {
  it("bound reference", done => {
    test(done, "variableReference");
  });
  it("function declaration", done => {
    test(done, "functionDeclaration");
  });
  it("class declaration", done => {
    test(done, "classDeclaration");
  });
});
