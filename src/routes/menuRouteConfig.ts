import settingActive from '../images/menu-setting-active.png'
import setting from '../images/menu-setting.png'
import walletActive from '../images/menu-wallet-active.png'
import wallet from '../images/menu-wallet.png'
import contract from '@/images/menu-contract.png'
import contractActive from '@/images/menu-contract-active.png'

export interface NormalDashboardRoutes {
  path: string
  sidebarName: string
  navbarName: string
  icon: string
  iconActive: string
}

export interface RedirectDashboardRoutes {
  path: string
  navbarName: string
  redirect: boolean
  to: string
}

export type DashboardRoutes = RedirectDashboardRoutes | NormalDashboardRoutes

const dashboardRoutes: DashboardRoutes[] = [
  {
    path: '/main/wallet',
    sidebarName: 'wallet',
    navbarName: 'Wallet',
    icon: wallet,
    iconActive: walletActive
  },
  {
    path: '/main/contract',
    sidebarName: 'contract',
    navbarName: 'Contract',
    icon: contract,
    iconActive: contractActive
  },
  {
    path: '/main/vm_contract',
    sidebarName: 'vmContract',
    navbarName: 'VM Contract',
    icon: contract,
    iconActive: contractActive
  },
  {
    path: '/main/setting',
    sidebarName: 'setting',
    navbarName: 'Setting',
    icon: setting,
    iconActive: settingActive
  }
]

export default dashboardRoutes
