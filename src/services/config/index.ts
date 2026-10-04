import { axiosPrivate } from '@/src/libs/instance'
import {
  AccessRow,
  Admin,
  ApiResponse,
  ConfigMenu,
  ConfigMenuDetail,
  CreateAdminPayload,
  CreateMenuPayload,
  CreateRolePayload,
  MenuTranslations,
  PaymentMethodConfig,
  PaymentScope,
  Role,
  Site,
  UpdatePaymentMethodPayload,
} from '@/src/models/config'

// Semua endpoint /config/* khusus role sistem (DEV, SUPERADMIN) — dijaga SystemRoleGuard di BE

// ── Roles ──────────────────────────────────────
export const getRoles = async (): Promise<ApiResponse<Role[]>> =>
  (await axiosPrivate.get('/config/roles')).data

export const createRole = async (payload: CreateRolePayload) =>
  (await axiosPrivate.post('/config/roles', payload)).data

export const updateRole = async (id: string, payload: CreateRolePayload) =>
  (await axiosPrivate.patch(`/config/roles/${id}`, payload)).data

export const deleteRole = async (id: string) =>
  (await axiosPrivate.delete(`/config/roles/${id}`)).data

// ── Admins ─────────────────────────────────────
export const getAdmins = async (): Promise<ApiResponse<Admin[]>> =>
  (await axiosPrivate.get('/config/admins')).data

export const createAdmin = async (payload: CreateAdminPayload) =>
  (await axiosPrivate.post('/config/admins', payload)).data

// ── Menus ──────────────────────────────────────
export const getConfigMenus = async (): Promise<ApiResponse<ConfigMenu[]>> =>
  (await axiosPrivate.get('/config/menus')).data

export const getConfigMenuDetail = async (id: string): Promise<ApiResponse<ConfigMenuDetail>> =>
  (await axiosPrivate.get(`/config/menus/${id}`)).data

export const getConfigMenuTranslations = async (
  id: string,
): Promise<ApiResponse<MenuTranslations>> =>
  (await axiosPrivate.get(`/config/menus/${id}/translations`)).data

export const createMenu = async (payload: CreateMenuPayload) =>
  (await axiosPrivate.post('/config/menus', payload)).data

export const updateMenu = async (id: string, payload: { code?: string; path?: string }) =>
  (await axiosPrivate.patch(`/config/menus/${id}`, payload)).data

export const addMenuTranslations = async (
  id: string,
  translations: { lang: string; name: string }[],
) => (await axiosPrivate.post(`/config/menus/${id}/multi-translation`, { translations })).data

// ── Access Control ─────────────────────────────
export const getAccessControls = async (): Promise<ApiResponse<AccessRow[]>> =>
  (await axiosPrivate.get('/config/access-control')).data

export const bulkUpdateAccess = async (
  roleId: string,
  updates: { menuId: string; isAccess: boolean }[],
) => (await axiosPrivate.put(`/config/access-control/role/${roleId}/bulk`, { updates })).data

// ── Sites (dropdown sitecode saat buat admin) ──
export const getSites = async (): Promise<ApiResponse<Site[]>> =>
  (await axiosPrivate.get('/sites')).data

// ── Payment methods ────────────────────────────
// siteCode kosong = setting semua cabang
export const getPaymentMethodConfig = async (
  scope: PaymentScope,
  siteCode?: string,
): Promise<ApiResponse<PaymentMethodConfig[]>> =>
  (await axiosPrivate.get('/config/payment-methods', { params: { scope, siteCode } })).data

export const updatePaymentMethod = async (
  payload: UpdatePaymentMethodPayload,
): Promise<ApiResponse<PaymentMethodConfig[]>> =>
  (await axiosPrivate.put('/config/payment-methods', payload)).data
