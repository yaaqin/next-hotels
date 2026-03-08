import Heads from '@/src/components/molecules/cards/heads'
import { AnimatePresence, motion } from 'framer-motion';
import ProfileCardnavbar from '@/src/components/molecules/cards/profileCardNavbar'
import { useNavigationStore } from '@/src/stores/layouts/useNavigationStore';
import { NAVIGATION, NavItem } from '@/src/constans/menu/navbar';
import Link from 'next/link';
import { ArrowDown01Icon } from 'hugeicons-react';
import { useState } from 'react';
import { useMe } from '@/src/hooks/query/auth/me';

// const NAVBAR_MAP = {
//   dashboard: ['Profile', 'Floor', 'Setting'],
//   site: ['Room', 'Room Type', 'Unit', 'Bed', 'Facility'],
//   user: ['Admin', 'Role', 'Menu'],
//   food: ['History', 'Stock', 'Order'],
//   finance: ['Price plan', 'History', 'Revenue'],
// };

interface Props {
  item: NavItem;
}

export function NavbarItem({ item }: Props) {
  const [open, setOpen] = useState(false);

  if (item.children && item.children.length > 0) {
    return (
      <div
        className="relative z-50"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Parent */}
        <button
          className="flex items-center gap-1 font-medium cursor-pointer hover:text-primary"
        >
          {item.label}
          <ArrowDown01Icon
            size={16}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-4 left-0 mt-2 w-48 rounded-lg border bg-white shadow-lg z-50">
            {item.children.map((child) => (
              <Link
                key={child.key}
                href={child.path || '/dashboard'}
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Simple link
  return (
    <Link
      href={item.path || '/dashboard'}
      className="font-medium cursor-pointer hover:text-primary"
    >
      {item.label}
    </Link>
  );
}

export default function Navbar() {
  const { activeSidebar } = useNavigationStore();
  const { data: myData } = useMe()


  // const menu = NAVIGATION.find((item) => item.label.toLocaleLowerCase() === activeSidebar)
  const navbarItems = NAVIGATION.find(i => i.key === activeSidebar)?.children ?? [];

  return (
    <section className="flex items-center justify-between gap-4 px-4 p-2">
      <Heads label="Dashboard" className="text-3xl" iconSize={35} />

      <div className="flex-1 overflow-visible">
        <AnimatePresence mode="wait">
          <motion.section
            key={activeSidebar}
            className="relative w-full flex justify-center items-center gap-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {navbarItems.map((item) => (
              <NavbarItem key={item.key} item={item} />
            ))}
          </motion.section>
        </AnimatePresence>
      </div>

      <ProfileCardnavbar
        name={myData?.data.username || '-'}
        email={myData?.data.email || "-"}
        avatarUrl="https://i.pinimg.com/736x/68/b2/ac/68b2ace58b8a78df5abceafa4a80c8cd.jpg"
      />
    </section>

  )
}
