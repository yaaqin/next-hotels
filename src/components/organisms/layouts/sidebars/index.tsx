import Images from '@/src/components/atoms/images'
import Tooltips from '@/src/components/atoms/tooltips'
import { useNavigationStore } from '@/src/stores/layouts/useNavigationStore';
import { Building03Icon, DashboardCircleIcon, Logout01Icon, MarketAnalysisIcon, Monocle01Icon, Pizza01Icon } from 'hugeicons-react'
import Link from 'next/link';

export default function Sidebars() {
      const { setActiveSidebar } = useNavigationStore();
    return (
        <section className='flex flex-col p-4 bg-[#459997] h-screen justify-between items-center'>
            <Images src='https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg' width={35} height={35}/>
            <div className='flex flex-col gap-4 text-white'>
                <Link href={`/dashboard`} className="relative group" onClick={() => setActiveSidebar('dashboard')}>
                    <DashboardCircleIcon />
                    <Tooltips label={'Dashboard'} />
                </Link>
                <Link href={`/dashboard/site`} className="relative group" onClick={() => setActiveSidebar('site')}>
                    <Building03Icon />
                    <Tooltips label={'Site'} />
                </Link>
                <Link href={`/dashboard/user`} className="relative group" onClick={() => setActiveSidebar('user')}>
                    <Monocle01Icon />
                    <Tooltips label={'User Management'} />
                </Link>
                <Link href={`/dashboard/food`} className="relative group" onClick={() => setActiveSidebar('food')}>
                    <Pizza01Icon />
                    <Tooltips label={'Foods'} />
                </Link>
                <Link href={`/dashboard/finance`} className="relative group" onClick={() => setActiveSidebar('finance')}>
                    <MarketAnalysisIcon />
                    <Tooltips label={'Finance'} />
                </Link>
            </div>
            <div className="relative group text-white">
                <Logout01Icon />
                <Tooltips label={'Exit'} />
            </div>
        </section>
    )
}
