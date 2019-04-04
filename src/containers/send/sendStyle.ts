import { createStyles } from '@material-ui/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  item: {
    marginBottom: 5
  },
  min: {
    height: 14,
    fontSize: 12,
    color: primaryColor
  },
  confirmButton: {
    display: 'block',
    width: '262px',
    height: '36px',
    left: '50%',
    marginLeft: '-131px',
    margin: '25px auto 0',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    width: 310
  },
  dialogBtns: {
    justifyContent: 'space-evenly'
  },
  dialogBtn: {
    width: 120,
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    boxShadow: 'none',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      color: '#fff'
    }
  }
})

export default styles
