import fs from 'fs'
import util from 'util'

import dipperinPath from '../utils/dipperinPath'

const fsExists = util.promisify(fs.exists)

// Check the Dipperin
const doesDipperinExist = async () => {
  try {
    const isExists = await fsExists(dipperinPath())
    return isExists
  } catch (_) {
    return false
  }
}

export default doesDipperinExist
