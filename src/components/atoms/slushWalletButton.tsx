'use client'

import { useConnectWallet, useCurrentAccount, useDisconnectWallet, useWallets } from '@mysten/dapp-kit'
import { useEffect } from 'react'

interface Props {
  onConnected: (address: string) => void
  onDisconnected: () => void
}

export function SlushWalletButton({ onConnected, onDisconnected }: Props) {
  const wallets = useWallets()
  const { mutate: connect } = useConnectWallet()
  const { mutate: disconnect } = useDisconnectWallet()
  const account = useCurrentAccount()

  // Filter khusus Slush wallet
  const slushWallet = wallets.find((w) =>
    w.name.toLowerCase().includes('slush') ||
    w.name.toLowerCase().includes('sui')
  )

  useEffect(() => {
    if (account?.address) {
      onConnected(account.address)
    } else {
      onDisconnected()
    }
  }, [account?.address])

  const shortAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (account) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2">
          {/* Slush icon placeholder */}
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">S</div>
          <div>
            <p className="text-xs font-medium text-blue-700">Slush Wallet Connected</p>
            <p className="text-[10px] text-blue-400 font-mono">{shortAddress(account.address)}</p>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-[10px] text-gray-400 hover:text-red-400 transition"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        if (slushWallet) {
          connect({ wallet: slushWallet })
        } else {
          // Fallback: open Slush wallet install page
          window.open('https://slush.app', '_blank')
        }
      }}
      className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition"
    >
      <div className="w-8 h-6 bg-blue-100 rounded text-[10px] font-bold text-blue-500 flex items-center justify-center">SGT</div>
      {slushWallet ? 'Connect Slush Wallet' : 'Install Slush Wallet'}
    </button>
  )
}