import { SelectOption } from '@/src/components/molecules/inputs/selects';
import { sitelistProps, siteListState } from '@/src/models/sites/list';

interface MapSiteOptionsConfig {
  useSiteCode?: boolean;
  includeLocationInLabel?: boolean;
}

export const mapSiteToOptions = (
  response: sitelistProps | undefined,
  config?: MapSiteOptionsConfig
): SelectOption[] => {
  if (!response?.data) return [];

  const { useSiteCode = false, includeLocationInLabel = false } = config || {};

  return response.data.map((site: siteListState) => ({
    id: site.id,
    value: useSiteCode ? site.sitecode : site.id,
    label: includeLocationInLabel
      ? `${site.nama} - ${site.lokasi}`
      : site.nama,
  }));
};