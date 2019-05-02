const React = require("react");
const { initializeOverrideWrappers } = require("./utils");

function useOverrides(props, defaultComponents) {
  const propsRef = React.useRef(props);
  propsRef.current = props;
  return React.useMemo(
    () => initializeOverrideWrappers(defaultComponents, () => propsRef.current),
    [defaultComponents]
  );
}

module.exports = useOverrides;
