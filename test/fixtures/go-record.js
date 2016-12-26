'use strict'

const fs = require('fs')
const join = require('path').join

const read = (name) => fs.readFileSync(join(__dirname, name))

// Fixtures generated using gore (https://github.com/motemen/gore)
//
// :import github.com/libp2p/go-libp2p-record
// :import github.com/libp2p/go-libp2p-crypto
//
// priv, pub, err := crypto.GenerateKeyPair(crypto.RSA, 1024)
//
// rec, err := record.MakePutRecord(priv, "hello", []byte("world"), false)
// rec2, err := recordd.MakePutRecord(priv, "hello", []byte("world"), true)
//
// :import github.com/gogo/protobuf/proto
// enc, err := proto.Marshal(rec)
// enc2, err := proto.Marshal(rec2)
//
// :import io/ioutil
// ioutil.WriteFile("js-libp2p-record/test/fixtures/record.bin", enc, 0644)
// ioutil.WriteFile("js-libp2p-record/test/fixtures/record-signed.bin", enc2, 0644)
module.exports = {
  encoded: read('record.bin'),
  encodedSigned: read('record-encoded.bin')
}
