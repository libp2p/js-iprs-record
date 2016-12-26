/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const crypto = require('libp2p-crypto')
const waterfall = require('async/waterfall')

const libp2pRecord = require('../src')
const record = libp2pRecord.record

const fixture = require('./fixtures/go-record.js')

describe('record', () => {
  let key
  let otherKey
  let rec

  before((done) => {
    waterfall([
      (cb) => crypto.generateKeyPair('rsa', 1024, cb),
      (pair, cb) => {
        otherKey = pair
        crypto.generateKeyPair('rsa', 1024, cb)
      },
      (pair, cb) => {
        key = pair
        record.create(
          key,
          'hello',
          new Buffer('world'),
          cb
        )
      },
      (_rec, cb) => {
        rec = _rec
        cb()
      }
    ], done)
  })

  it('create', () => {
    // Record was created in the before block

    const dec = record.decode(rec)
    expect(dec).to.have.property('key', 'hello')
    expect(dec).to.have.property('value').eql(new Buffer('world'))
    expect(dec).to.have.property('author')
  })

  it('createSigned', (done) => {
    record.createSigned(
      key,
      'hello2',
      new Buffer('world2'),
      (err, enc) => {
        expect(err).to.not.exist

        const dec = record.decode(enc)

        expect(dec).to.have.property('key', 'hello2')
        expect(dec).to.have.property('value').eql(new Buffer('world2'))
        expect(dec).to.have.property('author')

        const blob = record.blobForSignature(dec.key, dec.value, dec.author)

        key.sign(blob, (err, signature) => {
          expect(err).to.not.exist

          expect(dec).to.have.property('signature').eql(signature)
          done()
        })
      }
    )
  })

  describe('verifySignature', () => {
    it('valid', (done) => {
      record.createSigned(
        key,
        'hello',
        new Buffer('world'),
        (err, enc) => {
          expect(err).to.not.exist

          record.verifySignature(enc, key.public, done)
        })
    })

    it('invalid', (done) => {
      record.createSigned(
        key,
        'hello',
        new Buffer('world'),
        (err, enc) => {
          expect(err).to.not.exist

          record.verifySignature(enc, otherKey.public, (err) => {
            expect(err).to.match(/Invalid record signature/)
            done()
          })
        })
    })
  })

  describe('go interop', () => {
    it('no signature', () => {
      expect(record.key).to.be.eql(fixture.encoded.key)
      expect(record.value).to.be.eql(fixture.encoded.value)
    })

    it('with signature', () => {
      const dec = record.decode(fixture.encodedSigned)
      expect(dec).to.have.property('key', 'hello')
      expect(dec).to.have.property('value').eql(new Buffer('world'))
      expect(dec).to.have.property('author')
      expect(dec).to.have.property('signature')
    })
  })
})
