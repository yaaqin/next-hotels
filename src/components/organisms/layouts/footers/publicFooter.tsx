"use client"

import { Facebook01Icon, InstagramIcon, Mail01Icon, PhoneLockIcon } from "hugeicons-react"
import { useTranslation } from "react-i18next"

export default function Footer() {

   const { t } = useTranslation()
   
  return (
    <footer className="bg-[#b8b8ad] text-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Logo */}
        <div className="text-center mb-14">
          <h2 className="text-2xl tracking-[0.4em] font-light">
            {t('text.footer.mbs')}
          </h2>
          <p className="tracking-[0.5em] text-sm mt-2">SINGAPORE</p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm tracking-[0.2em] uppercase">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <p>Rencanakan Kunjungan</p>
            <p>Rute ke Sini</p>
            <p>Layanan Pengunjung</p>
            <p>Sertifikat Hadiah</p>
            <p>Blog</p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <p>Informasi Perusahaan</p>
            <p>Pelestarian</p>
            <p>Tanggung Jawab Sosial</p>
            <p>Pusat Media</p>
            <p>Karier</p>
            <p>Hubungi Kami</p>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <p>Pemberitahuan Merek Dagang</p>
            <p>Kebijakan Privasi</p>
          </div>

          {/* Column 4 - Contact */}
          <div className="space-y-6 normal-case tracking-normal">
            
            <div>
              <h3 className="uppercase tracking-[0.2em] mb-4">
                Reservasi Hotel
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <PhoneLockIcon size={16} />
                <span>+65 6688 8888</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail01Icon size={16} />
                <span>room.reservations@marinabaysands.com</span>
              </div>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.2em] mb-4">
                Pembelian Tiket Hiburan
              </h3>
              <div className="flex items-center gap-3">
                <PhoneLockIcon size={16} />
                <span>+65 6688 8826</span>
              </div>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.2em] mb-4">
                {t('text.footer.follow')}
              </h3>
              <div className="flex gap-4 items-center">
                <Facebook01Icon size={18} />
                <span className="text-lg font-semibold">X</span>
                <InstagramIcon size={18} />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="text-center mt-16 text-xs tracking-[0.2em] uppercase">
          <p className="mb-4">{t('text.footer.privacypol')}</p>
          <p className="normal-case tracking-normal text-gray-700">
            © 2026 Marina Bay Sands. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>

      </div>
    </footer>
  )
}