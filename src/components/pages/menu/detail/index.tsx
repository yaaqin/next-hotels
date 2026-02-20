'use client'
import Buttons from '@/src/components/atoms/buttons';
import InfoCard from '@/src/components/molecules/cards/infoCard';
import AccessControlTable from '@/src/components/organisms/menu/accessControl/table';
import MenuTranslationTable from '@/src/components/organisms/menu/translations/table';
import MenuTranslationForm from '@/src/components/organisms/menu/translations/updateTranslationsForm';
import { useMenuMultiTranslation } from '@/src/hooks/mutation/menu/useMenuMultiTranslation';
import { useMenuDetail } from '@/src/hooks/query/menu/detail';
import { useMenuDetailTranslations } from '@/src/hooks/query/menu/detailTranslations';
import { queryClient } from '@/src/libs/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MenuDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const router = useRouter()

    const { mutate, isPending, isError } = useMenuMultiTranslation(id);

    const { data } = useMenuDetail(id)
    const { data: translations } = useMenuDetailTranslations(id)

    const [isUpdate, setIsUpdate] = useState(false)

    const handleSubmit = (payload: { lang: string; name: string }[]) => {
        mutate(
            { translations: payload },
            {
                onSuccess: () => {
                    router.push(`/dashboard/menu/${id}`)
                    queryClient.invalidateQueries({
                        queryKey: ["menu-detail", id],
                    });
                },
                onError: (err) => console.error(err),
            },
        );
    };
    return (
        <div>
            <div className="flex justify-end items-center">
                <Buttons label={isUpdate ? 'Access Control' : "Update Translation"} onClick={() => setIsUpdate(!isUpdate)} />
            </div>
            <section className="grid grid-cols-3 gap-4 my-4 rounded-xl border">
                <InfoCard Label={"Name"} value={data?.data.name} className="grid col-span-1 truncate" />
                {data?.data.parent && (
                    <InfoCard Label={"Parent"} value={data?.data.parent} className="grid col-span-1 truncate" />
                )}
                <InfoCard Label={"Code"} value={data?.data.code} className="grid col-span-1 truncate" />
                <InfoCard Label={"Path"} value={data?.data.path} className="grid col-span-1 truncate" />
            </section>
            {isUpdate ? (
                <MenuTranslationForm
                    onSubmit={(payload) => handleSubmit(payload)} />
            ) : (
                <>
                    {data && (
                        <AccessControlTable data={data?.data.accessControls} />
                    )}
                    {translations && (
                        <MenuTranslationTable data={translations?.data.translations} />
                    )}
                </>
            )}
        </div>
    )
}
