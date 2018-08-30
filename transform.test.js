import * as babel from "babel-core";
import prettier from "prettier";
import util from "util";
import path from "path";

import fs from "fs";
const readFile = util.promisify(fs.readFile);
const fixture = name => readFile(`./__fixtures__/${name}`, "utf8");

const test = (done, { input, output = null, filename = "filename.js", parameter = null }) => {
  if (output === null) {
    output = `${input}.output.js`;
    input = `${input}.input.js`;
  }
  if (parameter === null) {
    parameter = { files: [filename] };
  }

  Promise.all([fixture(input), fixture(output)]).then(files => {
    expect(
      prettier.format(
        babel.transform(files[0], {
          filename: path.resolve(filename),
          babelrc: false,
          retainLines: true,
          plugins: [["./transform.js", parameter]]
        }).code,
        { parser: "babylon" }
      )
    ).toEqual(files[1]);
    done();
  });
};

describe("hot-exports", () => {
  it("checks for filename match", done => {
    test(done, {
      input: "classDeclaration.input.js",
      output: "classDeclaration.input.js",
      filename: "filename-a.txt",
      parameter: { files: ["filename-b.txt"] }
    });
  });
  it("transforms class declaration", done => {
    test(done, { input: "classDeclaration" });
  });
  it("transforms anonymous class declaration", done => {
    test(done, { input: "anonymousClassDeclaration" });
  });
});
