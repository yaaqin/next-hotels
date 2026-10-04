import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  addMenuTranslations,
  bulkUpdateAccess,
  createAdmin,
  createMenu,
  createRole,
  deleteRole,
  getAccessControls,
  getAdmins,
  getConfigMenuDetail,
  getConfigMenus,
  getConfigMenuTranslations,
  getPaymentMethodConfig,
  getRoles,
  getSites,
  updateMenu,
  updatePaymentMethod,
  updateRole,
} from '@/src/services/config'
import {
  CreateAdminPayload,
  CreateMenuPayload,
  CreateRolePayload,
  PaymentScope,
  UpdatePaymentMethodPayload,
} from '@/src/models/config'

export const configKeys = {
  roles: ['config', 'roles'] as const,
  admins: ['config', 'admins'] as const,
  menus: ['config', 'menus'] as const,
  menuDetail: (id: string) => ['config', 'menus', id] as const,
  menuTranslations: (id: string) => ['config', 'menus', id, 'translations'] as const,
  access: ['config', 'access-control'] as const,
  sites: ['config', 'sites'] as const,
  paymentMethods: (scope: PaymentScope, siteCode?: string) =>
    ['config', 'payment-methods', scope, siteCode ?? '*'] as const,
}

// ── Queries ────────────────────────────────────
export const useConfigRoles = () => useQuery({ queryKey: configKeys.roles, queryFn: getRoles })

export const useConfigAdmins = () => useQuery({ queryKey: configKeys.admins, queryFn: getAdmins })

export const useConfigMenus = () => useQuery({ queryKey: configKeys.menus, queryFn: getConfigMenus })

export const useConfigMenuDetail = (id?: string) =>
  useQuery({
    queryKey: configKeys.menuDetail(id ?? ''),
    queryFn: () => getConfigMenuDetail(id!),
    enabled: !!id,
  })

export const useConfigMenuTranslations = (id?: string) =>
  useQuery({
    queryKey: configKeys.menuTranslations(id ?? ''),
    queryFn: () => getConfigMenuTranslations(id!),
    enabled: !!id,
  })

export const useConfigAccess = () =>
  useQuery({ queryKey: configKeys.access, queryFn: getAccessControls })

export const useConfigSites = () => useQuery({ queryKey: configKeys.sites, queryFn: getSites })

export const usePaymentMethodConfig = (scope: PaymentScope, siteCode?: string) =>
  useQuery({
    queryKey: configKeys.paymentMethods(scope, siteCode),
    queryFn: () => getPaymentMethodConfig(scope, siteCode),
  })

// ── Mutations ──────────────────────────────────
// Error sudah di-toast oleh interceptor axiosPrivate, di sini cuma toast sukses + refresh data

export const useCreateRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      toast.success('Role dibuat')
      qc.invalidateQueries({ queryKey: configKeys.roles })
      // BE otomatis bikin baris access control untuk role baru
      qc.invalidateQueries({ queryKey: configKeys.access })
    },
  })
}

export const useUpdateRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateRolePayload }) =>
      updateRole(id, payload),
    onSuccess: () => {
      toast.success('Role diperbarui')
      qc.invalidateQueries({ queryKey: configKeys.roles })
      qc.invalidateQueries({ queryKey: configKeys.admins })
    },
  })
}

export const useDeleteRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      toast.success('Role dihapus')
      qc.invalidateQueries({ queryKey: configKeys.roles })
      qc.invalidateQueries({ queryKey: configKeys.access })
    },
  })
}

export const useCreateAdmin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => createAdmin(payload),
    onSuccess: () => {
      toast.success('Admin dibuat')
      qc.invalidateQueries({ queryKey: configKeys.admins })
    },
  })
}

export const useCreateMenu = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMenuPayload) => createMenu(payload),
    onSuccess: () => {
      toast.success('Menu dibuat')
      qc.invalidateQueries({ queryKey: configKeys.menus })
      qc.invalidateQueries({ queryKey: configKeys.access })
    },
  })
}

export const useUpdateMenu = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { code?: string; path?: string }) => updateMenu(id, payload),
    onSuccess: () => {
      toast.success('Menu diperbarui')
      qc.invalidateQueries({ queryKey: configKeys.menus })
    },
  })
}

export const useAddMenuTranslations = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (translations: { lang: string; name: string }[]) =>
      addMenuTranslations(id, translations),
    onSuccess: () => {
      toast.success('Terjemahan disimpan')
      qc.invalidateQueries({ queryKey: configKeys.menuTranslations(id) })
      qc.invalidateQueries({ queryKey: configKeys.menus })
    },
  })
}

export const useBulkUpdateAccess = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      roleId,
      updates,
    }: {
      roleId: string
      updates: { menuId: string; isAccess: boolean }[]
    }) => bulkUpdateAccess(roleId, updates),
    onSuccess: () => {
      toast.success('Hak akses disimpan')
      qc.invalidateQueries({ queryKey: configKeys.access })
      qc.invalidateQueries({ queryKey: ['config', 'menus'] })
    },
  })
}

export const useUpdatePaymentMethod = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePaymentMethodPayload) => updatePaymentMethod(payload),
    onSuccess: (_, payload) => {
      toast.success('Metode pembayaran disimpan')
      // Setting semua cabang ikut mengubah status efektif di tiap cabang
      qc.invalidateQueries({ queryKey: ['config', 'payment-methods', payload.scope] })
    },
  })
}
