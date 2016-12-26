/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const crypto = require('libp2p-crypto')
const waterfall = require('async/waterfall')

const iprs = require('../src')

const fixture = require('./fixtures/go-record.js')

describe('record', () => {
  let key
  let record

  before((done) => {
    waterfall([
      (cb) => crypto.generateKeyPair('rsa', 1024, cb),
      (pair, cb) => {
        key = pair
        iprs.record.create(
          key,
          'hello',
          new Buffer('world'),
          cb
        )
      },
      (rec, cb) => {
        record = rec
        cb()
      }
    ], done)
  })

  it('create', () => {
    // Record was created in the before block

    const dec = iprs.record.decode(record)
    expect(dec).to.have.property('key', 'hello')
    expect(dec).to.have.property('value').eql(new Buffer('world'))
    expect(dec).to.have.property('author')
  })

  it('createSigned', (done) => {
    iprs.record.createSigned(
      key,
      'hello2',
      new Buffer('world2'),
      (err, enc) => {
        expect(err).to.not.exist

        const dec = iprs.record.decode(enc)

        expect(dec).to.have.property('key', 'hello2')
        expect(dec).to.have.property('value').eql(new Buffer('world2'))
        expect(dec).to.have.property('author')

        const blob = iprs.record.blobForSignature(dec.key, dec.value, dec.author)

        key.sign(blob, (err, signature) => {
          expect(err).to.not.exist

          expect(dec).to.have.property('signature').eql(signature)
          done()
        })
      }
    )
  })

  describe('go interop', () => {
    it('no signature', () => {
      expect(record.key).to.be.eql(fixture.encoded.key)
      expect(record.value).to.be.eql(fixture.encoded.value)
    })

    it('with signature', () => {
      const dec = iprs.record.decode(fixture.encodedSigned)
      expect(dec).to.have.property('key', 'hello')
      expect(dec).to.have.property('value').eql(new Buffer('world'))
      expect(dec).to.have.property('author')
      expect(dec).to.have.property('signature')
    })
  })
})
