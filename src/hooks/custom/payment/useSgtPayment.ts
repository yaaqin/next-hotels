'use client'

import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useCallback } from 'react'

const SGT_COIN_TYPE = process.env.NEXT_PUBLIC_SGT_COIN_TYPE!
// Format: '0xPACKAGE_ID::sgt::SGT'

const SGT_DECIMALS = 9

interface ExecuteSgtPaymentParams {
  hotelWalletAddress: string
  sgtAmountDue: number
}

export function useSgtPayment() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  const client = useSuiClient()
  const account = useCurrentAccount()

  const executePayment = useCallback(
    async ({ hotelWalletAddress, sgtAmountDue }: ExecuteSgtPaymentParams) => {
      if (!account?.address) throw new Error('Wallet belum terkoneksi')

      const amountMist = BigInt(Math.round(sgtAmountDue * 10 ** SGT_DECIMALS))

      // 1. Fetch semua SGT coin object milik user
      const { data: sgtCoins } = await client.getCoins({
        owner: account.address,
        coinType: SGT_COIN_TYPE,
      })

      console.log('SGT_COIN_TYPE:', SGT_COIN_TYPE)
      console.log('SGT Coins found:', sgtCoins)

      if (!sgtCoins || sgtCoins.length === 0) {
        throw new Error('Tidak ada SGT di wallet kamu')
      }

      // 2. Hitung total balance SGT yang dimiliki
      const totalBalance = sgtCoins.reduce(
        (sum, coin) => sum + BigInt(coin.balance),
        BigInt(0)
      )

      if (totalBalance < amountMist) {
        throw new Error(
          `SGT tidak cukup. Kamu punya ${totalBalance}, butuh ${amountMist}`
        )
      }

      const tx = new Transaction()

      // 3. Kalau user punya lebih dari 1 coin object SGT, merge dulu jadi 1
      //    biar bisa di-split dengan benar
      const primaryCoin = tx.object(sgtCoins[0].coinObjectId)

      if (sgtCoins.length > 1) {
        tx.mergeCoins(
          primaryCoin,
          sgtCoins.slice(1).map((c) => tx.object(c.coinObjectId))
        )
      }

      // 4. Split sejumlah yang harus dibayar dari SGT coin (bukan tx.gas!)
      const [coinToSend] = tx.splitCoins(primaryCoin, [amountMist])

      // 5. Transfer SGT ke hotel wallet
      tx.transferObjects([coinToSend], hotelWalletAddress)

      // 6. Sign & execute → ini trigger popup Slush dengan coin SGT yang bener
      const result = await signAndExecute({ transaction: tx })

      // 7. Tunggu konfirmasi on-chain
      await client.waitForTransaction({ digest: result.digest })

      return result.digest
    },
    [signAndExecute, client, account]
  )

  return { executePayment }
}