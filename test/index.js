'use strict'

const lab = exports.lab = require('@hapi/lab').script()
const Hapi = require('@hapi/hapi')
const expect = require('@hapi/code').expect

lab.describe('hapi-router', () => {
  let server

  lab.beforeEach(() => {
    return (server = new Hapi.Server())
  })

  async function register (options) {
    await server.register({
      plugin: require('../'),
      options
    })
  }

  lab.test('can take an array of route patterns', async () => {
    await register({
      routes: [
        'test/routes/*.js',
        'test/routes/api/*.js'
      ]
    })

    expect(server.table()).to.have.length(3)
  })

  lab.test('can load routes recursively', async () => {
    register({
      routes: 'test/routes/**/*.js'
    })

    expect(server.table()).to.have.length(3)
  })

  lab.test('can match specific routes', async () => {
    register({
      routes: 'test/routes/**/*2.js'
    })

    expect(server.table()).to.have.length(1)
  })

  lab.test('can ignore specific routes', async () => {
    register({
      routes: 'test/routes/**/*.js',
      ignore: 'test/routes/**/*1.js'
    })

    expect(server.table()).to.have.length(2)
  })

  lab.test('can specify cwd', async () => {
    register({
      routes: 'routes/**/*.js',
      cwd: process.cwd() + '/test'
    })

    expect(server.table()).to.have.length(3)
  })
})
