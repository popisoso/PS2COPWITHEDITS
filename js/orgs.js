/* Organizations shown on the Community Map (#map).
   Edit this file to add or update an organization. Any field left as null shows a
   [text] placeholder on the page, so missing information is easy to spot and fill in.

   Fields
     id         short unique key
     name       display name
     route      route of a full organization page on this site (e.g. "org-vbl"), or null
     hood       neighbourhood id (see KV_HOODS in js/map.js); null = location not confirmed (not shown on the map)
     x, y       position of the flower on the map (0–1000 across, 0–560 down)
     purpose    flower colour: "connect" (Meet & connect), "learn" (Learn & grow), "support" (Support)
     type       kind of organization
     reach      who they reach      themes  what they do      languages  languages spoken
     tagline    one line            about   a short paragraph
     address, website, email, phone   public contact details published by the organization itself
     stories    [{ quote, by }] success stories from members (null = placeholder, to be collected)
     logo       image shown in the heart of the flower
     since      year founded (sinceApprox: true = about that year)
     impact     [{ n, label }] key figures, from the sources below
     awards     recognition received        highlight  one-sentence impact story, from the sources below
     sources    where the information comes from (for editors; not shown on the page)

   Content checked against public sources in November 2026. CoP members according to
   De Haagse Hogeschool's step-by-step plans: VrouwenBuurtLab Laak, ReVa Moeders, Stichting
   Jemeniyaat, Coöperatie Eva, Amal Coaching, Stichting Joury, Bulgaarse Club Laak,
   Moerwijk Moeders and Laak Ladies United.
*/
window.KV_MAP_ORGS = [
  {
    id: "vbl", name: "VrouwenBuurtLab Laak", route: "org-vbl", hood: "laak", x: 620, y: 362, purpose: "connect",
    type: "Community organisation", reach: ["Women"], themes: ["Meet & connect", "Learn & grow", "Health & sport"], languages: ["Dutch"],
    tagline: "A meeting centre in Laak for and by women: meet, discover, develop.",
    about: "VrouwenBuurtLab is a meeting centre in Laak for, and run by, women from the neighbourhood. It starts from women's possibilities, qualities and talents rather than their problems, and aims to be a safe, welcoming second home. Through workshops, courses, creative lessons, sport and shared meals, women are guided step by step towards, for example, training or a job. The centre was thought up by local women and is supported by the welfare organisation Wijkz. It opened on 4 February 2022 in the former neighbourhood and church centre De Oase, near community centre De Wissel.",
    address: "Van Meursstraat 1, 2524 XN Den Haag", website: "https://vrouwenbuurtlab.nl/", email: "vrouwenbuurtlab@wijkz.nl", phone: "06 85782987",
    stories: null,
    logo: "assets/img/home/pin-6-c.png",
    since: 2022,
    impact: [{"n": "7", "label": "weekly activities"}],
    highlight: "A meeting centre thought up by women from Laak themselves: open every weekday morning for coffee, a chat and a next step towards training or work.",
    sources: ["https://vrouwenbuurtlab.nl/", "https://wijkz.nl/vrouwenbuurtlab/"]
  },
  {
    id: "reva", name: "ReVa Moeders", route: "org-reva", hood: "segbroek", x: 362, y: 246, purpose: "learn",
    type: "Foundation", reach: ["Mothers", "Families"], themes: ["Learn & grow", "Support"], languages: null,
    tagline: "Neighbourhood mothers in the Regentesse- and Valkenboskwartier who connect residents through low-threshold activities.",
    about: "ReVa Moeders started in 2022 as a small group of mothers in the ReVa area (Regentesse- and Valkenboskwartier) of Segbroek and became a foundation in January 2024. The group now has about 40 women. It connects neighbourhood residents with low-threshold activities that encourage participation and personal development, such as weekly language classes, sewing classes and homework support, and it hands out meals to families with little money. In 2024 the group received a Gulden Klinker for its social activities in the neighbourhood.",
    address: null, website: null, email: null, phone: null,
    stories: null,
    logo: "assets/img/home/pin-2-c.png",
    since: 2022,
    impact: [{"n": "~40", "label": "women in the group"}],
    awards: ["Gulden Klinker 2024"],
    highlight: "When mothers couldn't join the language class for lack of childcare, ReVa Moeders made room for their children too.",
    sources: ["https://www.haagsevrouwendagen.nl/tentoonstelling", "https://konkreetnieuws.nl/2024/05/gulden-klinker-bij-het-kamerlingh-onnesplein-voor-de-de-reva-moeders/"]
  },
  {
    id: "jemeniyaat", name: "Stichting Jemeniyaat", route: null, hood: null, x: null, y: null, purpose: "connect",
    type: "Foundation", reach: ["Women", "Newcomers"], themes: ["Meet & connect", "Learn & grow"], languages: null,
    tagline: "An initiative by and for Yemeni women in The Hague.",
    about: "Stichting Jemeniyaat (also written Yemeniyaat) is an initiative by and for Yemeni women in The Hague. It offers a safe space where women — mothers, students and newcomers to the city — can meet, support one another and overcome language and cultural barriers. It promotes social integration and empowerment through workshops, lectures and events.",
    address: null, website: null, email: null, phone: null, stories: null,
    highlight: "A safe space where Yemeni women (mothers, students and newcomers) help each other past language and cultural barriers.",
    sources: ["https://haagsestadmakers.nl/samenvatting-van-de-sessies/"]
  },
  {
    id: "eva", name: "Coöperatie Eva", route: null, hood: "centrum", x: 580, y: 206, purpose: "support",
    type: "Cooperative", reach: ["Women"], themes: ["Support", "Learn & grow"], languages: null,
    tagline: "A social cooperative supporting women on the way to economic independence.",
    about: "Coöperatie Eva is a social cooperative that brings women with a passion for entrepreneurship closer to the labour market. Women can run their business through Eva while keeping their benefits, and invest what they earn in training or in the business. Eva helps with administration, marketing and premises, and encourages members to work together and use each other's talents. Members have roots in many countries and run businesses such as a hair and beauty salon, coaching, catering, jewellery and children's theatre.",
    address: "Buitenom 6, 2512 BH Den Haag", website: "https://www.cooperatie-eva.nl/", email: "cooperatie.eva@gmail.com", phone: null,
    stories: null,
    logo: "assets/img/home/pin-3-c.png",
    since: 2018,
    impact: [{"n": "6+", "label": "countries of origin among members"}],
    highlight: "Women build their own business, from a hair salon to catering, coaching and children's theatre, while keeping their benefits.",
    sources: ["https://www.cooperatie-eva.nl/", "https://www.cooperatie-eva.nl/Contact"]
  },
  {
    id: "amal", name: "Amal Coaching", route: null, hood: null, x: null, y: null, purpose: "support",
    type: "Coaching practice", reach: ["Women"], themes: ["Support"], languages: null,
    tagline: null, about: null, address: null, website: null, email: null, phone: null, stories: null,
    logo: "assets/img/home/pin-5-c.png",
    sources: ["https://www.dehaagsehogeschool.nl/media/stappenplan-1-het-vinden-van-een-locatie"]
  },
  {
    id: "happy", name: "Happy Women Laak", route: null, hood: "laak", x: 598, y: 404, purpose: "connect",
    type: "Women's group", reach: ["Women"], themes: ["Health & sport", "Meet & connect"], languages: null,
    tagline: "A weekly meeting on health themes for women, at the VrouwenBuurtLab.",
    about: "Happy Women Laak is a weekly meeting for women on health themes such as menopause, sleep, self-love and setting boundaries. It takes place at the VrouwenBuurtLab in Laak and is organised with Wijkz and GGD Haaglanden.",
    address: "Van Meursstraat 1, 2524 XN Den Haag", website: null, email: "vrouwenbuurtlab@wijkz.nl", phone: null, stories: null,
    logo: "assets/img/home/pin-6-c.png",
    sources: ["https://www.denhaagdoet.nl/o/Stichting-MOOI-Cromvlietplein/activiteiten/Het-VrouwenBuurtLab-zoekt-vrouwen-voor-Happy-Woman-project/112233"]
  },
  {
    id: "klup", name: "Stichting de Talentenklup", route: null, hood: "centrum", x: 458, y: 306, purpose: "learn",
    type: "Foundation", reach: ["Children", "Families"], themes: ["Learn & grow"], languages: null,
    tagline: "Play-based pre-school for all children aged 2.5 to 4.",
    about: "De Talentenklup runs a day nursery, pre-school and after-school care at several locations in The Hague. Its pre-school is an early-childhood education setting open to all children aged 2.5 to 4, where children learn through play, discovery and doing, in a safe and familiar environment and at their own pace. Children with (emerging) language or developmental delays get extra support.",
    address: "Van Mierisstraat 226, 2526 NW Den Haag", website: "https://talentenklup.nl/", email: null, phone: "070 369 9332",
    stories: null,
    logo: "assets/img/home/pin-4-c.png",
    impact: [{"n": "4", "label": "pre-school locations"}],
    sources: ["https://talentenklup.nl/", "https://talentenklup.nl/contact"]
  },
  {
    id: "wijkz", name: "Wijkz", route: null, hood: "rijswijk", x: 640, y: 470, purpose: "support",
    type: "Welfare organisation", reach: ["Women", "Families", "Youth", "Seniors"], themes: ["Support", "Meet & connect"], languages: null,
    tagline: "The welfare organisation of The Hague, working with residents in seven city districts.",
    about: "Wijkz works with residents in seven districts of The Hague to keep the city liveable. Community workers and youth workers go from local community centres into the neighbourhoods to get to know residents. In Laak, Wijkz supports the VrouwenBuurtLab, a meeting centre that women designed and run themselves.",
    address: "Laan van Zuidhoorn 14, 2289 DE Rijswijk", website: "https://wijkz.nl/", email: null, phone: "070 205 20 00",
    stories: null,
    logo: "assets/img/home/pin-7-c.png",
    impact: [{"n": "900", "label": "volunteers"}, {"n": "37", "label": "locations"}],
    highlight: "In Laak, Wijkz backs a meeting centre that women designed and run themselves.",
    sources: ["https://wijkz.nl/", "https://wijkz.nl/contact/"]
  },
  {
    id: "polka", name: "POLKA – Centre for Polish Women", route: null, hood: "segbroek", x: 298, y: 196, purpose: "connect",
    type: "Foundation", reach: ["Women", "Newcomers"], themes: ["Meet & connect", "Learn & grow", "Culture"], languages: ["Polish", "Dutch"],
    tagline: "A volunteer-run centre that informs, activates and supports Polish women in The Hague.",
    about: "POLKA was founded in October 2018 by Polish women in The Hague, together with the Segbroek district, and became a foundation in December 2020. Its aim is to make life in the Netherlands easier for Polish women, help them feel at home quickly and let them grow personally and professionally. Women come for information, inspiration, language practice, talks, or simply to spend time together. POLKA organises themed meetings, workshops, trainings, city tours, sport, a book club and information sessions on topics such as education, healthcare, tenants' rights and finding work.",
    address: "Wijkcentrum De Regenvalk, Regentesseplein 148, 2562 EN Den Haag", website: "https://polkacentrum.nl/", email: "info@polkacentrum.nl", phone: null,
    stories: null,
    logo: "assets/img/home/pin-1-c.png",
    since: 2018,
    impact: [{"n": "~5,000", "label": "women in its online community"}, {"n": "39", "label": "volunteers"}],
    awards: ["Kartiniprijs 2021", "Haagse Kracht Award 2019"],
    highlight: "From a small group of volunteers in 2018 to a community of almost 5,000 Polish women in the Netherlands.",
    sources: ["https://polkacentrum.nl/", "https://polkacentrum.nl/over-ons/"]
  },
  {
    id: "mar", name: "Zwemvereniging MAR", route: null, hood: "centrum", x: 442, y: 200, purpose: "connect",
    type: "Club / association", reach: ["Women", "Mothers", "Children"], themes: ["Health & sport"], languages: null,
    tagline: "Swimming lessons, free swimming and aqua classes — including women-only sessions with female instructors.",
    about: "For MAR, swimming is more than exercise: it is about confidence, pushing boundaries and personal development. The club offers swimming lessons in an atmosphere of respect, calm and structure at Zwembad De Houtzagerij and Zwembad Zuiderpark, with women-only swimming (with female instructors on Fridays), mother-and-child swimming and men's swimming. Ooievaarspas holders pay reduced rates.",
    address: "Hobbemastraat 93, 2526 JG Den Haag", website: "https://zwemmenmar.nl/", email: "info@zwemmenmar.nl", phone: null,
    stories: null,
    logo: "assets/img/organizations/zwemvereniging-mar.jpg",
    impact: [{"n": "3", "label": "weekly sessions for women and mothers"}],
    highlight: "Women-only swimming with female instructors, so every woman can feel safe, free and confident in the water.",
    sources: ["https://zwemmenmar.nl/", "https://zwemmenmar.nl/zwemaanbod-locaties/"]
  },
  {
    id: "joury", name: "Stichting Joury", route: null, hood: null, x: null, y: null, purpose: "support",
    type: "Foundation", reach: ["Women", "Children", "Youth", "Newcomers"], themes: ["Support", "Learn & grow"], languages: null,
    tagline: "A safe and trusted environment where women, children and young people with a migrant background can grow.",
    about: "Stichting Joury was founded in 2017 to help newcomers to the Netherlands integrate and to support women's emancipation. Its volunteers speak the newcomers' language and know from their own experience what it is like to be new in a city, so they can give information in people's own language. Joury focuses on intensive social support, and organises activities, events, workshops and meetings for children, young people and women.",
    address: "Televisiestraat 4, Den Haag", website: "https://stichtingjoury.nl/", email: "stichtingjoury@gmail.com", phone: null,
    stories: null,
    logo: "assets/img/organizations/stichting-joury.jpg",
    since: 2017,
    impact: [{"n": "5+", "label": "locations"}],
    highlight: "Volunteers who were once newcomers themselves now guide others through their first years in the city, in their own language.",
    sources: ["https://stichtingjoury.nl/", "https://stichtingjoury.nl/contact/"]
  },
  {
    id: "bulgaarse", name: "Bulgaarse Club Laak", route: null, hood: "laak", x: 668, y: 392, purpose: "support",
    type: "Foundation", reach: ["Newcomers", "Families", "Mothers"], themes: ["Support", "Culture"], languages: ["Bulgarian"],
    tagline: "A home base for the Bulgarian community in Laak and a bridge to Dutch society.",
    about: "Bulgaarse Club Laak is a volunteer-run foundation for the Bulgarian community in Laak. At the weekly drop-in, volunteers help with practical questions about work, language courses, healthcare costs, official letters and school enrolment, and refer people to the right services. Cultural activities such as the Baba Marta spring festival and folk dancing build trust and bring neighbours together. Everyone is welcome.",
    address: "Buurtkamer Spoorwijk, Goeverneurplein 8, 2523 EB Den Haag", website: null, email: "bulgaarseclublaak@gmail.com", phone: null,
    stories: null,
    logo: "assets/img/organizations/bulgaarse-club-laak.png",
    since: 2018,
    sinceApprox: true,
    impact: [{"n": "~30", "label": "dancers per folk-dance lesson"}],
    highlight: "Every Wednesday, volunteers help Bulgarian neighbours with letters, work, healthcare costs and school enrolment.",
    sources: ["https://socialekaartdenhaag.nl/organisaties/bulgaarse-club-laak/", "https://www.denhaag.nl/nl/stadsdelen/laak/actieplan-laak/verhalen-uit-laak/veska-en-svetlana-vrijwilligers-bulgaarse-club-laak/"]
  },
  {
    id: "moerwijk", name: "Moerwijk Moeders", route: null, hood: "escamp", x: 486, y: 404, purpose: "connect",
    type: "Women's group", reach: ["Mothers", "Children"], themes: ["Meet & connect", "Learn & grow", "Health & sport"], languages: null,
    tagline: "Free, low-threshold activities and a place to meet for mothers in Moerwijk.",
    about: "Moerwijk Moeders works for the wellbeing and empowerment of women, especially mothers, in Moerwijk. It aims to be a supportive, inclusive place where mothers from every background can meet, connect and inspire each other. Activities cover personal development, health, parenting and social integration, from a weekly mothers' breakfast to creative workshops and sport. Its Mini & Maxi Café offers reading hours, toddler gym, music and advice from youth nurses.",
    address: "Heeswijkplein 160, 2531 HK Den Haag", website: "https://www.moerwijkmoeders.nl/", email: null, phone: null,
    stories: null,
    logo: "assets/img/organizations/moerwijk-moeders.png",
    since: 2021,
    sinceApprox: true,
    impact: [{"n": "~80", "label": "women taking part each week"}],
    highlight: "Around 80 women take part every week, from the mothers' breakfast to toddler gym at the Mini & Maxi Café.",
    sources: ["https://www.moerwijkmoeders.nl/", "https://npzw.nl/mini-maxi-cafe/"]
  },
  {
    id: "ladies", name: "Laak Ladies United", route: null, hood: "laak", x: 572, y: 352, purpose: "connect",
    type: "Club / association", reach: ["Women"], themes: ["Health & sport", "Meet & connect"], languages: null,
    tagline: "Getting women moving through sport and social activities.",
    about: null, address: null, website: null, email: null, phone: null, stories: null,
    logo: "assets/img/organizations/laak-ladies-united.png",
    sources: ["https://www.dehaagsehogeschool.nl/media/stappenplan-1-het-vinden-van-een-locatie"]
  }
];
