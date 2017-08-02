/* global it beforeEach afterEach describe */
// var path = require('path')
var expect = require('chai').expect
var sinon = require('sinon')
var request = require('request')
var sinonStubPromise = require('sinon-stub-promise')
import fs from 'fs'
require('chai').should()

var NodeVRealize = require('../../../src/index')
var vRa = new NodeVRealize()

sinonStubPromise(sinon)

describe('Workflows', function () {
  'use strict'
  let sandbox
  // eslint-disable-next-line
  let fsCreateReadStreamStub
  // eslint-disable-next-line
  let requestPostStubPromise
  // eslint-disable-next-line
  let requestGetStubPromise

  var categoryName = 'categoryName'
  var actionPath = 'actionPath'
  var password = 'password'

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    fsCreateReadStreamStub = sandbox.stub(fs, 'createReadStream')
    requestPostStubPromise = sandbox.stub(request, 'postAsync').returnsPromise()
    requestGetStubPromise = sandbox.stub(request, 'getAsync').returnsPromise()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('importWorkflow method', function () {
    it('promise should reject when reading stream for action path throws an error', function () {
      var errorMessage = 'error'
      fsCreateReadStreamStub.throws(new Error(errorMessage))

      return vRa.importWorkflow(categoryName, actionPath, password)
      .then(function (response) {
      })
      .catch(function (error) {
        expect(error.message).to.equal(errorMessage)
      })
    })

    it('promise should return response when statusCode is 200', function () {
      var res = {statusCode: 200}
      fsCreateReadStreamStub.returns('')
      requestPostStubPromise.resolves(res, null)

      return vRa.importWorkflow(categoryName, actionPath, password)
      .then(function (response, body) {
        expect(res).to.equal(response)
      })
    })

    it('promise should return body when statusCode over 300', function () {
      var res = {statusCode: 300, body: 'test'}
      fsCreateReadStreamStub.returns('')
      requestPostStubPromise.resolves(res)

      return vRa.importWorkflow(categoryName, actionPath, password)
      .then(function (body) {
        expect(res.body).to.equal(body)
      })
    })

    it('promise should return error when vRa request is rejected', function () {
      var errorMessage = 'error'
      fsCreateReadStreamStub.returns('')
      requestPostStubPromise.rejects(new Error(errorMessage))

      return vRa.importWorkflow(categoryName, actionPath, password)
      .catch(function (error) {
        expect(error.message).to.equal(errorMessage)
      })
    })
  })
})