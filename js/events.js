/* Events shown in the calendar.
   Weekly activities as published by the organizations themselves and by Sociale Kaart Den Haag (checked November 2026).
   Add or edit entries here; the calendar, filters and upcoming lists update automatically.
   date: YYYY-MM-DD for a one-off event, or weekly: 0 (Monday) … 6 (Sunday) for a weekly activity.
   org: key from KV_ORGS. category: used by the calendar's Category filter. */
window.KV_ORGS = {
  vbl:       { name: "VrouwenBuurtLab Laak", badge: "assets/img/home/event-dot-pink.svg", color: "#dd5c90", route: "org-vbl" },
  reva:      { name: "ReVa Moeders",         badge: "assets/img/home/event-dot-3.svg",    color: "#c8a2f0", route: "org-reva" },
  bulgaarse: { name: "Bulgaarse Club Laak",  color: "#ffa62b", route: "map" },
  mar:       { name: "Zwemvereniging MAR",   color: "#39abba", route: "map" },
  polka:     { name: "POLKA",                color: "#8f6fd0", route: "map" },
  moerwijk:  { name: "Moerwijk Moeders",     color: "#b2b425", route: "map" }
};

var VAN_MEURS = "Van Meursstraat 1, Den Haag";

window.KV_EVENTS = [
  // VrouwenBuurtLab Laak (vrouwenbuurtlab.nl, Sociale Kaart Den Haag)
  { weekly: 0, title: "Sewing Lessons", org: "vbl", category: "Courses", time: "9:00 - 12:00", location: VAN_MEURS, description: "Learn to sew step by step." },
  { weekly: 1, title: "Pilates", org: "vbl", category: "Health & sport", time: "20:30 - 21:30", location: VAN_MEURS },
  { weekly: 2, title: "Advanced Sewing", org: "vbl", category: "Courses", time: "9:00 - 12:00", location: VAN_MEURS, description: "Followed by a clothing repair hour from 12:30 to 13:30." },
  { weekly: 2, title: "Slow Fitness", org: "vbl", category: "Health & sport", time: "11:30 - 12:30", location: VAN_MEURS, description: "Gentle exercise for every level with Beweegpraktijk." },
  { weekly: 3, title: "Happy Women", org: "vbl", category: "Health & sport", time: "9:00 - 11:30", location: VAN_MEURS, description: "A weekly meeting on health themes for women, organised with Wijkz and GGD Haaglanden." },
  { weekly: 3, title: "Kickboxing", org: "vbl", category: "Health & sport", time: "19:30 - 20:30", location: VAN_MEURS },
  { weekly: 4, title: "Dutch Conversation Group", org: "vbl", category: "Courses", time: "11:00 - 12:30", location: VAN_MEURS, description: "Praatgroep ABC: practise speaking Dutch in a relaxed group." },

  // Bulgaarse Club Laak (Sociale Kaart Den Haag)
  { weekly: 2, title: "Drop-in Hour", org: "bulgaarse", category: "Advice", time: "10:00 - 12:00", location: "Buurtkamer Spoorwijk, Goeverneurplein 8, Den Haag", description: "Practical questions about work, language courses, healthcare costs, letters or school enrolment. Closed during school holidays." },

  // Zwemvereniging MAR (zwemmenmar.nl, season 2026-27)
  { weekly: 1, title: "Mother & Child Swimming", org: "mar", category: "Health & sport", time: "15:45 - 17:00", location: "Zwembad De Houtzagerij, Den Haag", description: "Swimming together with your child (boys up to 6)." },
  { weekly: 2, title: "Women’s Swimming & Aqua", org: "mar", category: "Health & sport", time: "18:30 - 20:30", location: "Zwembad Zuiderpark, Den Haag", description: "Women-only swimming lessons, free swimming and aqua class." },
  { weekly: 4, title: "Women’s Swimming", org: "mar", category: "Health & sport", time: "19:00 - 22:00", location: "Zwembad De Houtzagerij, Den Haag", description: "Women-only lessons with female instructors, lane swimming and aqua class." },

  // POLKA (Sociale Kaart Den Haag)
  { weekly: 4, title: "Friday Meeting for Polish Women", org: "polka", category: "Culture", time: "18:30 - 22:00", location: "Wijkcentrum De Regenvalk, Regentesseplein 148, Den Haag" },

  // Moerwijk Moeders (Den Haag FM, 2023)
  { weekly: 1, title: "Mothers’ Breakfast", org: "moerwijk", category: "Activities", description: "A weekly breakfast for mothers in Moerwijk." },

  // One-off events published by the organizations
  { date: "2026-11-28", title: "Mikołajki (Polish Sinterklaas)", org: "polka", category: "Culture", description: "Event announced on polkacentrum.nl." }
];

/* Month the calendar opens on, e.g. "2026-01". null = the current month. */
window.KV_CALENDAR_START = null;
