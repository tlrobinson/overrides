const React = require("react");
const { initializeOverrideWrappers } = require("./core");

function useOverrides(defaultComponents, overrides) {
  const overridesRef = React.useRef(overrides);
  overridesRef.current = overrides;
  return React.useMemo(
    () =>
      initializeOverrideWrappers(defaultComponents, () => overridesRef.current),
    [defaultComponents]
  );
}

module.exports = useOverrides;
