import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'
import Update from '@/images/setting-update.png'
import Reset from '@/images/setting-reset.png'
import ResetActive from '@/images/reset-active.png'
import UpdateActive from '@/images/update-active.png'
import Horn from '@/images/horn.png'

const styles = createStyles({
  setting: {
    position: 'relative',
    display: 'flex',
    width: 892,
    height: 450,
    margin: '0 auto',
    color: grayColor,
    fontSize: 12,
    borderRadius: '6px',
    background: '#fff',
    overflow: 'hidden'
  },
  left: {
    position: 'relative',
    padding: '34px 24px 15px',
    width: 310,
    height: '100%',
    background: '#F5F8FC'
  },
  right: {
    positon: 'relative',
    padding: '34px 24px 15px'
  },
  switch: {
    position: 'absolute',
    top: 34,
    right: 36
  },
  title: {
    marginBottom: 20,
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold'
  },
  version: {
    position: 'absolute',
    bottom: '16px',
    '& p': {
      fontSize: 12
    }
  },
  netWrap: {
    display: 'flex',
    marginBottom: 0
  },
  netBtn: {
    margin: '0 20px 10px 0',
    width: 140,
    height: 24,
    background: '#fff',
    minHeight: 0,
    minWidth: 0,
    border: '1px solid rgba(120,139,179,1)',
    boxShadow: 'none',
    '& span': {
      fontSize: 12,
      color: grayColor,
      fontWeight: 'bold'
    }
  },
  netBtnActive: {
    background: '#528DD0',
    border: 'none',
    '&:hover': {
      background: '#3450C5'
    },
    '& span': {
      color: '#fff'
    }
  },
  aboutInfo: {
    '& div': {
      display: 'flex',
      marginBottom: 18,
      lineHeight: '1.5em',
      '& p': {
        fontWeight: 400,
        '&:first-child': {
          width: 70
        }
      }
    }
  },
  connectFail: {
    fontWeight: 400,
    color: '#ff0000'
  },
  button: {
    position: 'absolute',
    width: '150px',
    height: '24px',
    // bottom: 10,
    // right: 10,
    textTransform: 'none',
    fontSize: '12px',
    background: '#fff',
    boxShadow: 'none',
    ...materialButton,
    '& .btn-img': {
      marginRight: 8,
      width: 16,
      height: 16,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      position: 'relative',
      top: '-2px'
    },
    '&:hover': {
      background: '#fff',
      '& span': {
        color: '#528DD0'
      }
    },
    '& span': {
      fontWeight: 'bold',
      color: '#999'
    }
  },
  help: {
    bottom: 10,
    left: 10,
    background: '#F5F8FC'
  },
  updateNodeButton: {
    bottom: 10,
    right: 153,
    '& .btn-img': {
      backgroundImage: `url(${Update}) `
    },
    '&:hover': {
      '& .btn-img': {
        backgroundImage: `url(${UpdateActive}) `
      }
    }
  },
  resetButton: {
    bottom: 10,
    right: 20,
    '& .btn-img': {
      backgroundImage: `url(${Reset}) `
    },
    '&:hover': {
      '& .btn-img': {
        backgroundImage: `url(${ResetActive}) `
      }
    }
  },

  update: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  changeLanguage: {
    position: 'absolute',
    right: 0,
    top: 80,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  selectNode: {
    position: 'absolute',
    right: 0,
    top: 80,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  setMiner: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  setHost: {
    position: 'absolute',
    right: 0,
    top: 40,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  openTmp: {
    position: 'absolute',
    right: 0,
    top: 80,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  openDipperin: {
    position: 'absolute',
    right: 0,
    top: 120,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  changeRemote: {
    position: 'absolute',
    right: 0,
    top: 160,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  selectRemote: {
    position: 'absolute',
    right: 0,
    top: 200,
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: '100%',
    border: '1px dashed rgba(0,0,0,0.1)'
  },
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: 'center',
    lineHeight: '608px',
    fontSize: 50,
    fontWeight: 'bold',
    background: 'rgba(255,255,255,0.97)',
    zIndex: 3000
  },
  buttonGroup: {
    justifyContent: 'space-evenly'
  },
  nodeButton: {
    '& span': {
      fontWeight: 400
    }
  },
  global: {
    position: 'absolute',
    top: 23,
    right: 50,
    color: '#666',
    fontSize: 14,
    cursor: 'pointer'
  },
  dialogTitleModal: {
    textAlign: 'center'
  },
  dialogContentModal: {
    width: 310
  },
  dialogBtnsModal: {
    justifyContent: 'space-evenly'
  },
  buttonModal: {
    display: 'block',
    margin: '15px auto',
    width: '262px',
    height: '36px',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  formModal: {
    position: 'relative'
  },
  closeModal: {
    position: 'absolute',
    right: -26,
    top: 6
  },
  tip: {
    width: '480px',
    // height: '16px',
    color: '#838899',
    background: 'rgba(230,230,230,1)',
    boxSizing: 'border-box',
    padding: '0 9px',
    borderRadius: '8px',
    lineHeight: '16px'
  },
  hornIcon: {
    display: 'inline-block',
    transform: 'translateY(1px)',
    width: 12,
    height: 10,
    background: `url(${Horn})`
    // float: 'left',
  },
  tipContent: {
    // float: 'left',
    height: '16px',
    fontSize: '11px',
    marginLeft: '6px'
  },
  tipClose: {
    float: 'right',
    fontWeight: 'bold',
    fontSize: '16px',
    height: '16px',
    color: 'rgba(10,10,10,1)',
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

export default styles
