import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  title: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '40px'
  },
  tab: {
    height: 36,
    width: 260,
    marginTop: 21,
    border: `1px solid ${primaryColor}`,
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tabLeft: {
    display: 'inline-block',
    width: '50%',
    height: '100%',
    borderRight: `1px solid ${primaryColor}`
  },
  tabRight: {
    display: 'inline-block',
    width: '50%',
    height: '100%'
  },
  tabButton: {
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
  },
  form: {
    width: '100%',
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
    // margin: '30px auto',
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
