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
      border: '1px solid #D5D5D5',
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
      border: '1px solid #D5D5D5',
      padding: '4px',
      fontWeight: 400,
      color: '#72747D',
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
    marginBottom: 18,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    width: '100%',
    display: 'inline-block',
    padding: '0 5px',
    // marginTop: '32px',
    // marginBottom: '36px',
    '& img': {
      margin: '0 24px'
    },
    '& span': {
      fontWeight: 'bold',
      cursor: 'pointer',
      float: 'left',
      '&:hover': {
        opacity: 0.7
      }
    }
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
