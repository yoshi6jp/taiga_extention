import { parseCustomVal } from "./UserTasks";
describe.each`
  value                    | expected
  ${"1"}                   | ${1}
  ${"0.5"}                 | ${0.5}
  ${"10.0"}                | ${10}
  ${"3.5H"}                | ${3.5}
  ${"6時間"}               | ${6}
  ${"1+2"}                 | ${3}
  ${"1 + 2 + 3"}           | ${6}
  ${"1 + 2 + 3 +"}         | ${6}
  ${"1.5 + 2.5 + 3.5 "}    | ${7.5}
  ${"1.5H + 2.5H + 3.5H "} | ${7.5}
  ${"1,2"}                 | ${3}
  ${"1 , 2,3"}             | ${6}
  ${"1 , 2,3,"}            | ${6}
  ${""}                    | ${0}
  ${" "}                   | ${0}
  ${" "}                   | ${0}
  ${" + 1"}                | ${1}
`("$value => $expected", ({ value, expected }) => {
  it("should parsed", () => {
    expect(parseCustomVal(value)).toEqual(expected);
  });
});
