import { createStyles } from '@material-ui/core/styles'
import CreateImg from '@/images/create_contract.png'
import sCreateImg from '@/images/create_contract_small.png'
import { textOverflow, grayColor, materialButton } from '@/styles/appStyle'
const styles = createStyles({
  container: {
    width: 892,
    height: 450,
    margin: '0 auto',
    borderRadius: 6,
    background: '#fff',
    padding: '30px 24px 30px'
    // overflow: 'auto'
  },
  return: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    cursor: 'pointer',
    // marginTop: '32px',
    // marginBottom: '36px',
    '& img': {
      margin: '0 24px'
    },
    '& span': {
      fontWeight: 'bold'
    },
    '& span:first-of-type:hover': {
      opacity: 0.7
    }
  },
  link: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%)',
    textDecoration: 'none',
    backgroundImage: `url(${CreateImg})`,
    paddingTop: '86px',
    backgroundPosition: 'top, center',
    backgroundRepeat: 'no-repeat',
    color: grayColor,
    '&:hover': {
      opacity: 0.7
    }
  },
  smallLink: {
    position: 'absolute',
    top: '54px',
    right: '60px',
    textDecoration: 'none',
    backgroundImage: `url(${sCreateImg})`,
    paddingLeft: '20px',
    fontWeight: 'bold',
    backgroundRepeat: 'no-repeat',
    color: grayColor,
    '&:hover': {
      opacity: 0.7
    }
  },
  contractsList: {
    height: '350px',
    width: '100%',
    paddingTop: '26px'
  },
  contractsListHeader: {
    height: '30px',
    lineHeight: '30px',
    backgroundColor: grayColor,

    '& p': {
      display: 'inline-block',
      width: '24%',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',

      '&:first-of-type': {
        paddingLeft: '30px',
        textAlign: 'left'
      },

      '&:nth-of-type(2)': {
        width: '24%',
        textAlign: 'left'
      },

      '&:last-of-type': {
        textAlign: 'left',
        paddingRight: '30px'
      }
    }
  },
  contractsListBody: {
    backgroundColor: '#fff'
  },
  row: {
    height: '28px',
    lineHeight: '28px',
    backgroundColor: '#fff',
    color: '#999',
    '&:nth-of-type(2n)': {
      backgroundColor: '#F5F5F5'
    }
  },
  success: {
    color: '#000'
  },
  item: {
    display: 'inline-block',
    fontSize: '12px',
    width: '14%',
    textAlign: 'center',
    fontWeight: 400,
    verticalAlign: 'top',
    '&:first-of-type': {
      paddingLeft: '30px',
      textAlign: 'left'
    },

    '&:nth-of-type(2)': {
      textAlign: 'center',
      width: '40%'
    },

    '&:last-of-type': {
      position: 'relative',
      textAlign: 'right',
      paddingRight: '30px'
    }
  },
  overflow: {
    ...textOverflow
  },
  btn: {
    position: 'absolute',
    right: -20,
    top: 0,
    width: 25,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ...materialButton,
    '& span': {
      display: 'blcok',
      width: 4,
      height: 4,
      marginRight: 4,
      borderRadius: '100%',
      background: grayColor
    }
  },
  pagination: {
    position: 'absolute',
    width: '844px',
    bottom: 15,
    textAlign: 'center',
    '& ul': {
      display: 'inline-block',
      '& li': {
        outline: 'none'
      }
    }
  }
})

export default styles
