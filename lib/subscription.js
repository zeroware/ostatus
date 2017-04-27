"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _subscriptionResponse = require("./subscription-response");

var _subscriptionResponse2 = _interopRequireDefault(_subscriptionResponse);

var _crypto = require("crypto");

var _querystring = require("querystring");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subscription = function () {
  function Subscription(topicUrl, fetchFunction, options) {
    _classCallCheck(this, Subscription);

    this.topicUrl = topicUrl;
    this.fetchFunction = options.fetchFunction;

    this.webhookUrl = options.webhookUrl || "";
    this.secret = options.secret || "";
    this.leaseSeconds = options.leaseSeconds || 0;
    this.hub = options.hub || "";
  }

  _createClass(Subscription, [{
    key: "subscribe",
    value: function subscribe() {
      return this._updateSubscription("subscribe");
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      return this._updateSubscription("unsubscribe");
    }
  }, {
    key: "isValid",
    value: function isValid(topicUrl) {
      return this.topicUrl === topicUrl;
    }
  }, {
    key: "verify",
    value: function verify(content, signature) {
      var hmac = (0, _crypto.createHmac)("sha1", this.secret);
      hmac.update(content);

      return signature === "sha1=#" + hmac.digest("hex");
    }
  }, {
    key: "_updateSubscription",
    value: function _updateSubscription(mode) {
      var hub = this.hub;
      var formData = {
        "hub.mode": mode,
        "hub.callback": webhookUrl,
        "hub.verify": "async",
        "hub.lease_seconds": this.leaseSeconds,
        "hub.secret": this.secret,
        "hub.topic": this.topicUrl
      };

      return this.fetchFunction(hub, {
        method: "POST",
        body: (0, _querystring.stringify)(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }).then(function (response) {
        return new _subscriptionResponse2.default();
      });
    }
  }]);

  return Subscription;
}();

exports.default = Subscription;