import useOverrides from "../src/use";

import React from "react";
import renderer from "react-test-renderer";

const Bar = props => <div {...props}>Bar</div>;
const Baz = props => <div {...props}>Baz</div>;
const defaultComponents = { Bar };
const Foo = props => {
  const { Bar } = useOverrides(props, defaultComponents);
  return <Bar {...props} />;
};

describe("useOverrides", () => {
  it("should render without overrides", () => {
    const component = renderer.create(<Foo />);

    expect(component.toJSON()).toMatchSnapshot();
  });
  it("should render with style overrides", () => {
    const component = renderer.create(
      <Foo overrides={{ Bar: { style: { color: "red" } } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("should render with props overrides", () => {
    const component = renderer.create(
      <Foo overrides={{ Bar: { props: { className: "Bar" } } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("should render with component overrides", () => {
    const component = renderer.create(
      <Foo overrides={{ Bar: { component: Baz } }} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
