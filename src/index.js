const os = require('os')
const path = require('path')
const http = require('http')
const R = require('ramda')
const chokidar = require('chokidar')
const concat = require('concat-stream')

const logger = r => {
  console.log(r)
  console.log('---')
  return r
}

const watchTarget = R.compose(R.drop(6), R.find(R.startsWith('watch=')), R.drop(2))

const regressionServer = R.compose(R.drop(7), R.find(R.startsWith('server=')), R.drop(2))(process.argv)

const targetPath = R.compose(r => path.resolve(os.homedir(), r), watchTarget)(process.argv)

var watcher = chokidar.watch(targetPath, {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

const displayResults = ({ route, width, targetelem, numDiffPixels }) => {
  if (numDiffPixels > 100) {
    console.warn('diff ✗', route, width, targetelem, numDiffPixels)
  } else {
    console.log('diff ✓', route, width, targetelem, numDiffPixels)
  }
  return { route, width, targetelem, numDiffPixels }
}

console.log('watching', targetPath, 'server', regressionServer)

const handleResult = R.compose(R.map(displayResults), JSON.parse)

const sendRequest = () => {
  http
    .request(
      {
        method: 'GET',
        host: regressionServer,
        port: 3202,
        path: '/compare'
      },
      function (res) {
        res.setEncoding('utf8')
        res.pipe(concat(handleResult))
      }
    )
    .end()
}

watcher.on('change', path => {
  logger(`File ${path} has been changed`)
  setTimeout(sendRequest, 1300)
})
