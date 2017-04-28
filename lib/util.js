"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.base64UrlSafeEncode = base64UrlSafeEncode;
exports.base64UrlSafeDecode = base64UrlSafeDecode;

var _nodeForge = require("node-forge");

function base64UrlSafeEncode(str) {
  return _nodeForge.util.encode64(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlSafeDecode(str) {
  return _nodeForge.util.decode64((str + "===".slice((str.length + 3) % 4)).replace(/\-/g, "+").replace(/_/g, "/"));
}