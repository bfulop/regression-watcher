const os = require('os')
const path = require('path')
const http = require('http')
const R = require('ramda')
const chokidar = require('chokidar')

const logger = r => {
  console.log('logger:')
  console.log(r)
  console.log('---logger')
  return r
}

const watchTarget = R.compose(R.drop(6), R.find(R.startsWith('watch=')), R.drop(2))

const regressionServer = R.compose(R.drop(7), R.find(R.startsWith('server=')), R.drop(2))(process.argv)

const targetPath = R.compose(r => path.resolve(os.homedir(), r), watchTarget)(process.argv)

var watcher = chokidar.watch(targetPath, {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

console.log('watching', targetPath, 'server', regressionServer)

watcher.on('change', path => {
  logger(`File ${path} has been changed`)
  http.request({
    method: 'GET',
    host: regressionServer,
    port: 3202,
    path: '/compare'
  }, function (res) {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })
    res.on('end', () => {
      console.log('No more data in response.')
    })
  }).end()
})
