"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.pack = pack;
exports.unpack = unpack;
exports.verify = verify;
exports.parse = parse;

var _nodeForge = require("node-forge");

var _badSalmonError = require("./bad-salmon-error");

var _badSalmonError2 = _interopRequireDefault(_badSalmonError);

var _util = require("./util");

var _xpath = require("xpath");

var _xpath2 = _interopRequireDefault(_xpath);

var _xmldom = require("xmldom");

var _xmldom2 = _interopRequireDefault(_xmldom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XMLNS = "http://salmon-protocol.org/ns/magic-env";

function createDigest() {
  return _nodeForge.md.sha256.create();
}

function plaintextSignature(data, type, encoding, alg) {
  var signature = [data, type, encoding, alg].map(function (str) {
    return (0, _util.base64UrlSafeEncode)(str);
  }).join(".");

  return signature;
}

function getPublicKeyPem(key) {
  var publicKey = _nodeForge.pki.setRsaPublicKey(key.n, key.e);
  return _nodeForge.pki.publicKeyToPem(publicKey);
}

function pack(body, key) {
  var signed = plaintextSignature(body, "application/atom+xml", "base64url", "RSA-SHA256");
  var keyId = (0, _util.base64UrlSafeEncode)(getPublicKeyPem(key));
  var base64Body = (0, _util.base64UrlSafeEncode)(body);
  var digest = createDigest().update(signed);
  var signature = (0, _util.base64UrlSafeEncode)(key.sign(digest));
  var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<me:env xmlns:me=\"" + XMLNS + "\">\n  <me:data type=\"application/atom+xml\">" + base64Body + "</me:data>\n  <me:encoding>base64url</me:encoding>\n  <me:alg>RSA-SHA256</me:alg>\n  <me:sig key_id=\"" + keyId + "\">" + signature + "</me:sig>\n</me:env>";

  return xml;
}

function unpack(rawBody) {
  var _parse = parse(rawBody),
      _parse2 = _slicedToArray(_parse, 3),
      body = _parse2[0],
      _ = _parse2[1],
      __ = _parse2[2];

  return body;
}

function verify(rawBody, key) {
  var _parse3 = parse(rawBody),
      _parse4 = _slicedToArray(_parse3, 3),
      _ = _parse4[0],
      plaintext = _parse4[1],
      signature = _parse4[2];

  try {
    var digest = createDigest().update(plaintext);

    return key.verify(digest.digest().bytes(), signature);
  } catch (e) {
    return false;
  }
}

function parse(rawBody) {
  var doc = new _xmldom2.default.DOMParser().parseFromString(rawBody);
  var select = _xpath2.default.useNamespaces({
    me: "http://salmon-protocol.org/ns/magic-env"
  });

  var select1 = function select1(expr, doc) {
    var result = select(expr, doc);

    return result[0];
  };

  var data = select1("//me:data", doc);
  var type = data.getAttribute("type");
  var sig = select("string(//me:sig)", doc);
  var encoding = select("string(//me:encoding)", doc);
  var alg = select("string(//me:alg)", doc);

  [data, type, sig, encoding, alg].map(function (v) {
    if (v === null || v === "" || v === undefined) {
      throw new _badSalmonError2.default();
    }
  });

  var body = (0, _util.base64UrlSafeDecode)(select1("text()", data).nodeValue);
  var signature = (0, _util.base64UrlSafeDecode)(sig);
  var plaintext = plaintextSignature(body, type, encoding, alg);

  return [body, plaintext, signature];
}

exports.default = {
  pack: pack,
  unpack: unpack,
  verify: verify
};