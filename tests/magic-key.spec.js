import { magicKeyToPem, pemToMagicKey } from "../src/magic-key";

var magicKey =
  "RSA.qDI5GVTdUeLkptVoDKhqFjGxDE2WggFXFC0Fp6hjx5ppHowYK9H087EsS3gTkZIImuemsRB0qTIkno-nBYFCpttkpKhWHmN0mUIEdRPj2aPLS3jK1zeMf20LVh8BeXBOTMfGzHZbqQ8Z3HMtHa-OrzJOGD_asKSDHJVzeGizXN0C_wqlUCzUnS3S8cqWNSCRgW2pS7dwEJKt_4ZpuBft2obBMGtPcuTqTWoyRYJ_kIByh3UP0MJVSqAotaoTCksKUEk79cmEMAKuWxg3Iq1NPNylBf33-KqWBFzALTSNwnEu_awpcnjE7iiEu_FyEz3z65O5d-t3to0R7oypKuuU9Q==.AQAB";
var pem =
  "-----BEGIN PUBLIC KEY-----" +
  "\n" +
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqDI5GVTdUeLkptVoDKhq" +
  "\n" +
  "FjGxDE2WggFXFC0Fp6hjx5ppHowYK9H087EsS3gTkZIImuemsRB0qTIkno+nBYFC" +
  "\n" +
  "pttkpKhWHmN0mUIEdRPj2aPLS3jK1zeMf20LVh8BeXBOTMfGzHZbqQ8Z3HMtHa+O" +
  "\n" +
  "rzJOGD/asKSDHJVzeGizXN0C/wqlUCzUnS3S8cqWNSCRgW2pS7dwEJKt/4ZpuBft" +
  "\n" +
  "2obBMGtPcuTqTWoyRYJ/kIByh3UP0MJVSqAotaoTCksKUEk79cmEMAKuWxg3Iq1N" +
  "\n" +
  "PNylBf33+KqWBFzALTSNwnEu/awpcnjE7iiEu/FyEz3z65O5d+t3to0R7oypKuuU" +
  "\n" +
  "9QIDAQAB" +
  "\n" +
  "-----END PUBLIC KEY-----" +
  "\n";

describe("magic-key", function() {
  describe("magicKeyToPem", function() {
    it("returns a pem key", function() {
      let subject = magicKeyToPem(magicKey);

      expect(subject).toEqual(
        expect.stringMatching(/^-----BEGIN PUBLIC KEY-----/)
      );
    });
  });

  describe("pemToMagicKey", function() {
    it("returns a magic key", function() {
      let subject = pemToMagicKey(pem);
      let subject2 = pemToMagicKey(magicKeyToPem(subject));

      expect(subject).toBe(subject2);
    });
  });
});
