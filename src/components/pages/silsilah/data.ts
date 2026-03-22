// ── Types ──────────────────────────────────────────────────────────────────
export interface FamilyMember {
    id: string;
    name: string;
    spouse: string | null;
    children: FamilyMember[];
}

export const familyData: FamilyMember = {
    id: "mastuni",
    name: "Mastuni",
    spouse: "TB Abdurrahman",
    children: [
        {
            id: "tuasiah",
            name: "Tuasiah",
            spouse: "Sadiran",
            children: [
                {
                    id: "suarsih",
                    name: "Suarsih",
                    spouse: "Bekti",
                    children: [
                        {
                            id: "Anita",
                            name: "Anita Maharani",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "pradiptia",
                            name: "Pradiptia Ningrum Pramesti",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Masturinah",
                    name: "Masturinah",
                    spouse: "Junaedi",
                    children: [
                        {
                            id: "asfa-pramudita",
                            name: "Asfa Andarina Pramudita",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "qizza-amara",
                            name: "Qizza Amara Azzilah",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "muizz-rafassya",
                            name: "Al Mu'izz Rafassya ",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "rusmiyati-ardi",
                    name: "Rusmiyati",
                    spouse: 'Ardi Firmansyah',
                    children: [
                        {
                            id: "Nizam-Fairuz",
                            name: "Muhammad Nizam Fairuz",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Ashilatun-Nadhifah",
                            name: "Ashilatun Nadhifah",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Muhammad-Nabhan",
                            name: "Muhammad Nabhan",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "sirojudin",
                    name: "Muhammad Sirojudin",
                    spouse: 'Yurnita',
                    children: [
                        {
                            id: "Fayha-Raffi-Faturifda",
                            name: "Fayha Raffi Faturifda",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Zelin-Sashi-Kirana",
                            name: "Zelin Sashi Kirana",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "zea",
                            name: "Zea",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Aprilia ",
                    name: "Aprilia ",
                    spouse: 'Muhammad Rosadi Chaeri',
                    children: [
                        {
                            id: "Muhammad-Khoiru-Ziyad ",
                            name: "Muhammad Khoiru Ziyad ",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Zelia-Nayla ",
                            name: "Zelia Nayla ",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: "turahmah",
            name: "Turahmah",
            spouse: "Hurbi",
            children: [
                {
                    id: "Rahendi",
                    name: "Rahendi",
                    spouse: null,
                    children: [
                        {
                            id: "Raras",
                            name: "Raras",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Arsyad",
                            name: "Arsyad",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Jojon",
                    name: "Jojon",
                    spouse: 'Salamah',
                    children: [
                        {
                            id: "Erfa ",
                            name: "Erfa ",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Aldiansyah",
                            name: "Aldiansyah",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Rahi-budin",
                    name: "Rahi budin",
                    spouse: 'Nuryana',
                    children: [
                        {
                            id: "Boy",
                            name: "Boy",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Raisa",
                            name: "Raisa",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Rahman-subanda",
                    name: "Rahman subanda",
                    spouse: 'suliyati',
                    children: [
                        {
                            id: "marsya",
                            name: "Marsya",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Panji",
                            name: "Panji",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Uwan",
                    name: "Uwan",
                    spouse: 'iren',
                    children: [
                        {
                            id: "Ikram",
                            name: "Ikram",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "Alfi",
                            name: "Alfi",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "rapiya-putri",
                            name: "Rapiya Putri",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Rais-jayanton",
                    name: "Rais Jayanton",
                    spouse: null,
                    children: [
                        {
                            id: "Jia-yasmin",
                            name: "Jia yasmin",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Hani-Santika",
                    name: "Hani Santika",
                    spouse: 'Helmi',
                    children: [],
                },
            ],
        },
        {
            id: "tb-yazid",
            name: "TB Yazid Bustomi",
            spouse: "Nurjannah",
            children: [
                {
                    id: "Ernawati",
                    name: "Ernawati",
                    spouse: "Andry Setiawan",
                    children: [
                        {
                            id: "ahmanda",
                            name: "Ahmanda Novita Sari",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "eza-radiya",
                            name: "Eza radiya Pratama",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "el-mira",
                            name: "El Mira aiza adryani",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "Sarifudin",
                    name: "Sarifudin",
                    spouse: "Mela sari",
                    children: [
                        {
                            id: "muhamamad-Rizki-maulana",
                            name: "muhamamad Rizki maulana",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: "tuhadijah",
            name: "Tuhadijah",
            spouse: "Aliyudin",
            children: [
                {
                    id: "andi-suparman",
                    name: "Andi Suparman",
                    spouse: "Tati Aliati",
                    children: [
                        {
                            id: "hanan",
                            name: "Muhammad Hanan Taufiqurrahman",
                            spouse: null,
                            children: [],
                        },
                        {
                            id: "habil",
                            name: "Muhammad Habil Attamam",
                            spouse: null,
                            children: [],
                        },
                    ],
                },
                {
                    id: "ainul-yakin",
                    name: "Ainul Yakin",
                    spouse: null,
                    children: [],
                },
            ],
        },
        {
            id: "tb-nuhri",
            name: "TB Muhammad Nuhri",
            spouse: "Milatuzakiyah",
            children: [
                {
                    id: "tb-nuriyan",
                    name: "TB Nuriyan Ardho Sholah",
                    spouse: null,
                    children: [],
                },
                {
                    id: "Ratu-bilqis-ramadhani",
                    name: "Ratu Bilqis Ramadhani",
                    spouse: null,
                    children: [],
                },
                {
                    id: "tb-m-yusuf",
                    name: "TB M Yusuf Al Ardhabilli",
                    spouse: null,
                    children: [],
                },
            ],
        },
        {
            id: "tb-jahri",
            name: "TB Muhammad Jahri",
            spouse: "Tukinah",
            children: [
                {
                    id: "tb-baung",
                    name: "TB Misbahul Anam",
                    spouse: null,
                    children: [],
                },
                {
                    id: "tb-iyung",
                    name: "TB Khoirul Abror",
                    spouse: null,
                    children: [],
                },
                {
                    id: "kiya kiyut",
                    name: "Ratu Hasna Azkiya",
                    spouse: null,
                    children: [],
                },
            ],
        },
        {
            id: "tb-fattah",
            name: "TB Abdul Fattah",
            spouse: "Pipit Karlina",
            children: [
                {
                    id: "dayyan",
                    name: "Muhammad dayyan fatah",
                    spouse: null,
                    children: [],
                },
            ],
        },
    ],
};