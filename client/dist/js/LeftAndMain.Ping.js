"use strict";
(self["webpackChunksilverstripe_admin"] = self["webpackChunksilverstripe_admin"] || []).push([["LeftAndMain.Ping"],{

/***/ "./client/src/legacy/LeftAndMain.Ping.js":
/*!***********************************************!*\
  !*** ./client/src/legacy/LeftAndMain.Ping.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {



var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss.ping', function ($) {
  $('.cms-container').entwine({
    PingIntervalSeconds: 5 * 60,
    onadd: function () {
      this._setupPinging();
      this._super();
    },
    _setupPinging: function () {
      var interval = null;
      var loginPopup = null;
      var onSessionLost = function (xmlhttp, status) {
        if (xmlhttp.status < 400 && xmlhttp.responseText != 0) {
          return;
        }
        if (!loginPopup || loginPopup.closed) {
          loginPopup = window.open('Security/login');
          if (!loginPopup) {
            alert('Please enable pop-ups for this site');
            clearInterval(interval);
          }
        }
        if (loginPopup) {
          loginPopup.focus();
        }
      };
      interval = setInterval(function () {
        $.ajax({
          url: 'Security/ping',
          global: false,
          type: 'POST',
          complete: onSessionLost
        });
      }, this.getPingIntervalSeconds() * 1000);
    }
  });
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./client/src/legacy/LeftAndMain.Ping.js"));
/******/ }
]);
//# sourceMappingURL=LeftAndMain.Ping.js.map