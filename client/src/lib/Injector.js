import provideInjector from './dependency-injection/provideInjector';
import provideContext from './dependency-injection/provideContext';
import withInjector from './dependency-injection/withInjector';
import inject from './dependency-injection/inject';
import injectGraphql from './dependency-injection/injectGraphql';
import * as graphqlTemplates from './dependency-injection/graphql/templates';
import loadComponent from './dependency-injection/loadComponent';
import Container from './dependency-injection/Container';
import InjectorContext from './dependency-injection/InjectorContext';

export {
  provideInjector,
  provideContext,
  withInjector,
  inject,
  injectGraphql,
  loadComponent,
  graphqlTemplates,
  InjectorContext,
};

export default Container;
