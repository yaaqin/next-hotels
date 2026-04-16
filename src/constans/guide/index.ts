// ─── Types ────────────────────────────────────────────────────────────────────

export type GuideType = "list" | "note";

export interface GuideItem {
    type: GuideType;
    content: string | string[];
}

export interface Guideline {
    id: string;
    name: string;
    parentId?: string;
    for: ("admin" | "user")[];
    roleScope?: string[];
    guide: GuideItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const simpleGuideline: Guideline[] = [
    {
        id: "g02",
        name: "Booking",
        for: ["user"],
        guide: [
            {
                type: "list",
                content: [
                    "Buka halaman utama, klik Pesan",
                    "Pilih tanggal dan jumlah guest, lalu klik Reserve",
                    "Pilih tipe kamar yang tersedia lalu klik Reserve",
                    "Jika belum login, login terlebih dahulu menggunakan akun Google Anda",
                    "Select room number yang available dan isi form data diri dengan lengkap",
                    "Pilih payment method — jika VA: select nama bank, jika Crypto: pastikan sudah memiliki wallet",
                    "Klik Confirm and Pay",
                ],
            },
            {
                type: "note",
                content:
                    "Untuk pembayaran, pilih guide Payment yang sesuai dengan metode transaksi Anda.",
            },
        ],
    },
    {
        id: "g01",
        name: "Refund",
        for: ["user"],
        guide: [],
    },
    {
        id: "g01-1",
        name: "Refund Cash",
        parentId: "g01",
        for: ["user"],
        guide: [
            {
                type: "list",
                content: [
                    "Dari halaman home klik button menu",
                    "Klik recent activity",
                    "Pilih booking yang sudah di cancel",
                    "Scroll ke bawah lalu klik tombol refund",
                    "Pilih cash lalu ajukan",
                ],
            },
            {
                type: "note",
                content:
                    "Request akan diproses admin, saldo dikirim ke rekening/email.",
            },
        ],
    },
    // {
    //     id: "g01-2",
    //     name: "Refund Crypto",
    //     parentId: "g01",
    //     for: ["user"],
    //     guide: [
    //         {
    //             type: "list",
    //             content: ["Masuk ke wallet", "Klik refund", "Pilih crypto"],
    //         },
    //     ],
    // },
    {
        id: "g03",
        name: "Price Proposal",
        for: ["admin"],
        guide: [
            {
                type: "list",
                content: [
                    "Buka halaman admin",
                    "Pilih menu price proposal",
                    "Isi detail harga dan submit",
                ],
            },
        ],
    },
    {
        id: "g04",
        name: "Facility",
        for: ["admin"],
        guide: [],
    },
    {
        id: "g04-1",
        name: "Create Facility Type",
        parentId: "g04",
        for: ["admin"],
        guide: [
            {
                type: "list",
                content: ["Buka menu facility", "Klik create facility type", "Isi form lalu simpan"],
            },
        ],
    },
    {
        id: "g04-2",
        name: "Create Facility Item",
        parentId: "g04",
        for: ["admin"],
        guide: [
            {
                type: "list",
                content: ["Buka menu facility", "Klik create facility item", "Isi form lalu simpan"],
            },
        ],
    },
    {
        id: "g04-3",
        name: "Create Facility Group",
        parentId: "g04",
        for: ["admin"],
        guide: [
            {
                type: "list",
                content: ["Buka menu facility", "Klik create facility group", "Isi form lalu simpan"],
            },
        ],
    },
    {
        id: "g05",
        name: "Room",
        for: ["admin"],
        guide: [
            {
                type: "list",
                content: ["Buka menu room", "Tambah atau edit kamar sesuai kebutuhan"],
            },
        ],
    },
    // {
    //     id: "g06",
    //     name: "Booking",
    //     for: ["admin"],
    //     guide: [
    //         {
    //             type: "list",
    //             content: ["Lihat daftar booking", "Konfirmasi atau tolak booking"],
    //         },
    //     ],
    // },
    {
        id: "g07",
        name: "Payment",
        for: ["user"],
        guide: [
            {
                type: "note",
                content: "Select guide yang sesuai sama payment method anda",
            },
        ],
    },
    {
        id: "g07-01", 
        parentId: "g07",
        name: "Payment VA",
        for: ["user"],
        guide: [
            {
                type: "list",
                content: [
                    "Klik 'Confirm and Pay' untuk melanjutkan pembayaran",
                    "Anda akan diarahkan ke halaman pembayaran yang berisi nomor Virtual Account (VA) dan tombol pembayaran",
                    "Salin nomor Virtual Account yang tersedia",
                    "Klik tombol 'Bayar Sekarang' untuk menuju halaman pembayaran",
                    "Anda akan diarahkan ke halaman Midtrans", 
                    "Paste nomor Virtual Account yang sudah disalin",
                    "Klik tombol 'Inquire' untuk mengecek tagihan",
                    "Klik 'Pay' untuk menyelesaikan pembayaran",
                    "Setelah pembayaran berhasil, booking room akan otomatis terkonfirmasi",
                    "Anda dapat mengecek status booking di halaman 'Recent Activity'"
                ]
            }
        ]
    },
    {
  id: "g07-02",
  parentId: "g07",
  name: "Payment QRIS",
  for: ["user"],
  guide: [
    {
      type: "list",
      content: [
        "Klik 'Confirm and Pay' untuk melanjutkan pembayaran",
        "Anda akan diarahkan ke halaman pembayaran yang menampilkan QRIS (image URL) dan tombol pembayaran",
        "Salin URL QRIS yang tersedia",
        "Klik tombol 'Bayar Sekarang' untuk menuju halaman pembayaran",
        "Anda akan diarahkan ke halaman Midtrans",
        "Paste URL QRIS yang sudah disalin",
        "Klik 'Scan QR' untuk memproses QRIS",
        "Pilih issuer / e-wallet yang sesuai (disarankan selain GoPay)",
        "Lanjutkan pembayaran sesuai instruksi yang muncul",
        "Setelah pembayaran berhasil, booking room akan otomatis terkonfirmasi",
        "Cek status booking di halaman 'Recent Activity'"
      ]
    },
    // {
    //   type: "warning",
    //   content:
    //     "Metode pembayaran QRIS ini terkadang mengalami kegagalan. Jika pembayaran tidak berhasil, Anda dapat mencoba kembali dengan membuat transaksi baru."
    // },
    {
      type: "note",
      content:
        "Beberapa issuer seperti GoPay mungkin tidak selalu tersedia. Disarankan menggunakan Dana, ShopeePay, atau e-wallet lainnya."
    }
  ]
}
];