// @flow

import { util, pki, jsbn } from "node-forge";
import { base64UrlSafeEncode, base64UrlSafeDecode } from "./util";

function base64urlToBigInteger(str: string) {
  const bytes = base64UrlSafeDecode(str);

  return new jsbn.BigInteger(util.bytesToHex(bytes), 16);
}

function bigIntegerToBase64url(bigInt: Object): string {
  const hex = bigInt.toString(16);
  const bytes = util.hexToBytes(hex);

  return base64UrlSafeEncode(bytes);
}

export function magicKeyToPem(magicKey: string): string {
  const [_, modulus, exponent] = magicKey.split(".");

  const [n, e] = [modulus, exponent].map(function(c) {
    return base64urlToBigInteger(c);
  });

  const publicKey = pki.setRsaPublicKey(n, e);

  return pki.publicKeyToPem(publicKey);
}

export function pemToMagicKey(pemString: string): string {
  const publicKey = pki.publicKeyFromPem(pemString);
  const modulus = publicKey.n;
  const exponent = publicKey.e;

  const magicKeyArray = [
    "RSA",
    bigIntegerToBase64url(modulus),
    bigIntegerToBase64url(exponent)
  ];

  return magicKeyArray.join(".");
}
