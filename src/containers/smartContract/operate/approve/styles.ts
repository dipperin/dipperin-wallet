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
    width: '262px',
    height: '36px',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  form: {
    display: 'block',
    position: 'relative',
    margin: '0 auto',
    width: 450
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
