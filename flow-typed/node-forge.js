declare type BigInteger = number;
declare type PublicKey = { n: BigInteger, e: BigInteger, verify: Function };
declare type PrivateKey = {
  n: BigInteger,
  e: BigInteger,
  d: any,
  p: any,
  q: any,
  dP: any,
  dQ: any,
  qInv: any,
  sign: Function
};

declare type Digest = {
  create: Function,
  update: Function,
  digest: Function
};

declare module "node-forge" {
  declare module.exports: {
    jsbn: Object,
    pki: Object,
    util: Object,
    hmac: Object,
    md: Object
  };
}
