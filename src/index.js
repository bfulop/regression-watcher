const os = require('os')
const path = require('path')
const R = require('ramda')
const chokidar = require('chokidar')

const logger = r => {
  console.log('logger:')
  console.log(r)
  console.log('---logger')
  return r
}

const watchTarget = R.compose(R.drop(6), R.find(R.startsWith('watch=')), R.drop(2))

const targetPath = R.compose(r => path.resolve(os.homedir(), r), watchTarget)(process.argv)

var watcher = chokidar.watch(targetPath, {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

watcher.on('change', path => {
  logger(`File ${path} has been changed`)
})
