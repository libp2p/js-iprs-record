/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

const utils = require('../src/utils')

const dates = [[
  new Date(Date.UTC(2016, 0, 1, 8, 22, 33, 392)),
  '2016-01-01T08:22:33.392000000Z'
], [
  new Date(Date.UTC(2016, 11, 30, 20, 2, 3, 392)),
  '2016-12-30T20:02:03.392000000Z'
], [
  new Date(Date.UTC(2016, 11, 30, 20, 2, 5, 297)),
  '2016-12-30T20:02:05.297000000Z'
]]

describe('utils', () => {
  it('toRFC3339', () => {
    dates.forEach((c) => {
      expect(utils.toRFC3339(c[0])).to.be.eql(c[1])
    })
  })

  it('parseRFC3339', () => {
    dates.forEach((c) => {
      expect(utils.parseRFC3339(c[1])).to.be.eql(c[0])
    })
  })
})
