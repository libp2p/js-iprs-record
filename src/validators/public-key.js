'use strict'

const assert = require('assert')
const mh = require('multihashes')

/**
 * Validator for publick key records.
 *
 * @param {string} key - A valid key is of the form `'/pk/<keymultihash>'`
 * @param {Buffer} publicKeyHash - The mutlihash of the public key to validate agains.
 * @returns {undefined}
 */
const validatePublicKeyRecord = (key, publicKeyHash) => {
  assert(key && typeof key === 'string', 'key must be a string')
  assert(key.length > 4, 'invalid public key record')

  const prefix = key.slice(0, 4)
  assert(prefix === '/pk/', 'key was not prefixed with /pk/')

  const keyhash = mh.fromB58String(key.slice(4))

  assert(keyhash.equals(publicKeyHash), 'public key does not match passed in key')
}

module.exports = {
  func: validatePublicKeyRecord,
  sign: false
}
