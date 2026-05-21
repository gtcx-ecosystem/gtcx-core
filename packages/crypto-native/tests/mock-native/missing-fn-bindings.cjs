module.exports = {
  generateKeyPair: () => ({ privateKey: 'pk', publicKey: 'pub' }),
  sign: (msg, pk) => 'sig',
  verify: (sig, msg, pub) => true,
  // missing sha256 and sha512
};
