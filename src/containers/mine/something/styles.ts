import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'
const styles = createStyles({
  dialogMain: {
    width: 310
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 400
  },
  dialogContent: {
    width: '100%',
    fontSize: '12px',
    color: '#838899',
    fontWeight: 400
  },
  dialogBtns: {
    justifyContent: 'space-evenly',
    marginBottom: '20px'
  },
  dialogBtn: {
    width: 262,
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    background: '#528DD0',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      color: '#fff'
    }
  }
})

export default styles
