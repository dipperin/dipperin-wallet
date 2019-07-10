import { createStyles } from '@material-ui/core/styles'
import { materialButton } from '@/styles/appStyle'

const styles = createStyles({
  callerBox: {
    width: 292,
    border: '1px solid #E5E5E5',
    margin: 10,
    borderRadius: '4px'
  },
  topbar: {
    width: '100%',
    '& input': {
      height: '30px',
      borderWidth: '0 1px'
    },
    '& button': {
      width: '88px',
      height: '30px',
      background: 'rgba(243,247,249,1)',
      border: '1px solid rgba(229,229,229,1)',
      borderRadius: '4px 0px 0px 4px',
      fontSize: '12px',
      lineHeight: '30px',
      verticalAlign: 'middle',
      textAlign: 'center',
      outline: 'none',
      cursor: 'pointer'
    }
  },
  inputList: {
    width: '100%'
  },
  resultBox: {
    width: '100%'
  },
  inputItem: {},

  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    width: 310
  },
  dialogBtns: {
    justifyContent: 'space-evenly'
  },
  button: {
    // display: 'block',
    margin: '0',
    width: '88px',
    height: '30px',
    textTransform: 'none',
    fontSize: '12px',
    lineHeight: '30px',
    ...materialButton
    // '& span': {
    //   fontWeight: 'bold'
    // }
  },
  form: {
    display: 'block',
    position: 'relative',
    margin: '0 auto',
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  config: {
    color: '#333',
    marginBottom: 10,
    '& b': {
      fontWeight: 'bold'
    }
  },
  close: {
    position: 'absolute',
    right: -26,
    top: 6
  }
})

export default styles
