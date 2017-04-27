import { pack, verify, unpack } from "../src/salmon";
import pki from "node-forge";
import xpath from "xpath";
import dom from "xmldom";

var keyPair = pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
var keyPairFalsy = pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
var privateKey = keyPair.privateKey;
var publicKey = keyPair.publicKey;

describe("salmon", function() {
  let url = "http://example.com/salmon";
  let body = "Lorem ipsum dolor sit amet";

  describe("pack", function() {
    it("returns a magical envelope", function() {
      let xml = pack(body, privateKey);

      let doc = new dom.DOMParser().parseFromString(xml);

      let select = xpath.useNamespaces({
        me: "http://salmon-protocol.org/ns/magic-env"
      });

      expect(select("string(//me:data)", doc)).not.toHaveLength(0);
      expect(select("string(//me:sig)", doc)).not.toHaveLength(0);
      expect(select("string(//me:alg)", doc)).not.toHaveLength(0);
      expect(select("string(//me:encoding)", doc)).not.toHaveLength(0);
    });
  });

  describe("unpack", function() {
    let envelope = pack(body, privateKey);

    it("returns the original body", function() {
      expect(unpack(envelope)).toEqual(body);
    });
  });

  describe("verify", function() {
    let envelope = pack(body, privateKey);

    it("returns true if the signature is correct", function() {
      expect(verify(envelope, publicKey)).toBe(true);
    });

    it("returns false if the signature cannot be verified", function() {
      expect(verify(envelope, keyPairFalsy.publicKey)).toBe(false);
    });
  });
});
