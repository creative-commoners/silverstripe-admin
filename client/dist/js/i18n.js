/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
!function() {
var exports = __webpack_exports__;
/*!****************************!*\
  !*** ./client/src/i18n.js ***!
  \****************************/


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
}();
/******/ })()
;
//# sourceMappingURL=i18n.js.map