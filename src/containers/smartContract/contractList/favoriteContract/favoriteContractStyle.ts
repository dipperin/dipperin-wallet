import { createStyles } from '@material-ui/core/styles'
import favoriteImg from '@/images/favorite.png'
import sFavoriteImg from '@/images/favorite_small.png'
import { textOverflow, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  link: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%)',
    textDecoration: 'none',
    backgroundImage: `url(${favoriteImg})`,
    paddingTop: '86px',
    backgroundPosition: 'top, center',
    backgroundRepeat: 'no-repeat',
    color: grayColor,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7
    }
  },
  smallLink: {
    position: 'absolute',
    top: '54px',
    right: '60px',
    textDecoration: 'none',
    backgroundImage: `url(${sFavoriteImg})`,
    paddingLeft: '20px',
    fontWeight: 'bold',
    backgroundRepeat: 'no-repeat',
    color: grayColor,
    cursor: 'pointer',
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
      width: '20%',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',

      '&:first-of-type': {
        paddingLeft: '30px',
        textAlign: 'left'
      },

      '&:nth-of-type(2)': {
        width: '35%',
        textAlign: 'center'
      },

      '&:last-of-type': {
        textAlign: 'right',
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

    '&:nth-of-type(2n)': {
      backgroundColor: '#F5F5F5'
    }
  },
  item: {
    display: 'inline-block',
    fontSize: '12px',
    color: '#000',
    width: '20%',
    textAlign: 'center',
    fontWeight: 400,
    verticalAlign: 'top',
    '&:first-of-type': {
      paddingLeft: '30px',
      textAlign: 'left'
    },

    '&:nth-of-type(2)': {
      textAlign: 'center',
      width: '35%'
    },

    '&:last-of-type': {
      position: 'relative',
      paddingRight: '30px',
      textAlign: 'right'
    }
  },
  overflow: {
    ...textOverflow
  },
  btn: {
    position: 'absolute',
    left: '100%',
    top: 0,
    width: 30,
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
  },
  more: {},

  menuItem: {
    textAlign: 'center',
    cursor: 'pointer'
  }
})

export default styles
