import React, { Component } from 'react';
import Injector from './Container';
import injectorContextType from './injectorContextType';
import InjectorContext from './InjectorContext';

/**
 * This provides injector for both legacy class components via childContext
 * as well as functional components via <InjectorContext.Provider>
 */
function provideInjector(Injectable, injectorContainer = Injector) {
  class InjectorProvider extends Component {
    getChildContext() {
      const { component, form, query } = injectorContainer;

      return {
        injector: {
          query: query.get.bind(query),
          get: component.get.bind(component),
          validate: form.getValidation.bind(form),
        },
      };
    }

    render() {
      const value = this.getChildContext();
      return <InjectorContext.Provider value={value}>
        <Injectable {...this.props} />
      </InjectorContext.Provider>;
    }
  }

  InjectorProvider.childContextTypes = injectorContextType;

  return InjectorProvider;
}

export default provideInjector;
