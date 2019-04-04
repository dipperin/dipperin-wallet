const chalk = require('chalk')
const packageJSON = require('../package.json')

function checkDipperinVersion() {
  if (packageJSON.version.includes('alpha')) {
    if (packageJSON.dipperin.version !== 'latest') {
      console.log(
        chalk.whiteBright.bgRed.bold(
          'The alpha version of the wallet must use the latest version of the main chain program.'
        )
      )
      return false
    }
  } else {
    if (packageJSON.dipperin.version === 'latest') {
      console.log(
        chalk.whiteBright.bgRed.bold(
          'The beta or release version of the wallet must use a main chain program with a specific version number.'
        )
      )
      return false
    }
  }
  return true
}

module.exports = checkDipperinVersion