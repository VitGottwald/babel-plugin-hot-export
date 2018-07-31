import transform from "./parse-and-generate.js";

it("renames varable `n` to `x`", () => {
  const code = `function square(n) {
  return n * n;
}`;
  expect(transform(code)).toMatchSnapshot();
});
