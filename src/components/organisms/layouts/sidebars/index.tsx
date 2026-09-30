import Images from '@/src/components/atoms/images'
import Tooltips from '@/src/components/atoms/tooltips'
import { useMenuList } from '@/src/hooks/query/menu/list';
import { logout } from '@/src/libs/auth';
import { useActiveSidebar, useNavigationStore } from '@/src/stores/layouts/useNavigationStore';
import { sidebarMap } from '@/src/utils/menu';
import { isSystemRole } from '@/src/constans/config';
import { useMe } from '@/src/hooks/query/auth/me';
import { Building03Icon, ComputerUserIcon, DashboardCircleIcon, Logout01Icon, MarketAnalysisIcon, Monocle01Icon, Pizza01Icon, Settings02Icon } from 'hugeicons-react'
import Link from 'next/link';

export default function Sidebars() {
    const { setActiveSidebar } = useNavigationStore();
    const activeSidebar = useActiveSidebar();

    const { data: menus } = useMenuList()
    const { data: me } = useMe()

    const sidebarData = menus && sidebarMap(menus?.data)
    return (
        <section className='flex flex-col p-4 bg-blue-400 h-screen justify-between items-center'>
            <Images src='https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg' width={35} height={35} />
            <div className='flex flex-col gap-2 text-white'>
                {sidebarData?.map((menu, key) => {
                    const code = menu?.code?.toLocaleLowerCase() || ''
                    const isActive = code === activeSidebar
                    return (
                    <Link
                        key={key}
                        href={menu.path}
                        className={`relative group p-2 rounded-lg transition-colors ${isActive ? 'bg-white text-blue-500 shadow-md' : 'hover:bg-white/20'}`}
                        onClick={() => setActiveSidebar(code)}
                    >
                        {menu.code === 'DASHBOARD' ? (
                            <DashboardCircleIcon />
                        ) : menu.code === 'SITE' ? (
                            <Building03Icon />
                        ) : menu.code === 'USER' ? (
                            <Monocle01Icon />
                        ) : menu.code === 'OPERATIONAL' ? (
                            <ComputerUserIcon />
                        ) : menu.code === 'RSTO' ? (
                            <Pizza01Icon />
                        ) : menu.code === 'FINANCE' && (
                            <MarketAnalysisIcon />
                        )}
                        <Tooltips label={menu.name} />
                    </Link>
                    )
                })}
            </div>
            <div className='flex flex-col gap-2 text-white'>
                {isSystemRole(me?.data?.role?.name) && (
                    <Link href="/config-panel" className="relative group p-2 rounded-lg transition-colors hover:bg-white/20">
                        <Settings02Icon />
                        <Tooltips label={'Config Panel'} />
                    </Link>
                )}
                <div onClick={logout} className="relative group p-2 rounded-lg transition-colors hover:bg-white/20 cursor-pointer">
                    <Logout01Icon />
                    <Tooltips label={'Exit'} />
                </div>
            </div>
        </section>
    )
}
