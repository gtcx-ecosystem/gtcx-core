module.exports = {
  generateKeyPair: () => 'not-an-object',
  sign: (msg, pk) => 'sig',
  verify: (sig, msg, pub) => true,
  sha256: (data) => 'sha256hash',
  sha512: (data) => 'sha512hash',
};
