module.exports = {
  generateKeyPair: () => { throw new Error('preflight-signing-error'); },
  sign: () => 'sig',
  verify: () => true,
  sha256: () => '8e5e94b087094208a38ec2d8291410427c593630f9a265c197945037d6e6f663',
  sha512: () => 'sha512hash',
};
