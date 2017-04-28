// @flow

import { pki, jsbn, md } from "node-forge";
import BadSalmonError from "./bad-salmon-error";
import { base64UrlSafeEncode, base64UrlSafeDecode } from "./util";
import xpath from "xpath";
import dom from "xmldom";

const XMLNS: string = "http://salmon-protocol.org/ns/magic-env";

function createDigest(): Digest {
  return md.sha256.create();
}

function plaintextSignature(
  data: string,
  type: string,
  encoding: string,
  alg: string
): string {
  const signature = [data, type, encoding, alg]
    .map(function(str: string): string {
      return base64UrlSafeEncode(str);
    })
    .join(".");

  return signature;
}

function getPublicKeyPem(key: PrivateKey): string {
  const publicKey = pki.setRsaPublicKey(key.n, key.e);
  return pki.publicKeyToPem(publicKey);
}

export function pack(body: string, key: PrivateKey): string {
  const signed = plaintextSignature(
    body,
    "application/atom+xml",
    "base64url",
    "RSA-SHA256"
  );
  const keyId = base64UrlSafeEncode(getPublicKeyPem(key));
  const base64Body = base64UrlSafeEncode(body);
  const digest = createDigest().update(signed);
  const signature = base64UrlSafeEncode(key.sign(digest));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<me:env xmlns:me="${XMLNS}">
  <me:data type="application/atom+xml">${base64Body}</me:data>
  <me:encoding>base64url</me:encoding>
  <me:alg>RSA-SHA256</me:alg>
  <me:sig key_id="${keyId}">${signature}</me:sig>
</me:env>`;

  return xml;
}

export function unpack(rawBody: string): string {
  const [body, _, __] = parse(rawBody);

  return body;
}

export function verify(rawBody: string, key: PublicKey): boolean {
  const [_, plaintext, signature] = parse(rawBody);
  try {
    const digest = createDigest().update(plaintext);

    return key.verify(digest.digest().bytes(), signature);
  } catch (e) {
    return false;
  }
}

function parse(rawBody: string): Array<string> {
  const doc = new dom.DOMParser().parseFromString(rawBody);
  const select = xpath.useNamespaces({
    me: "http://salmon-protocol.org/ns/magic-env"
  });

  const select1 = function(expr, doc) {
    const result = select(expr, doc);

    return result[0];
  };

  const data = select1("//me:data", doc);
  const type = data.getAttribute("type");
  const sig = select("string(//me:sig)", doc);
  const encoding = select("string(//me:encoding)", doc);
  const alg = select("string(//me:alg)", doc);

  [data, type, sig, encoding, alg].map(function(v) {
    if (v === null || v === "" || v === undefined) {
      throw new BadSalmonError();
    }
  });

  const body = base64UrlSafeDecode(select1("text()", data).nodeValue);
  const signature = base64UrlSafeDecode(sig);
  const plaintext = plaintextSignature(body, type, encoding, alg);

  return [body, plaintext, signature];
}

export default {
  pack,
  unpack,
  verify
};
