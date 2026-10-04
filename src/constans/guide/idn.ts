import { GuideCategory } from "./types";

// Panduan Bahasa Indonesia — sumber utama. Bahasa lain mengikuti struktur & id yang sama.
const idn: GuideCategory[] = [
    {
        id: "start",
        title: "Memulai",
        topics: [
            {
                id: "login",
                title: "Masuk dengan Google",
                summary: "Akun Google dipakai untuk booking, pesan makanan, dan mengelola pesanan kamu.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Kamu bisa melihat kamar dan harga tanpa login.",
                            "Saat melanjutkan reservasi atau checkout makanan, klik tombol \"Masuk dengan Google\".",
                            "Pilih akun Google kamu. Nama dan email otomatis terisi di form.",
                        ],
                    },
                    {
                        type: "note",
                        text: "Semua booking, credit, dan pesanan makanan tersimpan di akun Google yang kamu pakai. Gunakan akun yang sama setiap kali login.",
                    },
                ],
            },
            {
                id: "language-currency",
                title: "Ganti bahasa & mata uang",
                summary: "Tampilkan website dalam bahasa dan mata uang pilihan kamu.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Klik tombol \"Menu\" di pojok atas halaman.",
                            "Pilih bahasa: Bahasa Indonesia, English, 日本語, atau 中文.",
                            "Pilih mata uang tampilan: IDR, USD, SGD, JPY, atau CNY.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Harga dalam mata uang selain Rupiah hanya perkiraan. Pembayaran tetap ditagih dalam Rupiah (IDR), dan sebelum bayar akan muncul konfirmasi nominal Rupiah-nya.",
                    },
                ],
            },
        ],
    },
    {
        id: "booking",
        title: "Booking kamar",
        topics: [
            {
                id: "booking-search",
                title: "Cari kamar & pilih tanggal",
                summary: "Cara utama booking. Bisa menginap lebih dari 1 malam dan memilih cabang.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Buka halaman Hotel (link \"Semua Cabang\" di bagian bawah halaman utama), atau langsung pilih cabang yang kamu mau.",
                            "Isi tanggal Check-in dan Check-out, lalu klik \"Cek ketersediaan\".",
                            "Hanya kamar yang kosong di semua malam pilihan kamu yang ditampilkan. Urutkan berdasarkan harga atau nomor kamar kalau perlu.",
                            "Klik \"Lihat kamar\" untuk melihat foto, fasilitas, dan total harga untuk tanggal kamu.",
                            "Klik \"Reservasi sekarang\" untuk lanjut ke halaman reservasi.",
                        ],
                    },
                    {
                        type: "tip",
                        text: "Harga bisa berbeda per malam (misalnya akhir pekan atau promo). Total yang tampil sudah menghitung harga setiap malam.",
                    },
                ],
                cta: { label: "Cari kamar", href: "/hotel" },
            },
            {
                id: "booking-quick",
                title: "Booking cepat dari halaman utama",
                summary: "Pesan 1 malam langsung dari tombol \"Pesan\" di halaman utama.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Di halaman utama, klik tombol \"Pesan\" di pojok atas.",
                            "Pilih Tanggal Check-in dan jumlah tamu (opsional), lalu klik \"Reservasi\".",
                            "Pilih tipe kamar yang tersedia, lalu klik \"Reserve Now\".",
                        ],
                    },
                    {
                        type: "note",
                        text: "Booking cepat selalu untuk 1 malam. Untuk menginap lebih dari 1 malam, pakai cara \"Cari kamar & pilih tanggal\".",
                    },
                ],
            },
            {
                id: "booking-reservation",
                title: "Isi data reservasi & pilih kamar",
                summary: "Lengkapi data tamu, pilih nomor kamar, dan metode pembayaran.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Cek tanggal Check-in dan Check-out di bagian \"Menginap\".",
                            "Pilih nomor kamar. Kamar yang sudah dipesan orang lain di tanggal itu tidak akan muncul.",
                            "Masuk dengan Google kalau belum login.",
                            "Isi nama lengkap, nomor telepon (pilih kode negara), tipe identitas (KTP, Paspor, atau SIM), dan nomor identitas.",
                            "Pilih metode pembayaran. Lihat bagian Pembayaran untuk penjelasan tiap metode.",
                            "Cek ringkasan harga di sebelah kanan, lalu klik \"Konfirmasi & Bayar\".",
                        ],
                    },
                    {
                        type: "list",
                        title: "Aturan isian",
                        items: [
                            "NIK KTP harus 16 digit angka.",
                            "Nomor paspor boleh berisi huruf dan angka.",
                            "Nomor telepon diisi tanpa angka 0 di depan, karena kode negara sudah dipilih.",
                        ],
                    },
                ],
            },
            {
                id: "booking-multi-room",
                title: "Pesan lebih dari 1 kamar",
                summary: "Pesan beberapa kamar sekaligus untuk tanggal yang sama dalam satu booking.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Di halaman reservasi, buka pilihan nomor kamar.",
                            "Centang semua kamar yang kamu mau. Klik lagi untuk membatalkan pilihan.",
                            "Ringkasan harga menampilkan harga tiap kamar, dan totalnya otomatis dijumlahkan.",
                            "Lanjutkan pembayaran seperti biasa. Semua kamar dibayar dalam satu tagihan.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Booking dengan lebih dari 1 kamar belum bisa di-reschedule. Kalau perlu ganti tanggal, kamu bisa cancel lalu booking ulang.",
                    },
                    {
                        type: "note",
                        text: "Untuk saat ini, kamar dalam satu booking harus dari tipe kamar yang sama.",
                    },
                ],
            },
        ],
    },
    {
        id: "payment",
        title: "Pembayaran",
        topics: [
            {
                id: "payment-overview",
                title: "Batas waktu pembayaran",
                summary: "Yang perlu diketahui sebelum memilih metode pembayaran.",
                blocks: [
                    {
                        type: "list",
                        items: [
                            "Tagihan Virtual Account dan QRIS berlaku 15 menit sejak kamu klik \"Konfirmasi & Bayar\".",
                            "Selama belum dibayar, kamar ditahan untuk kamu. Kalau lewat 15 menit, booking otomatis kedaluwarsa dan kamar dilepas.",
                            "Halaman pembayaran berubah sendiri setelah pembayaran diterima, tidak perlu di-refresh.",
                            "Metode yang tidak tersedia di cabang tersebut ditampilkan dicoret dengan tanda \"tidak tersedia\".",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Jangan membayar tagihan yang sudah kedaluwarsa. Buat booking baru saja.",
                    },
                ],
            },
            {
                id: "payment-va",
                title: "Virtual Account (BCA, BNI, BRI, Mandiri)",
                summary: "Transfer ke nomor Virtual Account lewat m-banking, internet banking, atau ATM.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Pilih \"Virtual Account\", lalu pilih bank.",
                            "Klik \"Konfirmasi & Bayar\". Kamu diarahkan ke halaman pembayaran.",
                            "Salin nomor Virtual Account. Untuk Mandiri, salin Biller Code dan Bill Key.",
                            "Bayar sebelum waktu yang tertera di \"Bayar sebelum\".",
                            "Setelah pembayaran diterima, halaman otomatis menampilkan status berhasil.",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Mode uji coba (sandbox)",
                        items: [
                            "Klik tombol \"Bayar Sekarang\" untuk membuka simulator Midtrans.",
                            "Tempel nomor Virtual Account, lalu klik \"Inquire\".",
                            "Klik \"Pay\" untuk menyelesaikan pembayaran.",
                        ],
                    },
                ],
            },
            {
                id: "payment-qris",
                title: "QRIS",
                summary: "Bayar dengan e-wallet atau m-banking yang mendukung QRIS.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Pilih \"QRIS\", lalu klik \"Konfirmasi & Bayar\".",
                            "Halaman pembayaran menampilkan kode QR.",
                            "Scan kode QR dengan aplikasi e-wallet atau m-banking, lalu selesaikan pembayaran sebelum batas waktu.",
                        ],
                    },
                    {
                        type: "note",
                        text: "QRIS hanya muncul kalau sedang diaktifkan untuk cabang tersebut.",
                    },
                ],
            },
            {
                id: "payment-sgt",
                title: "Kripto (SGT)",
                summary: "Bayar dengan Singapore Token (SGT) di jaringan Sui.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Pastikan kamu punya Sui wallet (misalnya Slush) dengan saldo SGT yang cukup.",
                            "Pilih \"Kripto\", lalu hubungkan wallet kamu.",
                            "Klik \"Konfirmasi & Bayar\".",
                            "Setujui transaksi di wallet. Jumlah SGT dihitung otomatis dari total Rupiah.",
                            "Setelah transaksi terverifikasi, kamu diarahkan ke halaman pembayaran berhasil.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Kalau kamu menolak transaksi di wallet atau transaksinya gagal, booking belum terbayar. Coba lagi dari halaman pembayaran.",
                    },
                ],
            },
            {
                id: "payment-credit",
                title: "Booking credit",
                summary: "Bayar pakai saldo credit dari refund atau sisa reschedule.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Pilih \"Credit\" sebagai metode pembayaran.",
                            "Klik \"Bayar dengan Credit\". Saldo langsung terpotong dan booking langsung lunas.",
                        ],
                    },
                    {
                        type: "note",
                        text: "Saldo credit harus cukup untuk seluruh total. Kalau kurang, akan muncul info saldo dan kekurangannya. Pilih metode lain untuk melanjutkan.",
                    },
                ],
                cta: { label: "Cek saldo credit", href: "/profile" },
            },
        ],
    },
    {
        id: "manage",
        title: "Mengelola booking",
        topics: [
            {
                id: "manage-status",
                title: "Cek status booking",
                summary: "Semua booking aktif ada di halaman Aktivitas Terkini.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Klik \"Menu\", lalu pilih \"Aktifitas Terkini\".",
                            "Pilih tab Hotel Booking untuk kamar, atau Food Order untuk pesanan makanan.",
                            "Klik salah satu booking untuk melihat detail: kamar, tanggal, pembayaran, dan riwayat status.",
                        ],
                    },
                    {
                        type: "list",
                        title: "Arti status booking",
                        items: [
                            "Pending: menunggu pembayaran.",
                            "Paid: sudah dibayar.",
                            "Confirmed: sudah dikonfirmasi resepsionis di hari kedatangan.",
                            "Checked in / Checked out: kamu sedang menginap / sudah selesai menginap.",
                            "Cancelled: dibatalkan. Kamu bisa mengajukan refund.",
                            "Expired: tidak dibayar sampai batas waktu.",
                        ],
                    },
                ],
                cta: { label: "Buka Aktivitas Terkini", href: "/recent-activity" },
            },
            {
                id: "manage-checkin",
                title: "Check-in & check-out",
                summary: "Check-in dan check-out sendiri dari halaman Aktivitas Terkini.",
                blocks: [
                    {
                        type: "steps",
                        title: "Check-in",
                        items: [
                            "Datang ke hotel di tanggal check-in. Resepsionis akan mengonfirmasi booking kamu (status jadi Confirmed).",
                            "Buka Aktivitas Terkini dan pilih booking tersebut.",
                            "Klik \"Check In\".",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Check-out",
                        items: [
                            "Di tanggal check-out, buka booking kamu di Aktivitas Terkini.",
                            "Klik \"Check Out\".",
                        ],
                    },
                    {
                        type: "note",
                        text: "Tombol Check In hanya aktif di tanggal check-in setelah booking dikonfirmasi resepsionis. Tombol Check Out hanya aktif di tanggal check-out.",
                    },
                ],
            },
            {
                id: "manage-reschedule",
                title: "Reschedule (ganti tanggal)",
                summary: "Pindahkan booking ke tanggal lain tanpa cancel.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Buka Aktivitas Terkini, pilih booking, lalu klik \"Reschedule\".",
                            "Pilih tanggal check-in baru di kalender. Jumlah malam sama dengan booking lama, dan harga per malam tampil di tiap tanggal.",
                            "Klik \"Lanjut ke Konfirmasi\".",
                            "Cek perhitungan: potongan sesuai policy, sisa nilai booking lama, harga booking baru, dan selisihnya. Kamu juga bisa memilih kamar lain di tanggal baru.",
                            "Kalau booking baru lebih mahal, pilih metode pembayaran untuk selisihnya lalu klik \"Konfirmasi & Bayar\". Kalau tidak ada selisih, klik \"Konfirmasi Reschedule\".",
                        ],
                    },
                    {
                        type: "list",
                        title: "Ketentuan",
                        items: [
                            "Hanya booking berstatus Paid atau Confirmed yang bisa di-reschedule, dan tanggal check-in belum lewat.",
                            "Besar potongan tergantung berapa hari sebelum check-in (H-n). Booking yang sudah Confirmed memakai policy hari H.",
                            "Kalau booking baru lebih murah, sisanya otomatis masuk ke saldo booking credit.",
                            "Booking lama tetap berlaku sampai selisih lunas. Kalau selisih tidak dibayar dalam 15 menit, reschedule dibatalkan dan booking lama tidak berubah.",
                            "Satu booking umumnya hanya bisa di-reschedule satu kali.",
                            "Booking dengan lebih dari 1 kamar belum bisa di-reschedule.",
                        ],
                    },
                ],
                cta: { label: "Buka Aktivitas Terkini", href: "/recent-activity" },
            },
            {
                id: "manage-cancel",
                title: "Cancel booking",
                summary: "Batalkan booking dan lihat besar refund sebelum memutuskan.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Buka Aktivitas Terkini, pilih booking, lalu klik \"Cancel Booking\".",
                            "Cek pratinjau: berapa hari sebelum check-in, persentase refund sesuai policy, dan nominal refund.",
                            "Konfirmasi pembatalan. Booking berubah jadi Cancelled dan kamar dilepas.",
                            "Lanjutkan dengan mengajukan refund (lihat topik Refund).",
                        ],
                    },
                    {
                        type: "note",
                        text: "Pratinjau berlaku 15 menit. Kalau lewat, ulangi proses cancel dari awal.",
                    },
                    {
                        type: "warning",
                        text: "Booking yang sedang menunggu pembayaran selisih reschedule tidak bisa di-cancel. Tunggu tagihannya lunas atau kedaluwarsa dulu.",
                    },
                ],
            },
            {
                id: "manage-refund",
                title: "Refund",
                summary: "Ajukan pengembalian dana untuk booking yang sudah di-cancel.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Buka Aktivitas Terkini dan pilih booking yang berstatus Cancelled.",
                            "Klik \"Request Refund\".",
                            "Pilih jenis refund: Credit atau Cash (kalau tersedia), lalu isi alasan.",
                            "Ajukan. Refund diproses setelah disetujui admin.",
                        ],
                    },
                    {
                        type: "list",
                        title: "Credit vs Cash",
                        items: [
                            "Credit: setelah disetujui admin, nominal refund langsung masuk ke saldo booking credit kamu dan berlaku 30 hari.",
                            "Cash: dana dikirim ke rekening setelah disetujui admin, paling cepat 4 hari setelah pengajuan.",
                            "Pilihan Cash hanya muncul kalau policy refund booking tersebut mengizinkan.",
                        ],
                    },
                ],
                cta: { label: "Buka Aktivitas Terkini", href: "/recent-activity" },
            },
            {
                id: "manage-history",
                title: "Riwayat booking",
                summary: "Lihat semua booking yang pernah kamu buat.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Klik \"Menu\", lalu pilih \"Riwayat\".",
                            "Filter berdasarkan status untuk mencari booking tertentu.",
                        ],
                    },
                ],
                cta: { label: "Buka Riwayat", href: "/history" },
            },
        ],
    },
    {
        id: "credit",
        title: "Credit & withdraw",
        topics: [
            {
                id: "credit-balance",
                title: "Booking credit",
                summary: "Saldo yang bisa dipakai untuk booking berikutnya.",
                blocks: [
                    {
                        type: "list",
                        title: "Dari mana credit didapat",
                        items: [
                            "Refund yang kamu pilih dalam bentuk Credit.",
                            "Sisa nilai booking lama saat reschedule ke booking yang lebih murah.",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Cek saldo & riwayat",
                        items: [
                            "Klik \"Menu\", lalu pilih \"Profile\".",
                            "Lihat kartu Booking credit: saldo tersedia dan tanggal \"Berlaku hingga\".",
                            "Klik \"Lihat riwayat kredit\" untuk melihat semua transaksi masuk dan keluar.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Credit berlaku 30 hari sejak terakhir bertambah. Pakai untuk booking atau withdraw sebelum kedaluwarsa.",
                    },
                ],
                cta: { label: "Buka Profile", href: "/profile" },
            },
            {
                id: "credit-withdraw",
                title: "Withdraw credit",
                summary: "Tarik saldo credit ke Sui wallet dalam bentuk SGT.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Buka Profile, lalu klik \"Withdraw\" di kartu Booking credit.",
                            "Pilih metode Crypto, lalu pilih jaringan Sui.",
                            "Isi jumlah dalam Rupiah (minimal Rp 10.000) dan alamat Sui wallet kamu.",
                            "Klik \"Preview Withdraw\" untuk melihat jumlah SGT yang akan kamu terima, kurs, serta saldo sebelum dan sesudah.",
                            "Klik \"Konfirmasi & Submit\".",
                        ],
                    },
                    {
                        type: "list",
                        title: "Ketentuan",
                        items: [
                            "Preview berlaku 10 menit.",
                            "Saldo credit langsung terpotong saat permintaan dikirim.",
                            "SGT dikirim ke wallet kamu setelah permintaan disetujui admin.",
                            "Withdraw dalam bentuk uang tunai belum tersedia.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Pastikan alamat wallet benar. Transaksi kripto yang sudah terkirim tidak bisa dibatalkan.",
                    },
                ],
                cta: { label: "Buka Profile", href: "/profile" },
            },
        ],
    },
    {
        id: "food",
        title: "Pesan makanan",
        topics: [
            {
                id: "food-order",
                title: "Pesan makanan",
                summary: "Pesan makanan dari restoran di hotel dan diantar ke meja kamu.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Buka halaman Food. Dari halaman utama, klik kartu \"The Grand Dining\" di bagian fasilitas.",
                            "Cari menu atau filter berdasarkan kategori dan restoran.",
                            "Tambahkan menu ke keranjang dan atur jumlahnya.",
                            "Buka keranjang, lalu lanjut ke pembayaran.",
                            "Masuk dengan Google kalau belum login.",
                            "Isi lokasi meja (wajib, misalnya \"Meja 3, Lantai 2\") dan catatan kalau ada (alergi, permintaan khusus).",
                            "Lanjutkan ke halaman Midtrans dan pilih metode pembayaran (Virtual Account atau QRIS, sesuai yang tersedia).",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Cek status pesanan",
                        items: [
                            "Klik \"Menu\", lalu pilih \"Aktifitas Terkini\".",
                            "Buka tab Food Order untuk melihat status pesanan dan lokasi meja.",
                        ],
                    },
                ],
                cta: { label: "Pesan makanan", href: "/food" },
            },
        ],
    },
    {
        id: "help",
        title: "Bantuan",
        topics: [
            {
                id: "help-chat",
                title: "Tanya lewat chat",
                summary: "Masih bingung? Tanyakan langsung lewat chat.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Klik ikon chat di pojok kanan bawah halaman.",
                            "Ketik pertanyaan kamu tentang kamar, booking, atau fasilitas hotel.",
                        ],
                    },
                    {
                        type: "tip",
                        text: "Panduan ini bisa dibuka kapan saja lewat \"Menu\", lalu \"Panduan\".",
                    },
                ],
            },
        ],
    },
];

export default idn;
