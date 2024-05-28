/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "lib/ShortcodeSerialiser":
/*!**************************************!*\
  !*** external "ShortcodeSerialiser" ***!
  \**************************************/
/***/ (function(module) {

module.exports = ShortcodeSerialiser;

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
/*!*********************************************!*\
  !*** ./client/src/legacy/TinyMCE_sslink.js ***!
  \*********************************************/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _TinyMCEActionRegistrar = _interopRequireDefault(__webpack_require__(/*! lib/TinyMCEActionRegistrar */ "lib/TinyMCEActionRegistrar"));
var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
var _ShortcodeSerialiser = __webpack_require__(/*! lib/ShortcodeSerialiser */ "lib/ShortcodeSerialiser");
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const plugin = {
  init(editor) {
    function getActions() {
      return _TinyMCEActionRegistrar.default.getSortedActions('sslink', editor.getParam('editorIdentifier'), true).map(action => Object.assign({}, action, {
        onAction: () => action.onAction(editor)
      }));
    }
    const metaKey = navigator.platform.toUpperCase().includes('MAC') ? '⌘' : 'Ctrl';
    const title = _i18n.default._t('Admin.INSERT_LINK', 'Insert link');
    const titleWithShortcut = _i18n.default.inject(_i18n.default._t('Admin.INSERT_LINK_WITH_SHORTCUT', 'Insert link {shortcut}'), {
      shortcut: `[${metaKey}+K]`
    });
    editor.addShortcut('Meta+k', 'Open link menu', () => {
      (0, _jquery.default)(`[aria-label^=\"${title}\"] > button`, editor.container).first().click();
    });
    function openLinkDialog() {
      const node = tinymce.activeEditor.selection.getNode();
      const href = node.getAttribute('href');
      if (href) {
        editor.execCommand(_TinyMCEActionRegistrar.default.getEditorCommandFromUrl(href));
      }
    }
    editor.ui.registry.addMenuButton('sslink', {
      icon: 'link',
      tooltip: titleWithShortcut,
      fetch: callback => callback(getActions())
    });
    editor.ui.registry.addNestedMenuItem('sslink', {
      icon: 'link',
      text: title,
      getSubmenuItems: getActions
    });
    editor.ui.registry.addButton('sslink-edit', {
      text: _i18n.default._t('Admin.EDIT_LINK', 'Edit link'),
      onAction: openLinkDialog
    });
    editor.ui.registry.addButton('sslink-remove', {
      text: _i18n.default._t('Admin.REMOVE_LINK', 'Remove link'),
      onAction: () => this.handleRemoveLinkClick(editor)
    });
    editor.ui.registry.addContextToolbar('sslink', {
      predicate: node => editor.dom.is(node, 'a[href]'),
      position: 'node',
      scope: 'node',
      items: 'sslink-edit sslink-remove'
    });
    return {
      getMetadata() {
        return {
          name: 'Silverstripe Link',
          url: 'https://docs.silverstripe.org/en/4/developer_guides/forms/field_types/htmleditorfield'
        };
      }
    };
  },
  handleRemoveLinkClick(editor) {
    const result = editor.execCommand('unlink');
    const node = editor.selection.getNode();
    if (node && typeof node.normalize !== 'undefined') {
      node.normalize();
    }
    return result;
  }
};
_jquery.default.entwine('ss', $ => {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,
    Data: {},
    Bookmark: null,
    onunmatch() {
      this._clearModal();
    },
    _clearModal() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
    open() {
      const editor = this.getElement().getEditor().getInstance();
      this.setBookmark(editor.selection.getBookmark(2, true));
      this.renderModal(true);
    },
    close() {
      this.setData({});
      this.renderModal(false);
    },
    renderModal() {},
    checkNodeMatches(node, matchWith) {
      if (node === matchWith) {
        return true;
      }
      if (matchWith.children.length === 1) {
        return node === matchWith.children[0];
      }
      return false;
    },
    linkCanWrapSelection(editor, selection) {
      const selectionContent = editor.getSelection() || '';
      const node = selection.getNode();
      if (selectionContent) {
        return selectionContent.trim() !== '';
      }
      const x = document.createElement(node.nodeName);
      x.textContent = 'Check the outer HTML';
      if (x.outerHTML.includes('Check the outer HTML')) {
        return false;
      }
      if (this.checkNodeMatches(node, selection.getSel().focusNode) && this.checkNodeMatches(node, selection.getSel().anchorNode)) {
        const parsed = tinymce.activeEditor.dom.createFragment(`<a>${node.outerHTML}</a>`);
        if (parsed.childNodes.length === 1) {
          return true;
        }
      }
      return false;
    },
    getRequireLinkText() {
      const editor = this.getElement().getEditor();
      const selection = editor.getInstance().selection;
      const isValidSelection = this.linkCanWrapSelection(editor, selection);
      const tagName = selection.getNode().tagName;
      const requireLinkText = tagName !== 'A' && !isValidSelection;
      return requireLinkText;
    },
    handleInsert(data) {
      const editor = this.getElement().getEditor().getInstance();
      editor.selection.moveToBookmark(this.getBookmark());
      const attributes = this.buildAttributes(data);
      const sanitise = (0, _ShortcodeSerialiser.createHTMLSanitiser)();
      const linkText = sanitise(data.Text);
      this.insertLinkInEditor(attributes, linkText);
      this.close();
      return Promise.resolve();
    },
    buildAttributes(_ref) {
      let {
        Anchor,
        Link,
        TargetBlank,
        Description
      } = _ref;
      let anchor = Anchor && Anchor.length ? `#${Anchor}` : '';
      anchor = anchor.replace(/^#+/, '#');
      const href = `${Link}${anchor}`;
      return {
        href,
        target: TargetBlank ? '_blank' : '',
        title: Description
      };
    },
    insertLinkInEditor(attributes, linkText) {
      const editor = this.getElement().getEditor();
      editor.insertLink(attributes, null, linkText);
      editor.addUndo();
      editor.repaint();
      const instance = editor.getInstance();
      const selection = instance.selection;
      setTimeout(() => selection && selection.collapse(), 0);
    },
    getOriginalAttributes() {
      const editor = this.getElement().getEditor();
      const node = $(editor.getSelectedNode());
      const hrefParts = (node.attr('href') || '').split('#');
      return {
        Link: hrefParts[0] || '',
        Anchor: hrefParts[1] || '',
        Description: node.attr('title'),
        TargetBlank: !!node.attr('target')
      };
    }
  });
});
tinymce.PluginManager.add('sslink', editor => plugin.init(editor));
var _default = exports["default"] = plugin;
}();
/******/ })()
;
//# sourceMappingURL=TinyMCE_sslink.js.map