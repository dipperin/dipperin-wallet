import { app, dialog } from 'electron'
import log from 'electron-log'

import packageJSON from '../../package.json'
import dipperinPath from '../utils/dipperinPath'

const handleError = (err, message = 'An error occurred.') => {
  log.info(err)
  dialog.showMessageBox(
    {
      buttons: ['Quit', 'Cancel'],
      detail: `Please attach the following debugging info:
OS: ${process.platform}
Arch: ${process.arch}
Version: ${packageJSON.dipperin.version}
Error: ${err.message}
Please also attach the contents of the following file:
${dipperinPath()}.log
`,
      message: `${message}`,
      title: 'Dipperin Error',
      type: 'error'
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        app.exit(1)
      }
    }
  )
}

export default handleError
