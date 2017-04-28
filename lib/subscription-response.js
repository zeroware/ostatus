"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubscriptionResponse = function () {
  function SubscriptionResponse(code, body) {
    _classCallCheck(this, SubscriptionResponse);

    this.code = code;
    this.body = body;
  }

  _createClass(SubscriptionResponse, [{
    key: "isSuccessful",
    value: function isSuccessful() {
      return this.code === 202;
    }
  }, {
    key: "isFailed",
    value: function isFailed() {
      return !this.isSuccessful();
    }
  }, {
    key: "getMessage",
    value: function getMessage() {
      return this.body;
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this.body;
    }
  }, {
    key: "getCode",
    value: function getCode() {
      return this.code;
    }
  }]);

  return SubscriptionResponse;
}();

exports.default = SubscriptionResponse;