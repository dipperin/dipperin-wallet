import { ClassNameMap, ClassKeyOfStyles } from '@material-ui/styles/withStyles'

export const mockStyleClasses = <T>(styles: T): ClassNameMap<ClassKeyOfStyles<T>> => {
  return Object.keys(styles).reduce(reduceClasses, {})
}

const reduceClasses = (prev, curr) => Object.assign({}, prev, { [curr]: curr })
