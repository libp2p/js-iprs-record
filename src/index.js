var ipld = require('ipld')

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

  console.log('sig', sigHash, sigObj, sigObjExpanded)
  console.log('rec', recHash, recObj)

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
