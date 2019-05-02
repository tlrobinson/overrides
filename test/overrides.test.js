import React from "react";
import renderer from "react-test-renderer";
import useOverrides from "../src/use";
import withOverrides from "../src/with";

const TESTS = {
  "should render without overrides": ({ Foo }) => <Foo />,
  "should render with style overrides": ({ Foo }) => (
    <Foo overrides={{ Bar: { style: { color: "red" } } }} />
  ),
  "should render with props overrides": ({ Foo }) => (
    <Foo overrides={{ Bar: { props: { className: "Bar" } } }} />
  ),
  "should render with explicit component overrides": ({ Foo, Baz }) => (
    <Foo overrides={{ Bar: { component: Baz } }} />
  ),
  "should render with shorthand component overrides": ({ Foo, Baz }) => (
    <Foo overrides={{ Bar: Baz }} />
  ),
  "should render with manually nested overrides": ({ Another, Foo, Baz }) => (
    <Another overrides={{ Foo: { props: { overrides: { Bar: Baz } } } }} />
  ),
  "should render with automatically nested overrides": ({
    Another,
    Foo,
    Baz
  }) => <Another overrides={{ Foo: { Bar: Baz } }} />
};

function getWithOverridesComponents() {
  const Bar = props => <div {...props}>Bar</div>;
  const Baz = props => <div {...props}>Baz</div>;

  const Foo = withOverrides({ Bar })(({ Bar }) => <Bar />);
  const Another = withOverrides({ Foo, Wrapper: "div" })(({ Wrapper, Foo }) => (
    <Wrapper>
      <Foo />
    </Wrapper>
  ));

  return { Another, Foo, Bar, Baz };
}

function getUseOverridesComponents() {
  const Bar = props => <div {...props}>Bar</div>;
  const Baz = props => <div {...props}>Baz</div>;

  const Foo = ({ overrides }) => {
    const C = useOverrides({ Bar }, overrides);
    return <C.Bar />;
  };
  const Another = ({ overrides }) => {
    const C = useOverrides({ Foo, Wrapper: "div" }, overrides);
    return (
      <C.Wrapper>
        <C.Foo />
      </C.Wrapper>
    );
  };

  return { Another, Foo, Bar, Baz };
}

const useOverridesComponents = getUseOverridesComponents();
const withOverridesComponents = getWithOverridesComponents();

function runAll(components) {
  Object.entries(TESTS).map(([name, fn]) =>
    it(name, () => {
      const component = renderer.create(fn(components));
      expect(component.toJSON()).toMatchSnapshot();
    })
  );
}

describe("withOverrides", () => {
  runAll(withOverridesComponents);
});
describe("useOverrides", () => {
  runAll(useOverridesComponents);
});
describe("compare withOverrides and useOverrides", () => {
  Object.entries(TESTS).map(([name, fn]) =>
    it(name, () => {
      const useComponent = renderer.create(fn(useOverridesComponents));
      const withComponent = renderer.create(fn(withOverridesComponents));
      expect(useComponent.toJSON()).toEqual(withComponent.toJSON());
    })
  );
});
