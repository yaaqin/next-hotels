import { axiosUser } from "@/src/libs/instance"

interface WithdrawRequestPayload {
  previewToken: string
  walletAddress: string
}

export const WithdrawRequest = async (payload: WithdrawRequestPayload) => {
  const res = await axiosUser.post(`/withdraw/request`, payload)

  if (!res) {
    throw new Error('Failed to submit withdraw request')
  }

  return res.data
}