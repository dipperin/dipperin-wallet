import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor } from '@/styles/appStyle'

const styles = createStyles({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    '& span:nth-child(1)': {
      cursor: 'pointer'
    },
    '& img': {
      margin: '0 12px'
    },
    '& span': {
      fontWeight: 'bold'
    }
  },

  tab: {
    height: 36,
    marginTop: 21,
    border: `1px solid ${primaryColor}`,
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tabLeft: {
    display: 'inline-block',
    width: '50%',
    borderRight: `1px solid ${primaryColor}`
  },
  tabRight: {
    display: 'inline-block',
    width: '50%'
  },
  button: {
    width: '100%',
    height: '36px',
    padding: 0,
    textTransform: 'none',
    background: '#fff',
    borderRadius: 0,
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
  qrcode: {
    margin: '34px auto 30px',
    width: 180,
    height: 180,
    '& canvas': {
      width: '100%',
      height: '100%'
    }
  },
  address: {
    width: 233,
    margin: '0 auto 20px',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: '20px',
    color: primaryColor,
    wordBreak: 'break-all'
  },
  copy: {
    display: 'block',
    width: 18,
    height: 18,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    margin: '0 auto',
    '& img': {
      width: 18,
      height: 18
    }
  }
})

export default styles
