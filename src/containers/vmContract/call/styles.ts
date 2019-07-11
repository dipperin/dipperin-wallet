import { createStyles } from '@material-ui/core/styles'
import { materialButton } from '@/styles/appStyle'

const styles = createStyles({
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
    display: 'block',
    margin: '15px auto',
    // width: '262px',
    height: '36px',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  inputRow: {
    fontSize: 12,
    width: '100%',
    height: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    '&>span': {
      width: 70,
      fontWeight: 'bold',
      color: '#72747D'
    },
    '&>input[type=file]': {
      border: '1px solid #E5E5E5',
      background: '#F9F9F9',
      color: '#999',
      borderRadius: '4px',
      width: '226px',
      padding: '4px',
      outline: 'none',
      '&::-webkit-file-upload-button': {
        height: '20px',
        width: '72px',
        borderRadius: '36px',
        background: '#888',
        color: '#fff',
        boxShadow: 'none',
        border: 'none'
      }
    },
    '&>input[type=text]': {
      width: '226px',
      height: '30px',
      border: '1px solid #E5E5E5',
      padding: '4px',
      '&::placeholder': {
        color: '#C8C8C8'
      }
    }
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
