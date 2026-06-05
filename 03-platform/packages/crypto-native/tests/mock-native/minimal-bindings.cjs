module.exports = {
  generate_key_pair: () => ({ private_key: 'aabbcc', public_key: 'ccddee' }),
  sign_ed25519: (msg, pk) => 'eeffaa',
  verify_ed25519: (sig, msg, pub) => true,
  sha256: (data) => 'sha256hash',
  sha512: (data) => 'sha512hash',
};
