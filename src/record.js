'use strict'

const protobuf = require('protocol-buffers')
const Buffer = require('safe-buffer').Buffer
const waterfall = require('async/waterfall')

const Record = protobuf(require('./record.proto')).Record

/**
 * Returns the blob protected by the record signature.
 *
 * @param {string} key
 * @param {Buffer} value
 * @param {Buffer} author
 * @returns {Buffer}
 */
const blobForSignature = (key, value, author) => {
  return Buffer.concat([
    Buffer.from(key),
    value,
    author
  ])
}

/**
 * Create a new record from a private key and a
 * key/value pair.
 *
 * @param {PrivateKey} privKey - private key, used to sign the record
 * @param {string} key - The key of the record
 * @param {Buffer} value - The value of the record
 * @param {function(Error, Record)} callback
 * @returns {undefined}
 */
const create = (privKey, key, value, callback) => {
  privKey.public.hash((err, hash) => {
    if (err) {
      return callback(err)
    }

    let rec
    try {
      rec = Record.encode({
        key: key,
        value: value,
        hash: hash
      })
    } catch (err) {
      return callback(err)
    }

    callback(null, rec)
  })
}

/**
 * Create a new record from a private key and a
 * key/value pair.
 *
 * @param {PrivateKey} privKey - private key, used to sign the record
 * @param {string} key - The key of the record
 * @param {Buffer} value - The value of the record
 * @param {function(Error, Record)} callback
 * @returns {undefined}
 */
const createSigned = (privKey, key, value, callback) => {
  let author
  waterfall([
    (cb) => privKey.public.hash(cb),
    (hash, cb) => {
      author = hash
      const blob = blobForSignature(key, value, author)
      privKey.sign(blob, cb)
    }
  ], (err, signature) => {
    if (err) {
      return callback(err)
    }

    let rec
    try {
      rec = Record.encode({
        key: key,
        value: value,
        author: author,
        signature: signature
      })
    } catch (err) {
      return callback(err)
    }

    callback(null, rec)
  })
}

/**
 * Decode a protobuf encoded Buffer.
 *
 * @param {Buffer} proto
 * @returns {Object}
 */
const decode = (proto) => {
  return Record.decode(proto)
}

module.exports = {
  blobForSignature: blobForSignature,
  create: create,
  createSigned: createSigned,
  decode: decode
}
