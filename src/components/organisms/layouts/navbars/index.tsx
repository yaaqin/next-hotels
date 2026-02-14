import Heads from '@/src/components/molecules/cards/heads'
import { AnimatePresence, motion } from 'framer-motion';
import ProfileCardnavbar from '@/src/components/molecules/cards/profileCardNavbar'
import { useNavigationStore } from '@/src/stores/layouts/useNavigationStore';

const NAVBAR_MAP = {
  dashboard: ['Profile', 'Floor', 'Setting'],
  site: ['Room', 'Room Type', 'Unit', 'Bed', 'Facility'],
  user: ['Admin', 'Role', 'Menu'],
  food: ['History', 'Stock', 'Order'],
  finance: ['Price plan', 'History', 'Revenue'],
};

export default function Navbar() {
  const { activeSidebar } = useNavigationStore();

  return (
    <section className='flex items-center justify-between gap-4 px-4 p-2'>
      <Heads label='Dashboard' className='text-3xl' iconSize={35} />
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.section
            key={activeSidebar}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex justify-center items-center gap-6"
          >
            {NAVBAR_MAP[activeSidebar].map((item) => (
              <p key={item} className="cursor-pointer font-medium">
                {item}
              </p>
            ))}
          </motion.section>
        </AnimatePresence>
      </div>
      <ProfileCardnavbar name={'Yaaqin'} email={'yaqin@mail.com'} avatarUrl={'https://i.pinimg.com/736x/68/b2/ac/68b2ace58b8a78df5abceafa4a80c8cd.jpg'} />
    </section>
  )
}
