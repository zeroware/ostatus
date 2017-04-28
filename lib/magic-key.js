"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.magicKeyToPem = magicKeyToPem;
exports.pemToMagicKey = pemToMagicKey;

var _nodeForge = require("node-forge");

var _util = require("./util");

function base64urlToBigInteger(str) {
  var bytes = (0, _util.base64UrlSafeDecode)(str);

  return new _nodeForge.jsbn.BigInteger(_nodeForge.util.bytesToHex(bytes), 16);
}

function bigIntegerToBase64url(bigInt) {
  var hex = bigInt.toString(16);
  var bytes = _nodeForge.util.hexToBytes(hex);

  return (0, _util.base64UrlSafeEncode)(bytes);
}

function magicKeyToPem(magicKey) {
  var _magicKey$split = magicKey.split("."),
      _magicKey$split2 = _slicedToArray(_magicKey$split, 3),
      _ = _magicKey$split2[0],
      modulus = _magicKey$split2[1],
      exponent = _magicKey$split2[2];

  var _map = [modulus, exponent].map(function (c) {
    return base64urlToBigInteger(c);
  }),
      _map2 = _slicedToArray(_map, 2),
      n = _map2[0],
      e = _map2[1];

  var publicKey = _nodeForge.pki.setRsaPublicKey(n, e);

  return _nodeForge.pki.publicKeyToPem(publicKey);
}

function pemToMagicKey(pemString) {
  var publicKey = _nodeForge.pki.publicKeyFromPem(pemString);
  var modulus = publicKey.n;
  var exponent = publicKey.e;

  var magicKeyArray = ["RSA", bigIntegerToBase64url(modulus), bigIntegerToBase64url(exponent)];

  return magicKeyArray.join(".");
}

exports.default = {
  magicKeyToPem: magicKeyToPem,
  pemToMagicKey: pemToMagicKey
};