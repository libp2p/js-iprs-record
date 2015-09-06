var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var crypto = require('crypto')

var test = lab.test
var expect = Code.expect

var ipld = require('ipld')
var iprs = require('../src')
var MerkleDAGStore = require('merkledag-store')
var multihashing = require('multihashing')
var ecdsa = require('ecdsa') // default 'secp256k1'

var mdagStore
var sigHash

test('create a valid and non expired type \'a\' record', function (done) {
  // 1. create a MerkleDAGStore
  // 2. generate ECDH key pair
  // 3. create a MerkleDAG Obj to store the PubKey
  // 4. store it in the MerkleDAGStore (the multihash is performed on the cbor encoded version of the obj)
  // 5. create a Record
  // 6. store it in the MerkleDAGStore
  // 7. create a MerkleDAG Obj with the Signature of the Record
  // 8. store it in the MerkleDAGStore

  mdagStore = new MerkleDAGStore()

  var ecdh = crypto.createECDH('secp256k1')
  ecdh.generateKeys()

  var mdagObj_pubKey = {
    '@context': ipld.context.merkleweb,
    algorithm: {
      mlink: 'secp256k1'
    },
    encoding: {
      mlink: 'raw'
    },
    bytes: ecdh.getPublicKey()
  }

  var mdagObj_pubKey_encoded = ipld.marshal(mdagObj_pubKey)
  var mdagObj_pubKey_mh = multihashing(mdagObj_pubKey_encoded, 'sha2-256')
  mdagStore.put(mdagObj_pubKey, mdagObj_pubKey_mh)

  var current = new Date()

  var mdagObj_record = {
    '@context': ipld.context.merkleweb,
    scheme: {
      mlink: 'type-a'
    },
    expires: (new Date()).setDate(current.getDate() + 1),
    value: 'aaah the data!'
  }

  var mdagObj_record_encoded = ipld.marshal(mdagObj_record)
  var mdagObj_record_mh = multihashing(mdagObj_record_encoded, 'sha2-256')
  mdagStore.put(mdagObj_record, mdagObj_record_mh)

  var mdagObj_record_encoded_hash = crypto.createHash('sha256').update(mdagObj_record_encoded).digest()
  var record_signed = ecdsa.sign(mdagObj_record_encoded_hash, ecdh.getPrivateKey())

  var mdagObj_record_signature = {
    '@context': ipld.context.merkleweb,
    pubKey: {
      mlink: mdagObj_pubKey_mh
    },
    algorithm: {
      mlink: 'secp256k1'
    },
    encoding: {
      mlink: 'binary'
    },
    signee: {
      mlink: mdagObj_record_mh
    },
    bytes: record_signed
  }

  var mdagObj_record_signature_encoded = ipld.marshal(mdagObj_record_signature)
  var mdagObj_record_signature_encoded_mh = multihashing(mdagObj_record_signature_encoded, 'sha2-256')

  mdagStore.put(mdagObj_record_signature, mdagObj_record_signature_encoded_mh)
  sigHash = mdagObj_record_signature_encoded_mh

  done()
})

test('check the validity of the record created before', function (done) {
  expect(iprs.validator(sigHash, mdagStore)).to.equal(true)
  done()
})
