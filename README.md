libp2p-record JavaScript implementation
=======================================

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs) ![Build Status](https://travis-ci.org/diasdavid/js-libp2p-record.svg?style=flat-square)](https://travis-ci.org/diasdavid/js-libp2p-record) ![](https://img.shields.io/badge/coverage-%3F-yellow.svg?style=flat-square) [![Dependency Status](https://david-dm.org/diasdavid/js-libp2p-record.svg?style=flat-square)](https://david-dm.org/diasdavid/js-libp2p-record) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> JavaScript libp2p record object follows specification([IPRS](https://github.com/ipfs/specs/blob/master/records/README.md)) implementation

# Description

# Usage

## Example record

```
// Record is a IPLD object
{
  '@context': {
    mlink: 'http://merkle-link'
  },
  scheme: {
    mlink: <hash to validity scheme or identifier for hard coded validity scheme>
  },
  expires: <data>, // datetime at which record expires
  value: <data>, // the data that this Record Stores
}
```


# Record types

A record type should be identified by its validity scheme and a record validity scheme should be a MerkleDAG object containing its validity checking rules, however, for simplicity, we have developed 4 types of records, in which their validity schemes are hardcoded in this module. To identify which validity scheme to use, we use a enum:

- a - signed, valid within a datetime range
- b - signed, expiring after a Time-To-Live
- c - signed, based on ancestry (chain)
- d - signed, with cryptographic freshness

Reference: https://github.com/ipfs/specs/tree/master/records#example-record-types
