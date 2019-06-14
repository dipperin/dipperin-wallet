import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  container: {
    minWidth: 500,
    padding: '10px'
  },
  button: {
    width: '100%',
    height: '100%',
    padding: 0,
    textTransform: 'none',
    background: '#fff',
    borderRadius: 0,
    ...materialButton,
    '&:hover': {
      background: '#fff'
    },

    '& span': {
      fontSize: 16,
      fontWeight: 'bold',
      color: grayColor
    }
  },
  active: {
    background: primaryColor,
    '&:hover': {
      background: primaryColor
    },
    '& span': {
      color: '#fff'
    }
  }
})

export default styles
