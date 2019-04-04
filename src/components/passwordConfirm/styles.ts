import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'
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
  dialogBtn: {
    width: 120,
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      color: '#fff'
    }
  }
})

export default styles
