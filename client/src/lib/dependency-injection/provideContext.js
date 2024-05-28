import React, { Component } from 'react';
import injectorContextType from './injectorContextType';

const provideContext = (context) => (ContextualComponent) => {
  class ContextProvider extends Component {
    getChildContext() {
      return {
        injector: {
          ...this.context.injector,
          context,
        },
      };
    }

    render() {
      return <ContextualComponent {...this.props} />;
    }
  }

  ContextProvider.contextTypes = injectorContextType;

  ContextProvider.childContextTypes = injectorContextType;

  return ContextProvider;
};

export default provideContext;
