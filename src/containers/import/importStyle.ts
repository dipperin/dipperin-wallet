import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'
import CreateBg from '../../images/create-bg.png'
import CreateBgHover from '../../images/create-bg-hover.png'
const styles = createStyles({
  import: {
    position: 'relative',
    display: 'flex',
    width: 892,
    height: 488,
    margin: '60px auto 0',
    background: '#fff',
    borderRadius: '6px'
  },
  form: {
    flex: 1,
    padding: '60px 49px 0 30px'
  },
  item: {
    marginBottom: 10,
    // height: 40,
    fontSize: 12
  },
  button: {
    display: 'block',
    width: '262px',
    height: '36px',
    margin: '72px auto 0',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  create: {
    width: 314,
    background: `url(${CreateBg}) no-repeat`,
    backgroundSize: 'cover',
    transition: 'all ease 0.3s',
    '&:hover': {
      background: `url(${CreateBgHover}) no-repeat`
    },

    '& p:nth-child(2)': {
      margin: '22px 0 22px 120px',
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
      '&.cn': {
        marginLeft: 152
      }
    },
    '& p:nth-child(3)': {
      marginLeft: 130,
      fontSize: 12,
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      '&.cn': {
        marginLeft: 155
      }
    }
  },
  addBtn: {
    margin: '187px 0 0 163px',
    width: 70,
    height: 70,
    padding: 0,
    borderRadius: '100%'
  },
  add: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 50,
    width: 50,
    minHeight: 0,
    minWidth: 0,
    borderRadius: '50px'
  },
  title: {
    fontSize: '18px',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 60
  },
  hint: {
    fontSize: '12px',
    lineHeight: '30px',
    color: grayColor,
    marginBottom: '40px'
  },
  mnemonicInput: {
    width: '478px',
    height: '120px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #bfbfbf',
    borderRadius: '6px',
    resize: 'none',
    fontSize: '18px'
  },
  passwordInput: {
    width: '478px',
    height: '60px',
    paddingLeft: '22px',
    marginBottom: '24px',
    border: '1px solid #bfbfbf',
    borderRadius: '6px',
    fontSize: '18px',
    '&:nth-of-type(2)': {
      marginBottom: '45px'
    }
  },
  globalWrap: {
    position: 'absolute',
    top: 8,
    right: 10,
    textAlign: 'center',
    '& > p': {
      marginTop: 2,
      color: '#fff',
      fontSize: 10,
      whiteSpace: 'nowrap',
      fontWeight: 'bold'
    }
  },
  global: {
    width: 34,
    height: 34,
    ...materialButton,
    '& span': {
      fontSize: 14,
      color: primaryColor,
      fontWeight: 'bold'
    }
  }
})

export default styles
