import PublicShell from '@/src/components/organisms/layouts/PublicShell'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PublicShell>{children}</PublicShell>
}
