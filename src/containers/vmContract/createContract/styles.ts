import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  title: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '40px'
  },
  return: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    cursor: 'pointer',
    marginTop: '32px',
    marginBottom: '36px',
    '& img': {
      margin: '0 24px'
    },
    '& span': {
      fontWeight: 'bold'
    },
    '&:hover': {
      opacity: 0.7
    }
  },
  form: {
    width: 576,
    margin: '0 auto'
  },
  inputItem: {
    position: 'relative',
    marginBottom: '16px',
    // height: 40,
    fontSize: 12,
    display: 'inline-block',
    width: '260px',

    '&:nth-of-type(odd)': {
      marginRight: '56px'
    }
  },
  min: {
    position: 'absolute',
    bottom: '-15px',
    height: 14,
    fontSize: 12,
    color: primaryColor
  },
  button: {
    display: 'block',
    width: '262px',
    height: '36px',
    textTransform: 'none',
    fontSize: '16px',
    margin: '30px auto',
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
