import { Href, UnregisterCallback } from 'history'
import { RouteComponentProps } from 'react-router'

const getMockRouterProps = <P>(data: P): RouteComponentProps<P> => {
  const location = {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: {}
  }

  const props: RouteComponentProps<P> = {
    history: {
      action: 'POP',
      block: t => {
        const temp: UnregisterCallback = () => null
        return temp
      },
      createHref: t => {
        const temp: Href = ''
        return temp
      },
      go: num => null,
      goBack: () => null,
      goForward: () => null,
      length: 2,
      listen: t => {
        const temp: UnregisterCallback = () => null
        return temp
      },
      location,
      push: jest.fn(),
      replace: () => null
    },
    location,
    match: {
      isExact: true,
      params: data,
      path: '',
      url: ''
    },
    staticContext: {}
  }

  return props
}

export default getMockRouterProps
