import { axiosPrivate } from '@/src/libs/instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface TranslationItem {
    lang: string;
    name: string;
}

interface AddMultiTranslationPayload {
    translations: TranslationItem[];
}

const addMenuMultiTranslation = async (
    menuId: string,
    payload: AddMultiTranslationPayload,
) => {
    const { data } = await axiosPrivate.post(
        `/menus/${menuId}/multi-translation`,
        payload,
    );
    return data;
};

export const useMenuMultiTranslation = (menuId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddMultiTranslationPayload) =>
            addMenuMultiTranslation(menuId, payload),
        onSuccess: () => {
            // invalidate query translation menu yang bersangkutan
            queryClient.invalidateQueries({ queryKey: ['menu-translations', menuId] });
        },
    });
};