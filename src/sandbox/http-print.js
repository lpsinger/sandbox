let { sep } = require('path')
let chalk = require('chalk')
let httpConfig = require('../http/_config')

/**
 * Pretty print @http + @ws routes
 */
module.exports = function prettyPrint (params, callback) {
  let { cwd, inventory, ports, restart, update } = params
  let { http, ws } = inventory.inv

  if (restart || (!http && !ws)) {
    return callback()
  }

  let { apiType } = httpConfig(params)
  let padL = str => str.padStart(7)
  let padR = str => str.padEnd(45, '.')
  let strip = str => str.replace(cwd, '').substr(1)

  if (http) {
    let folder = `${inventory.inv.static.folder}${sep}`
    let msgs = {
      rest: 'REST API mode / Lambda proxy',
      http: 'HTTP API mode / Lambda proxy v2.0 format',
      httpv2: 'HTTP API mode / Lambda proxy v2.0 format',
      httpv1: 'HTTP API mode / Lambda proxy v1.0 format',
    }
    let andWs = ws ? '& @ws ' : ''
    update.done(`Available @http (${msgs[apiType]}) ${andWs}routes`)
    http.forEach(({ method, path, src, arcStaticAssetProxy }) => {
      let routeMethod = chalk.grey(padL(method))
      let routePath = chalk.cyan(path) + ' '
      let lambdaPath = strip(src)
      let lambda = chalk.grey(arcStaticAssetProxy ? folder : lambdaPath)
      update.raw(chalk.grey(`${routeMethod} ${padR(routePath)} ${lambda}`))
    })
  }

  if (ws) {
    ws.forEach(({ name, src }) => {
      let type = chalk.grey(padL('ws'))
      let routeName = chalk.cyan(name) + ' '
      let lambdaPath = strip(src)
      let lambda = chalk.grey(lambdaPath)
      update.raw(chalk.grey(`${type} ${padR(routeName)} ${lambda}`))
    })
  }

  if (http || ws) {
    let link = chalk.green.bold.underline(`http://localhost:${ports.http}\n`)
    update.raw(`\n    ${link}`)
  }
  callback()
}
