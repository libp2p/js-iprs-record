/* eslint-env mocha */
'use strict'

var expect = require('chai').expect

var iprs = require('../src')

describe.skip('validator', () => {
  describe('valid', () => {
    it('check the validity of the record created before', (done) => {
      expect(iprs.validator(sigHash, mdagStore)).to.equal(true)
      done()
    })
  })

  describe.skip('invalid', () => {

  })

  describe.skip('go interop', () => {
  })
})
