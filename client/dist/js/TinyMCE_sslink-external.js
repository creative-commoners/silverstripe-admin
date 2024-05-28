/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "lib/Injector":
/*!***************************!*\
  !*** external "Injector" ***!
  \***************************/
/***/ (function(module) {

module.exports = Injector;

/***/ }),

/***/ "containers/InsertLinkModal/InsertLinkModal":
/*!**********************************!*\
  !*** external "InsertLinkModal" ***!
  \**********************************/
/***/ (function(module) {

module.exports = InsertLinkModal;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

module.exports = React;

/***/ }),

/***/ "react-dom/client":
/*!*********************************!*\
  !*** external "ReactDomClient" ***!
  \*********************************/
/***/ (function(module) {

module.exports = ReactDomClient;

/***/ }),

/***/ "lib/TinyMCEActionRegistrar":
/*!*****************************************!*\
  !*** external "TinyMCEActionRegistrar" ***!
  \*****************************************/
/***/ (function(module) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ "i18n":
/*!***********************!*\
  !*** external "i18n" ***!
  \***********************/
/***/ (function(module) {

module.exports = i18n;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
var exports = __webpack_exports__;
/*!******************************************************!*\
  !*** ./client/src/legacy/TinyMCE_sslink-external.js ***!
  \******************************************************/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _TinyMCEActionRegistrar = _interopRequireDefault(__webpack_require__(/*! lib/TinyMCEActionRegistrar */ "lib/TinyMCEActionRegistrar"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _client = __webpack_require__(/*! react-dom/client */ "react-dom/client");
var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
var _InsertLinkModal = __webpack_require__(/*! containers/InsertLinkModal/InsertLinkModal */ "containers/InsertLinkModal/InsertLinkModal");
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const plugin = {
  init(editor) {
    _TinyMCEActionRegistrar.default.addAction('sslink', {
      text: _i18n.default._t('Admin.LINKLABEL_EXTERNALURL', 'Link to external URL'),
      onAction: editorInst => editorInst.execCommand('sslinkexternal'),
      priority: 70
    }, editor.getParam('editorIdentifier'));
    editor.addCommand('sslinkexternal', () => {
      const field = window.jQuery(`#${editor.id}`).entwine('ss');
      field.openLinkExternalDialog();
    });
  }
};
const modalId = 'insert-link__dialog-wrapper--external';
const sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
const formName = 'EditorExternalLink';
const InsertLinkExternalModal = (0, _Injector.loadComponent)((0, _InsertLinkModal.createInsertLinkModal)(sectionConfigKey, formName));
_jquery.default.entwine('ss', $ => {
  $('textarea.htmleditor').entwine({
    openLinkExternalDialog() {
      let dialog = $(`#${modalId}`);
      if (!dialog.length) {
        dialog = $(`<div id="${modalId}" />`);
        $('body').append(dialog);
      }
      dialog.addClass('insert-link__dialog-wrapper');
      dialog.setElement(this);
      dialog.open();
    }
  });
  $(`#${modalId}`).entwine({
    ReactRoot: null,
    renderModal(isOpen) {
      var _this = this;
      const handleHide = () => this.close();
      const handleInsert = function () {
        return _this.handleInsert(...arguments);
      };
      const attrs = this.getOriginalAttributes();
      const requireLinkText = this.getRequireLinkText();
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
        this.setReactRoot(root);
      }
      root.render(_react.default.createElement(InsertLinkExternalModal, {
        isOpen: isOpen,
        onInsert: handleInsert,
        onClosed: handleHide,
        title: _i18n.default._t('Admin.LINK_EXTERNAL', 'Insert external link'),
        bodyClassName: "modal__dialog",
        className: "insert-link__dialog-wrapper--external",
        fileAttributes: attrs,
        identifier: "Admin.InsertLinkExternalModal",
        requireLinkText: requireLinkText
      }));
    },
    buildAttributes(data) {
      const attributes = this._super(data);
      let href = attributes.href;
      if (!href.match(/:\/\//)) {
        href = `${window.location.protocol}//${href}`;
      }
      href = href.replace(/.*:\/\/(#.*)$/, '$1');
      if (href.match(/:\/\/$/)) {
        href = '';
      }
      attributes.href = href;
      return attributes;
    }
  });
});
tinymce.PluginManager.add('sslinkexternal', editor => plugin.init(editor));
var _default = exports["default"] = plugin;
}();
/******/ })()
;
//# sourceMappingURL=TinyMCE_sslink-external.js.map