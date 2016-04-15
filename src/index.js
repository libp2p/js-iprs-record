'use strict'

var ipld = require('ipld')
var ecdsa = require('ecdsa')
var crypto = require('crypto')

exports = module.exports

// receives a hash of the MerkleDAG Obj that contains the signature of the Record
// it assumes that the Record Obj and the PubKey Obj are already present in the
// MerkleDAG Obj Store
exports.validator = function (sigHash, mdagStore) {
  var sigObj = mdagStore.get(sigHash)
  var sigObjExpanded = ipld.expand(sigObj)
  var recHash = sigObjExpanded.signee[ipld.type.mlink]
  var recObj = mdagStore.get(recHash)
  var pubKeyHash = sigObjExpanded.pubKey[ipld.type.mlink]
  var pubKeyObj = mdagStore.get(pubKeyHash)

  var recObjEncodedHash = crypto.createHash('sha256').update(ipld.marshal(recObj)).digest()

  var isValid = ecdsa.verify(recObjEncodedHash, sigObj.bytes, pubKeyObj.bytes)
  if (!isValid) {
    return false
  }

  var recObjExpanded = ipld.expand(recObj)
  switch (recObjExpanded.scheme[ipld.type.mlink]) {
    case 'type-a':
      return validatorTypeA(recObjExpanded)
    case 'type-b':
      return validatorTypeB(recObjExpanded)
    case 'type-c':
      return validatorTypeC(recObjExpanded)
    case 'type-d':
      return validatorTypeD(recObjExpanded)
    default:
      return false
  }
}

function validatorTypeA (record) {
  var current = new Date()

  // Yeah in JS you can compare dates like Integers
  if (current < new Date(record.expires)) {
    return true
  }

  return false
}

function validatorTypeB (record) {
  console.log('Type B is not implemented yet')
  return false
}

function validatorTypeC (record) {
  console.log('Type C is not implemented yet')
  return false
}

function validatorTypeD (record) {
  console.log('Type D is not implemented yet')
  return false
}

exports.order = function (recA, recB) {

}
