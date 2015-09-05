var ipld = require('ipld')
var ecdsa = require('ecdsa')
var crypto = require('crypto')

exports = module.exports

// receives a hash of the MerkleDAG Obj that contains the signature of the Record
// it assumes that the Record Obj and the PubKey Obj are already present in the
// MerkleDAG Obj Store
exports.validator = function (sigHash, mdagStore) {
  // 1. validate the signature
  //  1.1 get the record obj
  //  1.2 encode it
  //  1.3 verify signature match
  // 2. identify the type of record
  // 3. call the function accordingly

  var sigObj = mdagStore.get(sigHash)
  var sigObjExpanded = ipld.expand(sigObj)
  var recHash = sigObjExpanded.signee[ipld.type.mlink]
  var recObj = mdagStore.get(recHash)
  var pubKeyHash = sigObjExpanded.pubKey[ipld.type.mlink]
  var pubKeyObj = mdagStore.get(pubKeyHash)

  // console.log('sig', sigHash, sigObj, sigObjExpanded)
  // console.log('rec', recHash, recObj)
  // console.log('pubKey', pubKeyHash, pubKeyObj)
  // console.log('signature bytes', sigObj.bytes)

  var recObjEncodedHash = crypto.createHash('sha256').update(ipld.marshal(recObj)).digest()

  var isValid = ecdsa.verify(recObjEncodedHash, sigObj.bytes, pubKeyObj.bytes)
  if (!isValid) {
    return false
  }

  return true
}

function validatorType1 (record) {
}

function validatorType2 (record) {
}

function validatorType3 (record) {
}

function validatorType4 (record) {
}

exports.order = function (recA, recB) {
}
