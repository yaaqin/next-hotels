import { SelectOption } from '@/src/components/molecules/inputs/selects';
import { galleryListState } from '@/src/models/galleries/list';

export const mapGalleryToOptions = (
  data: galleryListState[],
): SelectOption[] => {
  return data.map((gallery) => ({
    id: gallery.id,
    value: gallery.id,
    label: gallery.title,
  }));
};