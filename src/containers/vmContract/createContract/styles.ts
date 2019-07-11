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
    height: 28,
    width: 200,
    margin: '18px auto 25px',
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
    position: 'absolute',
    right: '60px',
    bottom: '20px',
    display: 'block',
    width: '262px',
    height: '36px',
    textTransform: 'none',
    fontSize: '16px',
    margin: '0 auto',
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
