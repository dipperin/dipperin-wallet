import { createStyles } from '@material-ui/core/styles'

const styles = createStyles({
  container: {
    width: 892,
    height: 450,
    margin: '0 auto',
    borderRadius: 6,
    background: '#fff',
    overflow: 'auto'
  },
  return: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    cursor: 'pointer',
    marginTop: '32px',
    marginBottom: '36px',
    '& img': {
      margin: '0 24px'
    },
    '& span': {
      fontWeight: 'bold'
    },
    '&:hover': {
      opacity: 0.7
    }
  }
})

export default styles
