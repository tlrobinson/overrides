const React = require("react");
const { initializeOverrideWrappers } = require("./utils");

function withOverrides(defaultComponents) {
  return ComposedComponent =>
    class extends React.Component {
      static displayName = `withOverrides(${ComposedComponent.displayName ||
        ComposedComponent.name})`;

      constructor(props) {
        super(props);
        this.components = initializeOverrideWrappers(
          defaultComponents,
          () => this.props
        );
      }

      render() {
        const { overrides, ...props } = this.props;
        return <ComposedComponent {...props} {...this.components} />;
      }
    };
}

module.exports = withOverrides;
