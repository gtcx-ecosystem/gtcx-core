module.exports = {
  generateKeyPair: () => ({ privateKey: 123, publicKey: 456 }),
  sign: (msg, pk) => 'sig',
  verify: (sig, msg, pub) => true,
  sha256: (data) => 'sha256hash',
  sha512: (data) => 'sha512hash',
};
