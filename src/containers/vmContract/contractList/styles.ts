import { createStyles } from '@material-ui/core/styles'
import CreateImg from '@/images/create_contract.png'
import sCreateImg from '@/images/create_contract_small.png'
import { textOverflow, grayColor, materialButton } from '@/styles/appStyle'
const styles = createStyles({
  root: {
    padding: '0 24px',
    position: 'relative'
  },
  link: {
    position: 'absolute',
    top: '170px',
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
    bottom: '0px',
    right: '20px',
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
    height: '430px',
    width: '100%',
    paddingTop: '26px'
  },
  contractsListHeader: {
    height: '30px',
    lineHeight: '30px',
    backgroundColor: grayColor,

    '& p': {
      display: 'inline-block',
      width: '14%',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',

      '&:first-of-type': {
        paddingLeft: '30px',
        textAlign: 'left'
      },

      '&:nth-of-type(2)': {
        width: '40%',
        textAlign: 'center'
      }
    }
  },
  contractsListBody: {
    backgroundColor: '#fff'
  },
  row: {
    height: '48px',
    lineHeight: '48px',
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
      textAlign: 'center',
      width: '30%',
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
