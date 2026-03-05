import Image from 'next/image'
import mbs1 from '../../../../../public/img/geloo.webp'
import Navbar2 from '@/src/components/organisms/layouts/navbars/navbarPublic'
import Amenities from '@/src/components/organisms/home/amenities'
export default function BookingPage2() {
  return (
    <>
      <section className='h-screen w-full relative'>
        <Image
          src={mbs1}
          alt={'mbs'}
          fill
          className='z-0 object-cover'
        />       
         <Navbar2 />
      </section>
      <section className='h-screen w-full bg-black'></section>
      <section className='h-screen w-full'></section>
      <section className='h-screen w-full bg-black'></section>
      <Amenities />
    </>
  )
}
