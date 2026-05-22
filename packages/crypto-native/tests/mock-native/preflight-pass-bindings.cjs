module.exports = {
  generateKeyPair: () => ({ privateKey: 'aabb', publicKey: 'ccdd' }),
  sign: () => 'eeff',
  verify: () => true,
  sha256: (data) => {
    const input = typeof data === 'string' ? data : Buffer.from(data).toString();
    if (input === 'gtcx-preflight-test') {
      return '8e5e94b087094208a38ec2d8291410427c593630f9a265c197945037d6e6f663';
    }
    return 'sha256hash';
  },
  sha512: () => 'sha512hash',
  version: () => '1.0.0-mock',
};
