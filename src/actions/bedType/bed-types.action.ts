'use server'

import { CreateBedTypePayload } from '@/src/models/bedType/create';
import { createBedType } from '@/src/services/servers/bed-types/create';
import { revalidatePath } from 'next/cache'

export const createBedTypeAction = async (
  payload: CreateBedTypePayload
): Promise<{ success: boolean; message: string }> => {
  try {
    await createBedType(payload)
    revalidatePath('/dashboard/bed-type')
    return { success: true, message: 'Bed type berhasil dibuat' }
  } catch (error) {
    console.error('[createBedTypeAction] error =>', error)
    return { success: false, message: 'Gagal membuat bed type' }
  }
}