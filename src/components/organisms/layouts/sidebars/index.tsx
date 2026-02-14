import Images from '@/src/components/atoms/images'
import Tooltips from '@/src/components/atoms/tooltips'
import { Building03Icon, DashboardCircleIcon, Logout01Icon, MarketAnalysisIcon, Monocle01Icon, Pizza01Icon } from 'hugeicons-react'
import { useState } from 'react'

export default function Sidebars() {
    return (
        <section className='flex flex-col p-4 bg-blue-800 h-screen justify-between items-center'>
            <Images src='https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg' width={35} height={35}/>
            <div className='flex flex-col gap-4 text-white'>
                <div className="relative group">
                    <DashboardCircleIcon />
                    <Tooltips label={'Dashboard'} />
                </div>
                <div className="relative group">
                    <Building03Icon />
                    <Tooltips label={'Site'} />
                </div>
                <div className="relative group">
                    <Monocle01Icon />
                    <Tooltips label={'User Management'} />
                </div>
                <div className="relative group">
                    <Pizza01Icon />
                    <Tooltips label={'Foods'} />
                </div>
                <div className="relative group">
                    <MarketAnalysisIcon />
                    <Tooltips label={'Finance'} />
                </div>
            </div>
            <div className="relative group">
                <Logout01Icon />
                <Tooltips label={'Exit'} />
            </div>
        </section>
    )
}
