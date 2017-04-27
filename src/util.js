// @flow

import { util } from "node-forge";

export function base64UrlSafeEncode(str: string): string {
  return util
    .encode64(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function base64UrlSafeDecode(str: string): string {
  return util.decode64(
    (str + "===".slice((str.length + 3) % 4))
      .replace(/\-/g, "+")
      .replace(/_/g, "/")
  );
}
