# Overrides for React

This project provides a React ["higher-order component"](https://reactjs.org/docs/higher-order-components.html) and ["hook"](https://reactjs.org/docs/hooks-intro.html) that implemenets the ["overrides"](https://medium.com/@dschnr/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646) pattern to allow consumers of a component library to override style, props, and components inside a component. This pattern is used throughout Uber's [Base Web](https://baseweb.design/theming/understanding-overrides/) component library.

The hook and higher-order component provided by this library avoids manual destructuring and prop spreading required when using `getOverrides`/`getComponents` directly (but we also expose our version of `getOverrides`/`getComponents` if you want to use them)

Instead of having to destructure the component and props separately, then remembering to spread the props on the component:

    const Foo = ({ overrides }) => {
      const { Bar: { component: Bar, props: barProps}, } = getComponents(defaultComponents, overrides);
      return <Bar message="hello" {...barProps} />;
    };

You simply apply the Higher-Order Component and get the wrapped component out of the props:

    const Foo = withOverrides(defaultComponents)(
      ({ Bar }) => {
        return <Bar message="hello" />
      }
    );

or use the Hook:

    const Foo = ({ overrides }) => {
      const { Bar } = useOverrides(defaultComponents, overrides);
      return <Bar message="hello" />;
    };

## Why Overrides?

Overrides can be thought of as "render props on steriods". Instead of adding a render prop for each sub-component of your component, you set up overrides which are activated using the `overrides` prop. In exchange, you get both the equivalent of a render prop (by using a `component` override), as well as shortcuts to override the `style` or `props` of the default sub-component implemention. This is even more powerful when you consider nested overrides.

## Why this `overrides` library?

The [example implementation described in the above linked article](https://gist.github.com/schnerd/30c1415b7621d0e71352aa0c0184f175#file-overrides-example-internal-js) and the implementation in Base Web requires a fair amount of manual destructuring and prop spreading. This work can be encapsulated in a Hook or Higher-Order Component.

[`react-overrides`](https://github.com/ilyalesik/react-overrides) is another project that implements the overrides pattern, but it requires a custom Babel plugin.

## Features

- `style` override (merged with existing style): `{ Name: { style: { color: "red" } } }`
- `style` override can be a function: `{ Name: { style: ({ isOpen }) => ({ color: isOpen ? "green" : "red" }) } }`
- `props` override: `{ Name: { props: { "aria-label": "name" } } }`
- `component` overrides: `{ Name: { component: Replacement } }`
- `component` override shorthand: `{ Name: Replacement }`
- nested overrides: `{ Name: { SubName: { SubReplacement } }`, `{ Name: { SubName: { style: { color: "red" } } }`, etc
- `getOverrides` and `getComponents` can also be used directly

## Examples

    import { withOverrides, useOverrides } from "overrides"
    // or...
    import withOverrides from "overrides/with"
    import useOverrides from "overrides/use"

    const defaultComponents = {
      Bar: ({ style, message }) =>
        <div style={style}>{message}</div>
    };

    // Hook:
    const Foo = ({ overrides, ...props }) => {
      const { Bar } = useOverrides(defaultComponents, overrides);
      return <Bar message="hello" />;
    };

    // Higher-Order Component:
    const Foo = withOverrides(defaultComponents)(
      ({ Bar }) =>
        <Bar message="hello" />
    );

    // Higher-Order Component on class component with decorator:
    @withOverrides(defaultComponents)
    class Foo extends React.Component {
      render() {
        const { Bar } = this.props;
        return <Bar message="hello" />;
      }
    }

    // Usage:

    // component override:
    <Foo overrides={{ Bar: { component: CustomBar } }} />

    // component override shortcut:
    <Foo overrides={{ Bar: CustomBar }} />

    // style override:
    <Foo overrides={{ Bar: { style: { color: "red" } } }} />

    // style override with function:
    <Foo overrides={{ Bar: { style: ({ isOpen }) => ({ color: isOpen ? "green" : "red" }) } }} />

    // prop override:
    <Foo overrides={{ Bar: { props: { message: "goodbye" } } }} />

    // nested overrides:
    <Foo overrides={{ Bar: { Baz: { props: { message: "goodbye" } } } }} />
