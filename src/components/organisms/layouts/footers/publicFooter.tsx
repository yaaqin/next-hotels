"use client"

import { Facebook01Icon, InstagramIcon, Mail01Icon, PhoneLockIcon } from "hugeicons-react"
import { useTranslation } from "react-i18next"

export default function Footer() {

  const { t } = useTranslation()

  return (
    <footer
      className="bg-[#05111F] text-[#6A9EC5]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Logo */}
        <div className="text-center mb-14">
          <h2
            className="text-2xl tracking-[0.4em] font-light text-[#C8DCEF]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t('text.footer.mbs')}
          </h2>
          <div className="w-8 h-px bg-[#1A56A0] opacity-50 mx-auto mt-3 mb-3" />
          <p className="tracking-[0.5em] text-xs mt-2 text-[#5B90C9]">SINGAPORE</p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-[0.68rem] tracking-[0.18em] uppercase">

          {/* Column 1 */}
          <div className="space-y-4">
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Rencanakan Kunjungan</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Rute ke Sini</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Layanan Pengunjung</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Sertifikat Hadiah</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Blog</p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Informasi Perusahaan</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Pelestarian</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Tanggung Jawab Sosial</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Pusat Media</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Karier</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Hubungi Kami</p>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Pemberitahuan Merek Dagang</p>
            <p className="hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer">Kebijakan Privasi</p>
          </div>

          {/* Column 4 - Contact */}
          <div className="space-y-6 normal-case tracking-normal">

            <div>
              <h3 className="uppercase tracking-[0.18em] text-[0.62rem] mb-4 text-[#C8DCEF]">
                Reservasi Hotel
              </h3>
              <div className="w-5 h-px bg-[#1A56A0] opacity-40 mb-4" />
              <div className="flex items-center gap-3 mb-3 text-[0.72rem]">
                <PhoneLockIcon size={14} className="text-[#1A56A0]" />
                <span>+65 6688 8888</span>
              </div>
              <div className="flex items-center gap-3 text-[0.72rem]">
                <Mail01Icon size={14} className="text-[#1A56A0]" />
                <span>room.reservations@marinabaysands.com</span>
              </div>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.18em] text-[0.62rem] mb-4 text-[#C8DCEF]">
                Pembelian Tiket Hiburan
              </h3>
              <div className="w-5 h-px bg-[#1A56A0] opacity-40 mb-4" />
              <div className="flex items-center gap-3 text-[0.72rem]">
                <PhoneLockIcon size={14} className="text-[#1A56A0]" />
                <span>+65 6688 8826</span>
              </div>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.18em] text-[0.62rem] mb-4 text-[#C8DCEF]">
                {t('text.footer.follow')}
              </h3>
              <div className="w-5 h-px bg-[#1A56A0] opacity-40 mb-4" />
              <div className="flex gap-5 items-center">
                <Facebook01Icon
                  size={17}
                  className="text-[#6A9EC5] hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer"
                />
                <span className="text-base font-medium text-[#6A9EC5] hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer leading-none">
                  X
                </span>
                <InstagramIcon
                  size={17}
                  className="text-[#6A9EC5] hover:text-[#C8DCEF] transition-colors duration-300 cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#0A1E38] mt-14 mb-10" />

        {/* Bottom */}
        <div className="text-center text-[0.6rem] tracking-[0.18em] uppercase text-[#3A6A96]">
          <p className="mb-4 hover:text-[#6A9EC5] transition-colors duration-300 cursor-pointer">
            {t('text.footer.privacypol')}
          </p>
          <p className="normal-case tracking-normal text-[#2A4E6A] text-[0.65rem]">
            © 2026 Marina Bay Sands. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>

      </div>
    </footer>
  )
}