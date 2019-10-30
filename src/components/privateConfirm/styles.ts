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
  label: {
    color: '#838899',
    fontSize: '10px',
    cursor: 'pointer'
  },
  private: {
    width: 262,
    height: 54,
    outline: 'none',
    border: 'none',
    resize: 'none',
    borderRadius: '4px',
    background: '#F2F3F7',
    padding: '10px',
    fontSize: '12px'
  },
  note: {
    color: '#B6265C',
    fontSize: '10px'
  },
  button: {
    display: 'block',
    margin: '0 auto 15px',
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
    position: 'relative'
  },
  close: {
    position: 'absolute',
    right: -26,
    top: 6
  }
})

export default styles
