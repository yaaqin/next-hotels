'use client'
import InfoCard from '@/src/components/molecules/cards/infoCard';
import AccessControlTable from '@/src/components/organisms/menu/accessControl/table';
import MenuTranslationTable from '@/src/components/organisms/menu/translations/table';
import { useMenuDetail } from '@/src/hooks/query/menu/detail';
import { useMenuDetailTranslations } from '@/src/hooks/query/menu/detailTranslations';
import { useParams } from 'next/navigation';

export default function MenuDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data } = useMenuDetail(id)
    const { data: translations } = useMenuDetailTranslations(id)

    console.log('data menu detail ==>', data)
    console.log('data menu detail translation ==>', translations)
    return (
        <div>
            <section className="grid grid-cols-3 gap-4 my-4 rounded-xl border">
                <InfoCard Label={"Name"} value={data?.data.name} className="grid col-span-1 truncate" />
                {data?.data.parent && (
                    <InfoCard Label={"Parent"} value={data?.data.parent} className="grid col-span-1 truncate" />
                )}
                <InfoCard Label={"Code"} value={data?.data.code} className="grid col-span-1 truncate" />
                <InfoCard Label={"Path"} value={data?.data.path} className="grid col-span-1 truncate" />
            </section>
            {data && (
                <AccessControlTable data={data?.data.accessControls} />
            )}
            {translations && (
                <MenuTranslationTable data={translations?.data.translations} />
            )}
        </div>
    )
}
