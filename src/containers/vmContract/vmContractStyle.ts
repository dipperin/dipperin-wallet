import { createStyles } from '@material-ui/core/styles'

const styles = createStyles({
  left: {
    position: 'relative',
    display: 'inline-block',
    width: 530,
    height: 450,
    margin: '0 24px',
    padding: '28px 20px 20px',
    verticalAlign: 'top',
    borderRadius: '6px',
    background: '#fff'
  },
  right: {
    display: 'inline-block',
    width: 338,
    height: 450,
    padding: '26px 16px 0',
    borderRadius: '6px',
    background: '#fff',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '2px',
      background: '#bbb'
    }
  },
  vmContract: {
    position: 'relative'
  },
  container: {
    width: 892,
    height: 450,
    margin: '0 auto',
    borderRadius: 6,
    background: '#fff'
    // overflow: 'auto'
  }
})

export default styles
