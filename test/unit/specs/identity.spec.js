/* global it beforeEach afterEach describe */
// var path = require('path')
var expect = require('chai').expect
var sinon = require('sinon')
var request = require('request')
require('chai').should()

var NodeVRealize = require('../../../src/index')

var nodeVRealize = new NodeVRealize()

describe('[Identity]', function () {
  'use strict'
  let sandbox
  // eslint-disable-next-line
  let doesVMWareTokenExistStub
  // eslint-disable-next-line
  let requestPostStubPromise
  // eslint-disable-next-line
  let requestGetStubPromise
  // eslint-disable-next-line
  let requestHeadStubPromise

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    requestPostStubPromise = sandbox.stub(request, 'postAsync')
    requestGetStubPromise = sandbox.stub(request, 'getAsync')
    requestHeadStubPromise = sandbox.stub(request, 'headAsync')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('isTokenAuthorized method', function () {
    it('should return error when vRa request promise is rejected', function () {
      var errorMessage = 'error'
      requestHeadStubPromise.rejects(new Error(errorMessage))

      return nodeVRealize.identity.isTokenAuthorized()
        .catch(function (error) {
          expect(error.message).to.equal(errorMessage)
        })
    })

    it('should return true when vRa token request returns 204', function () {
      var response = {statusCode: 204}
      requestHeadStubPromise.resolves(response)

      return nodeVRealize.identity.isTokenAuthorized()
        .then(function (isAuthorized) {
          expect(isAuthorized).to.equal(true)
        })
    })

    it('should return false when vRa token request returns 300', function () {
      var response = {statusCode: 300}
      requestHeadStubPromise.resolves(response)

      return nodeVRealize.identity.isTokenAuthorized()
        .then(function (isAuthorized) {
          expect(isAuthorized).to.equal(false)
        })
    })
  })
  describe('getToken method', function () {
    it('should return error when vRa request promise is rejected', function () {
      var errorMessage = 'error'
      requestPostStubPromise.rejects(new Error(errorMessage))

      return nodeVRealize.identity.getTokenId()
        .catch(function (error) {
          expect(error.message).to.equal(errorMessage)
        })
    })

    it('should return token id when vRa token request returns 200', function () {
      var response = {
        statusCode: 200,
        body: {id: '1234'}
      }
      requestPostStubPromise.resolves(response)

      return nodeVRealize.identity.getTokenId()
        .then(function (tokenId) {
          expect(tokenId).to.equal(response.body.id)
        })
    })

    it('should return error when vRa token request returns 400', function () {
      var response = {
        statusCode: 400,
        body: {errors: [{systemMessage: 'error'}]}
      }
      requestPostStubPromise.resolves(response)

      return nodeVRealize.identity.getTokenId()
        .catch(function (error) {
          expect(error).to.equal(response.body.errors[0].systemMessage)
        })
    })
  })
}
)
