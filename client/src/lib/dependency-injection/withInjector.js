import injectorContextType from './injectorContextType';

const withInjector = (Component) => {
  // eslint-disable-next-line no-param-reassign
  Component.contextTypes = {
    ...(Component.contextTypes || {}),
    ...injectorContextType,
  };
  // eslint-disable-next-line no-param-reassign
  Component.displayName = `withInjector(
    ${(Component.displayName || Component.name || 'Component')}
  )`;

  return Component;
};

export default withInjector;
