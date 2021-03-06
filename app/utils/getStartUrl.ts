import path from 'path'
import url from 'url'

type ProcessEnv = string | undefined

// Get Main window url
const getStartURL = (env: ProcessEnv, isMain: ProcessEnv) => {
  return env === 'development' && !isMain
    ? url.format({
        pathname: process.env.URL,
        protocol: 'http:',
        slashes: true
      })
    : url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
      })
}

// Get splash screen url
export const getSplashScreenURL = (env: ProcessEnv, isMain: ProcessEnv) => {
  return env === 'development' && !isMain
    ? url.format({
        pathname: path.join(__dirname, '../public/splash-screen.html'),
        protocol: 'file:',
        slashes: true
      })
    : url.format({
        pathname: path.join(__dirname, './splash-screen.html'),
        protocol: 'file:',
        slashes: true
      })
}

export default getStartURL
