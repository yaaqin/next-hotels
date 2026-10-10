import Heads from '@/src/components/molecules/cards/heads'
import Images from '@/src/components/atoms/images';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileCardnavbar from '@/src/components/molecules/cards/profileCardNavbar'
import { useActiveSidebar, useNavigation } from '@/src/stores/layouts/useNavigationStore';
import { Menu01Icon } from 'hugeicons-react';
import { useState } from 'react';
import { useMe } from '@/src/hooks/query/auth/me';
import NavScroller from './navScroller';
import MobileMenu from './mobileMenu';

const AVATAR_URL = 'https://i.pinimg.com/736x/68/b2/ac/68b2ace58b8a78df5abceafa4a80c8cd.jpg'
const LOGO_URL = 'https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg'

// Panel yang sedang terbuka: dropdown profil atau menu hamburger, tidak boleh dua-duanya
type OpenPanel = 'profile' | 'menu' | null

export default function Navbar() {
  const activeSidebar = useActiveSidebar();
  const navigation = useNavigation();
  const { data: myData } = useMe()
  const [panel, setPanel] = useState<OpenPanel>(null)

  const navbarItems = navigation.find(i => i.key === activeSidebar)?.children ?? [];

  const profile = (compact: boolean) => (
    <ProfileCardnavbar
      name={myData?.data.username || '-'}
      email={myData?.data.email || "-"}
      avatarUrl={AVATAR_URL}
      compact={compact}
      open={panel === 'profile'}
      onOpenChange={(open) => setPanel(open ? 'profile' : null)}
    />
  )

  return (
    <>
      {/* Desktop */}
      <section className="hidden lg:flex items-center gap-2 px-4 py-2">
        <Heads label="Dashboard" className="shrink-0 text-3xl" iconSize={35} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSidebar}
            className="flex min-w-0 flex-1"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <NavScroller items={navbarItems} />
          </motion.div>
        </AnimatePresence>

        {profile(false)}
      </section>

      {/* Mobile: logo · profil · hamburger (sidebar & menu atas pindah ke hamburger) */}
      <section className="flex lg:hidden items-center gap-2 px-4 py-3 border-b dark:border-slate-800">
        <div className="mr-auto flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400 p-1.5">
            <Images src={LOGO_URL} width={28} height={28} />
          </div>
          <span className="text-lg font-bold">MBS</span>
        </div>

        {profile(true)}

        <button
          type="button"
          onClick={() => setPanel(panel === 'menu' ? null : 'menu')}
          aria-label="Buka menu"
          aria-expanded={panel === 'menu'}
          className="flex h-10 w-10 items-center justify-center rounded-xl border text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Menu01Icon size={22} />
        </button>
      </section>

      <MobileMenu open={panel === 'menu'} onClose={() => setPanel(null)} />
    </>
  )
}
