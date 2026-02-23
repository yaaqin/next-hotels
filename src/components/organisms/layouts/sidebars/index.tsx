import Images from '@/src/components/atoms/images'
import Tooltips from '@/src/components/atoms/tooltips'
import { useMenuList } from '@/src/hooks/query/menu/list';
import { useNavigationStore } from '@/src/stores/layouts/useNavigationStore';
import { sidebarMap } from '@/src/utils/menu';
import { Building03Icon, DashboardCircleIcon, Logout01Icon, MarketAnalysisIcon, Monocle01Icon, Pizza01Icon } from 'hugeicons-react'
import Link from 'next/link';

export default function Sidebars() {
    const { setActiveSidebar } = useNavigationStore();

    const { data: menus } = useMenuList()

    const sidebarData = menus && sidebarMap(menus?.data)
    return (
        <section className='flex flex-col p-4 bg-blue-400 h-screen justify-between items-center'>
            <Images src='https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg' width={35} height={35} />
            <div className='flex flex-col gap-4 text-white'>
                {sidebarData?.map((menu, key) => (
                    <Link key={key} href={menu.path} className="relative group" onClick={() => setActiveSidebar(menu?.code?.toLocaleLowerCase() || '')}>
                        {menu.code === 'DASHBOARD' ? (
                            <DashboardCircleIcon />
                        ) : menu.code === 'SITE' ? (
                            <Building03Icon />
                        ) : menu.code === 'USER' ? (
                            <Monocle01Icon />
                        ) : menu.code === 'FOOD' ? (
                            <Pizza01Icon />
                        ) : menu.code === 'FINANCE' && (
                            <MarketAnalysisIcon />
                        )}
                        <Tooltips label={menu.name} />
                    </Link>
                ))}
            </div>
            <div className="relative group text-white">
                <Logout01Icon />
                <Tooltips label={'Exit'} />
            </div>
        </section>
    )
}
