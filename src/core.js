const React = require("react");

exports.initializeOverrideWrappers = function initializeOverrideWrappers(
  defaultComponents,
  getOverridesProp
) {
  // initialize component wrappers
  const components = {};
  for (const name of Object.keys(defaultComponents)) {
    components[name] = props => {
      const overrides = getOverridesProp() || {};
      const override = overrides[name];

      const [Component, mergedProps] = getOverrides(
        overrides[name],
        defaultComponents[name],
        props
      );

      return <Component {...mergedProps} />;
    };
    components[name].displayName = `${name}Overridable`;
  }
  return components;
};

export function getOverrides(override, Component, props = {}) {
  // component override shortcut:
  if (
    typeof override === "function" ||
    typeof override === "string" ||
    override instanceof React.Component
  ) {
    Component = override;
  } else if (override) {
    const { style, props: propsOverride, component, ...nested } = override;
    // assume at least one of the folllowing will override props, so clone
    props = { ...props };
    // component override:
    if (component) {
      Component = component;
    }
    // props override:
    if (propsOverride) {
      Object.assign(props, propsOverride);
    }
    // style override:
    if (style) {
      props.style = maybeMerge(
        props.style,
        typeof style === "function" ? style(props) : style
      );
      // TODO: support $style?
      // props.$style = style;
    }
    // nested overrides:
    if (Object.keys(nested).length > 0) {
      props.overrides = maybeMerge(props.overrides, nested);
    }
  }
  return [Component, props];
}

export function getComponents(defaultComponents, overrides) {
  return Object.keys(defaultComponents).reduce((acc, name) => {
    const [component, props] = getOverrides(
      overrides[name],
      defaultComponents[name]
    );
    acc[name] = { component, props };
    return acc;
  }, {});
}

function maybeMerge(a, b) {
  return a && b ? { ...a, ...b } : a || b;
}
