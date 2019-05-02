# React Overrides

This project provides a React "higher-order component" and a React "hook" that implemenets the "overrides" pattern described in this article: https://medium.com/@dschnr/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646

## Examples

    import { withOverrides, useOverrides } from "overrides"
    // OR
    import withOverrides from "overrides/with"
    import useOverrides from "overrides/use"

    const defaultComponents = {
      Bar: ({ style, message }) =>
        <div style={style}>{message}</div>
    };

    // Hooks:
    const Foo = props => {
      const { Bar } = useOverrides(props, defaultComponents);
      return <Bar message="hello" />;
    };

    // HoC:
    const Foo = withOverrides(defaultComponents)(
      ({ Bar }) =>
        <Bar message="hello" />
    );

    // Usage:
    <Foo overrides={{ Bar: { component: CustomBar } }} />
    <Foo overrides={{ Bar: { style: { color: "red" } } }} />
    <Foo overrides={{ Bar: { props: { message: "goodbye" } } }} />
