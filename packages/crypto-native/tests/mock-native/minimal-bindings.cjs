module.exports = {
  generate_key_pair: () => ({ private_key: 'pk_alt', public_key: 'pub_alt' }),
  sign_ed25519: (msg, pk) => 'sig_alt',
  verify_ed25519: (sig, msg, pub) => true,
  sha256: (data) => 'sha256hash',
  sha512: (data) => 'sha512hash',
};
