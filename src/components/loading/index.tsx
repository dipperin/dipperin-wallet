import React from 'react'

import { withStyles, WithStyles } from '@material-ui/core'

import styles from './loadingStyle'
import { primaryColor } from '@/styles/appStyle'

interface Props extends WithStyles<typeof styles> {
  progress: number
  title: string
}

// const Loading = (props: Props) => {
//   const { classes, title, progress } = props
//   const rot = progress - 0.25
//   const x = 100 * Math.cos(2 * rot * Math.PI) + 100
//   const y = 100 * Math.sin(2 * rot * Math.PI) + 100
//   return (
//     <div className={classes.loading}>
//       <div className={classes.loadingWrap}>
//         <svg className={classes.svg} width={200} height={200}>
//           <circle fill={progress === 1 ? primaryColor : '#fff'} cx={100} cy={100} r={99} opacity="0.9" />
//           <path
//             style={{
//               transition: 'all 0.35s'
//             }}
//             d={x > 100 ? `M100 100 L100 0 A100 100 0 0 1 ${x} ${y} Z` : `M100 100 L100 0 A100 100 0 1 1 ${x} ${y} Z`}
//             strokeWidth="1"
//             fill=primaryColor
//             opacity="0.9"
//           />
//         </svg>
//         <div className={classes.title}>
//           {title}
//           ...
//         </div>
//       </div>
//     </div>
//   )
// }

const Loading = (props: Props) => {
  const { classes, title, progress } = props
  const rot = progress - 0.25
  const x = 50 * Math.cos(2 * rot * Math.PI) + 50
  const y = 50 * Math.sin(2 * rot * Math.PI) + 50
  return (
    <div className={classes.loading}>
      <div className={classes.loadingWrap}>
        <svg className={classes.svg} width={100} height={100}>
          <circle fill={progress === 1 ? primaryColor : '#fff'} cx={50} cy={50} r={49.9} opacity="0.9" />
          <path
            style={{
              transition: 'all 0.35s'
            }}
            d={x > 50 ? `M50 50 L50 0 A50 50 0 0 1 ${x} ${y} Z` : `M50 50 L50 0 A50 50 0 1 1 ${x} ${y} Z`}
            // strokeWidth="1"
            fill={primaryColor}
            opacity="0.9"
          />
        </svg>
        <div className={classes.title}>
          {title}
          ...
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(Loading)
