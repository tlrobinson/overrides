const React = require("react");

exports.initializeOverrideWrappers = function initializeOverrideWrappers(
  defaultComponents,
  getProps
) {
  // initialize component wrappers
  const components = {};
  for (const name of Object.keys(defaultComponents)) {
    components[name] = ({ style = {}, ...props }) => {
      const { overrides = {} } = getProps();
      const override = overrides[name] || {};

      const styleOverride = getOverride(override.style, props, {});
      const propsOverride = getOverride(override.props, props, {});
      const Component = override.component || defaultComponents[name];

      return (
        <Component
          style={{
            ...style,
            ...styleOverride
          }}
          {...props}
          {...propsOverride}
        />
      );
    };
    components[name].displayName = `${name}Overridable`;
  }
  return components;
};

function getOverride(valueOrFn, props, defaultValue) {
  return typeof valueOrFn === "function"
    ? valueOrFn(props)
    : valueOrFn != null
    ? valueOrFn
    : defaultValue;
}
