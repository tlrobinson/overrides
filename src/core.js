const React = require("react");

exports.initializeOverrideWrappers = function initializeOverrideWrappers(
  defaultComponents,
  getOverrides
) {
  // initialize component wrappers
  const components = {};
  for (const name of Object.keys(defaultComponents)) {
    components[name] = props => {
      const overrides = getOverrides() || {};
      const override = overrides[name] || {};

      let Component;
      const allProps = { ...props };
      if (
        typeof override === "function" ||
        override instanceof React.Component
      ) {
        Component = override;
      } else {
        const { style, props, component, ...nestedOverrides } = override;
        // component:
        Component = component || defaultComponents[name];
        // props:
        Object.assign(allProps, props);
        // style:
        const styleOverride =
          typeof style === "function" ? style(props) : style;
        if (styleOverride) {
          allProps.style = maybeMerge(allProps.style, styleOverride);
        }
        // nested overrides:
        if (Object.keys(nestedOverrides).length > 0) {
          allProps.overrides = maybeMerge(allProps.overrides, nestedOverrides);
        }
      }

      return <Component {...allProps} />;
    };
    components[name].displayName = `${name}Overridable`;
  }
  return components;
};

function maybeMerge(a, b) {
  return a && b ? { ...a, ...b } : a || b;
}
