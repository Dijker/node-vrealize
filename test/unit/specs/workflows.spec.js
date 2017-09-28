/* global it beforeEach afterEach describe */
import fs from 'fs'
// var path = require('path')
var expect = require('chai').expect
var sinon = require('sinon')
var request = require('request')
require('chai').should()

var NodeVRealize = require('../../../src/index')
var vRa = new NodeVRealize()

describe('Workflows', function () {
  'use strict'
  let sandbox
  // eslint-disable-next-line
  let fsCreateReadStreamStub
  // eslint-disable-next-line
  let requestPostStubPromise
  // eslint-disable-next-line
  let requestGetStubPromise

  var categoryId = 'categoryId'
  var workflowPath = 'workflowPath'
  var password = 'password'
  var workflowId = 'workflowId'

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    fsCreateReadStreamStub = sandbox.stub(fs, 'createReadStream')
    requestPostStubPromise = sandbox.stub(request, 'postAsync')
    requestGetStubPromise = sandbox.stub(request, 'getAsync')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('exportWorkflow method', function () {
    it('promise should reject when reading stream for action path throws an error', function () {
      var errorMessage = 'error'
      fsCreateReadStreamStub.throws(new Error(errorMessage))

      return vRa.exportWorkflow(categoryId, workflowPath, password)
        .then(function (response) {
        })
        .catch(function (error) {
          expect(error.message).to.equal(errorMessage)
        })
    })

    it('promise should return response when the statusCode is 200', function () {
      var res = {statusCode: 200}
      fsCreateReadStreamStub.returns('')
      requestPostStubPromise.resolves(res, null)

      return vRa.exportWorkflow(categoryId, workflowPath, password)
        .then(function (response) {
          expect(res).to.equal(response)
        })
    })

    it('promise should return body when the statusCode is over 300', function () {
      var res = {statusCode: 300, body: 'test'}
      fsCreateReadStreamStub.returns('')
      requestPostStubPromise.resolves(res)

      return vRa.exportWorkflow(categoryId, workflowPath, password)
        .then(function (response) {
          expect(res).to.deep.equal(res)
        })
    })

    it('promise should return error when the vRa request is rejected', function () {
      var errorMessage = 'error'
      fsCreateReadStreamStub.returns('')
      requestPostStubPromise.rejects(new Error(errorMessage))

      return vRa.exportWorkflow(categoryId, workflowPath, password)
        .catch(function (error) {
          expect(error.message).to.equal(errorMessage)
        })
    })
  })

  describe('importWorkflow method', function () {
    it('promise should return the response when statusCode is 200', function () {
      var res = {statusCode: 200}
      requestGetStubPromise.resolves(res, null)

      return vRa.importWorkflow(workflowId, password)
        .then(function (response) {
          expect(res).to.equal(response)
        })
    })

    it('promise should return the response when statusCode is over 300', function () {
      var res = {statusCode: 300, body: 'test'}
      requestGetStubPromise.resolves(res)

      return vRa.importWorkflow(workflowId, password)
        .then(function (response) {
          expect(res).to.deep.equal(res)
        })
    })

    it('promise should return error when the vRa request is rejected', function () {
      var errorMessage = 'error'
      requestGetStubPromise.rejects(new Error(errorMessage))

      return vRa.importWorkflow(workflowId, password)
        .catch(function (error) {
          expect(error.message).to.equal(errorMessage)
        })
    })
  })
})
