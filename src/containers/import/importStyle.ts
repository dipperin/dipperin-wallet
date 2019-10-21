import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'
// import CreateBg from '../../images/create-bg.png'
// import CreateBgHover from '../../images/create-bg-hover.png'
import En from '@/images/en.png'
import Cn from '@/images/cn.png'

const styles = createStyles({
  import: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: 892,
    height: 488,
    margin: '60px auto 0',
    // background: '#fff',
    borderRadius: '6px',
    background: 'linear-gradient(0deg,rgba(25,101,126,1) 0%,rgba(8,31,107,1) 100%)'
  },
  langBtn: {
    minWidth: 48,
    height: 20,
    backgroundSize: 'cover',
    borderRadius: 24
  },
  langEn: {
    background: `url(${En}) no-repeat`
  },
  langCn: {
    background: `url(${Cn}) no-repeat`
  },
  curtain: {
    width: 510,
    height: 488
  },
  form: {
    flex: 1,
    padding: '39px 49px 0 30px',
    height: 518,
    width: 382,
    background: '#fff',
    borderRadius: '6px',
    position: 'relative'
  },
  textInput: {
    border: 'none',
    outline: 'none',
    resize: 'none',
    background: '#F2F3F7',
    borderRadius: 4,
    padding: '5px 13px',
    fontSize: 14,
    fontWeight: 400
  },
  mnemonicInput: {
    width: 320,
    height: 80
  },
  pswInput: {
    width: 320,
    height: 36
  },
  pswStr: {
    width: 320,
    height: 26
  },
  rankbar: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  weakPsw: {
    background: '#ECECEC',
    borderRadius: '4px 0px 0px 4px',
    width: 106,
    height: 8
  },
  weakPswActive: {
    background: '#96BEEC',
    borderRadius: '4px 0px 0px 4px',
    width: 106,
    height: 8
  },
  mediumPsw: {
    width: 106,
    height: 8,
    background: '#ECECEC'
  },
  mediumPswActive: {
    width: 106,
    height: 8,
    background: 'rgba(82,141,208,1)'
  },
  strongPsw: {
    background: '#ECECEC',
    borderRadius: '0px 4px 4px 0px',
    width: 106,
    height: 8
  },
  strongPswActive: {
    background: '#1B4C83',
    borderRadius: '0px 4px 4px 0px',
    width: 106,
    height: 8
  },
  strengthTextDefault: {
    fontSize: 12,
    color: '#B5B5B5'
  },
  weakText: {
    fontSize: 12,
    color: '#96BEEC'
  },
  mediumText: {
    fontSize: 12,
    color: '#528DD0'
  },
  strongText: {
    fontSize: 12,
    color: '#1B4C83'
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 3,
    color: '#BABBBE',
    fontSize: 12,
    lineHeight: '12px'
  },
  item: {
    marginBottom: 10,
    // height: 40,
    fontSize: 12
  },
  addIcon: {
    display: 'inline-block',
    height: 24,
    width: 24,
    borderRadius: 12,
    background: '#fff',
    color: '#528DD0',
    textAlign: 'center',
    fontSize: '24px',
    lineHeight: '24px',
    fontWeight: 500,
    position: 'relative',
    top: 3,
    right: 7
  },
  button: {
    display: 'block',
    position: 'absolute',
    bottom: 99,
    width: 320,
    height: '36px',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  create: {
    width: 314,
    fontWeight: 'bold'
  },
  addBtn: {
    // margin: '187px 0 0 163px',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 382,
    height: 46,
    padding: 0,
    borderRadius: '0px 0px 6px 6px',
    color: '#fff',
    '& p': {
      fontWeight: 'bold'
    }
    // borderRadius: '100%'
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
    marginBottom: 16,
    lineHeight: '22px'
  },
  hint: {
    fontSize: '12px',
    lineHeight: '30px',
    color: grayColor,
    marginBottom: '40px'
  },
  // mnemonicInput: {
  //   width: '478px',
  //   height: '120px',
  //   padding: '20px',
  //   marginBottom: '24px',
  //   border: '1px solid #bfbfbf',
  //   borderRadius: '6px',
  //   resize: 'none',
  //   fontSize: '18px'
  // },
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
    zIndex: 2,
    top: 23,
    right: 30,
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
