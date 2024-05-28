(self["webpackChunksilverstripe_admin"] = self["webpackChunksilverstripe_admin"] || []).push([["bundle"],{

/***/ "./client/src/boot/BootRoutes.js":
/*!***************************************!*\
  !*** ./client/src/boot/BootRoutes.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
var _Config = _interopRequireDefault(__webpack_require__(/*! lib/Config */ "./client/src/lib/Config.js"));
var _Router = _interopRequireDefault(__webpack_require__(/*! lib/Router */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Router.js"));
var _ReactRouteRegister = _interopRequireDefault(__webpack_require__(/*! lib/ReactRouteRegister */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ReactRouteRegister.js"));
var _App = _interopRequireDefault(__webpack_require__(/*! containers/App/App */ "./client/src/containers/App/App.js"));
var _client2 = __webpack_require__(/*! @apollo/client */ "./node_modules/@apollo/client/index.js");
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _getFormState = _interopRequireDefault(__webpack_require__(/*! lib/getFormState */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js"));
var _reactRouter = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/index.js");
var _urls = __webpack_require__(/*! lib/urls */ "./client/src/lib/urls.js");
var _NavigationBlocker = _interopRequireDefault(__webpack_require__(/*! ../components/NavigationBlocker/NavigationBlocker */ "./client/src/components/NavigationBlocker/NavigationBlocker.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class BootRoutes {
  constructor(store, client) {
    this.store = store;
    this.client = client;
    const base = _Config.default.get('absoluteBaseUrl');
    _Router.default.setAbsoluteBase(base);
    this.shouldConfirmBeforeUnload = this.shouldConfirmBeforeUnload.bind(this);
  }
  setStore(store) {
    this.store = store;
  }
  setClient(client) {
    this.client = client;
  }
  start(location) {
    if (this.matchesReactRoute(location)) {
      this.initReactRouter();
    } else {
      this.initLegacyRouter();
    }
    const currBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = () => {
      if (this.shouldConfirmBeforeUnload()) {
        return _i18n.default._t('Admin.CONFIRMUNSAVEDSHORT', 'WARNING: Your changes have not been saved.');
      }
      if (typeof currBeforeUnload === 'function') {
        return currBeforeUnload();
      }
      return undefined;
    };
  }
  matchesReactRoute(location) {
    const sections = _Config.default.get('sections');
    const currentPath = _Router.default.resolveURLToBase(location).replace(/\/$/, '');
    return !!sections.find(section => {
      const route = _Router.default.resolveURLToBase(section.url).replace(/\/$/, '');
      if (!section.reactRouter) {
        return false;
      }
      return currentPath.match(route);
    });
  }
  initReactRouter() {
    _ReactRouteRegister.default.updateRootRoute({
      component: _App.default
    });
    const rootRoute = _ReactRouteRegister.default.getRootRoute();
    const router = (0, _reactRouterDom.createBrowserRouter)((0, _reactRouterDom.createRoutesFromElements)(_react.default.createElement(_reactRouter.Route, {
      path: rootRoute.path,
      element: _react.default.createElement(rootRoute.component, null, _react.default.createElement(_NavigationBlocker.default, {
        shouldBlockFn: this.shouldConfirmBeforeUnload,
        blockMessage: this.getUnsavedChangesMessage()
      }))
    }, _ReactRouteRegister.default.getChildRoutes().map(route => _react.default.createElement(_reactRouter.Route, {
      key: route.path,
      path: route.path,
      element: _react.default.createElement(route.component, null)
    })))), {
      basename: (0, _urls.joinUrlPaths)(_Config.default.get('baseUrl'), _Config.default.get('adminUrl'))
    });
    (0, _client.createRoot)(document.getElementsByClassName('cms-content')[0]).render(_react.default.createElement(_client2.ApolloProvider, {
      client: this.client
    }, _react.default.createElement(_reactRedux.Provider, {
      store: this.store
    }, _react.default.createElement(_reactRouterDom.RouterProvider, {
      router: router
    }))));
  }
  initLegacyRouter() {
    const sections = _Config.default.get('sections');
    const store = this.store;
    (0, _Router.default)('*', (ctx, next) => {
      const msg = this.getUnsavedChangesMessage();
      if (!this.shouldConfirmBeforeUnload() || window.confirm(msg)) {
        ctx.store = store;
        next();
      }
    });
    let lastPath = null;
    sections.forEach(section => {
      let route = _Router.default.resolveURLToBase(section.url);
      route = route.replace(/\/$/, '');
      route = `${route}(/*?)?`;
      (0, _Router.default)(route, (ctx, next) => {
        if (document.readyState !== 'complete' || ctx.init) {
          next();
          return;
        }
        if (!lastPath) {
          lastPath = window.location.pathname;
        }
        const forceReload = ctx.state && ctx.state.__forceReload;
        if (ctx.path !== lastPath || forceReload) {
          lastPath = ctx.path.replace(/#.*$/, '');
          (0, _jquery.default)('.cms-container').entwine('ss').handleStateChange(null, ctx.state);
        }
      });
    });
    const root = (0, _client.createRoot)(document.createElement('div'));
    root.render(_react.default.createElement("a", {
      role: "none",
      onClick: () => {}
    }));
    _Router.default.start();
  }
  shouldConfirmBeforeUnload() {
    const state = this.store.getState();
    const forms = state.unsavedForms || [];
    const schemas = state.form.formSchemas;
    const changedForms = forms.filter(form => {
      const schema = Object.values(schemas).find(item => item.name === form.name);
      const notify = schema && schema.state && schema.state.notifyUnsavedChanges;
      if (!notify) {
        return false;
      }
      return (0, _reduxForm.isDirty)(form.name, _getFormState.default)(state);
    });
    return changedForms.length > 0;
  }
  getUnsavedChangesMessage() {
    return _i18n.default._t('Admin.CONFIRMUNSAVED', `Are you sure you want to navigate away
    from this page?\n\nWARNING: Your changes have not been saved.\n\n
    Press OK to continue, or Cancel to stay on the current page.`);
  }
}
var _default = exports["default"] = BootRoutes;

/***/ }),

/***/ "./client/src/boot/apollo/buildCache.js":
/*!**********************************************!*\
  !*** ./client/src/boot/apollo/buildCache.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _cache = __webpack_require__(/*! @apollo/client/cache */ "./node_modules/@apollo/client/cache/index.js");
var _dataIdFromObject = _interopRequireDefault(__webpack_require__(/*! ./dataIdFromObject */ "./client/src/boot/apollo/dataIdFromObject.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const buildCache = introspectionQueryResultData => {
  const possibleTypes = {};
  if (introspectionQueryResultData) {
    introspectionQueryResultData.__schema.types.forEach(supertype => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] = supertype.possibleTypes.map(subtype => subtype.name);
      }
    });
  }
  return new _cache.InMemoryCache({
    possibleTypes,
    dataIdFromObject: _dataIdFromObject.default,
    addTypename: true
  });
};
var _default = exports["default"] = buildCache;

/***/ }),

/***/ "./client/src/boot/apollo/buildClient.js":
/*!***********************************************!*\
  !*** ./client/src/boot/apollo/buildClient.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _client = __webpack_require__(/*! @apollo/client */ "./node_modules/@apollo/client/index.js");
var _Config = _interopRequireDefault(__webpack_require__(/*! lib/Config */ "./client/src/lib/Config.js"));
var _getGraphqlFragments = _interopRequireDefault(__webpack_require__(/*! ./getGraphqlFragments */ "./client/src/boot/apollo/getGraphqlFragments.js"));
var _buildNetworkComponents = _interopRequireDefault(__webpack_require__(/*! ./buildNetworkComponents */ "./client/src/boot/apollo/buildNetworkComponents.js"));
var _buildCache = _interopRequireDefault(__webpack_require__(/*! ./buildCache */ "./client/src/boot/apollo/buildCache.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const buildClient = async baseUrl => {
  const graphQLConfig = _Config.default.getSection('SilverStripe\\Admin\\LeftAndMain').graphql;
  const cachedTypenames = graphQLConfig && graphQLConfig.cachedTypenames;
  let fragmentData;
  try {
    fragmentData = await (0, _getGraphqlFragments.default)(baseUrl, cachedTypenames);
  } catch (e) {
    fragmentData = null;
  }
  const cache = (0, _buildCache.default)(fragmentData);
  const components = (0, _buildNetworkComponents.default)(baseUrl);
  const link = (0, _client.from)(components);
  return new _client.ApolloClient({
    cache,
    link
  });
};
var _default = exports["default"] = buildClient;

/***/ }),

/***/ "./client/src/boot/apollo/buildNetworkComponents.js":
/*!**********************************************************!*\
  !*** ./client/src/boot/apollo/buildNetworkComponents.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _client = __webpack_require__(/*! @apollo/client */ "./node_modules/@apollo/client/index.js");
var _error = __webpack_require__(/*! @apollo/client/link/error */ "./node_modules/@apollo/client/link/error/index.js");
var _Config = _interopRequireDefault(__webpack_require__(/*! lib/Config */ "./client/src/lib/Config.js"));
var _urls = __webpack_require__(/*! lib/urls */ "./client/src/lib/urls.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const buildNetworkComponents = baseUrl => {
  const httpLink = new _client.HttpLink({
    uri: (0, _urls.joinUrlPaths)(baseUrl, 'admin/graphql'),
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json'
      }
    }
  });
  const errorLink = (0, _error.onError)(_ref => {
    let {
      networkError
    } = _ref;
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
  const middlewareLink = new _client.ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        'X-CSRF-TOKEN': _Config.default.get('SecurityID')
      }
    });
    return forward(operation);
  });
  return [middlewareLink, errorLink, httpLink];
};
var _default = exports["default"] = buildNetworkComponents;

/***/ }),

/***/ "./client/src/boot/apollo/dataIdFromObject.js":
/*!****************************************************!*\
  !*** ./client/src/boot/apollo/dataIdFromObject.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const dataIdFromObject = o => {
  const dataId = o.id || o.ID;
  if (dataId && dataId >= 0 && o.__typename) {
    return `${o.__typename}:${dataId}`;
  }
  return null;
};
var _default = exports["default"] = dataIdFromObject;

/***/ }),

/***/ "./client/src/boot/apollo/getGraphqlFragments.js":
/*!*******************************************************!*\
  !*** ./client/src/boot/apollo/getGraphqlFragments.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _urls = __webpack_require__(/*! lib/urls */ "./client/src/lib/urls.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const parseResponse = result => {
  const fragmentData = result.data;
  fragmentData.__schema.types = fragmentData.__schema.types.filter(type => type.possibleTypes !== null);
  return fragmentData;
};
const handleError = response => {
  if (!response.ok) {
    throw new Error(`The types.graphql file could not be loaded. You probably need to run a ?flush to generate it.
            Alternatively, you can use the IntrospectionProvider extension to generate the file dynamically.
            More information: https://github.com/silverstripe/silverstripe-graphql/#schema-introspection`);
  }
  return response;
};
const getGraphqlFragments = async function (baseUrl) {
  let preferStatic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const isLegacy = !!document.body.getAttribute('data-graphql-legacy');
  const urls = [(0, _urls.joinUrlPaths)(baseUrl, '_graphql/admin.types.graphql'), (0, _urls.joinUrlPaths)(baseUrl, 'admin.types.graphql')];
  const legacyURLs = [(0, _urls.joinUrlPaths)(baseUrl, 'admin/graphql/types'), (0, _urls.joinUrlPaths)(baseUrl, 'assets/admin.types.graphql')];
  let primaryURL;
  let fallbackURL;
  if (isLegacy) {
    if (preferStatic) {
      legacyURLs.reverse();
    }
    [primaryURL, fallbackURL] = legacyURLs;
  } else {
    [primaryURL, fallbackURL] = urls;
  }
  const fetchConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    uri: baseUrl,
    credentials: 'same-origin'
  };
  const fetchSchema = async url => (0, _isomorphicFetch.default)(url, fetchConfig).then(handleError).then(result => result.json()).then(parseResponse);
  let response;
  try {
    response = await fetchSchema(primaryURL);
  } catch (e) {
    if (!fallbackURL) {
      return Promise.reject(e);
    }
    try {
      response = await fetchSchema(fallbackURL);
    } catch (finalError) {
      return Promise.reject(finalError);
    }
  }
  return Promise.resolve(response);
};
var _default = exports["default"] = getGraphqlFragments;

/***/ }),

/***/ "./client/src/boot/applyDevtools.js":
/*!******************************************!*\
  !*** ./client/src/boot/applyDevtools.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = applyDevtools;
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
function applyDevtools(middleware) {
  const composeExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;
  if (typeof composeExtension === 'function') {
    return composeExtension(middleware);
  }
  if (typeof devTools === 'function') {
    return (0, _redux.compose)(middleware, devTools());
  }
  return middleware;
}

/***/ }),

/***/ "./client/src/boot/applyTransforms.js":
/*!********************************************!*\
  !*** ./client/src/boot/applyTransforms.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _Injector = _interopRequireDefault(__webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js"));
var _Validator = _interopRequireDefault(__webpack_require__(/*! lib/Validator */ "./client/src/lib/Validator.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _schemaFieldValues = __webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js");
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const togglePristineState = function (field) {
  let isPristine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const classes = field.extraClass ? field.extraClass.split(' ').reduce((prev, className) => ({
    ...prev,
    [className]: true
  }), {}) : {};
  if (typeof field.data.pristineClass === 'string') {
    classes[field.data.pristineClass] = isPristine;
  }
  if (typeof field.data.dirtyClass === 'string') {
    classes[field.data.dirtyClass] = !isPristine;
  }
  const customTitle = isPristine ? field.data.pristineTitle : field.data.dirtyTitle;
  const customIcon = isPristine ? field.data.pristineIcon : field.data.dirtyIcon;
  return {
    ...field,
    title: customTitle || field.title,
    icon: customIcon || field.icon,
    extraClass: (0, _classnames.default)(classes)
  };
};
const applyTransforms = () => {
  _Injector.default.transform('field-holders', updater => {
    const fields = ['FieldGroup'];
    fields.forEach(field => updater.component('FieldGroup', _FieldHolder.default, `${field}Holder`));
  });
  _Injector.default.transform('form-action-changed', updater => {
    updater.form.alterSchema('*', form => {
      form.mutateField('action_save', field => {
        const isPristine = form.isPristine();
        return togglePristineState(field, isPristine);
      });
      form.mutateField('action_publish', field => {
        const isPristine = field.data.isPublished && !field.data.isModified && form.isPristine();
        return togglePristineState(field, isPristine);
      });
      return form.getState();
    });
  });
  _Injector.default.transform('schema-validation', updater => {
    updater.form.addValidation('*', (values, Validation, schema) => {
      const validator = new _Validator.default(values);
      const errorMap = Object.keys(values).reduce((curr, key) => {
        const field = (0, _schemaFieldValues.findField)(schema.fields, key);
        if (!field) {
          return curr;
        }
        const {
          valid,
          errors
        } = validator.validateFieldSchema(field);
        if (valid) {
          return curr;
        }
        return {
          ...curr,
          [key]: errors
        };
      }, {});
      Validation.addErrors(errorMap);
      return Validation.getState();
    });
  });
};
var _default = exports["default"] = applyTransforms;

/***/ }),

/***/ "./client/src/boot/index.js":
/*!**********************************!*\
  !*** ./client/src/boot/index.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _Injector = _interopRequireDefault(__webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js"));
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _reduxThunk = _interopRequireDefault(__webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/es/index.js"));
var _Config = _interopRequireDefault(__webpack_require__(/*! lib/Config */ "./client/src/lib/Config.js"));
var _buildClient = _interopRequireDefault(__webpack_require__(/*! boot/apollo/buildClient */ "./client/src/boot/apollo/buildClient.js"));
var _ConfigActions = __webpack_require__(/*! state/config/ConfigActions */ "./client/src/state/config/ConfigActions.js");
var _registerComponents = _interopRequireDefault(__webpack_require__(/*! boot/registerComponents */ "./client/src/boot/registerComponents.js"));
var _registerReducers = _interopRequireDefault(__webpack_require__(/*! boot/registerReducers */ "./client/src/boot/registerReducers.js"));
var _applyDevtools = _interopRequireDefault(__webpack_require__(/*! boot/applyDevtools */ "./client/src/boot/applyDevtools.js"));
var _applyTransforms = _interopRequireDefault(__webpack_require__(/*! boot/applyTransforms */ "./client/src/boot/applyTransforms.js"));
var _BootRoutes = _interopRequireDefault(__webpack_require__(/*! ./BootRoutes */ "./client/src/boot/BootRoutes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
window.ss = window.ss || {};
async function appBoot() {
  const baseUrl = _Config.default.get('absoluteBaseUrl');
  const apolloClient = await (0, _buildClient.default)(baseUrl);
  (0, _registerComponents.default)();
  (0, _registerReducers.default)();
  const middleware = [_reduxThunk.default];
  const debugging = _Config.default.get('debugging');
  let runMiddleware = (0, _redux.applyMiddleware)(...middleware);
  if (debugging) {
    runMiddleware = (0, _applyDevtools.default)(runMiddleware);
  }
  const createStoreWithMiddleware = runMiddleware(_redux.createStore);
  window.ss.apolloClient = apolloClient;
  const routes = new _BootRoutes.default(null, apolloClient);
  (0, _applyTransforms.default)();
  _Injector.default.init(() => {
    const rootReducer = (0, _redux.combineReducers)(_Injector.default.reducer.getAll());
    const store = createStoreWithMiddleware(rootReducer, {});
    store.dispatch((0, _ConfigActions.setConfig)(_Config.default.getAll()));
    _Injector.default.reducer.setStore(store);
    window.ss.store = store;
    routes.setStore(store);
    routes.start(window.location.pathname);
    if (window.jQuery) {
      window.jQuery('body').addClass('js-react-boot').addClass('js-injector-boot');
    }
  });
  window.setTimeout(() => _Injector.default.load(), 0);
}
window.onload = appBoot;

/***/ }),

/***/ "./client/src/boot/registerComponents.js":
/*!***********************************************!*\
  !*** ./client/src/boot/registerComponents.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _Injector = _interopRequireDefault(__webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js"));
var _ActionMenu = _interopRequireDefault(__webpack_require__(/*! components/ActionMenu/ActionMenu */ "./client/src/components/ActionMenu/ActionMenu.js"));
var _Badge = _interopRequireDefault(__webpack_require__(/*! components/Badge/Badge */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Badge/Badge.js"));
var _Button = _interopRequireDefault(__webpack_require__(/*! components/Button/Button */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js"));
var _BackButton = _interopRequireDefault(__webpack_require__(/*! components/Button/BackButton */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/BackButton.js"));
var _TextField = _interopRequireDefault(__webpack_require__(/*! components/TextField/TextField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TextField/TextField.js"));
var _HiddenField = _interopRequireDefault(__webpack_require__(/*! components/HiddenField/HiddenField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/HiddenField/HiddenField.js"));
var _DateField = _interopRequireDefault(__webpack_require__(/*! components/DateField/DateField */ "./client/src/components/DateField/DateField.js"));
var _TimeField = _interopRequireDefault(__webpack_require__(/*! components/TimeField/TimeField */ "./client/src/components/TimeField/TimeField.js"));
var _DatetimeField = _interopRequireDefault(__webpack_require__(/*! components/DatetimeField/DatetimeField */ "./client/src/components/DatetimeField/DatetimeField.js"));
var _CheckboxField = _interopRequireDefault(__webpack_require__(/*! components/CheckboxField/CheckboxField */ "./client/src/components/CheckboxField/CheckboxField.js"));
var _CheckboxSetField = _interopRequireDefault(__webpack_require__(/*! components/CheckboxSetField/CheckboxSetField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/CheckboxSetField/CheckboxSetField.js"));
var _OptionsetField = _interopRequireDefault(__webpack_require__(/*! components/OptionsetField/OptionsetField */ "./client/src/components/OptionsetField/OptionsetField.js"));
var _GridField = _interopRequireDefault(__webpack_require__(/*! components/GridField/GridField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridField.js"));
var _GridFieldActions = _interopRequireDefault(__webpack_require__(/*! components/GridFieldActions/GridFieldActions */ "./client/src/components/GridFieldActions/GridFieldActions.js"));
var _SingleSelectField = _interopRequireDefault(__webpack_require__(/*! components/SingleSelectField/SingleSelectField */ "./client/src/components/SingleSelectField/SingleSelectField.js"));
var _PopoverField = _interopRequireDefault(__webpack_require__(/*! components/PopoverField/PopoverField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/PopoverField/PopoverField.js"));
var _HeaderField = _interopRequireDefault(__webpack_require__(/*! components/HeaderField/HeaderField */ "./client/src/components/HeaderField/HeaderField.js"));
var _LiteralField = _interopRequireDefault(__webpack_require__(/*! components/LiteralField/LiteralField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/LiteralField/LiteralField.js"));
var _HtmlReadonlyField = _interopRequireDefault(__webpack_require__(/*! components/HtmlReadonlyField/HtmlReadonlyField */ "./client/src/components/HtmlReadonlyField/HtmlReadonlyField.js"));
var _LookupField = _interopRequireDefault(__webpack_require__(/*! components/LookupField/LookupField */ "./client/src/components/LookupField/LookupField.js"));
var _CompositeField = _interopRequireDefault(__webpack_require__(/*! components/CompositeField/CompositeField */ "./client/src/components/CompositeField/CompositeField.js"));
var _LabelField = _interopRequireDefault(__webpack_require__(/*! components/LabelField/LabelField */ "./client/src/components/LabelField/LabelField.js"));
var _Tabs = _interopRequireDefault(__webpack_require__(/*! components/Tabs/Tabs */ "./client/src/components/Tabs/Tabs.js"));
var _TabItem = _interopRequireDefault(__webpack_require__(/*! components/Tabs/TabItem */ "./client/src/components/Tabs/TabItem.js"));
var _FormAction = _interopRequireDefault(__webpack_require__(/*! components/FormAction/FormAction */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAction/FormAction.js"));
var _FieldGroup = _interopRequireDefault(__webpack_require__(/*! components/FieldGroup/FieldGroup */ "./client/src/components/FieldGroup/FieldGroup.js"));
var _TreeDropdownField = _interopRequireDefault(__webpack_require__(/*! components/TreeDropdownField/TreeDropdownField */ "./client/src/components/TreeDropdownField/TreeDropdownField.js"));
var _FormBuilderModal = _interopRequireDefault(__webpack_require__(/*! components/FormBuilderModal/FormBuilderModal */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilderModal/FormBuilderModal.js"));
var _NotFoundComponent = _interopRequireDefault(__webpack_require__(/*! components/NotFoundComponent/NotFoundComponent */ "./client/src/components/NotFoundComponent/NotFoundComponent.js"));
var _Form = _interopRequireDefault(__webpack_require__(/*! components/Form/Form */ "./client/src/components/Form/Form.js"));
var _FormAlert = _interopRequireDefault(__webpack_require__(/*! components/FormAlert/FormAlert */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAlert/FormAlert.js"));
var _Preview = _interopRequireDefault(__webpack_require__(/*! components/Preview/Preview */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Preview/Preview.js"));
var _Form2 = _interopRequireDefault(__webpack_require__(/*! containers/Form/Form */ "./client/src/containers/Form/Form.js"));
var _UsedOnTable = _interopRequireDefault(__webpack_require__(/*! components/UsedOnTable/UsedOnTable */ "./client/src/components/UsedOnTable/UsedOnTable.js"));
var _Loading = _interopRequireDefault(__webpack_require__(/*! components/Loading/Loading */ "./client/src/components/Loading/Loading.js"));
var _CircularLoading = _interopRequireDefault(__webpack_require__(/*! components/Loading/CircularLoading */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Loading/CircularLoading.js"));
var _VersionedBadge = _interopRequireDefault(__webpack_require__(/*! components/VersionedBadge/VersionedBadge */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/VersionedBadge/VersionedBadge.js"));
var _ViewModeToggle = _interopRequireDefault(__webpack_require__(/*! components/ViewModeToggle/ViewModeToggle */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ViewModeToggle/ViewModeToggle.js"));
var _ResizeAware = _interopRequireDefault(__webpack_require__(/*! components/ResizeAware/ResizeAware */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ResizeAware/ResizeAware.js"));
var _Tag = _interopRequireDefault(__webpack_require__(/*! components/Tag/Tag */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/Tag.js"));
var _TagList = _interopRequireDefault(__webpack_require__(/*! components/Tag/TagList */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/TagList.js"));
var _CompactTagList = _interopRequireDefault(__webpack_require__(/*! components/Tag/CompactTagList */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/CompactTagList.js"));
var _Tip = _interopRequireDefault(__webpack_require__(/*! components/Tip/Tip */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tip/Tip.js"));
var _Search = _interopRequireDefault(__webpack_require__(/*! components/Search/Search */ "./client/src/components/Search/Search.js"));
var _SearchToggle = _interopRequireDefault(__webpack_require__(/*! components/Search/SearchToggle */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Search/SearchToggle.js"));
var _HtmlEditorField = _interopRequireDefault(__webpack_require__(/*! components/HtmlEditorField/HtmlEditorField */ "./client/src/components/HtmlEditorField/HtmlEditorField.js"));
var _NumberField = _interopRequireDefault(__webpack_require__(/*! components/NumberField/NumberField */ "./client/src/components/NumberField/NumberField.js"));
var _PopoverOptionSet = _interopRequireDefault(__webpack_require__(/*! components/PopoverOptionSet/PopoverOptionSet */ "./client/src/components/PopoverOptionSet/PopoverOptionSet.js"));
var _ToastsContainer = _interopRequireDefault(__webpack_require__(/*! containers/ToastsContainer/ToastsContainer */ "./client/src/containers/ToastsContainer/ToastsContainer.js"));
var _ListboxField = _interopRequireDefault(__webpack_require__(/*! components/ListboxField/ListboxField */ "./client/src/components/ListboxField/ListboxField.js"));
var _SearchableDropdownField = _interopRequireDefault(__webpack_require__(/*! components/SearchableDropdownField/SearchableDropdownField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/SearchableDropdownField/SearchableDropdownField.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = () => {
  _Injector.default.component.registerMany({
    ActionMenu: _ActionMenu.default,
    Badge: _Badge.default,
    Button: _Button.default,
    BackButton: _BackButton.default,
    TextField: _TextField.default,
    HiddenField: _HiddenField.default,
    DateField: _DateField.default,
    TimeField: _TimeField.default,
    DatetimeField: _DatetimeField.default,
    CheckboxField: _CheckboxField.default,
    CheckboxSetField: _CheckboxSetField.default,
    OptionsetField: _OptionsetField.default,
    GridField: _GridField.default,
    GridFieldActions: _GridFieldActions.default,
    FieldGroup: _FieldGroup.default,
    SingleSelectField: _SingleSelectField.default,
    PopoverField: _PopoverField.default,
    HeaderField: _HeaderField.default,
    LiteralField: _LiteralField.default,
    HtmlReadonlyField: _HtmlReadonlyField.default,
    LookupField: _LookupField.default,
    CompositeField: _CompositeField.default,
    Tabs: _Tabs.default,
    TabItem: _TabItem.default,
    FormAction: _FormAction.default,
    LabelField: _LabelField.default,
    TreeDropdownField: _TreeDropdownField.default,
    Preview: _Preview.default,
    ReduxForm: _Form2.default,
    ReduxFormField: _reduxForm.Field,
    Form: _Form.default,
    FormAlert: _FormAlert.default,
    FormBuilderModal: _FormBuilderModal.default,
    NotFoundComponent: _NotFoundComponent.default,
    UsedOnTable: _UsedOnTable.default,
    Loading: _Loading.default,
    CircularLoading: _CircularLoading.default,
    VersionedBadge: _VersionedBadge.default,
    ViewModeToggle: _ViewModeToggle.default,
    ResizeAware: _ResizeAware.default,
    Tag: _Tag.default,
    TagList: _TagList.default,
    CompactTagList: _CompactTagList.default,
    Tip: _Tip.default,
    Search: _Search.default,
    SearchToggle: _SearchToggle.default,
    HtmlEditorField: _HtmlEditorField.default,
    NumberField: _NumberField.default,
    PopoverOptionSet: _PopoverOptionSet.default,
    ToastsContainer: _ToastsContainer.default,
    ListboxField: _ListboxField.default,
    SearchableDropdownField: _SearchableDropdownField.default
  });
};
exports["default"] = _default;

/***/ }),

/***/ "./client/src/boot/registerReducers.js":
/*!*********************************************!*\
  !*** ./client/src/boot/registerReducers.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _Injector = _interopRequireDefault(__webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js"));
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _ConfigReducer = _interopRequireDefault(__webpack_require__(/*! state/config/ConfigReducer */ "./client/src/state/config/ConfigReducer.js"));
var _SchemaReducer = _interopRequireDefault(__webpack_require__(/*! state/schema/SchemaReducer */ "./client/src/state/schema/SchemaReducer.js"));
var _RecordsReducer = _interopRequireDefault(__webpack_require__(/*! state/records/RecordsReducer */ "./client/src/state/records/RecordsReducer.js"));
var _BreadcrumbsReducer = _interopRequireDefault(__webpack_require__(/*! state/breadcrumbs/BreadcrumbsReducer */ "./client/src/state/breadcrumbs/BreadcrumbsReducer.js"));
var _TreeDropdownFieldReducer = _interopRequireDefault(__webpack_require__(/*! state/treeDropdownField/TreeDropdownFieldReducer */ "./client/src/state/treeDropdownField/TreeDropdownFieldReducer.js"));
var _TabsReducer = _interopRequireDefault(__webpack_require__(/*! state/tabs/TabsReducer */ "./client/src/state/tabs/TabsReducer.js"));
var _MobileMenuReducer = _interopRequireDefault(__webpack_require__(/*! state/mobileMenu/MobileMenuReducer */ "./client/src/state/mobileMenu/MobileMenuReducer.js"));
var _UnsavedFormsReducer = _interopRequireDefault(__webpack_require__(/*! state/unsavedForms/UnsavedFormsReducer */ "./client/src/state/unsavedForms/UnsavedFormsReducer.js"));
var _usedOnReducer = _interopRequireDefault(__webpack_require__(/*! state/usedOn/usedOnReducer */ "./client/src/state/usedOn/usedOnReducer.js"));
var _applyFormMiddleware = _interopRequireDefault(__webpack_require__(/*! lib/dependency-injection/applyFormMiddleware */ "./client/src/lib/dependency-injection/applyFormMiddleware.js"));
var _ViewModeReducer = _interopRequireDefault(__webpack_require__(/*! state/viewMode/ViewModeReducer */ "./client/src/state/viewMode/ViewModeReducer.js"));
var _ToastsReducer = _interopRequireDefault(__webpack_require__(/*! state/toasts/ToastsReducer */ "./client/src/state/toasts/ToastsReducer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports["default"] = function _default() {
  let extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const FormReducer = (0, _redux.combineReducers)({
    formState: _reduxForm.reducer,
    formSchemas: _SchemaReducer.default
  });
  _Injector.default.reducer.registerMany({
    config: _ConfigReducer.default,
    form: FormReducer,
    records: _RecordsReducer.default,
    breadcrumbs: _BreadcrumbsReducer.default,
    treeDropdownField: _TreeDropdownFieldReducer.default,
    tabs: _TabsReducer.default,
    mobileMenu: _MobileMenuReducer.default,
    unsavedForms: _UnsavedFormsReducer.default,
    usedOn: _usedOnReducer.default,
    viewMode: _ViewModeReducer.default,
    toasts: _ToastsReducer.default,
    ...extra
  });
  _Injector.default.transform('admin', updater => {
    updater.reducer('form', _applyFormMiddleware.default);
  });
};

/***/ }),

/***/ "./client/src/bundles/bundle.js":
/*!**************************************!*\
  !*** ./client/src/bundles/bundle.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! i18n.js */ "./client/src/i18n.js");
__webpack_require__(/*! expose-loader?exposes=SilverStripeComponent!lib/SilverStripeComponent */ "./node_modules/expose-loader/dist/cjs.js?exposes=SilverStripeComponent!./client/src/lib/SilverStripeComponent.js");
__webpack_require__(/*! expose-loader?exposes=Backend!lib/Backend */ "./node_modules/expose-loader/dist/cjs.js?exposes=Backend!./client/src/lib/Backend.js");
__webpack_require__(/*! expose-loader?exposes=schemaFieldValues!lib/schemaFieldValues */ "./node_modules/expose-loader/dist/cjs.js?exposes=schemaFieldValues!./client/src/lib/schemaFieldValues.js");
__webpack_require__(/*! expose-loader?exposes=FormAlert!components/FormAlert/FormAlert */ "./node_modules/expose-loader/dist/cjs.js?exposes=FormAlert!./client/src/components/FormAlert/FormAlert.js");
__webpack_require__(/*! expose-loader?exposes=Injector!lib/Injector */ "./node_modules/expose-loader/dist/cjs.js?exposes=Injector!./client/src/lib/Injector.js");
__webpack_require__(/*! expose-loader?exposes=reduxFieldReducer!lib/reduxFieldReducer */ "./node_modules/expose-loader/dist/cjs.js?exposes=reduxFieldReducer!./client/src/lib/reduxFieldReducer.js");
__webpack_require__(/*! expose-loader?exposes=getFormState!lib/getFormState */ "./node_modules/expose-loader/dist/cjs.js?exposes=getFormState!./client/src/lib/getFormState.js");
__webpack_require__(/*! expose-loader?exposes=PopoverField!components/PopoverField/PopoverField */ "./node_modules/expose-loader/dist/cjs.js?exposes=PopoverField!./client/src/components/PopoverField/PopoverField.js");
__webpack_require__(/*! expose-loader?exposes=FieldHolder!components/FieldHolder/FieldHolder */ "./node_modules/expose-loader/dist/cjs.js?exposes=FieldHolder!./client/src/components/FieldHolder/FieldHolder.js");
__webpack_require__(/*! expose-loader?exposes=Form!components/Form/Form */ "./node_modules/expose-loader/dist/cjs.js?exposes=Form!./client/src/components/Form/Form-exposed.js");
__webpack_require__(/*! expose-loader?exposes=FormConstants!components/Form/FormConstants */ "./node_modules/expose-loader/dist/cjs.js?exposes=FormConstants!./client/src/components/Form/FormConstants.js");
__webpack_require__(/*! expose-loader?exposes=FormAction!components/FormAction/FormAction */ "./node_modules/expose-loader/dist/cjs.js?exposes=FormAction!./client/src/components/FormAction/FormAction.js");
__webpack_require__(/*! expose-loader?exposes=SchemaActions!state/schema/SchemaActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=SchemaActions!./client/src/state/schema/SchemaActions.js");
__webpack_require__(/*! expose-loader?exposes=ToastsActions!state/toasts/ToastsActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=ToastsActions!./client/src/state/toasts/ToastsActions.js");
__webpack_require__(/*! expose-loader?exposes=FileStatusIcon!components/FileStatusIcon/FileStatusIcon */ "./node_modules/expose-loader/dist/cjs.js?exposes=FileStatusIcon!./client/src/components/FileStatusIcon/FileStatusIcon.js");
__webpack_require__(/*! expose-loader?exposes=FormBuilder!components/FormBuilder/FormBuilder */ "./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilder!./client/src/components/FormBuilder/FormBuilder.js");
__webpack_require__(/*! expose-loader?exposes=FormBuilderLoader!containers/FormBuilderLoader/FormBuilderLoader */ "./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilderLoader!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js");
__webpack_require__(/*! expose-loader?exposes=Modal!components/Modal/Modal */ "./node_modules/expose-loader/dist/cjs.js?exposes=Modal!./client/src/components/Modal/Modal.js");
__webpack_require__(/*! expose-loader?exposes=FormBuilderModal!components/FormBuilderModal/FormBuilderModal */ "./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilderModal!./client/src/components/FormBuilderModal/FormBuilderModal.js");
__webpack_require__(/*! expose-loader?exposes=FileSchemaModalHandler!containers/InsertLinkModal/fileSchemaModalHandler */ "./node_modules/expose-loader/dist/cjs.js?exposes=FileSchemaModalHandler!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js");
__webpack_require__(/*! expose-loader?exposes=InsertLinkModal!containers/InsertLinkModal/InsertLinkModal */ "./node_modules/expose-loader/dist/cjs.js?exposes=InsertLinkModal!./client/src/containers/InsertLinkModal/InsertLinkModal.js");
__webpack_require__(/*! expose-loader?exposes=SudoMode!containers/SudoMode/SudoMode */ "./node_modules/expose-loader/dist/cjs.js?exposes=SudoMode!./client/src/containers/SudoMode/SudoMode.js");
__webpack_require__(/*! expose-loader?exposes=RecordsActions!state/records/RecordsActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=RecordsActions!./client/src/state/records/RecordsActions.js");
__webpack_require__(/*! expose-loader?exposes=GridField!components/GridField/GridField */ "./node_modules/expose-loader/dist/cjs.js?exposes=GridField!./client/src/components/GridField/GridField.js");
__webpack_require__(/*! expose-loader?exposes=GridFieldCell!components/GridField/GridFieldCell */ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldCell!./client/src/components/GridField/GridFieldCell.js");
__webpack_require__(/*! expose-loader?exposes=GridFieldHeader!components/GridField/GridFieldHeader */ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldHeader!./client/src/components/GridField/GridFieldHeader.js");
__webpack_require__(/*! expose-loader?exposes=GridFieldHeaderCell!components/GridField/GridFieldHeaderCell */ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldHeaderCell!./client/src/components/GridField/GridFieldHeaderCell.js");
__webpack_require__(/*! expose-loader?exposes=GridFieldRow!components/GridField/GridFieldRow */ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldRow!./client/src/components/GridField/GridFieldRow.js");
__webpack_require__(/*! expose-loader?exposes=GridFieldTable!components/GridField/GridFieldTable */ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldTable!./client/src/components/GridField/GridFieldTable.js");
__webpack_require__(/*! expose-loader?exposes=Accordion!components/Accordion/Accordion */ "./node_modules/expose-loader/dist/cjs.js?exposes=Accordion!./client/src/components/Accordion/Accordion.js");
__webpack_require__(/*! expose-loader?exposes=AccordionBlock!components/Accordion/AccordionBlock */ "./node_modules/expose-loader/dist/cjs.js?exposes=AccordionBlock!./client/src/components/Accordion/AccordionBlock.js");
__webpack_require__(/*! expose-loader?exposes=Button!components/Button/Button */ "./node_modules/expose-loader/dist/cjs.js?exposes=Button!./client/src/components/Button/Button.js");
__webpack_require__(/*! expose-loader?exposes=BackButton!components/Button/BackButton */ "./node_modules/expose-loader/dist/cjs.js?exposes=BackButton!./client/src/components/Button/BackButton.js");
__webpack_require__(/*! expose-loader?exposes=HiddenField!components/HiddenField/HiddenField */ "./node_modules/expose-loader/dist/cjs.js?exposes=HiddenField!./client/src/components/HiddenField/HiddenField.js");
__webpack_require__(/*! expose-loader?exposes=ListGroup!components/ListGroup/ListGroup */ "./node_modules/expose-loader/dist/cjs.js?exposes=ListGroup!./client/src/components/ListGroup/ListGroup.js");
__webpack_require__(/*! expose-loader?exposes=ListGroupItem!components/ListGroup/ListGroupItem */ "./node_modules/expose-loader/dist/cjs.js?exposes=ListGroupItem!./client/src/components/ListGroup/ListGroupItem.js");
__webpack_require__(/*! expose-loader?exposes=Loading!components/Loading/Loading */ "./node_modules/expose-loader/dist/cjs.js?exposes=Loading!./client/src/components/Loading/Loading.js");
__webpack_require__(/*! expose-loader?exposes=CircularLoading!components/Loading/CircularLoading */ "./node_modules/expose-loader/dist/cjs.js?exposes=CircularLoading!./client/src/components/Loading/CircularLoading.js");
__webpack_require__(/*! expose-loader?exposes=TextField!components/TextField/TextField */ "./node_modules/expose-loader/dist/cjs.js?exposes=TextField!./client/src/components/TextField/TextField.js");
__webpack_require__(/*! expose-loader?exposes=LiteralField!components/LiteralField/LiteralField */ "./node_modules/expose-loader/dist/cjs.js?exposes=LiteralField!./client/src/components/LiteralField/LiteralField.js");
__webpack_require__(/*! expose-loader?exposes=Toolbar!components/Toolbar/Toolbar */ "./node_modules/expose-loader/dist/cjs.js?exposes=Toolbar!./client/src/components/Toolbar/Toolbar.js");
__webpack_require__(/*! expose-loader?exposes=Breadcrumb!components/Breadcrumb/Breadcrumb */ "./node_modules/expose-loader/dist/cjs.js?exposes=Breadcrumb!./client/src/components/Breadcrumb/Breadcrumb.js");
__webpack_require__(/*! expose-loader?exposes=ResizeAware!components/ResizeAware/ResizeAware */ "./node_modules/expose-loader/dist/cjs.js?exposes=ResizeAware!./client/src/components/ResizeAware/ResizeAware.js");
__webpack_require__(/*! expose-loader?exposes=TabsActions!state/tabs/TabsActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=TabsActions!./client/src/state/tabs/TabsActions.js");
__webpack_require__(/*! expose-loader?exposes=Tag!components/Tag/Tag */ "./node_modules/expose-loader/dist/cjs.js?exposes=Tag!./client/src/components/Tag/Tag.js");
__webpack_require__(/*! expose-loader?exposes=TagList!components/Tag/TagList */ "./node_modules/expose-loader/dist/cjs.js?exposes=TagList!./client/src/components/Tag/TagList.js");
__webpack_require__(/*! expose-loader?exposes=CompactTagList!components/Tag/CompactTagList */ "./node_modules/expose-loader/dist/cjs.js?exposes=CompactTagList!./client/src/components/Tag/CompactTagList.js");
__webpack_require__(/*! expose-loader?exposes=Tip!components/Tip/Tip */ "./node_modules/expose-loader/dist/cjs.js?exposes=Tip!./client/src/components/Tip/Tip.js");
__webpack_require__(/*! expose-loader?exposes=Search!components/Search/Search */ "./node_modules/expose-loader/dist/cjs.js?exposes=Search!./client/src/components/Search/Search.js");
__webpack_require__(/*! expose-loader?exposes=SearchToggle!components/Search/SearchToggle */ "./node_modules/expose-loader/dist/cjs.js?exposes=SearchToggle!./client/src/components/Search/SearchToggle.js");
__webpack_require__(/*! expose-loader?exposes=TreeDropdownFieldNode!components/TreeDropdownField/TreeDropdownFieldNode */ "./node_modules/expose-loader/dist/cjs.js?exposes=TreeDropdownFieldNode!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js");
__webpack_require__(/*! expose-loader?exposes=TreeDropdownField!components/TreeDropdownField/TreeDropdownField */ "./node_modules/expose-loader/dist/cjs.js?exposes=TreeDropdownField!./client/src/components/TreeDropdownField/TreeDropdownField.js");
__webpack_require__(/*! expose-loader?exposes=BreadcrumbsActions!state/breadcrumbs/BreadcrumbsActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=BreadcrumbsActions!./client/src/state/breadcrumbs/BreadcrumbsActions.js");
__webpack_require__(/*! expose-loader?exposes=RecordsActionTypes!state/records/RecordsActionTypes */ "./node_modules/expose-loader/dist/cjs.js?exposes=RecordsActionTypes!./client/src/state/records/RecordsActionTypes.js");
__webpack_require__(/*! expose-loader?exposes=UnsavedFormsActions!state/unsavedForms/UnsavedFormsActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=UnsavedFormsActions!./client/src/state/unsavedForms/UnsavedFormsActions.js");
__webpack_require__(/*! expose-loader?exposes=Badge!components/Badge/Badge */ "./node_modules/expose-loader/dist/cjs.js?exposes=Badge!./client/src/components/Badge/Badge.js");
__webpack_require__(/*! expose-loader?exposes=VersionedBadge!components/VersionedBadge/VersionedBadge */ "./node_modules/expose-loader/dist/cjs.js?exposes=VersionedBadge!./client/src/components/VersionedBadge/VersionedBadge.js");
__webpack_require__(/*! expose-loader?exposes=CheckboxSetField!components/CheckboxSetField/CheckboxSetField */ "./node_modules/expose-loader/dist/cjs.js?exposes=CheckboxSetField!./client/src/components/CheckboxSetField/CheckboxSetField.js");
__webpack_require__(/*! expose-loader?exposes=Preview!components/Preview/Preview */ "./node_modules/expose-loader/dist/cjs.js?exposes=Preview!./client/src/components/Preview/Preview.js");
__webpack_require__(/*! expose-loader?exposes=ViewModeStates!state/viewMode/ViewModeStates */ "./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeStates!./client/src/state/viewMode/ViewModeStates.js");
__webpack_require__(/*! expose-loader?exposes=ViewModeActions!state/viewMode/ViewModeActions */ "./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeActions!./client/src/state/viewMode/ViewModeActions.js");
__webpack_require__(/*! expose-loader?exposes=ViewModeToggle!components/ViewModeToggle/ViewModeToggle */ "./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeToggle!./client/src/components/ViewModeToggle/ViewModeToggle.js");
__webpack_require__(/*! expose-loader?exposes=Focusedzone!components/Focusedzone/Focusedzone */ "./node_modules/expose-loader/dist/cjs.js?exposes=Focusedzone!./client/src/components/Focusedzone/Focusedzone.js");
__webpack_require__(/*! expose-loader?exposes=EmotionCssCacheProvider!containers/EmotionCssCacheProvider/EmotionCssCacheProvider */ "./node_modules/expose-loader/dist/cjs.js?exposes=EmotionCssCacheProvider!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js");
__webpack_require__(/*! expose-loader?exposes=Config!lib/Config */ "./node_modules/expose-loader/dist/cjs.js?exposes=Config!./client/src/lib/Config.js");
__webpack_require__(/*! expose-loader?exposes=DataFormat!lib/DataFormat */ "./node_modules/expose-loader/dist/cjs.js?exposes=DataFormat!./client/src/lib/DataFormat.js");
__webpack_require__(/*! expose-loader?exposes=ReactRouteRegister!lib/ReactRouteRegister */ "./node_modules/expose-loader/dist/cjs.js?exposes=ReactRouteRegister!./client/src/lib/ReactRouteRegister.js");
__webpack_require__(/*! expose-loader?exposes=Router!lib/Router */ "./node_modules/expose-loader/dist/cjs.js?exposes=Router!./client/src/lib/Router.js");
__webpack_require__(/*! expose-loader?exposes=TinyMCEActionRegistrar!lib/TinyMCEActionRegistrar */ "./node_modules/expose-loader/dist/cjs.js?exposes=TinyMCEActionRegistrar!./client/src/lib/TinyMCEActionRegistrar.js");
__webpack_require__(/*! expose-loader?exposes=ShortcodeSerialiser!lib/ShortcodeSerialiser */ "./node_modules/expose-loader/dist/cjs.js?exposes=ShortcodeSerialiser!./client/src/lib/ShortcodeSerialiser.js");
__webpack_require__(/*! expose-loader?exposes=formatWrittenNumber!lib/formatWrittenNumber */ "./node_modules/expose-loader/dist/cjs.js?exposes=formatWrittenNumber!./client/src/lib/formatWrittenNumber.js");
__webpack_require__(/*! expose-loader?exposes=withDragDropContext!lib/withDragDropContext */ "./node_modules/expose-loader/dist/cjs.js?exposes=withDragDropContext!./client/src/lib/withDragDropContext.js");
__webpack_require__(/*! expose-loader?exposes=withRouter!lib/withRouter */ "./node_modules/expose-loader/dist/cjs.js?exposes=withRouter!./client/src/lib/withRouter.js");
__webpack_require__(/*! expose-loader?exposes=ssUrlLib!lib/urls */ "./node_modules/expose-loader/dist/cjs.js?exposes=ssUrlLib!./client/src/lib/urls.js");
__webpack_require__(/*! expose-loader?exposes=SearchableDropdownField!components/SearchableDropdownField/SearchableDropdownField */ "./node_modules/expose-loader/dist/cjs.js?exposes=SearchableDropdownField!./client/src/components/SearchableDropdownField/SearchableDropdownField.js");
__webpack_require__(/*! ../legacy/jquery.changetracker */ "./client/src/legacy/jquery.changetracker.js");
__webpack_require__(/*! ../legacy/sspath */ "./client/src/legacy/sspath.js");
__webpack_require__(/*! ../legacy/ssui.core */ "./client/src/legacy/ssui.core.js");
__webpack_require__(/*! ../legacy/LeftAndMain */ "./client/src/legacy/LeftAndMain.js");
__webpack_require__(/*! ../legacy/LeftAndMain.ActionTabSet */ "./client/src/legacy/LeftAndMain.ActionTabSet.js");
__webpack_require__(/*! ../legacy/LeftAndMain.Panel */ "./client/src/legacy/LeftAndMain.Panel.js");
__webpack_require__(/*! ../legacy/LeftAndMain.Tree */ "./client/src/legacy/LeftAndMain.Tree.js");
__webpack_require__(/*! ../legacy/LeftAndMain.Content */ "./client/src/legacy/LeftAndMain.Content.js");
__webpack_require__(/*! ../legacy/LeftAndMain.EditForm */ "./client/src/legacy/LeftAndMain.EditForm.js");
__webpack_require__(/*! ../legacy/LeftAndMain.Menu */ "./client/src/legacy/LeftAndMain.Menu.js");
__webpack_require__(/*! ../legacy/LeftAndMain.MobileMenuToggle */ "./client/src/legacy/LeftAndMain.MobileMenuToggle.js");
__webpack_require__(/*! ../legacy/LeftAndMain.Preview */ "./client/src/legacy/LeftAndMain.Preview.js");
__webpack_require__(/*! ../legacy/LeftAndMain.BatchActions */ "./client/src/legacy/LeftAndMain.BatchActions.js");
__webpack_require__(/*! ../legacy/LeftAndMain.FieldHelp */ "./client/src/legacy/LeftAndMain.FieldHelp.js");
__webpack_require__(/*! ../legacy/LeftAndMain.FieldDescriptionToggle */ "./client/src/legacy/LeftAndMain.FieldDescriptionToggle.js");
__webpack_require__(/*! ../legacy/LeftAndMain.TreeDropdownField */ "./client/src/legacy/LeftAndMain.TreeDropdownField.js");
__webpack_require__(/*! ../legacy/AddToCampaignForm */ "./client/src/legacy/AddToCampaignForm.js");
__webpack_require__(/*! ../legacy/SecurityAdmin */ "./client/src/legacy/SecurityAdmin.js");
__webpack_require__(/*! ../legacy/ModelAdmin */ "./client/src/legacy/ModelAdmin.js");
__webpack_require__(/*! ../legacy/ToastsContainer */ "./client/src/legacy/ToastsContainer.js");
__webpack_require__(/*! ../legacy/ConfirmedPasswordField */ "./client/src/legacy/ConfirmedPasswordField.js");
__webpack_require__(/*! ../legacy/SelectionGroup */ "./client/src/legacy/SelectionGroup.js");
__webpack_require__(/*! ../legacy/DateField */ "./client/src/legacy/DateField.js");
__webpack_require__(/*! ../legacy/ToggleCompositeField */ "./client/src/legacy/ToggleCompositeField.js");
__webpack_require__(/*! ../legacy/TreeDropdownField/TreeDropdownFieldEntwine */ "./client/src/legacy/TreeDropdownField/TreeDropdownFieldEntwine.js");
__webpack_require__(/*! ../legacy/UsedOnTable/UsedOnTableEntwine */ "./client/src/legacy/UsedOnTable/UsedOnTableEntwine.js");
__webpack_require__(/*! ../legacy/DatetimeField */ "./client/src/legacy/DatetimeField.js");
__webpack_require__(/*! ../legacy/HtmlEditorField */ "./client/src/legacy/HtmlEditorField.js");
__webpack_require__(/*! ../legacy/TabSet */ "./client/src/legacy/TabSet.js");
__webpack_require__(/*! ../legacy/GridField */ "./client/src/legacy/GridField.js");
__webpack_require__(/*! ../legacy/SearchableDropdownField/SearchableDropdownFieldEntwine */ "./client/src/legacy/SearchableDropdownField/SearchableDropdownFieldEntwine.js");
__webpack_require__(/*! boot */ "./client/src/boot/index.js");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Accordion/Accordion.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Accordion/Accordion.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Accordion = props => _react.default.createElement("div", {
  className: "accordion",
  role: "tablist",
  "aria-multiselectable": "true"
}, props.children);
var _default = exports["default"] = Accordion;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Accordion/AccordionBlock.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Accordion/AccordionBlock.js ***!
  \*************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AccordionBlock = props => {
  const headerID = `${props.groupid}_Header`;
  const listID = `${props.groupid}_Items`;
  const listIDAttr = listID.replace(/\\/g, '_');
  const headerIDAttr = headerID.replace(/\\/g, '_');
  const groupProps = {
    id: listIDAttr,
    'aria-expanded': true,
    className: 'list-group list-group-flush collapse show',
    role: 'tabpanel',
    'aria-labelledby': headerID
  };
  return _react.default.createElement("div", {
    className: "accordion__block"
  }, _react.default.createElement("a", {
    className: "accordion__title",
    "data-toggle": "collapse",
    href: `#${listIDAttr}`,
    "aria-expanded": "true",
    "aria-controls": listID,
    id: headerIDAttr,
    role: "tab"
  }, props.title), _react.default.createElement("div", groupProps, props.children));
};
var _default = exports["default"] = AccordionBlock;

/***/ }),

/***/ "./client/src/components/ActionMenu/ActionMenu.js":
/*!********************************************************!*\
  !*** ./client/src/components/ActionMenu/ActionMenu.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class ActionMenu extends _react.PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle(event) {
    const {
      toggleCallback
    } = this.props;
    if (toggleCallback) {
      toggleCallback(event);
    }
    window.setTimeout(() => this.setState({
      isOpen: !this.state.isOpen
    }), 0);
  }
  render() {
    const {
      dropdownToggleProps,
      dropdownMenuProps,
      dropdownToggleClassNames,
      className,
      toggleCallback,
      ...restProps
    } = this.props;
    const toggleClassName = (0, _classnames.default)(dropdownToggleClassNames, dropdownToggleProps.className);
    const menuClassName = (0, _classnames.default)('action-menu__dropdown', dropdownMenuProps.className);
    return _react.default.createElement(_reactstrap.Dropdown, _extends({
      className: (0, _classnames.default)('action-menu', className),
      isOpen: this.state.isOpen,
      toggle: this.toggle
    }, restProps), _react.default.createElement(_reactstrap.DropdownToggle, _extends({
      className: toggleClassName,
      "aria-label": _i18n.default._t('Admin.ACTIONS', 'View actions')
    }, dropdownToggleProps)), _react.default.createElement(_reactstrap.DropdownMenu, _extends({
      className: menuClassName
    }, dropdownMenuProps), this.props.children));
  }
}
ActionMenu.propTypes = {
  toggleCallback: _propTypes.default.func,
  dropdownToggleClassNames: _propTypes.default.arrayOf(_propTypes.default.string)
};
ActionMenu.defaultProps = {
  className: '',
  dropdownToggleClassNames: ['action-menu__toggle', 'btn', 'btn--no-text', 'btn--icon-xl', 'font-icon-dot-3'],
  dropdownToggleProps: {},
  dropdownMenuProps: {}
};
var _default = exports["default"] = ActionMenu;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Badge/Badge.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Badge/Badge.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.statuses = exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const statuses = exports.statuses = ['default', 'info', 'success', 'warning', 'danger', 'primary', 'secondary'];
class Badge extends _react.PureComponent {
  render() {
    const {
      status,
      inverted,
      className,
      message
    } = this.props;
    if (!status) {
      return null;
    }
    const invertedClass = inverted ? `badge-${status}--inverted` : '';
    const compiledClassNames = (0, _classnames.default)(className, 'badge', `badge-${status}`, invertedClass);
    return _react.default.createElement("span", {
      className: compiledClassNames
    }, message);
  }
}
Badge.propTypes = {
  message: _propTypes.default.node,
  status: _propTypes.default.oneOf(statuses),
  className: _propTypes.default.string,
  inverted: _propTypes.default.bool
};
Badge.defaultProps = {
  status: 'default',
  className: 'badge-pill',
  inverted: false
};
var _default = exports["default"] = Badge;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Breadcrumb/Breadcrumb.js":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Breadcrumb/Breadcrumb.js ***!
  \**********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _FileStatusIcon = _interopRequireDefault(__webpack_require__(/*! components/FileStatusIcon/FileStatusIcon */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FileStatusIcon/FileStatusIcon.js"));
var _Link = _interopRequireDefault(__webpack_require__(/*! components/Link/Link */ "./client/src/components/Link/Link.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class Breadcrumb extends _react.Component {
  getLastCrumb() {
    return this.props.crumbs && this.props.crumbs[this.props.crumbs.length - 1];
  }
  renderBreadcrumbs() {
    if (!this.props.crumbs) {
      return null;
    }
    return this.props.crumbs.slice(0, -1).map(crumb => _react.default.createElement("li", {
      key: crumb.text,
      className: "breadcrumb__item"
    }, _react.default.createElement(_Link.default, {
      className: "breadcrumb__item-title",
      href: crumb.href,
      onClick: crumb.onClick
    }, crumb.text)));
  }
  renderLastCrumb() {
    const crumb = this.getLastCrumb();
    if (!crumb) {
      return null;
    }
    return _react.default.createElement("div", {
      className: "breadcrumb__item breadcrumb__item--last"
    }, _react.default.createElement("h2", {
      className: "breadcrumb__item-title"
    }, crumb.text, crumb.icon && this.renderIcons([crumb.icon]), crumb.icons && this.renderIcons(crumb.icons)));
  }
  renderIcons(icons) {
    return icons.map((icon, i) => {
      const {
        nodeName,
        className,
        hasRestrictedAccess,
        ...other
      } = icon;
      let attrs = {
        ...other
      };
      const extraClassName = (0, _classnames.default)(['breadcrumb__icon', className]);
      attrs = {
        tabIndex: '0',
        ...attrs
      };
      if (attrs.hasOwnProperty('onClick')) {
        attrs = {
          role: 'button',
          ...attrs
        };
      }
      attrs.key = `breadcrumb-icon-${i}`;
      if (nodeName === 'FileStatusIcon') {
        attrs.fileID = 0;
        attrs.hasRestrictedAccess = hasRestrictedAccess;
        attrs.extraClassName = extraClassName;
        return _react.default.createElement(_FileStatusIcon.default, attrs);
      }
      attrs.className = extraClassName;
      return _react.default.createElement("span", attrs);
    });
  }
  render() {
    return _react.default.createElement("div", {
      className: "breadcrumb__container fill-height flexbox-area-grow"
    }, this.props.crumbs && this.props.crumbs.length > 1 && _react.default.createElement("div", {
      className: "breadcrumb__list-container"
    }, _react.default.createElement("ol", {
      className: "breadcrumb"
    }, this.renderBreadcrumbs())), this.renderLastCrumb());
  }
}
exports.Component = Breadcrumb;
Breadcrumb.propTypes = {
  crumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
    onClick: _propTypes.default.func,
    text: _propTypes.default.string,
    icon: _propTypes.default.shape({
      nodeName: _propTypes.default.string,
      className: _propTypes.default.string,
      onClick: _propTypes.default.func,
      action: props => {
        if (props.action) {
          throw new Error('action: no longer used');
        }
      }
    }),
    icons: _propTypes.default.arrayOf(_propTypes.default.shape({
      nodeName: _propTypes.default.string,
      className: _propTypes.default.string,
      onClick: _propTypes.default.func
    }))
  }))
};
function mapStateToProps(state) {
  return {
    crumbs: state.breadcrumbs
  };
}
var _default = exports["default"] = (0, _reactRedux.connect)(mapStateToProps)(Breadcrumb);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/BackButton.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/BackButton.js ***!
  \******************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Button = _interopRequireDefault(__webpack_require__(/*! components/Button/Button */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const BackButton = _ref => {
  let {
    className,
    ...props
  } = _ref;
  return _react.default.createElement(_Button.default, _extends({
    className: (0, _classnames.default)(className, 'back-button')
  }, props));
};
BackButton.propTypes = _Button.default.propTypes;
BackButton.defaultProps = {
  ..._Button.default.defaultProps,
  noText: true,
  icon: 'left-open-big',
  children: _i18n.default._t('Admin.BACK', 'Back')
};
var _default = exports["default"] = BackButton;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js ***!
  \**************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _IconHOC = _interopRequireDefault(__webpack_require__(/*! ./IconHOC */ "./client/src/components/Button/IconHOC.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Button = _ref => {
  let {
    className,
    noText,
    children,
    ...props
  } = _ref;
  return _react.default.createElement(_reactstrap.Button, _extends({
    className: (0, _classnames.default)(className, {
      'btn--no-text': noText
    }),
    "aria-label": noText ? children : undefined
  }, props), noText ? undefined : children);
};
Button.propTypes = {
  ..._reactstrap.Button.propTypes,
  noText: _propTypes.default.bool
};
Button.defaultProps = {
  ..._reactstrap.Button.defaultProps,
  noText: false
};
var _default = exports["default"] = (0, _IconHOC.default)(Button);

/***/ }),

/***/ "./client/src/components/Button/IconHOC.js":
/*!*************************************************!*\
  !*** ./client/src/components/Button/IconHOC.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const IconHOC = Component => {
  const IconComponent = _ref => {
    let {
      icon,
      className,
      ...props
    } = _ref;
    return _react.default.createElement(Component, _extends({
      className: (0, _classnames.default)(className, icon && `font-icon-${icon}`)
    }, props));
  };
  IconComponent.propTypes = {
    ...Component.propTypes,
    icon: _propTypes.default.string
  };
  IconComponent.defaultProps = Component.defaultProps;
  IconComponent.displayName = Component.name;
  return IconComponent;
};
var _default = exports["default"] = IconHOC;

/***/ }),

/***/ "./client/src/components/CheckboxField/CheckboxField.js":
/*!**************************************************************!*\
  !*** ./client/src/components/CheckboxField/CheckboxField.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _OptionField = _interopRequireDefault(__webpack_require__(/*! components/OptionsetField/OptionField */ "./client/src/components/OptionsetField/OptionField.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Checkbox = props => _react.default.createElement(_OptionField.default, _extends({}, props, {
  type: "checkbox"
}));
exports.Component = Checkbox;
const CheckboxField = props => {
  const FieldHolder = (0, _FieldHolder.default)(Checkbox);
  return _react.default.createElement(FieldHolder, _extends({}, props, {
    hideLabels: true
  }));
};
var _default = exports["default"] = CheckboxField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/CheckboxSetField/CheckboxSetField.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/CheckboxSetField/CheckboxSetField.js ***!
  \**********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _OptionField = _interopRequireDefault(__webpack_require__(/*! components/OptionsetField/OptionField */ "./client/src/components/OptionsetField/OptionField.js"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class CheckboxSet extends _react.Component {
  constructor(props) {
    super(props);
    this.getItemKey = this.getItemKey.bind(this);
    this.getOptionProps = this.getOptionProps.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getValues = this.getValues.bind(this);
  }
  getItemKey(item, index) {
    return `${this.props.id}-${item.value || `empty${index}`}`;
  }
  getValues() {
    let values = this.props.value;
    if (!Array.isArray(values)) {
      if (typeof values === 'string') {
        values = values.length ? [values] : [];
      }
      if (typeof values === 'number') {
        values = [values];
      }
    }
    if (values) {
      return values.map(value => `${value}`);
    }
    return [];
  }
  getOptionProps(item, index) {
    const values = this.getValues();
    const key = this.getItemKey(item, index);
    return {
      key,
      id: key,
      name: this.props.name,
      className: this.props.itemClass,
      disabled: item.disabled || this.props.disabled,
      readOnly: this.props.readOnly,
      onChange: this.handleChange,
      value: values.indexOf(`${item.value}`) > -1,
      title: item.title,
      type: 'checkbox'
    };
  }
  handleChange(event, field) {
    if (typeof this.props.onChange === 'function') {
      const oldValue = this.getValues();
      const value = this.props.source.filter((item, index) => {
        if (this.getItemKey(item, index) === field.id) {
          return field.value === 1;
        }
        return oldValue.indexOf(`${item.value}`) > -1;
      }).map(item => `${item.value}`);
      this.props.onChange(event, {
        id: this.props.id,
        value
      });
    }
  }
  render() {
    if (!this.props.source) {
      return null;
    }
    return _react.default.createElement("div", null, this.props.source.map((item, index) => _react.default.createElement(_OptionField.default, _extends({}, this.getOptionProps(item, index), {
      hideLabels: true
    }))));
  }
}
exports.Component = CheckboxSet;
CheckboxSet.propTypes = {
  className: _propTypes.default.string,
  extraClass: _propTypes.default.string,
  itemClass: _propTypes.default.string,
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  source: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    title: _propTypes.default.any,
    disabled: _propTypes.default.bool
  })),
  onChange: _propTypes.default.func,
  value: _propTypes.default.any,
  readOnly: _propTypes.default.bool,
  disabled: _propTypes.default.bool
};
CheckboxSet.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};
const CheckboxSetField = props => {
  const FieldHolder = (0, _FieldHolder.default)(CheckboxSet);
  return _react.default.createElement(FieldHolder, props);
};
var _default = exports["default"] = CheckboxSetField;

/***/ }),

/***/ "./client/src/components/CompositeField/CompositeField.js":
/*!****************************************************************!*\
  !*** ./client/src/components/CompositeField/CompositeField.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class CompositeField extends _react.Component {
  getLegend() {
    if (this.props.data.tag === 'fieldset' && this.props.data.legend) {
      return (0, _castStringToElement.default)('legend', this.props.data.legend);
    }
    return null;
  }
  getClassName() {
    return `${this.props.className} ${this.props.extraClass}`;
  }
  render() {
    const legend = this.getLegend();
    const Tag = this.props.data.tag || 'div';
    const className = this.getClassName();
    return _react.default.createElement(Tag, {
      className: className
    }, legend, this.props.children);
  }
}
exports.Component = CompositeField;
CompositeField.propTypes = {
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
    tag: _propTypes.default.string,
    legend: _propTypes.default.string
  })]),
  extraClass: _propTypes.default.string
};
CompositeField.defaultProps = {
  className: '',
  extraClass: ''
};
var _default = exports["default"] = CompositeField;

/***/ }),

/***/ "./client/src/components/DateField/DateField.js":
/*!******************************************************!*\
  !*** ./client/src/components/DateField/DateField.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "./node_modules/moment/moment.js"));
var _modernizr = _interopRequireDefault(__webpack_require__(/*! modernizr */ "./client/src/.modernizrrc"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _TextField = __webpack_require__(/*! ../TextField/TextField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TextField/TextField.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const localFormat = 'L';
class DateField extends _TextField.Component {
  render() {
    return super.render();
  }
  moment() {
    _moment.default.locale(this.getLang());
    return (0, _moment.default)(...arguments);
  }
  getLang() {
    const lang = this.asHTML5() ? this.props.isoLang : this.props.lang;
    return lang || (0, _moment.default)().locale();
  }
  asHTML5() {
    return this.props.data.html5 && this.hasNativeSupport();
  }
  hasNativeSupport() {
    return this.props.modernizr.inputtypes.date;
  }
  getInputProps() {
    const placeholder = _i18n.default.inject(_i18n.default._t('Admin.FormatExample', 'Example: {format}'), {
      format: this.moment().endOf('month').format(localFormat)
    });
    const value = this.asHTML5() ? this.props.value : this.getLocalisedValue();
    const type = this.asHTML5() ? 'date' : 'text';
    const props = {
      ...super.getInputProps(),
      type,
      value,
      placeholder
    };
    return props;
  }
  getLocalisedValue() {
    return this.convertToLocalised(this.props.value);
  }
  isMultiline() {
    return false;
  }
  handleChange(event) {
    const enteredValue = event.target.value;
    let isoValue = '';
    if (this.asHTML5()) {
      isoValue = enteredValue;
    } else {
      isoValue = this.convertToIso(enteredValue);
    }
    if (typeof this.props.onChange === 'function') {
      this.triggerChange(event, isoValue);
    }
  }
  triggerChange(event, value) {
    this.props.onChange(event, {
      id: this.props.id,
      value
    });
  }
  convertToIso(localDate) {
    let isoDate = '';
    if (localDate) {
      const dateObject = this.moment(localDate, [localFormat, 'YYYY-MM-DD']);
      if (dateObject.isValid()) {
        isoDate = dateObject.format('YYYY-MM-DD');
      }
    }
    return isoDate;
  }
  convertToLocalised(isoDate) {
    let localDate = '';
    if (isoDate) {
      const dateObject = this.moment(isoDate);
      if (dateObject.isValid()) {
        localDate = dateObject.format(localFormat);
      }
    }
    return localDate;
  }
}
exports.Component = DateField;
DateField.propTypes = {
  lang: _propTypes.default.string,
  isoLang: _propTypes.default.string,
  modernizr: _propTypes.default.object,
  data: _propTypes.default.shape({
    html5: _propTypes.default.bool
  })
};
DateField.defaultProps = {
  modernizr: _modernizr.default,
  data: {}
};
var _default = exports["default"] = (0, _FieldHolder.default)(DateField);

/***/ }),

/***/ "./client/src/components/DatetimeField/DatetimeField.js":
/*!**************************************************************!*\
  !*** ./client/src/components/DatetimeField/DatetimeField.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "./node_modules/moment/moment.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _DateField = __webpack_require__(/*! ../DateField/DateField */ "./client/src/components/DateField/DateField.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const localFormat = 'L LT';
const dateOnlyLocalFormat = 'L';
class DatetimeField extends _DateField.Component {
  getInputProps() {
    const placeholder = _i18n.default.inject(_i18n.default._t('Admin.FormatExample', 'Example: {format}'), {
      format: this.moment().endOf('month').format(localFormat)
    });
    const type = this.asHTML5() ? 'datetime-local' : 'text';
    return {
      ...super.getInputProps(),
      type,
      placeholder
    };
  }
  isMultiline() {
    return false;
  }
  hasNativeSupport() {
    return this.props.modernizr.inputtypes['datetime-local'];
  }
  triggerChange(event, value) {
    if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
      this.props.onChange(event, {
        id: this.props.id,
        value: `${value}:00`
      });
    } else {
      this.props.onChange(event, {
        id: this.props.id,
        value
      });
    }
  }
  convertToLocalised(isoTime) {
    _moment.default.locale(this.props.lang);
    let localTime = '';
    if (isoTime) {
      const timeObject = this.moment(isoTime);
      if (timeObject.isValid()) {
        localTime = timeObject.format(localFormat);
      }
    }
    return localTime;
  }
  convertToIso(localTime) {
    _moment.default.locale(this.props.lang);
    let isoTime = '';
    if (localTime) {
      const formats = [localFormat, dateOnlyLocalFormat, _moment.default.ISO_8601];
      const timeObject = this.moment(localTime, formats);
      if (timeObject.isValid()) {
        isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
      }
    }
    return isoTime;
  }
}
exports.Component = DatetimeField;
DatetimeField.propTypes = _DateField.Component.propTypes;
DatetimeField.defaultProps = _DateField.Component.defaultProps;
var _default = exports["default"] = (0, _FieldHolder.default)(DatetimeField);

/***/ }),

/***/ "./client/src/components/FieldGroup/FieldGroup.js":
/*!********************************************************!*\
  !*** ./client/src/components/FieldGroup/FieldGroup.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _CompositeField = _interopRequireDefault(__webpack_require__(/*! components/CompositeField/CompositeField */ "./client/src/components/CompositeField/CompositeField.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FieldGroup extends _CompositeField.default {
  getClassName() {
    return (0, _classnames.default)('field-group-component', {
      'field-group-component__small-holder': this.props.smallholder
    }, super.getClassName());
  }
}
FieldGroup.propTypes = {
  ..._CompositeField.default.propTypes,
  smallholder: _propTypes.default.bool
};
FieldGroup.defaultProps = {
  ..._CompositeField.default.defaultProps,
  smallholder: true
};
var _default = exports["default"] = FieldGroup;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Tip = _interopRequireWildcard(__webpack_require__(/*! components/Tip/Tip */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tip/Tip.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function fieldHolder(Field) {
  class FieldHolder extends _react.Component {
    getMessage() {
      let message = null;
      if (this.props.message && this.props.message.value) {
        message = this.props.message;
      }
      const meta = this.props.meta;
      if (meta && meta.error && meta.touched && (!message || meta.dirty)) {
        message = meta.error;
      }
      return message;
    }
    getHolderProps() {
      return {
        className: (0, _classnames.default)({
          field: true,
          [this.props.extraClass]: true,
          readonly: this.props.readOnly
        }),
        id: this.props.holderId
      };
    }
    renderMessage() {
      const message = this.getMessage();
      if (!message) {
        return null;
      }
      const classNames = (0, _classnames.default)(['form__field-message', `form__field-message--${message.type}`]);
      const body = (0, _castStringToElement.default)('div', message.value);
      return _react.default.createElement("div", {
        className: classNames
      }, body);
    }
    renderLeftTitle() {
      const labelText = this.props.leftTitle ? this.props.leftTitle : this.props.title;
      if (!labelText || this.props.hideLabels) {
        return null;
      }
      return (0, _castStringToElement.default)(_reactstrap.Label, labelText, {
        className: 'form__field-label',
        for: this.props.id
      });
    }
    renderRightTitle() {
      if (!this.props.rightTitle || this.props.hideLabels) {
        return null;
      }
      return (0, _castStringToElement.default)(_reactstrap.Label, this.props.rightTitle, {
        className: 'form__field-label',
        for: this.props.id
      });
    }
    renderField() {
      const hasMessage = Boolean(this.getMessage());
      const props = {
        ...this.props,
        extraClass: (0, _classnames.default)(this.props.extraClass, {
          'is-invalid': hasMessage
        })
      };
      const field = _react.default.createElement(Field, props);
      const prefix = this.props.data && this.props.data.prefix ? this.props.data.prefix : '';
      const suffix = this.props.data && this.props.data.suffix ? this.props.data.suffix : '';
      if (!prefix && !suffix) {
        return field;
      }
      return _react.default.createElement(_reactstrap.InputGroup, null, prefix && _react.default.createElement(_reactstrap.InputGroupAddon, {
        addonType: "prepend"
      }, prefix), field, suffix && _react.default.createElement(_reactstrap.InputGroupAddon, {
        addonType: "append"
      }, suffix));
    }
    renderTitleTip() {
      if (!this.props.id || !this.props.titleTip || !this.props.titleTip.content) {
        return null;
      }
      return _react.default.createElement(_Tip.default, {
        id: `FieldHolder-${this.props.id}-titleTip`,
        content: this.props.titleTip.content,
        fieldTitle: this.props.title,
        type: _Tip.TIP_TYPES.TITLE,
        icon: "menu-help"
      });
    }
    renderDescription() {
      if (this.props.description === null) {
        return null;
      }
      return (0, _castStringToElement.default)('div', this.props.description, {
        className: 'form__field-description'
      });
    }
    render() {
      if (this.props.noHolder) {
        return this.renderField();
      }
      return _react.default.createElement(_reactstrap.FormGroup, this.getHolderProps(), this.renderLeftTitle(), this.renderTitleTip(), _react.default.createElement("div", {
        className: "form__field-holder"
      }, this.renderField(), this.renderMessage(), this.renderDescription()), this.renderRightTitle());
    }
  }
  FieldHolder.propTypes = {
    leftTitle: _propTypes.default.any,
    rightTitle: _propTypes.default.any,
    title: _propTypes.default.any,
    extraClass: _propTypes.default.string,
    holderId: _propTypes.default.string,
    id: _propTypes.default.string,
    name: _propTypes.default.string,
    description: _propTypes.default.any,
    hideLabels: _propTypes.default.bool,
    message: _propTypes.default.shape({
      extraClass: _propTypes.default.string,
      value: _propTypes.default.any,
      type: _propTypes.default.string
    }),
    data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
      prefix: _propTypes.default.string,
      suffix: _propTypes.default.string
    })]),
    titleTip: _propTypes.default.shape(_Tip.tipShape)
  };
  FieldHolder.defaultProps = {
    className: '',
    extraClass: '',
    leftTitle: null,
    rightTitle: null,
    title: '',
    description: null,
    hideLabels: false,
    noHolder: false,
    message: null,
    data: {}
  };
  return FieldHolder;
}
var _default = exports["default"] = fieldHolder;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FileStatusIcon/FileStatusIcon.js":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FileStatusIcon/FileStatusIcon.js ***!
  \******************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const cssClass = 'file-status-icon';
class FileStatusIcon extends _react.PureComponent {
  buildTrackedFormUpload(hasRestrictedAccess) {
    const fontIconClass = hasRestrictedAccess ? 'font-icon-address-card' : 'font-icon-address-card-warning';
    const className = (0, _classnames.default)('icon', `${cssClass}__icon`, fontIconClass);
    const dataTitle = hasRestrictedAccess ? _i18n.default._t('SilverStripe\\Admin\\FileStatusIcon.TRACKED_FORM_UPLOAD_RESTRICTED', 'Form submission') : _i18n.default._t('SilverStripe\\Admin\\FileStatusIcon.TRACKED_FORM_UPLOAD_UNRESTRICTED', 'Form submission, unrestricted access');
    return {
      className,
      'data-title': dataTitle
    };
  }
  buildRestrictedFileAttrs() {
    const className = (0, _classnames.default)('icon', `${cssClass}__icon`, 'font-icon-user-lock');
    const dataTitle = _i18n.default._t('SilverStripe\\Admin\\FileStatusIcon.ACCESS_RESTRICTED', 'Restricted access');
    return {
      className,
      'data-title': dataTitle
    };
  }
  renderTooltip(placement, id, title) {
    return _react.default.createElement(_reactstrap.UncontrolledTooltip, {
      placement: placement,
      target: id,
      delay: {
        show: 300,
        hide: 0
      }
    }, title);
  }
  render() {
    const {
      fileID,
      hasRestrictedAccess,
      isTrackedFormUpload,
      placement,
      extraClassName,
      disableTooltip,
      includeBackground
    } = this.props;
    if (!isTrackedFormUpload && !hasRestrictedAccess) {
      return '';
    }
    const backgroundClass = includeBackground ? 'file-status-icon--background' : '';
    const className = (0, _classnames.default)([cssClass, backgroundClass, extraClassName]);
    const attrs = isTrackedFormUpload ? this.buildTrackedFormUpload(hasRestrictedAccess) : this.buildRestrictedFileAttrs();
    const idType = isTrackedFormUpload ? 'tracked-form-upload' : 'restricted';
    const id = `FileStatusIcon-${idType}-${fileID}`;
    const tooltip = disableTooltip ? '' : this.renderTooltip(placement, id, attrs['data-title']);
    return _react.default.createElement("div", {
      className: className
    }, _react.default.createElement("span", _extends({
      id: id
    }, attrs)), tooltip);
  }
}
FileStatusIcon.propTypes = {
  fileID: _propTypes.default.number,
  hasRestrictedAccess: _propTypes.default.bool,
  isTrackedFormUpload: _propTypes.default.bool,
  placement: _propTypes.default.string,
  disableTooltip: _propTypes.default.bool,
  extraClassName: _propTypes.default.string,
  includeBackground: _propTypes.default.bool
};
FileStatusIcon.defaultProps = {
  placement: 'auto',
  disableTooltip: false
};
var _default = exports["default"] = FileStatusIcon;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Focusedzone/Focusedzone.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Focusedzone/Focusedzone.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class Focusedzone extends _react.Component {
  constructor(props) {
    super(props);
    this.wasClicked = false;
    this.handleElementClick = this.handleElementClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }
  componentDidMount() {
    const element = this.container;
    element.addEventListener('click', this.handleElementClick);
    document.addEventListener('click', this.handleDocumentClick);
  }
  componentWillUnmount() {
    const element = this.container;
    element.removeEventListener('click', this.handleElementClick);
    document.removeEventListener('click', this.handleDocumentClick);
  }
  handleElementClick() {
    this.wasClicked = true;
  }
  handleDocumentClick() {
    if (!this.wasClicked) {
      this.props.onClickOut();
    }
    this.wasClicked = false;
  }
  render() {
    return _react.default.createElement("div", {
      className: this.props.className,
      ref: container => {
        this.container = container;
      }
    }, this.props.children);
  }
}
Focusedzone.propTypes = {
  children: _propTypes.default.any,
  className: _propTypes.default.string,
  onClickOut: _propTypes.default.func.isRequired
};
Focusedzone.defaultProps = {
  className: ''
};
var _default = exports["default"] = Focusedzone;

/***/ }),

/***/ "./client/src/components/Form/Form.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Form/Form.js ***!
  \**********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _FormAlert = _interopRequireDefault(__webpack_require__(/*! components/FormAlert/FormAlert */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAlert/FormAlert.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Form = props => {
  let formRef = null;
  console.log('I AM A FORM');
  (0, _react.useEffect)(() => {
    if (!props.autoFocus) {
      return;
    }
    if (formRef) {
      const input = formRef.querySelector('input:not([type=hidden]), select, textarea');
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, []);
  const renderMessages = () => {
    const {
      FormAlertComponent
    } = props;
    if (Array.isArray(props.messages)) {
      return props.messages.map((message, index) => _react.default.createElement(FormAlertComponent, _extends({
        key: index,
        className: !index ? 'message-box--panel-top' : ''
      }, message)));
    }
    return null;
  };
  const handleSubmit = function (event) {
    event.stopPropagation();
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    props.handleSubmit(event, ...args);
  };
  const valid = props.valid !== false;
  const fields = props.mapFieldsToComponents(props.fields);
  const actions = props.mapActionsToComponents(props.actions);
  const messages = renderMessages();
  const FormTag = props.formTag;
  const className = ['form'];
  if (valid === false) {
    className.push('form--invalid');
  }
  if (props.attributes && props.attributes.className) {
    className.push(props.attributes.className);
  }
  const formProps = {
    ...props.attributes,
    onSubmit: handleSubmit,
    className: className.join(' ')
  };
  return _react.default.createElement(FormTag, _extends({}, formProps, {
    ref: form => {
      formRef = form;
      props.setDOM(form);
    },
    role: "form"
  }), fields && _react.default.createElement("fieldset", props.fieldHolder, messages, props.afterMessages, fields), actions && actions.length ? _react.default.createElement("div", props.actionHolder, actions) : null);
};
exports.Component = Form;
Form.propTypes = {
  autoFocus: _propTypes.default.bool,
  setDOM: _propTypes.default.func,
  valid: _propTypes.default.bool,
  actions: _propTypes.default.array,
  fieldHolder: _propTypes.default.shape({
    className: _propTypes.default.string
  }),
  actionHolder: _propTypes.default.shape({
    className: _propTypes.default.string
  }),
  extraClass: _propTypes.default.string,
  afterMessages: _propTypes.default.node,
  attributes: _propTypes.default.shape({
    action: _propTypes.default.string.isRequired,
    className: _propTypes.default.string,
    encType: _propTypes.default.string,
    id: _propTypes.default.string,
    method: _propTypes.default.string.isRequired
  }),
  fields: _propTypes.default.array.isRequired,
  handleSubmit: _propTypes.default.func,
  mapActionsToComponents: _propTypes.default.func.isRequired,
  mapFieldsToComponents: _propTypes.default.func.isRequired,
  messages: _propTypes.default.arrayOf(_propTypes.default.shape({
    extraClass: _propTypes.default.string,
    value: _propTypes.default.any,
    type: _propTypes.default.string
  })),
  formTag: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  FormAlertComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func])
};
Form.defaultProps = {
  setDOM: () => null,
  formTag: 'form',
  actionHolder: {
    className: 'btn-toolbar'
  },
  FormAlertComponent: _FormAlert.default
};
var _default = exports["default"] = Form;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Form/FormConstants.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Form/FormConstants.js ***!
  \*******************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  CSRF_HEADER: 'X-SecurityID'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAction/FormAction.js":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAction/FormAction.js ***!
  \**********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class FormAction extends _react.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  getButtonProps() {
    const {
      attributes,
      id,
      name
    } = this.props;
    const buttonAttributes = typeof attributes === 'undefined' ? {} : attributes;
    return {
      ...buttonAttributes,
      id,
      name,
      className: this.getButtonClasses(),
      disabled: this.isDisabled(),
      onClick: this.handleClick
    };
  }
  getButtonClasses() {
    const {
      title,
      loading,
      extraClass
    } = this.props;
    const buttonClasses = {
      btn: true,
      'btn--no-text': typeof title !== 'string',
      'btn--loading': loading,
      disabled: this.isDisabled()
    };
    const style = this.getButtonStyle();
    if (style) {
      buttonClasses[`btn-${style}`] = true;
    }
    const icon = this.getIcon();
    if (icon) {
      buttonClasses[`font-icon-${icon}`] = true;
    }
    if (typeof extraClass === 'string') {
      buttonClasses[extraClass] = true;
    }
    return (0, _classnames.default)(buttonClasses);
  }
  getButtonStyle() {
    if (typeof this.props.data.buttonStyle !== 'undefined') {
      return this.props.data.buttonStyle;
    }
    if (typeof this.props.buttonStyle !== 'undefined') {
      return this.props.buttonStyle;
    }
    const extraClasses = this.props.extraClass.split(' ');
    if (extraClasses.find(className => className.indexOf('btn-') > -1)) {
      return null;
    }
    if (this.isPrimary()) {
      return 'primary';
    }
    return 'secondary';
  }
  getIcon() {
    return this.props.icon || this.props.data.icon || null;
  }
  getLoadingIcon() {
    if (this.props.loading) {
      return _react.default.createElement("div", {
        className: "btn__loading-icon"
      }, _react.default.createElement("span", {
        className: "btn__circle btn__circle--1"
      }), _react.default.createElement("span", {
        className: "btn__circle btn__circle--2"
      }), _react.default.createElement("span", {
        className: "btn__circle btn__circle--3"
      }));
    }
    return null;
  }
  isDisabled() {
    const {
      disabled,
      readOnly
    } = this.props;
    return disabled || readOnly;
  }
  isPrimary() {
    const {
      extraClass,
      name
    } = this.props;
    const extraClasses = extraClass ? extraClass.split(' ') : [];
    return name === 'action_save' || !!extraClasses.find(className => className === 'ss-ui-action-constructive');
  }
  handleClick(event) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, this.props.name || this.props.id);
    }
  }
  render() {
    const {
      title
    } = this.props;
    return _react.default.createElement("button", this.getButtonProps(), this.getLoadingIcon(), (0, _castStringToElement.default)('span', title, {
      className: 'btn__title'
    }));
  }
}
FormAction.propTypes = {
  id: _propTypes.default.string,
  name: _propTypes.default.string,
  onClick: _propTypes.default.func,
  title: _propTypes.default.string,
  type: _propTypes.default.string,
  loading: _propTypes.default.bool,
  icon: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  readOnly: _propTypes.default.bool,
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
    buttonStyle: _propTypes.default.string
  })]),
  extraClass: _propTypes.default.string,
  attributes: _propTypes.default.object
};
FormAction.defaultProps = {
  title: '',
  icon: '',
  extraClass: '',
  attributes: {},
  data: {},
  disabled: false,
  readOnly: false
};
var _default = exports["default"] = FormAction;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAlert/FormAlert.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAlert/FormAlert.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class FormAlert extends _react.Component {
  constructor(props) {
    super(props);
    this.handleClosed = this.handleClosed.bind(this);
    this.state = {
      visible: true
    };
  }
  getMessageStyle() {
    switch (this.props.type) {
      case 'good':
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warn':
      case 'warning':
        return 'warning';
      default:
        return 'danger';
    }
  }
  getMessageProps() {
    const type = this.props.type || 'no-type';
    return {
      className: (0, _classnames.default)(['message-box', `message-box--${type}`, this.props.className, this.props.extraClass]),
      color: this.getMessageStyle(),
      toggle: this.props.closeLabel ? this.handleClosed : null,
      isOpen: this.props.closeLabel ? this.state.visible : true
    };
  }
  handleClosed() {
    if (typeof this.props.onClosed === 'function') {
      this.props.onClosed();
    } else {
      this.setState({
        visible: false
      });
    }
  }
  render() {
    if (typeof this.props.visible !== 'boolean' && this.state.visible || this.props.visible) {
      const body = (0, _castStringToElement.default)('div', this.props.value);
      if (body) {
        return _react.default.createElement(_reactstrap.Alert, this.getMessageProps(), body);
      }
    }
    return null;
  }
}
FormAlert.propTypes = {
  extraClass: _propTypes.default.string,
  value: _propTypes.default.any,
  type: _propTypes.default.string,
  onClosed: _propTypes.default.func,
  closeLabel: _propTypes.default.string,
  visible: _propTypes.default.bool
};
FormAlert.defaultProps = {
  extraClass: '',
  className: ''
};
var _default = exports["default"] = FormAlert;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilder/FormBuilder.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilder/FormBuilder.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.schemaPropType = exports["default"] = exports.basePropTypes = exports.Component = void 0;
var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! merge */ "./node_modules/merge/lib/src/index.js"));
var _schemaFieldValues = _interopRequireWildcard(__webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js"));
var _createErrorBlock = __webpack_require__(/*! lib/createErrorBlock */ "./client/src/lib/createErrorBlock.js");
var _Backend = _interopRequireDefault(__webpack_require__(/*! lib/Backend */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Backend.js"));
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const FormBuilder = props => {
  const [submittingAction, setSubmittingAction] = (0, _react.useState)(null);
  const {
    injector
  } = (0, _react.useContext)(_Injector.InjectorContext);
  const schemaStructure = props.schema.schema;
  const submitApi = _Backend.default.createEndpointFetcher({
    url: schemaStructure.attributes.action,
    method: schemaStructure.attributes.method
  });
  const getComponent = _ref => {
    let {
      name,
      schemaComponent,
      schemaType
    } = _ref;
    const {
      identifier,
      getCustomFields
    } = props;
    if (getCustomFields) {
      const component = getCustomFields(schemaType, `${identifier}.${name}`);
      if (component) {
        return component;
      }
    }
    if (schemaComponent !== null) {
      return injector.get(schemaComponent, `${identifier}.${name}`);
    }
    return getComponentForDataType(schemaType, name);
  };
  const getComponentForDataType = (dataType, name) => {
    const {
      identifier
    } = props;
    const get = type => injector.get(type, `${identifier}.${name}`);
    switch (dataType) {
      case 'Integer':
      case 'Decimal':
        return get('NumberField');
      case 'String':
      case 'Text':
        return get('TextField');
      case 'Date':
        return get('DateField');
      case 'Time':
        return get('TimeField');
      case 'Datetime':
        return get('DatetimeField');
      case 'Hidden':
        return get('HiddenField');
      case 'SingleSelect':
        return get('SingleSelectField');
      case 'Custom':
        return get('GridField');
      case 'Structural':
        return get('CompositeField');
      case 'Boolean':
        return get('CheckboxField');
      case 'MultiSelect':
        return get('CheckboxSetField');
      default:
        return null;
    }
  };
  const validateForm = values => {
    if (typeof props.validate === 'function') {
      return props.validate(values);
    }
    const schema = props.schema && props.schema.schema;
    if (!schema) {
      return {};
    }
    const validationMiddleware = injector.validate(props.identifier);
    let middlewareValidationResult = {};
    if (validationMiddleware) {
      middlewareValidationResult = validationMiddleware(values, props.schema.schema) || {};
    }
    return (0, _createErrorBlock.createErrorBlock)(middlewareValidationResult);
  };
  const buildComponent = propArgs => {
    const inputProps = propArgs.input || {};
    const componentProps = {
      ...propArgs,
      ...propArgs.input,
      onChange: inputProps.onChange ? (event, payload) => {
        inputProps.onChange(payload ? payload.value : event);
      } : null
    };
    delete componentProps.input;
    const SchemaComponent = getComponent(componentProps);
    if (SchemaComponent === null) {
      return null;
    } else if (componentProps.schemaComponent !== null && SchemaComponent === undefined) {
      throw Error(`Component not found in injector: ${componentProps.schemaComponent}`);
    }
    const createFn = props.createFn;
    if (typeof createFn === 'function') {
      return createFn(SchemaComponent, componentProps);
    }
    return React.createElement(SchemaComponent, _extends({
      key: componentProps.id
    }, componentProps));
  };
  const mapFieldsToComponents = fields => {
    const FieldComponent = props.baseFieldComponent;
    return fields.map(field => {
      let newProps = field;
      if (field.children) {
        newProps = Object.assign({}, field, {
          children: mapFieldsToComponents(field.children)
        });
      }
      newProps = Object.assign({
        onAutofill: props.onAutofill,
        formid: props.form
      }, newProps);
      if (field.schemaType === 'Structural' || field.readOnly === true) {
        return buildComponent(newProps);
      }
      return React.createElement(FieldComponent, _extends({
        key: newProps.id
      }, newProps, {
        component: buildComponent
      }));
    });
  };
  const handleAction = event => {
    if (typeof props.onAction === 'function') {
      props.onAction(event, props.values);
    }
    if (!event.isPropagationStopped()) {
      setSubmittingAction(event.currentTarget.name);
    }
  };
  const handleSubmit = data => {
    let action = '';
    if (submittingAction) {
      action = submittingAction;
    } else if (props.schema.schema.actions[0]) {
      action = props.schema.schema.actions[0].name;
    }
    const dataWithAction = Object.assign({}, data, action ? {
      [action]: 1
    } : {});
    const requestedSchema = props.responseRequestedSchema.join();
    const headers = {
      'X-Formschema-Request': requestedSchema,
      'X-Requested-With': 'XMLHttpRequest'
    };
    const submitFn = customData => submitApi(customData || dataWithAction, headers).then(formSchema => {
      setSubmittingAction(null);
      return formSchema;
    }).catch(reason => {
      setSubmittingAction(null);
      throw reason;
    });
    if (typeof props.onSubmit === 'function') {
      return props.onSubmit(dataWithAction, action, submitFn);
    }
    return submitFn();
  };
  const mapActionsToComponents = actions => {
    return actions.map(action => {
      const newProps = Object.assign({}, action);
      if (action.children) {
        newProps.children = mapActionsToComponents(action.children);
      } else {
        newProps.onClick = handleAction;
        if (props.submitting && submittingAction === action.name) {
          newProps.loading = true;
        }
      }
      return buildComponent(newProps);
    });
  };
  const normalizeFields = (fields, state) => {
    return fields.map(field => {
      const fieldState = state && state.fields ? state.fields.find(item => item.id === field.id) : {};
      const data = _merge.default.recursive(true, (0, _schemaFieldValues.schemaMerge)(field, fieldState), {
        schemaComponent: fieldState && fieldState.component ? fieldState.component : field.component
      });
      if (field.children) {
        data.children = normalizeFields(field.children, state);
      }
      return data;
    });
  };
  const schema = props.schema.schema;
  const state = props.schema.state;
  const BaseFormComponent = props.baseFormComponent;
  const attributes = {
    ...schema.attributes,
    className: schema.attributes.class,
    encType: schema.attributes.enctype,
    noValidate: true
  };
  delete attributes.class;
  delete attributes.enctype;
  const {
    asyncValidate,
    fieldHolder,
    actionHolder,
    onSubmitFail,
    onSubmitSuccess,
    shouldAsyncValidate,
    touchOnBlur,
    touchOnChange,
    persistentSubmitErrors,
    form,
    afterMessages,
    autoFocus,
    formTag
  } = props;
  let formDOMRef = null;
  const newProps = {
    form,
    afterMessages,
    fields: normalizeFields(schema.fields, state),
    fieldHolder,
    actions: normalizeFields(schema.actions, state),
    actionHolder,
    attributes,
    data: schema.data,
    initialValues: (0, _schemaFieldValues.default)(schema, state),
    onSubmit: handleSubmit,
    valid: state && state.valid,
    messages: state && Array.isArray(state.messages) ? state.messages : [],
    mapActionsToComponents: mapActionsToComponents,
    mapFieldsToComponents: mapFieldsToComponents,
    asyncValidate,
    onSubmitFail,
    onSubmitSuccess,
    shouldAsyncValidate,
    touchOnBlur,
    touchOnChange,
    persistentSubmitErrors,
    validate: validateForm,
    autoFocus,
    setDOM: formDOM => {
      formDOMRef = formDOM;
    },
    formTag
  };
  return React.createElement(BaseFormComponent, newProps);
};
exports.Component = FormBuilder;
const schemaPropType = exports.schemaPropType = _propTypes.default.shape({
  id: _propTypes.default.string,
  schema: _propTypes.default.shape({
    attributes: _propTypes.default.shape({
      class: _propTypes.default.string,
      enctype: _propTypes.default.string
    }),
    fields: _propTypes.default.array.isRequired
  }),
  state: _propTypes.default.shape({
    fields: _propTypes.default.array
  }),
  loading: _propTypes.default.bool,
  stateOverride: _propTypes.default.shape({
    fields: _propTypes.default.array
  })
});
const basePropTypes = exports.basePropTypes = {
  createFn: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  onAction: _propTypes.default.func,
  asyncValidate: _propTypes.default.func,
  onSubmitFail: _propTypes.default.func,
  onSubmitSuccess: _propTypes.default.func,
  shouldAsyncValidate: _propTypes.default.func,
  touchOnBlur: _propTypes.default.bool,
  touchOnChange: _propTypes.default.bool,
  persistentSubmitErrors: _propTypes.default.bool,
  validate: _propTypes.default.func,
  values: _propTypes.default.object,
  submitting: _propTypes.default.bool,
  baseFormComponent: _propTypes.default.elementType.isRequired,
  baseFieldComponent: _propTypes.default.elementType.isRequired,
  getCustomFields: _propTypes.default.func,
  responseRequestedSchema: _propTypes.default.arrayOf(_propTypes.default.oneOf(['schema', 'state', 'errors', 'auto'])),
  identifier(props, propName, componentName) {
    if (!/^[A-Za-z0-9_.]+$/.test(props[propName])) {
      return new Error(`
        Invalid identifier supplied to ${componentName}. Must be a set of
        dot-separated alphanumeric strings.
      `);
    }
    return null;
  }
};
FormBuilder.propTypes = Object.assign({}, basePropTypes, {
  form: _propTypes.default.string.isRequired,
  schema: schemaPropType.isRequired,
  autoFocus: _propTypes.default.bool
});
FormBuilder.defaultProps = {
  responseRequestedSchema: ['auto'],
  autoFocus: false
};
var _default = exports["default"] = (0, _Injector.withInjector)(FormBuilder);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilderModal/FormBuilderModal.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilderModal/FormBuilderModal.js ***!
  \**********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _FormBuilderLoader = _interopRequireDefault(__webpack_require__(/*! containers/FormBuilderLoader/FormBuilderLoader */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js"));
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Modal = _interopRequireDefault(__webpack_require__(/*! components/Modal/Modal */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Modal/Modal.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const noop = () => null;
const FormBuilderModal = _ref => {
  let {
    children,
    FormBuilderLoaderComponent,
    onLoadingError,
    onSubmit,
    responseClassBad,
    responseClassGood,
    showErrorMessage,
    autoFocus,
    bodyClassName,
    identifier,
    onAction,
    schemaUrl,
    className,
    isOpen,
    modalClassName,
    ModalComponent,
    ModalHeaderComponent,
    onClosed,
    showCloseButton,
    size,
    title
  } = _ref;
  const [response, setResponse] = (0, _react.useState)(null);
  const [error, setError] = (0, _react.useState)(null);
  const handleLoadingError = schema => {
    const providesOnLoadingError = onLoadingError !== noop;
    if (showErrorMessage || !providesOnLoadingError) {
      const errorResponse = schema.errors && schema.errors[0];
      setResponse(errorResponse.value);
      setError(true);
    }
    if (providesOnLoadingError) {
      onLoadingError(schema);
    }
  };
  const handleHide = () => {
    setResponse(null);
    setError(false);
    if (typeof onClosed === 'function') {
      onClosed();
    }
  };
  const handleSubmit = (data, action, submitFn) => {
    setResponse(null);
    setError(false);
    let promise = null;
    if (typeof onSubmit === 'function') {
      promise = onSubmit(data, action, submitFn);
    } else {
      promise = submitFn();
    }
    if (promise) {
      promise.then(successResponse => {
        if (successResponse) {
          setResponse(successResponse.message);
          setError(false);
        }
        return successResponse;
      }).catch(errorPromise => {
        errorPromise.then(errorText => {
          setResponse(errorText);
          setError(true);
        });
      });
    } else {
      throw new Error('Promise was not returned for submitting');
    }
    return promise;
  };
  const modalProps = {
    className,
    isOpen,
    modalClassName,
    ModalComponent,
    ModalHeaderComponent,
    onClosed: handleHide,
    showCloseButton,
    size,
    title
  };
  const formBuilderLoaderProps = {
    actionHolder: {
      className: 'modal-footer'
    },
    autoFocus,
    bodyClassName,
    fieldHolder: {
      className: (0, _classnames.default)('modal-body', bodyClassName)
    },
    identifier,
    onAction,
    onLoadingError: handleLoadingError,
    onSubmit: handleSubmit,
    schemaUrl
  };
  return _react.default.createElement(_Modal.default, modalProps, response && _react.default.createElement("div", {
    className: error ? responseClassBad : responseClassGood
  }, (0, _castStringToElement.default)('span', {
    html: response
  })), schemaUrl && _react.default.createElement(FormBuilderLoaderComponent, formBuilderLoaderProps), children);
};
FormBuilderModal.propTypes = {
  autoFocus: _propTypes.default.bool,
  bodyClassName: _propTypes.default.string,
  schemaUrl: _propTypes.default.string,
  onSubmit: _propTypes.default.func,
  onAction: _propTypes.default.func,
  responseClassGood: _propTypes.default.string,
  responseClassBad: _propTypes.default.string,
  identifier: _propTypes.default.string,
  showErrorMessage: _propTypes.default.bool,
  onLoadingError: _propTypes.default.func,
  FormBuilderLoaderComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  ..._Modal.default.propTypes
};
FormBuilderModal.defaultProps = {
  showErrorMessage: false,
  onLoadingError: noop,
  modalClassName: 'form-builder-modal',
  responseClassGood: 'alert alert-success',
  responseClassBad: 'alert alert-danger',
  FormBuilderLoaderComponent: _FormBuilderLoader.default
};
var _default = exports["default"] = FormBuilderModal;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridField.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridField.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _FormConstants = _interopRequireDefault(__webpack_require__(/*! components/Form/FormConstants */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Form/FormConstants.js"));
var actions = _interopRequireWildcard(__webpack_require__(/*! state/records/RecordsActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActions.js"));
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _GridFieldTable = _interopRequireDefault(__webpack_require__(/*! ./GridFieldTable */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldTable.js"));
var _GridFieldHeader = _interopRequireDefault(__webpack_require__(/*! ./GridFieldHeader */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeader.js"));
var _GridFieldHeaderCell = _interopRequireDefault(__webpack_require__(/*! ./GridFieldHeaderCell */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeaderCell.js"));
var _GridFieldRow = _interopRequireDefault(__webpack_require__(/*! ./GridFieldRow */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldRow.js"));
var _GridFieldCell = _interopRequireDefault(__webpack_require__(/*! ./GridFieldCell */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldCell.js"));
var _GridFieldAction = _interopRequireDefault(__webpack_require__(/*! ./GridFieldAction */ "./client/src/components/GridField/GridFieldAction.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const NotYetLoaded = [];
class GridField extends _react.Component {
  constructor(props) {
    super(props);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
  }
  componentDidMount() {
    const data = this.props.data;
    this.props.actions.fetchRecords(data.recordType, data.collectionReadEndpoint.method, data.collectionReadEndpoint.url);
  }
  createRowActions(record) {
    return _react.default.createElement(_GridFieldCell.default, {
      className: "grid-field__cell--actions",
      key: "Actions"
    }, _react.default.createElement(_GridFieldAction.default, {
      icon: "cog",
      onClick: this.editRecord,
      record: record
    }), _react.default.createElement(_GridFieldAction.default, {
      icon: "cancel",
      onClick: this.deleteRecord,
      record: record
    }));
  }
  createCell(record, column) {
    const handleDrillDown = this.props.data.onDrillDown;
    const cellProps = {
      className: handleDrillDown ? 'grid-field__cell--drillable' : '',
      onDrillDown: handleDrillDown ? event => handleDrillDown(event, record) : null,
      key: `${column.name}`,
      width: column.width
    };
    const val = column.field.split('.').reduce((a, b) => a[b], record);
    return (0, _castStringToElement.default)(_GridFieldCell.default, val, cellProps);
  }
  createRow(record) {
    const rowProps = {
      className: this.props.data.onDrillDown ? 'grid-field__row--drillable' : '',
      key: `${record.ID}`
    };
    const cells = this.props.data.columns.map(column => this.createCell(record, column));
    const rowActions = this.createRowActions(record);
    return _react.default.createElement(_GridFieldRow.default, rowProps, cells, rowActions);
  }
  deleteRecord(event, id) {
    event.preventDefault();
    const headers = {};
    headers[_FormConstants.default.CSRF_HEADER] = this.props.config.SecurityID;
    if (!confirm(_i18n.default._t('CampaignAdmin.DELETECAMPAIGN', 'Are you sure you want to delete this record?'))) {
      return;
    }
    this.props.actions.deleteRecord(this.props.data.recordType, id, this.props.data.itemDeleteEndpoint.method, this.props.data.itemDeleteEndpoint.url, headers);
  }
  editRecord(event, id) {
    event.preventDefault();
    if (!this.props.data) {
      return;
    }
    if (typeof this.props.data.onEditRecord === 'function') {
      this.props.data.onEditRecord(event, id);
    }
  }
  render() {
    if (this.props.records === NotYetLoaded) {
      return _react.default.createElement("div", null, _i18n.default._t('CampaignAdmin.LOADING', 'Loading...'));
    }
    if (!this.props.records.length) {
      return _react.default.createElement("div", null, _i18n.default._t('CampaignAdmin.NO_RECORDS', 'No campaigns created yet.'));
    }
    const actionPlaceholder = _react.default.createElement("th", {
      key: "holder",
      className: "grid-field__action-placeholder"
    });
    const headerCells = this.props.data.columns.map(column => _react.default.createElement(_GridFieldHeaderCell.default, {
      key: column.name
    }, column.name));
    const header = _react.default.createElement(_GridFieldHeader.default, null, headerCells.concat(actionPlaceholder));
    const rows = this.props.records.map(record => this.createRow(record));
    return _react.default.createElement(_GridFieldTable.default, {
      header: header,
      rows: rows
    });
  }
}
GridField.propTypes = {
  data: _propTypes.default.shape({
    recordType: _propTypes.default.string.isRequired,
    headerColumns: _propTypes.default.array,
    collectionReadEndpoint: _propTypes.default.object,
    onDrillDown: _propTypes.default.func,
    onEditRecord: _propTypes.default.func
  })
};
function mapStateToProps(state, ownProps) {
  const recordType = ownProps.data && ownProps.data.recordType;
  return {
    config: state.config,
    records: recordType && state.records[recordType] ? state.records[recordType] : NotYetLoaded
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: (0, _redux.bindActionCreators)(actions, dispatch)
  };
}
var _default = exports["default"] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GridField);

/***/ }),

/***/ "./client/src/components/GridField/GridFieldAction.js":
/*!************************************************************!*\
  !*** ./client/src/components/GridField/GridFieldAction.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class GridFieldAction extends _react.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    this.props.onClick(event, this.props.record.ID);
  }
  render() {
    return _react.default.createElement("button", {
      className: `grid-field__icon-action font-icon-${this.props.icon} btn--icon-lg`,
      onClick: this.handleClick
    });
  }
}
GridFieldAction.propTypes = {
  onClick: _propTypes.default.func.isRequired
};
var _default = exports["default"] = GridFieldAction;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldCell.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldCell.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class GridFieldCell extends _react.Component {
  constructor(props) {
    super(props);
    this.handleDrillDown = this.handleDrillDown.bind(this);
  }
  handleDrillDown(event) {
    if (typeof this.props.onDrillDown === 'function') {
      this.props.onDrillDown(event);
    }
  }
  render() {
    const classNames = ['grid-field__cell', this.props.className];
    const {
      onDrillDown,
      ...props
    } = this.props;
    return _react.default.createElement("td", _extends({}, props, {
      className: (0, _classnames.default)(classNames),
      onClick: this.handleDrillDown
    }));
  }
}
GridFieldCell.propTypes = {
  className: _propTypes.default.string,
  onDrillDown: _propTypes.default.func
};
var _default = exports["default"] = GridFieldCell;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeader.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeader.js ***!
  \**************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _GridFieldRow = _interopRequireDefault(__webpack_require__(/*! ./GridFieldRow */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldRow.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GridFieldHeader = props => _react.default.createElement(_GridFieldRow.default, null, props.children);
var _default = exports["default"] = GridFieldHeader;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeaderCell.js":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeaderCell.js ***!
  \******************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GridFieldHeaderCell = props => _react.default.createElement("th", null, props.children);
var _default = exports["default"] = GridFieldHeaderCell;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldRow.js":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldRow.js ***!
  \***********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GridFieldRow = props => {
  const className = `grid-field__row ${props.className}`;
  return _react.default.createElement("tr", {
    tabIndex: 0,
    className: className
  }, props.children);
};
var _default = exports["default"] = GridFieldRow;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldTable.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldTable.js ***!
  \*************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class GridFieldTable extends _react.Component {
  generateHeader() {
    if (typeof this.props.header !== 'undefined') {
      return this.props.header;
    }
    return null;
  }
  generateRows() {
    if (typeof this.props.rows !== 'undefined') {
      return this.props.rows;
    }
    return null;
  }
  render() {
    return _react.default.createElement("div", {
      className: "grid-field"
    }, _react.default.createElement("table", {
      className: "table table-hover grid-field__table"
    }, _react.default.createElement("thead", null, this.generateHeader()), _react.default.createElement("tbody", null, this.generateRows())));
  }
}
GridFieldTable.propTypes = {
  header: _propTypes.default.object,
  rows: _propTypes.default.array
};
var _default = exports["default"] = GridFieldTable;

/***/ }),

/***/ "./client/src/components/GridFieldActions/GridFieldActions.js":
/*!********************************************************************!*\
  !*** ./client/src/components/GridFieldActions/GridFieldActions.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _GridFieldDropdownAction = _interopRequireDefault(__webpack_require__(/*! ./GridFieldDropdownAction */ "./client/src/components/GridFieldActions/GridFieldDropdownAction.js"));
var _ActionMenu = _interopRequireDefault(__webpack_require__(/*! ../ActionMenu/ActionMenu */ "./client/src/components/ActionMenu/ActionMenu.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class GridFieldActions extends _react.PureComponent {
  renderMultipleActions(schema) {
    const groupedActions = schema.reduce((groups, action) => {
      const groupsList = groups;
      const groupName = action.group;
      if (!groupName) {
        throw new Error(`Action: \"${action.title}\" has no group assigned`);
      }
      if (!groupsList[groupName]) {
        groupsList[groupName] = [];
      }
      groupsList[groupName].push(action);
      return groupsList;
    }, []);
    const dropdownMenuProps = {
      right: true
    };
    const dropdownToggleClassNames = ['action-menu__toggle', 'btn', 'btn--no-text', 'btn-sm', 'font-icon-dot-3'];
    return _react.default.createElement(_ActionMenu.default, {
      dropdownMenuProps: dropdownMenuProps,
      dropdownToggleClassNames: dropdownToggleClassNames
    }, Object.keys(groupedActions).map((group, groupIndex) => [groupIndex !== 0 && _react.default.createElement(_reactstrap.DropdownItem, {
      divider: true,
      key: group
    }), groupedActions[group].map((action, actionIndex) => _react.default.createElement(_GridFieldDropdownAction.default, {
      data: action.data,
      title: action.title,
      type: action.type,
      url: action.url,
      key: actionIndex
    }))]));
  }
  renderSingleAction(action) {
    const {
      type,
      title,
      data
    } = action;
    let {
      url
    } = action;
    let buttonType;
    if (type === 'submit') {
      buttonType = 'submit';
      url = undefined;
    }
    const classNames = (0, _classnames.default)('action', data.classNames);
    return _react.default.createElement(_reactstrap.Button, {
      className: classNames,
      type: buttonType,
      href: url,
      "data-url": data['data-url'],
      "data-action-state": data['data-action-state'],
      name: data.name,
      color: "secondary"
    }, title);
  }
  render() {
    const {
      schema
    } = this.props;
    if (schema.length > 1) {
      return this.renderMultipleActions(schema);
    } else if (schema.length === 1) {
      return this.renderSingleAction(schema[0]);
    }
    return null;
  }
}
const actionShape = _GridFieldDropdownAction.default.propTypes;
actionShape.group = _propTypes.default.string;
GridFieldActions.propTypes = _propTypes.default.arrayOf(_propTypes.default.shape(actionShape)).isRequired;
var _default = exports["default"] = GridFieldActions;

/***/ }),

/***/ "./client/src/components/GridFieldActions/GridFieldDropdownAction.js":
/*!***************************************************************************!*\
  !*** ./client/src/components/GridFieldActions/GridFieldDropdownAction.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class GridFieldDropdownAction extends _react.PureComponent {
  render() {
    const {
      type,
      title,
      data
    } = this.props;
    let {
      url
    } = this.props;
    const classNames = (0, _classnames.default)('action', data.classNames);
    let elementType = null;
    switch (type) {
      case 'submit':
      case 'button':
        elementType = 'button';
        url = undefined;
        break;
      case 'link':
        elementType = 'a';
        break;
      default:
        elementType = undefined;
        break;
    }
    return _react.default.createElement(_reactstrap.DropdownItem, {
      className: classNames,
      href: url,
      tag: elementType,
      type: elementType === 'button' ? 'button' : undefined,
      "data-url": data['data-url'],
      "data-action-state": data['data-action-state'],
      name: data.name
    }, title);
  }
}
GridFieldDropdownAction.propTypes = {
  data: _propTypes.default.object,
  title: _propTypes.default.string.isRequired,
  type: _propTypes.default.oneOf(['submit', 'link']),
  url: _propTypes.default.string
};
var _default = exports["default"] = GridFieldDropdownAction;

/***/ }),

/***/ "./client/src/components/HeaderField/HeaderField.js":
/*!**********************************************************!*\
  !*** ./client/src/components/HeaderField/HeaderField.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function HeaderField(_ref) {
  let {
    className,
    extraClass,
    id,
    data: {
      headingLevel,
      title
    }
  } = _ref;
  const Heading = `h${headingLevel || 3}`;
  return _react.default.createElement("div", {
    className: "field"
  }, _react.default.createElement(Heading, {
    className: (0, _classnames.default)(className, extraClass),
    id: id
  }, title));
}
HeaderField.propTypes = {
  className: _propTypes.default.string,
  extraClass: _propTypes.default.string,
  id: _propTypes.default.string,
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
    headingLevel: _propTypes.default.number,
    title: _propTypes.default.string
  })]).isRequired
};
HeaderField.defaultProps = {
  className: '',
  extraClass: ''
};
var _default = exports["default"] = HeaderField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/HiddenField/HiddenField.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/HiddenField/HiddenField.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class HiddenField extends _react.Component {
  getInputProps() {
    return {
      className: (0, _classnames.default)(this.props.className, this.props.extraClass),
      id: this.props.id,
      name: this.props.name,
      type: 'hidden',
      value: this.props.value || ''
    };
  }
  render() {
    return _react.default.createElement(_reactstrap.Input, this.getInputProps());
  }
}
HiddenField.propTypes = {
  id: _propTypes.default.string,
  extraClass: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  value: _propTypes.default.any
};
HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: ''
};
var _default = exports["default"] = HiddenField;

/***/ }),

/***/ "./client/src/components/HtmlEditorField/HtmlEditorField.js":
/*!******************************************************************!*\
  !*** ./client/src/components/HtmlEditorField/HtmlEditorField.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactLoadScript = _interopRequireDefault(__webpack_require__(/*! react-load-script */ "./node_modules/react-load-script/lib/index.js"));
var _TextField = __webpack_require__(/*! components/TextField/TextField */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TextField/TextField.js");
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
__webpack_require__(/*! events-polyfill */ "./node_modules/events-polyfill/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HtmlEditorField extends _TextField.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: !props.data.editorjs
    };
    this.inputRef = null;
    this.handleReady = this.handleReady.bind(this);
  }
  getInputProps() {
    return {
      ...super.getInputProps(),
      ...this.props.data.attributes,
      innerRef: ref => {
        this.inputRef = ref;
      }
    };
  }
  getEditorElement() {
    return document.getElementById(this.getInputProps().id);
  }
  getEditor() {
    return window.TinyMCE && window.TinyMCE.get(this.getInputProps().id);
  }
  handleReady() {
    if (!window.TinyMCE && window.tinymce) {
      window.TinyMCE = window.tinymce;
    }
    this.setState({
      isReady: true
    });
  }
  registerChangeListener() {
    const target = this.getEditorElement();
    this.getEditor().on('change keyup setcontent', () => {
      super.handleChange({
        target
      });
    });
  }
  renderDependencyScript() {
    if (!window.tinymce && !window.TinyMCE) {
      return _react.default.createElement(_reactLoadScript.default, {
        url: this.props.data.editorjs,
        onLoad: this.handleReady
      });
    }
    setTimeout(() => {
      this.handleReady();
    }, 0);
    return null;
  }
  render() {
    return this.state.isReady ? super.render() : this.renderDependencyScript();
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      isReady
    } = this.state;
    if (!isReady) {
      return;
    }
    if (isReady !== prevState.isReady) {
      setTimeout(() => {
        const {
          document,
          jQuery: $
        } = window;
        const mountEvent = $ ? $.Event('EntwineElementsAdded') : new Event('noop');
        const editorElement = this.getEditorElement();
        mountEvent.targets = [editorElement];
        if ($) {
          $(document).triggerHandler(mountEvent);
        }
        this.registerChangeListener();
      }, 1);
    }
    const {
      value
    } = this.props;
    if (value !== prevProps.value) {
      const event = new Event('change', {
        bubbles: true
      });
      event.simulated = true;
      event.value = value;
      this.inputRef.dispatchEvent(event);
    }
  }
  componentWillUnmount() {
    if (!this.state.isReady) {
      return;
    }
    const {
      document,
      jQuery: $
    } = window;
    const unmountEvent = $ ? $.Event('EntwineElementsRemoved') : new Event('noop');
    const editorElement = this.getEditorElement();
    const editor = this.getEditor();
    if (editor) {
      editor.save();
    }
    unmountEvent.targets = [editorElement];
    super.handleChange({
      target: editorElement
    });
    if ($) {
      $(document).triggerHandler(unmountEvent);
    }
  }
}
exports.Component = HtmlEditorField;
var _default = exports["default"] = (0, _FieldHolder.default)(HtmlEditorField);

/***/ }),

/***/ "./client/src/components/HtmlReadonlyField/HtmlReadonlyField.js":
/*!**********************************************************************!*\
  !*** ./client/src/components/HtmlReadonlyField/HtmlReadonlyField.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class HtmlReadonlyField extends _react.Component {
  getInputProps() {
    return {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name
    };
  }
  render() {
    return _react.default.createElement(_reactstrap.Input, _extends({
      plaintext: true,
      tag: "p",
      dangerouslySetInnerHTML: {
        __html: this.props.value
      }
    }, this.getInputProps()));
  }
}
exports.Component = HtmlReadonlyField;
HtmlReadonlyField.propTypes = {
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  extraClass: _propTypes.default.string,
  value: _propTypes.default.string
};
HtmlReadonlyField.defaultProps = {
  extraClass: '',
  className: ''
};
var _default = exports["default"] = (0, _FieldHolder.default)(HtmlReadonlyField);

/***/ }),

/***/ "./client/src/components/IframeDialog/IframeDialog.js":
/*!************************************************************!*\
  !*** ./client/src/components/IframeDialog/IframeDialog.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class IframeDialog extends _react.Component {
  constructor(props) {
    super(props);
    this.handleClosed = this.handleClosed.bind(this);
  }
  handleClosed() {
    if (typeof this.props.onClosed === 'function') {
      this.props.onClosed();
    }
  }
  renderHeader() {
    const title = this.props.title;
    if (title) {
      return _react.default.createElement(_reactstrap.ModalHeader, {
        toggle: this.handleClosed
      }, title);
    }
    return null;
  }
  render() {
    return _react.default.createElement(_reactstrap.Modal, {
      isOpen: this.props.isOpen,
      onClosed: this.handleClosed,
      className: (0, _classnames.default)('iframe-dialog', this.props.className),
      modalClassName: this.props.modalClassName
    }, this.renderHeader(), _react.default.createElement(_reactstrap.ModalBody, {
      className: this.props.bodyClassName
    }, _react.default.createElement("iframe", {
      id: this.props.iframeId,
      className: (0, _classnames.default)('iframe-dialog__iframe', this.props.iframeClassName),
      src: this.props.url,
      frameBorder: 0
    })));
  }
}
IframeDialog.propTypes = {
  url: _propTypes.default.string.isRequired,
  onClosed: _propTypes.default.func,
  isOpen: _propTypes.default.bool,
  title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
  modalClassName: _propTypes.default.string,
  iframeId: _propTypes.default.string,
  iframeClassName: _propTypes.default.string,
  className: _propTypes.default.string,
  bodyClassName: _propTypes.default.string
};
IframeDialog.defaultProps = {
  isOpen: false,
  title: null
};
var _default = exports["default"] = IframeDialog;

/***/ }),

/***/ "./client/src/components/InputField/InputField.js":
/*!********************************************************!*\
  !*** ./client/src/components/InputField/InputField.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Tip = _interopRequireWildcard(__webpack_require__(/*! components/Tip/Tip */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tip/Tip.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class InputField extends _react.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  getInputProps() {
    const props = {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      value: this.props.value || '',
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
      maxLength: this.props.data && this.props.data.maxlength,
      type: this.props.type ? this.props.type : null,
      onBlur: this.props.onBlur,
      onFocus: this.props.onFocus
    };
    if (this.props.attributes && !Array.isArray(this.props.attributes)) {
      Object.assign(props, this.props.attributes);
    }
    if (!this.props.readOnly) {
      Object.assign(props, {
        onChange: this.handleChange
      });
    }
    return props;
  }
  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      if (!event.target) {
        return;
      }
      this.props.onChange(event, {
        id: this.props.id,
        value: event.target.value
      });
    }
  }
  renderFieldWithTip() {
    const {
      id,
      title,
      tip
    } = this.props;
    return _react.default.createElement(_reactstrap.InputGroup, null, _react.default.createElement(_reactstrap.Input, this.getInputProps()), _react.default.createElement(_reactstrap.InputGroupAddon, {
      addonType: "append"
    }, _react.default.createElement(_Tip.default, _extends({}, tip, {
      fieldTitle: title,
      id: `${id}-tip`
    }))));
  }
  render() {
    if (this.props.tip) {
      return this.renderFieldWithTip();
    }
    return _react.default.createElement(_reactstrap.Input, this.getInputProps());
  }
}
exports.Component = InputField;
InputField.propTypes = {
  extraClass: _propTypes.default.string,
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  onChange: _propTypes.default.func,
  onBlur: _propTypes.default.func,
  onFocus: _propTypes.default.func,
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  readOnly: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  type: _propTypes.default.string,
  autoFocus: _propTypes.default.bool,
  attributes: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.array]),
  tip: _propTypes.default.shape(_Tip.tipShape)
};
InputField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  type: 'text',
  attributes: {}
};
var _default = exports["default"] = InputField;

/***/ }),

/***/ "./client/src/components/LabelField/LabelField.js":
/*!********************************************************!*\
  !*** ./client/src/components/LabelField/LabelField.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LabelField = _ref => {
  let {
    id,
    className,
    title,
    extraClass,
    data
  } = _ref;
  const htmlFor = data && data.target;
  const classes = `${className} ${extraClass}`;
  return _react.default.createElement("label", {
    id: id,
    className: classes,
    htmlFor: htmlFor
  }, title);
};
LabelField.propTypes = {
  id: _propTypes.default.number,
  className: _propTypes.default.string,
  extraClass: _propTypes.default.string,
  title: _propTypes.default.node,
  data: _propTypes.default.shape({
    target: _propTypes.default.string
  })
};
LabelField.defaultProps = {
  className: '',
  extraClass: ''
};
var _default = exports["default"] = LabelField;

/***/ }),

/***/ "./client/src/components/Link/Link.js":
/*!********************************************!*\
  !*** ./client/src/components/Link/Link.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function Link(_ref) {
  let {
    children,
    href,
    ...props
  } = _ref;
  const hasRouter = (0, _reactRouterDom.useInRouterContext)();
  const LinkComponent = hasRouter ? _reactRouterDom.Link : 'a';
  return _react.default.createElement(LinkComponent, _extends({}, props, {
    to: hasRouter ? href : undefined,
    href: hasRouter ? undefined : href
  }), children);
}
Link.propTypes = {
  children: _propTypes.default.node.isRequired,
  href: _propTypes.default.string.isRequired
};
var _default = exports["default"] = Link;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroup.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroup.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _ListGroupItem = _interopRequireDefault(__webpack_require__(/*! ./ListGroupItem */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroupItem.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ListGroup = props => _react.default.createElement("div", {
  className: "list-group"
}, props.items.map(item => _react.default.createElement(_ListGroupItem.default, item)));
ListGroup.propTypes = {
  items: _propTypes.default.array
};
var _default = exports["default"] = ListGroup;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroupItem.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroupItem.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class ListGroupItem extends _react.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.onClickArg);
    }
  }
  render() {
    const className = `list-group-item ${this.props.className}`;
    return _react.default.createElement("a", {
      role: "button",
      tabIndex: 0,
      className: className,
      onClick: this.handleClick
    }, this.props.children);
  }
}
ListGroupItem.propTypes = {
  onClickArg: _propTypes.default.any,
  onClick: _propTypes.default.func
};
var _default = exports["default"] = ListGroupItem;

/***/ }),

/***/ "./client/src/components/ListboxField/ListboxField.js":
/*!************************************************************!*\
  !*** ./client/src/components/ListboxField/ListboxField.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactSelect = _interopRequireDefault(__webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js"));
var _async = _interopRequireDefault(__webpack_require__(/*! react-select/async */ "./node_modules/react-select/async/dist/react-select-async.esm.js"));
var _asyncCreatable = _interopRequireDefault(__webpack_require__(/*! react-select/async-creatable */ "./node_modules/react-select/async-creatable/dist/react-select-async-creatable.esm.js"));
var _creatable = _interopRequireDefault(__webpack_require__(/*! react-select/creatable */ "./node_modules/react-select/creatable/dist/react-select-creatable.esm.js"));
var _EmotionCssCacheProvider = _interopRequireDefault(__webpack_require__(/*! containers/EmotionCssCacheProvider/EmotionCssCacheProvider */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _url = _interopRequireDefault(__webpack_require__(/*! url */ "./node_modules/url/url.js"));
var _debouncePromise = _interopRequireDefault(__webpack_require__(/*! debounce-promise */ "./node_modules/debounce-promise/dist/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class ListboxField extends _react.Component {
  constructor(props) {
    super(props);
    if (!this.isControlled()) {
      this.state = {
        value: props.value
      };
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.isValidNewOption = this.isValidNewOption.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.fetchOptions = (0, _debouncePromise.default)(this.fetchOptions, 500);
  }
  getOptions(input) {
    const {
      lazyLoad,
      options
    } = this.props;
    if (!lazyLoad) {
      return Promise.resolve(options);
    }
    if (!input) {
      return Promise.resolve([]);
    }
    return this.fetchOptions(input);
  }
  handleChange(value) {
    if (this.isControlled()) {
      this.props.onChange(value);
      return;
    }
    this.setState({
      value
    });
  }
  isControlled() {
    return typeof this.props.onChange === 'function';
  }
  handleOnBlur() {}
  fetchOptions(input) {
    const {
      optionUrl,
      labelKey,
      valueKey
    } = this.props;
    const fetchURL = _url.default.parse(optionUrl, true);
    fetchURL.query.term = input;
    return (0, _isomorphicFetch.default)(_url.default.format(fetchURL), {
      credentials: 'same-origin'
    }).then(response => response.json()).then(json => json.items.map(item => ({
      [labelKey]: item.Title,
      [valueKey]: item.Value,
      Selected: item.Selected
    })));
  }
  isValidNewOption(inputValue, value, currentOptions) {
    const {
      valueKey
    } = this.props;
    if (!inputValue) {
      return false;
    }
    if (Array.isArray(value)) {
      if (this.valueInOptions(inputValue, value, valueKey)) {
        return false;
      }
    } else if (inputValue === value[valueKey]) {
      return false;
    }
    return !this.valueInOptions(inputValue, currentOptions, valueKey);
  }
  valueInOptions(value, options, valueKey) {
    for (const item of options) {
      if (value === item[valueKey]) {
        return true;
      }
    }
    return false;
  }
  render() {
    const {
      lazyLoad,
      options,
      creatable,
      multi,
      disabled,
      labelKey,
      valueKey,
      SelectComponent,
      AsyncCreatableSelectComponent,
      AsyncSelectComponent,
      CreatableSelectComponent,
      ...passThroughAttributes
    } = this.props;
    const optionAttributes = lazyLoad ? {
      loadOptions: this.getOptions
    } : {
      options
    };
    let DynamicSelect = SelectComponent;
    if (lazyLoad && creatable) {
      DynamicSelect = AsyncCreatableSelectComponent;
    } else if (lazyLoad) {
      DynamicSelect = AsyncSelectComponent;
    } else if (creatable) {
      DynamicSelect = CreatableSelectComponent;
    }
    if (!this.isControlled()) {
      passThroughAttributes.value = this.state.value;
    }
    if (!multi && passThroughAttributes.value) {
      if (Object.keys(passThroughAttributes.value).length > 0) {
        const value = passThroughAttributes.value[Object.keys(passThroughAttributes.value)[0]];
        if (typeof value === 'object') {
          passThroughAttributes.value = value;
        }
      }
    }
    return _react.default.createElement(_EmotionCssCacheProvider.default, null, _react.default.createElement(DynamicSelect, _extends({}, passThroughAttributes, {
      isMulti: multi,
      isDisabled: disabled,
      cacheOptions: true,
      onChange: this.handleChange,
      onBlur: this.handleOnBlur
    }, optionAttributes, {
      getOptionLabel: option => option[labelKey],
      getOptionValue: option => option[valueKey],
      noOptionsMessage: _ref => {
        let {
          inputValue
        } = _ref;
        return inputValue ? _i18n.default._t('ListboxField.NO_OPTIONS', 'No options') : _i18n.default._t('ListboxField.TYPE_TO_SEARCH', 'Type to search');
      },
      isValidNewOption: this.isValidNewOption,
      getNewOptionData: (inputValue, label) => ({
        [labelKey]: label,
        [valueKey]: inputValue
      }),
      classNamePrefix: "ss-listbox-field"
    })));
  }
}
exports.Component = ListboxField;
ListboxField.propTypes = {
  name: _propTypes.default.string.isRequired,
  labelKey: _propTypes.default.string.isRequired,
  valueKey: _propTypes.default.string.isRequired,
  lazyLoad: _propTypes.default.bool,
  creatable: _propTypes.default.bool,
  multi: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  options: _propTypes.default.arrayOf(_propTypes.default.object),
  optionUrl: _propTypes.default.string,
  value: _propTypes.default.any,
  onChange: _propTypes.default.func,
  onBlur: _propTypes.default.func,
  SelectComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  AsyncCreatableSelectComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  AsyncSelectComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  CreatableSelectComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func])
};
ListboxField.defaultProps = {
  labelKey: 'Title',
  valueKey: 'Value',
  disabled: false,
  lazyLoad: false,
  creatable: false,
  multi: false,
  SelectComponent: _reactSelect.default,
  AsyncCreatableSelectComponent: _asyncCreatable.default,
  AsyncSelectComponent: _async.default,
  CreatableSelectComponent: _creatable.default
};
var _default = exports["default"] = (0, _FieldHolder.default)(ListboxField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/LiteralField/LiteralField.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/LiteralField/LiteralField.js ***!
  \**************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class LiteralField extends _react.Component {
  getContent() {
    return {
      __html: this.props.value
    };
  }
  getInputProps() {
    return {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name
    };
  }
  render() {
    return _react.default.createElement("div", _extends({}, this.getInputProps(), {
      dangerouslySetInnerHTML: this.getContent()
    }));
  }
}
LiteralField.propTypes = {
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  extraClass: _propTypes.default.string,
  value: _propTypes.default.string
};
LiteralField.defaultProps = {
  extraClass: '',
  className: ''
};
var _default = exports["default"] = LiteralField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Loading/CircularLoading.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Loading/CircularLoading.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class CircularLoading extends _react.PureComponent {
  render() {
    const {
      className,
      size,
      block
    } = this.props;
    const classNames = (0, _classnames.default)('ss-circular-loading-indicator', className, {
      'ss-circular-loading-indicator--block': block
    });
    return _react.default.createElement("div", {
      style: {
        height: size,
        width: size
      },
      className: classNames
    });
  }
}
CircularLoading.propTypes = {
  className: _propTypes.default.string,
  block: _propTypes.default.bool,
  size: _propTypes.default.string
};
CircularLoading.defaultProps = {
  block: false,
  size: '6em'
};
var _default = exports["default"] = CircularLoading;

/***/ }),

/***/ "./client/src/components/Loading/Loading.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Loading/Loading.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _uuid = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/commonjs-browser/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Loading(_ref) {
  let {
    containerClass
  } = _ref;
  const id = (0, _uuid.v4)();
  return _react.default.createElement("div", {
    className: containerClass
  }, _react.default.createElement("div", {
    key: "overlay",
    className: "cms-content-loading-overlay ui-widget-overlay-light"
  }), _react.default.createElement("div", {
    key: "spinner",
    className: "cms-content-loading-spinner"
  }, _react.default.createElement("div", {
    className: "spinner"
  }, _react.default.createElement("svg", {
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    width: "512",
    height: "297",
    viewBox: "0 0 512 297",
    className: "spinner__animation"
  }, _react.default.createElement("defs", null, _react.default.createElement("path", {
    id: `spinner__animation__outline_right_${id}`,
    d: "M253 29L145 105C130 115 126 136 137 150C147 165 168 169 183 159L291 83C335 52 397 63 428 107C459 152 448 214 404 245L370 268C398 316 461 296 490 245C520 191 519 123 482 70C430 -4 327 -22 253 29Z"
  }), _react.default.createElement("path", {
    id: `spinner__animation__outline_left_${id}`,
    d: "M258 266L366 191C381 180 385 160 374 145C364 130 343 127 328 137L220 212C176 244 114 233 83 188C52 144 63 82 107 51L141 27C113 -20 50 -0 21 51C-8 104 -7 172 29 226C81 300 184 318 258 266V266Z"
  }), _react.default.createElement("clipPath", {
    id: `spinner__animation__mask_right_${id}`
  }, _react.default.createElement("use", {
    href: `#spinner__animation__outline_right_${id}`
  })), _react.default.createElement("clipPath", {
    id: `spinner__animation__mask_left_${id}`
  }, _react.default.createElement("use", {
    href: `#spinner__animation__outline_left_${id}`
  }))), _react.default.createElement("use", {
    className: "spinner__animation__empty",
    href: `#spinner__animation__outline_left_${id}`
  }), _react.default.createElement("use", {
    className: "spinner__animation__empty",
    href: `#spinner__animation__outline_right_${id}`
  }), _react.default.createElement("path", {
    d: "M 379,145 236,242 C 179,282 102,273 62,216 22,159 19,77 76,37 L 135,7",
    className: "spinner__animation__fill-left",
    clipPath: `url(#spinner__animation__mask_left_${id})`
  }), _react.default.createElement("path", {
    d: "M 138,148 281,50 c 57,-39 129,-30 169,26 39,56 41,136 -14,178 l -47,40",
    className: "spinner__animation__fill-right",
    clipPath: `url(#spinner__animation__mask_right_${id})`
  }), _react.default.createElement("path", {
    d: "M253 29L145 105C130 115 126 136 137 150C147 165 168 169 183 159L291 83C335 52 397 63 428 107C459 152 448 214 404 245L370 268C398 316 461 296 490 245C520 191 519 123 482 70C430 -4 327 -22 253 29Z"
  })))));
}
Loading.propTypes = {
  containerClass: _propTypes.default.string
};
Loading.defaultProps = {
  containerClass: 'flexbox-area-grow'
};
var _default = exports["default"] = Loading;

/***/ }),

/***/ "./client/src/components/LookupField/LookupField.js":
/*!**********************************************************!*\
  !*** ./client/src/components/LookupField/LookupField.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class LookupField extends _react.Component {
  constructor(props) {
    super(props);
    this.getValueCSV = this.getValueCSV.bind(this);
  }
  getValueCSV() {
    const values = this.props.value;
    if (!Array.isArray(values) && (values || typeof values === 'string' || typeof values === 'number')) {
      const item = this.props.source.find(next => next.value === values);
      if (item) {
        return item.title;
      }
      return '';
    }
    if (!values || !values.length) {
      return '';
    }
    return values.map(value => {
      const item = this.props.source.find(next => next.value === value);
      return item && item.title;
    }).filter(value => `${value}`.length).join(', ');
  }
  getFieldProps() {
    return {
      id: this.props.id,
      name: this.props.name,
      className: `${this.props.className} ${this.props.extraClass}`
    };
  }
  render() {
    if (!this.props.source) {
      return null;
    }
    const none = `('${_i18n.default._t('Admin.NONE', 'None')}')`;
    const value = this.getValueCSV() || none;
    return _react.default.createElement(_reactstrap.Input, _extends({
      plaintext: true
    }, this.getFieldProps(), {
      tag: "p"
    }), value);
  }
}
exports.Component = LookupField;
LookupField.propTypes = {
  extraClass: _propTypes.default.string,
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  source: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    title: _propTypes.default.any,
    disabled: _propTypes.default.bool
  })),
  value: _propTypes.default.any
};
LookupField.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};
var _default = exports["default"] = (0, _FieldHolder.default)(LookupField);

/***/ }),

/***/ "./client/src/components/MobileMenuToggle/MobileMenuToggle.js":
/*!********************************************************************!*\
  !*** ./client/src/components/MobileMenuToggle/MobileMenuToggle.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class MobileMenuToggle extends _react.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  }
  render() {
    const classes = (0, _classnames.default)({
      'cms-mobile-menu-toggle': true,
      'cms-mobile-menu-toggle--open': this.props.isOpen
    });
    return _react.default.createElement("button", {
      type: "button",
      className: classes,
      href: "#toggle-mobile-menu",
      onClick: this.handleClick,
      "aria-controls": this.props.controls,
      "aria-expanded": Boolean(this.props.isOpen)
    }, _react.default.createElement("span", null), _react.default.createElement("span", null), _react.default.createElement("span", null), _react.default.createElement("span", null));
  }
}
MobileMenuToggle.propTypes = {
  isOpen: _propTypes.default.bool.isRequired,
  onClick: _propTypes.default.func.isRequired,
  controls: _propTypes.default.string
};
MobileMenuToggle.defaultProps = {
  controls: ''
};
var _default = exports["default"] = MobileMenuToggle;

/***/ }),

/***/ "./client/src/components/MobileMenuToggle/MobileMenuToggleContainer.js":
/*!*****************************************************************************!*\
  !*** ./client/src/components/MobileMenuToggle/MobileMenuToggleContainer.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _MobileMenuActions = __webpack_require__(/*! state/mobileMenu/MobileMenuActions */ "./client/src/state/mobileMenu/MobileMenuActions.js");
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _MobileMenuToggle = _interopRequireDefault(__webpack_require__(/*! ./MobileMenuToggle */ "./client/src/components/MobileMenuToggle/MobileMenuToggle.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports["default"] = (0, _reactRedux.connect)(state => ({
  isOpen: state.mobileMenu.isOpen
}), dispatch => ({
  onClick() {
    dispatch((0, _MobileMenuActions.toggleMobileMenu)());
  }
}))(_MobileMenuToggle.default);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Modal/Modal.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Modal/Modal.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function parseTitle(title) {
  if (typeof title === 'object') {
    const doc = new DOMParser().parseFromString(title.html, 'text/html');
    return doc.body.textContent || '';
  }
  return title;
}
const Modal = _ref => {
  let {
    children,
    className,
    isOpen,
    modalClassName,
    ModalComponent,
    ModalHeaderComponent,
    onClosed,
    showCloseButton,
    size,
    title
  } = _ref;
  return _react.default.createElement(ModalComponent, {
    isOpen: isOpen,
    toggle: onClosed,
    className: className,
    modalClassName: modalClassName,
    size: size
  }, title !== false && _react.default.createElement(ModalHeaderComponent, {
    toggle: onClosed,
    title: title
  }, parseTitle(title)), title === false && showCloseButton === true && typeof onClosed === 'function' && _react.default.createElement("button", {
    type: "button",
    className: "close modal__close-button",
    onClick: onClosed,
    "aria-label": _i18n.default._t('Admin.CLOSE', 'Close')
  }), children);
};
Modal.propTypes = {
  className: _propTypes.default.string,
  isOpen: _propTypes.default.bool,
  modalClassName: _propTypes.default.string,
  ModalComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  ModalHeaderComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  onClosed: _propTypes.default.func,
  size: _propTypes.default.oneOf(['', 'sm', 'lg', 'xl']),
  showCloseButton: _propTypes.default.bool,
  title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool, _propTypes.default.shape({
    html: _propTypes.default.string
  })])
};
Modal.defaultProps = {
  isOpen: false,
  ModalComponent: _reactstrap.Modal,
  ModalHeaderComponent: _reactstrap.ModalHeader,
  title: null
};
var _default = exports["default"] = Modal;

/***/ }),

/***/ "./client/src/components/NavigationBlocker/NavigationBlocker.js":
/*!**********************************************************************!*\
  !*** ./client/src/components/NavigationBlocker/NavigationBlocker.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = NavigationBlocker;
var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function NavigationBlocker(_ref) {
  let {
    shouldBlockFn,
    blockMessage
  } = _ref;
  const blocker = (0, _reactRouterDom.useBlocker)(shouldBlockFn);
  (0, _react.useEffect)(() => {
    if (blocker.state === 'blocked') {
      const canUnload = confirm(blockMessage);
      if (canUnload) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker.state]);
  return null;
}
NavigationBlocker.propTypes = {
  shouldBlockFn: _propTypes.default.func.isRequired,
  blockMessage: _propTypes.default.string.isRequired
};

/***/ }),

/***/ "./client/src/components/NotFoundComponent/NotFoundComponent.js":
/*!**********************************************************************!*\
  !*** ./client/src/components/NotFoundComponent/NotFoundComponent.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _FormAlert = _interopRequireDefault(__webpack_require__(/*! components/FormAlert/FormAlert */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAlert/FormAlert.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NotFoundComponent = _ref => {
  let {
    itemName,
    name,
    value
  } = _ref;
  return _react.default.createElement("div", {
    className: (0, _classnames.default)(itemName, 'not-found-component')
  }, _react.default.createElement(_FormAlert.default, {
    value: _i18n.default.inject(_i18n.default._t('Admin.NOT_FOUND_COMPONENT', 'The component here ({component}) failed to load, there is a chance that you may lose data when saving due to this.'), {
      component: itemName
    })
  }), name && typeof value === 'string' ? _react.default.createElement("input", {
    type: "hidden",
    name: name,
    value: value
  }) : null);
};
NotFoundComponent.propTypes = {
  itemName: _propTypes.default.string.isRequired,
  name: _propTypes.default.string,
  value: _propTypes.default.any
};
var _default = exports["default"] = NotFoundComponent;

/***/ }),

/***/ "./client/src/components/NumberField/NumberField.js":
/*!**********************************************************!*\
  !*** ./client/src/components/NumberField/NumberField.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _InputField = _interopRequireDefault(__webpack_require__(/*! ../InputField/InputField */ "./client/src/components/InputField/InputField.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class NumberField extends _InputField.default {
  getInputProps() {
    const props = super.getInputProps();
    Object.assign(props, {
      type: 'number'
    });
    return props;
  }
}
exports.Component = NumberField;
var _default = exports["default"] = (0, _FieldHolder.default)(NumberField);

/***/ }),

/***/ "./client/src/components/OptionsetField/OptionField.js":
/*!*************************************************************!*\
  !*** ./client/src/components/OptionsetField/OptionField.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _castStringToElement = _interopRequireDefault(__webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class OptionField extends _react.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  getInputProps() {
    const classes = (0, _classnames.default)({
      [this.props.className]: true,
      [this.props.extraClass]: true,
      'form-check': true,
      checked: this.props.value,
      disabled: this.props.readOnly,
      'option-field--disabled': this.props.readOnly || this.props.disabled
    });
    return {
      id: this.props.id,
      type: this.props.type,
      name: this.props.name,
      disabled: this.props.disabled || this.props.readOnly,
      readOnly: this.props.readOnly,
      className: classes,
      onChange: this.handleChange,
      checked: !!this.props.value,
      value: 1
    };
  }
  handleChange(event) {
    if (this.props.readOnly || this.props.disabled) {
      event.preventDefault();
      return;
    }
    let callback = null;
    if (typeof this.props.onChange === 'function') {
      callback = this.props.onChange;
    } else if (typeof this.props.onClick === 'function') {
      callback = this.props.onClick;
    }
    if (callback) {
      callback(event, {
        id: this.props.id,
        value: event.target.checked ? 1 : 0
      });
    }
  }
  render() {
    const leftTitle = this.props.leftTitle !== null ? this.props.leftTitle : this.props.title;
    const labelText = this.props.rightTitle !== null ? `${leftTitle} ${this.props.rightTitle}` : leftTitle;
    return _react.default.createElement(_reactstrap.FormGroup, {
      check: true
    }, _react.default.createElement(_reactstrap.Label, {
      check: true
    }, _react.default.createElement(_reactstrap.Input, this.getInputProps()), (0, _castStringToElement.default)('span', labelText)));
  }
}
exports.Component = OptionField;
OptionField.propTypes = {
  type: _propTypes.default.oneOf(['checkbox', 'radio']),
  leftTitle: _propTypes.default.any,
  rightTitle: _propTypes.default.any,
  title: _propTypes.default.any,
  extraClass: _propTypes.default.string,
  id: _propTypes.default.string,
  name: _propTypes.default.string,
  onChange: _propTypes.default.func,
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]),
  readOnly: _propTypes.default.bool,
  disabled: _propTypes.default.bool
};
OptionField.defaultProps = {
  extraClass: '',
  className: '',
  type: 'radio',
  leftTitle: null,
  rightTitle: null
};
var _default = exports["default"] = OptionField;

/***/ }),

/***/ "./client/src/components/OptionsetField/OptionsetField.js":
/*!****************************************************************!*\
  !*** ./client/src/components/OptionsetField/OptionsetField.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _OptionField = _interopRequireDefault(__webpack_require__(/*! components/OptionsetField/OptionField */ "./client/src/components/OptionsetField/OptionField.js"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class OptionsetField extends _react.Component {
  constructor(props) {
    super(props);
    this.getItemKey = this.getItemKey.bind(this);
    this.getOptionProps = this.getOptionProps.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getItemKey(item, index) {
    const value = item.value || `empty${index}`;
    return `${this.props.id}-${value}`;
  }
  getOptionProps(item, index) {
    const key = this.getItemKey(item, index);
    return {
      key,
      id: key,
      name: this.props.name,
      className: `${this.props.itemClass} option-val--${item.value}`,
      disabled: item.disabled || this.props.disabled,
      readOnly: this.props.readOnly,
      onChange: this.handleChange,
      value: `${this.props.value}` === `${item.value}`,
      title: item.title,
      type: 'radio'
    };
  }
  handleChange(event, field) {
    if (typeof this.props.onChange === 'function') {
      if (field.value === 1) {
        const sourceItem = this.props.source.find((item, index) => this.getItemKey(item, index) === field.id);
        this.props.onChange(event, {
          id: this.props.id,
          value: sourceItem.value
        });
      }
    }
  }
  render() {
    if (!this.props.source) {
      return null;
    }
    return _react.default.createElement("div", null, this.props.source.map((item, index) => _react.default.createElement(_OptionField.default, _extends({}, this.getOptionProps(item, index), {
      hideLabels: true
    }))));
  }
}
exports.Component = OptionsetField;
OptionsetField.propTypes = {
  extraClass: _propTypes.default.string,
  itemClass: _propTypes.default.string,
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  source: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    disabled: _propTypes.default.bool
  })),
  onChange: _propTypes.default.func,
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  readOnly: _propTypes.default.bool,
  disabled: _propTypes.default.bool
};
OptionsetField.defaultProps = {
  extraClass: '',
  className: '',
  itemClass: ''
};
var _default = exports["default"] = (0, _FieldHolder.default)(OptionsetField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/PopoverField/PopoverField.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/PopoverField/PopoverField.js ***!
  \**************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class PopoverField extends _react.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  getPlacement() {
    const placement = this.props.data.placement;
    return placement || 'bottom';
  }
  getContainer() {
    if (this.props.container) {
      return this.props.container;
    }
    return this.wrapper;
  }
  toggle() {
    const {
      toggleCallback
    } = this.props;
    window.setTimeout(() => this.setState({
      isOpen: !this.state.isOpen
    }, toggleCallback), 0);
  }
  render() {
    const placement = this.getPlacement();
    const buttonClasses = (0, _classnames.default)({
      btn: true,
      'btn-secondary': true,
      [this.props.className]: true,
      [this.props.buttonClassName]: true,
      'btn--no-focus': this.state.isOpen,
      'font-icon-dot-3 btn--no-text': !this.props.title,
      [`btn--icon-${this.props.buttonSize}`]: !this.props.title
    });
    const buttonProps = {
      id: this.props.id,
      type: 'button',
      className: buttonClasses,
      onClick: this.toggle,
      title: this.props.data.buttonTooltip
    };
    const wrapperClasses = (0, _classnames.default)({
      [this.props.className]: true,
      'popover-container': true,
      'popover-field': true
    });
    return _react.default.createElement("div", {
      className: wrapperClasses,
      ref: wrapper => {
        this.wrapper = wrapper;
      }
    }, _react.default.createElement(_reactstrap.Button, buttonProps, this.props.title), _react.default.createElement(_reactstrap.Popover, {
      id: `${this.props.id}_Popover`,
      placement: placement,
      isOpen: this.state.isOpen,
      target: this.props.id,
      toggle: this.toggle,
      className: this.props.popoverClassName,
      container: this.getContainer()
    }, _react.default.createElement(_reactstrap.PopoverHeader, null, this.props.data.popoverTitle), _react.default.createElement(_reactstrap.PopoverBody, null, this.props.children)));
  }
}
PopoverField.propTypes = {
  id: _propTypes.default.string.isRequired,
  title: _propTypes.default.any,
  container: _propTypes.default.any,
  className: _propTypes.default.string,
  buttonClassName: _propTypes.default.string,
  popoverClassName: _propTypes.default.string,
  buttonSize: _propTypes.default.oneOf(['sm', 'md', 'large', 'xl']),
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
    popoverTitle: _propTypes.default.string,
    buttonTooltip: _propTypes.default.string,
    placement: _propTypes.default.oneOf(['top', 'bottom', 'left', 'right'])
  })]),
  toggleCallback: _propTypes.default.func
};
PopoverField.defaultProps = {
  data: {},
  className: '',
  buttonClassName: '',
  popoverClassName: '',
  buttonSize: 'xl',
  toggleCallback: () => {}
};
var _default = exports["default"] = PopoverField;

/***/ }),

/***/ "./client/src/components/PopoverOptionSet/PopoverOptionSet.js":
/*!********************************************************************!*\
  !*** ./client/src/components/PopoverOptionSet/PopoverOptionSet.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class PopoverOptionSet extends _react.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearchValueClear = this.handleSearchValueClear.bind(this);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.doToggle = this.doToggle.bind(this);
    this.focusOnTarget = this.focusOnTarget.bind(this);
    this.state = {
      searchValue: ''
    };
  }
  handleToggle() {
    this.doToggle(false);
  }
  doToggle(focusOnTarget) {
    const {
      toggle
    } = this.props;
    toggle();
    this.handleSearchValueClear();
    if (focusOnTarget) {
      this.focusOnTarget();
    }
  }
  focusOnTarget() {
    const {
      target
    } = this.props;
    if (target) {
      const el = _reactstrap.Util.getTarget(target);
      if (el) {
        el.focus();
      }
    }
  }
  handleSearchValueClear() {
    this.setState({
      searchValue: ''
    });
  }
  handleSearchValueChange(event) {
    this.setState({
      searchValue: event.target.value
    });
  }
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.doToggle(true);
    }
  }
  renderSearchValueClearLink() {
    const {
      clearButtonClassName
    } = this.props;
    const {
      searchValue
    } = this.state;
    if (searchValue.length === 0) {
      return null;
    }
    return _react.default.createElement(_reactstrap.InputGroupAddon, {
      addonType: "append"
    }, _react.default.createElement("button", {
      className: (0, _classnames.default)(clearButtonClassName),
      onClick: this.handleSearchValueClear
    }, _i18n.default._t('PopoverOptionSet.CLEAR', 'Clear')));
  }
  renderSearchBox() {
    const {
      searchPlaceholder,
      disableSearch,
      searchClassName,
      searchInputClassName
    } = this.props;
    const {
      searchValue
    } = this.state;
    if (disableSearch) {
      return null;
    }
    return _react.default.createElement(_reactstrap.InputGroup, {
      className: (0, _classnames.default)(searchClassName)
    }, _react.default.createElement(_reactstrap.Input, {
      autoFocus: true,
      className: (0, _classnames.default)(searchInputClassName),
      onChange: this.handleSearchValueChange,
      placeholder: searchPlaceholder,
      type: "text",
      value: searchValue
    }), this.renderSearchValueClearLink());
  }
  renderOptionButtons() {
    const {
      buttons,
      onSearch,
      buttonContainerClassName,
      emptyResultClassName,
      buttonClassName,
      ButtonComponent
    } = this.props;
    const {
      searchValue
    } = this.state;
    let buttonsToRender = buttons;
    if (searchValue.length !== 0) {
      buttonsToRender = onSearch(searchValue, buttonsToRender);
    }
    if (buttonsToRender.length === 0) {
      return _react.default.createElement("div", {
        className: (0, _classnames.default)(buttonContainerClassName)
      }, _react.default.createElement("div", {
        className: (0, _classnames.default)(emptyResultClassName)
      }, _i18n.default._t('PopoverOptionSet.NO_RESULTS', 'No results found')));
    }
    return _react.default.createElement("div", {
      className: (0, _classnames.default)(buttonContainerClassName)
    }, buttonsToRender.map(button => _react.default.createElement(ButtonComponent, _extends({}, button.buttonProps, {
      className: (0, _classnames.default)(button.className, buttonClassName),
      key: button.key,
      onClick: button.onClick
    }), button.content)));
  }
  render() {
    const {
      container,
      className,
      isOpen,
      placement,
      target,
      PopoverComponent
    } = this.props;
    return _react.default.createElement(PopoverComponent, {
      className: (0, _classnames.default)(className),
      container: container,
      hideArrow: true,
      isOpen: isOpen,
      onKeyDown: this.handleKeyDown,
      placement: placement,
      target: target,
      toggle: this.handleToggle,
      trigger: "legacy"
    }, this.renderSearchBox(), this.renderOptionButtons());
  }
}
PopoverOptionSet.propTypes = {
  buttons: _propTypes.default.arrayOf(_propTypes.default.shape({
    key: _propTypes.default.string.isRequired,
    content: _propTypes.default.node.isRequired,
    onClick: _propTypes.default.func.isRequired,
    className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object, _propTypes.default.arrayOf(_propTypes.default.string)]),
    buttonProps: _propTypes.default.object
  })).isRequired,
  onSearch: _propTypes.default.func,
  container: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.elementType]),
  isOpen: _propTypes.default.bool.isRequired,
  placement: _propTypes.default.string,
  target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.elementType]).isRequired,
  toggle: _propTypes.default.func.isRequired,
  searchPlaceholder: _propTypes.default.string,
  disableSearch: _propTypes.default.bool,
  ButtonComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  PopoverComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object]),
  searchClassName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object]),
  searchInputClassName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object]),
  clearButtonClassName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object]),
  buttonContainerClassName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object]),
  emptyResultClassName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object]),
  buttonClassName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array, _propTypes.default.object])
};
PopoverOptionSet.defaultProps = {
  searchPlaceholder: _i18n.default._t('PopoverOptionSet.SEARCH_PLACEHOLDER', 'Search'),
  onSearch: (query, buttons) => buttons.filter(_ref => {
    let {
      content
    } = _ref;
    return content.toLowerCase().includes(query.toLowerCase());
  }),
  disableSearch: false,
  ButtonComponent: _reactstrap.Button,
  PopoverComponent: _reactstrap.Popover,
  className: 'popover-option-set',
  searchClassName: 'popover-option-set__search',
  searchInputClassName: 'popover-option-set__search-input',
  clearButtonClassName: 'popover-option-set__search-clear btn btn-link',
  buttonContainerClassName: 'popover-option-set__button-container',
  emptyResultClassName: 'popover-option-set__no-results',
  buttonClassName: 'popover-option-set__button'
};
var _default = exports["default"] = PopoverOptionSet;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Preview/Preview.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Preview/Preview.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _ActionMenu = _interopRequireDefault(__webpack_require__(/*! ../ActionMenu/ActionMenu */ "./client/src/components/ActionMenu/ActionMenu.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class Preview extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameLoaded: false
    };
    this.handleBackClick = this.handleBackClick.bind(this);
    this.setFrameLoaded = this.setFrameLoaded.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!this.state.frameLoaded) {
      return;
    }
    if (prevProps.previewUrl !== this.props.previewUrl) {
      this.setFrameLoaded(false);
    }
  }
  setFrameLoaded() {
    let loaded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.setState({
      frameLoaded: loaded
    });
  }
  handleBackClick(event) {
    if (typeof this.props.onBack === 'function') {
      event.preventDefault();
      this.props.onBack(event);
    }
  }
  buildToolbarButtons() {
    const toolbarButtons = [];
    if (this.props.itemLinks && this.props.itemLinks.edit) {
      const editUrl = this.props.itemLinks.edit.href;
      toolbarButtons.push(_react.default.createElement("a", {
        key: "edit",
        href: editUrl,
        className: "btn btn-outline-secondary font-icon-edit"
      }, _react.default.createElement("span", {
        className: "btn__title"
      }, _i18n.default._t('Admin.EDIT', 'Edit'))));
    }
    return toolbarButtons;
  }
  renderMoreActions() {
    if (!this.props.moreActions || this.props.moreActions.length === 0) {
      return null;
    }
    return _react.default.createElement(_ActionMenu.default, null, this.props.moreActions);
  }
  renderBody() {
    let previewUrl = null;
    let previewType = '';
    if (this.props.itemLinks && this.props.itemLinks.preview) {
      if (this.props.itemLinks.preview.Stage) {
        previewUrl = this.props.itemLinks.preview.Stage.href;
        previewType = this.props.itemLinks.preview.Stage.type;
      } else if (this.props.itemLinks.preview.Live) {
        previewUrl = this.props.itemLinks.preview.Live.href;
        previewType = this.props.itemLinks.preview.Live.type;
      }
    }
    if (!this.props.itemId) {
      return _react.default.createElement("div", {
        className: "preview__overlay"
      }, _react.default.createElement("h3", {
        className: "preview__overlay-text"
      }, _i18n.default._t('Admin.NO_PREVIEW', 'No preview available.')));
    }
    if (!previewUrl) {
      return _react.default.createElement("div", {
        className: "preview__overlay"
      }, _react.default.createElement("h3", {
        className: "preview__overlay-text"
      }, _i18n.default._t('Admin.NO_ITEM_PREVIEW', 'There is no preview available for this item.')));
    }
    if (previewType && previewType.indexOf('image/') === 0) {
      return _react.default.createElement("div", {
        className: "preview__file-container panel--scrollable"
      }, _react.default.createElement("img", {
        alt: previewUrl,
        className: "preview__file--fits-space",
        src: previewUrl
      }));
    }
    return _react.default.createElement("iframe", {
      style: {
        visibility: this.state.frameLoaded ? 'visible' : 'hidden'
      },
      className: "flexbox-area-grow preview__iframe",
      src: previewUrl,
      onLoad: this.setFrameLoaded
    });
  }
  render() {
    const {
      className,
      ViewModeComponent
    } = this.props;
    const classNames = (0, _classnames.default)('preview', className);
    return _react.default.createElement("div", {
      className: classNames
    }, this.renderBody(), _react.default.createElement("div", {
      className: "toolbar toolbar--south"
    }, _react.default.createElement("div", {
      className: "btn-toolbar"
    }, this.buildToolbarButtons(), _react.default.createElement(ViewModeComponent, {
      id: "view-mode-toggle-in-preview-nb",
      area: "preview"
    }), this.renderMoreActions())));
  }
}
exports.Component = Preview;
Preview.propTypes = {
  className: _propTypes.default.string,
  itemLinks: _propTypes.default.object,
  itemId: _propTypes.default.number,
  onBack: _propTypes.default.func,
  moreActions: _propTypes.default.arrayOf(_propTypes.default.element),
  ViewModeComponent: _propTypes.default.elementType
};
Preview.defaultProps = {
  className: 'flexbox-area-grow fill-height'
};
var _default = exports["default"] = (0, _Injector.inject)(['ViewModeToggle'], ViewModeToggle => ({
  ViewModeComponent: ViewModeToggle
}), () => 'Admin.Preview')(Preview);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ResizeAware/ResizeAware.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ResizeAware/ResizeAware.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var _resizeObserverPolyfill = _interopRequireDefault(__webpack_require__(/*! resize-observer-polyfill */ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ResizeAware extends _react.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.state = {};
    this.observer = new _resizeObserverPolyfill.default(entries => entries.forEach(_ref => {
      let {
        contentRect
      } = _ref;
      return this.handleResize(contentRect);
    }));
  }
  componentDidMount() {
    this.observer.observe(this.container);
    const sizes = {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight
    };
    this.handleResize(sizes);
  }
  componentWillUnmount() {
    this.observer.disconnect();
  }
  handleResize(sizes) {
    const {
      width,
      height
    } = this.state;
    if (width !== sizes.width || height !== sizes.height) {
      this.setState(sizes);
    }
    if (this.props.onResize) {
      this.props.onResize(sizes);
    }
  }
  render() {
    const {
      children,
      onlyEvent,
      component,
      onResize,
      widthPropName,
      heightPropName,
      ...props
    } = this.props;
    const {
      width,
      height
    } = this.state;
    const hasCustomComponent = typeof component !== 'string';
    const widthProp = [widthPropName || 'width'];
    const heightProp = [heightPropName || 'height'];
    const sizes = {
      [widthProp]: width,
      [heightProp]: height
    };
    return (0, _react.createElement)(component, {
      [hasCustomComponent ? 'getRef' : 'ref']: el => {
        this.container = el;
      },
      ...(hasCustomComponent && sizes),
      ...props
    }, typeof children === 'function' ? children({
      width,
      height
    }) : _react.Children.map(children, child => (0, _react.isValidElement)(child) ? (0, _react.cloneElement)(child, !onlyEvent ? sizes : null) : child));
  }
}
ResizeAware.propTypes = {
  component: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.elementType]),
  onResize: _propTypes.default.func
};
ResizeAware.defaultProps = {
  component: 'div'
};
var _default = exports["default"] = ResizeAware;

/***/ }),

/***/ "./client/src/components/Search/Search.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Search/Search.js ***!
  \**************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
exports.hasFilters = hasFilters;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var schemaActions = _interopRequireWildcard(__webpack_require__(/*! state/schema/SchemaActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _immutable = __webpack_require__(/*! redux-form/lib/immutable */ "./node_modules/redux-form/lib/immutable.js");
var _getIn = _interopRequireDefault(__webpack_require__(/*! redux-form/lib/structure/plain/getIn */ "./node_modules/redux-form/lib/structure/plain/getIn.js"));
var _getFormState = _interopRequireDefault(__webpack_require__(/*! lib/getFormState */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Focusedzone = _interopRequireDefault(__webpack_require__(/*! ../Focusedzone/Focusedzone */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Focusedzone/Focusedzone.js"));
var _SearchBox = _interopRequireDefault(__webpack_require__(/*! ./SearchBox */ "./client/src/components/Search/SearchBox.js"));
var _SearchForm = _interopRequireDefault(__webpack_require__(/*! ./SearchForm */ "./client/src/components/Search/SearchForm.js"));
var _SearchToggle = _interopRequireDefault(__webpack_require__(/*! ./SearchToggle */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Search/SearchToggle.js"));
var _mapFormSchemaToTags = _interopRequireDefault(__webpack_require__(/*! ./utilities/mapFormSchemaToTags */ "./client/src/components/Search/utilities/mapFormSchemaToTags.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DISPLAY = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED'
};
const BEHAVIOR = {
  NONE: 'NONE',
  HIDEABLE: 'HIDEABLE',
  TOGGLABLE: 'TOGGLABLE'
};
function hasFilters(filters) {
  return filters && Object.keys(filters).length > 0;
}
class Search extends _react.Component {
  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.focusFirstFormField = this.focusFirstFormField.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.searchTermIsDirty = this.searchTermIsDirty.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);
    this.clearFormFilter = this.clearFormFilter.bind(this);
    this.focusFormFilter = this.focusFormFilter.bind(this);
    this.formatTagData = this.formatTagData.bind(this);
    const term = props.term || props.filters && props.filters[`${props.filterPrefix}${props.name}`] || '';
    this.state = {
      display: props.display,
      searchText: term,
      initialSearchText: term
    };
  }
  componentDidMount() {
    this.setOverrides(this.props);
  }
  componentWillUnmount() {
    this.setOverrides();
  }
  setOverrides(props) {
    if (props && (!hasFilters(props.filters) || this.props.formSchemaUrl !== props.formSchemaUrl)) {
      const schemaUrl = props && props.formSchemaUrl || this.props.formSchemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }
    if (props && hasFilters(props.filters) && props.formSchemaUrl) {
      const filters = props.filters || {};
      const overrides = {
        fields: Object.keys(filters).map(name => {
          const value = filters[name];
          return {
            name,
            value
          };
        })
      };
      this.props.actions.schema.setSchemaStateOverrides(props.formSchemaUrl, overrides);
    }
  }
  getData() {
    let ignoreSearchTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const {
      name,
      filterPrefix,
      formData
    } = this.props;
    const {
      searchText
    } = this.state;
    const data = {};
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value) {
        data[key] = value;
      }
    });
    if (!ignoreSearchTerm && searchText && typeof formData[`${filterPrefix}${name}`] === 'undefined') {
      data[`${filterPrefix}${name}`] = searchText.trim();
    }
    return data;
  }
  handleChange(event) {
    const value = event.target.value;
    if (this.state.searchText !== value) {
      this.setState({
        searchText: value
      });
    }
    const {
      schemaName,
      name,
      filterPrefix,
      actions,
      formData
    } = this.props;
    if (typeof formData[`${filterPrefix}${name}`] !== 'undefined') {
      actions.reduxForm.change(schemaName, `${filterPrefix}${name}`, value);
    }
  }
  focusInput() {
    if (this.state.display === DISPLAY.NONE) {
      return;
    }
    const node = this.nodeRef.container;
    if (!node) {
      return;
    }
    const input = node.querySelector('.search-box__content-field');
    if (input !== document.activeElement) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }
  focusFirstFormField() {
    let filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input:not([type=hidden]), textarea, select, button';
    if (this.state.display !== DISPLAY.EXPANDED) {
      return;
    }
    const node = this.nodeRef.container;
    if (!node) {
      return;
    }
    const form = node.querySelector('.search-form');
    if (!form) {
      return;
    }
    const input = form.querySelector(filter);
    if (input) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }
  clearFormData(props) {
    if (this.state.searchText !== '') {
      this.setState({
        searchText: ''
      });
    }
    const formSchemaUrl = props && props.formSchemaUrl || this.props.formSchemaUrl;
    if (formSchemaUrl) {
      const identifier = props && props.identifier || this.props.identifier;
      this.props.actions.schema.setSchemaStateOverrides(formSchemaUrl, {
        fields: []
      });
      this.props.actions.reduxForm.reset(identifier);
    }
  }
  clearFormFilter(key) {
    const tag = this.props.tagData[key];
    const clearables = {
      [key]: undefined
    };
    const {
      schemaName,
      filters
    } = this.props;
    this.props.actions.reduxForm.change(schemaName, key, '');
    this.setOverrides({
      ...this.props,
      filters: {
        ...filters,
        [key]: undefined
      }
    });
    if (Array.isArray(tag.linkedFields)) {
      tag.linkedFields.forEach(linkFieldkey => {
        clearables[linkFieldkey] = undefined;
      });
    }
    this.doSearch(clearables);
  }
  focusFormFilter(key) {
    const tag = this.props.tagData[key];
    const selector = tag.focusSelector || `[name=${key}]`;
    this.expand();
    setTimeout(() => this.focusFirstFormField(selector), 50);
  }
  open() {
    this.show();
    this.focusInput();
  }
  hide() {
    this.clearSearchBox();
    if (this.props.onHide) {
      this.props.onHide();
    } else if (this.state.display !== DISPLAY.NONE) {
      this.setState({
        display: DISPLAY.NONE
      });
    }
  }
  show() {
    if (this.state.display !== DISPLAY.VISIBLE) {
      this.setState({
        display: DISPLAY.VISIBLE
      });
    }
    const {
      schemaName,
      formData,
      name,
      actions
    } = this.props;
    if (typeof formData[name] !== 'undefined') {
      actions.reduxForm.change(schemaName, name, this.state.searchText);
    }
  }
  expand() {
    if (this.state.display !== DISPLAY.EXPANDED) {
      this.setState({
        display: DISPLAY.EXPANDED
      });
    }
  }
  toggle() {
    switch (this.state.display) {
      case DISPLAY.VISIBLE:
        this.expand();
        setTimeout(this.focusFirstFormField, 50);
        break;
      case DISPLAY.EXPANDED:
        this.show();
        break;
      default:
    }
  }
  searchTermIsDirty() {
    const {
      searchText,
      initialSearchText
    } = this.state;
    return searchText.trim() !== initialSearchText.trim();
  }
  doSearch() {
    let overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      name,
      filterPrefix
    } = this.props;
    const searchData = {};
    const fieldData = this.getData();
    Object.entries(fieldData).forEach(_ref => {
      let [key, value] = _ref;
      let newKey = key;
      let newValue = value;
      if (overrides.hasOwnProperty(key)) {
        newValue = overrides[key];
      }
      if (filterPrefix.length > 0 && key.startsWith(filterPrefix)) {
        newKey = key.substring(filterPrefix.length);
      }
      if (!filterPrefix.length > 0 || key !== name || typeof fieldData[`${filterPrefix}${name}`] === 'undefined') {
        searchData[newKey] = newValue;
      }
    });
    const searchText = searchData[name] || '';
    if (this.state.display !== DISPLAY.VISIBLE || this.state.initialSearchText !== searchText || this.state.searchText !== searchText) {
      this.setState({
        display: DISPLAY.VISIBLE,
        initialSearchText: searchText,
        searchText
      });
    }
    this.props.onSearch(searchData);
  }
  clearFilters() {
    this.clearFormData();
    this.focusFirstFormField();
  }
  clearSearchBox() {
    this.clearFormData();
    this.focusInput();
  }
  formatTagData() {
    const {
      tagData,
      name,
      filterPrefix
    } = this.props;
    const tagDataCopy = Object.assign({}, tagData);
    const nameKey = `${filterPrefix}${name}`;
    if (tagDataCopy && tagDataCopy[nameKey]) {
      delete tagDataCopy[nameKey];
    }
    return tagDataCopy ? Object.values(tagDataCopy).map(_ref2 => {
      let {
        key,
        label,
        value
      } = _ref2;
      return {
        key,
        label,
        value
      };
    }) : [];
  }
  render() {
    const {
      formSchemaUrl,
      forceFilters,
      id,
      displayBehavior,
      identifier,
      formIsDirty,
      tagData,
      name,
      ...props
    } = this.props;
    if (this.state.display === DISPLAY.NONE) {
      if (displayBehavior === BEHAVIOR.TOGGLABLE) {
        return _react.default.createElement(_SearchToggle.default, {
          onToggle: this.show
        });
      }
      return _react.default.createElement("div", null);
    }
    const formId = `${id}_ExtraFields`;
    const searchText = this.state.searchText;
    const expanded = this.state.display === DISPLAY.EXPANDED;
    const visible = this.state.display === DISPLAY.VISIBLE;
    const hideable = [BEHAVIOR.HIDEABLE, BEHAVIOR.TOGGLABLE].includes(displayBehavior);
    const dirty = formIsDirty || this.searchTermIsDirty();
    const data = this.getData();
    const clearable = Object.keys(data).length > 0;
    return _react.default.createElement(_Focusedzone.default, {
      onClickOut: this.show,
      className: "search",
      ref: node => {
        this.nodeRef = node;
      }
    }, _react.default.createElement(_SearchBox.default, _extends({}, props, {
      name: `SearchBox__${name}`,
      onChange: this.handleChange,
      onSearch: this.doSearch,
      onToggleFilter: this.toggle,
      onHideFilter: this.show,
      onHide: this.hide,
      onClear: this.clearSearchBox,
      searchText: searchText,
      hideable: hideable,
      expanded: expanded,
      id: `${id}_searchbox`,
      showFilters: Boolean(forceFilters || formSchemaUrl),
      dirty: dirty,
      clearable: clearable,
      onTagDelete: this.clearFormFilter,
      onTagClick: this.focusFormFilter,
      tagData: this.formatTagData()
    }), _react.default.createElement(_SearchForm.default, {
      id: formId,
      identifier: identifier,
      visible: visible,
      expanded: expanded,
      formSchemaUrl: formSchemaUrl,
      onSearch: this.doSearch,
      onClear: this.clearFilters,
      clearable: clearable
    })));
  }
}
exports.Component = Search;
Search.propTypes = {
  onSearch: _propTypes.default.func,
  onHide: _propTypes.default.func,
  id: _propTypes.default.string.isRequired,
  display: _propTypes.default.oneOf(Object.values(DISPLAY)),
  formSchemaUrl: _propTypes.default.string,
  filters: _propTypes.default.object,
  formData: _propTypes.default.object,
  placeholder: _propTypes.default.string,
  displayBehavior: _propTypes.default.oneOf(Object.values(BEHAVIOR)),
  term: _propTypes.default.string,
  name: _propTypes.default.string,
  filterPrefix: _propTypes.default.string,
  forceFilters: _propTypes.default.bool,
  formIsDirty: _propTypes.default.bool,
  identifier: _propTypes.default.string,
  schemaName: _propTypes.default.string,
  tagHandlers: _propTypes.default.object,
  borders: _propTypes.default.shape({
    top: _propTypes.default.bool,
    right: _propTypes.default.bool,
    bottom: _propTypes.default.bool,
    left: _propTypes.default.bool
  })
};
Search.defaultProps = {
  placeholder: _i18n.default._t('Admin.SEARCH', 'Search'),
  display: DISPLAY.VISIBLE,
  displayBehavior: BEHAVIOR.NONE,
  filters: {},
  formData: {},
  term: '',
  filterPrefix: '',
  forceFilters: false,
  name: 'searchTerm',
  identifier: 'Admin.SearchForm'
};
function mapStateToProps(state, ownProps) {
  const schema = state.form.formSchemas[ownProps.formSchemaUrl];
  if (!schema || !schema.name) {
    return {
      formData: {}
    };
  }
  const schemaName = schema.name;
  const form = (0, _getIn.default)((0, _getFormState.default)(state), schemaName);
  const formData = form && form.values || {};
  const tagData = (0, _mapFormSchemaToTags.default)(schema, ownProps.filters, ownProps.tagHandlers || {});
  const formIsDirty = (0, _immutable.isDirty)(schemaName, _getFormState.default)(state);
  return {
    formData,
    formIsDirty,
    schemaName,
    tagData
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({
        reset: _reduxForm.reset,
        initialize: _reduxForm.initialize,
        change: _reduxForm.change
      }, dispatch)
    }
  };
}
var _default = exports["default"] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Search);

/***/ }),

/***/ "./client/src/components/Search/SearchBox.js":
/*!***************************************************!*\
  !*** ./client/src/components/Search/SearchBox.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _CompactTagList = _interopRequireDefault(__webpack_require__(/*! components/Tag/CompactTagList */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/CompactTagList.js"));
var _ResizeAware = _interopRequireDefault(__webpack_require__(/*! components/ResizeAware/ResizeAware */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ResizeAware/ResizeAware.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _TagPropType = _interopRequireDefault(__webpack_require__(/*! ../Tag/TagPropType */ "./client/src/components/Tag/TagPropType.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class SearchBox extends _react.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderFilterButton = this.renderFilterButton.bind(this);
    this.renderEnterHint = this.renderEnterHint.bind(this);
    this.renderHideButton = this.renderHideButton.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.getComponentWidth = this.getComponentWidth.bind(this);
    this.calculateSpaceForTags = this.calculateSpaceForTags.bind(this);
    this.calculateInputLeftPadding = this.calculateInputLeftPadding.bind(this);
    this.calculateInputRightPadding = this.calculateInputRightPadding.bind(this);
    this.onTagListResize = this.onTagListResize.bind(this);
    this.focusOnLastTag = this.focusOnLastTag.bind(this);
    this.focusOnInput = this.focusOnInput.bind(this);
    this.state = {
      hasFocus: false,
      width: window.innerWidth - 180 - 55,
      tagWidth: 0
    };
  }
  componentDidUpdate() {
    const width = this.getComponentWidth();
    this.setWidth(width);
  }
  onResize(dimension) {
    this.setWidth(dimension.width);
  }
  onTagListResize(dimensions) {
    const tagWidth = dimensions.width;
    if (this.state.tagWidth !== tagWidth) {
      this.setState({
        tagWidth
      });
    }
  }
  setWidth(width) {
    if (this.state.width !== width) {
      this.setState({
        width
      });
    }
  }
  getComponentWidth() {
    const node = this.nodeRef;
    if (!node) {
      return 0;
    }
    return node.getBoundingClientRect().width;
  }
  calculateInputLeftPadding() {
    const existingPadding = this.state.width > 576 ? 55 : 20;
    return this.state.tagWidth + existingPadding;
  }
  calculateInputRightPadding() {
    return this.state.width < 576 ? 121 : 264;
  }
  calculateSpaceForTags() {
    let width = this.state.width;
    width -= 150;
    width = width - 55 - 52;
    const {
      hideable,
      showFilters
    } = this.props;
    if (hideable) {
      width -= 52;
    }
    if (showFilters) {
      width -= 52;
    }
    width = Math.max(width, 0);
    return width;
  }
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.props.onSearch();
    } else if (event.target.selectionStart === 0 && (event.key === 'ArrowLeft' || event.key === 'Backspace' && event.target.selectionEnd - event.target.selectionStart === 0)) {
      event.preventDefault();
      this.focusOnLastTag();
    }
  }
  handleFocus() {
    if (!this.state.hasFocus) {
      this.setState({
        hasFocus: true
      });
    }
    if (this.props.onHideFilter) {
      this.props.onHideFilter();
    }
  }
  handleBlur() {
    if (this.state.hasFocus) {
      this.setState({
        hasFocus: false
      });
    }
  }
  focusOnLastTag() {
    const node = this.nodeRef;
    if (!node) {
      return;
    }
    const lastTag = node.querySelector('.compact-tag-list__visible .tag:last-child');
    if (lastTag) {
      lastTag.focus();
    }
  }
  focusOnInput() {
    const node = this.nodeRef;
    if (!node) {
      return;
    }
    const input = node.querySelector('input');
    if (input) {
      input.focus();
    }
  }
  renderInput() {
    const {
      id,
      searchText,
      onChange,
      placeholder,
      name,
      borders
    } = this.props;
    const style = {
      paddingLeft: `${this.calculateInputLeftPadding()}px`,
      paddingRight: `${this.calculateInputRightPadding()}px`
    };
    const mergedBorders = Object.assign({}, SearchBox.defaultProps.borders, borders);
    const classe = 'search-box__content-field';
    const classeNames = (0, _classnames.default)('form-control', classe, {
      [`${classe}--top-border`]: mergedBorders.top,
      [`${classe}--right-border`]: mergedBorders.right,
      [`${classe}--bottom-border`]: mergedBorders.bottom,
      [`${classe}--left-border`]: mergedBorders.left
    });
    return _react.default.createElement("input", {
      "aria-labelledby": `${id}_label`,
      type: "search",
      name: name,
      placeholder: placeholder,
      className: classeNames,
      onKeyDown: this.handleKeyDown,
      onChange: onChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      value: searchText,
      id: id,
      autoFocus: true,
      style: style
    });
  }
  renderTags() {
    const {
      tagData,
      onTagDelete,
      onTagClick,
      onToggleFilter
    } = this.props;
    return _react.default.createElement("div", {
      className: "search-box__tags"
    }, _react.default.createElement(_ResizeAware.default, {
      onResize: this.onTagListResize
    }, _react.default.createElement(_CompactTagList.default, {
      onTagDelete: onTagDelete,
      onTagClick: onTagClick,
      onHolderFocus: this.focusOnInput,
      tags: tagData,
      onSummary: onToggleFilter,
      maxSize: this.calculateSpaceForTags(),
      deletable: true
    })));
  }
  renderEnterHint() {
    return _react.default.createElement("div", {
      role: "presentation",
      className: "search-box__enter",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        this.props.onSearch();
      }
    }, _i18n.default._t('Admin.ENTER', 'Enter'), "\xA0\u21B5");
  }
  renderFilterButton() {
    const {
      expanded,
      onToggleFilter,
      formId
    } = this.props;
    const classes = (0, _classnames.default)('btn--icon', 'font-icon-caret-down-two', 'search-box__filter-trigger', this.state.width < 576 ? 'search-box--no-label' : '', {
      collapsed: !expanded
    });
    const spanClass = this.state.width < 576 ? 'sr-only' : '';
    return _react.default.createElement(_reactstrap.Button, {
      "aria-expanded": expanded,
      "aria-controls": formId,
      "aria-label": _i18n.default._t('Admin.ADVANCED', 'Advanced'),
      onClick: onToggleFilter,
      className: classes,
      title: _i18n.default._t('Admin.ADVANCED', 'Advanced')
    }, _react.default.createElement("span", {
      className: spanClass
    }, _i18n.default._t('Admin.SEARCH_OPTIONS', 'Search options')));
  }
  renderHideButton() {
    const {
      id,
      onHide
    } = this.props;
    return _react.default.createElement(_reactstrap.Button, {
      onClick: onHide,
      title: _i18n.default._t('Admin.CLOSE', 'Close'),
      "aria-label": _i18n.default._t('Admin.CLOSE', 'Close'),
      className: "font-icon-cancel btn--no-text btn--icon-lg search-box__cancel",
      "aria-controls": id,
      "aria-expanded": "true"
    });
  }
  render() {
    const {
      children,
      id,
      hideable,
      expanded,
      showFilters,
      dirty,
      clearable
    } = this.props;
    const searchClasses = (0, _classnames.default)('search-box', {
      'search-box--hideable': hideable,
      'search-box--not-hideable': !hideable,
      'search-box--has-focus': this.state.hasFocus,
      'search-box--has-not-focus': !this.state.hasFocus,
      'search-box--has-filters': showFilters,
      'search-box--has-not-filters': !showFilters,
      'search-box--compact': this.state.width < 576,
      'search-box--expanded': expanded
    });
    const showEnter = (dirty || !clearable) && this.state.hasFocus;
    return _react.default.createElement("div", {
      className: searchClasses,
      ref: node => {
        this.nodeRef = node;
      }
    }, _react.default.createElement(_ResizeAware.default, {
      onResize: this.onResize
    }, _react.default.createElement("div", {
      className: "search-box__group"
    }, _react.default.createElement(_reactstrap.Label, {
      for: id,
      id: `${id}_label`,
      hidden: true
    }, _i18n.default._t('Admin.SEARCH', 'Search')), this.renderTags(), this.renderInput(), showEnter && this.renderEnterHint(), children, _react.default.createElement("div", {
      className: "icon font-icon-search"
    }), showFilters && this.renderFilterButton(), hideable && this.renderHideButton())));
  }
}
exports.Component = SearchBox;
SearchBox.propTypes = {
  onSearch: _propTypes.default.func,
  onToggleFilter: _propTypes.default.func,
  onHideFilter: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onHide: _propTypes.default.func,
  onTagDelete: _propTypes.default.func,
  onTagClick: _propTypes.default.func,
  placeholder: _propTypes.default.string,
  expanded: _propTypes.default.bool,
  formId: _propTypes.default.string,
  id: _propTypes.default.string,
  searchText: _propTypes.default.string,
  hideable: _propTypes.default.bool,
  showFilters: _propTypes.default.bool,
  name: _propTypes.default.string,
  dirty: _propTypes.default.bool,
  clearable: _propTypes.default.bool,
  tagData: _propTypes.default.arrayOf(_TagPropType.default)
};
SearchBox.defaultProps = {
  placeholder: _i18n.default._t('Admin.SEARCH', 'Search'),
  tagData: [],
  filters: {},
  formData: {},
  term: '',
  borders: {
    top: false,
    right: false,
    bottom: true,
    left: true
  }
};
var _default = exports["default"] = SearchBox;

/***/ }),

/***/ "./client/src/components/Search/SearchForm.js":
/*!****************************************************!*\
  !*** ./client/src/components/Search/SearchForm.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Component = SearchForm;
exports["default"] = void 0;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _FormBuilderLoader = _interopRequireDefault(__webpack_require__(/*! containers/FormBuilderLoader/FormBuilderLoader */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const searchLabel = _i18n.default._t('Admin.SEARCH', 'Search');
const clearLabel = _i18n.default._t('Admin.CLEAR', 'Clear');
function onEnter(callback) {
  return e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };
}
function SearchForm(_ref) {
  let {
    visible,
    expanded,
    onSearch,
    onClear,
    formSchemaUrl,
    id,
    identifier,
    clearable
  } = _ref;
  const handleKeyDown = onEnter(onSearch);
  const loadForm = visible || expanded;
  return _react.default.createElement(_reactstrap.Collapse, {
    id: id,
    isOpen: expanded,
    className: "search-form"
  }, _react.default.createElement("div", {
    className: "search-form__wrapper",
    onKeyDown: handleKeyDown
  }, loadForm && formSchemaUrl && _react.default.createElement(_FormBuilderLoader.default, {
    className: "no-change-track",
    formTag: "div",
    identifier: identifier,
    schemaUrl: formSchemaUrl,
    onSubmit: () => {
      onSearch();
      return Promise.resolve();
    }
  }), _react.default.createElement(_reactstrap.Button, {
    className: "search-form__submit",
    onClick: () => onSearch(),
    color: "primary",
    type: "button"
  }, searchLabel), clearable && _react.default.createElement(_reactstrap.Button, {
    className: "search-form__clear",
    onClick: () => onClear()
  }, clearLabel)));
}
SearchForm.propTypes = {
  onSearch: _propTypes.default.func,
  onClear: _propTypes.default.func,
  visible: _propTypes.default.bool,
  expanded: _propTypes.default.bool,
  id: _propTypes.default.string.isRequired,
  formSchemaUrl: _propTypes.default.string,
  identifier: _propTypes.default.string,
  clearable: _propTypes.default.bool
};
SearchForm.defaultProps = {
  formData: {}
};
var _default = exports["default"] = SearchForm;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Search/SearchToggle.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Search/SearchToggle.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const label = _i18n.default._t('Admin.SHOW_SEARCH', 'Show search');
const toggleBtnClasses = toggled => (0, _classnames.default)('btn--no-text', 'search-toggle', 'font-icon-search', 'btn--icon-lg', {
  'search-toggle__active': toggled
});
const SearchToggle = _ref => {
  let {
    onToggle,
    toggled
  } = _ref;
  return _react.default.createElement(_reactstrap.Button, {
    title: label,
    onClick: onToggle,
    className: toggleBtnClasses(toggled)
  }, _react.default.createElement("span", {
    className: "sr-only"
  }, label));
};
exports.Component = SearchToggle;
SearchToggle.propTypes = {
  onToggle: _propTypes.default.func,
  toggled: _propTypes.default.bool
};
var _default = exports["default"] = SearchToggle;

/***/ }),

/***/ "./client/src/components/Search/utilities/defaultTagHandlers.js":
/*!**********************************************************************!*\
  !*** ./client/src/components/Search/utilities/defaultTagHandlers.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _genericDateTagHandler = _interopRequireDefault(__webpack_require__(/*! ./genericDateTagHandler */ "./client/src/components/Search/utilities/genericDateTagHandler.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const selectTagHandler = (key, values, formSchema) => {
  if (!Array.isArray(values) || values.length === 0) {
    return false;
  }
  const fieldState = formSchema.state.fields.find(_ref => {
    let {
      name
    } = _ref;
    return name === key;
  });
  if (fieldState && fieldState.source) {
    const labelValue = values.map(selectedValue => {
      const sourceEntry = fieldState.source.find(_ref2 => {
        let {
          value
        } = _ref2;
        return value.toString() === selectedValue.toString();
      });
      return sourceEntry && sourceEntry.title ? sourceEntry.title : selectedValue;
    }).join(', ');
    return labelValue || false;
  }
  return false;
};
const defaultTagHandlers = {
  Date: (0, _genericDateTagHandler.default)('ll'),
  Time: (0, _genericDateTagHandler.default)('LT'),
  Datetime: (0, _genericDateTagHandler.default)('lll'),
  Hidden: () => false,
  SingleSelect: (tag, field, formSchema) => {
    if (typeof tag.value === 'undefined') {
      return false;
    }
    const value = selectTagHandler(tag.key, [tag.value], formSchema);
    return value ? Object.assign({}, tag, {
      value
    }) : false;
  },
  Boolean: tag => {
    if (tag.value) {
      const {
        value,
        ...valuelessTag
      } = tag;
      return valuelessTag;
    }
    return false;
  },
  MultiSelect: (tag, field, formSchema) => {
    const value = selectTagHandler(tag.key, tag.value, formSchema);
    return value ? Object.assign({}, tag, {
      value
    }) : false;
  },
  default: tag => tag.value ? tag : false
};
var _default = exports["default"] = defaultTagHandlers;

/***/ }),

/***/ "./client/src/components/Search/utilities/genericDateTagHandler.js":
/*!*************************************************************************!*\
  !*** ./client/src/components/Search/utilities/genericDateTagHandler.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "./node_modules/moment/moment.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const genericDateTagHandler = format => (tag, _ref) => {
  let {
    lang
  } = _ref;
  if (!tag.value) {
    return false;
  }
  if (tag.value && lang) {
    _moment.default.locale(lang);
    const dateObject = (0, _moment.default)(tag.value);
    if (dateObject.isValid()) {
      return Object.assign({}, tag, {
        value: dateObject.format(format)
      });
    }
  }
  return tag;
};
var _default = exports["default"] = genericDateTagHandler;

/***/ }),

/***/ "./client/src/components/Search/utilities/mapFormSchemaToTags.js":
/*!***********************************************************************!*\
  !*** ./client/src/components/Search/utilities/mapFormSchemaToTags.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _defaultTagHandlers = _interopRequireDefault(__webpack_require__(/*! ./defaultTagHandlers */ "./client/src/components/Search/utilities/defaultTagHandlers.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const tagListReducer = (accumulator, _ref) => {
  let {
    key,
    value,
    label
  } = _ref;
  return `${accumulator}${label.toLowerCase() || key} ${value || ''} `;
};
const mapFormSchemaToTags = function (formSchema, formData) {
  let tagHandlerOverrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (formSchema.metadata.loading) {
    return {};
  }
  let tagHandlers;
  const fieldToTag = field => {
    const tag = {
      key: field.name,
      label: field.title,
      value: formData[field.name]
    };
    let handler;
    if (typeof tagHandlers[`#${tag.key}`] === 'function') {
      handler = tagHandlers[`#${tag.key}`];
    } else if (typeof tagHandlers[field.schemaType] === 'function') {
      handler = tagHandlers[field.schemaType];
    } else {
      handler = tagHandlers.default;
    }
    return handler(tag, field, formSchema, formData);
  };
  const structuralTagHandler = (tag, field) => {
    const {
      children
    } = field;
    if (!Array.isArray(children) || children.length === 0) {
      return false;
    }
    const value = children.map(fieldToTag).filter(subTag => subTag !== false).reduce(tagListReducer, '').trim();
    const linkedFields = children.map(linkedField => linkedField.name);
    const focusSelector = `[name=${children[0].name}]`;
    return value ? Object.assign({}, tag, {
      value,
      linkedFields,
      focusSelector
    }) : false;
  };
  tagHandlers = Object.assign({}, _defaultTagHandlers.default, {
    Structural: structuralTagHandler
  }, tagHandlerOverrides);
  const fields = formSchema.schema.fields;
  const tags = fields.map(fieldToTag).filter(tag => tag !== false);
  const keyedTags = {};
  tags.forEach(tag => {
    keyedTags[tag.key] = tag;
  });
  return keyedTags;
};
var _default = exports["default"] = mapFormSchemaToTags;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/SearchableDropdownField/SearchableDropdownField.js":
/*!************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/SearchableDropdownField/SearchableDropdownField.js ***!
  \************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _async = _interopRequireDefault(__webpack_require__(/*! react-select/async */ "./node_modules/react-select/async/dist/react-select-async.esm.js"));
var _Backend = _interopRequireDefault(__webpack_require__(/*! lib/Backend */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Backend.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _Config = _interopRequireDefault(__webpack_require__(/*! lib/Config */ "./client/src/lib/Config.js"));
var _debouncePromise = _interopRequireDefault(__webpack_require__(/*! debounce-promise */ "./node_modules/debounce-promise/dist/index.js"));
var _EmotionCssCacheProvider = _interopRequireDefault(__webpack_require__(/*! containers/EmotionCssCacheProvider/EmotionCssCacheProvider */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactSelect = _interopRequireDefault(__webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js"));
var _url = _interopRequireDefault(__webpack_require__(/*! url */ "./node_modules/url/url.js"));
var _FormConstants = _interopRequireDefault(__webpack_require__(/*! ../Form/FormConstants */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Form/FormConstants.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SearchableDropdownField = _ref => {
  let {
    clearable,
    disabled,
    lazyLoad,
    multi,
    passRef,
    placeholder,
    options,
    optionUrl,
    onChange,
    searchable,
    value,
    SelectComponent,
    AsyncSelectComponent,
    ...passThroughProps
  } = _ref;
  const [hasChanges, setHasChanges] = (0, _react.useState)(false);
  const [justChanged, setJustChanged] = (0, _react.useState)(false);
  const [fetchCache, setFetchCache] = (0, _react.useState)({});
  const selectComponentRef = (0, _react.createRef)();
  (0, _react.useEffect)(() => {
    if (!justChanged) {
      return;
    }
    const element = selectComponentRef.current.inputRef;
    const event = new Event('change', {
      bubbles: true
    });
    element.dispatchEvent(event);
    setJustChanged(false);
  });
  const fetchOptions = term => {
    if (fetchCache.hasOwnProperty(term)) {
      return Promise.resolve(fetchCache[term]);
    }
    let innerFetchOptions = () => {
      const fetchUrl = _url.default.parse(optionUrl, true);
      if (fetchUrl.search) {
        delete fetchUrl.search;
      }
      fetchUrl.query.term = term;
      const endpoint = _url.default.format(fetchUrl);
      const csrfHeader = _FormConstants.default.CSRF_HEADER;
      const headers = {};
      headers[csrfHeader] = _Config.default.get('SecurityID');
      return _Backend.default.get(endpoint, headers).then(response => response.json()).then(responseJson => {
        fetchCache[term] = responseJson;
        setFetchCache(fetchCache);
        return responseJson;
      });
    };
    innerFetchOptions = (0, _debouncePromise.default)(innerFetchOptions, 500);
    return innerFetchOptions();
  };
  const getOptions = input => {
    if (!lazyLoad) {
      return Promise.resolve(options);
    }
    if (!input) {
      return Promise.resolve([]);
    }
    return fetchOptions(input);
  };
  const handleChange = val => {
    setHasChanges(false);
    if (JSON.stringify(value) !== JSON.stringify(val)) {
      setHasChanges(true);
      setJustChanged(true);
    }
    if (multi) {
      onChange(val);
    } else {
      onChange(val, {
        value: val.value
      });
    }
  };
  const handleOnBlur = () => {};
  const className = (0, _classnames.default)({
    'no-change-track': !hasChanges,
    'ss-searchable-dropdown-field--lazy-load': lazyLoad
  });
  const optionsProps = lazyLoad ? {
    loadOptions: getOptions
  } : {
    options
  };
  const noOptionsMessage = inputValue => {
    if (inputValue) {
      return _i18n.default._t('Admin.NO_MATCHING_OPTIONS', 'No matching options');
    }
    return _i18n.default._t('Admin.TYPE_TO_SEARCH', 'Type to search');
  };
  const refProps = passRef ? {
    ref: selectComponentRef
  } : {};
  let val = value;
  if (typeof val !== 'object' && options && options.length > 0) {
    options.forEach(option => {
      if (option.value == value) {
        val = option;
      }
    });
  }
  if (!multi && val) {
    const keys = Object.keys(val);
    if (keys.length > 0) {
      const key = keys[0];
      const v = val[key];
      if (typeof v === 'object') {
        val = v;
      }
    }
  }
  const inputId = `${passThroughProps.id}__input`;
  const DynamicComponent = lazyLoad ? AsyncSelectComponent : SelectComponent;
  return _react.default.createElement(_EmotionCssCacheProvider.default, null, _react.default.createElement(DynamicComponent, _extends({}, passThroughProps, {
    classNamePrefix: "ss-searchable-dropdown-field",
    className: className,
    isClearable: clearable,
    isDisabled: disabled,
    isMulti: multi,
    isSearchable: searchable,
    placeholder: placeholder,
    onChange: handleChange,
    onBlur: handleOnBlur
  }, optionsProps, {
    noOptionsMessage: noOptionsMessage
  }, refProps, {
    value: val,
    inputId: inputId
  })));
};
exports.Component = SearchableDropdownField;
SearchableDropdownField.propTypes = {
  clearable: _propTypes.default.bool.isRequired,
  disabled: _propTypes.default.bool.isRequired,
  lazyLoad: _propTypes.default.bool.isRequired,
  multi: _propTypes.default.bool.isRequired,
  name: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  onChange: _propTypes.default.func,
  options: _propTypes.default.arrayOf(_propTypes.default.object),
  optionUrl: _propTypes.default.string,
  passRef: _propTypes.default.bool.isRequired,
  searchable: _propTypes.default.bool.isRequired,
  value: _propTypes.default.any,
  SelectComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]).isRequired,
  AsyncSelectComponent: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]).isRequired
};
SearchableDropdownField.defaultProps = {
  disabled: false,
  lazyLoad: false,
  clearable: true,
  searchable: true,
  multi: false,
  passRef: true,
  placeholder: '',
  onChange: () => {},
  value: '',
  SelectComponent: _reactSelect.default,
  AsyncSelectComponent: _async.default
};
var _default = exports["default"] = (0, _FieldHolder.default)(SearchableDropdownField);

/***/ }),

/***/ "./client/src/components/SingleSelectField/SingleSelectField.js":
/*!**********************************************************************!*\
  !*** ./client/src/components/SingleSelectField/SingleSelectField.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class SingleSelectField extends _react.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  getReadonlyField() {
    let label = this.props.source && this.props.source.find(item => item.value === this.props.value);
    label = typeof label === 'string' ? label : this.props.value || '';
    return _react.default.createElement(_reactstrap.Input, _extends({
      plaintext: true
    }, this.getInputProps(), {
      tag: "p"
    }), label);
  }
  getSelectField() {
    const options = this.props.source ? this.props.source.slice() : [];
    if (this.props.data.hasEmptyDefault && !options.find(item => !item.value)) {
      options.unshift({
        value: '',
        title: this.props.data.emptyString,
        disabled: false
      });
    }
    return _react.default.createElement(_reactstrap.Input, _extends({
      type: "select"
    }, this.getInputProps()), options.map((item, index) => {
      const key = `${this.props.name}-${item.value || `empty${index}`}`;
      const description = item.description || null;
      return _react.default.createElement("option", {
        key: key,
        value: item.value,
        disabled: item.disabled,
        title: description
      }, item.title);
    }));
  }
  getInputProps() {
    const props = {
      className: `${this.props.className} ${this.props.extraClass} no-chosen`,
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled
    };
    if (!this.props.readOnly) {
      Object.assign(props, {
        onChange: this.handleChange,
        value: this.props.value || ''
      });
    }
    return props;
  }
  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, {
        id: this.props.id,
        value: event.target.value
      });
    }
  }
  render() {
    let field = null;
    if (this.props.readOnly) {
      field = this.getReadonlyField();
    } else {
      field = this.getSelectField();
    }
    return field;
  }
}
exports.Component = SingleSelectField;
SingleSelectField.propTypes = {
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  onChange: _propTypes.default.func,
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  readOnly: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  source: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    description: _propTypes.default.string,
    disabled: _propTypes.default.bool
  })),
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
    hasEmptyDefault: _propTypes.default.bool,
    emptyString: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
  })])
};
SingleSelectField.defaultProps = {
  source: [],
  extraClass: '',
  className: '',
  data: {
    emptyString: _i18n.default._t('Boolean.ANY', 'Any')
  }
};
var _default = exports["default"] = (0, _FieldHolder.default)(SingleSelectField);

/***/ }),

/***/ "./client/src/components/Tabs/Tab.js":
/*!*******************************************!*\
  !*** ./client/src/components/Tabs/Tab.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Tab(_ref) {
  let {
    title,
    disabled,
    active,
    tabClassName,
    onToggle
  } = _ref;
  if (!title) {
    return null;
  }
  const classNames = (0, _classnames.default)(tabClassName, {
    active
  });
  return _react.default.createElement(_reactstrap.NavItem, null, _react.default.createElement(_reactstrap.NavLink, {
    onClick: onToggle,
    disabled: disabled,
    className: classNames
  }, title));
}
Tab.propTypes = {
  title: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  active: _propTypes.default.bool,
  tabClassName: _propTypes.default.string,
  onToggle: _propTypes.default.func.isRequired
};
Tab.defaultProps = {
  disabled: false,
  active: false
};
var _default = exports["default"] = Tab;

/***/ }),

/***/ "./client/src/components/Tabs/TabItem.js":
/*!***********************************************!*\
  !*** ./client/src/components/Tabs/TabItem.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _useTabContext = _interopRequireWildcard(__webpack_require__(/*! hooks/useTabContext */ "./client/src/hooks/useTabContext.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function TabItem(_ref) {
  let {
    name,
    className,
    extraClass,
    disabled,
    children
  } = _ref;
  const {
    activeTab,
    isOnActiveTab
  } = (0, _useTabContext.default)();
  const currentTab = name;
  const nextTabContext = (0, _react.useMemo)(() => ({
    activeTab,
    currentTab,
    isOnActiveTab: isOnActiveTab !== false && activeTab === name
  }), [activeTab, currentTab, isOnActiveTab]);
  return _react.default.createElement(_useTabContext.TabContext.Provider, {
    value: nextTabContext
  }, _react.default.createElement(_reactstrap.TabPane, {
    tabId: name,
    className: (0, _classnames.default)(className, extraClass),
    disabled: disabled
  }, _react.default.createElement(_reactstrap.Fade, {
    in: isOnActiveTab
  }, children)));
}
TabItem.propTypes = {
  name: _propTypes.default.string.isRequired,
  extraClass: _propTypes.default.string,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
};
var _default = exports["default"] = TabItem;

/***/ }),

/***/ "./client/src/components/Tabs/TabNav.js":
/*!**********************************************!*\
  !*** ./client/src/components/Tabs/TabNav.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Tab = _interopRequireDefault(__webpack_require__(/*! ./Tab */ "./client/src/components/Tabs/Tab.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function TabNav(_ref) {
  let {
    currentTab,
    children,
    onToggle
  } = _ref;
  const tabs = _react.default.Children.map(children, _ref2 => {
    let {
      props
    } = _ref2;
    return _react.default.createElement(_Tab.default, _extends({}, props, {
      onToggle: () => currentTab !== props.name && onToggle(props.name),
      active: currentTab === props.name
    }));
  });
  return tabs && tabs.length > 1 ? _react.default.createElement(_reactstrap.Nav, {
    tabs: true,
    role: "tablist"
  }, tabs) : null;
}
TabNav.propTypes = {
  currentTab: _propTypes.default.string,
  onToggle: _propTypes.default.func.isRequired
};
var _default = exports["default"] = TabNav;

/***/ }),

/***/ "./client/src/components/Tabs/Tabs.js":
/*!********************************************!*\
  !*** ./client/src/components/Tabs/Tabs.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Component = Tabs;
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var Actions = _interopRequireWildcard(__webpack_require__(/*! state/tabs/TabsActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/tabs/TabsActions.js"));
var _useTabContext = _interopRequireWildcard(__webpack_require__(/*! hooks/useTabContext */ "./client/src/hooks/useTabContext.js"));
var _TabNav = _interopRequireDefault(__webpack_require__(/*! ./TabNav */ "./client/src/components/Tabs/TabNav.js"));
var _getDefaultActiveKey = _interopRequireDefault(__webpack_require__(/*! ./getDefaultActiveKey */ "./client/src/components/Tabs/getDefaultActiveKey.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function Tabs(_ref) {
  let {
    hideNav,
    children,
    activeTab,
    className,
    extraClass,
    id,
    activateTab,
    defaultActiveKey
  } = _ref;
  const containerProps = {
    className: (0, _classnames.default)([className, extraClass]),
    id
  };
  const currentTab = activeTab || (0, _getDefaultActiveKey.default)(defaultActiveKey, children);
  const tabContext = (0, _useTabContext.default)();
  const isOnActiveTab = tabContext ? tabContext.isOnActiveTab : undefined;
  const nextTabContext = (0, _react.useMemo)(() => ({
    activeTab: currentTab,
    isOnActiveTab
  }), [activeTab, isOnActiveTab]);
  return _react.default.createElement("div", containerProps, _react.default.createElement("div", {
    className: "wrapper"
  }, !hideNav && _react.default.createElement(_TabNav.default, {
    currentTab: currentTab,
    onToggle: activateTab
  }, children), _react.default.createElement(_reactstrap.TabContent, {
    activeTab: currentTab
  }, _react.default.createElement(_useTabContext.TabContext.Provider, {
    value: nextTabContext
  }, children))));
}
Tabs.propTypes = {
  id: _propTypes.default.string.isRequired,
  defaultActiveKey: _propTypes.default.string,
  extraClass: _propTypes.default.string,
  hideNav: _propTypes.default.bool,
  activateTab: _propTypes.default.func,
  activeTab: _propTypes.default.string
};
Tabs.defaultProps = {
  className: '',
  extraClass: '',
  hideNav: false
};
const createFieldID = props => `${props.formid}__${props.id}`;
function mapStateToProps(state, ownProps) {
  const fieldID = createFieldID(ownProps);
  const field = state.tabs.fields[fieldID] ? state.tabs.fields[fieldID] : {
    activeTab: null
  };
  return {
    ...field
  };
}
function mapDispatchToProps(dispatch, ownProps) {
  const fieldID = createFieldID(ownProps);
  return {
    activateTab(activeTab) {
      dispatch(Actions.activateTab(fieldID, activeTab));
    }
  };
}
var _default = exports["default"] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Tabs);

/***/ }),

/***/ "./client/src/components/Tabs/getDefaultActiveKey.js":
/*!***********************************************************!*\
  !*** ./client/src/components/Tabs/getDefaultActiveKey.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = getDefaultActiveKey;
var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
function getDefaultActiveKey(defaultActiveKey, children) {
  const tabs = _react.Children.toArray(children);
  if (!tabs || tabs.length === 0) {
    return '';
  }
  let activeTab;
  if (typeof defaultActiveKey === 'string') {
    activeTab = tabs.find(_ref => {
      let {
        props: {
          name
        }
      } = _ref;
      return name === defaultActiveKey;
    });
  }
  if (!activeTab) {
    activeTab = tabs[0];
  }
  return activeTab.props.name;
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/CompactTagList.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/CompactTagList.js ***!
  \*******************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _TagList = _interopRequireDefault(__webpack_require__(/*! components/Tag/TagList */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/TagList.js"));
var _ResizeAware = _interopRequireDefault(__webpack_require__(/*! components/ResizeAware/ResizeAware */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ResizeAware/ResizeAware.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _SummaryTag = _interopRequireDefault(__webpack_require__(/*! ./SummaryTag */ "./client/src/components/Tag/SummaryTag.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class CompactTagList extends _react.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.onResize = this.onResize.bind(this);
    this.refreshShowSummaryView = this.refreshShowSummaryView.bind(this);
    this.getPlaceholderSize = this.getPlaceholderSize.bind(this);
    this.state = {
      showSummaryView: false
    };
  }
  componentDidUpdate() {
    const placeholderWidth = this.getPlaceholderSize();
    this.refreshShowSummaryView(placeholderWidth);
  }
  onResize(tagListDimension) {
    this.refreshShowSummaryView(tagListDimension.width);
  }
  getPlaceholderSize() {
    const node = this.nodeRef;
    if (!node) {
      return 0;
    }
    const placeholder = node.querySelector('.compact-tag-list__placeholder');
    if (placeholder) {
      return placeholder.getBoundingClientRect().width;
    }
    return 0;
  }
  refreshShowSummaryView(placeholderWidth) {
    const maxWidth = this.props.maxSize;
    const showSummaryView = maxWidth < placeholderWidth;
    if (this.state.showSummaryView !== showSummaryView) {
      this.setState(() => ({
        showSummaryView
      }));
    }
  }
  render() {
    const {
      maxSize,
      onSummary,
      ...listProps
    } = this.props;
    const showSummaryView = this.state.showSummaryView;
    const count = this.props.tags.length;
    const classes = (0, _classnames.default)('compact-tag-list', {
      'compact-tag-list__show-summary-view': showSummaryView
    });
    return _react.default.createElement("div", {
      className: classes,
      ref: node => {
        this.nodeRef = node;
      }
    }, _react.default.createElement(_ResizeAware.default, {
      onResize: this.onResize,
      className: "compact-tag-list__placeholder",
      "aria-hidden": true
    }, _react.default.createElement(_TagList.default, _extends({}, listProps, {
      focusable: false
    }))), _react.default.createElement("div", {
      className: "compact-tag-list__visible"
    }, showSummaryView ? _react.default.createElement(_SummaryTag.default, {
      count: count,
      onClick: onSummary,
      onNext: listProps.onHolderFocus
    }) : _react.default.createElement(_TagList.default, listProps)));
  }
}
CompactTagList.propTypes = Object.assign({}, _TagList.default.propTypes, {
  maxSize: _propTypes.default.number,
  onSummary: _propTypes.default.func
});
CompactTagList.defaultProps = {
  maxSize: 0,
  onSummary: () => {}
};
var _default = exports["default"] = CompactTagList;

/***/ }),

/***/ "./client/src/components/Tag/SummaryTag.js":
/*!*************************************************!*\
  !*** ./client/src/components/Tag/SummaryTag.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Tag = _interopRequireDefault(__webpack_require__(/*! components/Tag/Tag */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/Tag.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SummaryTag = _ref => {
  let {
    label,
    count,
    ...props
  } = _ref;
  return _react.default.createElement(_Tag.default, _extends({}, props, {
    deletable: false,
    title: `${count} ${label}`
  }), count, " ", _react.default.createElement("span", {
    className: "font-icon-sliders",
    "aria-label": label
  }));
};
SummaryTag.propTypes = Object.assign({}, _Tag.default.propTypes, {
  label: _propTypes.default.string,
  count: _propTypes.default.number
});
SummaryTag.defaultProps = {
  label: _i18n.default._t('Admin.SUMMARY_TAG_LABEL', 'filters')
};
var _default = exports["default"] = SummaryTag;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/Tag.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/Tag.js ***!
  \********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const onKeyDown = (e, key, onDeleteKey, onBackSpace, onPrevious, onNext) => {
  switch (e.key) {
    case 'Backspace':
      e.preventDefault();
      onBackSpace(key);
      break;
    case 'Delete':
      e.preventDefault();
      onDeleteKey(key);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      onPrevious(key);
      break;
    case 'ArrowRight':
      e.preventDefault();
      onNext(key);
      break;
    default:
      break;
  }
};
const makeLabel = (key, label, value) => (label || key) + (value ? `: ${value}` : '');
const Tag = _ref => {
  let {
    onClick,
    onDelete,
    onDeleteKey,
    onBackSpace,
    onPrevious,
    onNext,
    deletable,
    dataKey,
    label,
    value,
    children,
    focusable,
    ...props
  } = _ref;
  const title = makeLabel(dataKey, label, value);
  return _react.default.createElement(_reactstrap.Button, _extends({}, props, {
    role: "button",
    className: (0, _classnames.default)('tag-component', 'btn-sm', {
      'tag-component--deletable': deletable
    }),
    onClick: e => {
      e.preventDefault();
      onClick(dataKey);
    },
    tabIndex: focusable ? 0 : undefined,
    onKeyDown: e => {
      onKeyDown(e, dataKey, onDeleteKey, onBackSpace, onPrevious, onNext);
    },
    title: title
  }), deletable && _react.default.createElement(DeleteButton, {
    onDelete: onDelete,
    dataKey: dataKey
  }), children || title);
};
const focusOnParent = e => {
  e.target.parentElement.focus();
};
const DeleteButton = _ref2 => {
  let {
    dataKey,
    onDelete
  } = _ref2;
  return _react.default.createElement(_reactstrap.Button, {
    onClick: e => {
      e.stopPropagation();
      e.preventDefault();
      onDelete(dataKey);
    },
    "aria-label": _i18n.default._t('Admin.REMOVE_TAG', 'Remove Tag'),
    title: _i18n.default._t('Admin.REMOVE_TAG', 'Remove Tag'),
    onFocus: focusOnParent,
    tabIndex: -1,
    className: "tag-component__delete font-icon-cancel btn--no-text btn--icon-sm"
  });
};
Tag.propTypes = {
  onClick: _propTypes.default.func,
  onDelete: _propTypes.default.func,
  onDeleteKey: _propTypes.default.func,
  onBackSpace: _propTypes.default.func,
  onPrevious: _propTypes.default.func,
  onNext: _propTypes.default.func,
  deletable: _propTypes.default.bool,
  dataKey: _propTypes.default.string,
  label: _propTypes.default.string,
  value: _propTypes.default.string,
  focusable: _propTypes.default.bool
};
Tag.defaultProps = {
  tag: 'span',
  deletable: false,
  onClick: () => {},
  onDelete: () => {},
  onDeleteKey: () => {},
  onBackSpace: () => {},
  onPrevious: () => {},
  onNext: () => {},
  focusable: true
};
var _default = exports["default"] = Tag;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/TagList.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/TagList.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Tag = _interopRequireDefault(__webpack_require__(/*! components/Tag/Tag */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/Tag.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _TagPropType = _interopRequireDefault(__webpack_require__(/*! ./TagPropType */ "./client/src/components/Tag/TagPropType.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const FORWARD = true;
const BACKWARD = false;
const moveFocus = direction => {
  const sibling = document.activeElement[direction ? 'nextElementSibling' : 'previousElementSibling'];
  if (sibling) {
    sibling.focus();
    return true;
  }
  return false;
};
const TagList = _ref => {
  let {
    tags,
    deletable,
    focusable,
    onTagDelete,
    onTagClick,
    onHolderFocus
  } = _ref;
  const onDeleteKey = key => {
    moveFocus(FORWARD) || onHolderFocus();
    onTagDelete(key);
  };
  const onBackSpace = key => {
    moveFocus(BACKWARD) || moveFocus(FORWARD) || onHolderFocus();
    onTagDelete(key);
  };
  return _react.default.createElement("ul", {
    className: "tag-list"
  }, tags.map(props => _react.default.createElement(_Tag.default, _extends({}, props, {
    tag: "li",
    deletable: deletable,
    dataKey: props.key,
    focusable: focusable,
    onDelete: onTagDelete,
    onDeleteKey: deletable && onTagDelete ? onDeleteKey : undefined,
    onBackSpace: deletable && onTagDelete ? onBackSpace : undefined,
    onNext: () => {
      moveFocus(FORWARD) || onHolderFocus();
    },
    onPrevious: () => {
      moveFocus(BACKWARD);
    },
    onClick: onTagClick
  }))));
};
exports.Component = TagList;
TagList.propTypes = {
  onTagClick: _propTypes.default.func,
  onTagDelete: _propTypes.default.func,
  onHolderFocus: _propTypes.default.func,
  deletable: _propTypes.default.bool,
  tags: _propTypes.default.arrayOf(_TagPropType.default),
  focusable: _propTypes.default.bool
};
TagList.defaultProps = {
  deletable: false,
  focusable: true,
  onTagDelete: () => {},
  onTagClick: () => {},
  onHolderFocus: () => {}
};
var _default = exports["default"] = TagList;

/***/ }),

/***/ "./client/src/components/Tag/TagPropType.js":
/*!**************************************************!*\
  !*** ./client/src/components/Tag/TagPropType.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TagPropType = _propTypes.default.shape({
  key: _propTypes.default.string.isRequired,
  label: _propTypes.default.string,
  value: _propTypes.default.string
});
var _default = exports["default"] = TagPropType;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TextField/TextField.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TextField/TextField.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _InputField = _interopRequireDefault(__webpack_require__(/*! ../InputField/InputField */ "./client/src/components/InputField/InputField.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TextField extends _InputField.default {
  getInputProps() {
    const props = super.getInputProps();
    if (this.isMultiline()) {
      Object.assign(props, {
        type: 'textarea',
        rows: this.props.data.rows,
        cols: this.props.data.columns
      });
    }
    return props;
  }
  isMultiline() {
    return this.props.data && this.props.data.rows > 1;
  }
}
exports.Component = TextField;
var _default = exports["default"] = (0, _FieldHolder.default)(TextField);

/***/ }),

/***/ "./client/src/components/TimeField/TimeField.js":
/*!******************************************************!*\
  !*** ./client/src/components/TimeField/TimeField.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "./node_modules/moment/moment.js"));
var _modernizr = _interopRequireDefault(__webpack_require__(/*! modernizr */ "./client/src/.modernizrrc"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _DateField = __webpack_require__(/*! ../DateField/DateField */ "./client/src/components/DateField/DateField.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const localFormat = 'LT';
class TimeField extends _DateField.Component {
  getInputProps() {
    const placeholder = _i18n.default.inject(_i18n.default._t('Admin.FormatExample', 'Example: {format}'), {
      format: (0, _moment.default)().endOf('month').format(localFormat)
    });
    const type = this.asHTML5() ? 'time' : 'text';
    return {
      ...super.getInputProps(),
      type,
      placeholder
    };
  }
  isMultiline() {
    return false;
  }
  hasNativeSupport() {
    return this.props.modernizr.inputtypes.time;
  }
  convertToLocalised(isoTime) {
    let localTime = '';
    if (isoTime) {
      const timeObject = (0, _moment.default)(isoTime, 'HH:mm:ss');
      if (timeObject.isValid()) {
        localTime = timeObject.format(localFormat);
      }
    }
    return localTime;
  }
  convertToIso(localTime) {
    let isoTime = '';
    if (localTime) {
      const timeObject = (0, _moment.default)(localTime, localFormat);
      if (timeObject.isValid()) {
        isoTime = timeObject.format('HH:mm:ss');
      }
    }
    return isoTime;
  }
}
exports.Component = TimeField;
TimeField.propTypes = {
  lang: _propTypes.default.string,
  modernizr: _propTypes.default.object,
  data: _propTypes.default.shape({
    html5: _propTypes.default.bool
  })
};
TimeField.defaultProps = {
  modernizr: _modernizr.default,
  data: {}
};
var _default = exports["default"] = (0, _FieldHolder.default)(TimeField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tip/Tip.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tip/Tip.js ***!
  \********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.tipShape = exports["default"] = exports.TIP_TYPES = exports.TIP_IMPORTANCE_LEVELS = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _Button = _interopRequireDefault(__webpack_require__(/*! ../Button/Button */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const TIP_TYPES = exports.TIP_TYPES = {
  TITLE: 'title',
  INPUT_GROUP: 'input-group'
};
const TIP_IMPORTANCE_LEVELS = exports.TIP_IMPORTANCE_LEVELS = {
  NORMAL: 'normal',
  HIGH: 'high'
};
const tipImportanceMap = {
  [TIP_IMPORTANCE_LEVELS.NORMAL]: {
    iconColor: 'muted',
    description: _i18n.default._t('Admin.NORMAL_TIP', 'Tip')
  },
  [TIP_IMPORTANCE_LEVELS.HIGH]: {
    iconColor: 'danger',
    description: _i18n.default._t('Admin.IMPORTANT_TIP', 'Important tip')
  }
};
function Tip(props) {
  const {
    content,
    fieldTitle,
    icon,
    id,
    importance
  } = props;
  const {
    iconColor,
    description
  } = tipImportanceMap[importance];
  const label = _i18n.default.inject(_i18n.default._t('Admin.TIP_LABEL', '{description} for {fieldTitle}'), {
    description,
    fieldTitle
  });
  const classes = ['tip', props.extraClass];
  if (props.type === TIP_TYPES.TITLE) {
    classes.push('tip--title');
  } else if (props.type === TIP_TYPES.INPUT_GROUP) {
    classes.push('tip--input-group', 'btn--last', 'btn-outline-secondary', `text-${iconColor}`);
  }
  const buttonId = `${id}-tip`;
  const buttonProps = {
    id: buttonId,
    onClick: () => {},
    className: (0, _classnames.default)(classes),
    noText: true,
    icon
  };
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Button.default, buttonProps, label), _react.default.createElement(_reactstrap.UncontrolledPopover, {
    trigger: "legacy",
    placement: "top-end",
    target: buttonId
  }, _react.default.createElement(_reactstrap.PopoverBody, null, content)));
}
const tipShape = exports.tipShape = {
  content: _propTypes.default.string.isRequired,
  importance: _propTypes.default.oneOf(Object.values(TIP_IMPORTANCE_LEVELS)),
  type: _propTypes.default.oneOf(Object.values(TIP_TYPES)),
  icon: _propTypes.default.string
};
Tip.propTypes = {
  ...tipShape,
  extraClass: _propTypes.default.string,
  fieldTitle: _propTypes.default.string.isRequired,
  id: _propTypes.default.string.isRequired
};
Tip.defaultProps = {
  importance: TIP_IMPORTANCE_LEVELS.NORMAL,
  icon: 'lamp',
  type: TIP_TYPES.INPUT_GROUP
};
var _default = exports["default"] = Tip;

/***/ }),

/***/ "./client/src/components/Toasts/Toast.js":
/*!***********************************************!*\
  !*** ./client/src/components/Toasts/Toast.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.toastShape = exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _Button = _interopRequireDefault(__webpack_require__(/*! components/Button/Button */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js"));
var _ToastActions = __webpack_require__(/*! ./ToastActions */ "./client/src/components/Toasts/ToastActions.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const toastShape = exports.toastShape = {
  text: _propTypes.default.string.isRequired,
  dismissed: _propTypes.default.bool.isRequired,
  type: _propTypes.default.string.isRequired,
  actions: _propTypes.default.arrayOf(_propTypes.default.shape(_Button.default.propTypes))
};
const Toast = _ref => {
  let {
    type,
    text,
    onDismiss,
    dismissed,
    actions
  } = _ref;
  const toggle = e => {
    e.preventDefault();
    onDismiss();
  };
  const className = (0, _classnames.default)('toast', `toast--${type}`, {
    'toast--dismissing': dismissed
  });
  return _react.default.createElement(_reactstrap.Toast, {
    className: className,
    isOpen: true
  }, _react.default.createElement(_reactstrap.ToastBody, {
    className: "toast__body"
  }, _react.default.createElement(_Button.default, {
    className: "toast__close",
    icon: "cancel",
    noText: true,
    onClick: toggle,
    color: "none"
  }, _i18n.default._t('Admin.DISMISS', 'Dismiss')), _react.default.createElement("div", {
    className: "toast__content",
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }, text)), actions.length > 0 && _react.default.createElement(_ToastActions.ToastActions, {
    actions: actions,
    onDismiss: onDismiss,
    dismissed: dismissed
  }));
};
Toast.propTypes = {
  ...toastShape,
  onDismiss: _propTypes.default.func
};
Toast.defaultProps = {
  actions: [],
  onDismiss: () => {}
};
var _default = exports["default"] = Toast;

/***/ }),

/***/ "./client/src/components/Toasts/ToastActions.js":
/*!******************************************************!*\
  !*** ./client/src/components/Toasts/ToastActions.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.ToastActions = exports.ToastAction = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Button = _interopRequireDefault(__webpack_require__(/*! components/Button/Button */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ToastAction = _ref => {
  let {
    label,
    href,
    onClick,
    dismissed,
    onDismiss
  } = _ref;
  const props = href ? {
    href,
    tag: 'a'
  } : {
    onClick: e => {
      e.preventDefault();
      if (!dismissed) {
        if (onClick) {
          onClick();
        }
        onDismiss();
      }
    }
  };
  return _react.default.createElement(_Button.default, _extends({
    color: "link",
    className: "toast__action"
  }, props), label);
};
exports.ToastAction = ToastAction;
const ToastActions = _ref2 => {
  let {
    actions,
    dismissed,
    onDismiss
  } = _ref2;
  return actions.length === 0 ? null : _react.default.createElement("div", {
    className: "toast__actions"
  }, actions.slice(0, 2).map((props, index) => _react.default.createElement(ToastAction, _extends({
    key: index
  }, props, {
    onDismiss: onDismiss,
    dismissed: dismissed
  }))));
};
exports.ToastActions = ToastActions;
ToastActions.propTypes = {
  dismissed: _propTypes.default.bool.isRequired,
  actions: _propTypes.default.arrayOf(_propTypes.default.shape({
    label: _propTypes.default.string.isRequired,
    href: _propTypes.default.string,
    onClick: _propTypes.default.func
  })),
  onDismiss: _propTypes.default.func.isRequired
};
ToastActions.defaultProps = {
  actions: []
};
var _default = exports["default"] = ToastActions;

/***/ }),

/***/ "./client/src/components/Toasts/Toasts.js":
/*!************************************************!*\
  !*** ./client/src/components/Toasts/Toasts.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Toast = _interopRequireDefault(__webpack_require__(/*! ./Toast */ "./client/src/components/Toasts/Toast.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const debounceTime = 100;
const Toasts = _ref => {
  let {
    toasts,
    onDismiss,
    onPause,
    onResume
  } = _ref;
  const [timeoutRef, setTimeoutRef] = (0, _react.useState)(undefined);
  const debounce = fn => () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    setTimeoutRef(setTimeout(fn, debounceTime));
  };
  const pause = debounce(onPause);
  const resume = debounce(onResume);
  const handlers = {
    onMouseEnter: pause,
    onFocus: pause,
    onMouseLeave: resume,
    onBlur: resume
  };
  return _react.default.createElement("div", _extends({
    className: "toasts",
    "aria-live": "polite",
    "aria-atomic": "true"
  }, handlers), _react.default.createElement("div", {
    className: "toasts__wrapper"
  }, toasts.map(_ref2 => {
    let {
      id,
      ...toast
    } = _ref2;
    return _react.default.createElement(_Toast.default, _extends({
      key: id
    }, toast, {
      onDismiss: () => onDismiss(id)
    }));
  })));
};
Toasts.propTypes = {
  toasts: _propTypes.default.arrayOf(_propTypes.default.shape(_Toast.default.propTypes)).isRequired,
  onDismiss: _propTypes.default.func.isRequired,
  onPause: _propTypes.default.func.isRequired,
  onResume: _propTypes.default.func.isRequired
};
Toasts.defaultProps = {};
var _default = exports["default"] = Toasts;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Toolbar/Toolbar.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Toolbar/Toolbar.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _BackButton = _interopRequireDefault(__webpack_require__(/*! components/Button/BackButton */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/BackButton.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Toolbar = _ref => {
  let {
    showBackButton,
    children,
    onBackButtonClick
  } = _ref;
  const onClick = e => {
    e.preventDefault();
    if (typeof onBackButtonClick === 'function') {
      onBackButtonClick(e);
    }
  };
  return _react.default.createElement("div", {
    className: "toolbar toolbar--north"
  }, _react.default.createElement("div", {
    className: "toolbar__navigation fill-width"
  }, showBackButton && _react.default.createElement(_BackButton.default, {
    onClick: onClick,
    className: "toolbar__back-button"
  }), children));
};
Toolbar.propTypes = {
  onBackButtonClick: _propTypes.default.func,
  showBackButton: _propTypes.default.bool
};
Toolbar.defaultProps = {
  showBackButton: false
};
var _default = exports["default"] = Toolbar;

/***/ }),

/***/ "./client/src/components/TreeDropdownField/TreeDropdownField.js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TreeDropdownField/TreeDropdownField.js ***!
  \************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.SINGLE_EMPTY_VALUE = exports.MULTI_EMPTY_VALUE = exports.ConnectedTreeDropdownField = exports.Component = void 0;
Object.defineProperty(exports, "findTreeByID", ({
  enumerable: true,
  get: function () {
    return _treeUtils.findTreeByID;
  }
}));
Object.defineProperty(exports, "findTreeByPath", ({
  enumerable: true,
  get: function () {
    return _treeUtils.findTreeByPath;
  }
}));
Object.defineProperty(exports, "findTreePath", ({
  enumerable: true,
  get: function () {
    return _treeUtils.findTreePath;
  }
}));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _styled = _interopRequireDefault(__webpack_require__(/*! @emotion/styled */ "./node_modules/@emotion/styled/dist/emotion-styled.browser.esm.js"));
var _EmotionCssCacheProvider = _interopRequireDefault(__webpack_require__(/*! containers/EmotionCssCacheProvider/EmotionCssCacheProvider */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js"));
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _reactSelect = _interopRequireWildcard(__webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js"));
var treeDropdownFieldActions = _interopRequireWildcard(__webpack_require__(/*! state/treeDropdownField/TreeDropdownFieldActions */ "./client/src/state/treeDropdownField/TreeDropdownFieldActions.js"));
var _TreeDropdownFieldNode = _interopRequireDefault(__webpack_require__(/*! components/TreeDropdownField/TreeDropdownFieldNode */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js"));
var _url = _interopRequireDefault(__webpack_require__(/*! url */ "./node_modules/url/url.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _castStringToElement = __webpack_require__(/*! lib/castStringToElement */ "./client/src/lib/castStringToElement.js");
var _treeUtils = __webpack_require__(/*! ./treeUtils */ "./client/src/components/TreeDropdownField/treeUtils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SEARCH_DELAY = 500;
const MULTI_EMPTY_VALUE = exports.MULTI_EMPTY_VALUE = 'unchanged';
const SINGLE_EMPTY_VALUE = exports.SINGLE_EMPTY_VALUE = 0;
const Highlight = _ref => {
  let {
    children
  } = _ref;
  return _react.default.createElement("span", {
    className: "treedropdownfield__option-title--highlighted"
  }, children);
};
class TreeDropdownField extends _react.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderMenuList = this.renderMenuList.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.formatOptionLabel = this.formatOptionLabel.bind(this);
    this.getBreadcrumbs = this.getBreadcrumbs.bind(this);
    this.getDropdownOptions = this.getDropdownOptions.bind(this);
    this.getVisibleTree = this.getVisibleTree.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchReset = this.handleSearchReset.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.callFetch = this.callFetch.bind(this);
    this.lazyLoad = this.lazyLoad.bind(this);
    this.filterOption = this.filterOption.bind(this);
    this.noOptionsMessage = this.noOptionsMessage.bind(this);
    this.state = {
      opened: false
    };
    this.searchTimer = null;
  }
  componentDidMount() {
    if (!this.props.readOnly && !this.props.disabled) {
      this.initialise();
    }
    const id = this.props.id;
    const values = this.props.data.multiple ? this.props.data.valueObjects || [] : [this.props.data.valueObject];
    const selected = values.filter(item => item);
    if (selected.length) {
      this.props.actions.treeDropdownField.addSelectedValues(id, selected);
    }
  }
  componentDidUpdate(oldProps) {
    if (this.props.readOnly || this.props.disabled) {
      return;
    }
    let reload = false;
    let visible = [];
    if (this.props.search !== oldProps.search) {
      reload = true;
      visible = this.props.visible;
    }
    if (oldProps.data.urlTree !== this.props.data.urlTree) {
      reload = true;
    }
    if (oldProps.data.cacheKey !== this.props.data.cacheKey) {
      reload = true;
    }
    if (reload) {
      this.loadTree(visible, this.props.search, this.props);
    }
  }
  getVisibleTree() {
    return this.props.findTreeByPath(this.props.tree, this.props.visible);
  }
  getBreadcrumbs() {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.visible;
    const breadcrumbs = [];
    if (!path) {
      return breadcrumbs;
    }
    let node = this.props.tree;
    for (const next of path) {
      if (!node.children) {
        break;
      }
      node = node.children.find(child => child.id === next);
      if (!node) {
        break;
      }
      breadcrumbs.push(node);
    }
    return breadcrumbs;
  }
  getDropdownOptions() {
    const value = this.props.value;
    const node = this.getVisibleTree();
    let options = node ? [...node.children] : [];
    const selectedOptions = this.props.selectedValues.filter(selected => selected.id === value || Array.isArray(value) && value.find(item => item === selected.id));
    if (!this.state.opened && this.props.data.showSelectedPath) {
      options = selectedOptions.map(selected => ({
        ...selected,
        title: selected.titlePath || selected.title
      }));
    } else if (selectedOptions.length) {
      options = [...selectedOptions.filter(selected => !options.find(item => item.id === selected.id)), ...options];
    }
    options.unshift({
      id: this.props.data.multiple ? '' : SINGLE_EMPTY_VALUE,
      title: this.props.data.hasEmptyDefault ? this.props.data.emptyString : null,
      disabled: !options.length || !this.props.data.hasEmptyDefault
    });
    return options;
  }
  getPath(id) {
    const treePath = this.props.findTreePath(this.props.tree, id, this.props.data.treeBaseId);
    const breadcrumbs = this.getBreadcrumbs(treePath);
    return breadcrumbs.reduce((prev, path) => `${prev}${path.contextString || ''}${path.title}/`, '');
  }
  initialise() {
    return this.loadTree([], this.props.search).then(treeData => {
      let newPath = [];
      if (!this.props.data.multiple && this.props.value) {
        newPath = this.props.findTreePath(treeData, this.props.value, this.props.data.treeBaseId);
        if (newPath) {
          newPath.pop();
        } else {
          newPath = [];
        }
      }
      this.props.actions.treeDropdownField.setVisible(this.props.id, newPath);
    });
  }
  callFetch(path) {
    let search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props;
    const fetchURL = _url.default.parse(props.data.urlTree, true);
    if (props.data.showSearch && search.length) {
      fetchURL.query.search = search;
      fetchURL.query.flatList = '1';
    }
    if (path.length) {
      fetchURL.query.ID = path[path.length - 1];
    } else if (!props.data.multiple && props.value) {
      fetchURL.query.forceValue = props.value;
    }
    fetchURL.query.format = 'json';
    fetchURL.search = null;
    const fetchURLString = _url.default.format(fetchURL);
    return this.props.fetch(fetchURLString, {
      credentials: 'same-origin'
    }).then(response => response.json());
  }
  lazyLoad(path) {
    const foundPrev = path.find(pathNode => this.props.loading.indexOf(pathNode) > -1 || this.props.failed.indexOf(pathNode) > -1);
    if (foundPrev) {
      return Promise.resolve({});
    }
    const foundTree = this.props.findTreeByPath(this.props.tree, path);
    if (foundTree && (foundTree.count === 0 || foundTree.children.length)) {
      return Promise.resolve({});
    }
    return this.loadTree(path);
  }
  loadTree(path) {
    let search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props;
    props.actions.treeDropdownField.beginTreeUpdating(props.id, path);
    return this.callFetch(path, search, props).then(treeData => {
      props.actions.treeDropdownField.updateTree(props.id, path, treeData);
      return treeData;
    }).catch(error => {
      props.actions.treeDropdownField.updateTreeFailed(props.id, path);
      if (typeof props.onLoadingError === 'function') {
        return props.onLoadingError({
          errors: [{
            value: error.message,
            type: 'error'
          }]
        });
      }
      throw error;
    });
  }
  hasSearch() {
    return this.props.data.showSearch && Boolean(this.props.search);
  }
  filterOption(option) {
    let input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const parent = this.getVisibleTree();
    if ((option.value === SINGLE_EMPTY_VALUE || option.value === '') && (!this.props.data.hasEmptyDefault || this.props.visible.length || this.hasSearch())) {
      return false;
    }
    const title = option.label && option.label.toLocaleLowerCase();
    const search = input.toLocaleLowerCase();
    return search ? title && title.includes(search) : !parent || !option.value || parent.children.find(child => child.id === option.value);
  }
  handleOpen() {
    this.setState({
      opened: true
    });
    this.handleSearchReset();
  }
  handleClose() {
    this.setState({
      opened: false
    });
  }
  handleSearchReset() {
    clearTimeout(this.searchTimer);
    this.props.actions.treeDropdownField.setSearch(this.props.id, '');
  }
  handleSearchChange(value) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.props.actions.treeDropdownField.setSearch(this.props.id, value);
    }, SEARCH_DELAY);
  }
  handleChange(value) {
    let mappedValue = null;
    this.handleSearchReset();
    if (this.props.data.multiple) {
      mappedValue = MULTI_EMPTY_VALUE;
      if (value && value.length) {
        const uniqueValues = value && value.filter((item, index) => value.findIndex(next => next.id === item.id) === index);
        mappedValue = uniqueValues.map(item => item.id);
        this.props.actions.treeDropdownField.addSelectedValues(this.props.id, uniqueValues);
      }
    } else {
      const id = value ? value.id : null;
      const tree = this.getVisibleTree() || this.props.tree;
      let object = tree.children.find(item => item.id === id);
      if (object) {
        if (this.props.data.showSelectedPath) {
          object = {
            ...object,
            titlePath: this.getPath(id)
          };
        }
        this.props.actions.treeDropdownField.addSelectedValues(this.props.id, [object]);
      }
      mappedValue = id || SINGLE_EMPTY_VALUE;
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(mappedValue);
    }
  }
  handleNavigate(event, id) {
    if (this.hasSearch()) {
      return;
    }
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
    let path = this.props.findTreePath(this.props.tree, id, this.props.data.treeBaseId);
    if (!path) {
      path = this.props.visible.slice(0);
      path.push(id);
    }
    this.lazyLoad(path);
    this.props.actions.treeDropdownField.setVisible(this.props.id, path);
  }
  handleKeyDown(event) {
    if (this.hasSearch()) {
      if (event.keyCode === 27) {
        this.handleSearchReset(event);
      }
      return;
    }
    const focused = this.selectField.state.focusedOption;
    if (!focused) {
      return;
    }
    switch (event.keyCode) {
      case 37:
        this.handleBack(event);
        break;
      case 39:
        if (focused.count) {
          this.handleNavigate(event, focused.id);
        }
        break;
      default:
        break;
    }
  }
  handleBack(event) {
    if (this.hasSearch()) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    let path = this.props.visible;
    if (path.length) {
      path = path.slice(0, path.length - 1);
    }
    this.lazyLoad(path);
    this.props.actions.treeDropdownField.setVisible(this.props.id, path);
  }
  renderInput(_ref2) {
    let {
      children,
      ...props
    } = _ref2;
    props.id = this.props.id;
    return _react.default.createElement(_reactSelect.components.Input, props, children);
  }
  renderBreadcrumbs(breadcrumbs, _ref3) {
    let {
      cx,
      getStyles,
      getClassNames,
      ...props
    } = _ref3;
    if (breadcrumbs.length === 0) {
      return null;
    }
    breadcrumbs = breadcrumbs.map(item => item.title).join(' / ');
    const icon = this.hasSearch() ? 'font-icon-search' : 'font-icon-left-open-big';
    const className = cx({
      option: true,
      breadcrumbs: true
    }, getClassNames('option', {}));
    const StyledDiv = _styled.default.div(getStyles('option', props));
    return _react.default.createElement(StyledDiv, {
      className: className,
      onClick: this.handleBack,
      role: "button",
      tabIndex: 0
    }, _react.default.createElement("button", {
      type: "button",
      className: "treedropdownfield__breadcrumbs-button"
    }, _react.default.createElement("span", {
      className: `icon ${icon}`
    })), _react.default.createElement("span", {
      className: "treedropdownfield__breadcrumbs-crumbs flexbox-area-grow"
    }, breadcrumbs));
  }
  renderMenuList(_ref4) {
    let {
      children,
      ...props
    } = _ref4;
    const breadcrumbs = this.getBreadcrumbs();
    return _react.default.createElement(_reactSelect.components.MenuList, props, this.renderBreadcrumbs(breadcrumbs, props), children);
  }
  renderOption(_ref5) {
    let {
      children,
      ...props
    } = _ref5;
    let button = null;
    const tree = props.data;
    if (tree.count && !this.hasSearch()) {
      const handleNavigate = event => this.handleNavigate(event, tree.id);
      button = _react.default.createElement("button", {
        type: "button",
        className: "treedropdownfield__option-button fill-width",
        onClick: handleNavigate,
        onKeyDown: event => this.handleKeyDown(event),
        onTouchStart: handleNavigate
      }, _react.default.createElement("span", {
        className: "treedropdownfield__option-count-icon font-icon-right-open-big"
      }));
    }
    let subtitle = null;
    if (this.hasSearch()) {
      subtitle = tree.contextString;
      if (!subtitle && this.props.data.hasEmptyDefault && !this.props.visible.length) {
        subtitle = this.props.data.emptyString;
      }
    }
    return _react.default.createElement(_reactSelect.components.Option, props, _react.default.createElement("span", {
      className: "treedropdownfield__option-title-box flexbox-area-grow fill-height"
    }, _react.default.createElement("span", {
      className: "treedropdownfield__option-title"
    }, children), subtitle && _react.default.createElement("span", {
      className: "treedropdownfield__option-context"
    }, subtitle)), button);
  }
  renderReadOnly() {
    const inputProps = {
      id: this.props.id,
      readOnly: this.props.readOnly,
      disabled: this.props.disabled
    };
    const className = this.props.extraClass ? `treedropdownfield ${this.props.extraClass}` : 'treedropdownfield';
    let title = this.props.data.hasEmptyDefault ? this.props.data.emptyString : '';
    const selected = this.props.selectedValues;
    if (this.props.data.multiple) {
      const values = this.props.value.map(value => selected.find(item => item.id === value) || value);
      title = values.map(value => value.title).join(', ');
    } else {
      const value = selected.find(item => item.id === this.props.value);
      title = this.props.value;
      if (value && typeof value.title === 'string') {
        title = value.title;
      }
    }
    return _react.default.createElement("div", {
      className: className
    }, _react.default.createElement("span", {
      className: "treedropdownfield__title"
    }, title), _react.default.createElement(_reactstrap.Input, _extends({
      type: "hidden",
      name: this.props.name,
      value: this.props.value
    }, inputProps)));
  }
  formatOptionLabel(option) {
    const {
      title
    } = option;
    return this.props.search.length ? (0, _castStringToElement.mapHighlight)(title || '', this.props.search, Highlight) : title;
  }
  noOptionsMessage(_ref6) {
    let {
      inputValue
    } = _ref6;
    const visibleTree = this.getVisibleTree() || {};
    if (this.props.failed.indexOf(visibleTree.id || 0) >= 0) {
      return _i18n.default._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load');
    }
    if (inputValue || !visibleTree.id) {
      return _i18n.default._t('Admin.TREEDROPDOWN_NO_OPTIONS', 'No options');
    }
    return _i18n.default._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children');
  }
  render() {
    if (this.props.readOnly || this.props.disabled) {
      return this.renderReadOnly();
    }
    const className = this.props.extraClass ? `treedropdownfield ${this.props.extraClass}` : 'treedropdownfield';
    const options = this.getDropdownOptions();
    const rawValue = Array.isArray(this.props.value) ? this.props.value : [this.props.value];
    let value = this.props.selectedValues.filter(item => rawValue.includes(item.id));
    if (!value.length) {
      value = options.filter(item => rawValue.includes(item.id));
    }
    if (!value.length && this.props.data.hasEmptyDefault) {
      value = options[0];
    }
    const showSearch = typeof this.props.data.showSearch !== 'undefined' ? this.props.data.showSearch : false;
    const components = {
      Input: this.renderInput,
      MenuList: this.renderMenuList,
      Option: this.renderOption
    };
    const visibleTree = this.getVisibleTree() || {};
    const isLoading = this.props.loading.indexOf(visibleTree.id || 0) >= 0;
    return _react.default.createElement(_EmotionCssCacheProvider.default, null, _react.default.createElement(_reactSelect.default, {
      isSearchable: showSearch,
      isMulti: this.props.data.multiple,
      isClearable: true,
      className: className,
      name: this.props.name,
      options: options,
      delimiter: ",",
      components: components,
      formatOptionLabel: this.formatOptionLabel,
      filterOption: this.filterOption,
      onChange: this.handleChange,
      onMenuOpen: this.handleOpen,
      onMenuClose: this.handleClose,
      onKeyDown: this.handleKeyDown,
      onInputChange: this.handleSearchChange,
      isLoading: isLoading,
      loadingMessage: () => _i18n.default._t('Admin.TREEDROPDOWN_LOADING', 'Loading...'),
      noOptionsMessage: this.noOptionsMessage,
      value: value,
      ref: select => {
        this.selectField = select;
      },
      placeholder: this.props.data.emptyString,
      getOptionLabel: _ref7 => {
        let {
          title
        } = _ref7;
        return title;
      },
      getOptionValue: _ref8 => {
        let {
          id
        } = _ref8;
        return id;
      },
      classNamePrefix: "treedropdownfield",
      classNames: {
        option: () => 'fill-width'
      }
    }));
  }
}
exports.Component = TreeDropdownField;
TreeDropdownField.propTypes = {
  className: _propTypes.default.string,
  extraClass: _propTypes.default.string,
  id: _propTypes.default.string,
  name: _propTypes.default.string.isRequired,
  onChange: _propTypes.default.func,
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.array]),
  readOnly: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  tree: _propTypes.default.shape(_TreeDropdownFieldNode.default.propTypes),
  findTreeByPath: _propTypes.default.func,
  findTreePath: _propTypes.default.func,
  visible: _propTypes.default.array,
  loading: _propTypes.default.array,
  failed: _propTypes.default.array,
  selectedValues: _propTypes.default.array,
  data: _propTypes.default.shape({
    cacheKey: _propTypes.default.string,
    urlTree: _propTypes.default.string.isRequired,
    emptyString: _propTypes.default.string,
    valueObject: _propTypes.default.shape(_TreeDropdownFieldNode.default.propTypes),
    valueObjects: _propTypes.default.arrayOf(_propTypes.default.shape(_TreeDropdownFieldNode.default.propTypes)),
    hasEmptyDefault: _propTypes.default.bool,
    showSearch: _propTypes.default.bool,
    multiple: _propTypes.default.bool,
    showSelectedPath: _propTypes.default.bool,
    treeBaseId: _propTypes.default.number
  }),
  onLoadingError: _propTypes.default.func,
  search: _propTypes.default.string,
  actions: _propTypes.default.shape({
    treeDropdownField: _propTypes.default.object
  }),
  fetch: _propTypes.default.func
};
TreeDropdownField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  tree: {},
  visible: [],
  loading: [],
  failed: [],
  findTreeByPath: _treeUtils.findTreeByPath,
  findTreePath: _treeUtils.findTreePath,
  fetch: _isomorphicFetch.default
};
function mapStateToProps(state, ownProps) {
  const id = ownProps.id;
  const field = state.treeDropdownField.fields[id] ? state.treeDropdownField.fields[id] : {
    tree: {},
    visible: [],
    loading: [],
    failed: [],
    search: '',
    selectedValues: []
  };
  let value = ownProps.value;
  if (ownProps.data.multiple && ownProps.value === MULTI_EMPTY_VALUE) {
    value = [];
  }
  if (!ownProps.data.multiple && !ownProps.value) {
    value = SINGLE_EMPTY_VALUE;
  }
  return {
    ...field,
    value
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      treeDropdownField: (0, _redux.bindActionCreators)(treeDropdownFieldActions, dispatch)
    }
  };
}
const ConnectedTreeDropdownField = exports.ConnectedTreeDropdownField = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TreeDropdownField);
var _default = exports["default"] = (0, _FieldHolder.default)(ConnectedTreeDropdownField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js ***!
  \****************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TreeDropdownFieldNode = () => null;
TreeDropdownFieldNode.propTypes = {
  id: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  title: _propTypes.default.string,
  titlePath: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  parentid: _propTypes.default.number,
  count: _propTypes.default.number,
  depth: _propTypes.default.number,
  expanded: _propTypes.default.bool,
  limited: _propTypes.default.bool,
  marked: _propTypes.default.bool,
  opened: _propTypes.default.bool,
  children: _propTypes.default.array
};
var _default = exports["default"] = TreeDropdownFieldNode;

/***/ }),

/***/ "./client/src/components/TreeDropdownField/treeUtils.js":
/*!**************************************************************!*\
  !*** ./client/src/components/TreeDropdownField/treeUtils.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.findTreePath = exports.findTreeByPath = exports.findTreeByID = void 0;
const findTreeByPath = (tree, path) => {
  if (!tree || Object.keys(tree).length === 0) {
    return null;
  }
  if (path.length === 0) {
    return tree;
  }
  const subPath = path.slice(0);
  const nextID = subPath.shift();
  const subTree = tree.children.find(nextSubTree => nextSubTree.id === nextID);
  if (subTree) {
    return findTreeByPath(subTree, subPath);
  }
  return null;
};
exports.findTreeByPath = findTreeByPath;
const findTreeByID = (tree, id) => {
  if (!id || !tree || !tree.children || Object.keys(tree).length === 0) {
    return null;
  }
  if (tree.id === id) {
    return tree;
  }
  for (const child of tree.children) {
    const found = findTreeByID(child, id);
    if (found !== null) {
      return found;
    }
  }
  return null;
};
exports.findTreeByID = findTreeByID;
const findTreePath = function (tree, id) {
  let treeBaseId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!id) {
    return [];
  }
  if (!tree || Object.keys(tree).length === 0) {
    return null;
  }
  if (tree.id === id) {
    return [tree.id];
  }
  if (!tree.children) {
    return null;
  }
  for (const child of tree.children) {
    const childPath = findTreePath(child, id);
    if (childPath !== null) {
      if (tree.id && tree.id !== treeBaseId) {
        childPath.unshift(tree.id);
      }
      return childPath;
    }
  }
  return null;
};
exports.findTreePath = findTreePath;

/***/ }),

/***/ "./client/src/components/UsedOnTable/UsedOnTable.js":
/*!**********************************************************!*\
  !*** ./client/src/components/UsedOnTable/UsedOnTable.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _Loading = _interopRequireDefault(__webpack_require__(/*! components/Loading/Loading */ "./client/src/components/Loading/Loading.js"));
var _provideUsedOnData = _interopRequireDefault(__webpack_require__(/*! ./provideUsedOnData */ "./client/src/components/UsedOnTable/provideUsedOnData.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class UsedOnTable extends _react.PureComponent {
  renderHeader() {
    return _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", {
      scope: "col",
      className: "used-on__col--index"
    }, _i18n.default._t('Admin.USED_ON_NUM', '#')), _react.default.createElement("th", {
      scope: "col",
      className: "used-on__col--title"
    }, _i18n.default._t('Admin.USED_ON', 'Used on'))));
  }
  renderBody() {
    const {
      usedOn,
      loading,
      error
    } = this.props;
    if (error || !usedOn || !usedOn.length) {
      let message = null;
      let classState = null;
      if (error) {
        message = _i18n.default.inject(_i18n.default._t('Admin.LOADING_ERROR', 'As error occured when loading the data: {message}'), {
          message: error
        });
        classState = 'error';
      } else if (loading) {
        message = _react.default.createElement(_Loading.default, null);
        classState = 'loading';
      } else {
        message = _i18n.default._t('Admin.NOT_USED', 'This file is currently not in use.');
        classState = 'empty';
      }
      const className = (0, _classnames.default)(['used-on__message', `used-on__message--${classState}`]);
      return _react.default.createElement("tbody", {
        "aria-live": "polite"
      }, _react.default.createElement("tr", null, _react.default.createElement("td", {
        className: className,
        colSpan: "3"
      }, message)));
    }
    return _react.default.createElement("tbody", {
      "aria-live": "polite"
    }, usedOn.map(this.renderRow));
  }
  renderRow(data, index) {
    const {
      id,
      type
    } = data;
    const rowData = data.ancestors ? [data].concat(data.ancestors).reverse() : [data].reverse();
    let cellLink = '#';
    let isFirst = true;
    const titleLinks = rowData.map((arr, i) => {
      let title = arr.title;
      const link = arr.link;
      if (title && title.length >= 25) {
        title = `${title.substring(0, 25).trim()}...`;
      }
      if (link) {
        cellLink = link;
      }
      const key = `${index}-${id}-${i}`;
      const cssClasses = ['used-on__title-item'];
      if (isFirst) {
        cssClasses.push('used-on__title-item--first');
        isFirst = false;
      }
      return _react.default.createElement("li", {
        className: (0, _classnames.default)(cssClasses),
        key: key
      }, title);
    });
    const key = `${index}-${id}`;
    return _react.default.createElement("tr", {
      key: key,
      className: "used-on__row"
    }, _react.default.createElement("td", {
      className: "used-on__col--index"
    }, _react.default.createElement("a", {
      href: cellLink,
      className: "used-on__cell-link"
    }, index + 1)), _react.default.createElement("td", {
      className: "used-on__col--title"
    }, _react.default.createElement("a", {
      href: cellLink,
      className: "used-on__cell-link"
    }, _react.default.createElement("ul", {
      className: "used-on__title-items"
    }, titleLinks), _react.default.createElement("span", {
      className: "used-on__type"
    }, type))));
  }
  render() {
    return _react.default.createElement("table", {
      className: "table used-on__table"
    }, this.renderHeader(), this.renderBody());
  }
}
exports.Component = UsedOnTable;
UsedOnTable.propTypes = {
  loading: _propTypes.default.bool,
  usedOn: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    title: _propTypes.default.string,
    type: _propTypes.default.string,
    link: _propTypes.default.string,
    ancestors: _propTypes.default.arrayOf(_propTypes.default.shape({
      title: _propTypes.default.string,
      link: _propTypes.default.string
    })).isRequired
  })),
  error: _propTypes.default.string
};
var _default = exports["default"] = (0, _provideUsedOnData.default)(UsedOnTable);

/***/ }),

/***/ "./client/src/components/UsedOnTable/provideUsedOnData.js":
/*!****************************************************************!*\
  !*** ./client/src/components/UsedOnTable/provideUsedOnData.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _usedOnActions = __webpack_require__(/*! state/usedOn/usedOnActions */ "./client/src/state/usedOn/usedOnActions.js");
var _useTabContext = __webpack_require__(/*! hooks/useTabContext */ "./client/src/hooks/useTabContext.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const provideUsedOnData = UsedOnTable => {
  class UsedOnDataProvider extends _react.Component {
    componentDidMount() {
      this.haveFetchedData = false;
      if (this.props.forceFetch) {
        this.fetchDataFromEndpoint();
      }
    }
    componentDidUpdate(oldProps) {
      const tabContext = this.props.tabContext;
      const doFetch = oldProps.identifier !== this.props.identifier || !tabContext || tabContext.isOnActiveTab;
      if (doFetch) {
        this.fetchDataFromEndpoint();
      }
    }
    fetchDataFromEndpoint() {
      let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      const {
        method,
        url
      } = props.data.readUsageEndpoint || {};
      if (!this.haveFetchedData || this.props.forceFetch) {
        props.loadUsedOn(props.identifier, method, url);
      }
      this.haveFetchedData = true;
    }
    render() {
      return _react.default.createElement(UsedOnTable, this.props);
    }
  }
  UsedOnDataProvider.propTypes = {
    identifier: _propTypes.default.string,
    loading: _propTypes.default.bool,
    data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.shape({
      recordClass: _propTypes.default.string,
      recordId: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      readUsageEndpoint: _propTypes.default.shape({
        url: _propTypes.default.string,
        method: _propTypes.default.string
      })
    })]),
    usedOn: _propTypes.default.array,
    forceFetch: _propTypes.default.bool
  };
  const mapStateToProps = (state, props) => {
    const {
      recordClass,
      recordId
    } = props.data;
    const identifier = recordClass && recordId ? `${recordClass}#${recordId}` : '';
    const usedState = state.usedOn;
    const loading = usedState.loading.includes(identifier);
    const usedOn = usedState.usedOn[identifier] || null;
    const error = usedState.errors[identifier] || null;
    return {
      identifier,
      loading,
      usedOn,
      error
    };
  };
  const ComponentWithTabContext = (0, _useTabContext.injectTabContext)(UsedOnDataProvider);
  const connectedUsedOnDataProvider = (0, _reactRedux.connect)(mapStateToProps, {
    loadUsedOn: _usedOnActions.loadUsedOn
  })(ComponentWithTabContext);
  connectedUsedOnDataProvider.Component = ComponentWithTabContext;
  return connectedUsedOnDataProvider;
};
var _default = exports["default"] = provideUsedOnData;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/VersionedBadge/VersionedBadge.js":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/VersionedBadge/VersionedBadge.js ***!
  \******************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.statuses = exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Badge = _interopRequireDefault(__webpack_require__(/*! components/Badge/Badge */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Badge/Badge.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const statuses = exports.statuses = ['draft', 'modified', 'live', 'archived'];
const toTitleCase = str => str.replace(/^\w/, c => c.toUpperCase());
const VersionedBadge = _ref => {
  let {
    status,
    className
  } = _ref;
  const props = {
    className: (0, _classnames.default)(className, 'versioned-badge', `versioned-badge--${status}`),
    message: _i18n.default._t(`ADMIN.${status.toUpperCase()}`, toTitleCase(status)),
    status: 'default'
  };
  return _react.default.createElement(_Badge.default, props);
};
VersionedBadge.propTypes = {
  status: _propTypes.default.oneOf(statuses).isRequired,
  className: _propTypes.default.string
};
var _default = exports["default"] = VersionedBadge;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ViewModeToggle/ViewModeToggle.js":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ViewModeToggle/ViewModeToggle.js ***!
  \******************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _ViewModeActions = __webpack_require__(/*! state/viewMode/ViewModeActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeActions.js");
var _ViewModeStates = __webpack_require__(/*! state/viewMode/ViewModeStates */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeStates.js");
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class ViewModeToggle extends _react.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    this.handleSplitSelect = this.handleSplitSelect.bind(this);
    this.handlePreviewSelect = this.handlePreviewSelect.bind(this);
    this.handleEditSelect = this.handleEditSelect.bind(this);
  }
  getIconClass() {
    const {
      activeState,
      editIconClass,
      previewIconClass,
      splitIconClass
    } = this.props;
    switch (activeState) {
      case _ViewModeStates.VIEW_MODE_STATES.EDIT:
        return editIconClass;
      case _ViewModeStates.VIEW_MODE_STATES.PREVIEW:
        return previewIconClass;
      default:
        return splitIconClass;
    }
  }
  getTitle() {
    const {
      activeState
    } = this.props;
    switch (activeState) {
      case _ViewModeStates.VIEW_MODE_STATES.EDIT:
        return _i18n.default._t('Admin.EDIT_MODE', 'Edit mode');
      case _ViewModeStates.VIEW_MODE_STATES.PREVIEW:
        return _i18n.default._t('Admin.PREVIEW_MODE', 'Preview mode');
      default:
        return _i18n.default._t('Admin.SPLIT_MODE', 'Split mode');
    }
  }
  toggle() {
    window.setTimeout(() => this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    })), 0);
  }
  handleSplitSelect() {
    this.props.onSplitSelect();
  }
  handlePreviewSelect() {
    this.props.onPreviewSelect();
  }
  handleEditSelect() {
    this.props.onEditSelect();
  }
  renderSplitDropdownItem() {
    const {
      activeState,
      splitAvailable,
      splitIconClass
    } = this.props;
    const itemClass = (0, _classnames.default)('btn', 'icon-view', 'first', splitIconClass, {
      'viewmode-toggle__button': true,
      'viewmode-toggle--selected': activeState === _ViewModeStates.VIEW_MODE_STATES.SPLIT,
      disabled: !splitAvailable
    });
    return _react.default.createElement(_reactstrap.DropdownItem, {
      type: "button",
      disabled: !splitAvailable,
      className: itemClass,
      value: _ViewModeStates.VIEW_MODE_STATES.SPLIT,
      onClick: this.handleSplitSelect,
      id: "splitModeButton"
    }, _i18n.default._t('Admin.SPLIT_MODE', 'Split mode'));
  }
  renderEditDropDownItem() {
    const {
      activeState,
      editIconClass
    } = this.props;
    const itemClass = (0, _classnames.default)('btn', 'icon-view', 'last', 'viewmode-toggle__button', editIconClass, {
      'viewmode-toggle--selected': activeState === _ViewModeStates.VIEW_MODE_STATES.EDIT
    });
    return _react.default.createElement(_reactstrap.DropdownItem, {
      type: "button",
      className: itemClass,
      value: "content",
      onClick: this.handleEditSelect
    }, _i18n.default._t('Admin.EDIT_MODE', 'Edit mode'));
  }
  renderPreviewDropDownItem() {
    const {
      activeState,
      previewIconClass
    } = this.props;
    const itemClass = (0, _classnames.default)('btn', 'icon-view', 'viewmode-toggle__button', previewIconClass, {
      'viewmode-toggle--selected': activeState === _ViewModeStates.VIEW_MODE_STATES.PREVIEW
    });
    return _react.default.createElement(_reactstrap.DropdownItem, {
      type: "button",
      className: itemClass,
      value: "preview",
      onClick: this.handlePreviewSelect
    }, _i18n.default._t('Admin.PREVIEW_MODE', 'Preview mode'));
  }
  render() {
    const {
      activeState,
      area,
      splitAvailable,
      dropdownToggleProps
    } = this.props;
    if (area === _ViewModeStates.VIEW_MODE_STATES.EDIT && activeState === _ViewModeStates.VIEW_MODE_STATES.SPLIT) {
      return null;
    }
    const toggleClassName = (0, _classnames.default)(this.getIconClass(), 'btn', 'viewmode-toggle__dropdown', dropdownToggleProps.classname);
    return _react.default.createElement(_reactstrap.Dropdown, {
      isOpen: this.state.dropdownOpen,
      toggle: this.toggle,
      className: "viewmode-toggle"
    }, _react.default.createElement(_reactstrap.DropdownToggle, _extends({
      className: toggleClassName,
      caret: true
    }, dropdownToggleProps), _react.default.createElement("span", {
      className: "viewmode-toggle__chosen-view-title"
    }, this.getTitle())), _react.default.createElement(_reactstrap.DropdownMenu, null, this.renderSplitDropdownItem(), this.renderEditDropDownItem(), this.renderPreviewDropDownItem(), !splitAvailable && _react.default.createElement("div", {
      className: "disabled-tooltip"
    }, _react.default.createElement("span", {
      className: "disabled-tooltip-span"
    }, _i18n.default._t('Admin.SCREEN_TOO_SMALL', 'Screen size too small')))));
  }
}
exports.Component = ViewModeToggle;
ViewModeToggle.propTypes = {
  activeState: _propTypes.default.oneOf(Object.values(_ViewModeStates.VIEW_MODE_STATES)),
  area: _propTypes.default.string.isRequired,
  splitAvailable: _propTypes.default.bool,
  onPreviewSelect: _propTypes.default.func,
  onEditSelect: _propTypes.default.func,
  onSplitSelect: _propTypes.default.func,
  editIconClass: _propTypes.default.string,
  previewIconClass: _propTypes.default.string,
  splitIconClass: _propTypes.default.string
};
ViewModeToggle.defaultProps = {
  splitAvailable: true,
  editIconClass: 'font-icon-edit-write',
  previewIconClass: 'font-icon-eye',
  splitIconClass: 'font-icon-columns',
  dropdownToggleProps: {}
};
function mapStateToProps(state) {
  return {
    activeState: state.viewMode.activeState,
    splitAvailable: state.viewMode.splitAvailable
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onSplitSelect() {
      dispatch((0, _ViewModeActions.selectSplitMode)());
    },
    onEditSelect() {
      dispatch((0, _ViewModeActions.selectEditMode)());
    },
    onPreviewSelect() {
      dispatch((0, _ViewModeActions.selectPreviewMode)());
    }
  };
}
var _default = exports["default"] = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(ViewModeToggle);

/***/ }),

/***/ "./client/src/containers/App/App.js":
/*!******************************************!*\
  !*** ./client/src/containers/App/App.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
var _reactRouter = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const App = _ref => {
  let {
    children
  } = _ref;
  return _react.default.createElement("div", {
    className: "app sboyd"
  }, children, _react.default.createElement(_reactRouter.Outlet, null));
};
var _default = exports["default"] = (0, _Injector.provideInjector)(App);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js":
/*!************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js ***!
  \************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _cache = _interopRequireDefault(__webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js"));
var _react2 = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function EmotionCssCacheProvider(_ref) {
  let {
    children
  } = _ref;
  if (!window.ssReactSelectCache) {
    window.ssReactSelectCache = (0, _cache.default)({
      key: 'react-select',
      insertionPoint: document.querySelector('title')
    });
  }
  return _react.default.createElement(_react2.CacheProvider, {
    value: window.ssReactSelectCache
  }, children);
}
var _default = exports["default"] = EmotionCssCacheProvider;

/***/ }),

/***/ "./client/src/containers/Form/Form.js":
/*!********************************************!*\
  !*** ./client/src/containers/Form/Form.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
var _getFormState = _interopRequireDefault(__webpack_require__(/*! lib/getFormState */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const InjectableForm = props => {
  const FormComponent = props.formComponent;
  const newProps = {
    ...props
  };
  delete newProps.formComponent;
  return _react.default.createElement(FormComponent, newProps);
};
InjectableForm.propTypes = {
  formComponent: _propTypes.default.elementType.isRequired
};
const InjectedForm = (0, _Injector.inject)(['Form'], formComponent => ({
  formComponent
}))(InjectableForm);
var _default = exports["default"] = (0, _reduxForm.reduxForm)({
  getFormState: _getFormState.default,
  destroyOnUnmount: false
})(InjectedForm);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js ***!
  \************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Component = void 0;
exports.createFormIdentifierFromProps = createFormIdentifierFromProps;
exports["default"] = void 0;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _schemaFieldValues = _interopRequireDefault(__webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js"));
var _createErrorBlock = __webpack_require__(/*! lib/createErrorBlock */ "./client/src/lib/createErrorBlock.js");
var schemaActions = _interopRequireWildcard(__webpack_require__(/*! state/schema/SchemaActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! merge */ "./node_modules/merge/lib/src/index.js"));
var _FormBuilder = _interopRequireWildcard(__webpack_require__(/*! components/FormBuilder/FormBuilder */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilder/FormBuilder.js"));
var _getIn = _interopRequireDefault(__webpack_require__(/*! redux-form/lib/structure/plain/getIn */ "./node_modules/redux-form/lib/structure/plain/getIn.js"));
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
var _getFormState = _interopRequireDefault(__webpack_require__(/*! lib/getFormState */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createFormIdentifierFromProps(_ref) {
  let {
    identifier,
    schema = {}
  } = _ref;
  return [identifier, schema.schema && schema.schema.name].filter(id => id).join('.');
}
const FormBuilderLoader = props => {
  const [didError, setDidError] = (0, _react.useState)(false);
  const doFetch = function () {
    let schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    let state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let errors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    if (props.loading) {
      return Promise.resolve({});
    }
    const headerValues = ['auto', schema && 'schema', state && 'state', errors && 'errors'].filter(header => header);
    props.actions.schema.setSchemaLoading(props.schemaUrl, true);
    if (typeof props.onFetchingSchema === 'function') {
      props.onFetchingSchema();
    }
    return callFetch(headerValues).then(formSchema => {
      props.actions.schema.setSchemaLoading(props.schemaUrl, false);
      if (formSchema.errors) {
        if (typeof props.onLoadingError === 'function') {
          props.onLoadingError(formSchema);
        }
      } else if (typeof props.onLoadingSuccess === 'function') {
        props.onLoadingSuccess();
      }
      if (typeof formSchema.id !== 'undefined' && formSchema.state) {
        const overriddenSchema = Object.assign({}, formSchema, {
          state: overrideStateData(formSchema.state)
        });
        const identifier = createFormIdentifierFromProps({
          ...props,
          schema: {
            ...props.schema,
            ...overriddenSchema
          }
        });
        props.actions.schema.setSchema(props.schemaUrl, overriddenSchema, identifier);
        const schemaData = formSchema.schema || props.schema.schema;
        const formData = (0, _schemaFieldValues.default)(schemaData, overriddenSchema.state);
        props.actions.reduxForm.initialize(identifier, formData, false, {
          keepSubmitSucceeded: true
        });
        if (typeof props.onReduxFormInit === 'function') {
          props.onReduxFormInit();
        }
        return overriddenSchema;
      }
      return formSchema;
    }).catch(error => {
      setDidError(true);
      props.actions.schema.setSchemaLoading(props.schemaUrl, false);
      if (typeof props.onLoadingError === 'function') {
        return props.onLoadingError(normaliseError(error));
      }
      throw error;
    });
  };
  const callFetch = headerValues => {
    return (0, _isomorphicFetch.default)(props.schemaUrl, {
      headers: {
        'X-FormSchema-Request': headerValues.join(','),
        Accept: 'application/json'
      },
      credentials: 'same-origin'
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      return new Promise((resolve, reject) => response.json().then(json => {
        reject({
          status: response.status,
          statusText: response.statusText,
          json
        });
      }).catch(() => {
        reject({
          status: response.status,
          statusText: response.statusText,
          json: {}
        });
      }));
    });
  };
  let justFetched = false;
  (0, _react.useEffect)(() => {
    if (props.refetchSchemaOnMount || !props.schema) {
      doFetch();
      justFetched = true;
    }
  }, []);
  (0, _react.useEffect)(() => {
    if (!justFetched) {
      doFetch();
    }
  }, [props.scheumaUrl, justFetched]);
  const getMessages = state => {
    const messages = {};
    if (state && state.fields) {
      state.fields.forEach(field => {
        if (field.message) {
          messages[field.name] = field.message;
        }
      });
    }
    return messages;
  };
  const getIdentifier = function () {
    let propArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : props;
    return createFormIdentifierFromProps(propArgs);
  };
  const handleSubmit = (data, action, submitFn) => {
    let promise = null;
    const newSubmitFn = () => submitFn().then(formSchema => {
      let schema = formSchema;
      if (schema) {
        const explicitUpdatedState = typeof schema.state !== 'undefined';
        schema = reduceSchemaErrors(schema);
        props.actions.schema.setSchema(props.schemaUrl, schema, getIdentifier());
        if (explicitUpdatedState) {
          const schemaRef = schema.schema || props.schema.schema;
          const formData = (0, _schemaFieldValues.default)(schemaRef, schema.state);
          props.actions.reduxForm.initialize(getIdentifier(), formData);
        }
      }
      return schema;
    });
    if (typeof props.onSubmit === 'function') {
      promise = props.onSubmit(data, action, newSubmitFn);
    } else {
      promise = newSubmitFn();
    }
    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }
    return promise.then(formSchema => {
      if (!formSchema || !formSchema.state) {
        return formSchema;
      }
      const messages = getMessages(formSchema.state);
      if (Object.keys(messages).length) {
        throw new _reduxForm.SubmissionError(messages);
      }
      return formSchema;
    });
  };
  const reduceSchemaErrors = schema => {
    if (!schema.errors) {
      return schema;
    }
    let reduced = {
      ...schema
    };
    if (!reduced.state) {
      reduced = {
        ...reduced,
        state: props.schema.state
      };
    }
    reduced = {
      ...reduced,
      state: {
        ...reduced.state,
        fields: reduced.state.fields.map(field => {
          let message = schema.errors.find(error => error.field === field.name);
          if (message) {
            message = (0, _createErrorBlock.createErrorHtml)([message.value]);
          }
          return {
            ...field,
            message
          };
        }),
        messages: schema.errors.filter(error => !error.field)
      }
    };
    delete reduced.errors;
    return (0, _deepFreezeStrict.default)(reduced);
  };
  const overrideStateData = state => {
    if (!props.stateOverrides || !state) {
      return state;
    }
    const fieldOverrides = props.stateOverrides.fields;
    let fields = state.fields;
    if (fieldOverrides && fields) {
      fields = fields.map(field => {
        const fieldOverride = fieldOverrides.find(override => override.name === field.name);
        return fieldOverride ? _merge.default.recursive(true, field, fieldOverride) : field;
      });
    }
    return Object.assign({}, state, props.stateOverrides, {
      fields
    });
  };
  const normaliseError = error => {
    if (error.json && error.json.errors) {
      return error.json;
    }
    if (error.status && error.statusText) {
      return {
        errors: [{
          code: error.status,
          value: error.statusText,
          type: 'error'
        }]
      };
    }
    const message = error.message || _i18n.default._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred.');
    return {
      errors: [{
        value: message,
        type: 'error'
      }]
    };
  };
  const handleAutofill = (field, value) => {
    props.actions.reduxForm.autofill(getIdentifier(), field, value);
  };
  if (didError) {
    return null;
  }
  if (!props.schema || !props.schema.schema || props.loading) {
    const Loading = props.loadingComponent;
    return _react.default.createElement(Loading, {
      containerClass: "loading--form flexbox-area-grow"
    });
  }
  const newProps = Object.assign({}, props, {
    form: getIdentifier(),
    onSubmitSuccess: props.onSubmitSuccess,
    onSubmit: handleSubmit,
    onAutofill: handleAutofill,
    autoFocus: props.autoFocus
  });
  return _react.default.createElement(_FormBuilder.default, newProps);
};
exports.Component = FormBuilderLoader;
FormBuilderLoader.propTypes = Object.assign({}, _FormBuilder.basePropTypes, {
  actions: _propTypes.default.shape({
    schema: _propTypes.default.object,
    reduxFrom: _propTypes.default.object
  }),
  autoFocus: _propTypes.default.bool,
  identifier: _propTypes.default.string.isRequired,
  schemaUrl: _propTypes.default.string.isRequired,
  schema: _FormBuilder.schemaPropType,
  refetchSchemaOnMount: _propTypes.default.bool.isRequired,
  form: _propTypes.default.string,
  submitting: _propTypes.default.bool,
  onFetchingSchema: _propTypes.default.func,
  onReduxFormInit: _propTypes.default.func,
  loadingComponent: _propTypes.default.elementType.isRequired
});
FormBuilderLoader.defaultProps = {
  refetchSchemaOnMount: true
};
function mapStateToProps(state, ownProps) {
  const schema = state.form.formSchemas[ownProps.schemaUrl];
  const identifier = createFormIdentifierFromProps({
    ...ownProps,
    schema
  });
  const reduxFormState = (0, _getIn.default)((0, _getFormState.default)(state), identifier);
  const submitting = reduxFormState && reduxFormState.submitting;
  const values = reduxFormState && reduxFormState.values;
  const stateOverrides = schema && schema.stateOverride;
  const loading = schema && schema.metadata && schema.metadata.loading;
  return {
    schema,
    submitting,
    values,
    stateOverrides,
    loading
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({
        autofill: _reduxForm.autofill,
        initialize: _reduxForm.initialize
      }, dispatch)
    }
  };
}
var _default = exports["default"] = (0, _redux.compose)((0, _Injector.inject)(['ReduxForm', 'ReduxFormField', 'Loading'], (ReduxForm, ReduxFormField, Loading) => ({
  loadingComponent: Loading,
  baseFormComponent: ReduxForm,
  baseFieldComponent: ReduxFormField
}), _ref2 => {
  let {
    identifier
  } = _ref2;
  return identifier;
}), (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(FormBuilderLoader);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/InsertLinkModal.js":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/InsertLinkModal.js ***!
  \********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.createInsertLinkModal = exports.InsertLinkModal = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _FormBuilderModal = _interopRequireDefault(__webpack_require__(/*! components/FormBuilderModal/FormBuilderModal */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilderModal/FormBuilderModal.js"));
var _fileSchemaModalHandler = _interopRequireDefault(__webpack_require__(/*! containers/InsertLinkModal/fileSchemaModalHandler */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js"));
var schemaActions = _interopRequireWildcard(__webpack_require__(/*! state/schema/SchemaActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class InsertLinkModal extends _react.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    if (!props.isOpen) {
      props.setOverrides(null);
    }
  }
  componentDidUpdate(oldProps) {
    const props = this.props;
    if (props.isOpen && !oldProps.isOpen || !props.isOpen && oldProps.isOpen) {
      props.setOverrides(props.isOpen ? props : null);
    }
  }
  getModalProps() {
    const props = Object.assign({}, this.props, {
      onSubmit: this.handleSubmit,
      onClosed: this.props.onClosed,
      autoFocus: true,
      showErrorMessage: true
    });
    delete props.onInsert;
    delete props.sectionConfig;
    return props;
  }
  handleSubmit(data, action) {
    switch (action) {
      case 'action_cancel':
        {
          this.props.onClosed();
          break;
        }
      default:
        {
          this.props.onInsert(data, action);
        }
    }
    return Promise.resolve();
  }
  render() {
    const modalProps = this.getModalProps();
    return _react.default.createElement(_FormBuilderModal.default, modalProps);
  }
}
exports.InsertLinkModal = InsertLinkModal;
InsertLinkModal.propTypes = {
  isOpen: _propTypes.default.bool,
  schemaUrl: _propTypes.default.string,
  onInsert: _propTypes.default.func.isRequired,
  onClosed: _propTypes.default.func.isRequired,
  setOverrides: _propTypes.default.func.isRequired,
  actions: _propTypes.default.object,
  requireLinkText: _propTypes.default.bool,
  currentPageID: _propTypes.default.number
};
InsertLinkModal.defaultProps = {};
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
  };
}
const createInsertLinkModal = (sectionConfigKey, formName) => {
  function mapStateToProps(state, ownProps) {
    const sectionConfig = state.config.sections.find(section => section.name === sectionConfigKey);
    const requireTextFieldUrl = ownProps.requireLinkText ? '?requireLinkText' : '';
    const schemaUrl = `${sectionConfig.form[formName].schemaUrl}${requireTextFieldUrl}`.replace(/:pageid/, ownProps.currentPageID);
    return {
      sectionConfig,
      schemaUrl
    };
  }
  return (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), _fileSchemaModalHandler.default)(InsertLinkModal);
};
exports.createInsertLinkModal = createInsertLinkModal;
var _default = exports["default"] = (0, _redux.compose)((0, _reactRedux.connect)(() => ({}), mapDispatchToProps), _fileSchemaModalHandler.default)(InsertLinkModal);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js ***!
  \***************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.FileSchemaHandler = exports.ConnectedFileSchemaHandler = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var schemaActions = _interopRequireWildcard(__webpack_require__(/*! state/schema/SchemaActions */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class FileSchemaHandler extends _react.Component {
  constructor(props) {
    super(props);
    this.setOverrides = this.setOverrides.bind(this);
  }
  componentDidMount() {
    this.setOverrides(this.props);
  }
  componentWillUnmount() {
    this.setOverrides();
  }
  setOverrides() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!props) {
      const schemaUrl = this.props.schemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    } else if (props.schemaUrl) {
      const attrs = Object.assign({}, props.fileAttributes);
      delete attrs.ID;
      const overrides = {
        fields: Object.entries(attrs).map(field => {
          const [name, value] = field;
          return {
            name,
            value
          };
        })
      };
      this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, overrides);
    }
  }
  render() {
    const {
      Component: TargetComponent,
      ...props
    } = this.props;
    return _react.default.createElement(TargetComponent, _extends({
      setOverrides: this.setOverrides
    }, props));
  }
}
exports.FileSchemaHandler = FileSchemaHandler;
FileSchemaHandler.propTypes = {
  fileAttributes: _propTypes.default.object,
  Component: _propTypes.default.elementType,
  schemaUrl: _propTypes.default.string,
  actions: _propTypes.default.object
};
function mapDispatchToProps(dispatch, props) {
  const actions = props && props.actions || {};
  return {
    actions: {
      ...actions,
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
  };
}
const ConnectedFileSchemaHandler = exports.ConnectedFileSchemaHandler = (0, _reactRedux.connect)(() => ({}), mapDispatchToProps())(FileSchemaHandler);
function fileSchemaModalHandler(AssetAdmin) {
  function mapStateToProps() {
    return {
      Component: AssetAdmin
    };
  }
  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FileSchemaHandler);
}
var _default = exports["default"] = fileSchemaModalHandler;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/SudoMode/SudoMode.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/SudoMode/SudoMode.js ***!
  \******************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _Config = _interopRequireDefault(__webpack_require__(/*! lib/Config */ "./client/src/lib/Config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const configSectionKey = 'SilverStripe\\Admin\\SudoModeController';
const withSudoMode = WrappedComponent => {
  class ComponentWithSudoMode extends _react.Component {
    constructor(props) {
      super(props);
      this.state = {
        active: _Config.default.getSection(configSectionKey).sudoModeActive || false,
        showVerification: false,
        loading: false,
        errorMessage: null
      };
      this.handleConfirmNotice = this.handleConfirmNotice.bind(this);
      this.handleVerify = this.handleVerify.bind(this);
      this.handleVerifyInputKeyPress = this.handleVerifyInputKeyPress.bind(this);
      this.passwordInput = null;
      this.setPasswordInput = element => {
        this.passwordInput = element;
      };
    }
    handleConfirmNotice() {
      this.setState({
        showVerification: true
      }, () => this.passwordInput && this.passwordInput.focus());
    }
    handleVerify() {
      this.setState({
        loading: true
      });
      const payload = new FormData();
      payload.append('SecurityID', _Config.default.get('SecurityID'));
      payload.append('Password', this.passwordInput.value);
      (0, _isomorphicFetch.default)(_Config.default.getSection(configSectionKey).endpoints.activate, {
        method: 'POST',
        body: payload
      }).then(response => response.json().then(result => {
        if (result.result) {
          return this.setState({
            loading: false,
            active: true
          });
        }
        return this.setState({
          loading: false,
          errorMessage: result.message
        }, () => this.passwordInput.focus());
      }));
    }
    handleVerifyInputKeyPress(event) {
      if (event.charCode === 13) {
        event.stopPropagation();
        event.preventDefault();
        this.handleVerify();
      }
    }
    isSudoModeActive() {
      return this.state.active === true;
    }
    renderSudoModeNotice() {
      const {
        i18n
      } = window;
      const {
        showVerification
      } = this.state;
      const helpLink = _Config.default.getSection(configSectionKey).helpLink || null;
      return _react.default.createElement("div", {
        className: "sudo-mode__notice sudo-mode__notice--required"
      }, _react.default.createElement("p", {
        className: "sudo-mode__notice-message"
      }, i18n._t('Admin.VERIFY_ITS_YOU', 'Verify it\'s you first.'), helpLink && _react.default.createElement("a", {
        href: helpLink,
        className: "sudo-mode__notice-help",
        target: "_blank",
        rel: "noopener noreferrer"
      }, i18n._t('Admin.WHATS_THIS', 'What is this?'))), !showVerification && _react.default.createElement(_reactstrap.Button, {
        className: "sudo-mode__notice-button font-icon-lock",
        color: "info",
        onClick: this.handleConfirmNotice
      }, i18n._t('Admin.VERIFY_TO_CONTINUE', 'Verify to continue')));
    }
    renderSudoModeVerification() {
      const {
        i18n
      } = window;
      const {
        errorMessage
      } = this.state;
      const inputProps = {
        type: 'password',
        name: 'sudoModePassword',
        id: 'sudoModePassword',
        className: 'no-change-track',
        onKeyPress: this.handleVerifyInputKeyPress,
        innerRef: this.setPasswordInput
      };
      const validationProps = errorMessage ? {
        valid: false,
        invalid: true
      } : {};
      return _react.default.createElement("div", {
        className: "sudo-mode__verify"
      }, _react.default.createElement(_reactstrap.FormGroup, {
        className: "sudo-mode__verify-form-group"
      }, _react.default.createElement(_reactstrap.Label, {
        for: "sudoModePassword"
      }, i18n._t('Admin.ENTER_PASSWORD', 'Enter your password')), _react.default.createElement(_reactstrap.InputGroup, null, _react.default.createElement(_reactstrap.Input, _extends({}, inputProps, validationProps)), _react.default.createElement(_reactstrap.InputGroupAddon, {
        addonType: "append"
      }, _react.default.createElement(_reactstrap.Button, {
        className: "sudo-mode__verify-button",
        color: "info",
        onClick: this.handleVerify
      }, i18n._t('Admin.VERIFY', 'Verify'))), _react.default.createElement(_reactstrap.FormFeedback, null, errorMessage))));
    }
    renderSudoMode() {
      const {
        showVerification,
        loading
      } = this.state;
      const LoadingComponent = this.props.LoadingComponent || (0, _Injector.loadComponent)('CircularLoading', 'SudoMode');
      if (loading) {
        return _react.default.createElement("div", {
          className: "sudo-mode alert alert-info"
        }, _react.default.createElement(LoadingComponent, {
          block: true
        }));
      }
      return _react.default.createElement("div", {
        className: "sudo-mode alert alert-info"
      }, this.renderSudoModeNotice(), showVerification && this.renderSudoModeVerification());
    }
    render() {
      if (!this.isSudoModeActive()) {
        return this.renderSudoMode();
      }
      return _react.default.createElement(WrappedComponent, this.props);
    }
  }
  ComponentWithSudoMode.propTypes = {
    LoadingComponent: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func])
  };
  return ComponentWithSudoMode;
};
var _default = exports["default"] = withSudoMode;

/***/ }),

/***/ "./client/src/containers/ToastsContainer/ToastsContainer.js":
/*!******************************************************************!*\
  !*** ./client/src/containers/ToastsContainer/ToastsContainer.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Toasts = _interopRequireDefault(__webpack_require__(/*! components/Toasts/Toasts */ "./client/src/components/Toasts/Toasts.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var toastsActions = _interopRequireWildcard(__webpack_require__(/*! state/toasts/ToastsActions */ "./client/src/state/toasts/ToastsActions.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ToastsContainer = _ref => {
  let {
    toasts,
    actions: {
      dismiss,
      pause,
      resume
    }
  } = _ref;
  return _react.default.createElement(_Toasts.default, {
    toasts: toasts,
    onDismiss: dismiss,
    onPause: pause,
    onResume: resume
  });
};
const mapStateToProps = _ref2 => {
  let {
    toasts: {
      toasts
    }
  } = _ref2;
  return {
    toasts
  };
};
const mapDispatchToProps = dispatch => ({
  actions: (0, _redux.bindActionCreators)(toastsActions, dispatch)
});
var _default = exports["default"] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ToastsContainer);

/***/ }),

/***/ "./client/src/hooks/useTabContext.js":
/*!*******************************************!*\
  !*** ./client/src/hooks/useTabContext.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.TabContext = void 0;
exports.injectTabContext = injectTabContext;
exports.useTabFirstShow = useTabFirstShow;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const TabContext = exports.TabContext = _react.default.createContext(false);
function useTabContext() {
  return (0, _react.useContext)(TabContext);
}
function injectTabContext(Component) {
  return props => {
    const tabContext = useTabContext();
    return _react.default.createElement(Component, _extends({}, props, {
      tabContext: tabContext
    }));
  };
}
function useTabFirstShow(callback) {
  const tabContext = useTabContext();
  const readyToShow = !tabContext || tabContext.isOnActiveTab;
  const [shownOnce, setShownOnce] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    if (!readyToShow) {
      return;
    }
    setShownOnce(true);
    callback(tabContext);
  }, [shownOnce || readyToShow]);
}
var _default = exports["default"] = useTabContext;

/***/ }),

/***/ "./client/src/i18n.js":
/*!****************************!*\
  !*** ./client/src/i18n.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class i18n {
  constructor() {
    this.defaultLocale = 'en_US';
    this.currentLocale = null;
    this.autoDetectLocale = true;
    this.lang = {};
  }
  setLocale(locale) {
    this.currentLocale = locale;
    this.autoDetectLocale = false;
  }
  getLocale() {
    return this.currentLocale !== null ? this.currentLocale : this.defaultLocale;
  }
  _t(entity, fallbackString, priority, context) {
    const fallback = fallbackString || '';
    if (!this.lang) {
      return fallback;
    }
    const locale = this.getLocale();
    const search = [locale, locale.replace(/_[\w]+/i, ''), this.defaultLocale, this.defaultLocale.replace(/_[\w]+/i, '')];
    for (let i = 0; i < search.length; i++) {
      const lang = search[i];
      if (this.lang[lang] && this.lang[lang][entity]) {
        return this.lang[lang][entity];
      }
    }
    return fallback;
  }
  addDictionary(locale, dict) {
    if (typeof this.lang[locale] === 'undefined') {
      this.lang[locale] = {};
    }
    for (let entity in dict) {
      this.lang[locale][entity] = dict[entity];
    }
    if (this.autoDetectLocale) {
      this.currentLocale = this.detectLocale();
    }
  }
  getDictionary(locale) {
    return this.lang[locale];
  }
  stripStr(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }
  stripStrML(str) {
    const parts = str.split('\n');
    for (let i = 0; i < parts.length; i += 1) {
      parts[i] = stripStr(parts[i]);
    }
    return stripStr(parts.join(' '));
  }
  sprintf(s) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    if (params.length === 0) {
      return s;
    }
    const regx = new RegExp('(.?)(%s)', 'g');
    let i = 0;
    return s.replace(regx, function (match, subMatch1, subMatch2, offset, string) {
      if (subMatch1 === '%') {
        return match;
      }
      return subMatch1 + params[i++];
    });
  }
  inject(s, map) {
    const regx = new RegExp('\{([A-Za-z0-9_]*)\}', 'g');
    return s.replace(regx, function (match, key, offset, string) {
      return map[key] ? map[key] : match;
    });
  }
  detectLocale() {
    let rawLocale = document.documentElement.getAttribute('lang');
    if (!rawLocale) {
      rawLocale = document.body.getAttribute('lang');
    }
    if (!rawLocale) {
      const metas = document.getElementsByTagName('meta');
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].attributes['http-equiv'] && metas[i].attributes['http-equiv'].nodeValue.toLowerCase() === 'content-language') {
          rawLocale = metas[i].attributes['content'].nodeValue;
        }
      }
    }
    if (!rawLocale) {
      rawLocale = this.defaultLocale;
    }
    if (rawLocale.length === 2) {
      for (let compareLocale in this.lang) {
        if (compareLocale.substr(0, 2).toLowerCase() === rawLocale.toLowerCase()) {
          return compareLocale;
        }
      }
    }
    const rawLocaleParts = rawLocale.match(/([^-|_]*)[-|_](.*)/);
    if (rawLocaleParts) {
      return rawLocaleParts[1].toLowerCase() + '_' + rawLocaleParts[2].toUpperCase();
    }
    return null;
  }
  addEvent(obj, evType, fn, useCapture) {
    if (obj.addEventListener) {
      obj.addEventListener(evType, fn, useCapture);
      return true;
    } else if (obj.attachEvent) {
      return obj.attachEvent('on' + evType, fn);
    } else {
      console.log('Handler could not be attached');
    }
  }
}
let _i18n = new i18n();
window.ss = typeof window.ss !== 'undefined' ? window.ss : {};
window.ss.i18n = window.i18n = _i18n;
var _default = exports["default"] = _i18n;

/***/ }),

/***/ "./client/src/legacy/AddToCampaignForm.js":
/*!************************************************!*\
  !*** ./client/src/legacy/AddToCampaignForm.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FormBuilderModal = (0, _Injector.loadComponent)('FormBuilderModal');
_jquery.default.entwine('ss', $ => {
  $('.cms-content-actions .add-to-campaign-action,' + '#add-to-campaign__action').entwine({
    onclick() {
      let dialog = $('#add-to-campaign__dialog-wrapper');
      if (!dialog.length) {
        dialog = $('<div id="add-to-campaign__dialog-wrapper" />');
        $('body').append(dialog);
      }
      dialog.open();
      return false;
    }
  });
  $('.add-to-campaign-modal .add-to-campaign-modal__nav-link').entwine({
    onclick: e => {
      e.preventDefault();
      const $link = $(e.target);
      window.location = $link.attr('href');
    }
  });
  $('#add-to-campaign__dialog-wrapper').entwine({
    ReactRoot: null,
    onunmatch() {
      this._clearModal();
    },
    open() {
      this._renderModal(true);
    },
    close() {
      this._renderModal(false);
    },
    _renderModal(isOpen) {
      var _this = this;
      const handleHide = () => this.close();
      const handleSubmit = function () {
        return _this._handleSubmitModal(...arguments);
      };
      const id = $('form.cms-edit-form :input[name=ID]').val();
      const sectionConfigKey = 'SilverStripe\\CMS\\Controllers\\CMSPageEditController';
      const store = window.ss.store;
      const sectionConfig = store.getState().config.sections.find(section => section.name === sectionConfigKey);
      const modalSchemaUrl = `${sectionConfig.form.AddToCampaignForm.schemaUrl}/${id}`;
      const title = _i18n.default._t('Admin.ADD_TO_CAMPAIGN', 'Add to campaign');
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(FormBuilderModal, {
        title: title,
        isOpen: isOpen,
        onSubmit: handleSubmit,
        onClosed: handleHide,
        schemaUrl: modalSchemaUrl,
        bodyClassName: "modal__dialog",
        className: "add-to-campaign-modal",
        responseClassBad: "modal__response modal__response--error",
        responseClassGood: "modal__response modal__response--good",
        identifier: "Admin.AddToCampaign"
      }));
      this.setReactRoot(root);
    },
    _clearModal() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
    _handleSubmitModal(data, action, submitFn) {
      return submitFn();
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/ConfirmedPasswordField.js":
/*!*****************************************************!*\
  !*** ./client/src/legacy/ConfirmedPasswordField.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _jquery.default)(document).on('click', '.confirmedpassword .showOnClick a', function () {
  var $container = (0, _jquery.default)('.showOnClickContainer', (0, _jquery.default)(this).parent());
  $container.toggle('fast', function () {
    $container.toggleClass('d-none').find('input[type="hidden"]').val($container.hasClass('d-none') ? 0 : 1);
  });
  return false;
});

/***/ }),

/***/ "./client/src/legacy/DateField.js":
/*!****************************************!*\
  !*** ./client/src/legacy/DateField.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "./node_modules/moment/moment.js"));
var _modernizr = _interopRequireDefault(__webpack_require__(/*! modernizr */ "./client/src/.modernizrrc"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('input[type=date]').entwine({
    onadd() {
      if (_modernizr.default.inputtypes.date) {
        return;
      }
      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }
      const hiddenInput = $('<input/>', {
        type: 'hidden',
        name: this.attr('name'),
        value: this.val()
      });
      this.parent().append(hiddenInput);
      this.removeAttr('name');
      _moment.default.locale(this.attr('lang'));
      const isoDate = this.val();
      let localDate = '';
      if (isoDate) {
        const dateObject = (0, _moment.default)(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format('L');
        }
      }
      this.val(localDate);
      const placeholder = _i18n.default.inject(_i18n.default._t('Admin.FormatExample', 'Example: {format}'), {
        format: (0, _moment.default)().endOf('month').format('L')
      });
      this.attr('placeholder', placeholder);
      this.updateValue();
    },
    onchange() {
      this.updateValue();
    },
    updateValue() {
      const localDate = this.val();
      let isoDate = '';
      if (localDate) {
        for (const format of ['L', 'YYYY-MM-DD']) {
          const dateObject = (0, _moment.default)(localDate, format);
          if (dateObject.isValid()) {
            isoDate = dateObject.format('YYYY-MM-DD');
            break;
          }
        }
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/DatetimeField.js":
/*!********************************************!*\
  !*** ./client/src/legacy/DatetimeField.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "./node_modules/moment/moment.js"));
var _modernizr = _interopRequireDefault(__webpack_require__(/*! modernizr */ "./client/src/.modernizrrc"));
__webpack_require__(/*! ../../../thirdparty/jquery-entwine/jquery.entwine.js */ "./thirdparty/jquery-entwine/jquery.entwine.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('input[type=datetime-local]').entwine({
    onadd() {
      if (_modernizr.default.inputtypes['datetime-local']) {
        return;
      }
      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }
      const hiddenInput = $('<input/>', {
        type: 'hidden',
        name: this.attr('name'),
        value: this.val()
      });
      this.parent().append(hiddenInput);
      this.removeAttr('name');
      _moment.default.locale(this.attr('lang'));
      const isoDate = this.val();
      let localDate = '';
      if (isoDate) {
        const dateObject = (0, _moment.default)(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format('L LT');
        }
      }
      this.val(localDate);
      const placeholder = _i18n.default.inject(_i18n.default._t('Admin.FormatExample', 'Example: {format}'), {
        format: (0, _moment.default)().endOf('month').format('L LT')
      });
      this.attr('placeholder', placeholder);
      this.updateValue();
    },
    onchange() {
      this.updateValue();
    },
    updateValue() {
      const localDate = this.val();
      let isoDate = '';
      if (localDate) {
        const dateObject = (0, _moment.default)(localDate, ['L LT', _moment.default.ISO_8601]);
        if (dateObject.isValid()) {
          isoDate = dateObject.format('YYYY-MM-DDTHH:mm:ss');
        }
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/GridField.js":
/*!****************************************!*\
  !*** ./client/src/legacy/GridField.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _Search = _interopRequireDefault(__webpack_require__(/*! components/Search/Search.js */ "./client/src/components/Search/Search.js"));
var _schemaFieldValues = __webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
__webpack_require__(/*! ../../../thirdparty/jquery-ui/jquery-ui.js */ "./thirdparty/jquery-ui/jquery-ui.js");
__webpack_require__(/*! ../../../thirdparty/jquery-entwine/jquery.entwine.js */ "./thirdparty/jquery-entwine/jquery.entwine.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
_jquery.default.entwine('ss', function ($) {
  $('.grid-field').entwine({
    onmatch: function () {
      if (this.needsColumnFix()) {
        this.fixColumns();
        this.injectSearchButton(false);
      }
      if (this.hasFilters()) {
        this.injectSearchButton(true);
      }
      ;
      if (this.is('.grid-field--lazy-loadable') && (this.closest('.ss-tabset, .cms-tabset').length === 0 || this.data('gridfield-lazy-load-state') === 'force')) {
        this.data('gridfield-lazy-load-state', 'ready');
        this.lazyload();
      }
      this.data('gridfield-lazy-load-state', 'ready');
    },
    lazyload: function () {
      if (this.data('gridfield-lazy-load-state') !== 'ready') {
        this.data('gridfield-lazy-load-state', 'force');
      } else {
        this.removeClass('grid-field--lazy-loadable').addClass('grid-field--lazy-loaded');
        this.reload();
      }
    },
    reload: function (ajaxOpts, successCallback) {
      var self = this,
        form = this.closest('form'),
        focusedElName = this.find(':input:focus').attr('name'),
        data = form.find(':input:not(.grid-field__search-holder :input, .relation-search)').serializeArray(),
        tbody = this.find('tbody'),
        colspan = this.find('.grid-field__title-row th').attr('colspan');
      ;
      if (!ajaxOpts) ajaxOpts = {};
      if (!ajaxOpts.data) ajaxOpts.data = [];
      ajaxOpts.data = ajaxOpts.data.concat(data);
      if (window.location.search) {
        let searchParams = window.location.search.replace(/^\?/, '').split('&');
        for (let i = 0; i < searchParams.length; i++) {
          let parts = searchParams[i].split('=');
          if (parts.length == 2) {
            ajaxOpts.data.push({
              name: decodeURIComponent(parts[0]),
              value: decodeURIComponent(parts[1])
            });
          }
        }
      }
      tbody.find('tr').remove();
      var loadingCell = $('<td />').addClass('ss-gridfield-item loading').attr('colspan', colspan);
      tbody.append($('<tr />').append(loadingCell));
      var request = $.ajax($.extend({}, {
        headers: {
          "X-Pjax": 'CurrentField'
        },
        type: "POST",
        url: this.data('url'),
        dataType: 'html',
        success: function (data) {
          self.empty().append($(data).children());
          if (focusedElName) self.find(':input[name="' + focusedElName + '"]').focus();
          if (self.find('.grid-field__filter-header, .grid-field__search-holder').length) {
            var visible = ajaxOpts.data[0].filter === "show";
            if (self.needsColumnFix()) {
              self.fixColumns();
            }
            self.injectSearchButton(visible);
          }
          if (successCallback) successCallback.apply(this, arguments);
          self.trigger('reload', self);
          if (ajaxOpts.data[0].triggerChange !== false) {
            self.trigger('change');
          }
        },
        error: function (e) {
          alert(_i18n.default._t('Admin.ERRORINTRANSACTION'));
        },
        complete: function (request, status) {
          self.find('.loading').removeClass('loading');
        }
      }, ajaxOpts));
    },
    showDetailView: function (url, event) {
      this.openUrl(event, url, () => window.location.href = url);
    },
    openUrl: function (event, url, openInSameTabCallback) {
      if (event && (event.metaKey || event.ctrlKey || event.shiftKey)) {
        const newtab = window.open(url, '_blank');
        newtab.focus();
      } else {
        openInSameTabCallback();
      }
    },
    getItems: function () {
      return this.find('.ss-gridfield-item');
    },
    setState: function (k, v) {
      var state = this.getState();
      state[k] = v;
      this.find(':input[name="' + this.data('name') + '[GridState]"]').val(JSON.stringify(state));
    },
    getState: function () {
      const rawState = this.find(':input[name="' + this.data('name') + '[GridState]"]').val();
      if (!rawState) {
        return {};
      }
      return JSON.parse(rawState);
    },
    hasFilters: function () {
      if (this.getState().GridFieldFilterHeader) {
        return true;
      }
      return false;
    },
    needsColumnFix: function () {
      return this.find('.grid-field__filter-header, .grid-field__search-holder').length && !this.find('.grid-field__col-compact').length && !this.find('th.col-Actions').length;
    },
    fixColumns: function (visible) {
      this.find('.sortable-header').append('<th class="main col-Actions" />');
      this.find('tbody tr').each(function () {
        var cell = $(this).find('td:last');
        cell.attr('colspan', 2);
      });
      var $extraCell = $('<th class="extra" />');
      $('.grid-field__filter-header th:last .action').each(function () {
        $(this).detach();
        $extraCell.append($(this));
      });
      $('.grid-field__filter-header').append($extraCell);
    },
    injectSearchButton: function (visible) {
      const hasLegacyFilterHeader = this.find('.grid-field__filter-header').length > 0;
      let content;
      if (visible) {
        content = '<span class="non-sortable"></span>';
        this.addClass('show-filter').find('.grid-field__filter-header, .grid-field__search-holder').removeClass('grid-field__search-holder--hidden');
        if (!hasLegacyFilterHeader) {
          this.find(':button[name=showFilter]').hide();
        }
      } else {
        content = '<button type="button" title="Open search and filter" name="showFilter" class="btn btn-secondary font-icon-search btn--no-text btn--icon-lg grid-field__filter-open"></button>';
        this.removeClass('show-filter').find('.grid-field__filter-header, .grid-field__search-holder').addClass('grid-field__search-holder--hidden');
      }
      if (hasLegacyFilterHeader) {
        this.find('.sortable-header th:last').html(content);
      }
    },
    keepStateInHistory: function () {
      const newSchema = $(this).find('.gridfield-actionmenu__container').data('schema');
      const gridFieldName = $(this).data('name');
      if (newSchema && newSchema.length > 0) {
        newSchema.filter(e => {
          if (e.type === 'link') {
            const urlQueryString = this.buildUrlQueryString(e.url, gridFieldName);
            const url = window.location.pathname + urlQueryString;
            window.ss.router.replace(url, undefined, undefined, false);
          }
        });
      }
    },
    buildUrlQueryString: function (pjaxUrl, gridFieldName) {
      const locationObj = {};
      for (const param of window.location.search.replace(/^\?/, '').split('&')) {
        const [key, val] = param.split('=');
        if (key.match(new RegExp(`^gridState\\-${gridFieldName}\\-[0-9]$`))) {
          continue;
        }
        locationObj[key] = val;
      }
      const pjaxUrlObj = {};
      const link = [window.location.origin, pjaxUrl].join('/');
      const searchParams = new URL(link).searchParams;
      for (const [key, val] of searchParams.entries()) {
        pjaxUrlObj[key] = val;
      }
      const retObj = Object.assign(locationObj, pjaxUrlObj);
      const retArr = [];
      for (const key in retObj) {
        if (key === '') {
          continue;
        }
        const val = encodeURIComponent(retObj[key]);
        retArr.push([key, val].join('='));
      }
      return retArr.length === 0 ? '' : '?' + retArr.join('&');
    }
  });
  $('.grid-field *').entwine({
    getGridField: function () {
      return this.closest('.grid-field');
    }
  });
  $('.gridfield-actionmenu__container').entwine({
    Timer: null,
    Component: null,
    Actions: null,
    ReactRoot: null,
    onmatch() {
      this._super();
      let actions = [];
      $('.action-menu--handled', this.parent()).each(function () {
        const action = $(this).detach();
        actions.push(action);
      });
      this.setActions(actions);
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? {
        context: cmsContent
      } : {};
      const GridFieldActions = (0, _Injector.loadComponent)('GridFieldActions', context);
      this.setComponent(GridFieldActions);
      this.refresh();
    },
    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
      const actions = this.getActions();
      const actionContainer = this.parent();
      if (actions) {
        $(actions).each(function () {
          $(this).appendTo(actionContainer);
        });
      }
    },
    refresh() {
      const schema = this.data('schema');
      const GridFieldActions = this.getComponent();
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(GridFieldActions, {
        schema: schema
      }));
      this.setReactRoot(root);
    }
  });
  $('.grid-field :button[name=showFilter]').entwine({
    onclick: function (e) {
      this.closest('.grid-field').find('.grid-field__filter-header, .grid-field__search-holder').removeClass('grid-field__search-holder--hidden').find(':input:first').focus();
      this.closest('.grid-field').addClass('show-filter');
      this.parent().html('<span class="non-sortable"></span>');
      e.preventDefault();
    }
  });
  $('.grid-field .ss-gridfield-item').entwine({
    onclick: function (event) {
      if (event.target.classList.contains('action-menu__toggle')) {
        this._super(event);
        return false;
      }
      if ($(event.target).closest('.action').length) {
        this._super(event);
        return false;
      }
      var formLink = this.find('.edit-link, .view-link');
      if (formLink.length) {
        this.getGridField().showDetailView(formLink.prop('href'), event);
      }
    },
    onmouseover: function () {
      if (this.find('.edit-link, .view-link').length) this.css('cursor', 'pointer');
    },
    onmouseout: function () {
      this.css('cursor', 'default');
    }
  });
  $('.grid-field .action.action_import:button').entwine({
    onclick: function (e) {
      e.preventDefault();
      this.openmodal();
    },
    onmatch: function () {
      this._super();
      if (this.data('state') === 'open') {
        this.openmodal();
      }
    },
    onunmatch: function () {
      this._super();
    },
    openmodal: function () {
      let modal = $(this.data('target'));
      let newModal = $(this.data('modal'));
      if (modal.length < 1) {
        modal = newModal;
        modal.appendTo(document.body);
      } else {
        modal.innerHTML = newModal.innerHTML;
      }
      let backdrop = $('.modal-backdrop');
      if (backdrop.length < 1) {
        backdrop = $('<div class="modal-backdrop fade"></div>');
        backdrop.appendTo(document.body);
      }
      function closeModal() {
        backdrop.removeClass('show');
        modal.removeClass('show');
        setTimeout(function () {
          backdrop.remove();
        }, 150);
      }
      modal.find('[data-dismiss]').add('.modal-backdrop').on('click', function () {
        closeModal();
      });
      $(document).on('keydown', function (e) {
        if (e.keyCode === 27) {
          closeModal();
        }
      });
      setTimeout(function () {
        backdrop.addClass('show');
        modal.addClass('show');
      }, 0);
    }
  });
  $('.grid-field .action:button').entwine({
    onclick: function (e) {
      var filterState = 'show';
      let triggerChange = true;
      if (this.is(':disabled')) {
        e.preventDefault();
        return;
      }
      if (this.hasClass('ss-gridfield-button-close') || !this.closest('.grid-field').hasClass('show-filter')) {
        filterState = 'hidden';
      }
      if (this.hasClass('ss-gridfield-pagination-action') || this.hasClass('grid-field__sort')) {
        triggerChange = false;
      }
      var data = [{
        name: this.attr('name'),
        value: this.val(),
        filter: filterState,
        triggerChange
      }];
      var actionState = this.data('action-state');
      if (actionState) {
        data.push({
          name: 'ActionState',
          value: JSON.stringify(actionState)
        });
      }
      const gridField = $(this).getGridField();
      const successCallback = function (data, status, response) {
        gridField.keepStateInHistory();
        const messageText = response.getResponseHeader('X-Message-Text');
        const messageType = response.getResponseHeader('X-Message-Type');
        if (messageText && messageType) {
          var formEditError = $("#Form_EditForm_error");
          formEditError.addClass(messageType);
          formEditError.html(messageText);
          formEditError.show();
        }
      };
      gridField.reload({
        data
      }, successCallback);
      e.preventDefault();
    },
    actionurl: function () {
      var btn = this.closest(':button'),
        grid = this.getGridField(),
        form = this.closest('form'),
        data = form.find(':input.gridstate').serialize(),
        csrf = form.find('input[name="SecurityID"]').val();
      data += "&" + encodeURIComponent(btn.attr('name')) + '=' + encodeURIComponent(btn.val());
      if (csrf) {
        data += "&SecurityID=" + encodeURIComponent(csrf);
      }
      var actionState = this.data('action-state');
      if (actionState) {
        data += '&ActionState=' + encodeURIComponent(JSON.stringify(actionState));
      }
      if (window.location.search) {
        data = window.location.search.replace(/^\?/, '') + '&' + data;
      }
      var connector = grid.data('url').indexOf('?') == -1 ? '?' : '&';
      return $.path.makeUrlAbsolute(grid.data('url') + connector + data, $('base').attr('href'));
    }
  });
  $('.grid-field .add-existing-autocompleter').entwine({
    onbuttoncreate: function () {
      var self = this;
      this.toggleDisabled();
      this.find('input[type="text"]').on('keyup', function () {
        self.toggleDisabled();
      });
    },
    onunmatch: function () {
      this.find('input[type="text"]').off('keyup');
    },
    toggleDisabled: function () {
      var $button = this.find('.ss-ui-button'),
        $input = this.find('input[type="text"]'),
        inputHasValue = $input.val() !== '',
        buttonDisabled = $button.is(':disabled');
      if (inputHasValue && buttonDisabled || !inputHasValue && !buttonDisabled) {
        $button.attr("disabled", !buttonDisabled);
      }
    }
  });
  $('.grid-field .grid-field__col-compact .action--delete, .grid-field .grid-field__col-compact .action--archive, .cms-edit-form .btn-toolbar .action--delete, .cms-edit-form .btn-toolbar .action--archive, .grid-field__col-compact .gridfield-button-unlink').entwine({
    onclick: function (e) {
      const confirmMessage = $(this).hasClass('action--archive') ? _i18n.default._t('Admin.ARCHIVECONFIRMMESSAGE', 'Are you sure you want to archive this record?') : _i18n.default._t('Admin.DELETECONFIRMMESSAGE', 'Are you sure you want to delete this record?');
      if (!confirm(confirmMessage)) {
        e.preventDefault();
        return false;
      } else {
        this._super(e);
      }
      const toastNotificationMessage = $(this).hasClass('action--archive') ? ss.i18n._t('Admin.ARCHIVE_CONFIRM_MESSAGE', 'Archived') : ss.i18n._t('Admin.DELETE_CONFIRM_MESSAGE', 'Deleted');
      if ($(this).hasClass('dropdown-item')) {
        jQuery.noticeAdd({
          text: toastNotificationMessage,
          type: 'success',
          stayTime: 5000,
          inEffect: {
            left: '0',
            opacity: 'show'
          }
        });
      }
    }
  });
  $('.grid-field .grid-print-button.action:button').entwine({
    UUID: null,
    onmatch: function () {
      this._super();
      this.setUUID(new Date().getTime());
    },
    onunmatch: function () {
      this._super();
    },
    onclick: function (e) {
      var url = this.actionurl();
      window.open(url);
      e.preventDefault();
      return false;
    }
  });
  $('.ss-gridfield-print-iframe').entwine({
    onmatch: function () {
      this._super();
      this.hide().on('load', function () {
        this.focus();
        var ifWin = this.contentWindow || this;
        ifWin.print();
      });
    },
    onunmatch: function () {
      this._super();
    }
  });
  $('.grid-field .action.no-ajax, .grid-field .no-ajax .action:button').entwine({
    onclick: function (event) {
      const url = this.actionurl();
      this.getGridField().openUrl(event, url, () => window.location.href = url);
      event.preventDefault();
      return false;
    }
  });
  $('.grid-field .action-detail').entwine({
    onclick: function (event) {
      this.getGridField().showDetailView($(this).prop('href'), event);
      return false;
    }
  });
  $('.grid-field[data-selectable]').entwine({
    getSelectedItems: function () {
      return this.find('.ss-gridfield-item.ui-selected');
    },
    getSelectedIDs: function () {
      return $.map(this.getSelectedItems(), function (el) {
        return $(el).data('id');
      });
    }
  });
  $('.grid-field[data-selectable] .ss-gridfield-items').entwine({
    onadd: function () {
      this._super();
      this.selectable();
    },
    onremove: function () {
      this._super();
      if (this.data('selectable')) this.selectable('destroy');
    }
  });
  $('.js-injector-boot .grid-field .grid-field__search-holder').entwine({
    Component: null,
    ReactRoot: null,
    onmatch() {
      this._super();
      this.prependTo(this.parent());
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? {
        context: cmsContent
      } : {};
      const Search = (0, _Injector.loadComponent)('Search', context);
      this.setComponent(Search);
      this.refresh();
    },
    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
    close() {
      const props = this.data('schema');
      const ajaxData = [{
        name: props.clearAction,
        value: '',
        filter: 'hidden',
        triggerChange: false
      }];
      if (props.clearActionState) {
        ajaxData.push({
          name: 'ActionState',
          value: props.clearActionState
        });
      }
      const gridField = $(this).getGridField();
      const successCallback = function () {
        gridField.keepStateInHistory();
      };
      gridField.reload({
        data: ajaxData
      }, successCallback);
    },
    search(data) {
      const props = this.data('schema');
      const ajaxData = [{
        name: props.searchAction,
        value: '',
        filter: 'show',
        triggerChange: false
      }];
      if (props.searchActionState) {
        ajaxData.push({
          name: 'ActionState',
          value: props.searchActionState
        });
      }
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          const name = `filter[${props.gridfield}][${key}]`;
          ajaxData.push({
            name,
            value
          });
        }
      }
      const gridField = $(this).getGridField();
      const successCallback = function () {
        gridField.keepStateInHistory();
      };
      gridField.reload({
        data: ajaxData
      }, successCallback);
    },
    refresh() {
      const props = this.data('schema');
      const Search = this.getComponent();
      const handleHide = () => this.close();
      const handleSearch = data => this.search(data);
      const idName = String(props.gridfield).replace(/\-/g, '.');
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(Search, _extends({
        id: `${props.gridfield}Search`,
        display: "VISIBLE",
        displayBehavior: "HIDEABLE",
        filterPrefix: "Search__",
        onHide: handleHide,
        onSearch: handleSearch
      }, props)));
      this.setReactRoot(root);
    }
  });
  $('.js-injector-boot .grid-field .search-box__content-field').entwine({
    onkeydown: function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }
  });
  $('.grid-field .grid-field__filter-header :input').entwine({
    onmatch: function () {
      var filterbtn = this.closest('.extra').find('.ss-gridfield-button-filter'),
        resetbtn = this.closest('.extra').find('.ss-gridfield-button-reset');
      if (this.val()) {
        filterbtn.addClass('filtered');
        resetbtn.addClass('filtered');
      }
      this._super();
    },
    onunmatch: function () {
      this._super();
    },
    onkeydown: function (e) {
      if (this.closest('.ss-gridfield-button-reset').length) return;
      var filterbtn = this.closest('.extra').find('.ss-gridfield-button-filter'),
        resetbtn = this.closest('.extra').find('.ss-gridfield-button-reset');
      if (e.keyCode == '13') {
        var btns = this.closest('.grid-field__filter-header').find('.ss-gridfield-button-filter');
        var filterState = 'show';
        if (this.hasClass('ss-gridfield-button-close') || !this.closest('.grid-field').hasClass('show-filter')) {
          filterState = 'hidden';
        }
        var ajaxData = [{
          name: btns.attr('name'),
          value: btns.val(),
          filter: filterState,
          triggerChange: false
        }];
        if (btns.data('action-state')) {
          ajaxData.push({
            name: 'ActionState',
            value: JSON.stringify(btns.data('action-state'))
          });
        }
        const gridField = $(this).getGridField();
        const successCallback = function () {
          gridField.keepStateInHistory();
        };
        gridField.reload({
          data: ajaxData
        }, successCallback);
        return false;
      } else {
        filterbtn.addClass('hover-alike');
        resetbtn.addClass('hover-alike');
      }
    }
  });
  $(".grid-field .relation-search").entwine({
    onfocusin: function (event) {
      this.autocomplete({
        source: function (request, response) {
          var searchField = $(this.element);
          var form = $(this.element).closest("form");
          $.ajax({
            headers: {
              "X-Pjax": 'Partial'
            },
            dataType: 'json',
            type: "GET",
            url: $(searchField).data('searchUrl'),
            data: encodeURIComponent(searchField.attr('name')) + '=' + encodeURIComponent(searchField.val()),
            success: response,
            error: function (e) {
              alert(_i18n.default._t('Admin.ERRORINTRANSACTION', 'An error occured while fetching data from the server\n Please try again later.'));
            }
          });
        },
        select: function (event, ui) {
          var hiddenField = $('<input type="hidden" name="relationID" class="action_gridfield_relationfind no-change-track" />');
          hiddenField.val(ui.item.id);
          $(this).closest(".grid-field").find(".action_gridfield_relationfind").replaceWith(hiddenField);
          var addbutton = $(this).closest(".grid-field").find(".action_gridfield_relationadd");
          addbutton.removeAttr('disabled');
        }
      });
    }
  });
  $(".grid-field .pagination-page-number input").entwine({
    onkeydown: function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        var newpage = parseInt($(this).val(), 10);
        var gridfield = $(this).getGridField();
        gridfield.setState('GridFieldPaginator', {
          currentPage: newpage
        });
        const successCallback = function () {
          gridfield.keepStateInHistory();
        };
        gridfield.reload({}, successCallback);
        return false;
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/HtmlEditorField.js":
/*!**********************************************!*\
  !*** ./client/src/legacy/HtmlEditorField.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
__webpack_require__(/*! events-polyfill */ "./node_modules/events-polyfill/index.js");
var _lodash = _interopRequireDefault(__webpack_require__(/*! lodash.escaperegexp */ "./node_modules/lodash.escaperegexp/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var ss = typeof window.ss !== 'undefined' ? window.ss : {};
ss.editorWrappers = {};
ss.editorWrappers.tinyMCE = function () {
  var editorID;
  return {
    init: function (ID) {
      editorID = ID;
      this.create();
    },
    destroy: function () {
      tinymce.EditorManager.execCommand('mceRemoveEditor', false, editorID);
    },
    getInstance: function () {
      return tinymce.EditorManager.get(editorID);
    },
    onopen: function () {},
    onclose: function () {},
    setHeight: function (event, height) {
      if (typeof height === 'undefined') {
        return;
      }
      if (event.target && event.target.iframeElement) {
        event.target.iframeElement.height = height !== '' ? 'auto' : height;
        const parentDiv = event.target.iframeElement.closest('.tox-sidebar-wrap');
        if (parentDiv) {
          parentDiv.style.height = height;
        }
      }
    },
    getConfig: function () {
      var selector = "#" + editorID,
        config = (0, _jquery.default)(selector).data('config'),
        height = config.row_height ? config.row_height : undefined,
        self = this;
      config.selector = selector;
      config.setup = function (ed) {
        ed.on('change', function () {
          self.save();
        });
        ed.on('init', event => {
          self.setHeight(event, height);
        });
        ed.on('ResizeEditor', event => {
          self.setHeight(event, '');
        });
      };
      return config;
    },
    save: function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var instance = this.getInstance();
      instance.save();
      if (!options.silent) {
        (0, _jquery.default)(instance.getElement()).trigger("change");
        instance.getElement().dispatchEvent(new Event('input', {
          bubbles: true
        }));
      }
    },
    create: function () {
      let timeLastScrolled;
      let showAfterScrollFunc;
      let initialOffset;
      function showAfterScroll(panel, initialOffset) {
        const finalOffset = $(panel).scrollTop();
        $('.mce-floatpanel').each((i, el) => {
          const oldPosition = parseFloat(el.style.top);
          $(el).css('top', `${oldPosition - (finalOffset - initialOffset)}px`);
        });
        $('.mce-floatpanel').css('opacity', '1');
        timeLastScrolled = undefined;
      }
      ;
      function hideOnScroll(e) {
        const panel = e.target;
        if (!timeLastScrolled || (new Date() - timeLastScrolled) / 100 > 500) {
          initialOffset = $(panel).scrollTop();
          $('.mce-floatpanel').css('opacity', '0');
        } else {
          window.clearTimeout(showAfterScrollFunc);
        }
        timeLastScrolled = new Date();
        showAfterScrollFunc = window.setTimeout(() => showAfterScroll(panel, initialOffset), 500);
      }
      var config = this.getConfig();
      if (typeof config.baseURL !== 'undefined') {
        tinymce.EditorManager.baseURL = config.baseURL;
      }
      config.skin = config.skin || 'silverstripe';
      tinymce.init(config).then(editors => {
        if (editors.length > 0 && editors[0].container) {
          const scrollPanel = $(editors[0].container).closest('.panel--scrollable');
          scrollPanel.on('scroll', e => hideOnScroll(e));
        }
      });
    },
    repaint: function () {},
    isDirty: function () {
      return this.getInstance().isDirty();
    },
    getContent: function () {
      return this.getInstance().getContent();
    },
    getSelection: function () {
      const instance = this.getInstance();
      let selection = instance.selection.getSel().toString();
      return selection || '';
    },
    getDOM: function () {
      return this.getInstance().getElement();
    },
    getContainer: function () {
      return this.getInstance().getContainer();
    },
    getSelectedNode: function () {
      return this.getInstance().selection.getNode();
    },
    selectNode: function (node) {
      this.getInstance().selection.select(node);
    },
    setContent: function (html, opts) {
      this.getInstance().setContent(html, opts);
    },
    insertContent: function (html, opts) {
      this.getInstance().insertContent(html, opts);
    },
    replaceContent: function (html, opts) {
      this.getInstance().execCommand('mceReplaceContent', false, html, opts);
    },
    insertLink: function (attrs, opts, linkText) {
      if (linkText) {
        linkText = linkText.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        const linkEl = this.getInstance().dom.create('a', attrs, linkText);
        this.getInstance().selection.setNode(linkEl);
      } else {
        this.getInstance().execCommand("mceInsertLink", false, attrs, opts);
      }
    },
    removeLink: function () {
      this.getInstance().execCommand('unlink', false);
    },
    cleanLink: function (href, node) {
      var settings = this.getConfig,
        cb = settings['urlconverter_callback'],
        cu = tinyMCE.settings['convert_urls'];
      if (cb) href = eval(cb + "(href, node, true);");
      if (cu && href.match(new RegExp('^' + (0, _lodash.default)(tinyMCE.settings['document_base_url']) + '(.*)$'))) {
        href = RegExp.$1;
      }
      if (href.match(/^javascript:\s*mctmp/)) href = '';
      return href;
    },
    createBookmark: function () {
      return this.getInstance().selection.getBookmark();
    },
    moveToBookmark: function (bookmark) {
      this.getInstance().selection.moveToBookmark(bookmark);
      this.getInstance().focus();
    },
    blur: function () {
      this.getInstance().selection.collapse();
    },
    addUndo: function () {
      this.getInstance().undoManager.add();
    }
  };
};
ss.editorWrappers['default'] = ss.editorWrappers.tinyMCE;
_jquery.default.entwine('ss', function ($) {
  $('textarea.htmleditor').entwine({
    Editor: null,
    onadd: function () {
      var edClass = this.data('editor') || 'default',
        ed = ss.editorWrappers[edClass]();
      this.setEditor(ed);
      ed.init(this.attr('id'));
      this._super();
    },
    onmatch: function () {
      if (!this.getEditor()) {
        this.onadd();
      }
      this._super();
    },
    onremove: function () {
      this.getEditor().destroy();
      this._super();
    },
    onunmatch: function () {
      if (this.getEditor()) {
        this.onremove();
      }
      this._super();
    },
    'from .cms-edit-form': {
      onbeforesubmitform: function () {
        this.getEditor().save({
          silent: true
        });
        this._super();
      }
    },
    openLinkDialog: function () {
      this.openDialog('link');
    },
    openMediaDialog: function () {
      this.openDialog('media');
    },
    openEmbedDialog: function () {
      this.openDialog('embed');
    },
    openDialog: function (type) {
      if (type === 'media' && window.InsertMediaModal) {
        let dialog = $('#insert-media-react__dialog-wrapper');
        if (!dialog.length) {
          dialog = $('<div id="insert-media-react__dialog-wrapper" class="insert-link__dialog-wrapper" />');
          $('body').append(dialog);
        }
        dialog.setElement(this);
        dialog.open();
        return;
      }
      if (type === 'embed' && window.InsertEmbedModal) {
        let dialog = $('#insert-embed-react__dialog-wrapper');
        if (!dialog.length) {
          dialog = $('<div id="insert-embed-react__dialog-wrapper" />');
          $('body').append(dialog);
        }
        dialog.setElement(this);
        dialog.open();
        return;
      }
      throw new Error(`Dialog named ${type} is not available.`);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.ActionTabSet.js":
/*!*******************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.ActionTabSet.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.ss-tabset.ss-ui-action-tabset').entwine({
    IgnoreTabState: true,
    onadd: function () {
      this._super();
      this.tabs({
        'collapsible': true,
        'active': false
      });
    },
    onremove: function () {
      var frame = $('.cms-container').find('iframe');
      frame.each(function (index, iframe) {
        try {
          $(iframe).contents().off('click.ss-ui-action-tabset');
        } catch (e) {
          console.warn('Unable to access iframe, possible https mis-match');
        }
      });
      $(document).off('click.ss-ui-action-tabset');
      this._super();
    },
    'ontabsbeforeactivate': function (event, ui) {
      this.riseUp(event, ui);
    },
    onclick: function (event, ui) {
      this.attachCloseHandler(event, ui);
    },
    attachCloseHandler: function (event, ui) {
      var that = this,
        frame = $('.cms-container').find('iframe'),
        closeHandler;
      closeHandler = function (event) {
        var panel, frame;
        panel = $(event.target).closest('.ss-ui-action-tabset .ui-tabs-panel');
        if (!$(event.target).closest(that).length && !panel.length) {
          that.tabs('option', 'active', false);
          frame = $('.cms-container').find('iframe');
          frame.each(function (index, iframe) {
            $(iframe).contents().off('click.ss-ui-action-tabset', closeHandler);
          });
          $(document).off('click.ss-ui-action-tabset', closeHandler);
        }
      };
      $(document).on('click.ss-ui-action-tabset', closeHandler);
      if (frame.length > 0) {
        frame.each(function (index, iframe) {
          $(iframe).contents().on('click.ss-ui-action-tabset', closeHandler);
        });
      }
    },
    riseUp: function (event, ui) {
      var elHeight, trigger, endOfWindow, elPos, activePanel, activeTab, topPosition, containerSouth, padding;
      elHeight = $(this).find('.ui-tabs-panel').outerHeight();
      trigger = $(this).find('.ui-tabs-nav').outerHeight();
      endOfWindow = $(window).height() + $(document).scrollTop() - trigger;
      elPos = $(this).find('.ui-tabs-nav').offset().top;
      activePanel = ui.newPanel;
      activeTab = ui.newTab;
      if (elPos + elHeight >= endOfWindow && elPos - elHeight > 0) {
        this.addClass('rise-up');
        if (activeTab.position() !== null) {
          topPosition = -activePanel.outerHeight();
          containerSouth = activePanel.parents('.toolbar--south');
          if (containerSouth) {
            const offset = activeTab.offset();
            padding = offset ? offset.top - containerSouth.offset().top : 0;
            topPosition = topPosition - padding;
          }
          $(activePanel).css('top', topPosition + "px");
        }
      } else {
        this.removeClass('rise-up');
        if (activeTab.position() !== null) {
          $(activePanel).css('bottom', '100%');
        }
      }
      return false;
    }
  });
  $('.cms-content-actions .ss-tabset.ss-ui-action-tabset').entwine({
    'ontabsbeforeactivate': function (event, ui) {
      this._super(event, ui);
      if ($(ui.newPanel).length > 0) {
        $(ui.newPanel).css('left', ui.newTab.position().left + "px");
      }
    }
  });
  $('.cms-actions-row.ss-tabset.ss-ui-action-tabset').entwine({
    'ontabsbeforeactivate': function (event, ui) {
      this._super(event, ui);
      $(this).closest('.ss-ui-action-tabset').removeClass('tabset-open tabset-open-last');
    }
  });
  $('.cms-content-fields .ss-tabset.ss-ui-action-tabset').entwine({
    'ontabsbeforeactivate': function (event, ui) {
      this._super(event, ui);
      if ($(ui.newPanel).length > 0) {
        if ($(ui.newTab).hasClass("last")) {
          $(ui.newPanel).css({
            'left': 'auto',
            'right': '0px'
          });
          $(ui.newPanel).parent().addClass('tabset-open-last');
        } else {
          $(ui.newPanel).css('left', ui.newTab.position().left + "px");
          if ($(ui.newTab).hasClass("first")) {
            $(ui.newPanel).css('left', "0px");
            $(ui.newPanel).parent().addClass('tabset-open');
          }
        }
      }
    }
  });
  $('.cms-tree-view-sidebar .cms-actions-row.ss-tabset.ss-ui-action-tabset').entwine({
    'from .ui-tabs-nav li': {
      onhover: function (e) {
        $(e.target).parent().find('li .active').removeClass('active');
        $(e.target).find('a').addClass('active');
      }
    },
    'ontabsbeforeactivate': function (event, ui) {
      this._super(event, ui);
      $(ui.newPanel).css({
        'left': 'auto',
        'right': 'auto'
      });
      if ($(ui.newPanel).length > 0) {
        $(ui.newPanel).parent().addClass('tabset-open');
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.BatchActions.js":
/*!*******************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.BatchActions.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss.tree', function ($) {
  $('#Form_BatchActionsForm').entwine({
    Actions: [],
    getTree: function () {
      return $('.cms-tree');
    },
    fromTree: {
      oncheck_node: function (e, data) {
        this.serializeFromTree();
      },
      onuncheck_node: function (e, data) {
        this.serializeFromTree();
      }
    },
    onmatch: function () {
      var self = this;
      self.getTree().on('load_node.jstree', function (e, data) {
        self.refreshSelected();
      });
    },
    onunmatch: function () {
      var self = this;
      self.getTree().off('load_node.jstree');
    },
    registerDefault: function () {
      this.register('publish', function (ids) {
        var confirmed = confirm(_i18n.default.inject(_i18n.default._t("Admin.BATCH_PUBLISH_PROMPT", "You have {num} page(s) selected.\n\nDo you really want to publish?"), {
          'num': ids.length
        }));
        return confirmed ? ids : false;
      });
      this.register('unpublish', function (ids) {
        var confirmed = confirm(_i18n.default.inject(_i18n.default._t("Admin.BATCH_UNPUBLISH_PROMPT", "You have {num} page(s) selected.\n\nDo you really want to unpublish"), {
          'num': ids.length
        }));
        return confirmed ? ids : false;
      });
      this.register('delete', function (ids) {
        var confirmed = confirm(_i18n.default.inject(_i18n.default._t("Admin.BATCH_DELETE_PROMPT", "You have {num} page(s) selected.\n\nAre you sure you want to delete these pages?\n\nThese pages and all of their children pages will be deleted and sent to the archive."), {
          'num': ids.length
        }));
        return confirmed ? ids : false;
      });
      this.register('restore', function (ids) {
        var confirmed = confirm(_i18n.default.inject(_i18n.default._t("Admin.BATCH_RESTORE_PROMPT", "You have {num} page(s) selected.\n\nDo you really want to restore to stage?\n\nChildren of archived pages will be restored to the root level, unless those pages are also being restored."), {
          'num': ids.length
        }));
        return confirmed ? ids : false;
      });
    },
    onadd: function () {
      this.registerDefault();
      this._super();
    },
    register: function (type, callback) {
      this.trigger('register', {
        type: type,
        callback: callback
      });
      var actions = this.getActions();
      actions[type] = callback;
      this.setActions(actions);
    },
    unregister: function (type) {
      this.trigger('unregister', {
        type: type
      });
      var actions = this.getActions();
      if (actions[type]) delete actions[type];
      this.setActions(actions);
    },
    refreshSelected: function (rootNode) {
      var self = this,
        st = this.getTree(),
        ids = this.getIDs(),
        allIds = [],
        viewMode = $('.cms-content-batchactions-button'),
        actionUrl = this.find(':input[name=Action]').val();
      if (rootNode == null) rootNode = st;
      for (var idx in ids) {
        $($(st).getNodeByID(idx)).addClass('selected').attr('selected', 'selected');
      }
      if (!actionUrl || actionUrl == -1 || !viewMode.hasClass('active')) {
        $(rootNode).find('li').each(function () {
          $(this).setEnabled(true);
        });
        return;
      }
      $(rootNode).find('li').each(function () {
        allIds.push($(this).data('id'));
        $(this).addClass('treeloading').setEnabled(false);
      });
      var actionUrlParts = $.path.parseUrl(actionUrl);
      var applicablePagesUrl = actionUrlParts.hrefNoSearch + '/applicablepages/';
      applicablePagesUrl = $.path.addSearchParams(applicablePagesUrl, actionUrlParts.search);
      applicablePagesUrl = $.path.addSearchParams(applicablePagesUrl, {
        csvIDs: allIds.join(',')
      });
      jQuery.getJSON(applicablePagesUrl, function (applicableIDs) {
        jQuery(rootNode).find('li').each(function () {
          $(this).removeClass('treeloading');
          var id = $(this).data('id');
          if (id == 0 || $.inArray(id, applicableIDs) >= 0) {
            $(this).setEnabled(true);
          } else {
            $(this).removeClass('selected').setEnabled(false);
            $(this).prop('selected', false);
          }
        });
        self.serializeFromTree();
      });
    },
    serializeFromTree: function () {
      var tree = this.getTree(),
        ids = tree.getSelectedIDs();
      this.setIDs(ids);
      return true;
    },
    setIDs: function (ids) {
      this.find(':input[name=csvIDs]').val(ids ? ids.join(',') : null);
    },
    getIDs: function () {
      var value = this.find(':input[name=csvIDs]').val();
      return value ? value.split(',') : [];
    },
    onsubmit: function (e) {
      var self = this,
        ids = this.getIDs(),
        tree = this.getTree(),
        actions = this.getActions();
      if (!ids || !ids.length) {
        alert(_i18n.default._t('Admin.SELECTONEPAGE', 'Please select at least one page'));
        e.preventDefault();
        return false;
      }
      var actionURL = this.find(':input[name=Action]').val();
      if (!actionURL) {
        e.preventDefault();
        return false;
      }
      var type = actionURL.split('/').filter(n => !!n).pop();
      if (actions[type]) {
        ids = actions[type].apply(this, [ids]);
      }
      if (!ids || !ids.length) {
        e.preventDefault();
        return false;
      }
      this.setIDs(ids);
      tree.find('li').removeClass('failed');
      var button = this.find(':submit:first');
      button.addClass('loading');
      jQuery.ajax({
        url: actionURL,
        type: 'POST',
        data: this.serializeArray(),
        complete: function (xmlhttp, status) {
          button.removeClass('loading');
          tree.jstree('refresh', -1);
          self.setIDs([]);
          self.find(':input[name=Action]').val('').change();
          var msg = xmlhttp.getResponseHeader('X-Status');
          if (msg) statusMessage(decodeURIComponent(msg), status === 'success' ? 'success' : 'error');
        },
        success: function (data, status) {
          var id, node;
          if (data.modified) {
            var modifiedNodes = [];
            for (id in data.modified) {
              node = tree.getNodeByID(id);
              tree.jstree('set_text', node, data.modified[id]['TreeTitle']);
              modifiedNodes.push(node);
            }
            $(modifiedNodes).effect('highlight');
          }
          if (data.deleted) {
            for (id in data.deleted) {
              node = tree.getNodeByID(id);
              if (node.length) tree.jstree('delete_node', node);
            }
          }
          if (data.error) {
            for (id in data.error) {
              node = tree.getNodeByID(id);
              $(node).addClass('failed');
            }
          }
        },
        dataType: 'json'
      });
      e.preventDefault();
      return false;
    }
  });
  $('.cms-content-batchactions-button').entwine({
    onmatch: function () {
      this._super();
      this.updateTree();
    },
    onunmatch: function () {
      this._super();
    },
    onclick: function (e) {
      this.updateTree();
    },
    updateTree: function () {
      var tree = $('.cms-tree'),
        form = $('#Form_BatchActionsForm');
      this._super();
      if (this.data('active')) {
        tree.addClass('multiple');
        tree.removeClass('draggable');
        form.serializeFromTree();
      } else {
        tree.removeClass('multiple');
        tree.addClass('draggable');
      }
      $('#Form_BatchActionsForm').refreshSelected();
    }
  });
  $('#Form_BatchActionsForm select[name=Action]').entwine({
    onchange: function (e) {
      const form = $(e.target.form);
      const btn = form.find(':submit');
      const selected = $(e.target).val();
      if (selected) {
        const actionUrlParts = selected.split('/');
        const actionName = actionUrlParts[actionUrlParts.length - 1];
        $('#Form_BatchActionsForm').refreshSelected();
        var parameterFields = $('#BatchActionParameters_' + actionName);
        if (parameterFields.length) {
          parameterFields.find(':input').each(function () {
            var input = $(this)[0];
            if (input.tagName === 'SELECT') {
              input.selectedIndex = -1;
              $(this).trigger('chosen:updated');
            } else if (input.type === 'checkbox') {
              input.checked = input.defaultChecked;
            } else {
              input.value = input.defaultValue;
            }
          });
          parameterFields.siblings().hide();
          parameterFields.show();
          $('#BatchActionParameters').slideDown();
        } else {
          $('#BatchActionParameters').slideUp();
        }
      }
      this.trigger('chosen:updated');
      this._super(e);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Content.js":
/*!**************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.Content.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.cms-content').entwine({
    onadd: function () {
      var self = this;
      this.find('.cms-tabset').redrawTabs();
      this._super();
    },
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
      this.add(this.find('.cms-tabset')).redrawTabs();
      this.find('.cms-content-header').redraw();
      this.find('.cms-content-actions').redraw();
    }
  });
  $('.cms-content .cms-tree').entwine({
    onadd: function () {
      var self = this;
      this._super();
      this.on('select_node.jstree', function (e, data) {
        var node = data.rslt.obj,
          loadedNodeID = self.find(':input[name=ID]').val(),
          origEvent = data.args[2],
          container = $('.cms-container');
        if (!origEvent) {
          return false;
        }
        if ($(node).hasClass('disabled')) return false;
        if ($(node).data('id') == loadedNodeID) return;
        var url = $(node).find('a:first').attr('href');
        if (url && url != '#') {
          url = url.split('?')[0];
          self.jstree('deselect_all');
          self.jstree('uncheck_all');
          if ($.path.isExternal($(node).find('a:first'))) url = url = $.path.makeUrlAbsolute(url, $('base').attr('href'));
          if (document.location.search) url = $.path.addSearchParams(url, document.location.search.replace(/^\?/, ''));
          container.loadPanel(url);
        } else {
          self.removeForm();
        }
      });
    }
  });
  $('.cms-content .cms-content-fields').entwine({
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
    }
  });
  $('.cms-content .cms-content-actions').entwine({
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
      this.height('auto');
      const paddingTop = parseInt(this.css('padding-top'), 10);
      const paddingBottom = parseInt(this.css('padding-bottom'), 10);
      this.height(this.innerHeight() - paddingTop - paddingBottom);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.EditForm.js":
/*!***************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.EditForm.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const currBeforeUnload = window.onbeforeunload;
window.onbeforeunload = function (e) {
  var form = (0, _jquery.default)('.cms-edit-form');
  form.trigger('beforesubmitform');
  if (form.is('.changed') && !form.is('.discardchanges')) {
    return _i18n.default._t('Admin.CONFIRMUNSAVEDSHORT');
  }
  if (typeof currBeforeUnload === 'function') {
    return currBeforeUnload();
  }
  return undefined;
};
_jquery.default.entwine('ss', function ($) {
  $('.cms-edit-form').entwine({
    PlaceholderHtml: '',
    ChangeTrackerOptions: {
      ignoreFieldSelector: '.no-change-track, .ss-upload :input, .cms-navigator :input'
    },
    getValidationErrorShown: function () {
      return Boolean(this.data('_validationErrorShown'));
    },
    setValidationErrorShown: function (value) {
      this.data('_validationErrorShown', value);
    },
    onadd: function () {
      var self = this;
      this.attr("autocomplete", "off");
      this._setupChangeTracker();
      for (var overrideAttr in {
        'action': true,
        'method': true,
        'enctype': true,
        'name': true
      }) {
        var el = this.find(':input[name=' + '_form_' + overrideAttr + ']');
        if (el) {
          this.attr(overrideAttr, el.val());
          el.remove();
        }
      }
      this._super();
    },
    'from .cms-tabset': {
      onafterredrawtabs: function () {
        const iconClass = 'font-icon-attention-1 tab-attention';
        const iconTitle = ss.i18n._t('Admin.VALIDATION_ERRORS_IN_TAB', 'This tab contains validation errors.');
        const iconScreenReaderText = ss.i18n._t('Admin.VALIDATION_ERRORS_IN_TAB_SCREEN_READER', '(Has validation errors)');
        const alertMessageText = ss.i18n._t('Admin.VALIDATION_ERRORS_ON_PAGE', 'There are validation errors on this page, please fix them before saving or publishing.');
        const $editFormErrorBanner = $("#Form_EditForm_error, #Form_ItemEditForm_error");
        this.find('.tab-attention, .tab-validation-error-sr').remove();
        let validationErrorExists = false;
        if (this.hasClass('validationerror')) {
          validationErrorExists = true;
        }
        if ($editFormErrorBanner.html() !== '') {
          validationErrorExists = true;
        }
        if (this.find('.alert.error').length > 0) {
          validationErrorExists = true;
        }
        if (!validationErrorExists) {
          $editFormErrorBanner.hide();
          return;
        }
        const $invalidTabPanes = this.find('.tab-pane .alert-danger, .tab-pane .alert.error').closest('.tab-pane');
        if (!$invalidTabPanes.length) {
          return;
        }
        const $gridfieldTabs = this.find('.cms-content-header-tabs.cms-tabset-nav-primary li[role="tab"]');
        const $ssTabSet = $invalidTabPanes.closest('.tab-content').closest('.ss-tabset');
        let getTabLi = null;
        if ($gridfieldTabs.length > 1) {
          getTabLi = invalidTabPaneId => $gridfieldTabs.filter(`[aria-controls="${invalidTabPaneId}"]`);
        } else if ($ssTabSet.length) {
          getTabLi = invalidTabPaneId => $ssTabSet.find(`#tab-${invalidTabPaneId}`).closest('li');
        }
        if (getTabLi !== null) {
          $invalidTabPanes.each(i => {
            const invalidTabPaneId = $invalidTabPanes.eq(i).attr('id');
            const $tabLi = getTabLi(invalidTabPaneId);
            const $icon = $(`<i class="${iconClass}" title="${iconTitle}" aria-hidden="true"></i>`);
            const $screenReaderSpan = $(`<span class="tab-validation-error-sr sr-only">${iconScreenReaderText}</span>`);
            $tabLi.append($icon);
            $tabLi.append($screenReaderSpan);
          });
          $editFormErrorBanner.attr('class', 'alert alert-danger');
          $editFormErrorBanner.html(alertMessageText);
          $editFormErrorBanner.show();
        }
        this.addClass('validationerror');
      }
    },
    onremove: function () {
      this.changetracker('destroy');
      this._super();
    },
    onmatch: function () {
      this._super();
    },
    onunmatch: function () {
      this._super();
    },
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
      if (!this.getValidationErrorShown() && this.hasClass('validationerror')) {
        const toastNotificationMessage = ss.i18n._t('Admin.VALIDATIONERROR', 'Validation Error');
        errorMessage(toastNotificationMessage);
        this.setValidationErrorShown(true);
      }
      this.add(this.find('.cms-tabset')).redrawTabs();
      this.find('.cms-content-header').redraw();
    },
    _setupChangeTracker: function () {
      this.changetracker(this.getChangeTrackerOptions());
    },
    confirmUnsavedChanges: function () {
      this.trigger('beforesubmitform');
      if (!this.is('.changed') || this.is('.discardchanges')) {
        return true;
      }
      if (this.find('.btn-toolbar :submit.btn--loading.loading').length > 0) {
        return true;
      }
      var confirmed = confirm(_i18n.default._t('Admin.CONFIRMUNSAVED'));
      if (confirmed) {
        this.addClass('discardchanges');
      }
      return confirmed;
    },
    onsubmit: function (e, button) {
      if ($(e.target.activeElement).closest('.bypass-entwine-submission').length) {
        return true;
      }
      if (this.prop("target") != "_blank") {
        if (button) this.closest('.cms-container').submitForm(this, button);
        return false;
      }
    },
    validate: function () {
      var isValid = true;
      this.trigger('validate', {
        isValid: isValid
      });
      return isValid;
    },
    'from .htmleditor': {
      oneditorinit: function (e) {
        var self = this,
          field = $(e.target).closest('.field.htmleditor'),
          editor = field.find('textarea.htmleditor').getEditor().getInstance();
        editor.onClick.add(function (e) {
          self.saveFieldFocus(field.attr('id'));
        });
      }
    },
    'from .cms-edit-form :input:not(:submit)': {
      onclick: function (e) {
        this.saveFieldFocus($(e.target).attr('id'));
      },
      onfocus: function (e) {
        this.saveFieldFocus($(e.target).attr('id'));
      }
    },
    'from .cms-edit-form .treedropdown *': {
      onfocusin: function (e) {
        var field = $(e.target).closest('.field.treedropdown');
        this.saveFieldFocus(field.attr('id'));
      }
    },
    'from .cms-edit-form .dropdown .chosen-container a': {
      onfocusin: function (e) {
        var field = $(e.target).closest('.field.dropdown');
        this.saveFieldFocus(field.attr('id'));
      }
    },
    'from .cms-container': {
      ontabstaterestored: function (e) {
        this.restoreFieldFocus();
      }
    },
    saveFieldFocus: function (selected) {
      if (typeof window.sessionStorage == "undefined" || window.sessionStorage === null) return;
      var id = $(this).attr('id'),
        focusElements = [];
      focusElements.push({
        id: id,
        selected: selected
      });
      if (focusElements) {
        try {
          window.sessionStorage.setItem(id, JSON.stringify(focusElements));
        } catch (err) {
          if (err.code === DOMException.QUOTA_EXCEEDED_ERR && window.sessionStorage.length === 0) {
            return;
          } else {
            throw err;
          }
        }
      }
    },
    restoreFieldFocus: function () {
      if (typeof window.sessionStorage == "undefined" || window.sessionStorage === null) return;
      var self = this,
        hasSessionStorage = typeof window.sessionStorage !== "undefined" && window.sessionStorage,
        sessionData = hasSessionStorage ? window.sessionStorage.getItem(this.attr('id')) : null,
        sessionStates = sessionData ? JSON.parse(sessionData) : false,
        elementID,
        tabbed = this.find('.ss-tabset').length !== 0,
        activeTab,
        elementTab,
        toggleComposite,
        scrollY;
      if (hasSessionStorage && sessionStates.length > 0) {
        $.each(sessionStates, function (i, sessionState) {
          if (self.is('#' + sessionState.id)) {
            elementID = $('#' + sessionState.selected);
          }
        });
        if ($(elementID).length < 1) {
          this.focusFirstInput();
          return;
        }
        activeTab = $(elementID).closest('.ss-tabset').find('.ui-tabs-nav .ui-tabs-active .ui-tabs-anchor').attr('id');
        elementTab = 'tab-' + $(elementID).closest('.ss-tabset .ui-tabs-panel').attr('id');
        if (tabbed && elementTab !== activeTab) {
          return;
        }
        toggleComposite = $(elementID).closest('.togglecomposite');
        if (toggleComposite.length > 0) {
          toggleComposite.accordion('option', 'active', toggleComposite.find('.ui-accordion-header'));
        }
        scrollY = $(elementID).position().top;
        if (!$(elementID).is(':visible')) {
          elementID = '#' + $(elementID).closest('.field').attr('id');
          scrollY = $(elementID).position().top;
        }
        $(elementID).focus();
        if (scrollY > $(window).height() / 2) {
          self.find('.cms-content-fields').scrollTop(scrollY);
        }
      } else {
        this.focusFirstInput();
      }
    },
    focusFirstInput: function () {
      this.find(':input:not(:submit)[data-skip-autofocus!="true"]').filter(':visible:first').focus();
    }
  });
  $('.cms-edit-form .btn-toolbar input.action[type=submit], .cms-edit-form .btn-toolbar button.action').entwine({
    onclick: function (e) {
      if (this.is(':disabled')) {
        e.preventDefault();
        return false;
      }
      if (this._super(e) !== false && !e.defaultPrevented && !e.isDefaultPrevented()) {
        this.parents('form').trigger('submit', [this]);
        e.preventDefault();
        return false;
      }
    }
  });
  $('.cms-edit-form .btn-toolbar input.action[type=submit].ss-ui-action-cancel, .cms-edit-form .btn-toolbar button.action.ss-ui-action-cancel').entwine({
    onclick: function (e) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        this.parents('form').trigger('submit', [this]);
      }
      e.preventDefault();
    }
  });
  $('.cms-edit-form .btn-toolbar button[name=action_doUnpublish].btn.action').entwine({
    onclick: function (e) {
      var owners = this.data('owners');
      if (owners && parseInt(owners) > 0) {
        var message = [_i18n.default.inject(_i18n.default._t('Admin.OWNED_WARNING_1', 'You are unpublishing content that is being used in {count} other published section(s).'), {
          count: owners
        }), _i18n.default._t('Admin.OWNED_WARNING_2', 'This could cause a published page to have missing components on the live site.'), _i18n.default._t('Admin.OWNED_WARNING_3', 'Do you want to unpublish anyway?')];
        if (window.confirm(message.join('\n\n'))) {
          this._super();
        } else {
          e.preventDefault();
        }
      } else {
        this._super();
      }
    }
  });
  $('.cms-edit-form .ss-tabset').entwine({
    onmatch: function () {
      if (!this.hasClass('ss-ui-action-tabset')) {
        var tabs = this.find("> ul:first");
        if (tabs.children("li").length == 1) {
          tabs.hide().parent().addClass("ss-tabset-tabshidden");
        }
      }
      this._super();
    },
    onunmatch: function () {
      this._super();
    }
  });
  $('.cms-edit-form [name="CanViewType"], ' + '.cms-edit-form [name="CanEditType"], ' + '.cms-edit-form [name="CanCreateTopLevelType"]').entwine({
    onmatch: function () {
      if (this.is(':checked')) {
        this.toggleListDisplay(this.val(), true);
      }
    },
    onchange: function (e) {
      this.toggleListDisplay(e.target.value, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    },
    checkIfHoldsField(candidate, type) {
      let fieldName = '';
      switch (this.attr('name')) {
        case 'CanViewType':
          fieldName = `Viewer${type}`;
          break;
        case 'CanEditType':
          fieldName = `Editor${type}`;
          break;
        case 'CanCreateTopLevelType':
          fieldName = `CreateTopLevel${type}`;
          break;
      }
      const jCandidate = jQuery(candidate);
      return jCandidate.find(`[name="${fieldName}"],[name="${fieldName}[]"]`).length > 0 && jCandidate.attr('id').endsWith('_Holder');
    },
    toggleListDisplay: function (checkedTarget, instant) {
      if (checkedTarget === 'OnlyTheseUsers') {
        this.showGroupsList(instant);
        this.hideMembersList(instant);
      } else {
        this.hideGroupsList(instant);
      }
      if (checkedTarget === 'OnlyTheseMembers') {
        this.showMembersList(instant);
        this.hideGroupsList(instant);
      } else {
        this.hideMembersList(instant);
      }
    },
    showList: function (instant) {
      this.showGroupsList(instant);
      this.showMembersList(instant);
    },
    hideList: function (instant) {
      this.hideGroupsList(instant);
      this.hideMembersList(instant);
    },
    showGroupsList: function (instant) {
      const holder = this.closest('.field');
      this.showListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Groups')), instant);
    },
    hideGroupsList: function (instant) {
      const holder = this.closest('.field');
      this.hideListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Groups')), instant);
    },
    showMembersList: function (instant) {
      const holder = this.closest('.field');
      this.showListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Members')), instant);
    },
    hideMembersList: function (instant) {
      const holder = this.closest('.field');
      this.hideListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Members')), instant);
    },
    showListElement: function (holder, list, instant) {
      holder.addClass('field--merge-below');
      if (instant) {
        list.show().css('overflow', 'visible');
      } else {
        list.slideDown(() => {
          list.css('overflow', 'visible');
        });
      }
    },
    hideListElement: function (holder, list, instant) {
      list.css('overflow', 'hidden');
      if (instant) {
        list.hide().css('display', 'none');
        holder.removeClass('field--merge-below');
      } else {
        list.slideUp(() => {
          holder.removeClass('field--merge-below');
        });
      }
    }
  });
});
var errorMessage = function (text) {
  jQuery.noticeAdd({
    text: text,
    type: 'error',
    stayTime: 5000,
    inEffect: {
      left: '0',
      opacity: 'show'
    }
  });
};

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.FieldDescriptionToggle.js":
/*!*****************************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.FieldDescriptionToggle.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.cms-description-toggle').entwine({
    onadd: function () {
      var shown = false,
        fieldId = this.prop('id').substr(0, this.prop('id').indexOf('_Holder')),
        $trigger = this.find('.cms-description-trigger'),
        $description = this.find('.description');
      if (this.hasClass('description-toggle-enabled')) {
        return;
      }
      if ($trigger.length === 0) {
        $trigger = this.find('.middleColumn').first().after('<label class="right" for="' + fieldId + '"><a class="cms-description-trigger" href="javascript:void(0)"><span class="btn-icon-information"></span></a></label>').next();
      }
      this.addClass('description-toggle-enabled');
      $trigger.on('click', function () {
        $description[shown ? 'hide' : 'show']();
        shown = !shown;
      });
      $description.hide();
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.FieldHelp.js":
/*!****************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.FieldHelp.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $(".cms .field.cms-description-tooltip").entwine({
    onmatch: function () {
      this._super();
      var descriptionEl = this.find('.description'),
        inputEl,
        tooltipEl;
      if (descriptionEl.length) {
        this.attr('title', descriptionEl.text()).tooltip({
          content: descriptionEl.html()
        });
        descriptionEl.remove();
      }
    }
  });
  $(".cms .field.cms-description-tooltip :input").entwine({
    onfocusin: function (e) {
      this.closest('.field').tooltip('open');
    },
    onfocusout: function (e) {
      this.closest('.field').tooltip('close');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Menu.js":
/*!***********************************************!*\
  !*** ./client/src/legacy/LeftAndMain.Menu.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _urls = __webpack_require__(/*! lib/urls */ "./client/src/lib/urls.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.cms-panel.cms-menu').entwine({
    togglePanel: function (doExpand, silent, doSaveState) {
      $('.cms-menu__list').children('li').each(function () {
        if (doExpand) {
          $(this).children('ul').each(function () {
            if ($(this).data('collapse')) {
              $(this).removeData('collapse');
              $(this).addClass('collapse');
            }
          });
        } else {
          $(this).children('ul').each(function () {
            $(this).hasClass('collapse');
            $(this).removeClass('collapse');
            $(this).data('collapse', true);
          });
        }
      });
      this._super(doExpand, silent, doSaveState);
    },
    siteTreePresent: function () {
      return $('#cms-content-tools-CMSMain').length > 0;
    },
    getPersistedStickyState: function () {
      var persistedState, cookieValue;
      if ($.cookie !== void 0) {
        cookieValue = $.cookie('cms-menu-sticky');
        if (cookieValue !== void 0 && cookieValue !== null) {
          persistedState = cookieValue === 'true';
        }
      }
      return persistedState;
    },
    setPersistedStickyState: function (isSticky) {
      if ($.cookie !== void 0) {
        $.cookie('cms-menu-sticky', isSticky, {
          path: '/',
          expires: 31
        });
      }
    },
    getEvaluatedCollapsedState: function () {
      var shouldCollapse,
        manualState = this.getPersistedCollapsedState(),
        menuIsSticky = $('.cms-menu').getPersistedStickyState(),
        automaticState = this.siteTreePresent();
      if (manualState === void 0) {
        shouldCollapse = automaticState;
      } else if (manualState !== automaticState && menuIsSticky) {
        shouldCollapse = manualState;
      } else {
        shouldCollapse = automaticState;
      }
      return shouldCollapse;
    },
    onadd: function () {
      var self = this;
      setTimeout(function () {
        self.togglePanel(!self.getEvaluatedCollapsedState(), false, false);
      }, 0);
      $(window).on('ajaxComplete', function (e) {
        setTimeout(function () {
          self.togglePanel(!self.getEvaluatedCollapsedState(), false, false);
        }, 0);
      });
      this._super();
    }
  });
  $('.cms-menu__list').entwine({
    onmatch: function () {
      var self = this;
      this.find('li.current').select();
      this.updateItems();
      this._super();
    },
    onunmatch: function () {
      this._super();
    },
    updateMenuFromResponse: function (xhr) {
      var controller = xhr.getResponseHeader('X-Controller');
      if (controller) {
        var item = this.find('li#Menu-' + controller.replace(/\\/g, '-').replace(/[^a-zA-Z0-9\-_:.]+/, ''));
        if (!item.hasClass('current')) item.select();
      }
      this.updateItems();
    },
    'from .cms-container': {
      onafterstatechange: function (e, data) {
        this.updateMenuFromResponse(data.xhr);
      },
      onaftersubmitform: function (e, data) {
        this.updateMenuFromResponse(data.xhr);
      }
    },
    'from .cms-edit-form': {
      onrelodeditform: function (e, data) {
        this.updateMenuFromResponse(data.xmlhttp);
      }
    },
    getContainingPanel: function () {
      return this.closest('.cms-panel');
    },
    fromContainingPanel: {
      ontoggle: function (e) {
        this.toggleClass('collapsed', $(e.target).hasClass('collapsed'));
        $('.cms-container').trigger('windowresize');
        if (this.hasClass('collapsed')) this.find('li.children.opened').removeClass('opened');
        if (!this.hasClass('collapsed')) {
          $('.toggle-children.opened').closest('li').addClass('opened');
        }
      }
    },
    updateItems: function () {
      var editPageItem = this.find('#Menu-CMSMain');
      editPageItem[editPageItem.is('.current') ? 'show' : 'hide']();
      var currentID = $('.cms-content input[name=ID]').val();
      if (currentID) {
        this.find('li').each(function () {
          if (typeof $(this).setRecordID === 'function') $(this).setRecordID(currentID);
        });
      }
    }
  });
  $('.cms-menu__list li').entwine({
    onmatch: function () {
      if (this.find('ul').length) {
        this.find('a:first').append('<span class="toggle-children"><span class="toggle-children-icon"></span></span>');
      }
      this._super();
    },
    onunmatch: function () {
      this._super();
    },
    toggle: function () {
      this[this.hasClass('opened') ? 'close' : 'open']();
    },
    open: function () {
      var parent = this.getMenuItem();
      if (parent) parent.open();
      if (this.find('li.clone')) {
        this.find('li.clone').remove();
      }
      this.addClass('opened').find('ul').show();
      this.find('.toggle-children').addClass('opened');
    },
    close: function () {
      this.removeClass('opened').find('ul').hide();
      this.find('.toggle-children').removeClass('opened');
    },
    select: function () {
      var parent = this.getMenuItem();
      this.addClass('current').open();
      this.siblings().removeClass('current').close();
      this.siblings().find('li').removeClass('current');
      if (parent) {
        var parentSiblings = parent.siblings();
        parent.addClass('current');
        parentSiblings.removeClass('current').close();
        parentSiblings.find('li').removeClass('current').close();
      }
      this.getMenu().updateItems();
      this.trigger('select');
    }
  });
  $('.cms-menu__list *').entwine({
    getMenu: function () {
      return this.parents('.cms-menu__list:first');
    }
  });
  $('.cms-menu__list li *').entwine({
    getMenuItem: function () {
      return this.parents('li:first');
    }
  });
  $('.cms-menu__list li a').entwine({
    onclick: function (e) {
      var isExternal = $.path.isExternal(this.attr('href'));
      if (e.which > 1 || isExternal) return;
      if (this.attr('target') == "_blank") {
        return;
      }
      e.preventDefault();
      var item = this.getMenuItem();
      var url = this.attr('href');
      if (!isExternal) url = (0, _urls.joinUrlPaths)($('base').attr('href'), url);
      var children = item.find('li');
      if (children.length) {
        children.first().find('a').click();
      } else {
        document.location.href = url;
      }
      item.select();
    }
  });
  $('.cms-menu__list li .toggle-children').entwine({
    onclick: function (e) {
      var li = this.closest('li');
      li.toggle();
      return false;
    }
  });
  $('.cms .profile-link').entwine({
    onclick: function () {
      $('.cms-container').loadPanel(this.attr('href'));
      $('.cms-menu__list li').removeClass('current').close();
      return false;
    }
  });
  $('.cms-menu .sticky-toggle__button').entwine({
    onadd: function () {
      var isSticky = $('.cms-menu').getPersistedStickyState() ? true : false;
      this.toggleCSS(isSticky);
      this.toggleIndicator(isSticky);
      this._super();
    },
    toggleCSS: function (isSticky) {
      this[isSticky ? 'addClass' : 'removeClass']('active');
    },
    toggleIndicator: function (isSticky) {
      this.next('.sticky-toggle__status').text(isSticky ? 'fixed' : 'auto');
    },
    onclick: function () {
      var $menu = this.closest('.cms-menu'),
        persistedCollapsedState = $menu.getPersistedCollapsedState(),
        persistedStickyState = $menu.getPersistedStickyState(),
        newStickyState = persistedStickyState === void 0 ? !this.hasClass('active') : !persistedStickyState;
      if (persistedCollapsedState === void 0) {
        $menu.setPersistedCollapsedState($menu.hasClass('collapsed'));
      } else if (persistedCollapsedState !== void 0 && newStickyState === false) {
        $menu.clearPersistedCollapsedState();
      }
      $menu.setPersistedStickyState(newStickyState);
      this.toggleCSS(newStickyState);
      this.toggleIndicator(newStickyState);
      this._super();
    }
  });
  $('.cms-help__menu').entwine({
    onclick: function () {
      var expandedState = this.attr('aria-expanded') === 'true';
      this.attr('aria-expanded', !expandedState);
      $('.cms-help__toggle').toggleClass('cms-help__toggle--show');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.MobileMenuToggle.js":
/*!***********************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.MobileMenuToggle.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _MobileMenuToggleContainer = _interopRequireDefault(__webpack_require__(/*! components/MobileMenuToggle/MobileMenuToggleContainer */ "./client/src/components/MobileMenuToggle/MobileMenuToggleContainer.js"));
var _MobileMenuActions = __webpack_require__(/*! state/mobileMenu/MobileMenuActions */ "./client/src/state/mobileMenu/MobileMenuActions.js");
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.js-react-boot').entwine({
    onmatch: function () {
      const menuToggleWrapper = $('.cms-mobile-menu-toggle-wrapper');
      if (menuToggleWrapper.length > 0) {
        const root = (0, _client.createRoot)(menuToggleWrapper[0]);
        root.render(React.createElement(_MobileMenuToggleContainer.default, {
          store: window.ss.store,
          controls: "cms-menu"
        }));
      }
      const store = window.ss.store;
      const menu = $('.cms-menu');
      const menuOverlay = $('.cms-menu-mobile-overlay');
      store.subscribe(() => {
        const state = store.getState();
        const isOpen = state.mobileMenu.isOpen;
        menu.toggleClass('cms-menu--open', isOpen).attr('aria-expanded', isOpen);
        menuOverlay.attr('aria-expanded', isOpen);
      });
    }
  });
  $('.cms-menu-mobile-overlay').entwine({
    onclick: function () {
      const store = window.ss.store;
      store.dispatch((0, _MobileMenuActions.closeMobileMenu)());
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Panel.js":
/*!************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.Panel.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $.entwine.warningLevel = $.entwine.WARN_LEVEL_BESTPRACTISE;
  $('.cms-panel').entwine({
    WidthExpanded: null,
    WidthCollapsed: null,
    canSetCookie: function () {
      return $.cookie !== void 0 && this.attr('id') !== void 0;
    },
    getPersistedCollapsedState: function () {
      var isCollapsed, cookieValue;
      if (this.canSetCookie()) {
        cookieValue = $.cookie('cms-panel-collapsed-' + this.attr('id'));
        if (cookieValue !== void 0 && cookieValue !== null) {
          isCollapsed = cookieValue === 'true';
        }
      }
      return isCollapsed;
    },
    setPersistedCollapsedState: function (newState) {
      if (this.canSetCookie()) {
        $.cookie('cms-panel-collapsed-' + this.attr('id'), newState, {
          path: '/',
          expires: 31
        });
      }
    },
    clearPersistedCollapsedState: function () {
      if (this.canSetCookie()) {
        $.cookie('cms-panel-collapsed-' + this.attr('id'), '', {
          path: '/',
          expires: -1
        });
      }
    },
    getInitialCollapsedState: function () {
      var isCollapsed = this.getPersistedCollapsedState();
      if (isCollapsed === void 0) {
        isCollapsed = this.hasClass('collapsed');
      }
      return isCollapsed;
    },
    onadd: function () {
      var collapsedContent, container;
      if (!this.find('.cms-panel-content').length) throw new Exception('Content panel for ".cms-panel" not found');
      if (!this.find('.cms-panel-toggle').length) {
        container = $("<div class='toolbar toolbar--south cms-panel-toggle'></div>").append('<a class="toggle-expand" href="#" data-toggle="tooltip" title="' + i18n._t('Admin.EXPANDPANEL', 'Expand Panel') + '"><span>&raquo;</span></a>').append('<a class="toggle-collapse" href="#" data-toggle="tooltip" title="' + i18n._t('Admin.COLLAPSEPANEL', 'Collapse Panel') + '"><span>&laquo;</span></a>');
        this.append(container);
      }
      this.setWidthExpanded(this.find('.cms-panel-content').innerWidth());
      collapsedContent = this.find('.cms-panel-content-collapsed');
      this.setWidthCollapsed(collapsedContent.length ? collapsedContent.innerWidth() : this.find('.toggle-expand').innerWidth());
      this.togglePanel(!this.getInitialCollapsedState(), true, false);
      this._super();
    },
    togglePanel: function (doExpand, silent, doSaveState) {
      var newWidth, collapsedContent;
      if (!silent) {
        this.trigger('beforetoggle.sspanel', doExpand);
        this.trigger(doExpand ? 'beforeexpand' : 'beforecollapse');
      }
      this.toggleClass('collapsed', !doExpand);
      newWidth = doExpand ? this.getWidthExpanded() : this.getWidthCollapsed();
      this.width(newWidth);
      collapsedContent = this.find('.cms-panel-content-collapsed');
      if (collapsedContent.length) {
        this.find('.cms-panel-content')[doExpand ? 'show' : 'hide']();
        this.find('.cms-panel-content-collapsed')[doExpand ? 'hide' : 'show']();
      }
      if (doSaveState !== false) {
        this.setPersistedCollapsedState(!doExpand);
      }
      this.trigger('toggle', doExpand);
      this.trigger(doExpand ? 'expand' : 'collapse');
    },
    expandPanel: function (force) {
      if (!force && !this.hasClass('collapsed')) return;
      this.togglePanel(true);
    },
    collapsePanel: function (force) {
      if (!force && this.hasClass('collapsed')) return;
      this.togglePanel(false);
    }
  });
  $('.cms-panel.collapsed .cms-panel-toggle').entwine({
    onclick: function (e) {
      this.expandPanel();
      e.preventDefault();
    }
  });
  $('.cms-panel *').entwine({
    getPanel: function () {
      return this.parents('.cms-panel:first');
    }
  });
  $('.cms-panel .toggle-expand').entwine({
    onclick: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.getPanel().expandPanel();
      this._super(e);
    }
  });
  $('.cms-panel .toggle-collapse').entwine({
    onclick: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.getPanel().collapsePanel();
      this._super(e);
    }
  });
  $('.cms-content-tools.collapsed').entwine({
    onclick: function (e) {
      this.expandPanel();
      this._super(e);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Preview.js":
/*!**************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.Preview.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss.preview', function ($) {
  $('.cms-preview').entwine({
    AlreadyInitialised: false,
    AllowedStates: ['StageLink', 'LiveLink', 'Unversioned', 'ArchiveLink'],
    CurrentStateName: null,
    CurrentSizeName: 'auto',
    IsPreviewEnabled: false,
    DefaultMode: 'split',
    Sizes: {
      auto: {
        width: '100%',
        height: '100%'
      },
      mobile: {
        width: '335px',
        height: '568px'
      },
      mobileLandscape: {
        width: '583px',
        height: '320px'
      },
      tablet: {
        width: '783px',
        height: '1024px'
      },
      tabletLandscape: {
        width: '1039px',
        height: '768px'
      },
      desktop: {
        width: '1024px',
        height: '800px'
      }
    },
    changeState: function (stateName, save) {
      var self = this,
        states = this._getNavigatorStates();
      if (save !== false) {
        $.each(states, function (index, state) {
          self.saveState('state', stateName);
        });
      }
      this.setCurrentStateName(stateName);
      this._loadCurrentState();
      this.redraw();
      return this;
    },
    changeMode: function (modeName, save) {
      var container = $('.cms-container').entwine('.ss');
      if (modeName == 'split') {
        container.splitViewMode();
        this.setIsPreviewEnabled(true);
        this._loadCurrentState();
      } else if (modeName == 'content') {
        container.contentViewMode();
        this.setIsPreviewEnabled(false);
      } else if (modeName == 'preview') {
        container.previewMode();
        this.setIsPreviewEnabled(true);
        this._loadCurrentState();
      } else {
        throw 'Invalid mode: ' + modeName;
      }
      if (save !== false) this.saveState('mode', modeName);
      this.redraw();
      return this;
    },
    changeSize: function (sizeName) {
      var sizes = this.getSizes();
      this.setCurrentSizeName(sizeName);
      this.removeClass('auto desktop tablet mobile').addClass(sizeName);
      this.saveState('size', sizeName);
      this.redraw();
      return this;
    },
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
      var currentStateName = this.getCurrentStateName();
      if (currentStateName) {
        this.find('.cms-preview-states').changeVisibleState(currentStateName);
      }
      var layoutOptions = $('.cms-container').entwine('.ss').getLayoutOptions();
      if (layoutOptions) {
        $('.preview-mode-selector').changeVisibleMode(layoutOptions.mode);
      }
      var currentSizeName = this.getCurrentSizeName();
      if (currentSizeName) {
        this.find('.preview-size-selector').changeVisibleSize(this.getCurrentSizeName());
      }
      return this;
    },
    saveState: function (name, value) {
      if (this._supportsLocalStorage()) window.localStorage.setItem('cms-preview-state-' + name, value);
    },
    loadState: function (name) {
      if (this._supportsLocalStorage()) return window.localStorage.getItem('cms-preview-state-' + name);
    },
    disablePreview: function () {
      this.setPendingURL(null);
      this._loadUrl('about:blank');
      this._block();
      this.changeMode('content', false);
      this.setIsPreviewEnabled(false);
      return this;
    },
    enablePreview: function () {
      if (!this.getIsPreviewEnabled()) {
        this.setIsPreviewEnabled(true);
        this.changeMode(this.getDefaultMode(), false);
      }
      return this;
    },
    onadd: function () {
      var self = this,
        iframe = this.find('iframe');
      iframe.addClass('center');
      iframe.on('load', function () {
        self._adjustIframeForPreview();
        self._loadCurrentPage();
        $(this).removeClass('loading');
      });
      this._unblock();
      this.disablePreview();
      this._super();
    },
    _supportsLocalStorage: function () {
      var uid = new Date();
      var storage;
      var result;
      try {
        (storage = window.localStorage).setItem(uid, uid);
        result = storage.getItem(uid) == uid;
        storage.removeItem(uid);
        return result && storage;
      } catch (exception) {
        console.warn('localStorge is not available due to current browser / system settings.');
      }
    },
    onforcecontent: function () {
      this.changeMode('content', false);
    },
    onenable: function () {
      var $viewModeSelector = $('.preview-mode-selector');
      $viewModeSelector.removeClass('split-disabled');
      $viewModeSelector.find('.disabled-tooltip').hide();
    },
    ondisable: function () {
      var $viewModeSelector = $('.preview-mode-selector');
      $viewModeSelector.addClass('split-disabled');
      $viewModeSelector.find('.disabled-tooltip').show();
    },
    _block: function () {
      this.find('.preview-note').show();
      return this;
    },
    _unblock: function () {
      this.find('.preview-note').hide();
      return this;
    },
    _initialiseFromContent: function () {
      var mode, size;
      if (!$('.cms-previewable').length) {
        this.disablePreview();
      } else {
        mode = this.loadState('mode');
        size = this.loadState('size');
        let save = true;
        this._moveNavigator();
        if (!mode || mode != 'content') {
          this.enablePreview();
          this._loadCurrentState();
        }
        this.redraw();
        const currentPreviewURL = this.find('iframe').attr('src');
        if (!this.getPendingURL() && (!currentPreviewURL || currentPreviewURL === 'about:blank')) {
          mode = 'content';
          save = false;
        }
        if (mode) this.changeMode(mode, save);
        if (size) this.changeSize(size);
      }
      this.setAlreadyInitialised(true);
      return this;
    },
    'from .cms-container': {
      onafterstatechange: function (e, data) {
        if (data.xhr.getResponseHeader('X-ControllerURL')) return;
        this._initialiseFromContent();
      }
    },
    PendingURL: null,
    oncolumnvisibilitychanged: function () {
      var url = this.getPendingURL();
      if (url && !this.is('.column-hidden')) {
        this.setPendingURL(null);
        this._loadUrl(url);
        this._unblock();
      }
    },
    'from .cms-container .cms-edit-form': {
      onaftersubmitform: function () {
        this._initialiseFromContent();
      }
    },
    _loadUrl: function (url) {
      this.find('iframe').addClass('loading').attr('src', url);
      return this;
    },
    _getNavigatorStates: function () {
      var urlMap = $.map(this.getAllowedStates(), function (name) {
        var stateLink = $('.cms-preview-states .state-name[data-name=' + name + ']');
        if (stateLink.length) {
          return {
            name: name,
            url: stateLink.attr('href'),
            active: stateLink.hasClass('active')
          };
        } else {
          return null;
        }
      });
      return urlMap;
    },
    _loadCurrentState: function () {
      if (!this.getIsPreviewEnabled()) return this;
      var states = this._getNavigatorStates();
      var currentStateName = this.getCurrentStateName();
      var currentState = null;
      if (states) {
        currentState = $.grep(states, function (state, index) {
          return currentStateName === state.name || !currentStateName && state.active;
        });
      }
      var url = null;
      if (currentState[0]) {
        url = currentState[0].url;
      } else if (states.length) {
        this.setCurrentStateName(states[0].name);
        url = states[0].url;
      } else {
        this.setCurrentStateName(null);
      }
      if (url) {
        let urlFrag = url.split('#');
        const urlBits = urlFrag.shift().split(/[?&]/);
        const urlBase = urlBits.shift();
        urlBits.push('CMSPreview=1');
        urlFrag = urlFrag.length ? '#' + urlFrag.join('#') : '';
        url = urlBase + '?' + urlBits.join('&') + urlFrag;
      }
      if (this.is('.column-hidden')) {
        this.setPendingURL(url);
        this._loadUrl('about:blank');
        this._block();
      } else {
        this.setPendingURL(null);
        if (url) {
          this._loadUrl(url);
          this._unblock();
        } else {
          this._loadUrl('about:blank');
          this._block();
        }
      }
      return this;
    },
    _moveNavigator: function () {
      var previewEl = $('.cms-preview .cms-preview-controls');
      var navigatorEl = $('.cms-edit-form .cms-navigator');
      if (navigatorEl.length && previewEl.length) {
        previewEl.html($('.cms-edit-form .cms-navigator').detach());
      } else {
        this._block();
      }
    },
    _loadCurrentPage: function () {
      if (!this.getIsPreviewEnabled()) return;
      var doc,
        containerEl = $('.cms-container');
      try {
        doc = this.find('iframe')[0].contentDocument;
      } catch (e) {
        console.warn('Unable to access iframe, possible https mis-match');
      }
      if (!doc) {
        return;
      }
      var id = $(doc).find('meta[name=x-page-id]').attr('content');
      var editLink = $(doc).find('meta[name=x-cms-edit-link]').attr('content');
      var contentPanel = $('.cms-content');
      var inputId = contentPanel.find(':input[name=ID]').val();
      if (id && inputId !== undefined && inputId != id) {
        $('.cms-container').entwine('.ss').loadPanel(editLink);
      }
    },
    _adjustIframeForPreview: function () {
      var iframe = this.find('iframe')[0],
        doc;
      if (!iframe) {
        return;
      }
      try {
        doc = iframe.contentDocument;
      } catch (e) {
        console.warn('Unable to access iframe, possible https mis-match');
      }
      if (!doc) {
        return;
      }
      var links = doc.getElementsByTagName('A');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        if (!href) continue;
        if (href.match(/^http:\/\//)) links[i].setAttribute('target', '_blank');
      }
      var navi = doc.getElementById('SilverStripeNavigator');
      if (navi) navi.style.display = 'none';
      var naviMsg = doc.getElementById('SilverStripeNavigatorMessage');
      if (naviMsg) naviMsg.style.display = 'none';
      this.trigger('afterIframeAdjustedForPreview', [doc]);
    }
  });
  $('.cms-edit-form').entwine({
    onadd: function () {
      this._super();
      $('.cms-preview').setAlreadyInitialised(false);
      $('.cms-preview')._initialiseFromContent();
    }
  });
  $('.cms-preview-states').entwine({
    changeVisibleState: function (state) {
      this.find('[data-name="' + state + '"]').addClass('active').siblings().removeClass('active');
    }
  });
  $('.cms-preview-states .state-name').entwine({
    onclick: function (e) {
      if (e.which == 1) {
        var targetStateName = $(this).attr('data-name');
        this.addClass('active').siblings().removeClass('active');
        $('.cms-preview').changeState(targetStateName);
        e.preventDefault();
      }
    }
  });
  $('.preview-mode-selector').entwine({
    changeVisibleMode: function (mode) {
      this.find('select').val(mode).trigger('chosen:updated')._addIcon();
    }
  });
  $('.preview-mode-selector select').entwine({
    onchange: function (e) {
      this._super(e);
      e.preventDefault();
      var targetStateName = $(this).val();
      $('.cms-preview').changeMode(targetStateName);
    }
  });
  $('.cms-container--content-mode').entwine({
    onmatch: function () {
      if ($('.cms-preview .result-selected').hasClass('font-icon-columns')) {
        statusMessage(_i18n.default._t('Admin.DISABLESPLITVIEW', "Screen too small to show site preview in split mode"), "error");
      }
      this._super();
    }
  });
  $('.preview-size-selector').entwine({
    changeVisibleSize: function (size) {
      this.find('select').val(size).trigger('chosen:updated')._addIcon();
    }
  });
  $('.preview-size-selector select').entwine({
    onchange: function (e) {
      e.preventDefault();
      var targetSizeName = $(this).val();
      $('.cms-preview').changeSize(targetSizeName);
    }
  });
  $('.preview-selector select.preview-dropdown').entwine({
    'onchosen:ready': function () {
      this._super();
      this._addIcon();
    },
    _addIcon: function () {
      var selected = this.find(':selected');
      var iconClass = selected.attr('data-icon');
      var target = this.parent().find('.chosen-container a.chosen-single');
      var oldIcon = target.attr('data-icon');
      if (typeof oldIcon !== 'undefined') {
        target.removeClass(oldIcon);
      }
      target.addClass(iconClass);
      target.attr('data-icon', iconClass);
      return this;
    }
  });
  $('.preview-mode-selector .chosen-drop li:last-child').entwine({
    onmatch: function () {
      if ($('.preview-mode-selector').hasClass('split-disabled')) {
        this.parent().append('<div class="disabled-tooltip"></div>');
      } else {
        this.parent().append('<div class="disabled-tooltip" style="display: none;"></div>');
      }
    }
  });
  $('.preview-device-outer').entwine({
    onclick: function () {
      this.parent('.preview__device').toggleClass('rotate');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Tree.js":
/*!***********************************************!*\
  !*** ./client/src/legacy/LeftAndMain.Tree.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss.tree', function ($) {
  $('.cms-tree').entwine({
    Hints: null,
    IsUpdatingTree: false,
    CanMoveCheckCompleted: false,
    IsLoaded: false,
    onadd: function () {
      this._super();
      if ($.isNumeric(this.data('jstree_instance_id'))) return;
      var hints = this.attr('data-hints');
      if (hints) this.setHints($.parseJSON(hints));
      const moveNodeCallback = function (e, data) {
        let movedNode = data.rslt.o,
          newParentNode = data.rslt.np,
          newParentID = $(newParentNode).data('id') || 0,
          nodeID = $(movedNode).data('id'),
          siblingIDs = $.map($(movedNode).siblings().addBack(), function (el) {
            return $(el).data('id');
          });
        if (self.getIsUpdatingTree()) return;
        if (!self.getCanMoveCheckCompleted()) {
          self.canMove(data).then(success => {
            if (success) {
              self.setCanMoveCheckCompleted(true);
              moveNodeCallback(e, data);
            } else {
              $.jstree.rollback(data.rlbk);
            }
          });
          return;
        }
        self.setCanMoveCheckCompleted(false);
        $.ajax({
          'url': $.path.addSearchParams(self.data('urlSavetreenode'), self.data('extraParams')),
          'type': 'POST',
          'data': {
            ID: nodeID,
            ParentID: newParentID,
            SiblingIDs: siblingIDs
          },
          success: function () {
            if ($('.cms-edit-form :input[name=ID]').val() == nodeID) {
              $('.cms-edit-form :input[name=ParentID]').val(newParentID);
            }
            self.updateNodesFromServer([nodeID]);
          },
          statusCode: {
            403: function () {
              $.jstree.rollback(data.rlbk);
            }
          }
        });
      };
      var self = this;
      this.jstree(this.getTreeConfig()).on('loaded.jstree', function (e, data) {
        self.setIsLoaded(true);
        data.inst._set_settings({
          'html_data': {
            'ajax': {
              'url': self.data('urlTree'),
              'data': function (node) {
                var params = self.data('searchparams') || [];
                params = $.grep(params, function (n, i) {
                  return n.name != 'ID' && n.name != 'value';
                });
                params.push({
                  name: 'ID',
                  value: $(node).data("id") ? $(node).data("id") : 0
                });
                params.push({
                  name: 'ajax',
                  value: 1
                });
                return params;
              }
            }
          }
        });
        self.updateFromEditForm();
        self.css('visibility', 'visible');
        data.inst.hide_checkboxes();
      }).on('before.jstree', function (e, data) {
        if (data.func == 'start_drag') {
          if (!self.hasClass('draggable') || self.hasClass('multiselect')) {
            e.stopImmediatePropagation();
            return false;
          }
        }
        if ($.inArray(data.func, ['check_node', 'uncheck_node'])) {
          var node = $(data.args[0]).parents('li:first');
          var allowedChildren = node.find('li:not(.disabled)');
          if (node.hasClass('disabled') && allowedChildren == 0) {
            e.stopImmediatePropagation();
            return false;
          }
        }
      }).on('move_node.jstree', moveNodeCallback).on('select_node.jstree check_node.jstree uncheck_node.jstree', function (e, data) {
        e.namespace = '';
        $(document).triggerHandler(e, data);
      });
    },
    onremove: function () {
      this.jstree('destroy');
      this._super();
    },
    'from .cms-container': {
      onafterstatechange: function (e) {
        this.updateFromEditForm();
      }
    },
    'from .cms-container form': {
      onaftersubmitform: function (e) {
        const id = $('.cms-edit-form :input[name=ID]').val();
        const node = this.find(`[data-id=${id}]`);
        let ids = [+id];
        node.find('li').each(function () {
          ids.push($(this).data('id'));
        });
        const chunks = [];
        let chunkSize = 50;
        while (ids.length) {
          const chunk = ids.slice(0, chunkSize);
          chunks.push(chunk);
          ids = ids.slice(chunkSize);
        }
        chunks.map(chunk => this.updateNodesFromServer(chunk, false)).reduce((chain, curr) => chain.then(curr), Promise.resolve());
      }
    },
    canMove: async function (data) {
      return Promise.resolve(true);
    },
    getTreeConfig: function () {
      var self = this;
      return {
        'core': {
          'initially_open': ['record-0'],
          'animation': 0,
          'html_titles': true
        },
        'html_data': {},
        'ui': {
          "select_limit": 1,
          'initially_select': [this.find('.current').attr('id')]
        },
        "crrm": {
          'move': {
            'check_move': function (data) {
              var movedNode = $(data.o),
                newParent = $(data.np),
                isMovedOntoContainer = data.ot.get_container()[0] == data.np[0],
                movedNodeClass = movedNode.getClassname(),
                newParentClass = newParent.getClassname(),
                hints = self.getHints(),
                disallowedChildren = [],
                hintKey = newParentClass ? newParentClass : 'Root',
                hint = hints && typeof hints[hintKey] != 'undefined' ? hints[hintKey] : null;
              if (hint && movedNode.attr('class').match(/VirtualPage-([^\s]*)/)) movedNodeClass = RegExp.$1;
              if (hint) disallowedChildren = typeof hint.disallowedChildren != 'undefined' ? hint.disallowedChildren : [];
              var isAllowed = movedNode.data('id') !== 0 && !movedNode.hasClass('status-archived') && (!isMovedOntoContainer || data.p == 'inside') && !newParent.hasClass('nochildren') && (!disallowedChildren.length || $.inArray(movedNodeClass, disallowedChildren) == -1);
              return isAllowed;
            }
          }
        },
        'dnd': {
          "drop_target": false,
          "drag_target": false
        },
        'checkbox': {
          'two_state': true
        },
        'themes': {
          'theme': 'apple',
          'url': $('body').data('frameworkpath') + '/admin/thirdparty/jstree/themes/apple/style.css'
        },
        'plugins': ['html_data', 'ui', 'dnd', 'crrm', 'themes', 'checkbox']
      };
    },
    search: function (params, callback) {
      if (params) this.data('searchparams', params);else this.removeData('searchparams');
      this.jstree('refresh', -1, callback);
    },
    getNodeByID: function (id) {
      return this.find('*[data-id=' + id + ']');
    },
    createNode: function (html, data, callback) {
      var self = this,
        parentNode = data.ParentID !== void 0 ? self.getNodeByID(data.ParentID) : false,
        newNode = $(html);
      var properties = {
        data: ''
      };
      if (newNode.hasClass('jstree-open')) {
        properties.state = 'open';
      } else if (newNode.hasClass('jstree-closed')) {
        properties.state = 'closed';
      }
      this.jstree('create_node', parentNode.length ? parentNode : -1, 'last', properties, function (node) {
        var origClasses = node.attr('class');
        for (var i = 0; i < newNode[0].attributes.length; i++) {
          var attr = newNode[0].attributes[i];
          node.attr(attr.name, attr.value);
        }
        node.addClass(origClasses).html(newNode.html());
        if (callback) {
          callback(node);
        }
      });
    },
    updateNode: function (node, html, data) {
      html = html.replace(/<!--[\s\S]*?-->/g, '');
      var self = this,
        newNode = $(html);
      var nextNode = data.NextID ? this.getNodeByID(data.NextID) : false;
      var prevNode = data.PrevID ? this.getNodeByID(data.PrevID) : false;
      var parentNode = data.ParentID ? this.getNodeByID(data.ParentID) : false;
      var parentOpen = this.jstree('is_open', parentNode);
      $.each(['id', 'style', 'class', 'data-pagetype'], function (i, attrName) {
        node.attr(attrName, newNode.attr(attrName));
      });
      var origChildren = node.children('ul').detach();
      node.html(newNode.html()).append(origChildren);
      if (nextNode && nextNode.length) {
        this.jstree('move_node', node, nextNode, 'before');
      } else if (prevNode && prevNode.length) {
        this.jstree('move_node', node, prevNode, 'after');
      } else {
        this.jstree('move_node', node, parentNode.length ? parentNode : -1);
      }
      if (parentOpen) {
        this.jstree('open_node', parentNode);
      } else {
        this.jstree('close_node', parentNode);
      }
    },
    updateFromEditForm: function () {
      var node,
        id = $('.cms-edit-form :input[name=ID]').val();
      if (id) {
        node = this.getNodeByID(id);
        if (node.length) {
          this.jstree('deselect_all');
          this.jstree('select_node', node);
        } else {
          this.updateNodesFromServer([id]);
        }
      } else {
        this.jstree('deselect_all');
      }
    },
    updateNodesFromServer: function (ids) {
      let blocking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (!this.getIsLoaded()) return;
      if (blocking && this.getIsUpdatingTree()) return;
      var self = this;
      this.setIsUpdatingTree(true);
      self.jstree('save_selected');
      self.jstree('open_node', this.getNodeByID(0));
      self.jstree('save_opened');
      self.jstree('save_selected');
      var selected = self.jstree('get_selected');
      return new Promise(resolve => {
        $.ajax({
          url: $.path.addSearchParams(this.data('urlUpdatetreenodes'), 'ids=' + ids.join(',')),
          dataType: 'json',
          success: function (data, xhr) {
            resolve(data);
            $.each(data, function (nodeId, nodeData) {
              var node = self.getNodeByID(nodeId);
              if (!nodeData) {
                self.jstree('delete_node', node);
                return;
              }
              if (node.length) {
                self.updateNode(node, nodeData.html, nodeData);
              } else {
                if (nodeData.ParentID && !self.find('li[data-id=' + nodeData.ParentID + ']').length) {
                  self.jstree('load_node', -1);
                } else {
                  self.createNode(nodeData.html, nodeData, node => {
                    if (!selected.length && ids.length === 1) {
                      selected = node;
                    }
                  });
                }
              }
            });
            if (selected.length) {
              self.jstree('deselect_all');
              self.jstree('reopen');
              self.jstree('select_node', selected);
            }
          },
          complete: function () {
            self.setIsUpdatingTree(false);
          }
        });
      });
    }
  });
  $('.cms-tree.multiple').entwine({
    onmatch: function () {
      this._super();
      this.jstree('show_checkboxes');
    },
    onunmatch: function () {
      this._super();
      this.jstree('uncheck_all');
      this.jstree('hide_checkboxes');
    },
    getSelectedIDs: function () {
      return $(this).jstree('get_checked').not('.disabled').map(function () {
        return $(this).data('id');
      }).get();
    }
  });
  $('.cms-tree li').entwine({
    setEnabled: function (bool) {
      this.toggleClass('disabled', !bool);
    },
    getClassname: function () {
      var matches = this.attr('class').match(/class-([^\s]*)/i);
      return matches ? matches[1] : '';
    },
    getID: function () {
      return this.data('id');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.TreeDropdownField.js":
/*!************************************************************!*\
  !*** ./client/src/legacy/LeftAndMain.TreeDropdownField.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.TreeDropdownField').entwine({
    'from .cms-container form': {
      onaftersubmitform: function (e) {
        this.find('.tree-holder').empty();
        this._super();
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.js":
/*!******************************************!*\
  !*** ./client/src/legacy/LeftAndMain.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _IframeDialog = _interopRequireDefault(__webpack_require__(/*! components/IframeDialog/IframeDialog */ "./client/src/components/IframeDialog/IframeDialog.js"));
var _Search = _interopRequireDefault(__webpack_require__(/*! components/Search/Search */ "./client/src/components/Search/Search.js"));
var _Loading = _interopRequireDefault(__webpack_require__(/*! components/Loading/Loading */ "./client/src/components/Loading/Loading.js"));
var _schemaFieldValues = __webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
var _lodash = _interopRequireDefault(__webpack_require__(/*! lodash.escaperegexp */ "./node_modules/lodash.escaperegexp/index.js"));
__webpack_require__(/*! ../legacy/ssui.core.js */ "./client/src/legacy/ssui.core.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
_jquery.default.noConflict();
window.ss = window.ss || {};
window.ss.debounce = function (func, wait, immediate) {
  var timeout, context, args;
  var later = function () {
    timeout = null;
    if (!immediate) func.apply(context, args);
  };
  return function () {
    var callNow = immediate && !timeout;
    context = this;
    args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
window.ss.tabStateUrl = function () {
  return window.ss.formatTabStateUrl(window.location.href);
};
window.ss.formatTabStateUrl = function (url) {
  return url.replace(/\?.*/, '').replace(/#.*/, '').replace(new RegExp(`^${(0, _lodash.default)((0, _jquery.default)('base').attr('href'))}/?`), '');
};
(0, _jquery.default)(window).on('resize.leftandmain', function (e) {
  (0, _jquery.default)('.cms-container').trigger('windowresize');
});
_jquery.default.entwine.warningLevel = _jquery.default.entwine.WARN_LEVEL_BESTPRACTISE;
_jquery.default.entwine('ss', function ($) {
  $(window).on("message", function (e) {
    var target,
      event = e.originalEvent,
      data = null;
    try {
      data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
    } catch (e) {}
    if (!data || $.path.parseUrl(window.location.href).domain !== $.path.parseUrl(event.origin).domain) return;
    target = typeof data.target === 'undefined' ? $(window) : $(data.target);
    switch (data.type) {
      case 'event':
        let eventType = data.event;
        let eventData = data.data;
        if (!eventType) {
          eventType = data.message.type;
        }
        if (!eventData) {
          eventData = data.message.payload;
        }
        target.trigger(eventType, eventData);
        break;
      case 'callback':
        target[data.callback].call(target, data.data);
        break;
    }
  });
  var positionLoadingSpinner = function () {
    var offset = 120;
    var spinner = $('.ss-loading-screen .loading-animation');
    var top = ($(window).height() - spinner.height()) / 2;
    spinner.css('top', top + offset);
    spinner.show();
  };
  var applyChosen = function (el) {
    if (el.is(':visible')) {
      el.addClass('has-chosen').chosen({
        allow_single_deselect: true,
        disable_search_threshold: 20,
        display_disabled_options: true,
        width: '100%'
      });
    } else {
      setTimeout(function () {
        el.show();
        applyChosen(el);
      }, 500);
    }
  };
  var isSameUrl = function (url1, url2) {
    var baseUrl = $('base').attr('href');
    url1 = $.path.isAbsoluteUrl(url1) ? url1 : $.path.makeUrlAbsolute(url1, baseUrl), url2 = $.path.isAbsoluteUrl(url2) ? url2 : $.path.makeUrlAbsolute(url2, baseUrl);
    var url1parts = $.path.parseUrl(url1),
      url2parts = $.path.parseUrl(url2);
    return url1parts.pathname.replace(/\/*$/, '') == url2parts.pathname.replace(/\/*$/, '') && url1parts.search == url2parts.search;
  };
  var ajaxCompleteEvent = window.ss.debounce(function () {
    $(window).trigger('ajaxComplete');
  }, 1000, true);
  $(window).on('resize', positionLoadingSpinner).trigger('resize');
  $(document).ajaxComplete(function (e, xhr, settings) {
    var origUrl = document.URL,
      url = xhr.getResponseHeader('X-ControllerURL'),
      destUrl = settings.url,
      msg = xhr.getResponseHeader('X-Status') !== null ? xhr.getResponseHeader('X-Status') : xhr.statusText,
      msgType = xhr.status < 200 || xhr.status > 399 ? 'error' : 'success',
      ignoredMessages = ['OK', 'success', 'load', 'HTTP/2.0 200'];
    if (url !== null && (!isSameUrl(origUrl, url) || !isSameUrl(destUrl, url))) {
      window.ss.router.show(url, {
        id: new Date().getTime() + String(Math.random()).replace(/\D/g, ''),
        pjax: xhr.getResponseHeader('X-Pjax') ? xhr.getResponseHeader('X-Pjax') : settings.headers['X-Pjax']
      });
    }
    if (xhr.getResponseHeader('X-Reauthenticate')) {
      $('.cms-container').showLoginDialog();
      return;
    }
    if (xhr.status !== 0 && msg && $.inArray(msg, ignoredMessages) === -1) {
      statusMessage(decodeURIComponent(msg), msgType);
    }
    ajaxCompleteEvent(this);
  });
  $('.cms-container').entwine({
    StateChangeXHR: null,
    FragmentXHR: {},
    StateChangeCount: 0,
    LayoutOptions: {
      minContentWidth: 940,
      minPreviewWidth: 400,
      mode: 'content'
    },
    onadd: function () {
      this.redraw();
      $('.ss-loading-screen').hide();
      $('body').removeClass('loading');
      $(window).off('resize', positionLoadingSpinner);
      this.restoreTabState();
      this._super();
    },
    'onwindowresize': function () {
      this.redraw();
    },
    'from .cms-panel': {
      ontoggle: function () {
        this.redraw();
      }
    },
    'from .cms-container': {
      onaftersubmitform: function () {
        this.redraw();
      }
    },
    updateLayoutOptions: function (newSpec) {
      var spec = this.getLayoutOptions();
      var dirty = false;
      for (var k in newSpec) {
        if (spec[k] !== newSpec[k]) {
          spec[k] = newSpec[k];
          dirty = true;
        }
      }
      if (dirty) this.redraw();
    },
    clearViewMode: function () {
      this.removeClass('cms-container--split-mode');
      this.removeClass('cms-container--preview-mode');
      this.removeClass('cms-container--content-mode');
    },
    splitViewMode: function () {
      this.updateLayoutOptions({
        mode: 'split'
      });
    },
    contentViewMode: function () {
      this.updateLayoutOptions({
        mode: 'content'
      });
    },
    previewMode: function () {
      this.updateLayoutOptions({
        mode: 'preview'
      });
    },
    RedrawSuppression: false,
    redraw: function () {
      if (this.getRedrawSuppression()) return;
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
      var changed = this.setProperMode();
      if (!changed) {
        this.find('.cms-panel-layout').redraw();
        this.find('.cms-content-fields[data-layout-type]').redraw();
        this.find('.cms-edit-form[data-layout-type]').redraw();
        this.find('.cms-preview').redraw();
        this.find('.cms-content').redraw();
      }
    },
    setProperMode: function () {
      var options = this.getLayoutOptions();
      var mode = options.mode;
      this.clearViewMode();
      var content = this.find('.cms-content');
      var preview = this.find('.cms-preview');
      content.css({
        'min-width': 0
      });
      preview.css({
        'min-width': 0
      });
      if (content.width() + preview.width() >= options.minContentWidth + options.minPreviewWidth) {
        content.css({
          'min-width': options.minContentWidth
        });
        preview.css({
          'min-width': options.minPreviewWidth
        });
        preview.trigger('enable');
      } else {
        preview.trigger('disable');
        if (mode == 'split') {
          preview.trigger('forcecontent');
          return true;
        }
      }
      this.addClass('cms-container--' + mode + '-mode');
      return false;
    },
    checkCanNavigate: function (selectors) {
      var contentEls = this._findFragments(selectors || ['Content']),
        trackedEls = contentEls.find(':data(changetracker)').add(contentEls.filter(':data(changetracker)')),
        safe = true;
      if (!trackedEls.length) {
        return true;
      }
      trackedEls.each(function () {
        if (!$(this).confirmUnsavedChanges()) {
          safe = false;
        }
      });
      return safe;
    },
    loadPanel: function (url) {
      let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      let forceReload = arguments.length > 3 ? arguments[3] : undefined;
      let forceReferer = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.URL;
      if (!this.checkCanNavigate(data.pjax ? data.pjax.split(',') : ['Content'])) {
        return;
      }
      this.clearTabState(window.ss.tabStateUrl());
      this.saveTabState(window.ss.formatTabStateUrl(url), true);
      data.__forceReferer = forceReferer;
      if (forceReload) {
        data.__forceReload = 1 + Math.random();
      }
      window.ss.router.show(url, data);
    },
    reloadCurrentPanel: function () {
      this.loadPanel(document.URL, null, null, true);
    },
    submitForm: function (form, button, callback, ajaxOptions) {
      var self = this;
      if (!button) button = this.find('.btn-toolbar :submit[name=action_save]');
      if (!button) button = this.find('.btn-toolbar :submit:first');
      form.trigger('beforesubmitform');
      this.trigger('submitform', {
        form: form,
        button: button
      });
      $(button).addClass('btn--loading loading');
      $(button).prop('disabled', true);
      if ($(button).is('button')) {
        $(button).data('original-text', $(button).text());
        $(button).append($('<div class="btn__loading-icon">' + '<span class="btn__circle btn__circle--1"></span>' + '<span class="btn__circle btn__circle--2"></span>' + '<span class="btn__circle btn__circle--3"></span>' + '</div>'));
        $(button).css($(button).outerWidth() + 'px');
      }
      var validationResult = form.validate();
      var clearButton = function () {
        $(button).removeClass('btn--loading loading');
        $(button).prop('disabled', false);
        $(button).find('.btn__loading-icon').remove();
        $(button).css('width', 'auto');
        $(button).text($(button).data('original-text'));
      };
      if (typeof validationResult !== 'undefined' && !validationResult) {
        statusMessage("Validation failed.", "bad");
        clearButton();
      }
      var formData = form.serializeArray();
      formData.push({
        name: $(button).attr('name'),
        value: '1'
      });
      formData.push({
        name: 'BackURL',
        value: document.URL.replace(/\/$/, '')
      });
      this.saveTabState(window.ss.tabStateUrl(), false);
      jQuery.ajax(jQuery.extend({
        headers: {
          "X-Pjax": "CurrentForm,Breadcrumbs,ValidationResult"
        },
        url: form.attr('action'),
        data: formData,
        type: 'POST',
        complete: function () {
          clearButton();
        },
        success: function (data, status, xhr) {
          clearButton();
          form.removeClass('changed');
          if (callback) callback(data, status, xhr);
          var newContentEls = self.handleAjaxResponse(data, status, xhr);
          if (!newContentEls) return;
          newContentEls.filter('form').trigger('aftersubmitform', {
            status: status,
            xhr: xhr,
            formData: formData
          });
        }
      }, ajaxOptions));
      return false;
    },
    LastState: null,
    PauseState: false,
    handleStateChange: function (event) {
      let historyState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.history.state;
      if (this.getPauseState()) {
        return;
      }
      if (this.getStateChangeXHR()) {
        this.getStateChangeXHR().abort();
      }
      var self = this,
        fragments = historyState.pjax || 'Content',
        headers = {},
        fragmentsArr = fragments.split(','),
        contentEls = this._findFragments(fragmentsArr);
      this.setStateChangeCount(this.getStateChangeCount() + 1);
      if (!this.checkCanNavigate()) {
        this.reverseStateChange();
        return;
      }
      if (contentEls.length < fragmentsArr.length) {
        fragments = 'Content', fragmentsArr = ['Content'];
        contentEls = this._findFragments(fragmentsArr);
      }
      this.trigger('beforestatechange', {
        state: historyState,
        element: contentEls
      });
      headers['X-Pjax'] = fragments;
      if (typeof historyState.__forceReferer !== 'undefined') {
        let url = historyState.__forceReferer;
        try {
          url = decodeURI(url);
        } catch (e) {} finally {
          headers['X-Backurl'] = encodeURI(url);
        }
      }
      contentEls.addClass('loading');
      let promise = $.ajax({
        headers: headers,
        url: historyState.path || document.URL
      }).fail((xhr, status, error) => {
        if (xhr.readyState !== 0 && xhr.getResponseHeader('X-Reauthenticate') !== '1') {
          this.reverseStateChange();
        }
      }).done((data, status, xhr) => {
        this.setLastState(historyState);
        var els = self.handleAjaxResponse(data, status, xhr, historyState);
        self.trigger('afterstatechange', {
          data: data,
          status: status,
          xhr: xhr,
          element: els,
          state: historyState
        });
      }).always(() => {
        self.setStateChangeXHR(null);
        contentEls.removeClass('loading');
      });
      this.setStateChangeXHR(promise);
      return promise;
    },
    reverseStateChange: function () {
      var lastState = this.getLastState();
      this.setPauseState(true);
      this.setStateChangeCount(this.getStateChangeCount() - 1);
      if (lastState && lastState.path) {
        window.ss.router.show(lastState.path);
        this.setPauseState(false);
      } else {
        window.ss.router.back();
        setTimeout(() => {
          this.setPauseState(false);
        });
      }
    },
    loadFragment: function (url, pjaxFragments) {
      var self = this,
        xhr,
        headers = {},
        baseUrl = $('base').attr('href'),
        fragmentXHR = this.getFragmentXHR();
      if (typeof fragmentXHR[pjaxFragments] !== 'undefined' && fragmentXHR[pjaxFragments] !== null) {
        fragmentXHR[pjaxFragments].abort();
        fragmentXHR[pjaxFragments] = null;
      }
      url = $.path.isAbsoluteUrl(url) ? url : $.path.makeUrlAbsolute(url, baseUrl);
      headers['X-Pjax'] = pjaxFragments;
      xhr = $.ajax({
        headers: headers,
        url: url,
        success: function (data, status, xhr) {
          var elements = self.handleAjaxResponse(data, status, xhr, null);
          self.trigger('afterloadfragment', {
            data: data,
            status: status,
            xhr: xhr,
            elements: elements
          });
        },
        error: function (xhr, status, error) {
          self.trigger('loadfragmenterror', {
            xhr: xhr,
            status: status,
            error: error
          });
        },
        complete: function () {
          var fragmentXHR = self.getFragmentXHR();
          if (typeof fragmentXHR[pjaxFragments] !== 'undefined' && fragmentXHR[pjaxFragments] !== null) {
            fragmentXHR[pjaxFragments] = null;
          }
        }
      });
      fragmentXHR[pjaxFragments] = xhr;
      return xhr;
    },
    handleAjaxResponse: function (data, status, xhr, state) {
      let guessFragment, fragment, $data;
      if (xhr.getResponseHeader('X-Reload') && xhr.getResponseHeader('X-ControllerURL')) {
        const baseUrl = $('base').attr('href');
        const rawURL = xhr.getResponseHeader('X-ControllerURL');
        const url = $.path.isAbsoluteUrl(rawURL) ? rawURL : $.path.makeUrlAbsolute(rawURL, baseUrl);
        document.location.href = url;
        return;
      }
      if (!data) return;
      var title = xhr.getResponseHeader('X-Title');
      if (title) document.title = decodeURIComponent(title.replace(/\+/g, ' '));
      let newFragments = {};
      let newContentEls;
      if (xhr.getResponseHeader('Content-Type').match(/^((text)|(application))\/json[ \t]*;?/i)) {
        newFragments = data;
      } else {
        $data = $($.parseHTML(data, document, false));
        guessFragment = 'Content';
        if ($data.is('form') && !$data.is('[data-pjax-fragment~=Content]')) guessFragment = 'CurrentForm';
        newFragments[guessFragment] = $data;
      }
      this.setRedrawSuppression(true);
      try {
        $.each(newFragments, function (newFragment, html) {
          var contentEl = $('[data-pjax-fragment]').filter(function () {
              return $.inArray(newFragment, $(this).data('pjaxFragment').split(' ')) != -1;
            }),
            newContentEl = $(html);
          if (newContentEls) newContentEls.add(newContentEl);else newContentEls = newContentEl;
          if (newContentEl.find('.cms-container').length) {
            throw 'Content loaded via ajax is not allowed to contain tags matching the ".cms-container" selector to avoid infinite loops';
          }
          var origStyle = contentEl.attr('style');
          var origParent = contentEl.parent();
          var layoutClasses = ['east', 'west', 'center', 'north', 'south', 'column-hidden'];
          var elemClasses = contentEl.attr('class');
          var origLayoutClasses = [];
          if (elemClasses) {
            origLayoutClasses = $.grep(elemClasses.split(' '), function (val) {
              return $.inArray(val, layoutClasses) >= 0;
            });
          }
          newContentEl.removeClass(layoutClasses.join(' ')).addClass(origLayoutClasses.join(' '));
          if (origStyle) newContentEl.attr('style', origStyle);
          var styles = newContentEl.find('style').detach();
          if (styles.length) $(document).find('head').append(styles);
          contentEl.replaceWith(newContentEl);
        });
        var newForm = newContentEls.filter('form');
        if (newForm.hasClass('cms-tabset')) newForm.removeClass('cms-tabset').addClass('cms-tabset');
      } finally {
        this.setRedrawSuppression(false);
      }
      this.redraw();
      this.restoreTabState(state && typeof state.tabState !== 'undefined' ? state.tabState : null);
      return newContentEls;
    },
    _findFragments: function (fragments) {
      return $('[data-pjax-fragment]').filter(function () {
        var i,
          nodeFragments = $(this).data('pjaxFragment').split(' ');
        for (i in fragments) {
          if ($.inArray(fragments[i], nodeFragments) != -1) return true;
        }
        return false;
      });
    },
    refresh: function () {
      $(window).trigger('statechange');
      $(this).redraw();
    },
    saveTabState: function (url, resetTab) {
      if (typeof window.sessionStorage == "undefined" || window.sessionStorage === null) return;
      if (url === undefined) {
        const url = window.ss.tabStateUrl();
      }
      var selectedTabs = [];
      this.find('.cms-tabset,.ss-tabset').each(function (i, el) {
        var id = $(el).attr('id');
        if (!id) return;
        if (!$(el).data('uiTabs')) return;
        if ($(el).data('ignoreTabState') || $(el).getIgnoreTabState()) return;
        selectedTabs.push({
          id: id,
          selected: resetTab ? 0 : $(el).tabs('option', 'active')
        });
      });
      if (selectedTabs) {
        var tabsUrl = 'tabs-' + url;
        try {
          window.sessionStorage.setItem(tabsUrl, JSON.stringify(selectedTabs));
        } catch (err) {
          if (err.code === DOMException.QUOTA_EXCEEDED_ERR && window.sessionStorage.length === 0) {
            return;
          } else {
            throw err;
          }
        }
      }
    },
    restoreTabState: function (overrideStates) {
      const tabsets = this.find('.cms-tabset, .ss-tabset');
      if (tabsets.length) {
        tabsets.each(function () {
          const tabset = $(this);
          const tabsetId = tabset.attr('id');
          const overrideState = overrideStates && overrideStates[tabsetId] ? overrideStates[tabsetId] : null;
          tabset.restoreState(overrideState);
        });
      } else {
        $('#Form_AddForm_action_doAdd').focus();
      }
    },
    clearTabState: function (url) {
      if (typeof window.sessionStorage == "undefined") return;
      var s = window.sessionStorage;
      if (url) {
        s.removeItem('tabs-' + url);
      } else {
        for (var i = 0; i < s.length; i++) {
          if (s.key(i).match(/^tabs-/)) s.removeItem(s.key(i));
        }
      }
    },
    clearCurrentTabState: function () {
      this.clearTabState(window.ss.tabStateUrl());
    },
    showLoginDialog: function () {
      let dialog = $('.leftandmain__login-dialog');
      if (dialog.length) {
        dialog.destroy();
      }
      dialog = $('<div class="leftandmain__login-dialog" />');
      $('body').append(dialog);
      dialog.open();
    }
  });
  $('.leftandmain__login-dialog').entwine({
    destroy() {
      this.close();
      this.remove();
    },
    close() {
      this.renderModal(false);
    },
    open() {
      this.renderModal(true);
    },
    renderModal(isOpen) {
      const tempid = $('body').data('member-tempid');
      const url = $.path.addSearchParams('CMSSecurity/login', {
        tempid,
        BackURL: window.location.href
      });
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(_IframeDialog.default, {
        title: i18n._t('Admin.CMS_LOGIN_TITLE', 'Login'),
        className: "login-dialog",
        bodyClassName: "login-dialog__body",
        iframeId: "login-dialog-iframe",
        iframeClassName: "login-dialog__body__iframe",
        isOpen: isOpen,
        url: url
      }));
    },
    reauthenticate(data) {
      if (typeof data.SecurityID !== 'undefined') {
        $(':input[name=SecurityID]').val(data.SecurityID);
      }
      if (typeof data.TempID !== 'undefined') {
        $('body').data('member-tempid', data.TempID);
      }
      this.close();
    }
  });
  $('form.loading,.cms-content.loading,.cms-content-fields.loading,.cms-content-view.loading,.ss-gridfield-item.loading').entwine({
    ReactRoot: null,
    onmatch: function () {
      this._super();
      const container = $('<div class="cms-loading-container"/>');
      this.append(container);
      const root = (0, _client.createRoot)(container[0]);
      root.render(_react.default.createElement(_Loading.default, null));
      this.setReactRoot(root);
    },
    onunmatch: function () {
      this._super();
      const container = this.find('.cms-loading-container');
      if (container && container.length) {
        const root = this.getReactRoot();
        if (root) {
          root.unmount();
          this.setReactRoot(null);
        }
        container.remove();
      }
    }
  });
  $('.cms .cms-panel-link').entwine({
    onclick: function (e) {
      if ($(this).hasClass('external-link')) {
        e.stopPropagation();
        return;
      }
      var href = this.attr('href'),
        url = href && !href.match(/^#/) ? href : this.data('href'),
        data = {
          pjax: this.data('pjaxTarget')
        };
      $('.cms-container').loadPanel(url, null, data);
      e.preventDefault();
    }
  });
  $('.cms button.action.discard-confirmation').entwine({
    onclick: function (e) {
      if (!$('.cms-container').checkCanNavigate()) {
        e.preventDefault();
      }
    }
  });
  $('.cms .ss-ui-button-ajax').entwine({
    onclick: function (e) {
      $(this).removeClass('ui-button-text-only');
      $(this).addClass('ss-ui-button-loading ui-button-text-icons');
      var loading = $(this).find(".ss-ui-loading-icon");
      if (loading.length < 1) {
        loading = $("<span></span>").addClass('ss-ui-loading-icon ui-button-icon-primary ui-icon');
        $(this).prepend(loading);
      }
      loading.show();
      var href = this.attr('href'),
        url = href ? href : this.data('href');
      jQuery.ajax({
        url: url,
        complete: function (xmlhttp, status) {
          var msg = xmlhttp.getResponseHeader('X-Status') ? xmlhttp.getResponseHeader('X-Status') : xmlhttp.responseText;
          try {
            if (typeof msg != "undefined" && msg !== null) eval(msg);
          } catch (e) {}
          loading.hide();
          $(".cms-container").refresh();
          $(this).removeClass('ss-ui-button-loading ui-button-text-icons');
          $(this).addClass('ui-button-text-only');
        },
        dataType: 'html'
      });
      e.preventDefault();
    }
  });
  $('.cms .ss-ui-dialog-link').entwine({
    UUID: null,
    onmatch: function () {
      this._super();
      this.setUUID(new Date().getTime());
    },
    onunmatch: function () {
      this._super();
    },
    onclick: function () {
      this._super();
      var self = this,
        id = 'ss-ui-dialog-' + this.getUUID();
      var dialog = $('#' + id);
      if (!dialog.length) {
        dialog = $('<div class="ss-ui-dialog" id="' + id + '" />');
        $('body').append(dialog);
      }
      var extraClass = this.data('popupclass') ? this.data('popupclass') : '';
      dialog.ssdialog({
        iframeUrl: this.attr('href'),
        autoOpen: true,
        dialogExtraClass: extraClass
      });
      return false;
    }
  });
  $('.cms .field.date input.text').entwine({
    onmatch: function () {
      var holder = $(this).parents('.field.date:first'),
        config = holder.data();
      if (!config.showcalendar) {
        this._super();
        return;
      }
      config.showOn = 'button';
      if (config.locale && $.datepicker.regional[config.locale]) {
        config = $.extend(config, $.datepicker.regional[config.locale], {});
      }
      if (!this.prop('disabled') && !this.prop('readonly')) {
        $(this).datepicker(config);
      }
      this._super();
    },
    onunmatch: function () {
      this._super();
    }
  });
  $('.cms .field.dropdown select, .cms .field select[multiple], .form__fieldgroup-item select.dropdown').entwine({
    onmatch: function () {
      if (this.is('.no-chosen')) {
        this._super();
        return;
      }
      if (!this.data('placeholder')) this.data('placeholder', ' ');
      this.removeClass('has-chosen').chosen("destroy");
      this.siblings('.chosen-container').remove();
      applyChosen(this);
      this._super();
    },
    onunmatch: function () {
      this._super();
    }
  });
  $(".cms-panel-layout").entwine({
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
    }
  });
  $('.cms .grid-field:not([cms-loading-ignore-url-params])').entwine({
    showDetailView: function (url, event) {
      this.openUrl(event, url, () => $('.cms-container').loadPanel(url));
    }
  });
  $(".cms-search-form button[type=reset], .cms-search-form input[type=reset]").entwine({
    onclick: function (e) {
      e.preventDefault();
      var form = $(this).parents('form');
      form.clearForm();
      form.find(".dropdown select").prop('selectedIndex', 0).trigger("chosen:updated");
      form.submit();
    }
  });
  window._panelDeferredCache = {};
  $('.cms-panel-deferred').entwine({
    onadd: function () {
      this._super();
      this.redraw();
    },
    onremove: function () {
      if (window.debug) console.log('saving', this.data('url'), this);
      if (!this.data('deferredNoCache')) window._panelDeferredCache[this.data('url')] = this.html();
      this._super();
    },
    redraw: function () {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
      var self = this,
        url = this.data('url');
      if (!url) throw 'Elements of class .cms-panel-deferred need a "data-url" attribute';
      this._super();
      if (!this.data('deferredNoCache') && typeof window._panelDeferredCache[url] !== 'undefined') {
        this.html(window._panelDeferredCache[url]);
      } else {
        this.addClass('loading');
        $.ajax({
          url: url,
          complete: function () {
            self.removeClass('loading');
          },
          success: function (data, status, xhr) {
            self.html(data);
          }
        });
      }
    }
  });
  $('.cms-tabset').entwine({
    onadd: function () {
      this.redrawTabs();
      this._super();
    },
    onremove: function () {
      if (this.data('uiTabs')) this.tabs('destroy');
      this._super();
    },
    redrawTabs: function () {
      this.rewriteHashlinks();
      var id = this.attr('id'),
        activeTab = this.find('ul:first .ui-tabs-active');
      if (!this.data('uiTabs')) this.tabs({
        active: activeTab.index() != -1 ? activeTab.index() : 0,
        beforeLoad: function (e, ui) {
          return false;
        },
        beforeActivate: function (e, ui) {
          var link = ui.oldTab.find('.cms-panel-link');
          if (link && link.length === 1) {
            return false;
          }
        },
        activate: function (e, ui) {
          var actions = $(this).closest('form').find('.btn-toolbar');
          if ($(ui.newTab).closest('li').hasClass('readonly')) {
            actions.fadeOut();
          } else {
            actions.show();
          }
        }
      });
      this.trigger('afterredrawtabs');
    },
    rewriteHashlinks: function () {
      $(this).find('ul a').each(function () {
        if (!$(this).attr('href')) return;
        var matches = $(this).attr('href').match(/#.*/);
        if (!matches) return;
        $(this).attr('href', document.location.href.replace(/#.*/, '') + matches[0]);
      });
    }
  });
  $('#filters-button').entwine({
    onmatch: function () {
      this._super();
      this.data('collapsed', true);
      this.data('animating', false);
    },
    onunmatch: function () {
      this._super();
    },
    showHide: function () {
      var self = this,
        $filters = $('.cms-content-filters').first(),
        collapsed = this.data('collapsed');
      if (collapsed) {
        this.addClass('active');
        $filters.removeClass('cms-content-filters--hidden');
      } else {
        this.removeClass('active');
        $filters.addClass('cms-content-filters--hidden');
      }
      self.data('collapsed', !collapsed);
    },
    onclick: function () {
      this.showHide();
    }
  });
  $('.js-injector-boot .search-holder').entwine({
    Component: null,
    ReactRoot: null,
    onmatch() {
      this._super();
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? {
        context: cmsContent
      } : {};
      const Search = (0, _Injector.loadComponent)('Search', context);
      this.setComponent(Search);
      this.refresh();
      const props = this.data('schema');
    },
    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
    onfocusin() {
      this.css('z-index', '100');
    },
    onfocusout() {
      this.css('z-index', '');
    },
    close() {
      $('#filters-button').showHide();
      const props = this.data('schema');
      if (props.filters) {
        const url = $('.cms-search-form').attr('action');
        const container = this.closest('.cms-container');
        container.loadPanel(url, "", {}, true);
      }
    },
    search(data) {
      this._super();
      let url = $('.cms-search-form').attr('action');
      if (url && data) {
        const params = [];
        for (const [key, value] of Object.entries(data)) {
          if (value) {
            params[`q[${key}]`] = value;
          }
        }
        if (Object.keys(params).length === 0) {
          params[`q[${this.data('schema').name}]`] = "";
        }
        url = $.path.addSearchParams(url, params);
        $('.cms-panel-deferred.cms-content-view').data('deferredNoCache', true);
        var container = this.closest('.cms-container');
        container.loadPanel(url, "", {}, true);
      }
    },
    refresh() {
      const props = this.data('schema');
      const Search = this.getComponent();
      const handleHide = () => this.close();
      const handleSearch = data => this.search(data);
      const narrowView = this.closest('.cms-content-tools').attr('id') === 'cms-content-tools-CMSMain';
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(Search, _extends({
        id: "Search",
        identifier: "Search",
        display: "VISIBLE",
        displayBehavior: "HIDEABLE",
        filterPrefix: "Search__",
        onHide: handleHide,
        onSearch: handleSearch,
        borders: {
          left: !narrowView
        }
      }, props)));
      this.setReactRoot(root);
    }
  });
});
function decodeEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.innerText;
}
var statusMessage = function (text, type) {
  text = decodeEntities(text);
  jQuery.noticeAdd({
    text: text,
    type: type,
    stayTime: 5000,
    inEffect: {
      left: '0',
      opacity: 'show'
    }
  });
};

/***/ }),

/***/ "./client/src/legacy/ModelAdmin.js":
/*!*****************************************!*\
  !*** ./client/src/legacy/ModelAdmin.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
__webpack_require__(/*! ./LeftAndMain.js */ "./client/src/legacy/LeftAndMain.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.cms-content-tools #Form_SearchForm').entwine({
    onsubmit: function (e) {
      this.trigger('beforeSubmit');
    }
  });
  $('.importSpec').entwine({
    onmatch: function () {
      this.find('div.details').hide();
      this.find('a.detailsLink').click(function () {
        $('#' + $(this).attr('href').replace(/.*#/, '')).slideToggle();
        return false;
      });
      this._super();
    },
    onunmatch: function () {
      this._super();
    }
  });
  $('.cms .btn.clear-search').entwine({
    onclick: function (e) {
      e.preventDefault();
      var container = this.parents('.cms-container');
      container.loadPanel(this.attr('href'), '', {}, true, false);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/PermissionCheckboxSetField.js":
/*!*********************************************************!*\
  !*** ./client/src/legacy/PermissionCheckboxSetField.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.permissioncheckboxset .valADMIN input').entwine({
    onmatch: function () {
      this._super();
    },
    onunmatch: function () {
      this._super();
    },
    onclick: function (e) {
      this.toggleCheckboxes();
    },
    toggleCheckboxes: function () {
      var checkboxes = $(this).parents('.field:eq(0)').find('.checkbox').not(this);
      if ($(this).is(':checked')) {
        checkboxes.each(function () {
          $(this).data('SecurityAdmin.oldChecked', $(this).attr('checked'));
          $(this).data('SecurityAdmin.oldDisabled', $(this).attr('disabled'));
          $(this).attr('disabled', 'disabled');
          $(this).attr('checked', 'checked');
        });
      } else {
        checkboxes.each(function () {
          var oldChecked = $(this).data('SecurityAdmin.oldChecked');
          var oldDisabled = $(this).data('SecurityAdmin.oldDisabled');
          if (oldChecked !== null) $(this).attr('checked', oldChecked);
          if (oldDisabled !== null) $(this).attr('disabled', oldDisabled);
        });
      }
    }
  });
  $('.permissioncheckboxset .valCMS_ACCESS_LeftAndMain input').entwine({
    getCheckboxesExceptThisOne: function () {
      return $(this).parents('.field:eq(0)').find('li').filter(function (i) {
        var klass = $(this).attr('class');
        return klass ? klass.match(/CMS_ACCESS_/) : false;
      }).find('.checkbox').not(this);
    },
    onadd: function () {
      this.toggleCheckboxes();
      this._super();
    },
    onclick: function (e) {
      this.toggleCheckboxes();
    },
    toggleCheckboxes: function () {
      var checkboxes = this.getCheckboxesExceptThisOne();
      if ($(this).is(':checked')) {
        checkboxes.each(function () {
          $(this).data('PermissionCheckboxSetField.oldChecked', $(this).is(':checked'));
          $(this).data('PermissionCheckboxSetField.oldDisabled', $(this).is(':disabled'));
          $(this).prop('disabled', 'disabled');
          $(this).prop('checked', 'checked');
        });
      } else {
        checkboxes.each(function () {
          $(this).prop('checked', $(this).data('PermissionCheckboxSetField.oldChecked'));
          $(this).prop('disabled', $(this).data('PermissionCheckboxSetField.oldDisabled'));
        });
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/SearchableDropdownField/SearchableDropdownFieldEntwine.js":
/*!*************************************************************************************!*\
  !*** ./client/src/legacy/SearchableDropdownField/SearchableDropdownFieldEntwine.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
window.jQuery.entwine('ss', $ => {
  $('.js-injector-boot .ss-searchable-dropdown-field').entwine({
    Root: null,
    Component: null,
    onmatch() {
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? {
        context: cmsContent
      } : {};
      const schema = this.data('schema');
      if (schema) {
        this.data('entwine-value', schema.value);
        const Root = (0, _client.createRoot)(this[0]);
        const ReactField = (0, _Injector.loadComponent)(schema.component, context);
        this.setRoot(Root);
        this.setComponent(ReactField);
        this._super();
        this.refresh();
      }
    },
    onunmatch() {
      const Root = this.getRoot();
      if (Root) {
        Root.unmount();
      }
    },
    getProps() {
      return {
        ...this.data('schema'),
        value: this.data('entwine-value') || '',
        onChange: this.handleChange.bind(this)
      };
    },
    refresh() {
      const Root = this.getRoot();
      const ReactField = this.getComponent();
      const props = this.getProps();
      Root.render(_react.default.createElement(ReactField, _extends({}, props, {
        noHolder: true
      })));
    },
    handleChange(value) {
      this.data('entwine-value', value);
      this.refresh();
    }
  });
  $('.cms-edit-form').entwine({
    getChangeTrackerOptions() {
      const isDefault = this.entwineData('ChangeTrackerOptions') === undefined;
      let opts = this._super();
      if (isDefault) {
        opts = $.extend({}, opts);
        opts.ignoreFieldSelector += ', .ss-searchable-dropdown-field .no-change-track :input';
        this.setChangeTrackerOptions(opts);
      }
      return opts;
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/SecurityAdmin.js":
/*!********************************************!*\
  !*** ./client/src/legacy/SecurityAdmin.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
__webpack_require__(/*! ./LeftAndMain.js */ "./client/src/legacy/LeftAndMain.js");
__webpack_require__(/*! ./PermissionCheckboxSetField.js */ "./client/src/legacy/PermissionCheckboxSetField.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var refreshAfterImport = function (e) {
  var existingFormMessage = (0, _jquery.default)((0, _jquery.default)(this).contents()).find('.message');
  if (existingFormMessage && existingFormMessage.html()) {
    var memberTableField = (0, _jquery.default)(window.parent.document).find('#Form_EditForm_Members').get(0);
    if (memberTableField) memberTableField.refresh();
    var tree = (0, _jquery.default)(window.parent.document).find('.cms-tree').get(0);
    if (tree) tree.reload();
  }
};
(0, _jquery.default)('#MemberImportFormIframe, #GroupImportFormIframe').entwine({
  onadd: function () {
    this._super();
    (0, _jquery.default)(this).on('load', refreshAfterImport);
  }
});
_jquery.default.entwine('ss', function ($) {
  $('.permissioncheckboxset .checkbox[value=ADMIN]').entwine({
    onadd: function () {
      this.toggleCheckboxes();
      this._super();
    },
    onclick: function (e) {
      this.toggleCheckboxes();
    },
    toggleCheckboxes: function () {
      var self = this,
        checkboxes = this.parents('.field:eq(0)').find('.checkbox').not(this);
      if (this.is(':checked')) {
        checkboxes.each(function () {
          $(this).data('SecurityAdmin.oldChecked', $(this).is(':checked'));
          $(this).data('SecurityAdmin.oldDisabled', $(this).is(':disabled'));
          $(this).prop('disabled', true);
          $(this).prop('checked', true);
        });
      } else {
        checkboxes.each(function () {
          $(this).prop('checked', $(this).data('SecurityAdmin.oldChecked'));
          $(this).prop('disabled', $(this).data('SecurityAdmin.oldDisabled'));
        });
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/SelectionGroup.js":
/*!*********************************************!*\
  !*** ./client/src/legacy/SelectionGroup.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _jquery.default)(document).ready(function () {
  (0, _jquery.default)(document).on('click', 'ul.SelectionGroup input.selector, ul.selection-group input.selector', function () {
    var li = (0, _jquery.default)(this).closest('li');
    li.addClass('selected');
    var prev = li.prevAll('li.selected');
    if (prev.length) {
      prev.removeClass('selected');
    }
    var next = li.nextAll('li.selected');
    if (next.length) {
      next.removeClass('selected');
    }
    (0, _jquery.default)(this).focus();
  });
});

/***/ }),

/***/ "./client/src/legacy/TabSet.js":
/*!*************************************!*\
  !*** ./client/src/legacy/TabSet.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
__webpack_require__(/*! ../../../thirdparty/jquery-ui/jquery-ui.js */ "./thirdparty/jquery-ui/jquery-ui.js");
__webpack_require__(/*! ../../../thirdparty/jquery-cookie/jquery.cookie.js */ "./thirdparty/jquery-cookie/jquery.cookie.js");
__webpack_require__(/*! ../../../thirdparty/jquery-entwine/jquery.entwine.js */ "./thirdparty/jquery-entwine/jquery.entwine.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.ss-tabset, .cms-tabset').entwine({
    DeferRestoreState: false,
    DefferredStateOverride: null,
    onmatch: function () {
      var hash = window.location.hash;
      if (hash !== '') {
        this.openTabFromURL(hash);
      }
      this._super();
    },
    onadd: function () {
      this.on('tabsactivate', function (event, _ref) {
        let {
          newPanel
        } = _ref;
        this.lazyLoadGridFields(newPanel);
        this.triggerLazyLoad(newPanel);
      }.bind(this));
      this.on('tabscreate', function (event, _ref2) {
        let {
          panel
        } = _ref2;
        this.lazyLoadGridFields(panel);
        this.triggerLazyLoad(panel);
      }.bind(this));
      this._super();
    },
    restoreState: function (overrideState) {
      const hasSessionStorage = typeof window.sessionStorage !== "undefined" && window.sessionStorage;
      const sessionData = hasSessionStorage ? window.sessionStorage.getItem('tabs-' + window.ss.tabStateUrl()) : null;
      const sessionStates = sessionData ? JSON.parse(sessionData) : false;
      let index, tab;
      const tabsetId = this.attr('id');
      const forcedTab = this.children('ul').children('li.ss-tabs-force-active');
      if (!this.data('uiTabs')) {
        this.setDeferRestoreState(true);
        this.setDefferredStateOverride(overrideState);
        return;
      }
      this.tabs('refresh');
      if (forcedTab.length) {
        index = forcedTab.first().index();
      } else if (overrideState) {
        tab = this.find(overrideState.tabSelector);
        if (tab.length) {
          index = tab.index();
        }
      } else if (sessionStates) {
        $.each(sessionStates, function (i, state) {
          if (tabsetId == state.id) {
            index = state.selected;
          }
        });
      }
      if (index !== null && index !== undefined) {
        this.tabs('option', 'active', index);
        this.parents('.cms-container').trigger('tabstaterestored');
      }
    },
    triggerLazyLoad: function (panel) {
      let selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.lazy-loadable';
      panel.find(selector).each((idx, el) => {
        var $el = $(el);
        var lazyEvent = el.dataset.lazyEvent || 'lazyload';
        if ($el.closest('.ss-tabset, .cms-tabset').is(this)) {
          el.dispatchEvent(new Event(lazyEvent));
        }
      });
    },
    lazyLoadGridFields: function (panel) {
      panel.find('.grid-field--lazy-loadable').each((i, el) => {
        const gridfield = $(el);
        if (gridfield.closest('.ss-tabset, .cms-tabset').is(this)) {
          $(el).lazyload();
        }
      });
    },
    openTabFromURL: function (hash) {
      var $trigger;
      $.each(this.find('.ui-tabs-anchor'), function () {
        if (this.href.indexOf(hash) !== -1 && $(hash).length === 1) {
          $trigger = $(this);
          return false;
        }
      });
      if ($trigger === void 0) {
        return;
      }
      $(() => {
        $trigger.click();
      });
    },
    redrawTabs: function () {
      this._super();
      if (this.getDeferRestoreState()) {
        this.restoreState(this.getDefferredStateOverride());
        this.setDeferRestoreState(false);
        this.setDefferredStateOverride(null);
      }
    }
  }), $('.ss-tabset').entwine({
    IgnoreTabState: false,
    onadd: function () {
      this.redrawTabs();
      this._super();
    },
    onremove: function () {
      if (this.data('uiTabs')) this.tabs('destroy');
      this._super();
    },
    redrawTabs: function () {
      if ($(this).hasClass('ss-tabset')) {
        this.rewriteHashlinks();
        this.tabs();
      } else {
        this._super();
      }
    },
    rewriteHashlinks: function () {
      $(this).find('ul a').each(function () {
        if (!$(this).attr('href')) return;
        var matches = $(this).attr('href').match(/#.*/);
        if (!matches) return;
        $(this).attr('href', document.location.href.replace(/#.*/, '') + matches[0]);
      });
    }
  });
  $('.ui-tabs-active .ui-tabs-anchor').entwine({
    onmatch: function () {
      this.addClass('nav-link active');
    },
    onunmatch: function () {
      this.removeClass('active');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/ToastsContainer.js":
/*!**********************************************!*\
  !*** ./client/src/legacy/ToastsContainer.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _Injector = _interopRequireWildcard(__webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js"));
var _ToastsActions = __webpack_require__(/*! state/toasts/ToastsActions */ "./client/src/state/toasts/ToastsActions.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ToastsContainer = (0, _Injector.loadComponent)('ToastsContainer');
_jquery.default.entwine('ss', $ => {
  $('body').entwine({
    onmatch() {
      const container = $('<div class="toasts-container"></div>');
      this.append(container);
      const root = (0, _client.createRoot)(container[0]);
      root.render(_react.default.createElement(ToastsContainer, null));
    }
  });
});
(jquery => {
  jquery.extend({
    noticeAdd(options) {
      _Injector.default.ready(() => {
        const {
          dispatch
        } = _Injector.default.reducer.store;
        dispatch((0, _ToastsActions.display)(options));
      });
    }
  });
})(_jquery.default);

/***/ }),

/***/ "./client/src/legacy/ToggleCompositeField.js":
/*!***************************************************!*\
  !*** ./client/src/legacy/ToggleCompositeField.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
__webpack_require__(/*! ../../../thirdparty/jquery-ui/jquery-ui.js */ "./thirdparty/jquery-ui/jquery-ui.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', function ($) {
  $('.ss-toggle').entwine({
    onadd: function () {
      this._super();
      this.accordion({
        heightStyle: "content",
        collapsible: true,
        active: this.hasClass("ss-toggle-start-closed") ? false : 0
      });
    },
    onremove: function () {
      if (this.data('uiAccordion')) this.accordion('destroy');
      this._super();
    },
    getTabSet: function () {
      return this.closest(".ss-tabset");
    },
    fromTabSet: {
      ontabsshow: function () {
        this.accordion("resize");
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/TreeDropdownField/TreeDropdownFieldEntwine.js":
/*!*************************************************************************!*\
  !*** ./client/src/legacy/TreeDropdownField/TreeDropdownFieldEntwine.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _schemaFieldValues = __webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js");
var _TreeDropdownField = __webpack_require__(/*! components/TreeDropdownField/TreeDropdownField */ "./client/src/components/TreeDropdownField/TreeDropdownField.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
_jquery.default.entwine('ss', $ => {
  $('.js-injector-boot .TreeDropdownField').entwine({
    Value: null,
    Timer: null,
    Component: null,
    ReactRoot: null,
    onmatch() {
      this._super();
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? {
        context: cmsContent
      } : {};
      const TreeDropdownField = (0, _Injector.loadComponent)('TreeDropdownField', context);
      this.setComponent(TreeDropdownField);
      const state = this.data('state') || {};
      const schema = this.data('schema') || {};
      const isMultiple = schema.data && schema.data.multiple;
      if (isMultiple) {
        this.setValue(state.value && state.value !== _TreeDropdownField.MULTI_EMPTY_VALUE ? state.value.map(next => Number(next)) : []);
      } else {
        this.setValue(state.value ? Number(state.value) : '');
      }
      this.refresh();
    },
    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
    refresh() {
      const props = this.getAttributes();
      const onChange = value => {
        this.setValue(value);
        this.refresh();
        clearTimeout(this.getTimer());
        const timer = setTimeout(() => {
          this.find('input').trigger('change');
        }, 0);
        this.setTimer(timer);
      };
      const TreeDropdownField = this.getComponent();
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(TreeDropdownField, _extends({}, props, {
        onChange: onChange,
        value: this.getValue(),
        noHolder: true
      })));
      this.setReactRoot(root);
    },
    getAttributes() {
      const state = this.data('state');
      const schema = this.data('schema');
      return (0, _schemaFieldValues.schemaMerge)(schema, state);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/UsedOnTable/UsedOnTableEntwine.js":
/*!*************************************************************!*\
  !*** ./client/src/legacy/UsedOnTable/UsedOnTableEntwine.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _client = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var _schemaFieldValues = __webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js");
var _Injector = __webpack_require__(/*! lib/Injector */ "./client/src/lib/Injector.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('.js-injector-boot .used-on__polyfill-holder').entwine({
    Timer: null,
    Component: null,
    ReactRoot: null,
    onmatch() {
      this._super();
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? {
        context: cmsContent
      } : {};
      const UsedOnTable = (0, _Injector.loadComponent)('UsedOnTable', context);
      this.setComponent(UsedOnTable);
      this.refresh();
    },
    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
    refresh() {
      const props = this.getAttributes();
      const UsedOnTable = this.getComponent();
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
      }
      root.render(_react.default.createElement(UsedOnTable, props));
      this.setReactRoot(root);
    },
    getAttributes() {
      const state = this.data('state');
      const schema = this.data('schema');
      return (0, _schemaFieldValues.schemaMerge)(schema, state);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/jquery.changetracker.js":
/*!***************************************************!*\
  !*** ./client/src/legacy/jquery.changetracker.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _lodash = _interopRequireDefault(__webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @class Tracks onchange events on all form fields.
 *
 * Setup:
 * 	jQuery('<my-form>).changetracker();
 *
 * Finding out if the form has changed:
 * 	jQuery('<my-form>).is('.changed');
 *
 * Options:
 * fieldSelector: jQuery selector string for tracked fields (Default: ':input:not(:submit),:select:not(:submit)')
 * ignoreFieldSelector: jQuery selector string for specifically excluded fields
 * changedCssClass: CSS class attribute which is appended to all changed fields and the form itself
 *
 *
 * @name jQuery.changetracker
 * @author Ingo Schommer, SilverStripe Ltd.
 * @license BSD License
 */
(function ($) {
  $.fn.changetracker = function (_options) {
    var self = this;
    if (this.length > 1) {
      this.each(function (i, item) {
        this.changetracker(_options);
      });
      return this;
    }
    this.defaults = {
      fieldSelector: ':input:not(:button,[type="submit"],[type="search"],.gridstate)',
      ignoreFieldSelector: '.no-change-track,[type="search"]',
      changedCssClass: 'changed'
    };
    var options = $.extend({}, this.defaults, _options);
    this.initialize = function () {
      if ($.meta) options = $.extend({}, options, this.data());
      self.data('dirty', false);
      var fieldValue = function ($field) {
        if ($field.is(':radio')) {
          var checkedItems = self.find(':input[name=' + $field.attr('name') + ']:checked');
          return checkedItems.length ? checkedItems.val() : 0;
        }
        if ($field.is(':checkbox')) {
          return $field.is(':checked') ? 1 : 0;
        }
        var value = $field.val();
        if ($field && $field.hasClass('htmleditor')) {
          var editorClass = $field.data('editor') || 'default';
          switch (editorClass) {
            case 'tinyMCE':
            case 'default':
              var config = $.extend({
                forced_root_block: 'p'
              }, $field.data('config'));
              var serializer = tinymce.html.Serializer(config);
              var parser = tinymce.html.DomParser(config);
              value = serializer.serialize(parser.parse(value));
              break;
          }
        }
        return value;
      };
      var formValue = function () {
        var value = [];
        self.getFields().each(function () {
          var name = $(this).prop('name');
          if (name) {
            value.push({
              name: name,
              value: fieldValue($(this))
            });
          }
        });
        return JSON.stringify(value);
      };
      var initialState = formValue();
      var isChanged = function () {
        var newState = formValue();
        return self.data('dirty') || initialState !== newState;
      };
      var detectChanges = function (e) {
        if (e && $(e.target).is(options.ignoreFieldSelector)) {
          return;
        }
        var changed = isChanged();
        self.toggleClass(options.changedCssClass, changed);
      };
      var handleChanges = function (e) {
        var $field = $(e.target);
        var origVal = $field.data('changetracker.origVal');
        if ($field.is(options.ignoreFieldSelector)) {
          return;
        }
        var newVal = fieldValue($field);
        if (origVal === null || newVal !== origVal) {
          $field.addClass(options.changedCssClass);
          self.addClass(options.changedCssClass);
        } else {
          $field.removeClass(options.changedCssClass);
          if ($field.is(':radio')) {
            self.find(':radio[name=' + $field.attr('name') + ']').removeClass(options.changedCssClass);
          }
          ondetect();
        }
      };
      var ondetect = (0, _lodash.default)(detectChanges, 250, {
        leading: true,
        trailing: true
      });
      var onchange = (0, _lodash.default)(handleChanges, 250, {
        leading: true,
        trailing: true
      });
      self.on('click.changetracker', options.fieldSelector, onchange);
      self.on('keyup.changetracker', options.fieldSelector, onchange);
      self.on('change.changetracker', options.fieldSelector, onchange);
      self.on('change.changetracker', ondetect);
      this.getFields().each(function () {
        var origVal = fieldValue($(this));
        $(this).data('changetracker.origVal', origVal);
      });
      self.on('dirty.changetracker', function () {
        self.data('dirty', true);
        ondetect();
      });
      this.data('changetracker', true);
    };
    this.destroy = function () {
      this.reset();
      this.off('.changetracker').removeData('changetracker');
    };
    this.reset = function () {
      this.getFields().each(function () {
        self.resetField(this);
      });
      this.data('dirty', false).removeClass(options.changedCssClass);
    };
    this.resetField = function (field) {
      return $(field).removeData('changetracker.origVal').removeClass(options.changedCssClass);
    };
    this.getFields = function () {
      return this.find(options.fieldSelector).not(options.ignoreFieldSelector + ', .search-box *');
    };
    if (typeof arguments[0] === 'string') {
      var property = arguments[1];
      var args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      return this[arguments[0]].apply(this, args);
    } else {
      var self = this;
      setTimeout(function () {
        self.initialize();
      }, 0);
      return this;
    }
  };
})(jQuery);

/***/ }),

/***/ "./client/src/legacy/sspath.js":
/*!*************************************!*\
  !*** ./client/src/legacy/sspath.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var $window = (0, _jquery.default)(window),
  $html = (0, _jquery.default)('html'),
  $head = (0, _jquery.default)('head'),
  path = {
    urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
    parseUrl: function (url) {
      if (_jquery.default.type(url) === "object") {
        return url;
      }
      var matches = path.urlParseRE.exec(url || "") || [];
      return {
        href: matches[0] || "",
        hrefNoHash: matches[1] || "",
        hrefNoSearch: matches[2] || "",
        domain: matches[3] || "",
        protocol: matches[4] || "",
        doubleSlash: matches[5] || "",
        authority: matches[6] || "",
        username: matches[8] || "",
        password: matches[9] || "",
        host: matches[10] || "",
        hostname: matches[11] || "",
        port: matches[12] || "",
        pathname: matches[13] || "",
        directory: matches[14] || "",
        filename: matches[15] || "",
        search: matches[16] || "",
        hash: matches[17] || ""
      };
    },
    makePathAbsolute: function (relPath, absPath) {
      if (relPath && relPath.charAt(0) === "/") {
        return relPath;
      }
      relPath = relPath || "";
      absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";
      var absStack = absPath ? absPath.split("/") : [],
        relStack = relPath.split("/");
      for (var i = 0; i < relStack.length; i++) {
        var d = relStack[i];
        switch (d) {
          case ".":
            break;
          case "..":
            if (absStack.length) {
              absStack.pop();
            }
            break;
          default:
            absStack.push(d);
            break;
        }
      }
      return "/" + absStack.join("/");
    },
    isSameDomain: function (absUrl1, absUrl2) {
      return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
    },
    isRelativeUrl: function (url) {
      return path.parseUrl(url).protocol === "";
    },
    isAbsoluteUrl: function (url) {
      return path.parseUrl(url).protocol !== "";
    },
    makeUrlAbsolute: function (relUrl, absUrl) {
      if (!path.isRelativeUrl(relUrl)) {
        return relUrl;
      }
      var relObj = path.parseUrl(relUrl),
        absObj = path.parseUrl(absUrl),
        protocol = relObj.protocol || absObj.protocol,
        doubleSlash = relObj.protocol ? relObj.doubleSlash : relObj.doubleSlash || absObj.doubleSlash,
        authority = relObj.authority || absObj.authority,
        hasPath = relObj.pathname !== "",
        pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
        search = relObj.search || !hasPath && absObj.search || "",
        hash = relObj.hash;
      return protocol + doubleSlash + authority + pathname + search + hash;
    },
    addSearchParams: function (url, params) {
      var u = path.parseUrl(url),
        params = typeof params === "string" ? path.convertSearchToArray(params) : params,
        newParams = _jquery.default.extend(path.convertSearchToArray(u.search), params),
        paramStr = path.convertObjectToSearch(newParams);
      return u.hrefNoSearch + '?' + paramStr + (u.hash || "");
    },
    getSearchParams: function (url) {
      var u = path.parseUrl(url);
      return path.convertSearchToArray(u.search);
    },
    convertSearchToArray: function (search) {
      var parts,
        i,
        tmp,
        params = {};
      search = search.replace(/^\?/, '');
      parts = search ? search.split('&') : [];
      for (i = 0; i < parts.length; i++) {
        tmp = parts[i].split('=');
        params[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
      }
      return params;
    },
    convertObjectToSearch(params) {
      let encodedParts = [];
      for (var key in params) {
        encodedParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
      return encodedParts.join('&');
    },
    convertUrlToDataUrl: function (absUrl) {
      var u = path.parseUrl(absUrl);
      if (path.isEmbeddedPage(u)) {
        return u.hash.split(dialogHashKey)[0].replace(/^#/, "");
      } else if (path.isSameDomain(u, document)) {
        return u.hrefNoHash.replace(document.domain, "");
      }
      return absUrl;
    },
    get: function (newPath) {
      if (newPath === undefined) {
        newPath = location.hash;
      }
      return path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
    },
    getFilePath: function (path) {
      var splitkey = '&' + _jquery.default.mobile.subPageUrlKey;
      return path && path.split(splitkey)[0].split(dialogHashKey)[0];
    },
    set: function (path) {
      location.hash = path;
    },
    isPath: function (url) {
      return /\//.test(url);
    },
    clean: function (url) {
      return url.replace(document.domain, "");
    },
    stripHash: function (url) {
      return url.replace(/^#/, "");
    },
    cleanHash: function (hash) {
      return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
    },
    isExternal: function (url) {
      var u = path.parseUrl(url);
      return u.protocol && u.domain !== document.domain ? true : false;
    },
    hasProtocol: function (url) {
      return /^(:?\w+:)/.test(url);
    }
  };
_jquery.default.path = path;

/***/ }),

/***/ "./client/src/legacy/ssui.core.js":
/*!****************************************!*\
  !*** ./client/src/legacy/ssui.core.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
__webpack_require__(/*! ../../../thirdparty/jquery-ui/jquery-ui.js */ "./thirdparty/jquery-ui/jquery-ui.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.widget("ssui.ssdialog", _jquery.default.ui.dialog, {
  options: {
    iframeUrl: '',
    reloadOnOpen: true,
    dialogExtraClass: '',
    modal: true,
    bgiframe: true,
    autoOpen: false,
    autoPosition: true,
    minWidth: 500,
    maxWidth: 800,
    minHeight: 300,
    maxHeight: 700,
    widthRatio: 0.8,
    heightRatio: 0.8,
    resizable: false
  },
  _create: function () {
    _jquery.default.ui.dialog.prototype._create.call(this);
    var self = this;
    var iframe = (0, _jquery.default)('<iframe marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto"></iframe>');
    iframe.on('load', function (e) {
      if ((0, _jquery.default)(this).attr('src') == 'about:blank') return;
      iframe.addClass('loaded').show();
      self._resizeIframe();
      self.uiDialog.removeClass('loading');
    }).hide();
    if (this.options.dialogExtraClass) this.uiDialog.addClass(this.options.dialogExtraClass);
    this.element.append(iframe);
    if (this.options.iframeUrl) this.element.css('overflow', 'hidden');
  },
  open: function () {
    _jquery.default.ui.dialog.prototype.open.call(this);
    var self = this,
      iframe = this.element.children('iframe');
    if (this.options.iframeUrl && (!iframe.hasClass('loaded') || this.options.reloadOnOpen)) {
      iframe.hide();
      iframe.attr('src', this.options.iframeUrl);
      this.uiDialog.addClass('loading');
    }
    (0, _jquery.default)(window).on('resize.ssdialog', function () {
      self._resizeIframe();
    });
  },
  close: function () {
    _jquery.default.ui.dialog.prototype.close.call(this);
    this.uiDialog.off('resize.ssdialog');
    (0, _jquery.default)(window).off('resize.ssdialog');
  },
  _resizeIframe: function () {
    var opts = {},
      newWidth,
      newHeight,
      iframe = this.element.children('iframe');
    ;
    if (this.options.widthRatio) {
      newWidth = (0, _jquery.default)(window).width() * this.options.widthRatio;
      if (this.options.minWidth && newWidth < this.options.minWidth) {
        opts.width = this.options.minWidth;
      } else if (this.options.maxWidth && newWidth > this.options.maxWidth) {
        opts.width = this.options.maxWidth;
      } else {
        opts.width = newWidth;
      }
    }
    if (this.options.heightRatio) {
      newHeight = (0, _jquery.default)(window).height() * this.options.heightRatio;
      if (this.options.minHeight && newHeight < this.options.minHeight) {
        opts.height = this.options.minHeight;
      } else if (this.options.maxHeight && newHeight > this.options.maxHeight) {
        opts.height = this.options.maxHeight;
      } else {
        opts.height = newHeight;
      }
    }
    if (!jQuery.isEmptyObject(opts)) {
      this._setOptions(opts);
      iframe.attr('width', opts.width - parseFloat(this.element.css('paddingLeft')) - parseFloat(this.element.css('paddingRight')));
      iframe.attr('height', opts.height - parseFloat(this.element.css('paddingTop')) - parseFloat(this.element.css('paddingBottom')));
      if (this.options.autoPosition) {
        this._setOption("position", this.options.position);
      }
    }
  }
});
_jquery.default.widget("ssui.titlebar", {
  _create: function () {
    this.originalTitle = this.element.attr('title');
    var self = this;
    var options = this.options;
    var title = options.title || this.originalTitle || '&nbsp;';
    var titleId = _jquery.default.ui.dialog.getTitleId(this.element);
    this.element.parent().addClass('ui-dialog');
    var uiDialogTitlebar = this.element.addClass('ui-dialog-titlebar ' + 'ui-widget-header ' + 'ui-corner-all ' + 'ui-helper-clearfix');
    if (options.closeButton) {
      var uiDialogTitlebarClose = (0, _jquery.default)('<a href="#"/>').addClass('ui-dialog-titlebar-close ' + 'ui-corner-all').attr('role', 'button').hover(function () {
        uiDialogTitlebarClose.addClass('ui-state-hover');
      }, function () {
        uiDialogTitlebarClose.removeClass('ui-state-hover');
      }).focus(function () {
        uiDialogTitlebarClose.addClass('ui-state-focus');
      }).blur(function () {
        uiDialogTitlebarClose.removeClass('ui-state-focus');
      }).mousedown(function (ev) {
        ev.stopPropagation();
      }).appendTo(uiDialogTitlebar);
      var uiDialogTitlebarCloseText = (this.uiDialogTitlebarCloseText = (0, _jquery.default)('<span/>')).addClass('ui-icon ' + 'ui-icon-closethick').text(options.closeText).appendTo(uiDialogTitlebarClose);
    }
    var uiDialogTitle = (0, _jquery.default)('<span/>').addClass('ui-dialog-title').attr('id', titleId).html(title).prependTo(uiDialogTitlebar);
    uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();
  },
  destroy: function () {
    this.element.off('.dialog').removeData('dialog').removeClass('ui-dialog-content ui-widget-content').hide().appendTo('body');
    this.originalTitle && this.element.attr('title', this.originalTitle);
  }
});
_jquery.default.extend(_jquery.default.ssui.titlebar, {
  version: "0.0.1",
  options: {
    title: '',
    closeButton: false,
    closeText: 'close'
  },
  uuid: 0,
  getTitleId: function ($el) {
    return 'ui-dialog-title-' + ($el.attr('id') || ++this.uuid);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Backend.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Backend.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _es6Promise = _interopRequireDefault(__webpack_require__(/*! es6-promise */ "./node_modules/es6-promise/dist/es6-promise.js"));
var _qs = _interopRequireDefault(__webpack_require__(/*! qs */ "./node_modules/qs/lib/index.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! merge */ "./node_modules/merge/lib/src/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_es6Promise.default.polyfill();
function checkStatus(response) {
  let ret = null;
  let error = null;
  if (response.status >= 200 && response.status < 300) {
    ret = response;
  } else {
    error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  return ret;
}
function encodeBody(data) {
  let encodedData = null;
  if (data instanceof FormData || typeof data === 'string') {
    encodedData = data;
  } else if (data && typeof data === 'object') {
    encodedData = JSON.stringify(data);
  } else {
    throw new Error('Invalid body type');
  }
  return encodedData;
}
function encode(contentType, data) {
  switch (contentType) {
    case 'application/x-www-form-urlencoded':
      return _qs.default.stringify(data);
    case 'application/json':
    case 'application/x-json':
    case 'application/x-javascript':
    case 'text/javascript':
    case 'text/x-javascript':
    case 'text/x-json':
      return JSON.stringify(data);
    default:
      throw new Error(`Can\'t encode format: ${contentType}`);
  }
}
function decode(contentType, text) {
  switch (contentType) {
    case 'application/x-www-form-urlencoded':
      return _qs.default.parse(text);
    case 'application/json':
    case 'application/x-json':
    case 'application/x-javascript':
    case 'text/javascript':
    case 'text/x-javascript':
    case 'text/x-json':
      return JSON.parse(text);
    default:
      throw new Error(`Can\'t decode format: ${contentType}`);
  }
}
function addQuerystring(url, querystring) {
  if (querystring === '') {
    return url;
  }
  if (url.match(/\?/)) {
    return `${url}&${querystring}`;
  }
  return `${url}?${querystring}`;
}
function parseResponse(response) {
  return response.text().then(body => decode(response.headers.get('Content-Type'), body));
}
function applySchemaToData(payloadSchema, data) {
  return Object.keys(data).reduce((prev, key) => {
    const schema = payloadSchema[key];
    if (schema && (schema.remove === true || schema.querystring === true)) {
      return prev;
    }
    return Object.assign(prev, {
      [key]: data[key]
    });
  }, {});
}
function applySchemaToUrl(payloadSchema, url, data) {
  let opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    setFromData: false
  };
  let newUrl = url;
  const queryData = Object.keys(data).reduce((prev, key) => {
    const schema = payloadSchema[key];
    const includeThroughSetFromData = opts.setFromData === true && !(schema && schema.remove === true);
    const includeThroughSpec = schema && schema.querystring === true && schema.remove !== true;
    if (includeThroughSetFromData || includeThroughSpec) {
      return Object.assign(prev, {
        [key]: data[key]
      });
    }
    return prev;
  }, {});
  const encodedQuery = encode('application/x-www-form-urlencoded', queryData);
  newUrl = addQuerystring(newUrl, encodedQuery);
  newUrl = Object.keys(payloadSchema).reduce((prev, key) => {
    const replacement = payloadSchema[key].urlReplacement;
    if (replacement) {
      return prev.replace(replacement, data[key]);
    }
    return prev;
  }, newUrl);
  return newUrl;
}
class Backend {
  constructor() {
    this.fetch = _isomorphicFetch.default;
  }
  createEndpointFetcher(endpointSpec) {
    var _this = this;
    const refinedSpec = Object.assign({
      method: 'get',
      payloadFormat: 'application/x-www-form-urlencoded',
      responseFormat: 'application/json',
      payloadSchema: {},
      defaultData: {}
    }, endpointSpec);
    const formatShortcuts = {
      json: 'application/json',
      urlencoded: 'application/x-www-form-urlencoded'
    };
    ['payloadFormat', 'responseFormat'].forEach(key => {
      if (formatShortcuts[refinedSpec[key]]) refinedSpec[key] = formatShortcuts[refinedSpec[key]];
    });
    return function () {
      let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const mergedHeaders = Object.assign({}, headers, {
        Accept: refinedSpec.responseFormat,
        'Content-Type': refinedSpec.payloadFormat
      });
      const mergedData = _merge.default.recursive({}, refinedSpec.defaultData, data);
      const url = applySchemaToUrl(refinedSpec.payloadSchema, refinedSpec.url, mergedData, {
        setFromData: refinedSpec.method.toLowerCase() === 'get'
      });
      const encodedData = refinedSpec.method.toLowerCase() !== 'get' ? encode(refinedSpec.payloadFormat, applySchemaToData(refinedSpec.payloadSchema, mergedData)) : '';
      const args = refinedSpec.method.toLowerCase() === 'get' ? [url, mergedHeaders] : [url, encodedData, mergedHeaders];
      return _this[refinedSpec.method.toLowerCase()](...args).then(parseResponse);
    };
  }
  get(url) {
    let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.fetch(url, {
      method: 'get',
      credentials: 'same-origin',
      headers
    }).then(checkStatus);
  }
  post(url) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const defaultHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.fetch(url, {
      method: 'post',
      credentials: 'same-origin',
      body: encodeBody(data),
      headers: Object.assign({}, defaultHeaders, headers)
    }).then(checkStatus);
  }
  put(url) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.fetch(url, {
      method: 'put',
      credentials: 'same-origin',
      body: encodeBody(data),
      headers
    }).then(checkStatus);
  }
  delete(url) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.fetch(url, {
      method: 'delete',
      credentials: 'same-origin',
      body: encodeBody(data),
      headers
    }).then(checkStatus);
  }
}
const backend = new Backend();
var _default = exports["default"] = backend;

/***/ }),

/***/ "./client/src/lib/Config.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Config.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class Config {
  static get(key) {
    return window.ss.config[key];
  }
  static getAll() {
    return window.ss.config;
  }
  static getSection(key) {
    return window.ss.config.sections.find(section => section.name === key);
  }
  static getCurrentSection() {}
}
var _default = exports["default"] = Config;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/DataFormat.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/DataFormat.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.decodeQuery = decodeQuery;
exports.fileSize = fileSize;
exports.getFileExtension = getFileExtension;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _qs = _interopRequireDefault(__webpack_require__(/*! qs */ "./node_modules/qs/lib/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function decodeQuery(query) {
  return _qs.default.parse(query.replace(/^\?/, ''));
}
function fileSize(size) {
  let number = null;
  let metric = '';
  if (size < 1024) {
    number = size;
    metric = 'bytes';
  } else if (size < 1024 * 10) {
    number = Math.round(size / 1024 * 10) / 10;
    metric = 'KB';
  } else if (size < 1024 * 1024) {
    number = Math.round(size / 1024);
    metric = 'KB';
  } else if (size < 1024 * 1024 * 10) {
    number = Math.round(size / (1024 * 1024) * 10) / 10;
    metric = 'MB';
  } else if (size < 1024 * 1024 * 1024) {
    number = Math.round(size / (1024 * 1024));
    metric = 'MB';
  }
  if (!number && number !== 0 || !metric) {
    number = Math.round(size / (1024 * 1024 * 1024) * 10) / 10;
    metric = 'GB';
  }
  if (isNaN(number)) {
    return _i18n.default._t('Admin.NO_SIZE', 'N/A');
  }
  return `${number} ${metric}`;
}
function getFileExtension(filename) {
  return /[.]/.exec(filename) ? filename.replace(/^.+[.]/, '') : '';
}

/***/ }),

/***/ "./client/src/lib/Injector.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Injector.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "InjectorContext", ({
  enumerable: true,
  get: function () {
    return _InjectorContext.default;
  }
}));
exports.graphqlTemplates = exports["default"] = void 0;
Object.defineProperty(exports, "inject", ({
  enumerable: true,
  get: function () {
    return _inject.default;
  }
}));
Object.defineProperty(exports, "injectGraphql", ({
  enumerable: true,
  get: function () {
    return _injectGraphql.default;
  }
}));
Object.defineProperty(exports, "loadComponent", ({
  enumerable: true,
  get: function () {
    return _loadComponent.default;
  }
}));
Object.defineProperty(exports, "provideContext", ({
  enumerable: true,
  get: function () {
    return _provideContext.default;
  }
}));
Object.defineProperty(exports, "provideInjector", ({
  enumerable: true,
  get: function () {
    return _provideInjector.default;
  }
}));
Object.defineProperty(exports, "withInjector", ({
  enumerable: true,
  get: function () {
    return _withInjector.default;
  }
}));
var _provideInjector = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/provideInjector */ "./client/src/lib/dependency-injection/provideInjector.js"));
var _provideContext = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/provideContext */ "./client/src/lib/dependency-injection/provideContext.js"));
var _withInjector = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/withInjector */ "./client/src/lib/dependency-injection/withInjector.js"));
var _inject = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/inject */ "./client/src/lib/dependency-injection/inject.js"));
var _injectGraphql = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/injectGraphql */ "./client/src/lib/dependency-injection/injectGraphql.js"));
var graphqlTemplates = _interopRequireWildcard(__webpack_require__(/*! ./dependency-injection/graphql/templates */ "./client/src/lib/dependency-injection/graphql/templates.js"));
exports.graphqlTemplates = graphqlTemplates;
var _loadComponent = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/loadComponent */ "./client/src/lib/dependency-injection/loadComponent.js"));
var _Container = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/Container */ "./client/src/lib/dependency-injection/Container.js"));
var _InjectorContext = _interopRequireDefault(__webpack_require__(/*! ./dependency-injection/InjectorContext */ "./client/src/lib/dependency-injection/InjectorContext.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports["default"] = _Container.default;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ReactRouteRegister.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ReactRouteRegister.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class ReactRouteRegister {
  constructor() {
    this.reset();
  }
  reset() {
    this.childRoutes = [];
    this.rootRoute = {
      path: '/',
      routes: () => this.getChildRoutes()
    };
  }
  updateRootRoute(route) {
    this.rootRoute = Object.assign({}, this.rootRoute, route);
  }
  add(route) {
    let parentPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (route.path === this.rootRoute.path && Array.isArray(route.routes)) {
      this.childRoutes = route.routes.concat(this.childRoutes);
      return;
    }
    const routes = this.findChildRoute(parentPaths);
    const newRoute = Object.assign({}, {
      routes: []
    }, route);
    let splatRoute = newRoute.routes[newRoute.routes.length - 1];
    if (!splatRoute || splatRoute.path !== '**') {
      splatRoute = {
        path: '**'
      };
      newRoute.routes.push(splatRoute);
    }
    const newRouteIndex = routes.findIndex(childRoute => childRoute.path === route.path);
    if (newRouteIndex >= 0) {
      routes[newRouteIndex] = newRoute;
    } else {
      routes.unshift(newRoute);
    }
  }
  findChildRoute(parentPaths) {
    let childRoutes = this.childRoutes;
    if (parentPaths) {
      parentPaths.forEach(path => {
        const nextParent = childRoutes.find(childRoute => childRoute.path === path);
        if (!nextParent) {
          throw new Error(`Parent path ${path} could not be found.`);
        }
        childRoutes = nextParent.routes;
      });
    }
    return childRoutes;
  }
  getRootRoute() {
    return this.rootRoute;
  }
  getChildRoutes() {
    return this.childRoutes;
  }
  remove(path) {
    let parentPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const childRoutes = this.findChildRoute(parentPaths);
    const routeIndex = childRoutes.findIndex(childRoute => childRoute.path === path);
    if (routeIndex < 0) {
      return null;
    }
    return childRoutes.splice(routeIndex, 1)[0];
  }
}
window.ss = window.ss || {};
window.ss.routeRegister = window.ss.routeRegister || new ReactRouteRegister();
var _default = exports["default"] = window.ss.routeRegister;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Router.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Router.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _page = _interopRequireDefault(__webpack_require__(/*! page.js */ "./node_modules/page.js/index.js"));
var _url = _interopRequireDefault(__webpack_require__(/*! url */ "./node_modules/url/url.js"));
var _lodash = _interopRequireDefault(__webpack_require__(/*! lodash.escaperegexp */ "./node_modules/lodash.escaperegexp/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function resolveURLToBase(path) {
  const absoluteBase = _page.default.getAbsoluteBase();
  const absolutePath = _url.default.resolve(absoluteBase, path);
  if (absolutePath.indexOf(absoluteBase) !== 0) {
    return absolutePath;
  }
  const regex = new RegExp(`^${(0, _lodash.default)(absoluteBase)}/?`);
  return absolutePath.replace(regex, '/');
}
function show(pageShow) {
  return (path, state, dispatch, push) => pageShow(_page.default.resolveURLToBase(path), state, dispatch, push);
}
function routeAppliesToCurrentLocation(route) {
  const r = new _page.default.Route(route);
  return r.match(_page.default.current, {});
}
function getAbsoluteBase() {
  return _page.default.absoluteBaseURL;
}
function setAbsoluteBase(base) {
  _page.default.absoluteBaseURL = base.replace(/\/?$/, '/');
  const a = document.createElement('a');
  a.href = base;
  let basePath = a.pathname;
  basePath = basePath.replace(/\/$/, '');
  if (basePath.match(/^[^\/]/)) {
    basePath = `/${basePath}`;
  }
  _page.default.base(basePath);
}
if (!_page.default.oldshow) {
  _page.default.oldshow = _page.default.show;
}
_page.default.setAbsoluteBase = setAbsoluteBase.bind(_page.default);
_page.default.getAbsoluteBase = getAbsoluteBase.bind(_page.default);
_page.default.resolveURLToBase = resolveURLToBase.bind(_page.default);
_page.default.show = show(_page.default.oldshow);
_page.default.routeAppliesToCurrentLocation = routeAppliesToCurrentLocation;
window.ss = window.ss || {};
window.ss.router = window.ss.router || _page.default;
var _default = exports["default"] = window.ss.router;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ShortcodeSerialiser.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ShortcodeSerialiser.js ***!
  \*************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sanitiseShortCodeProperties = exports["default"] = exports.createHTMLSanitiser = void 0;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const stringifyRegex = regexp => regexp.toString().slice(1, -1);
const SHORTCODE_ATTRS = stringifyRegex(/((?:[,\s]+(?:[a-z0-9\-_]+)=(?:(?:[a-z0-9\-_]+)|(?:\d+\.\d+)|(?:'[^']*')|(?:"[^"]*")))*)/);
const SHORTCODE_ATTR = /[,\s]+([a-z0-9\-_]+)=(?:([a-z0-9\-_]+)|(\d+\.\d+)|(?:'([^']*)')|(?:"([^"]*)"))/;
const SHORTCODE_OPEN = stringifyRegex(/\[%s/);
const SHORTCODE_RIGHT_BRACKET = '\\]';
const SHORTCODE_CLOSE = stringifyRegex(/\[\s*\/\s*%s\s*]/);
const SHORTCODE_CONTENT = stringifyRegex(/((?:.|\n|)*?)/);
const SHORTCODE_SPACE = stringifyRegex(/\s*/);
const ShortcodeSerialiser = {
  match(name, wrapped, content) {
    const open = _i18n.default.sprintf(SHORTCODE_OPEN, name);
    let pattern = `${open}${SHORTCODE_ATTRS}${SHORTCODE_SPACE}${SHORTCODE_RIGHT_BRACKET}`;
    if (wrapped) {
      pattern = `${pattern}${SHORTCODE_CONTENT}${_i18n.default.sprintf(SHORTCODE_CLOSE, name)}`;
    }
    const regex = new RegExp(pattern, 'i');
    const match = regex.exec(content);
    if (!match) {
      return null;
    }
    const properties = this.parseProperties(match[1]);
    return {
      name,
      wrapped,
      properties,
      original: match[0],
      content: wrapped ? match[2] : null
    };
  },
  parseProperties(input) {
    let unmatched = input;
    const result = {};
    let match = unmatched.match(SHORTCODE_ATTR);
    while (match) {
      const key = match[1] || '';
      const value = match[2] || match[3] || match[4] || match[5] || '';
      if (key) {
        result[key] = value;
      }
      const idx = unmatched.indexOf(match[0]);
      unmatched = unmatched.substr(idx + match[0].length);
      match = unmatched.match(SHORTCODE_ATTR);
    }
    return result;
  },
  serialise(object) {
    let attributesafe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const rule = attributesafe ? {
      sep: ',',
      quote: '',
      replacer: /[^a-z0-9\-_.]/gi
    } : {
      sep: ' ',
      quote: '"',
      replacer: /"/g
    };
    const attrs = Object.entries(object.properties).map(_ref => {
      let [name, value] = _ref;
      return value ? `${rule.sep}${name}=${rule.quote}${`${value}`.replace(rule.replacer, '')}${rule.quote}` : null;
    }).filter(attr => attr !== null).join('');
    if (object.wrapped) {
      return `[${object.name}${attrs}]${object.content}[/${object.name}]`;
    }
    return `[${object.name}${attrs}]`;
  }
};
const createHTMLSanitiser = () => {
  const div = document.createElement('div');
  return str => {
    if (str === undefined) {
      return '';
    }
    div.textContent = str;
    return div.innerHTML;
  };
};
exports.createHTMLSanitiser = createHTMLSanitiser;
const sanitiseShortCodeProperties = rawProperties => {
  const sanitise = createHTMLSanitiser();
  return Object.entries(rawProperties).reduce((props, _ref2) => {
    let [name, value] = _ref2;
    return {
      ...props,
      [name]: sanitise(value)
    };
  }, {});
};
exports.sanitiseShortCodeProperties = sanitiseShortCodeProperties;
var _default = exports["default"] = ShortcodeSerialiser;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/SilverStripeComponent.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/SilverStripeComponent.js ***!
  \***************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
let warned = false;
let timer = null;
class SilverStripeComponent extends _react.Component {
  constructor() {
    super();
    clearTimeout(timer);
    if (!warned && "development" !== 'production') {
      timer = setTimeout(() => {
        console.warn('SilverStripeComponent will be removed');
        warned = true;
      });
    }
  }
  render() {
    return null;
  }
}
SilverStripeComponent.propTypes = {};
var _default = exports["default"] = SilverStripeComponent;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/TinyMCEActionRegistrar.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/TinyMCEActionRegistrar.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const createIdentifier = (configId, menu) => configId ? `${configId}.${menu}` : menu;
class TinyMCEActionRegistrar {
  constructor() {
    this.actions = {};
    this.editorCommandsToUrlTestsMap = {};
    this.defaultCommand = 'sslinkexternal';
  }
  addAction(menu, action, configId) {
    const priority = action.priority || 50;
    const name = createIdentifier(configId, menu);
    const actions = this.getActions(menu, configId, true);
    action.type = 'menuitem';
    if (action.hasOwnProperty('onclick')) {
      action.onAction = action.onclick;
      delete action.onclick;
    }
    if (!actions.find(registeredAction => action.text === registeredAction.text)) {
      this.actions[name] = [...this.getActions(menu, configId, false), {
        ...action,
        priority
      }];
    }
    return this;
  }
  getActions(menu, configId) {
    let includingGlobal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let actions = (!configId || includingGlobal) && this.actions[menu] ? this.actions[menu] : [];
    const name = createIdentifier(configId, menu);
    if (configId && this.actions[name]) {
      actions = [...actions, ...this.actions[name]];
    }
    return actions;
  }
  getSortedActions(menu, configId) {
    let includingGlobal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    const actions = this.getActions(menu, configId, includingGlobal);
    return actions.sort((a, b) => {
      const priorityDiff = b.priority - a.priority;
      if (priorityDiff) {
        return priorityDiff;
      }
      return a.text.toLocaleLowerCase() > b.text.toLocaleLowerCase() ? 1 : -1;
    });
  }
  addCommandWithUrlTest(command, test) {
    this.editorCommandsToUrlTestsMap[command] = test;
    return this;
  }
  setDefaultCommand(command) {
    this.defaultCommand = command;
    return this;
  }
  getDefaultCommand() {
    return this.defaultCommand;
  }
  getEditorCommandFromUrl(url) {
    let command = this.getDefaultCommand();
    const commands = Object.keys(this.editorCommandsToUrlTestsMap);
    const matchedCmd = commands.find(cmd => this.editorCommandsToUrlTestsMap[cmd] && this.editorCommandsToUrlTestsMap[cmd].test(url));
    if (matchedCmd) {
      command = matchedCmd;
    }
    return command;
  }
}
window.ss = window.ss || {};
window.ss.tinymceactions = window.ss.tinymceactions || new TinyMCEActionRegistrar();
var _default = exports["default"] = window.ss.tinymceactions;

/***/ }),

/***/ "./client/src/lib/Validator.js":
/*!*************************************!*\
  !*** ./client/src/lib/Validator.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _validator = _interopRequireDefault(__webpack_require__(/*! validator */ "./node_modules/validator/index.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Validator {
  constructor(values) {
    this.setValues(values);
  }
  setValues(values) {
    this.values = values;
  }
  getFieldValue(name) {
    let value = this.values[name];
    if (typeof value !== 'string') {
      if (typeof value === 'undefined' || value === null || value === false) {
        value = '';
      } else {
        value = value.toString();
      }
    }
    return value;
  }
  validateValue(value, emptyValues, rule, config) {
    if (emptyValues.includes(value)) {
      return rule !== 'required';
    }
    switch (rule) {
      case 'equals':
        {
          const otherValue = this.getFieldValue(config.field);
          return _validator.default.equals(value, otherValue);
        }
      case 'numeric':
        {
          return _validator.default.isNumeric(value);
        }
      case 'date':
        {
          return _validator.default.isDate(value);
        }
      case 'alphanumeric':
        {
          return _validator.default.isAlphanumeric(value);
        }
      case 'alpha':
        {
          return _validator.default.isAlpha(value);
        }
      case 'regex':
        {
          return _validator.default.matches(value, config.pattern);
        }
      case 'max':
        {
          return value.length <= config.length;
        }
      case 'email':
        {
          return _validator.default.isEmail(value);
        }
      default:
        {
          console.warn(`Unknown validation rule used: '${rule}'`);
          return false;
        }
    }
  }
  validateFieldSchema(fieldSchema) {
    return this.validateField(fieldSchema.name, fieldSchema.validation, fieldSchema.leftTitle !== null ? fieldSchema.leftTitle : fieldSchema.title, fieldSchema.customValidationMessage);
  }
  getMessage(rule, config) {
    const name = config.title;
    const message = typeof config.message === 'string' ? config.message : _i18n.default._t(`Admin.VALIDATOR_MESSAGE_${rule.toUpperCase()}`, _i18n.default._t('Admin.VALIDATOR_MESSAGE_DEFAULT', '{name} is not a valid value.'));
    return _i18n.default.inject(message, {
      name
    });
  }
  validateField(name, rules, title, overrideMessage) {
    const response = {
      valid: true,
      errors: []
    };
    if (!rules) {
      return response;
    }
    const value = this.getFieldValue(name);
    let emptyValues = [''];
    if (rules.required && typeof rules.required === 'object' && rules.required.hasOwnProperty('extraEmptyValues')) {
      emptyValues = emptyValues.concat(rules.required.extraEmptyValues);
    }
    if (rules.required && emptyValues.includes(value)) {
      const config = Object.assign({
        title: title !== '' ? title : name
      }, rules.required);
      const message = overrideMessage || this.getMessage('required', config);
      return {
        valid: false,
        errors: [message]
      };
    }
    Object.entries(rules).forEach(ruleEntry => {
      const [rule, initConfig] = ruleEntry;
      const config = Object.assign({
        title: name
      }, {
        title
      }, initConfig);
      if (rule === 'required') {
        return;
      }
      const valid = this.validateValue(value, emptyValues, rule, config);
      if (!valid) {
        const message = this.getMessage(rule, config);
        response.valid = false;
        response.errors.push(message);
      }
    });
    if (overrideMessage && !response.valid) {
      response.errors = [overrideMessage];
    }
    return response;
  }
}
var _default = exports["default"] = Validator;

/***/ }),

/***/ "./client/src/lib/castStringToElement.js":
/*!***********************************************!*\
  !*** ./client/src/lib/castStringToElement.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = castStringToElement;
exports.mapHighlight = mapHighlight;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function mapHighlight(haystack, needle, Tag) {
  let index = 0;
  let search = haystack;
  const results = [];
  const part = needle.toLocaleLowerCase();
  while (index !== -1) {
    index = search.toLocaleLowerCase().indexOf(part);
    if (index !== -1) {
      const next = index + needle.length;
      const start = search.substring(0, index);
      const found = search.substring(index, next);
      const end = search.substring(next);
      if (start.length) {
        results.push(start);
      }
      results.push(Tag ? _react.default.createElement(Tag, {
        key: results.length / 2
      }, found) : found);
      search = end;
    }
  }
  results.push(search);
  return results;
}
function castStringToElement(Container, value) {
  let props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (value && typeof value.react !== 'undefined') {
    return _react.default.createElement(Container, props, value.react);
  }
  if (value && typeof value.html !== 'undefined') {
    if (value.html !== null) {
      const html = {
        __html: value.html
      };
      return _react.default.createElement(Container, _extends({}, props, {
        dangerouslySetInnerHTML: html
      }));
    }
    return null;
  }
  let body = null;
  if (value && typeof value.text !== 'undefined') {
    body = value.text;
  } else {
    body = value;
  }
  if (body && typeof body === 'object') {
    throw new Error(`Unsupported string value ${JSON.stringify(body)}`);
  }
  if (body !== null && typeof body !== 'undefined') {
    return _react.default.createElement(Container, props, body);
  }
  return null;
}

/***/ }),

/***/ "./client/src/lib/constants.js":
/*!*************************************!*\
  !*** ./client/src/lib/constants.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SPLITMODE_BREAKPOINT = void 0;
const SPLITMODE_BREAKPOINT = exports.SPLITMODE_BREAKPOINT = 800;

/***/ }),

/***/ "./client/src/lib/createClassMap.js":
/*!******************************************!*\
  !*** ./client/src/lib/createClassMap.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const createClassMap = classesStr => {
  const classConfig = {};
  if (classesStr) {
    classesStr.split(' ').forEach(className => {
      if (className !== '') {
        classConfig[className] = true;
      }
    });
  }
  return classConfig;
};
var _default = exports["default"] = createClassMap;

/***/ }),

/***/ "./client/src/lib/createErrorBlock.js":
/*!********************************************!*\
  !*** ./client/src/lib/createErrorBlock.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.createErrorHtml = exports.createErrorBlock = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createErrorHtml = errors => ({
  type: 'error',
  value: {
    react: errors.map((error, index) => _react.default.createElement("span", {
      key: index,
      className: "form__validation-message"
    }, error))
  }
});
exports.createErrorHtml = createErrorHtml;
const createErrorBlock = errors => Object.entries(errors).reduce((prev, curr) => {
  const [fieldName, messages] = curr;
  if (!messages || !messages.length) {
    return prev;
  }
  const messageList = Array.isArray(messages) ? messages : [messages];
  return {
    ...prev,
    [fieldName]: createErrorHtml(messageList)
  };
}, {});
exports.createErrorBlock = createErrorBlock;
var _default = exports["default"] = createErrorBlock;

/***/ }),

/***/ "./client/src/lib/dependency-injection/ApolloGraphqlManager.js":
/*!*********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/ApolloGraphqlManager.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _graphqlTag = _interopRequireDefault(__webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/lib/index.js"));
var _helpers = __webpack_require__(/*! ./graphql/helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
var _ApolloGraphqlProxy = _interopRequireDefault(__webpack_require__(/*! ./ApolloGraphqlProxy */ "./client/src/lib/dependency-injection/ApolloGraphqlProxy.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TEMPLATE_OVERRIDE = '__TEMPLATE_OVERRIDE__';
const protectedConfig = ['templateName', 'fields', 'params', 'fragments'];
const deferredApolloConfig = ['options', 'props', 'variables', 'skip', 'update'];
const configDefaults = {
  params: {},
  args: {},
  fields: [],
  fragments: [],
  pagination: true,
  apolloConfig: {}
};
class ApolloGraphqlManager {
  constructor(config, templates, fragments) {
    const mergedConfig = {
      ...configDefaults,
      ...config
    };
    mergedConfig.fields = [...mergedConfig.fields];
    const {
      apolloConfig,
      ...otherConfig
    } = mergedConfig;
    this.config = otherConfig;
    this.apolloConfigInitValues = apolloConfig;
    this.apolloConfigTransforms = {};
    this.templates = {
      ...templates
    } || {};
    this.fragments = {
      ...fragments
    } || {};
    this.reduceApolloConfig = this.reduceApolloConfig.bind(this);
  }
  setConfig(name, value) {
    if (protectedConfig.includes(name)) {
      throw new Error(`Tried to set protected config values: '${name}', which is discouraged.`);
    }
    this.config = {
      ...this.config,
      [name]: value
    };
    return this;
  }
  transformApolloConfig(config, callback) {
    const transformList = this.apolloConfigTransforms[config] || [];
    this.apolloConfigTransforms = {
      ...this.apolloConfigTransforms,
      [config]: [...transformList, callback]
    };
    return this;
  }
  addParam(name, type) {
    if (!name || !type) {
      throw new Error('addParam must be passed a name and type parameter');
    }
    return this.addParams({
      [name]: type
    });
  }
  addParams() {
    let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const existing = this.config.params;
    this.config.params = {
      ...existing,
      ...params
    };
    return this;
  }
  addArg(name, variableName) {
    let path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _helpers.ROOT_FIELD;
    return this.addArgs({
      [name]: variableName
    }, path);
  }
  addArgs() {
    let args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.ROOT_FIELD;
    const existing = this.config.args[path] || {};
    this.config.args[path] = {
      ...existing,
      ...args
    };
    return this;
  }
  addField(field) {
    let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.ROOT_FIELD;
    return this.addFields([field], path);
  }
  addFields() {
    let fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.ROOT_FIELD;
    let fieldArray = [];
    path.split('/').forEach(part => {
      if (part === _helpers.ROOT_FIELD) {
        fieldArray = this.config.fields;
      } else {
        const index = fieldArray.indexOf(part);
        const next = fieldArray[index + 1];
        if (index === -1 || !Array.isArray(next)) {
          throw new Error(`Invalid path to field: ${path}`);
        }
        fieldArray = next;
      }
    });
    fields.forEach(f => fieldArray.push(f));
    return this;
  }
  useFragment(name) {
    this.config.fragments = [...this.config.fragments, name];
    return this;
  }
  useTemplate(name) {
    if (!Object.keys(this.templates).includes(name)) {
      throw new Error(`
Tried to use template '${name}', which could not be found. Please make sure that it is registered with your Injector.
      `);
    }
    this.config.templateName = name;
    return this;
  }
  addTempFragment(name, fragment) {
    this.fragments = {
      ...this.fragments,
      [name]: fragment
    };
    return this.useFragment(name);
  }
  setTemplate(strings) {
    this.config.templateName = TEMPLATE_OVERRIDE;
    for (var _len = arguments.length, expressions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expressions[_key - 1] = arguments[_key];
    }
    this.templates = {
      ...this.templates,
      [TEMPLATE_OVERRIDE]: {
        strings,
        expressions
      }
    };
    return this;
  }
  getRawTemplate(name) {
    return this.templates[name];
  }
  coallesceData(type, oldValue, newValue) {
    switch (type) {
      case 'options':
      case 'props':
      case 'variables':
      case 'context':
      case 'optimisticResponse':
        return {
          ...(oldValue || {}),
          ...(newValue || {})
        };
      case 'refetchQueries':
        return [...(oldValue || []), ...(newValue || [])];
      case 'skip':
        return typeof newValue === 'boolean' ? newValue : oldValue;
      case 'pollInterval':
        return typeof newValue === 'number' ? newValue : oldValue;
      case 'fetchPolicy':
        return typeof newValue === 'object' ? newValue : oldValue;
      case 'name':
        return typeof newValue === 'string' ? newValue : oldValue;
      case 'withRef':
      case 'notifyOnNetworkStatusChange':
        return newValue || oldValue;
      default:
        return null;
    }
  }
  reduceApolloConfig(prev, key) {
    const calculateValue = (oldValue, transform) => {
      const newValue = transform(oldValue);
      return this.coallesceData(key, oldValue, newValue);
    };
    const value = this.apolloConfigInitValues[key];
    const transforms = this.apolloConfigTransforms[key] || [];
    if (deferredApolloConfig.includes(key)) {
      const deferredValue = function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        const oldValue = value(...args);
        const bootedTransformers = transforms.map(transform => transform(...args));
        if (key === 'update') {
          return null;
        }
        return bootedTransformers.reduce(calculateValue, oldValue);
      };
      return {
        ...prev,
        [key]: deferredValue
      };
    }
    if (typeof value === 'undefined' || value === null) {
      return prev;
    }
    const newValue = transforms.reduce(calculateValue, value);
    return {
      ...prev,
      [key]: newValue
    };
  }
  getConfig() {
    return {
      ...this.config,
      availableFragments: {
        ...this.fragments
      }
    };
  }
  getApolloConfig() {
    const keys = [...Object.keys(this.apolloConfigInitValues), ...Object.keys(this.apolloConfigTransforms)].filter((key, index, list) => list.indexOf(key) === index);
    return keys.reduce(this.reduceApolloConfig, {});
  }
  getGraphqlAST() {
    const config = this.getConfig();
    const template = this.getRawTemplate(config.templateName);
    const expressed = template.expressions.map(expression => {
      if (typeof expression !== 'function') {
        return expression;
      }
      return expression(config);
    });
    return (0, _graphqlTag.default)(template.strings, ...expressed);
  }
  getContainer() {
    return new _ApolloGraphqlProxy.default(this.getGraphqlAST(), this.getApolloConfig());
  }
}
var _default = exports["default"] = ApolloGraphqlManager;

/***/ }),

/***/ "./client/src/lib/dependency-injection/ApolloGraphqlProxy.js":
/*!*******************************************************************!*\
  !*** ./client/src/lib/dependency-injection/ApolloGraphqlProxy.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _hoc = __webpack_require__(/*! @apollo/client/react/hoc */ "./node_modules/@apollo/client/react/hoc/index.js");
class ApolloGraphqlProxy {
  constructor(graphqlAST, apolloConfig) {
    this.graphqlAST = graphqlAST;
    this.apolloConfig = apolloConfig;
  }
  getApolloHOC() {
    return (0, _hoc.graphql)(this.graphqlAST, this.apolloConfig);
  }
  getGraphqlAST() {
    return this.graphqlAST;
  }
  getApolloConfig() {
    return this.apolloConfig;
  }
}
var _default = exports["default"] = ApolloGraphqlProxy;

/***/ }),

/***/ "./client/src/lib/dependency-injection/Container.js":
/*!**********************************************************!*\
  !*** ./client/src/lib/dependency-injection/Container.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _buildInjectorContainer = _interopRequireDefault(__webpack_require__(/*! ./buildInjectorContainer */ "./client/src/lib/dependency-injection/buildInjectorContainer.js"));
var _buildComponentContainer = _interopRequireDefault(__webpack_require__(/*! ./buildComponentContainer */ "./client/src/lib/dependency-injection/buildComponentContainer.js"));
var _buildReducerContainer = _interopRequireDefault(__webpack_require__(/*! ./buildReducerContainer */ "./client/src/lib/dependency-injection/buildReducerContainer.js"));
var _buildFormContainer = _interopRequireDefault(__webpack_require__(/*! ./buildFormContainer */ "./client/src/lib/dependency-injection/buildFormContainer.js"));
var _buildApolloGraphqlScaffoldingContainer = _interopRequireDefault(__webpack_require__(/*! ./buildApolloGraphqlScaffoldingContainer */ "./client/src/lib/dependency-injection/buildApolloGraphqlScaffoldingContainer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Injector = (0, _buildInjectorContainer.default)();
Injector.register('component', (0, _buildComponentContainer.default)());
Injector.register('reducer', (0, _buildReducerContainer.default)());
Injector.register('form', (0, _buildFormContainer.default)());
Injector.register('query', (0, _buildApolloGraphqlScaffoldingContainer.default)());
var _default = exports["default"] = Injector;

/***/ }),

/***/ "./client/src/lib/dependency-injection/FormStateManager.js":
/*!*****************************************************************!*\
  !*** ./client/src/lib/dependency-injection/FormStateManager.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));
var _setIn = _interopRequireDefault(__webpack_require__(/*! redux-form/lib/structure/plain/setIn */ "./node_modules/redux-form/lib/structure/plain/setIn.js"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _schemaFieldValues = __webpack_require__(/*! lib/schemaFieldValues */ "./client/src/lib/schemaFieldValues.js");
var _createClassMap = _interopRequireDefault(__webpack_require__(/*! ../createClassMap */ "./client/src/lib/createClassMap.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getFormState = state => state;
class FormStateManager {
  constructor(schema, reduxFormState) {
    const state = schema.state || {};
    const fields = state.fields || [];
    this.schema = {
      ...schema,
      state: {
        ...state,
        fields: [...fields]
      }
    };
    this.mockGlobalState = (0, _setIn.default)({}, schema.name, reduxFormState);
  }
  getFieldByName(fieldName) {
    const schemaForm = {
      fields: [],
      actions: [],
      ...this.schema.schema
    };
    const fields = [...schemaForm.fields, ...schemaForm.actions];
    const schema = (0, _schemaFieldValues.findField)(fields, fieldName);
    const state = this.schema.state.fields.find(field => field.name === fieldName);
    return (0, _schemaFieldValues.schemaMerge)(schema, state);
  }
  mutateField(fieldName, updater) {
    const fieldList = this.schema.state.fields || [];
    const fieldIndex = fieldList.findIndex(field => field.name === fieldName);
    if (fieldIndex < 0) {
      return this;
    }
    const fields = [...fieldList];
    const field = this.getFieldByName(fieldName);
    fields[fieldIndex] = (0, _schemaFieldValues.schemaMerge)(field, updater(field));
    this.schema.state.fields = fields;
    return this;
  }
  updateField(fieldName, update) {
    return this.mutateField(fieldName, field => ({
      ...field,
      ...update
    }));
  }
  updateFields(updates) {
    Object.keys(updates).forEach(key => {
      this.updateField(key, updates[key]);
    });
    return this;
  }
  setFieldComponent(fieldName, component) {
    return this.updateField(fieldName, {
      component
    });
  }
  setFieldClass(fieldName, className) {
    let active = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return this.mutateField(fieldName, field => {
      const classConfig = (0, _createClassMap.default)(field.extraClass);
      classConfig[className] = active;
      return {
        ...field,
        extraClass: (0, _classnames.default)(classConfig)
      };
    });
  }
  addFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, true);
  }
  removeFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, false);
  }
  getValues() {
    return (0, _reduxForm.getFormValues)(this.schema.name, getFormState)(this.mockGlobalState) || {};
  }
  getValue(fieldName) {
    return this.getValues()[fieldName];
  }
  isDirty() {
    return (0, _reduxForm.isDirty)(this.schema.name, getFormState)(this.mockGlobalState);
  }
  isPristine() {
    return (0, _reduxForm.isPristine)(this.schema.name, getFormState)(this.mockGlobalState);
  }
  isValid() {
    return (0, _reduxForm.isValid)(this.schema.name, getFormState)(this.mockGlobalState);
  }
  isInvalid() {
    return (0, _reduxForm.isInvalid)(this.schema.name, getFormState)(this.mockGlobalState);
  }
  getState() {
    return this.schema;
  }
}
var _default = exports["default"] = FormStateManager;

/***/ }),

/***/ "./client/src/lib/dependency-injection/FormValidationManager.js":
/*!**********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/FormValidationManager.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class FormValidationManager {
  constructor(values) {
    this.values = values;
    this.errorMap = {};
  }
  addError(fieldName, message) {
    if (!this.fieldExists(fieldName)) {
      throw new Error(`Tried to add error to non-existent field: ${fieldName}`);
    }
    if (!this.errorMap[fieldName]) {
      this.errorMap[fieldName] = [];
    }
    this.errorMap[fieldName] = [...this.errorMap[fieldName], message];
    return this;
  }
  addErrors(map) {
    Object.entries(map).forEach(entry => {
      const [fieldName] = entry;
      let [, messages] = entry;
      if (!Array.isArray(messages)) {
        messages = [messages];
      }
      messages.forEach(message => this.addError(fieldName, message));
    });
    return this;
  }
  clearErrors(fieldName) {
    if (!this.fieldExists(fieldName)) {
      throw new Error(`Tried to clear errors for non-existent field: ${fieldName}`);
    }
    delete this.errorMap[fieldName];
    return this;
  }
  hasError(fieldName) {
    return this.fieldExists(fieldName) && !!this.getErrors(fieldName).length;
  }
  fieldExists(field) {
    return Object.keys(this.values).includes(field);
  }
  getErrors(fieldName) {
    if (!this.fieldExists(fieldName)) {
      throw new Error(`Tried to get errors for non-existent field: ${fieldName}`);
    }
    return this.errorMap[fieldName] || [];
  }
  reset() {
    this.errorMap = {};
  }
  getState() {
    return this.errorMap;
  }
}
var _default = exports["default"] = FormValidationManager;

/***/ }),

/***/ "./client/src/lib/dependency-injection/InjectorContext.js":
/*!****************************************************************!*\
  !*** ./client/src/lib/dependency-injection/InjectorContext.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var _default = exports["default"] = (0, _react.createContext)({});

/***/ }),

/***/ "./client/src/lib/dependency-injection/MiddlewareRegistry.js":
/*!*******************************************************************!*\
  !*** ./client/src/lib/dependency-injection/MiddlewareRegistry.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.GLOBAL_CONTEXT = void 0;
var _toposort = _interopRequireDefault(__webpack_require__(/*! toposort */ "./node_modules/toposort/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BEFORE = 'before';
const AFTER = 'after';
const GRAPH_HEAD = '__HEAD__';
const GRAPH_TAIL = '__TAIL__';
const PRIORITIES = [BEFORE, AFTER];
const GLOBAL_CONTEXT = exports.GLOBAL_CONTEXT = '__GLOBAL__';
const WILDCARD = '*';
const validateMeta = meta => {
  PRIORITIES.forEach(k => {
    if (typeof meta[k] !== 'undefined' && typeof meta[k] !== 'string' && !Array.isArray(meta[k])) {
      throw new Error(`Middleware key ${k} must be a string or array`);
    }
  });
};
const checkWildcard = middleware => {
  let wildcard = null;
  PRIORITIES.forEach(PRIORITY => {
    if (middleware[PRIORITY].includes(WILDCARD)) {
      if (middleware[PRIORITY].length > 1) {
        throw new Error(`
          Key ${PRIORITY} on ${middleware.name} should only specify one key 
          if using the "${WILDCARD}" wildcard
        `);
      } else if (wildcard) {
        throw new Error(`
          Cannot specify a ${PRIORITY} rule on ${middleware.name} if a wildcard 
          has been specified
        `);
      } else {
        wildcard = PRIORITY;
      }
    }
  });
  return wildcard;
};
class MiddlewareRegistry {
  constructor() {
    this._middlewares = [];
    this._contextCache = {};
  }
  sort() {
    const GRAPH_INIT = [GRAPH_HEAD, GRAPH_TAIL];
    const graph = [GRAPH_INIT];
    let sortedMiddlewares = [];
    this._middlewares.forEach(middleware => {
      const {
        name
      } = middleware;
      const wildcard = checkWildcard(middleware);
      if (wildcard === AFTER) {
        graph.push([GRAPH_TAIL, name]);
      } else if (wildcard === BEFORE) {
        graph.push([name, GRAPH_HEAD]);
      } else {
        graph.push([name, GRAPH_TAIL]);
        graph.push([GRAPH_HEAD, name]);
        middleware[BEFORE].forEach(beforeEntry => {
          graph.push([name, beforeEntry]);
        });
        middleware[AFTER].forEach(afterEntry => {
          graph.push([afterEntry, name]);
        });
      }
    });
    (0, _toposort.default)(graph).filter(item => !GRAPH_INIT.includes(item)).forEach(name => {
      sortedMiddlewares = sortedMiddlewares.concat(this._middlewares.filter(m => m.name === name));
    });
    this._middlewares = sortedMiddlewares;
    return this;
  }
  add(meta, factory, contextList) {
    validateMeta(meta);
    this._contextCache = {};
    let context = contextList;
    if (!context || !context.length) {
      context = [GLOBAL_CONTEXT];
    } else if (!Array.isArray(context)) {
      context = [context];
    }
    const normalised = {
      ...meta,
      factory,
      context
    };
    PRIORITIES.forEach(k => {
      if (!Array.isArray(meta[k])) {
        normalised[k] = meta[k] ? [meta[k]] : [];
      } else {
        normalised[k] = meta[k];
      }
    });
    if (PRIORITIES.every(p => !normalised[p].length)) {
      normalised[AFTER] = [GRAPH_HEAD];
      normalised[BEFORE] = [GRAPH_TAIL];
    }
    this._middlewares.push(normalised);
    return this;
  }
  getMatchesForContext() {
    let context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GLOBAL_CONTEXT;
    if (!this._contextCache[context]) {
      const requestedContext = context.split('.');
      this._contextCache[context] = this._middlewares.filter(middleware => middleware.context[0] === GLOBAL_CONTEXT || middleware.context.every((part, index) => part === WILDCARD || requestedContext[index] === part));
    }
    return this._contextCache[context];
  }
}
var _default = exports["default"] = MiddlewareRegistry;

/***/ }),

/***/ "./client/src/lib/dependency-injection/applyFormMiddleware.js":
/*!********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/applyFormMiddleware.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _getIn = _interopRequireDefault(__webpack_require__(/*! redux-form/lib/structure/plain/getIn */ "./node_modules/redux-form/lib/structure/plain/getIn.js"));
var _setIn = _interopRequireDefault(__webpack_require__(/*! redux-form/lib/structure/plain/setIn */ "./node_modules/redux-form/lib/structure/plain/setIn.js"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _Injector = _interopRequireDefault(__webpack_require__(/*! ../Injector */ "./client/src/lib/Injector.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const omittedActions = [_reduxForm.actionTypes.REGISTER_FIELD, _reduxForm.actionTypes.DESTROY];
const applyFormMiddleware = reducer => () => (state, action) => {
  const reducedState = reducer(state, action);
  const formName = action.meta && action.meta.form;
  if (!formName || omittedActions.includes(action.type)) {
    return reducedState;
  }
  const formSchemaMiddleware = _Injector.default.form.getSchema(formName);
  if (!formSchemaMiddleware) {
    return reducedState;
  }
  const reduxFormState = (0, _getIn.default)(reducedState.formState, formName);
  if (!reduxFormState) {
    return reducedState;
  }
  let newState = {
    ...reducedState
  };
  const schemaEntries = Object.entries(reducedState.formSchemas).filter(_ref => {
    let [, entry] = _ref;
    return entry.name === formName;
  });
  if (!schemaEntries.length) {
    return reducedState;
  }
  schemaEntries.forEach(_ref2 => {
    let [schemaKey, formSchemaState] = _ref2;
    const updates = formSchemaMiddleware(formSchemaState, reduxFormState);
    if (!updates.state || !Array.isArray(updates.state.fields)) {
      throw new Error(`
      One more calls to alterSchema did not return a properly formed schema state
      object. Check your calls to Injector.transform() which could affect '${schemaKey}'.
    `);
    }
    newState = (0, _setIn.default)(newState, `formSchemas.${schemaKey}.state`, updates.state);
  });
  return newState;
};
var _default = exports["default"] = applyFormMiddleware;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildApolloGraphqlContainer.js":
/*!****************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildApolloGraphqlContainer.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _buildBaseContainer = _interopRequireDefault(__webpack_require__(/*! ./buildBaseContainer */ "./client/src/lib/dependency-injection/buildBaseContainer.js"));
var _ApolloGraphqlManager = _interopRequireDefault(__webpack_require__(/*! ./ApolloGraphqlManager */ "./client/src/lib/dependency-injection/ApolloGraphqlManager.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const buildApolloGraphqlContainer = function () {
  let base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer.default)();
  let initialTemplates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let initialFragments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    ...base,
    templates: {
      ...initialTemplates
    },
    fragments: {
      ...initialFragments
    },
    scaffold(key, config, _ref) {
      let {
        force
      } = _ref;
      throw new Error('This API endpoint is not available yet');
    },
    register(key, config) {
      const {
        templateName
      } = config;
      if (!templateName || !this.templates[templateName]) {
        throw new Error(`
Tried to register a new query '${key}' without a defined template '${templateName}'. Please ensure the
templateName config is defined and that you have registered the template before registering a query.
      `);
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return base.register.call(this, key, config, ...args);
    },
    registerTemplate(templateName) {
      var _this = this;
      let {
        force
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      base.isProtected.call(this);
      return function (strings) {
        if (_this.templates[templateName] && !force) {
          throw new Error(`
Tried to register template '${templateName}' more than once. This practice is discouraged. Consider
using Injector.update() to enhance the template rather than override it completely.
Otherwise, invoke the registerTemplate() function with '{ force: true }' as the second argument.
        `);
        }
        for (var _len2 = arguments.length, expressions = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          expressions[_key2 - 1] = arguments[_key2];
        }
        _this.templates = {
          ..._this.templates,
          [templateName]: {
            strings,
            expressions
          }
        };
      };
    },
    registerFragment(fragmentName, fragmentString) {
      let {
        force
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      base.isProtected.call(this);
      if (this.fragments[fragmentName] && !force) {
        throw new Error(`
Tried to register fragment '${fragmentName}' more than once. This practice is discouraged. Consider
adding a new fragment or using Injector.update() to enhance the template you're working with.
Otherwise, invoke the registerFragment() function with '{ force: true }' as the third argument.
      `);
      }
      this.fragments = {
        ...this.fragments,
        [fragmentName]: fragmentString
      };
    },
    getTemplates() {
      return {
        ...this.templates
      };
    },
    getFragments() {
      return {
        ...this.fragments
      };
    },
    getProcessedManager(key, middlewareMatches) {
      const factories = middlewareMatches.map(middleware => middleware.factory).reverse();
      const config = this.services[key];
      const manager = new _ApolloGraphqlManager.default(config, {
        ...this.templates
      }, {
        ...this.fragments
      });
      factories.forEach(factory => {
        factory(manager);
      }, config);
      return manager;
    },
    getFactory(key, middlewareMatches) {
      return this.getProcessedManager(key, middlewareMatches).getContainer();
    }
  };
};
var _default = exports["default"] = buildApolloGraphqlContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildApolloGraphqlScaffoldingContainer.js":
/*!***************************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildApolloGraphqlScaffoldingContainer.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _buildBaseContainer = _interopRequireDefault(__webpack_require__(/*! ./buildBaseContainer */ "./client/src/lib/dependency-injection/buildBaseContainer.js"));
var _buildApolloGraphqlContainer = _interopRequireDefault(__webpack_require__(/*! ./buildApolloGraphqlContainer */ "./client/src/lib/dependency-injection/buildApolloGraphqlContainer.js"));
var _buildCreateMutation = _interopRequireDefault(__webpack_require__(/*! ./graphql/buildCreateMutation */ "./client/src/lib/dependency-injection/graphql/buildCreateMutation.js"));
var _buildReadQuery = _interopRequireDefault(__webpack_require__(/*! ./graphql/buildReadQuery */ "./client/src/lib/dependency-injection/graphql/buildReadQuery.js"));
var _buildReadOneQuery = _interopRequireDefault(__webpack_require__(/*! ./graphql/buildReadOneQuery */ "./client/src/lib/dependency-injection/graphql/buildReadOneQuery.js"));
var _buildUpdateMutation = _interopRequireDefault(__webpack_require__(/*! ./graphql/buildUpdateMutation */ "./client/src/lib/dependency-injection/graphql/buildUpdateMutation.js"));
var _buildDeleteMutation = _interopRequireDefault(__webpack_require__(/*! ./graphql/buildDeleteMutation */ "./client/src/lib/dependency-injection/graphql/buildDeleteMutation.js"));
var _buildBaseQuery = _interopRequireDefault(__webpack_require__(/*! ./graphql/buildBaseQuery */ "./client/src/lib/dependency-injection/graphql/buildBaseQuery.js"));
var _templates = __webpack_require__(/*! ./graphql/templates */ "./client/src/lib/dependency-injection/graphql/templates.js");
var _tags = __webpack_require__(/*! ./graphql/tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const templates = {
  [_templates.CREATE]: (0, _buildCreateMutation.default)(_tags.captureTag),
  [_templates.READ]: (0, _buildReadQuery.default)(_tags.captureTag),
  [_templates.READ_ONE]: (0, _buildReadOneQuery.default)(_tags.captureTag),
  [_templates.UPDATE]: (0, _buildUpdateMutation.default)(_tags.captureTag),
  [_templates.DELETE]: (0, _buildDeleteMutation.default)(_tags.captureTag),
  [_templates.QUERY]: (0, _buildBaseQuery.default)(_tags.captureTag)
};
const buildApolloGraphqlScaffoldingContainer = function () {
  let base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer.default)();
  return (0, _buildApolloGraphqlContainer.default)(base, templates);
};
var _default = exports["default"] = buildApolloGraphqlScaffoldingContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildBaseContainer.js":
/*!*******************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildBaseContainer.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _redux = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
var _MiddlewareRegistry = _interopRequireWildcard(__webpack_require__(/*! ./MiddlewareRegistry */ "./client/src/lib/dependency-injection/MiddlewareRegistry.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const buildBaseContainer = () => ({
  middlewareRegistries: {},
  services: {},
  factories: {},
  factoryCache: {},
  initialised: false,
  isProtected() {
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
  },
  get(key, context) {
    if (!this.initialised) {
      throw new Error(`
      Injector.get(): Attempted to access DI layer before it was initialised.
      Did you forget to invoke Injector.load()?`);
    }
    const factory = this.factories[key];
    if (!factory) {
      throw new Error(`Injector.get(): Component ${key} does not exist`);
    }
    return factory(context);
  },
  customise(meta, key, factory) {
    this.isProtected();
    const [serviceName, ...context] = key.split('.');
    let registry = this.middlewareRegistries[serviceName];
    if (!registry) {
      registry = new _MiddlewareRegistry.default();
      this.middlewareRegistries = {
        ...this.middlewareRegistries,
        [serviceName]: registry
      };
    }
    registry.add(meta, factory, context);
  },
  load() {
    var _this = this;
    this.isProtected();
    this.factories = Object.keys(this.services).reduce((factories, key) => {
      const middleware = this.middlewareRegistries[key];
      if (middleware) {
        middleware.sort();
        return {
          ...factories,
          [key]: function () {
            let context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _MiddlewareRegistry.GLOBAL_CONTEXT;
            const cacheKey = `${key}__${context}`;
            if (!_this.factoryCache[cacheKey]) {
              const matches = middleware.getMatchesForContext(context);
              _this.factoryCache[cacheKey] = _this.getFactory(key, matches);
            }
            return _this.factoryCache[cacheKey];
          }
        };
      }
      return {
        ...factories,
        [key]: () => this.getFactory(key, [])
      };
    }, {});
    this.initialised = true;
  },
  register(key, value) {
    let {
      force
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.isProtected();
    if (this.services[key] && force !== true) {
      throw new Error(`
      Tried to register service '${key}' more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
    }
    this.services = {
      ...this.services,
      [key]: value
    };
  },
  registerMany(map) {
    let {
      force
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.isProtected();
    const mapKeys = Object.keys(map);
    const existing = Object.keys(this.services).filter(service => mapKeys.includes(service));
    if (existing.length && force !== true) {
      const list = existing.join(', ');
      throw new Error(`
      Tried to register services (${list}) more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
    }
    this.services = {
      ...this.services,
      ...map
    };
  },
  transform(name, callback) {
    let priorities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.isProtected();
    callback(this.createTransformer(name, priorities));
  },
  createTransformer(name, priorities) {
    return (key, wrapper) => {
      this.customise({
        name,
        ...priorities
      }, key, wrapper);
    };
  },
  getFactory(key, middlewareMatches) {
    const service = this.services[key];
    const middlewares = middlewareMatches.map(m => m.factory);
    return (0, _redux.compose)(...middlewares)(service);
  }
});
var _default = exports["default"] = buildBaseContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildComponentContainer.js":
/*!************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildComponentContainer.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _buildBaseContainer = _interopRequireDefault(__webpack_require__(/*! ./buildBaseContainer */ "./client/src/lib/dependency-injection/buildBaseContainer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createDisplayName = (original, transforms) => {
  const componentName = original.displayName || original.name || 'Component';
  const names = [componentName, ...transforms];
  return names.reduce((acc, curr) => `${curr}(${acc})`);
};
const buildComponentContainer = function () {
  let base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer.default)();
  return {
    ...base,
    get(key, context) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      const service = base.get.call(this, key, context, ...args);
      if (service.displayName && service.displayName.match(/\]$/)) {
        return service;
      }
      const componentName = service.displayName || service.name || 'Component';
      const componentKey = context ? `[${context}]` : '';
      service.displayName = `${componentName}${componentKey}`;
      return service;
    },
    createTransformer(name, priorities) {
      return (key, wrapper, displayName) => {
        this.customise({
          name,
          ...priorities,
          displayName
        }, key, wrapper);
      };
    },
    getFactory(key, middlewareMatches) {
      const factory = base.getFactory.call(this, key, middlewareMatches);
      const names = middlewareMatches.map(middleware => middleware.displayName || middleware.name);
      factory.displayName = createDisplayName(this.services[key], names);
      return factory;
    }
  };
};
var _default = exports["default"] = buildComponentContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildFormContainer.js":
/*!*******************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildFormContainer.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.VALIDATION_MIDDLEWARE_SERVICE = exports.SCHEMA_MIDDLEWARE_SERVICE = void 0;
var _buildBaseContainer = _interopRequireDefault(__webpack_require__(/*! ./buildBaseContainer */ "./client/src/lib/dependency-injection/buildBaseContainer.js"));
var _FormStateManager = _interopRequireDefault(__webpack_require__(/*! ./FormStateManager */ "./client/src/lib/dependency-injection/FormStateManager.js"));
var _FormValidationManager = _interopRequireDefault(__webpack_require__(/*! ./FormValidationManager */ "./client/src/lib/dependency-injection/FormValidationManager.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SCHEMA_MIDDLEWARE_SERVICE = exports.SCHEMA_MIDDLEWARE_SERVICE = 'FormSchemaMiddleware';
const VALIDATION_MIDDLEWARE_SERVICE = exports.VALIDATION_MIDDLEWARE_SERVICE = 'FormValidationMiddleware';
const buildFormContainer = function () {
  let base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer.default)();
  return {
    ...base,
    services: {
      [SCHEMA_MIDDLEWARE_SERVICE]: state => state,
      [VALIDATION_MIDDLEWARE_SERVICE]: function (values) {
        let errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return errors;
      }
    },
    register() {
      throw new Error(`
      Attempted to register a service on Injector.form. This container accepts only two
      services by design (${SCHEMA_MIDDLEWARE_SERVICE} and ${VALIDATION_MIDDLEWARE_SERVICE}) 
      for updating form schema and adding validation, respectively. Consider using a more
      generic container, e.g. Injector.reducer.
    `);
    },
    registerMany() {
      this.register();
    },
    getSchema(context) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return base.get.call(this, SCHEMA_MIDDLEWARE_SERVICE, context, ...args);
    },
    getValidation(context) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      return base.get.call(this, VALIDATION_MIDDLEWARE_SERVICE, context, ...args);
    },
    createTransformer(name, priorities) {
      const factory = serviceName => (context, wrapper) => base.customise.call(this, {
        name,
        ...priorities
      }, `${serviceName}.${context}`, wrapper);
      return {
        alterSchema: factory(SCHEMA_MIDDLEWARE_SERVICE),
        addValidation: factory(VALIDATION_MIDDLEWARE_SERVICE)
      };
    },
    getFactory(key, middlewareMatches) {
      const factories = middlewareMatches.map(middleware => middleware.factory);
      if (key === SCHEMA_MIDDLEWARE_SERVICE) {
        return this.getSchemaReducer(factories);
      } else if (key === VALIDATION_MIDDLEWARE_SERVICE) {
        return this.getValidationReducer(factories);
      }
      throw new Error(`Invalid service for form injector: ${key}`);
    },
    getSchemaReducer(factories) {
      return (formSchemaState, reduxFormState) => factories.reduce((currentState, currentFactory) => {
        const manager = new _FormStateManager.default(currentState, reduxFormState);
        const modifications = currentFactory(manager);
        return {
          ...currentState,
          ...modifications
        };
      }, formSchemaState);
    },
    getValidationReducer(factories) {
      return (values, schema) => {
        const validation = new _FormValidationManager.default(values);
        factories.forEach(factory => factory(values, validation, schema));
        return validation.getState();
      };
    }
  };
};
var _default = exports["default"] = buildFormContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildInjectorContainer.js":
/*!***********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildInjectorContainer.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const buildInjectorContainer = () => ({
  services: {},
  initialised: false,
  callbacks: [],
  onInit: null,
  register(key, value) {
    let {
      force
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
    if (this.services[key] && force !== true) {
      throw new Error(`
      Tried to register service ${key} more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
    }
    if (typeof this[key] !== 'undefined' && !this.services[key]) {
      throw new Error(`
      Tried to register service ${key} which is a reserved keyword. This would affect the behaviour
      of this API class, so it is forbidden to register with Injector.
      `);
    }
    const requiredMethods = ['load', 'createTransformer', 'get', 'register'];
    if (!requiredMethods.every(method => typeof value[method] === 'function')) {
      throw new Error(`
      Tried to register service ${key} that is not a valid object, Injector requires an object
      which contains the following methods: ${requiredMethods.join(', ')}
      `);
    }
    this.services[key] = value;
    this[key] = value;
  },
  load() {
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
    Object.values(this.services).forEach(service => service.load());
    this.initialised = true;
    if (this.onInit) {
      this.onInit();
    }
    this.callbacks.forEach(callback => {
      callback();
    });
    this.callbacks = [];
  },
  transform(name, callback) {
    let priorities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
    const updater = Object.entries(this.services).reduce((updateContainer, _ref) => {
      let [serviceName, service] = _ref;
      return {
        ...updateContainer,
        [serviceName]: service.createTransformer(name, priorities)
      };
    }, {});
    callback(updater);
  },
  ready(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback provided is not a function');
    }
    if (this.initialised) {
      callback();
      return;
    }
    this.callbacks = [...this.callbacks, callback];
  },
  init(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback provided is not a function');
    }
    if (this.initialised) {
      throw new Error('Tried to add an init() callback after Injector was initialised');
    }
    this.onInit = callback;
  }
});
var _default = exports["default"] = buildInjectorContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildReducerContainer.js":
/*!**********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/buildReducerContainer.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _buildBaseContainer = _interopRequireDefault(__webpack_require__(/*! ./buildBaseContainer */ "./client/src/lib/dependency-injection/buildBaseContainer.js"));
var _MiddlewareRegistry = _interopRequireDefault(__webpack_require__(/*! ./MiddlewareRegistry */ "./client/src/lib/dependency-injection/MiddlewareRegistry.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const buildReducerContainer = function () {
  let base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer.default)();
  return {
    ...base,
    store: null,
    setStore(store) {
      this.store = store;
    },
    customise(meta, key, factory) {
      this.isProtected();
      let registry = this.middlewareRegistries[key];
      if (!registry) {
        registry = new _MiddlewareRegistry.default();
        this.middlewareRegistries = {
          ...this.middlewareRegistries,
          [key]: registry
        };
      }
      const enhancedFactory = service => {
        const getState = this.store && this.store.getState;
        return factory(service)(getState);
      };
      registry.add(meta, enhancedFactory);
    },
    getAll() {
      const newFactories = this.initialised ? Object.entries(this.factories).reduce((prev, _ref) => {
        let [key, factory] = _ref;
        return {
          ...prev,
          [key]: factory()
        };
      }, {}) : Object.entries(this.services).reduce((prev, _ref2) => {
        let [key, service] = _ref2;
        return {
          ...prev,
          [key]: service
        };
      }, {});
      return newFactories;
    }
  };
};
var _default = exports["default"] = buildReducerContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildBaseQuery.js":
/*!***********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/buildBaseQuery.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tags = __webpack_require__(/*! ./tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
var _helpers = __webpack_require__(/*! ./helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
const getOperationName = _ref => {
  let {
    operationName,
    queryName
  } = _ref;
  return operationName || `${queryName.charAt(0).toUpperCase()}${queryName.slice(1)}`;
};
const getQueryName = _ref2 => {
  let {
    queryName
  } = _ref2;
  return queryName;
};
const getQueryType = _ref3 => {
  let {
    queryType
  } = _ref3;
  return queryType;
};
const buildReadQuery = function () {
  let tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag`${getQueryType} ${getOperationName}${_helpers.getVariables} {
    ${getQueryName}(${_helpers.getParams}) {
      ${_helpers.getFields}
    }
  }
  ${_helpers.getFragments}`;
};
var _default = exports["default"] = buildReadQuery;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildCreateMutation.js":
/*!****************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/buildCreateMutation.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tags = __webpack_require__(/*! ./tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
var _helpers = __webpack_require__(/*! ./helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
const buildCreateMutation = function () {
  let tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag`mutation Create${_helpers.getSingularName}(
    $input:${_helpers.getCreateMutationType}!
  ) {
    create${_helpers.getSingularName}(
      input: $input
    ) {
      ${_helpers.getFields}
    }
  }
  ${_helpers.getFragments}`;
};
var _default = exports["default"] = buildCreateMutation;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildDeleteMutation.js":
/*!****************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/buildDeleteMutation.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tags = __webpack_require__(/*! ./tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
var _helpers = __webpack_require__(/*! ./helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
const buildDeleteMutation = function () {
  let tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag`mutation Delete${_helpers.getSingularName}($IDs:[ID]!) {
    delete${_helpers.getSingularName}(IDs: $IDs)
  }`;
};
var _default = exports["default"] = buildDeleteMutation;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildReadOneQuery.js":
/*!**************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/buildReadOneQuery.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tags = __webpack_require__(/*! ./tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
var _helpers = __webpack_require__(/*! ./helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
const buildReadOneQuery = function () {
  let tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag`query ReadOne${_helpers.getSingularName}($ID: ID!)  {
    readOne${_helpers.getSingularName}(ID: $ID) {
      ${_helpers.getFields}
    }
  }
  ${_helpers.getFragments}`;
};
var _default = exports["default"] = buildReadOneQuery;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildReadQuery.js":
/*!***********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/buildReadQuery.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tags = __webpack_require__(/*! ./tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
var _helpers = __webpack_require__(/*! ./helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
const buildReadQuery = function () {
  let tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag`query Read${_helpers.getPluralName}${_helpers.getVariables} {
    read${_helpers.getPluralName}${_helpers.getRootParams} {
      ${_helpers.getFields}
    }
  }
  ${_helpers.getFragments}`;
};
var _default = exports["default"] = buildReadQuery;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildUpdateMutation.js":
/*!****************************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/buildUpdateMutation.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tags = __webpack_require__(/*! ./tags */ "./client/src/lib/dependency-injection/graphql/tags.js");
var _helpers = __webpack_require__(/*! ./helpers */ "./client/src/lib/dependency-injection/graphql/helpers.js");
const buildUpdateMutation = function () {
  let tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag`mutation Update${_helpers.getSingularName}(
    $input:${_helpers.getUpdateMutationType}!
    ${_helpers.getVariables}
  ) {
    update${_helpers.getSingularName}(
      input: $input
      ${_helpers.getParams}
    ) {
      ${_helpers.getFields}
    }
  }
  ${_helpers.getFragments}`;
};
var _default = exports["default"] = buildUpdateMutation;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/helpers.js":
/*!****************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/helpers.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getVariables = exports.getUpdateMutationType = exports.getSingularName = exports.getRootParams = exports.getPluralName = exports.getParams = exports.getFragments = exports.getFields = exports.getCreateMutationType = exports.ROOT_FIELD = void 0;
const ROOT_FIELD = exports.ROOT_FIELD = 'root';
const paginationFields = {
  limit: 'Int',
  offset: 'Int'
};
const paginateFields = fields => `edges { node { ${fields.join(' ')} } } pageInfo { totalCount }`;
const getSingularName = _ref => {
  let {
    singularName
  } = _ref;
  return singularName;
};
exports.getSingularName = getSingularName;
const getPluralName = _ref2 => {
  let {
    pluralName
  } = _ref2;
  return pluralName;
};
exports.getPluralName = getPluralName;
const getVariables = _ref3 => {
  let {
    params,
    pagination = true
  } = _ref3;
  const items = pagination ? {
    ...params,
    ...paginationFields
  } : params;
  const varList = Object.entries(items).map(_ref4 => {
    let [key, type] = _ref4;
    return `$${key}: ${type}`;
  });
  return varList.length ? `(${varList.join(', ')})` : '';
};
exports.getVariables = getVariables;
const getParams = _ref5 => {
  let {
    params,
    pagination = true
  } = _ref5;
  const items = pagination ? {
    ...params,
    ...paginationFields
  } : params;
  const paramList = Object.entries(items).map(_ref6 => {
    let [paramName, varName] = _ref6;
    return `${paramName}: $${varName}`;
  });
  return paramList.length ? `(${paramList.join(', ')})` : '';
};
exports.getParams = getParams;
const getRootParams = _ref7 => {
  let {
    args,
    pagination = true
  } = _ref7;
  const fieldParams = args[ROOT_FIELD] || {};
  return getParams({
    params: fieldParams,
    pagination
  });
};
exports.getRootParams = getRootParams;
const getFields = function (_ref8) {
  let {
    args,
    fields,
    pagination = true
  } = _ref8;
  let stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [ROOT_FIELD];
  const strings = fields.map((field, i) => {
    if (Array.isArray(field)) {
      return `
      {
        ${getFields({
        args,
        fields: field,
        pagination: false
      }, [...stack, fields[i - 1]])}
      }`;
    }
    const path = [...stack, field];
    const key = path.join('/');
    const fieldParams = args[key] || {};
    const str = `${field}${getParams({
      params: fieldParams,
      pagination: false
    })}`;
    return str;
  });
  if (pagination) {
    return paginateFields(strings);
  }
  return strings.join(' ');
};
exports.getFields = getFields;
const getFragments = _ref9 => {
  let {
    availableFragments,
    fragments = []
  } = _ref9;
  return Object.entries(availableFragments).reduce((capturedFragments, _ref10) => {
    let [key, fragment] = _ref10;
    return fragments.includes(key) ? `${capturedFragments} ${fragment}` : capturedFragments;
  }, '');
};
exports.getFragments = getFragments;
const getCreateMutationType = _ref11 => {
  let {
    singularName
  } = _ref11;
  return `Create${singularName}Input`;
};
exports.getCreateMutationType = getCreateMutationType;
const getUpdateMutationType = _ref12 => {
  let {
    singularName
  } = _ref12;
  return `Update${singularName}Input`;
};
exports.getUpdateMutationType = getUpdateMutationType;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/tags.js":
/*!*************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/tags.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.processTag = exports.defaultTag = exports.captureTag = void 0;
const captureTag = function (strings) {
  for (var _len = arguments.length, expressions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    expressions[_key - 1] = arguments[_key];
  }
  return {
    strings,
    expressions
  };
};
exports.captureTag = captureTag;
const defaultTag = function (strings) {
  for (var _len2 = arguments.length, expressions = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    expressions[_key2 - 1] = arguments[_key2];
  }
  return strings.map((partial, index) => `${partial}${expressions[index] === 0 ? expressions[index] : expressions[index] || ''}`).join('');
};
exports.defaultTag = defaultTag;
const processTag = config => function (strings) {
  for (var _len3 = arguments.length, expressions = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    expressions[_key3 - 1] = arguments[_key3];
  }
  const expressed = expressions.map(expression => {
    if (typeof expression !== 'function') {
      return expression;
    }
    return expression(config);
  });
  return defaultTag(strings, ...expressed);
};
exports.processTag = processTag;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/templates.js":
/*!******************************************************************!*\
  !*** ./client/src/lib/dependency-injection/graphql/templates.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UPDATE = exports.READ_ONE = exports.READ = exports.QUERY = exports.DELETE = exports.CREATE = void 0;
const CREATE = exports.CREATE = 'scaffoldCreate';
const READ = exports.READ = 'scaffoldRead';
const READ_ONE = exports.READ_ONE = 'scaffoldReadOne';
const UPDATE = exports.UPDATE = 'scaffoldUpdate';
const DELETE = exports.DELETE = 'scaffoldDelete';
const QUERY = exports.QUERY = 'baseQuery';

/***/ }),

/***/ "./client/src/lib/dependency-injection/inject.js":
/*!*******************************************************!*\
  !*** ./client/src/lib/dependency-injection/inject.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _injectorContextType = _interopRequireDefault(__webpack_require__(/*! ./injectorContextType */ "./client/src/lib/dependency-injection/injectorContextType.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const defaultContext = (props, injectorContext) => injectorContext;
const inject = function (dependencies, mapDependenciesToProps) {
  let getContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultContext;
  return InjectingComponent => {
    if (dependencies && !Array.isArray(dependencies)) {
      throw new Error(`
      withInjector() passed an argument for dependencies that is ${typeof deps}.
      Must be an array of named dependencies.
    `);
    }
    if (mapDependenciesToProps && typeof mapDependenciesToProps !== 'function') {
      throw new Error(`
      Second parameter of inject() [mapDependenciesToProps] must be a function, taking the resolved
      dependencies as enumerated arguments, and returning a map of prop names to dependencies.
    `);
    }
    if (typeof getContext !== 'function') {
      throw new Error(`
      Third parameter of inject() [getContext] must be a function, taking the component's props
      and current inject context as parameters, and returning a string representing the Injector
      context to use throughout the component.
    `);
    }
    class Injector extends _react.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          context: getContext(props, context.injector.context)
        };
      }
      getChildContext() {
        return {
          injector: {
            ...this.context.injector,
            context: this.state.context
          }
        };
      }
      static getDerivedStateFromProps(props, state) {
        const newContext = getContext(props, state.context);
        if (newContext !== state.context) {
          return {
            context: newContext
          };
        }
        return null;
      }
      render() {
        let props = {};
        if (dependencies) {
          const {
            get
          } = this.context.injector;
          const resolved = dependencies.map(dep => get(dep, this.state.context));
          if (mapDependenciesToProps) {
            props = mapDependenciesToProps(...resolved);
          } else {
            dependencies.forEach((dep, index) => {
              props[dep] = resolved[index];
            });
          }
          if (!props || typeof props !== 'object') {
            throw new Error(`
            mapDepedenciesToProps parameter passed to inject()
            should return an object that maps prop names to dependencies
          `);
          }
        }
        const newProps = {
          ...props,
          ...this.props
        };
        return _react.default.createElement(InjectingComponent, newProps);
      }
    }
    Injector.contextTypes = _injectorContextType.default;
    Injector.childContextTypes = _injectorContextType.default;
    return Injector;
  };
};
var _default = exports["default"] = inject;

/***/ }),

/***/ "./client/src/lib/dependency-injection/injectGraphql.js":
/*!**************************************************************!*\
  !*** ./client/src/lib/dependency-injection/injectGraphql.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Container = _interopRequireDefault(__webpack_require__(/*! ./Container */ "./client/src/lib/dependency-injection/Container.js"));
var _withInjector = _interopRequireDefault(__webpack_require__(/*! ./withInjector */ "./client/src/lib/dependency-injection/withInjector.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const injectGraphql = (key, context) => DataHandler => {
  class GraphqlInjector extends _react.Component {
    constructor(props) {
      super(props);
      this.state = {
        target: null,
        error: false
      };
    }
    componentDidMount() {
      _Container.default.ready(() => {
        let error = true;
        let target = null;
        try {
          const graphqlContainer = this.context.injector.query(key, context);
          const apolloHOC = graphqlContainer.getApolloHOC();
          target = apolloHOC(DataHandler);
          error = false;
        } catch (e) {
          this.setState({
            target,
            error
          });
          throw e;
        }
        this.setState({
          target,
          error
        });
      });
    }
    render() {
      if (this.state.error) {
        const query = [key, context].join('.');
        const message = `Error loading '${query}', perhaps it wasn't registered properly?`;
        return _react.default.createElement("div", null, message);
      }
      const Target = this.state.target;
      if (Target) {
        return _react.default.createElement(Target, this.props);
      }
      return null;
    }
  }
  return (0, _withInjector.default)(GraphqlInjector);
};
var _default = exports["default"] = injectGraphql;

/***/ }),

/***/ "./client/src/lib/dependency-injection/injectorContextType.js":
/*!********************************************************************!*\
  !*** ./client/src/lib/dependency-injection/injectorContextType.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports["default"] = {
  injector: _propTypes.default.shape({
    get: _propTypes.default.func,
    context: _propTypes.default.string,
    validate: _propTypes.default.func
  })
};

/***/ }),

/***/ "./client/src/lib/dependency-injection/loadComponent.js":
/*!**************************************************************!*\
  !*** ./client/src/lib/dependency-injection/loadComponent.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactRedux = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
var _client = __webpack_require__(/*! @apollo/client */ "./node_modules/@apollo/client/index.js");
var _NotFoundComponent = _interopRequireDefault(__webpack_require__(/*! components/NotFoundComponent/NotFoundComponent */ "./client/src/components/NotFoundComponent/NotFoundComponent.js"));
var _provideInjector = _interopRequireDefault(__webpack_require__(/*! ./provideInjector */ "./client/src/lib/dependency-injection/provideInjector.js"));
var _withInjector = _interopRequireDefault(__webpack_require__(/*! ./withInjector */ "./client/src/lib/dependency-injection/withInjector.js"));
var _Container = _interopRequireDefault(__webpack_require__(/*! ./Container */ "./client/src/lib/dependency-injection/Container.js"));
var _injectorContextType = _interopRequireDefault(__webpack_require__(/*! ./injectorContextType */ "./client/src/lib/dependency-injection/injectorContextType.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const loadComponent = function (targetName) {
  let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let overrideInjector = arguments.length > 2 ? arguments[2] : undefined;
  class LegacyLoader extends _react.Component {
    constructor(props) {
      super(props);
      this.state = {
        target: null,
        error: false
      };
    }
    getChildContext() {
      const injectorContext = context && context.context;
      if (!injectorContext) {
        return this.context;
      }
      return {
        injector: {
          ...this.context.injector,
          context: injectorContext
        }
      };
    }
    componentDidMount() {
      _Container.default.ready(() => {
        if (typeof targetName === 'string') {
          let error = true;
          let target = null;
          try {
            target = this.context.injector.get(targetName, context && context.context);
            error = false;
          } catch (e) {
            this.setState({
              target,
              error
            });
            throw e;
          }
          this.setState({
            target,
            error
          });
          return;
        }
        this.setState({
          target: targetName
        });
      });
    }
    render() {
      const Target = this.state.target;
      if (this.state.error) {
        let NotFound = _NotFoundComponent.default;
        try {
          NotFound = this.context.injector.get('NotFoundComponent');
        } catch (e) {}
        return _react.default.createElement(NotFound, _extends({}, this.props, {
          itemName: targetName
        }));
      }
      if (Target) {
        if (context) {
          const fullContext = {
            ...window.ss,
            ...context
          };
          const {
            store,
            apolloClient: client
          } = fullContext;
          return _react.default.createElement(_client.ApolloProvider, {
            client: client
          }, _react.default.createElement(_reactRedux.Provider, {
            store: store
          }, _react.default.createElement(Target, this.props)));
        }
        return _react.default.createElement(Target, this.props);
      }
      return null;
    }
  }
  LegacyLoader.childContextTypes = _injectorContextType.default;
  const contextInjector = overrideInjector || _provideInjector.default;
  return contextInjector((0, _withInjector.default)(LegacyLoader));
};
var _default = exports["default"] = loadComponent;

/***/ }),

/***/ "./client/src/lib/dependency-injection/provideContext.js":
/*!***************************************************************!*\
  !*** ./client/src/lib/dependency-injection/provideContext.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _injectorContextType = _interopRequireDefault(__webpack_require__(/*! ./injectorContextType */ "./client/src/lib/dependency-injection/injectorContextType.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const provideContext = context => ContextualComponent => {
  class ContextProvider extends _react.Component {
    getChildContext() {
      return {
        injector: {
          ...this.context.injector,
          context
        }
      };
    }
    render() {
      return _react.default.createElement(ContextualComponent, this.props);
    }
  }
  ContextProvider.contextTypes = _injectorContextType.default;
  ContextProvider.childContextTypes = _injectorContextType.default;
  return ContextProvider;
};
var _default = exports["default"] = provideContext;

/***/ }),

/***/ "./client/src/lib/dependency-injection/provideInjector.js":
/*!****************************************************************!*\
  !*** ./client/src/lib/dependency-injection/provideInjector.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _Container = _interopRequireDefault(__webpack_require__(/*! ./Container */ "./client/src/lib/dependency-injection/Container.js"));
var _injectorContextType = _interopRequireDefault(__webpack_require__(/*! ./injectorContextType */ "./client/src/lib/dependency-injection/injectorContextType.js"));
var _InjectorContext = _interopRequireDefault(__webpack_require__(/*! ./InjectorContext */ "./client/src/lib/dependency-injection/InjectorContext.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function provideInjector(Injectable) {
  let injectorContainer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Container.default;
  class InjectorProvider extends _react.Component {
    getChildContext() {
      const {
        component,
        form,
        query
      } = injectorContainer;
      return {
        injector: {
          query: query.get.bind(query),
          get: component.get.bind(component),
          validate: form.getValidation.bind(form)
        }
      };
    }
    render() {
      const value = this.getChildContext();
      return _react.default.createElement(_InjectorContext.default.Provider, {
        value: value
      }, _react.default.createElement(Injectable, this.props));
    }
  }
  InjectorProvider.childContextTypes = _injectorContextType.default;
  return InjectorProvider;
}
var _default = exports["default"] = provideInjector;

/***/ }),

/***/ "./client/src/lib/dependency-injection/withInjector.js":
/*!*************************************************************!*\
  !*** ./client/src/lib/dependency-injection/withInjector.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _injectorContextType = _interopRequireDefault(__webpack_require__(/*! ./injectorContextType */ "./client/src/lib/dependency-injection/injectorContextType.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const withInjector = Component => {
  Component.contextTypes = {
    ...(Component.contextTypes || {}),
    ..._injectorContextType.default
  };
  Component.displayName = `withInjector(
    ${Component.displayName || Component.name || 'Component'}
  )`;
  return Component;
};
var _default = exports["default"] = withInjector;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/formatWrittenNumber.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/formatWrittenNumber.js ***!
  \*************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = formatWrittenNumber;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function formatWrittenNumber(num) {
  const parsed = Number(num);
  if (num !== null && parsed >= 0 && parsed < 10) {
    return [_i18n.default._t('Admin.WRITTEN_NUMBER_ZERO', 'zero'), _i18n.default._t('Admin.WRITTEN_NUMBER_ONE', 'one'), _i18n.default._t('Admin.WRITTEN_NUMBER_TWO', 'two'), _i18n.default._t('Admin.WRITTEN_NUMBER_THREE', 'three'), _i18n.default._t('Admin.WRITTEN_NUMBER_FOUR', 'four'), _i18n.default._t('Admin.WRITTEN_NUMBER_FIVE', 'five'), _i18n.default._t('Admin.WRITTEN_NUMBER_SIX', 'six'), _i18n.default._t('Admin.WRITTEN_NUMBER_SEVEN', 'seven'), _i18n.default._t('Admin.WRITTEN_NUMBER_EIGHT', 'eight'), _i18n.default._t('Admin.WRITTEN_NUMBER_NINE', 'nine')][parsed];
  } else if (parsed) {
    return String(parsed);
  }
  return null;
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js ***!
  \******************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = getFormState;
function getFormState(state) {
  const formState = state.form && state.form.formState;
  return formState || {};
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/reduxFieldReducer.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/reduxFieldReducer.js ***!
  \***********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = getFieldReducer;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getFieldReducer(state, action) {
  let initialFieldState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return fieldReducer => {
    if (!action.payload.fieldId) {
      throw new Error('Invalid fieldId');
    }
    const fields = state.fields || {};
    const field = fields[action.payload.fieldId] ? state.fields[action.payload.fieldId] : initialFieldState;
    return (0, _deepFreezeStrict.default)(Object.assign({}, state, {
      fields: Object.assign({}, fields, {
        [action.payload.fieldId]: Object.assign({}, field, fieldReducer(field))
      })
    }));
  };
}

/***/ }),

/***/ "./client/src/lib/schemaFieldValues.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/schemaFieldValues.js ***!
  \***********************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = schemaFieldValues;
exports.findField = findField;
exports.schemaMerge = schemaMerge;
var _merge = _interopRequireDefault(__webpack_require__(/*! merge */ "./node_modules/merge/lib/src/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function schemaMerge(schema, state) {
  if (typeof state === 'undefined') {
    return schema;
  }
  return _merge.default.recursive(true, schema, state);
}
function findField(fields, name) {
  if (!fields) {
    return null;
  }
  return fields.reduce((prev, field) => {
    if (prev) {
      return prev;
    }
    return findField(field.children, name);
  }, fields.find(field => field.name === name || field.name === `${name}[]`));
}
function schemaFieldValues(schema, state) {
  if (!state) {
    return {};
  }
  return state.fields.reduce((prev, curr) => {
    const match = findField(schema.fields, curr.name);
    if (!match) {
      return prev;
    }
    if (match.type === 'Structural' || match.readOnly === true) {
      return prev;
    }
    return Object.assign({}, prev, {
      [curr.name]: curr.value
    });
  }, {});
}

/***/ }),

/***/ "./client/src/lib/urls.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/urls.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.joinUrlPaths = void 0;
const joinUrlPaths = function () {
  for (var _len = arguments.length, urlPaths = new Array(_len), _key = 0; _key < _len; _key++) {
    urlPaths[_key] = arguments[_key];
  }
  if (!urlPaths.length) {
    return '';
  }
  let result = urlPaths.shift();
  for (const path of urlPaths) {
    result = `${result.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  return result;
};
exports.joinUrlPaths = joinUrlPaths;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/withDragDropContext.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/withDragDropContext.js ***!
  \*************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _reactDnd = __webpack_require__(/*! react-dnd */ "./node_modules/react-dnd/lib/index.js");
var _reactDndHtml5Backend = _interopRequireDefault(__webpack_require__(/*! react-dnd-html5-backend */ "./node_modules/react-dnd-html5-backend/lib/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports["default"] = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend.default);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/withRouter.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/withRouter.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = withRouter;
exports.routerPropTypes = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function withRouter(ComponentToWrap) {
  function ComponentWithRouterProp(props) {
    const location = (0, _reactRouterDom.useLocation)();
    const navigate = (0, _reactRouterDom.useNavigate)();
    const params = (0, _reactRouterDom.useParams)();
    return _react.default.createElement(ComponentToWrap, _extends({}, props, {
      router: {
        location,
        navigate,
        params
      }
    }));
  }
  return ComponentWithRouterProp;
}
const routerPropTypes = exports.routerPropTypes = _propTypes.default.shape({
  location: _propTypes.default.shape({
    pathname: _propTypes.default.string,
    query: _propTypes.default.object,
    search: _propTypes.default.string
  }),
  navigate: _propTypes.default.func,
  params: _propTypes.default.object
});

/***/ }),

/***/ "./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js":
/*!****************************************************************!*\
  !*** ./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  SET_BREADCRUMBS: 'SET_BREADCRUMBS'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/breadcrumbs/BreadcrumbsActions.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/breadcrumbs/BreadcrumbsActions.js ***!
  \**************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setBreadcrumbs = setBreadcrumbs;
var _BreadcrumbsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./BreadcrumbsActionTypes */ "./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function setBreadcrumbs(breadcrumbs) {
  return {
    type: _BreadcrumbsActionTypes.default.SET_BREADCRUMBS,
    payload: {
      breadcrumbs
    }
  };
}

/***/ }),

/***/ "./client/src/state/breadcrumbs/BreadcrumbsReducer.js":
/*!************************************************************!*\
  !*** ./client/src/state/breadcrumbs/BreadcrumbsReducer.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _BreadcrumbsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./BreadcrumbsActionTypes */ "./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = (0, _deepFreezeStrict.default)([]);
function reducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _BreadcrumbsActionTypes.default.SET_BREADCRUMBS:
      return (0, _deepFreezeStrict.default)(Object.assign([], action.payload.breadcrumbs));
    default:
      return state;
  }
}
var _default = exports["default"] = reducer;

/***/ }),

/***/ "./client/src/state/config/ConfigActionTypes.js":
/*!******************************************************!*\
  !*** ./client/src/state/config/ConfigActionTypes.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  SET_CONFIG: 'SET_CONFIG'
};

/***/ }),

/***/ "./client/src/state/config/ConfigActions.js":
/*!**************************************************!*\
  !*** ./client/src/state/config/ConfigActions.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setConfig = setConfig;
var _ConfigActionTypes = _interopRequireDefault(__webpack_require__(/*! ./ConfigActionTypes */ "./client/src/state/config/ConfigActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function setConfig(config) {
  return {
    type: _ConfigActionTypes.default.SET_CONFIG,
    payload: {
      config
    }
  };
}

/***/ }),

/***/ "./client/src/state/config/ConfigReducer.js":
/*!**************************************************!*\
  !*** ./client/src/state/config/ConfigReducer.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _ConfigActionTypes = _interopRequireDefault(__webpack_require__(/*! ./ConfigActionTypes */ "./client/src/state/config/ConfigActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function configReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _ConfigActionTypes.default.SET_CONFIG:
      return (0, _deepFreezeStrict.default)(Object.assign({}, state, action.payload.config));
    default:
      return state;
  }
}
var _default = exports["default"] = configReducer;

/***/ }),

/***/ "./client/src/state/mobileMenu/MobileMenuActionTypes.js":
/*!**************************************************************!*\
  !*** ./client/src/state/mobileMenu/MobileMenuActionTypes.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  TOGGLE_MENU: 'TOGGLE_MENU',
  OPEN_MENU: 'OPEN_MENU',
  CLOSE_MENU: 'CLOSE_MENU'
};

/***/ }),

/***/ "./client/src/state/mobileMenu/MobileMenuActions.js":
/*!**********************************************************!*\
  !*** ./client/src/state/mobileMenu/MobileMenuActions.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.closeMobileMenu = closeMobileMenu;
exports.openMobileMenu = openMobileMenu;
exports.toggleMobileMenu = toggleMobileMenu;
var _MobileMenuActionTypes = _interopRequireDefault(__webpack_require__(/*! ./MobileMenuActionTypes */ "./client/src/state/mobileMenu/MobileMenuActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function toggleMobileMenu() {
  return {
    type: _MobileMenuActionTypes.default.TOGGLE_MENU,
    payload: null
  };
}
function openMobileMenu() {
  return {
    type: _MobileMenuActionTypes.default.OPEN_MENU,
    payload: null
  };
}
function closeMobileMenu() {
  return {
    type: _MobileMenuActionTypes.default.CLOSE_MENU,
    payload: null
  };
}

/***/ }),

/***/ "./client/src/state/mobileMenu/MobileMenuReducer.js":
/*!**********************************************************!*\
  !*** ./client/src/state/mobileMenu/MobileMenuReducer.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _MobileMenuActionTypes = _interopRequireDefault(__webpack_require__(/*! ./MobileMenuActionTypes */ "./client/src/state/mobileMenu/MobileMenuActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = {
  isOpen: false
};
function reducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _MobileMenuActionTypes.default.TOGGLE_MENU:
      {
        return (0, _deepFreezeStrict.default)({
          ...state,
          isOpen: !state.isOpen
        });
      }
    case _MobileMenuActionTypes.default.OPEN_MENU:
      {
        return (0, _deepFreezeStrict.default)({
          ...state,
          isOpen: true
        });
      }
    case _MobileMenuActionTypes.default.CLOSE_MENU:
      {
        return (0, _deepFreezeStrict.default)({
          ...state,
          isOpen: false
        });
      }
    default:
      {
        return state;
      }
  }
}
var _default = exports["default"] = reducer;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActionTypes.js":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActionTypes.js ***!
  \**********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  FETCH_RECORDS_REQUEST: 'FETCH_RECORDS_REQUEST',
  FETCH_RECORDS_FAILURE: 'FETCH_RECORDS_FAILURE',
  FETCH_RECORDS_SUCCESS: 'FETCH_RECORDS_SUCCESS',
  FETCH_RECORD_REQUEST: 'FETCH_RECORD_REQUEST',
  FETCH_RECORD_FAILURE: 'FETCH_RECORD_FAILURE',
  FETCH_RECORD_SUCCESS: 'FETCH_RECORD_SUCCESS',
  DELETE_RECORD_REQUEST: 'DELETE_RECORD_REQUEST',
  DELETE_RECORD_FAILURE: 'DELETE_RECORD_FAILURE',
  DELETE_RECORD_SUCCESS: 'DELETE_RECORD_SUCCESS'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActions.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActions.js ***!
  \******************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.deleteRecord = deleteRecord;
exports.fetchRecord = fetchRecord;
exports.fetchRecords = fetchRecords;
var _Backend = _interopRequireDefault(__webpack_require__(/*! lib/Backend */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Backend.js"));
var _RecordsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./RecordsActionTypes */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function populate(template, params) {
  return Object.keys(params).reduce((result, name) => result.replace(`:${name}`, params[name]), template);
}
function fetchRecords(recordType, method, url) {
  const payload = {
    recordType
  };
  const headers = {
    Accept: 'application/json'
  };
  const methodToLowerCase = method.toLowerCase();
  return dispatch => {
    dispatch({
      type: _RecordsActionTypes.default.FETCH_RECORDS_REQUEST,
      payload
    });
    const args = methodToLowerCase === 'get' ? [populate(url, payload), headers] : [populate(url, payload), {}, headers];
    return _Backend.default[methodToLowerCase](...args).then(response => response.json()).then(json => {
      dispatch({
        type: _RecordsActionTypes.default.FETCH_RECORDS_SUCCESS,
        payload: {
          recordType,
          data: json
        }
      });
    }).catch(err => {
      dispatch({
        type: _RecordsActionTypes.default.FETCH_RECORDS_FAILURE,
        payload: {
          error: err,
          recordType
        }
      });
      throw err;
    });
  };
}
function fetchRecord(recordType, method, url) {
  const payload = {
    recordType
  };
  const headers = {
    Accept: 'application/json'
  };
  const methodToLowerCase = method.toLowerCase();
  return dispatch => {
    dispatch({
      type: _RecordsActionTypes.default.FETCH_RECORD_REQUEST,
      payload
    });
    const args = methodToLowerCase === 'get' ? [populate(url, payload), headers] : [populate(url, payload), {}, headers];
    return _Backend.default[methodToLowerCase](...args).then(response => response.json()).then(json => {
      dispatch({
        type: _RecordsActionTypes.default.FETCH_RECORD_SUCCESS,
        payload: {
          recordType,
          data: json
        }
      });
    }).catch(err => {
      dispatch({
        type: _RecordsActionTypes.default.FETCH_RECORD_FAILURE,
        payload: {
          error: err,
          recordType
        }
      });
      throw err;
    });
  };
}
function deleteRecord(recordType, id, method, url) {
  let headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const payload = {
    recordType,
    id
  };
  const methodToLowerCase = method.toLowerCase();
  const args = methodToLowerCase === 'get' ? [populate(url, payload), headers] : [populate(url, payload), {}, headers];
  return dispatch => {
    dispatch({
      type: _RecordsActionTypes.default.DELETE_RECORD_REQUEST,
      payload
    });
    return _Backend.default[methodToLowerCase](...args).then(() => {
      dispatch({
        type: _RecordsActionTypes.default.DELETE_RECORD_SUCCESS,
        payload: {
          recordType,
          id
        }
      });
    }).catch(err => {
      dispatch({
        type: _RecordsActionTypes.default.DELETE_RECORD_FAILURE,
        payload: {
          error: err,
          recordType,
          id
        }
      });
      throw err;
    });
  };
}

/***/ }),

/***/ "./client/src/state/records/RecordsReducer.js":
/*!****************************************************!*\
  !*** ./client/src/state/records/RecordsReducer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _RecordsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./RecordsActionTypes */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = {};
function recordsReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _RecordsActionTypes.default.FETCH_RECORDS_SUCCESS:
      {
        const recordType = action.payload.recordType;
        if (!recordType) {
          throw new Error('Undefined record type');
        }
        const records = action.payload.data._embedded[recordType] || [];
        return (0, _deepFreezeStrict.default)({
          ...state,
          [recordType]: records
        });
      }
    case _RecordsActionTypes.default.FETCH_RECORD_SUCCESS:
      {
        const recordType = action.payload.recordType;
        const newRecord = action.payload.data;
        if (!recordType) {
          throw new Error('Undefined record type');
        }
        if (!newRecord) {
          throw new Error('Undefined record data given');
        }
        const records = state[recordType] || [];
        if (records.find(next => next.ID === newRecord.ID)) {
          return (0, _deepFreezeStrict.default)({
            ...state,
            [recordType]: records.map(next => next.ID === newRecord.ID ? newRecord : next)
          });
        }
        return (0, _deepFreezeStrict.default)({
          ...state,
          [recordType]: [...records, newRecord]
        });
      }
    case _RecordsActionTypes.default.DELETE_RECORD_SUCCESS:
      {
        const recordType = action.payload.recordType;
        if (!recordType) {
          throw new Error('Undefined record type');
        }
        const records = state[recordType].filter(record => record.ID !== action.payload.id);
        return (0, _deepFreezeStrict.default)({
          ...state,
          [recordType]: records
        });
      }
    default:
      {
        return state;
      }
  }
}
var _default = exports["default"] = recordsReducer;

/***/ }),

/***/ "./client/src/state/schema/SchemaActionTypes.js":
/*!******************************************************!*\
  !*** ./client/src/state/schema/SchemaActionTypes.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const ACTION_TYPES = {
  SET_SCHEMA: 'SET_SCHEMA',
  SET_SCHEMA_STATE_OVERRIDES: 'SET_SCHEMA_STATE_OVERRIDES',
  SET_SCHEMA_LOADING: 'SET_SCHEMA_LOADING'
};
var _default = exports["default"] = ACTION_TYPES;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setSchema = setSchema;
exports.setSchemaLoading = setSchemaLoading;
exports.setSchemaStateOverrides = setSchemaStateOverrides;
var _SchemaActionTypes = _interopRequireDefault(__webpack_require__(/*! ./SchemaActionTypes */ "./client/src/state/schema/SchemaActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function setSchema(id) {
  let schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let name = arguments.length > 2 ? arguments[2] : undefined;
  return {
    type: _SchemaActionTypes.default.SET_SCHEMA,
    payload: {
      ...schema,
      id,
      name
    }
  };
}
function setSchemaStateOverrides(id, stateOverride) {
  return {
    type: _SchemaActionTypes.default.SET_SCHEMA_STATE_OVERRIDES,
    payload: {
      id,
      stateOverride
    }
  };
}
function setSchemaLoading(id, loading) {
  return {
    type: _SchemaActionTypes.default.SET_SCHEMA_LOADING,
    payload: {
      id,
      loading
    }
  };
}

/***/ }),

/***/ "./client/src/state/schema/SchemaReducer.js":
/*!**************************************************!*\
  !*** ./client/src/state/schema/SchemaReducer.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = schemaReducer;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _SchemaActionTypes = _interopRequireDefault(__webpack_require__(/*! ./SchemaActionTypes */ "./client/src/state/schema/SchemaActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = (0, _deepFreezeStrict.default)({});
function schemaReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  switch (action.type) {
    case _SchemaActionTypes.default.SET_SCHEMA:
      {
        const oldSchema = state[action.payload.id] || {};
        return (0, _deepFreezeStrict.default)({
          ...state,
          [action.payload.id]: {
            ...oldSchema,
            ...action.payload
          }
        });
      }
    case _SchemaActionTypes.default.SET_SCHEMA_STATE_OVERRIDES:
      {
        const schema = state[action.payload.id] || {};
        const stateOverride = action.payload.stateOverride;
        if (!stateOverride || !stateOverride.fields) {
          return state;
        }
        return (0, _deepFreezeStrict.default)({
          ...state,
          [action.payload.id]: {
            ...schema,
            stateOverride
          }
        });
      }
    case _SchemaActionTypes.default.SET_SCHEMA_LOADING:
      {
        const schema = state[action.payload.id] || {};
        const metadata = schema.metadata || {};
        return (0, _deepFreezeStrict.default)({
          ...state,
          [action.payload.id]: {
            ...schema,
            metadata: {
              ...metadata,
              loading: action.payload.loading
            }
          }
        });
      }
    default:
      return state;
  }
}

/***/ }),

/***/ "./client/src/state/tabs/TabsActionTypes.js":
/*!**************************************************!*\
  !*** ./client/src/state/tabs/TabsActionTypes.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  TABS_ACTIVATE_TAB: 'TABS_ACTIVATE_TAB'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/tabs/TabsActions.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/tabs/TabsActions.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.activateTab = activateTab;
var _TabsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./TabsActionTypes */ "./client/src/state/tabs/TabsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function activateTab(fieldId, tab) {
  return {
    type: _TabsActionTypes.default.TABS_ACTIVATE_TAB,
    payload: {
      fieldId,
      tab
    }
  };
}

/***/ }),

/***/ "./client/src/state/tabs/TabsReducer.js":
/*!**********************************************!*\
  !*** ./client/src/state/tabs/TabsReducer.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = tabsReducer;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _reduxFieldReducer = _interopRequireDefault(__webpack_require__(/*! lib/reduxFieldReducer */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/reduxFieldReducer.js"));
var _TabsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./TabsActionTypes */ "./client/src/state/tabs/TabsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = (0, _deepFreezeStrict.default)({
  fields: {}
});
const initialFieldState = (0, _deepFreezeStrict.default)({
  activeTab: null
});
function tabsReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  const reduceField = (0, _reduxFieldReducer.default)(state, action, initialFieldState);
  switch (action.type) {
    case _TabsActionTypes.default.TABS_ACTIVATE_TAB:
      {
        return reduceField(() => ({
          activeTab: action.payload.tab
        }));
      }
    default:
      return state;
  }
}

/***/ }),

/***/ "./client/src/state/toasts/ToastConstants.js":
/*!***************************************************!*\
  !*** ./client/src/state/toasts/ToastConstants.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.STAY_TIME = exports.FADEOUT_TIME = void 0;
const STAY_TIME = exports.STAY_TIME = 6000;
const FADEOUT_TIME = exports.FADEOUT_TIME = 1200;

/***/ }),

/***/ "./client/src/state/toasts/ToastsActionTypes.js":
/*!******************************************************!*\
  !*** ./client/src/state/toasts/ToastsActionTypes.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  DISPLAY: 'DISPLAY_TOAST',
  DISMISS: 'DISMISS_TOAST',
  REMOVE: 'REMOVE_TOAST',
  PAUSE: 'PAUSE_TOAST',
  RESUME: 'RESUME_TOAST'
};

/***/ }),

/***/ "./client/src/state/toasts/ToastsActions.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/toasts/ToastsActions.js ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dismiss = dismiss;
exports.display = display;
exports.error = error;
exports.info = info;
exports.pause = pause;
exports.resume = resume;
exports.success = success;
exports.warning = warning;
var _uuid = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/commonjs-browser/index.js");
var _ToastsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./ToastsActionTypes */ "./client/src/state/toasts/ToastsActionTypes.js"));
var _ToastConstants = __webpack_require__(/*! ./ToastConstants */ "./client/src/state/toasts/ToastConstants.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const defaultOptions = {
  text: '',
  stay: false,
  type: 'notice'
};
function dismiss(id) {
  return dispatch => {
    dispatch({
      type: _ToastsActionTypes.default.DISMISS,
      payload: {
        id
      }
    });
    setTimeout(() => dispatch({
      type: _ToastsActionTypes.default.REMOVE,
      payload: {
        id
      }
    }), _ToastConstants.FADEOUT_TIME);
  };
}
function display(options) {
  const id = `toast-${(0, _uuid.v4)()}`;
  return dispatch => {
    const dismissCallback = () => dismiss(id)(dispatch);
    const payload = {
      id,
      dismissCallback,
      ...defaultOptions,
      ...options
    };
    dispatch({
      type: _ToastsActionTypes.default.DISPLAY,
      payload
    });
  };
}
function success(text) {
  return display({
    text,
    type: 'success'
  });
}
function error(text) {
  return display({
    text,
    type: 'error',
    stay: true
  });
}
function warning(text) {
  return display({
    text,
    type: 'warning',
    stay: true
  });
}
function info(text) {
  return display({
    text
  });
}
function pause() {
  return {
    type: _ToastsActionTypes.default.PAUSE
  };
}
function resume() {
  return {
    type: _ToastsActionTypes.default.RESUME
  };
}

/***/ }),

/***/ "./client/src/state/toasts/ToastsReducer.js":
/*!**************************************************!*\
  !*** ./client/src/state/toasts/ToastsReducer.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _ToastsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./ToastsActionTypes */ "./client/src/state/toasts/ToastsActionTypes.js"));
var _ToastConstants = __webpack_require__(/*! ./ToastConstants */ "./client/src/state/toasts/ToastConstants.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initState = {
  paused: false,
  toasts: []
};
const scheduleDismissal = _ref => {
  let {
    stay,
    dismissCallback
  } = _ref;
  return stay ? undefined : setTimeout(dismissCallback, _ToastConstants.STAY_TIME);
};
const pause = state => ({
  paused: true,
  toasts: state.toasts.map(_ref2 => {
    let {
      timeout,
      ...toast
    } = _ref2;
    if (timeout) {
      clearTimeout(timeout);
    }
    return toast;
  })
});
const resume = state => ({
  paused: false,
  toasts: state.toasts.map(toast => ({
    timeout: scheduleDismissal(toast),
    ...toast
  }))
});
const updateToastList = (state, toastsList) => ({
  ...state,
  toasts: toastsList
});
const appendToast = (state, toast) => updateToastList(state, [...state.toasts, {
  ...toast,
  timeout: state.paused ? undefined : scheduleDismissal(toast),
  dismissed: false
}]);
const dissmissToast = (state, id) => updateToastList(state, state.toasts.map(toast => toast.id === id ? {
  ...toast,
  dismissed: true
} : toast));
const removeToast = (state, id) => updateToastList(state, state.toasts.filter(toast => toast.id !== id));
function toastsReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  let {
    type,
    payload
  } = arguments.length > 1 ? arguments[1] : undefined;
  switch (type) {
    case _ToastsActionTypes.default.DISPLAY:
      return appendToast(state, payload);
    case _ToastsActionTypes.default.DISMISS:
      return dissmissToast(state, payload.id);
    case _ToastsActionTypes.default.REMOVE:
      return removeToast(state, payload.id);
    case _ToastsActionTypes.default.PAUSE:
      return pause(state);
    case _ToastsActionTypes.default.RESUME:
      return resume(state);
    default:
      return state;
  }
}
var _default = exports["default"] = toastsReducer;

/***/ }),

/***/ "./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js":
/*!****************************************************************************!*\
  !*** ./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  TREEFIELD_SET_VISIBLE: 'TREEDROPDOWNFIELD_SET_VISIBLE',
  TREEFIELD_UPDATED_TREE: 'TREEDROPDOWNFIELD_UPDATED_TREE',
  TREEFIELD_UPDATING_TREE: 'TREEDROPDOWNFIELD_UPDATING_TREE',
  TREEFIELD_UPDATE_FAILED: 'TREEFIELD_UPDATE_FAILED',
  TREEFIELD_SET_SEARCH: 'TREEFIELD_SET_SEARCH',
  TREEFIELD_ADD_SELECTED_VALUES: 'TREEFIELD_ADD_SELECTED_VALUES'
};

/***/ }),

/***/ "./client/src/state/treeDropdownField/TreeDropdownFieldActions.js":
/*!************************************************************************!*\
  !*** ./client/src/state/treeDropdownField/TreeDropdownFieldActions.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.addSelectedValues = addSelectedValues;
exports.beginTreeUpdating = beginTreeUpdating;
exports.setSearch = setSearch;
exports.setVisible = setVisible;
exports.updateTree = updateTree;
exports.updateTreeFailed = updateTreeFailed;
var _TreeDropdownFieldActionTypes = _interopRequireDefault(__webpack_require__(/*! ./TreeDropdownFieldActionTypes */ "./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function setVisible(fieldId, path) {
  return {
    type: _TreeDropdownFieldActionTypes.default.TREEFIELD_SET_VISIBLE,
    payload: {
      fieldId,
      path
    }
  };
}
function beginTreeUpdating(fieldId, path) {
  return {
    type: _TreeDropdownFieldActionTypes.default.TREEFIELD_UPDATING_TREE,
    payload: {
      fieldId,
      path
    }
  };
}
function updateTree(fieldId, path, tree) {
  return {
    type: _TreeDropdownFieldActionTypes.default.TREEFIELD_UPDATED_TREE,
    payload: {
      fieldId,
      path,
      tree
    }
  };
}
function updateTreeFailed(fieldId, path) {
  return {
    type: _TreeDropdownFieldActionTypes.default.TREEFIELD_UPDATE_FAILED,
    payload: {
      fieldId,
      path
    }
  };
}
function setSearch(fieldId, search) {
  return {
    type: _TreeDropdownFieldActionTypes.default.TREEFIELD_SET_SEARCH,
    payload: {
      fieldId,
      search
    }
  };
}
function addSelectedValues(fieldId, values) {
  return {
    type: _TreeDropdownFieldActionTypes.default.TREEFIELD_ADD_SELECTED_VALUES,
    payload: {
      fieldId,
      values
    }
  };
}

/***/ }),

/***/ "./client/src/state/treeDropdownField/TreeDropdownFieldReducer.js":
/*!************************************************************************!*\
  !*** ./client/src/state/treeDropdownField/TreeDropdownFieldReducer.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = treeDropdownFieldReducer;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _reduxFieldReducer = _interopRequireDefault(__webpack_require__(/*! lib/reduxFieldReducer */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/reduxFieldReducer.js"));
var _TreeDropdownFieldActionTypes = _interopRequireDefault(__webpack_require__(/*! ./TreeDropdownFieldActionTypes */ "./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = (0, _deepFreezeStrict.default)({
  fields: {}
});
const initialFieldState = (0, _deepFreezeStrict.default)({
  visible: [],
  tree: {},
  loading: [],
  failed: [],
  search: '',
  selectedValues: []
});
function mergeTree(base, path, tree) {
  if (path.length === 0) {
    return tree;
  }
  const [nextID, ...subPath] = path;
  if (!base.children) {
    return base;
  }
  return (0, _deepFreezeStrict.default)({
    ...base,
    children: base.children.map(subTree => subTree.id === nextID ? mergeTree(subTree, subPath, tree) : subTree)
  });
}
function idFromPath(path) {
  if (path.length) {
    return path[path.length - 1];
  }
  return 0;
}
function treeDropdownFieldReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  const reduceField = (0, _reduxFieldReducer.default)(state, action, initialFieldState);
  const removeFromList = (list, remove) => list.filter(next => next !== remove);
  const addToList = (list, add) => {
    if (list.find(next => next === add)) {
      return list;
    }
    const newList = [...list, add];
    return newList.sort();
  };
  switch (action.type) {
    case _TreeDropdownFieldActionTypes.default.TREEFIELD_SET_VISIBLE:
      {
        return reduceField(() => ({
          visible: action.payload.path
        }));
      }
    case _TreeDropdownFieldActionTypes.default.TREEFIELD_UPDATING_TREE:
      {
        return reduceField(field => ({
          loading: addToList(field.loading, idFromPath(action.payload.path)),
          failed: removeFromList(field.failed, idFromPath(action.payload.path))
        }));
      }
    case _TreeDropdownFieldActionTypes.default.TREEFIELD_UPDATED_TREE:
      {
        return reduceField(field => ({
          tree: mergeTree(field.tree, action.payload.path, action.payload.tree),
          loading: removeFromList(field.loading, idFromPath(action.payload.path)),
          failed: removeFromList(field.failed, idFromPath(action.payload.path))
        }));
      }
    case _TreeDropdownFieldActionTypes.default.TREEFIELD_UPDATE_FAILED:
      {
        return reduceField(field => ({
          loading: removeFromList(field.loading, idFromPath(action.payload.path)),
          failed: addToList(field.failed, idFromPath(action.payload.path))
        }));
      }
    case _TreeDropdownFieldActionTypes.default.TREEFIELD_SET_SEARCH:
      {
        return reduceField(field => ({
          ...field,
          search: action.payload.search
        }));
      }
    case _TreeDropdownFieldActionTypes.default.TREEFIELD_ADD_SELECTED_VALUES:
      {
        const values = action.payload.values || [];
        return reduceField(field => ({
          ...field,
          selectedValues: [...field.selectedValues.filter(value => !values.find(item => item.id === value.id)), ...values].sort((a, b) => a.id - b.id)
        }));
      }
    default:
      return state;
  }
}

/***/ }),

/***/ "./client/src/state/unsavedForms/UnsavedFormsActionTypes.js":
/*!******************************************************************!*\
  !*** ./client/src/state/unsavedForms/UnsavedFormsActionTypes.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  ADD_FORM_CHANGED: 'ADD_FORM_CHANGED',
  REMOVE_FORM_CHANGED: 'REMOVE_FORM_CHANGED'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/unsavedForms/UnsavedFormsActions.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/unsavedForms/UnsavedFormsActions.js ***!
  \****************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.addFormChanged = addFormChanged;
exports.removeFormChanged = removeFormChanged;
var _UnsavedFormsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./UnsavedFormsActionTypes */ "./client/src/state/unsavedForms/UnsavedFormsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function addFormChanged(form) {
  return {
    type: _UnsavedFormsActionTypes.default.ADD_FORM_CHANGED,
    meta: {
      form
    }
  };
}
function removeFormChanged(form) {
  return {
    type: _UnsavedFormsActionTypes.default.REMOVE_FORM_CHANGED,
    meta: {
      form
    }
  };
}

/***/ }),

/***/ "./client/src/state/unsavedForms/UnsavedFormsReducer.js":
/*!**************************************************************!*\
  !*** ./client/src/state/unsavedForms/UnsavedFormsReducer.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _deepFreezeStrict = _interopRequireDefault(__webpack_require__(/*! deep-freeze-strict */ "./node_modules/deep-freeze-strict/index.js"));
var _reduxForm = __webpack_require__(/*! redux-form */ "./node_modules/redux-form/es/index.js");
var _UnsavedFormsActionTypes = _interopRequireDefault(__webpack_require__(/*! ./UnsavedFormsActionTypes */ "./client/src/state/unsavedForms/UnsavedFormsActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function unsavedFormsReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const formName = action.meta && action.meta.form;
  switch (action.type) {
    case _UnsavedFormsActionTypes.default.ADD_FORM_CHANGED:
    case _reduxForm.actionTypes.CHANGE:
      {
        return (0, _deepFreezeStrict.default)([...state.filter(form => form.name !== formName), {
          name: formName
        }]);
      }
    case _UnsavedFormsActionTypes.default.REMOVE_FORM_CHANGED:
    case _reduxForm.actionTypes.STOP_SUBMIT:
      {
        return (0, _deepFreezeStrict.default)([...state.filter(form => form.name !== formName)]);
      }
    case _reduxForm.actionTypes.DESTROY:
      {
        return (0, _deepFreezeStrict.default)([...state.filter(form => !formName.includes(form.name))]);
      }
    default:
      {
        return state;
      }
  }
}
var _default = exports["default"] = unsavedFormsReducer;

/***/ }),

/***/ "./client/src/state/usedOn/usedOnActions.js":
/*!**************************************************!*\
  !*** ./client/src/state/usedOn/usedOnActions.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.loadUsedOn = loadUsedOn;
exports.loadUsedOnFailed = loadUsedOnFailed;
exports.saveUsedOn = saveUsedOn;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "./node_modules/isomorphic-fetch/fetch-npm-browserify.js"));
var _usedOnTypes = _interopRequireDefault(__webpack_require__(/*! ./usedOnTypes */ "./client/src/state/usedOn/usedOnTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function saveUsedOn(identifier, usedOn) {
  return {
    type: _usedOnTypes.default.SAVE_USED_ON,
    payload: {
      identifier,
      usedOn
    }
  };
}
function loadUsedOnFailed(identifier, error) {
  return {
    type: _usedOnTypes.default.LOAD_USED_ON_FAILED,
    payload: {
      identifier,
      error: error.message
    }
  };
}
function loadUsedOn(identifier, method, url) {
  const settings = {
    method,
    headers: {
      Accept: 'application/json'
    },
    credentials: 'same-origin'
  };
  return dispatch => {
    if (!identifier || !method || !url) {
      const message = _i18n.default._t('Admin.NOT_AVAILABLE_USED_DATA', 'The usage data is currently unavailable.');
      return Promise.resolve(dispatch(loadUsedOnFailed(identifier, message)));
    }
    dispatch({
      type: _usedOnTypes.default.LOAD_USED_ON,
      payload: {
        identifier
      }
    });
    return (0, _isomorphicFetch.default)(url, settings).then(response => response.json()).then(usedOn => {
      dispatch(saveUsedOn(identifier, usedOn));
    }).catch(error => {
      dispatch(loadUsedOnFailed(identifier, error));
    });
  };
}

/***/ }),

/***/ "./client/src/state/usedOn/usedOnReducer.js":
/*!**************************************************!*\
  !*** ./client/src/state/usedOn/usedOnReducer.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _usedOnTypes = _interopRequireDefault(__webpack_require__(/*! ./usedOnTypes */ "./client/src/state/usedOn/usedOnTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = {
  loading: [],
  usedOn: {},
  errors: {}
};
function usedOnReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const identifier = action && action.payload && action.payload.identifier;
  if (!identifier) {
    return state;
  }
  switch (action.type) {
    case _usedOnTypes.default.SAVE_USED_ON:
      {
        const usedOn = action.payload.usedOn;
        return {
          ...state,
          loading: state.loading.filter(loading => loading !== identifier),
          usedOn: {
            ...state.usedOn,
            [identifier]: usedOn.usage
          }
        };
      }
    case _usedOnTypes.default.LOAD_USED_ON:
      {
        if (state.loading.includes(identifier)) {
          return state;
        }
        return {
          ...state,
          loading: [...state.loading, identifier],
          errors: Object.entries(state.errors).reduce((result, _ref) => {
            let [key, error] = _ref;
            if (key === identifier) {
              return result;
            }
            return {
              ...result,
              [key]: error
            };
          }, {})
        };
      }
    case _usedOnTypes.default.LOAD_USED_ON_FAILED:
      {
        const error = action.payload.error;
        return {
          ...state,
          loading: state.loading.filter(loading => loading !== identifier),
          errors: {
            ...state.errors,
            [identifier]: error
          }
        };
      }
    default:
      {
        return state;
      }
  }
}
var _default = exports["default"] = usedOnReducer;

/***/ }),

/***/ "./client/src/state/usedOn/usedOnTypes.js":
/*!************************************************!*\
  !*** ./client/src/state/usedOn/usedOnTypes.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const ACTION_TYPES = {
  LOAD_USED_ON: 'LOAD_USED_ON',
  SAVE_USED_ON: 'SAVE_USED_ON',
  LOAD_USED_ON_FAILED: 'LOAD_USED_ON_FAILED'
};
var _default = exports["default"] = ACTION_TYPES;

/***/ }),

/***/ "./client/src/state/viewMode/ViewModeActionTypes.js":
/*!**********************************************************!*\
  !*** ./client/src/state/viewMode/ViewModeActionTypes.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  SELECT_EDIT: 'SELECT_EDIT',
  SELECT_PREVIEW: 'SELECT_PREVIEW',
  SELECT_SPLIT: 'SELECT_SPLIT',
  SPLIT_AVAILABLE: 'SPLIT_AVAILABLE'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeActions.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeActions.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.enableOrDisableSplitMode = enableOrDisableSplitMode;
exports.selectEditMode = selectEditMode;
exports.selectPreviewMode = selectPreviewMode;
exports.selectSplitMode = selectSplitMode;
var _ViewModeActionTypes = _interopRequireDefault(__webpack_require__(/*! ./ViewModeActionTypes */ "./client/src/state/viewMode/ViewModeActionTypes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function selectEditMode() {
  return {
    type: _ViewModeActionTypes.default.SELECT_EDIT
  };
}
function selectPreviewMode() {
  return {
    type: _ViewModeActionTypes.default.SELECT_PREVIEW
  };
}
function selectSplitMode() {
  return {
    type: _ViewModeActionTypes.default.SELECT_SPLIT
  };
}
function enableOrDisableSplitMode(panelWidth) {
  return {
    type: _ViewModeActionTypes.default.SPLIT_AVAILABLE,
    payload: {
      panelWidth
    }
  };
}

/***/ }),

/***/ "./client/src/state/viewMode/ViewModeReducer.js":
/*!******************************************************!*\
  !*** ./client/src/state/viewMode/ViewModeReducer.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _ViewModeActionTypes = _interopRequireDefault(__webpack_require__(/*! ./ViewModeActionTypes */ "./client/src/state/viewMode/ViewModeActionTypes.js"));
var _constants = __webpack_require__(/*! ../../lib/constants */ "./client/src/lib/constants.js");
var _ViewModeStates = __webpack_require__(/*! ./ViewModeStates */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeStates.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initialState = {
  activeState: _ViewModeStates.VIEW_MODE_STATES.SPLIT,
  splitAvailable: true,
  lockState: false
};
function reducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _ViewModeActionTypes.default.SELECT_EDIT:
      {
        return {
          ...state,
          activeState: _ViewModeStates.VIEW_MODE_STATES.EDIT,
          lockState: true
        };
      }
    case _ViewModeActionTypes.default.SELECT_PREVIEW:
      {
        return {
          ...state,
          activeState: _ViewModeStates.VIEW_MODE_STATES.PREVIEW,
          lockState: true
        };
      }
    case _ViewModeActionTypes.default.SELECT_SPLIT:
      {
        return {
          ...state,
          activeState: _ViewModeStates.VIEW_MODE_STATES.SPLIT,
          lockState: false
        };
      }
    case _ViewModeActionTypes.default.SPLIT_AVAILABLE:
      {
        const splitAvailable = action.payload.panelWidth > _constants.SPLITMODE_BREAKPOINT;
        let activeState = state.activeState;
        if (!state.lockState && activeState === _ViewModeStates.VIEW_MODE_STATES.SPLIT && !splitAvailable) {
          activeState = _ViewModeStates.VIEW_MODE_STATES.EDIT;
        } else if (!state.lockState && activeState === _ViewModeStates.VIEW_MODE_STATES.EDIT && splitAvailable) {
          activeState = _ViewModeStates.VIEW_MODE_STATES.SPLIT;
        }
        return {
          ...state,
          splitAvailable,
          activeState
        };
      }
    default:
      {
        return state;
      }
  }
}
var _default = exports["default"] = reducer;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeStates.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeStates.js ***!
  \*******************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VIEW_MODE_STATES = void 0;
const VIEW_MODE_STATES = exports.VIEW_MODE_STATES = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  SPLIT: 'split'
};

/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Accordion!./client/src/components/Accordion/Accordion.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Accordion!./client/src/components/Accordion/Accordion-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Accordion.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Accordion/Accordion.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Accordion"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Accordion"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Accordion" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=AccordionBlock!./client/src/components/Accordion/AccordionBlock.js":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=AccordionBlock!./client/src/components/Accordion/AccordionBlock-exposed.js ***!
  \***********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./AccordionBlock.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Accordion/AccordionBlock.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["AccordionBlock"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["AccordionBlock"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "AccordionBlock" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=BackButton!./client/src/components/Button/BackButton.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=BackButton!./client/src/components/Button/BackButton-exposed.js ***!
  \************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./BackButton.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/BackButton.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["BackButton"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["BackButton"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "BackButton" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Backend!./client/src/lib/Backend.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Backend!./client/src/lib/Backend-exposed.js ***!
  \****************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Backend.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Backend.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Backend"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Backend"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Backend" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Badge!./client/src/components/Badge/Badge.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Badge!./client/src/components/Badge/Badge-exposed.js ***!
  \*************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Badge.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Badge/Badge.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Badge"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Badge"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Badge" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Breadcrumb!./client/src/components/Breadcrumb/Breadcrumb.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Breadcrumb!./client/src/components/Breadcrumb/Breadcrumb-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Breadcrumb.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Breadcrumb/Breadcrumb.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Breadcrumb"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Breadcrumb"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Breadcrumb" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=BreadcrumbsActions!./client/src/state/breadcrumbs/BreadcrumbsActions.js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=BreadcrumbsActions!./client/src/state/breadcrumbs/BreadcrumbsActions-exposed.js ***!
  \****************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./BreadcrumbsActions.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/breadcrumbs/BreadcrumbsActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["BreadcrumbsActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["BreadcrumbsActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "BreadcrumbsActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Button!./client/src/components/Button/Button.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Button!./client/src/components/Button/Button-exposed.js ***!
  \****************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Button.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Button/Button.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Button"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Button"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Button" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=CheckboxSetField!./client/src/components/CheckboxSetField/CheckboxSetField.js":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=CheckboxSetField!./client/src/components/CheckboxSetField/CheckboxSetField-exposed.js ***!
  \**********************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./CheckboxSetField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/CheckboxSetField/CheckboxSetField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["CheckboxSetField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["CheckboxSetField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "CheckboxSetField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=CircularLoading!./client/src/components/Loading/CircularLoading.js":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=CircularLoading!./client/src/components/Loading/CircularLoading-exposed.js ***!
  \***********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./CircularLoading.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Loading/CircularLoading.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["CircularLoading"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["CircularLoading"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "CircularLoading" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=CompactTagList!./client/src/components/Tag/CompactTagList.js":
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=CompactTagList!./client/src/components/Tag/CompactTagList-exposed.js ***!
  \*****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./CompactTagList.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/CompactTagList.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["CompactTagList"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["CompactTagList"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "CompactTagList" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Config!./client/src/lib/Config.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Config!./client/src/lib/Config-exposed.js ***!
  \**************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Config.js */ "./client/src/lib/Config.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Config"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Config"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Config" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=DataFormat!./client/src/lib/DataFormat.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=DataFormat!./client/src/lib/DataFormat-exposed.js ***!
  \**********************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./DataFormat.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/DataFormat.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["DataFormat"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["DataFormat"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "DataFormat" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=EmotionCssCacheProvider!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=EmotionCssCacheProvider!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider-exposed.js ***!
  \*******************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./EmotionCssCacheProvider.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/EmotionCssCacheProvider/EmotionCssCacheProvider.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["EmotionCssCacheProvider"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["EmotionCssCacheProvider"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "EmotionCssCacheProvider" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FieldHolder!./client/src/components/FieldHolder/FieldHolder.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FieldHolder!./client/src/components/FieldHolder/FieldHolder-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FieldHolder.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FieldHolder/FieldHolder.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FieldHolder"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FieldHolder"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FieldHolder" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FileSchemaModalHandler!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js":
/*!*********************************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FileSchemaModalHandler!./client/src/containers/InsertLinkModal/fileSchemaModalHandler-exposed.js ***!
  \*********************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./fileSchemaModalHandler.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FileSchemaModalHandler"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FileSchemaModalHandler"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FileSchemaModalHandler" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FileStatusIcon!./client/src/components/FileStatusIcon/FileStatusIcon.js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FileStatusIcon!./client/src/components/FileStatusIcon/FileStatusIcon-exposed.js ***!
  \****************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FileStatusIcon.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FileStatusIcon/FileStatusIcon.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FileStatusIcon"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FileStatusIcon"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FileStatusIcon" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Focusedzone!./client/src/components/Focusedzone/Focusedzone.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Focusedzone!./client/src/components/Focusedzone/Focusedzone-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Focusedzone.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Focusedzone/Focusedzone.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Focusedzone"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Focusedzone"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Focusedzone" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Form!./client/src/components/Form/Form-exposed.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Form!./client/src/components/Form/Form-exposed.js ***!
  \**********************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Form.js */ "./client/src/components/Form/Form.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Form"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Form"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Form" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FormAction!./client/src/components/FormAction/FormAction.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FormAction!./client/src/components/FormAction/FormAction-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FormAction.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAction/FormAction.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FormAction"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FormAction"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FormAction" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FormAlert!./client/src/components/FormAlert/FormAlert.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FormAlert!./client/src/components/FormAlert/FormAlert-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FormAlert.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormAlert/FormAlert.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FormAlert"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FormAlert"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FormAlert" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilder!./client/src/components/FormBuilder/FormBuilder.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilder!./client/src/components/FormBuilder/FormBuilder-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FormBuilder.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilder/FormBuilder.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FormBuilder"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FormBuilder"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FormBuilder" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilderLoader!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilderLoader!./client/src/containers/FormBuilderLoader/FormBuilderLoader-exposed.js ***!
  \*************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FormBuilderLoader.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FormBuilderLoader"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FormBuilderLoader"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FormBuilderLoader" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilderModal!./client/src/components/FormBuilderModal/FormBuilderModal.js":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FormBuilderModal!./client/src/components/FormBuilderModal/FormBuilderModal-exposed.js ***!
  \**********************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FormBuilderModal.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/FormBuilderModal/FormBuilderModal.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FormBuilderModal"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FormBuilderModal"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FormBuilderModal" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=FormConstants!./client/src/components/Form/FormConstants.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=FormConstants!./client/src/components/Form/FormConstants-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./FormConstants.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Form/FormConstants.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["FormConstants"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["FormConstants"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "FormConstants" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=GridField!./client/src/components/GridField/GridField.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=GridField!./client/src/components/GridField/GridField-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./GridField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["GridField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["GridField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "GridField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldCell!./client/src/components/GridField/GridFieldCell.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldCell!./client/src/components/GridField/GridFieldCell-exposed.js ***!
  \*********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./GridFieldCell.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldCell.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldCell"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldCell"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "GridFieldCell" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldHeader!./client/src/components/GridField/GridFieldHeader.js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldHeader!./client/src/components/GridField/GridFieldHeader-exposed.js ***!
  \*************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./GridFieldHeader.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeader.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldHeader"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldHeader"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "GridFieldHeader" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldHeaderCell!./client/src/components/GridField/GridFieldHeaderCell.js":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldHeaderCell!./client/src/components/GridField/GridFieldHeaderCell-exposed.js ***!
  \*********************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./GridFieldHeaderCell.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldHeaderCell.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldHeaderCell"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldHeaderCell"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "GridFieldHeaderCell" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldRow!./client/src/components/GridField/GridFieldRow.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldRow!./client/src/components/GridField/GridFieldRow-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./GridFieldRow.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldRow.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldRow"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldRow"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "GridFieldRow" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldTable!./client/src/components/GridField/GridFieldTable.js":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=GridFieldTable!./client/src/components/GridField/GridFieldTable-exposed.js ***!
  \***********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./GridFieldTable.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/GridField/GridFieldTable.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldTable"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["GridFieldTable"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "GridFieldTable" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=HiddenField!./client/src/components/HiddenField/HiddenField.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=HiddenField!./client/src/components/HiddenField/HiddenField-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./HiddenField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/HiddenField/HiddenField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["HiddenField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["HiddenField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "HiddenField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Injector!./client/src/lib/Injector.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Injector!./client/src/lib/Injector-exposed.js ***!
  \******************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Injector.js */ "./client/src/lib/Injector.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Injector"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Injector"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Injector" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=InsertLinkModal!./client/src/containers/InsertLinkModal/InsertLinkModal.js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=InsertLinkModal!./client/src/containers/InsertLinkModal/InsertLinkModal-exposed.js ***!
  \*******************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./InsertLinkModal.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/InsertLinkModal/InsertLinkModal.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["InsertLinkModal"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["InsertLinkModal"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "InsertLinkModal" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ListGroup!./client/src/components/ListGroup/ListGroup.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ListGroup!./client/src/components/ListGroup/ListGroup-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ListGroup.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroup.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ListGroup"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ListGroup"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ListGroup" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ListGroupItem!./client/src/components/ListGroup/ListGroupItem.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ListGroupItem!./client/src/components/ListGroup/ListGroupItem-exposed.js ***!
  \*********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ListGroupItem.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ListGroup/ListGroupItem.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ListGroupItem"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ListGroupItem"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ListGroupItem" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=LiteralField!./client/src/components/LiteralField/LiteralField.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=LiteralField!./client/src/components/LiteralField/LiteralField-exposed.js ***!
  \**********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./LiteralField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/LiteralField/LiteralField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["LiteralField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["LiteralField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "LiteralField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Loading!./client/src/components/Loading/Loading.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Loading!./client/src/components/Loading/Loading-exposed.js ***!
  \*******************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Loading.js */ "./client/src/components/Loading/Loading.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Loading"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Loading"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Loading" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Modal!./client/src/components/Modal/Modal.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Modal!./client/src/components/Modal/Modal-exposed.js ***!
  \*************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Modal.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Modal/Modal.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Modal"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Modal"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Modal" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=PopoverField!./client/src/components/PopoverField/PopoverField.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=PopoverField!./client/src/components/PopoverField/PopoverField-exposed.js ***!
  \**********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./PopoverField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/PopoverField/PopoverField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["PopoverField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["PopoverField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "PopoverField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Preview!./client/src/components/Preview/Preview.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Preview!./client/src/components/Preview/Preview-exposed.js ***!
  \*******************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Preview.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Preview/Preview.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Preview"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Preview"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Preview" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ReactRouteRegister!./client/src/lib/ReactRouteRegister.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ReactRouteRegister!./client/src/lib/ReactRouteRegister-exposed.js ***!
  \**************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ReactRouteRegister.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ReactRouteRegister.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ReactRouteRegister"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ReactRouteRegister"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ReactRouteRegister" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=RecordsActionTypes!./client/src/state/records/RecordsActionTypes.js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=RecordsActionTypes!./client/src/state/records/RecordsActionTypes-exposed.js ***!
  \************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./RecordsActionTypes.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActionTypes.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["RecordsActionTypes"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["RecordsActionTypes"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "RecordsActionTypes" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=RecordsActions!./client/src/state/records/RecordsActions.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=RecordsActions!./client/src/state/records/RecordsActions-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./RecordsActions.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/records/RecordsActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["RecordsActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["RecordsActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "RecordsActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ResizeAware!./client/src/components/ResizeAware/ResizeAware.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ResizeAware!./client/src/components/ResizeAware/ResizeAware-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ResizeAware.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ResizeAware/ResizeAware.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ResizeAware"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ResizeAware"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ResizeAware" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Router!./client/src/lib/Router.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Router!./client/src/lib/Router-exposed.js ***!
  \**************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Router.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/Router.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Router"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Router"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Router" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=SchemaActions!./client/src/state/schema/SchemaActions.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=SchemaActions!./client/src/state/schema/SchemaActions-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./SchemaActions.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/schema/SchemaActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["SchemaActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["SchemaActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "SchemaActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Search!./client/src/components/Search/Search.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Search!./client/src/components/Search/Search-exposed.js ***!
  \****************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Search.js */ "./client/src/components/Search/Search.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Search"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Search"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Search" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=SearchToggle!./client/src/components/Search/SearchToggle.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=SearchToggle!./client/src/components/Search/SearchToggle-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./SearchToggle.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Search/SearchToggle.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["SearchToggle"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["SearchToggle"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "SearchToggle" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=SearchableDropdownField!./client/src/components/SearchableDropdownField/SearchableDropdownField.js":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=SearchableDropdownField!./client/src/components/SearchableDropdownField/SearchableDropdownField-exposed.js ***!
  \*******************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./SearchableDropdownField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/SearchableDropdownField/SearchableDropdownField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["SearchableDropdownField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["SearchableDropdownField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "SearchableDropdownField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ShortcodeSerialiser!./client/src/lib/ShortcodeSerialiser.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ShortcodeSerialiser!./client/src/lib/ShortcodeSerialiser-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ShortcodeSerialiser.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/ShortcodeSerialiser.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ShortcodeSerialiser"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ShortcodeSerialiser"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ShortcodeSerialiser" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=SilverStripeComponent!./client/src/lib/SilverStripeComponent.js":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=SilverStripeComponent!./client/src/lib/SilverStripeComponent-exposed.js ***!
  \********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./SilverStripeComponent.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/SilverStripeComponent.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["SilverStripeComponent"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["SilverStripeComponent"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "SilverStripeComponent" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=SudoMode!./client/src/containers/SudoMode/SudoMode.js":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=SudoMode!./client/src/containers/SudoMode/SudoMode-exposed.js ***!
  \**********************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./SudoMode.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/containers/SudoMode/SudoMode.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["SudoMode"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["SudoMode"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "SudoMode" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=TabsActions!./client/src/state/tabs/TabsActions.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=TabsActions!./client/src/state/tabs/TabsActions-exposed.js ***!
  \*******************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./TabsActions.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/tabs/TabsActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["TabsActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["TabsActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "TabsActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Tag!./client/src/components/Tag/Tag.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Tag!./client/src/components/Tag/Tag-exposed.js ***!
  \*******************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Tag.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/Tag.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Tag"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Tag"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Tag" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=TagList!./client/src/components/Tag/TagList.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=TagList!./client/src/components/Tag/TagList-exposed.js ***!
  \***************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./TagList.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tag/TagList.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["TagList"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["TagList"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "TagList" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=TextField!./client/src/components/TextField/TextField.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=TextField!./client/src/components/TextField/TextField-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./TextField.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TextField/TextField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["TextField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["TextField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "TextField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=TinyMCEActionRegistrar!./client/src/lib/TinyMCEActionRegistrar.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=TinyMCEActionRegistrar!./client/src/lib/TinyMCEActionRegistrar-exposed.js ***!
  \**********************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./TinyMCEActionRegistrar.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/TinyMCEActionRegistrar.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["TinyMCEActionRegistrar"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["TinyMCEActionRegistrar"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "TinyMCEActionRegistrar" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Tip!./client/src/components/Tip/Tip.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Tip!./client/src/components/Tip/Tip-exposed.js ***!
  \*******************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Tip.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Tip/Tip.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Tip"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Tip"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Tip" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ToastsActions!./client/src/state/toasts/ToastsActions.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ToastsActions!./client/src/state/toasts/ToastsActions-exposed.js ***!
  \*************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ToastsActions.js */ "./client/src/state/toasts/ToastsActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ToastsActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ToastsActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ToastsActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=Toolbar!./client/src/components/Toolbar/Toolbar.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=Toolbar!./client/src/components/Toolbar/Toolbar-exposed.js ***!
  \*******************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./Toolbar.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/Toolbar/Toolbar.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["Toolbar"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["Toolbar"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "Toolbar" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=TreeDropdownField!./client/src/components/TreeDropdownField/TreeDropdownField.js":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=TreeDropdownField!./client/src/components/TreeDropdownField/TreeDropdownField-exposed.js ***!
  \*************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./TreeDropdownField.js */ "./client/src/components/TreeDropdownField/TreeDropdownField.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["TreeDropdownField"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["TreeDropdownField"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "TreeDropdownField" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=TreeDropdownFieldNode!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js":
/*!*********************************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=TreeDropdownFieldNode!./client/src/components/TreeDropdownField/TreeDropdownFieldNode-exposed.js ***!
  \*********************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./TreeDropdownFieldNode.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["TreeDropdownFieldNode"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["TreeDropdownFieldNode"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "TreeDropdownFieldNode" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=UnsavedFormsActions!./client/src/state/unsavedForms/UnsavedFormsActions.js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=UnsavedFormsActions!./client/src/state/unsavedForms/UnsavedFormsActions-exposed.js ***!
  \*******************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./UnsavedFormsActions.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/unsavedForms/UnsavedFormsActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["UnsavedFormsActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["UnsavedFormsActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "UnsavedFormsActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=VersionedBadge!./client/src/components/VersionedBadge/VersionedBadge.js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=VersionedBadge!./client/src/components/VersionedBadge/VersionedBadge-exposed.js ***!
  \****************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./VersionedBadge.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/VersionedBadge/VersionedBadge.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["VersionedBadge"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["VersionedBadge"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "VersionedBadge" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeActions!./client/src/state/viewMode/ViewModeActions.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeActions!./client/src/state/viewMode/ViewModeActions-exposed.js ***!
  \*******************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ViewModeActions.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeActions.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ViewModeActions"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ViewModeActions"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ViewModeActions" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeStates!./client/src/state/viewMode/ViewModeStates.js":
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeStates!./client/src/state/viewMode/ViewModeStates-exposed.js ***!
  \*****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ViewModeStates.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/state/viewMode/ViewModeStates.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ViewModeStates"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ViewModeStates"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ViewModeStates" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeToggle!./client/src/components/ViewModeToggle/ViewModeToggle.js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ViewModeToggle!./client/src/components/ViewModeToggle/ViewModeToggle-exposed.js ***!
  \****************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./ViewModeToggle.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/components/ViewModeToggle/ViewModeToggle.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ViewModeToggle"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ViewModeToggle"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ViewModeToggle" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=formatWrittenNumber!./client/src/lib/formatWrittenNumber.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=formatWrittenNumber!./client/src/lib/formatWrittenNumber-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./formatWrittenNumber.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/formatWrittenNumber.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["formatWrittenNumber"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["formatWrittenNumber"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "formatWrittenNumber" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=getFormState!./client/src/lib/getFormState.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=getFormState!./client/src/lib/getFormState-exposed.js ***!
  \**************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./getFormState.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/getFormState.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["getFormState"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["getFormState"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "getFormState" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=reduxFieldReducer!./client/src/lib/reduxFieldReducer.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=reduxFieldReducer!./client/src/lib/reduxFieldReducer-exposed.js ***!
  \************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./reduxFieldReducer.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/reduxFieldReducer.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["reduxFieldReducer"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["reduxFieldReducer"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "reduxFieldReducer" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=schemaFieldValues!./client/src/lib/schemaFieldValues.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=schemaFieldValues!./client/src/lib/schemaFieldValues-exposed.js ***!
  \************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./schemaFieldValues.js */ "./client/src/lib/schemaFieldValues.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["schemaFieldValues"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["schemaFieldValues"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "schemaFieldValues" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=ssUrlLib!./client/src/lib/urls.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=ssUrlLib!./client/src/lib/urls-exposed.js ***!
  \**************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./urls.js */ "./client/src/lib/urls.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["ssUrlLib"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["ssUrlLib"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "ssUrlLib" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=withDragDropContext!./client/src/lib/withDragDropContext.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=withDragDropContext!./client/src/lib/withDragDropContext-exposed.js ***!
  \****************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./withDragDropContext.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/withDragDropContext.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["withDragDropContext"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["withDragDropContext"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "withDragDropContext" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "./node_modules/expose-loader/dist/cjs.js?exposes=withRouter!./client/src/lib/withRouter.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/expose-loader/dist/cjs.js?exposes=withRouter!./client/src/lib/withRouter-exposed.js ***!
  \**********************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./withRouter.js */ "./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0]!./client/src/lib/withRouter.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../../node_modules/expose-loader/dist/runtime/getGlobalThis.js */ "./node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["withRouter"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["withRouter"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "withRouter" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "i18n":
/*!***********************!*\
  !*** external "i18n" ***!
  \***********************/
/***/ (function(module) {

"use strict";
module.exports = i18n;

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./client/src/bundles/bundle.js"));
/******/ }
]);
//# sourceMappingURL=bundle.js.map