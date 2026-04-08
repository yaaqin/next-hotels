'use client'

import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useCallback } from 'react'

// Ganti dengan package id SGT token lu
const SGT_COIN_TYPE = process.env.NEXT_PUBLIC_SGT_COIN_TYPE!
// Contoh: '0xABC123::sgt::SGT'

const SGT_DECIMALS = 9

interface ExecuteSgtPaymentParams {
  hotelWalletAddress: string
  sgtAmountDue: number       // dalam SGT (desimal), dari response BE
}

export function useSgtPayment() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  const client = useSuiClient()

  const executePayment = useCallback(
    async ({ hotelWalletAddress, sgtAmountDue }: ExecuteSgtPaymentParams) => {
      // Convert SGT → MIST (9 decimals)
      const amountMist = BigInt(Math.round(sgtAmountDue * 10 ** SGT_DECIMALS))

      const tx = new Transaction()

      // Split coin SGT sejumlah yang dibutuhkan dari wallet user
      const [coinToSend] = tx.splitCoins(
        tx.gas, // jika SGT = native SUI, kalau bukan ganti dengan object SGT
        [amountMist]
      )

      // Transfer ke hotel wallet
      tx.transferObjects([coinToSend], hotelWalletAddress)

      // Sign & execute — ini yang trigger popup Slush wallet
      const result = await signAndExecute({
        transaction: tx,
      })

      // Tunggu konfirmasi on-chain
      await client.waitForTransaction({ digest: result.digest })

      return result.digest
    },
    [signAndExecute, client]
  )

  return { executePayment }
}