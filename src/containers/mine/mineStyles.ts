import { createStyles } from '@material-ui/core/styles'
import { grayColor } from '@/styles/appStyle'
import BgSmall from '@/images/mine-bg-small.png'
import BgSmallMing from '@/images/mine-bg-small-mining.png'
import BgBig from '@/images/mine-bg-big.png'
import Mining from '@/images/mining.gif'
import MineTips from '@/images/mine-tips.png'

const styles = createStyles({
  main: {
    position: 'relative',
    // display: 'flex',
    width: 892,
    height: 450,
    margin: '0 auto',
    color: grayColor,
    fontSize: 12,
    borderRadius: '6px',
    background: '#fff',
    overflow: 'hidden'
  },
  btn: {
    // ...materialButton
    height: 36,
    width: 172,
    background: '#528DD0',
    borderRadius: 18,
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 400,
    cursor: 'pointer',
    outline: 'none'
  },
  input: {
    height: 36,
    width: 172,
    borderRadius: 18,
    fontWeight: 400,
    fontSize: 14,
    background: '#F6F6F6',
    border: '1px solid rgba(82,141,208,1)'
  },
  mineBtn: {
    position: 'absolute',
    top: 60,
    left: 69
  },
  mineBalanceLabel: {
    position: 'absolute',
    width: 172,
    top: 304,
    left: 69,
    display: 'flex',
    justifyContent: 'center',
    '& span': {
      fontWeight: 400,
      fontSize: 12,
      color: '#000'
    }
  },
  balanceDisplay: {
    position: 'absolute',
    top: 322,
    left: 68,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  withdrawBalance: {
    position: 'absolute',
    bottom: 36,
    left: 69
  },
  smallBackground: {
    width: 160,
    height: 190,
    background: `url(${BgSmall}) no-repeat`,
    position: 'absolute',
    top: 185
  },
  smallBackgroundMining: {
    width: 160,
    height: 190,
    background: `url(${BgSmallMing}) no-repeat`,
    position: 'absolute',
    top: 185
  },
  bigBackground: {
    width: 490,
    height: 368,
    background: `url(${BgBig}) no-repeat`,
    position: 'absolute',
    top: 50,
    right: 53
  },
  bigBackgroundMining: {
    width: 490,
    height: 368,
    background: `url(${Mining}) no-repeat`,
    position: 'absolute',
    top: 50,
    right: 53
  },
  mineTips: {
    position: 'absolute',
    top: 68,
    left: 255,
    width: 20,
    height: 20,
    background: `url(${MineTips}) no-repeat`,
    cursor: 'pointer'
  }
})

export default styles
