'use client'
import Image from 'next/image'
import mbs1 from '../../../../../public/img/geloo.webp'
import Navbar2 from '@/src/components/organisms/layouts/navbars/navbarPublic'
import Amenities from '@/src/components/organisms/home/amenities'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Footer from '@/src/components/organisms/layouts/footers/publicFooter'
import RoomTypeCarousel from '@/src/components/organisms/home/priceList'

export default function BookingPage2() {
  const { scrollY } = useScroll()

  const rawOpacity = useTransform(scrollY, [32, 200], [1, 0])
  const rawY = useTransform(scrollY, [32, 200], [0, 40])
  const rawBlur = useTransform(scrollY, [32, 200], [0, 10])
  const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 20, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.5 })
  const [blurVal, setBlurVal] = useState(0)
  useEffect(() => {
    return rawBlur.on('change', (v) => setBlurVal(v))
  }, [rawBlur])

  // Ref untuk section parallax
  // const parallaxRef = useRef(null)
  // const { scrollYProgress } = useScroll({
  //   target: parallaxRef,
  //   offset: ['start end', 'end start'] // mulai saat masuk viewport, selesai saat keluar
  // })

  // Scale dari 1.0 → 1.1 → 1.0 (zoom in di tengah, zoom out pas keluar)
  // const rawScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1])
  // const scale = useSpring(rawScale, { stiffness: 60, damping: 20, mass: 1 })


  // Ref untuk text section
  const textSectionRef = useRef(null)
  const { scrollYProgress: textProgress } = useScroll({
    target: textSectionRef,
    offset: ['start end', 'end start']
  })

  // Tiap baris muncul dengan offset berbeda
  const line1Y = useTransform(textProgress, [0.0, 0.3], [60, 0])
  const line1Op = useTransform(textProgress, [0.0, 0.3], [0, 1])
  const line2Y = useTransform(textProgress, [0.1, 0.4], [60, 0])
  const line2Op = useTransform(textProgress, [0.1, 0.4], [0, 1])
  const line3Y = useTransform(textProgress, [0.2, 0.5], [60, 0])
  const line3Op = useTransform(textProgress, [0.2, 0.5], [0, 1])

  return (
    <>
      <section className='relative h-screen w-full' style={{ zIndex: 3 }}>
        <Image src={mbs1} alt={'mbs'} fill className='z-0 object-cover' />
        <Navbar2 />
        <motion.section
          style={{
            opacity,
            y,
            filter: `blur(${blurVal}px)`,
            willChange: 'opacity, transform, filter',
          }}
          className="absolute bottom-8 left-6"
        >
          <h4 className="text-4xl max-w-2xl font-bold text-white text-shadow">
            In quiet places, where the world slows down, we have created a space
            for rest, warmth, and timeless moments.
          </h4>
          <p className="text-xl text-white mt-2">
            A place where time lingers gently.
          </p>
        </motion.section>
      </section>

      {/* Text Section */}
      <section
        ref={textSectionRef}
        className='relative min-h-screen w-full bg-white'
        style={{ zIndex: 2 }}
      >
        <div className='min-h-screen flex flex-col justify-center px-16 max-w-4xl mx-auto py-32'>

          <motion.div
            style={{ opacity: line1Op }}
            className='w-12 h-px bg-black mb-12'
          />

          <motion.p
            style={{ y: line1Y, opacity: line1Op }}
            className='text-2xl leading-relaxed text-black font-light mb-8'
          >
            This place is unlike any other. In the heart of Singapore, it was imagined as a sanctuary above the vibrant city — a place for quiet mornings, warm evenings, and the simple joy of slowing down.
          </motion.p>

          <motion.p
            style={{ y: line2Y, opacity: line2Op }}
            className='text-2xl leading-relaxed text-black font-light mb-12'
          >
            For gatherings, for laughter, for the pleasures of good food and gentle conversation.
          </motion.p>

          <motion.p
            style={{ y: line3Y, opacity: line3Op }}
            className='text-lg tracking-widest uppercase text-black font-medium'
          >
            Today, it remains that same place of calm in the rhythm of the city.{' '}
            <span className='font-bold'>Welcome to your moment in Singapore.</span>
          </motion.p>

          <motion.div
            style={{ opacity: line3Op }}
            className='w-12 h-px bg-black mt-12'
          />

        </div>
      </section>

      {/* Parallax section dengan zoom */}
      {/* <section ref={parallaxRef} className='relative h-screen w-full' style={{ zIndex: 1 }}>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='fixed inset-0 w-full h-full'>
              <motion.div className='w-full h-full' style={{ scale, willChange: 'transform' }}>
                <iframe
                  src="https://www.youtube.com/embed/EA97GDn6Jak?autoplay=1&mute=1&loop=1&playlist=EA97GDn6Jak&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=2132"
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  style={{
                    width: '177.78vh',
                    height: '56.25vw',
                    minWidth: '100%',
                    minHeight: '100%',
                    border: 'none',
                    pointerEvents: 'none',
                  }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
          </div>
        </div>
      </section> */}

      <RoomTypeCarousel />
      <section className='relative h-screen w-full bg-black' style={{ zIndex: 2 }}></section>
      <Amenities />
      <section style={{ zIndex: 3 }} className='relative'>
        <Footer />
      </section>
    </>
  )
}