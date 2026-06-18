// ════════════════════════════════════════════════════════════════════════
// CATEGORY_KEYWORD_MAP
// Used to decide WHICH specific DB category(ies) a fetched Google Place
// belongs to, once it has already been found via a broad MAX_COVERAGE_GROUPS
// query. Keywords are matched as lowercase substrings against the place's
// displayName.
//
// ⚠️ Two gaps from the original map have been fixed here:
//   1. "law-coaching" existed in the selectedCategories list (main script)
//      but had NO entry here at all → it could never be matched.
//   2. "class-1-tuition" through "class-12-tuition" (12 categories) also
//      existed in selectedCategories but had ZERO keyword entries.
// Both are added below. See the note on tuition categories near the bottom
// — keyword matching for *which grade* a tuition centre teaches is
// inherently unreliable from a place name alone (most just say "Tuition
// Classes" with no class number), so the fallback behaviour in
// categorizePlace() matters a lot for these.
// ════════════════════════════════════════════════════════════════════════

export const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  // 1. Higher Competitive Exams
  "jee-coaching": ["jee", "iit", "mains", "advanced", "engineering entrance", "btech prep", "allen", "fiitjee", "resonance", "vidyamandir", "vibrant", "physics wallah", "jee coaching", "jee main", "jee advanced coaching", "engineering entrance institute"],
  "neet-coaching": ["neet", "aiims", "medical entrance", "aipmt", "biology classes", "aakash", "pulse", "doctor prep", "mbbs coaching", "neet ug", "medical coaching institute", "pre medical"],
  "upsc-coaching": ["upsc", "ias", "civil services", "ips", "ifs", "drishti", "vajiram", "vision ias", "chahal", "sriram", "civil service academy", "civil services academy", "ias academy", "upsc cse"],
  "state-pcs-coaching": ["pcs", "ras", "bpsc", "uppsc", "mppsc", "jpsc", "rpsc", "state services", "administrative services", "state civil services", "pcs coaching institute"],
  "cat-coaching": ["cat coaching", "mba entrance", "iim coaching", "time institute", "ims", "career launcher", "xat", "snap", "mat coaching", "mba coaching institute", "management entrance coaching"],
  "clat-coaching": ["clat", "law entrance", "nlu", "legaledge", "law prep", "ailet", "lsat", "national law university entrance", "law cet"],
  "gate-coaching": ["gate coaching", "ies master", "made easy", "ace academy", "psu coaching", "gate exam coaching", "psu recruitment"],
  "ca-coaching": ["ca coaching", "chartered accountant", "icai", "cpt", "ipcc", "ca foundation", "ca final", "jk shah", "ca intermediate", "ca articleship classes"],
  "cs-coaching": ["cs coaching", "company secretary", "icsi", "cs executive", "cs professional"],
  "cma-coaching": ["cma coaching", "cost management accountant", "icwai", "cma intermediate", "cma final coaching"],
  "judiciary-coaching": ["judiciary", "judge entrance", "clat pg", "pcs j", "civil judge coaching", "judicial services exam", "munsif coaching"],
  "law-coaching": ["law coaching", "llb entrance", "llb coaching", "law entrance exam", "law college entrance", "legal studies academy", "legal studies coaching", "law cet coaching", "law academy"],

  // 2. National, Defence & Study Abroad
  "cuet-coaching": ["cuet", "cucet", "university entrance", "college entrance", "central university entrance test", "cuet ug", "cuet pg"],
  "ielts-coaching": ["ielts", "toefl", "pte", "study abroad", "visa consultancy", "idp", "british council", "overseas education", "ielts academy", "ielts training center"],
  "gre-coaching": ["gre", "gmat", "sat coaching", "study in usa", "gmat coaching", "gre prep institute"],
  "sat-coaching": ["sat preparation", "sat classes", "sat prep institute", "sat exam coaching"],
  "ugc-net-coaching": ["ugc net", "jrf coaching", "national eligibility test", "net jrf coaching", "assistant professor exam"],
  "csir-net-coaching": ["csir net", "csir life science", "csir chemical", "csir net coaching institute"],
  "ctet-coaching": ["ctet", "reet", "uptet", "stet", "teachers eligibility", "prt coaching", "tgt pgt", "ctet exam coaching", "primary teacher exam"],
  "tet-coaching": ["tet exam", "htet", "btet", "tet exam coaching"],
  "nda-coaching": ["nda", "cds", "ssb interview", "airforce exam", "navy coaching", "national defence", "army exam", "nda exam coaching", "ssb interview coaching"],
  "afcat-coaching": ["afcat", "air force common admission", "afcat exam coaching", "air force exam coaching"],
  "defence-coaching": ["defence coaching", "sainik school prep", "military academy", "rimc", "navodaya", "armed forces coaching", "agniveer coaching"],

  // 3. Govt Job Exams
  "ssc-coaching": ["ssc ", "cgl", "chsl", "mts", "cpo", "staff selection", "paramount", "kd campus", "ssc coaching", "ssc exam coaching", "ssc je coaching"],
  "banking-coaching": ["banking", "ibps", "sbi po", "clerk coaching", "bank po", "rbi assistant", "mahendras", "bank exam", "bank exam coaching institute", "banking academy"],
  "railway-coaching": ["railway exam", "rrb", "ntpc", "loco pilot", "group d", "railway recruitment", "railway exam coaching institute"],

  // 4. IT, Coding & Digital Media
  "coding-classes": ["coding", "programming", "java", "python", "full stack", "software training", "web development", "c++", "mern stack", "data science", "machine learning", "python classes", "react js training", "software development course", "computer coaching"],
  "cyber-security-training": ["cyber security", "ethical hacking", "ceh", "networking", "ccna", "ccnp", "information security", "cyber security course", "penetration testing course"],
  "aws-training": ["aws", "devops", "cloud computing", "azure", "gcp training", "cloud training institute", "aws certification course"],
  "ui-ux-design": ["ui ux", "user interface", "product design", "figma classes", "user experience", "ui ux course", "design thinking course"],
  "graphic-design": ["graphic design", "photoshop", "illustrator", "coreldraw", "indesign", "graphic institute", "graphic design course", "logo design classes"],
  "video-editing": ["video editing", "premiere pro", "after effects", "final cut", "film making", "video editing course", "video production classes"],
  "animation-vfx": ["animation", "vfx", "3d max", "maya", "multimedia institute", "arena animation", "maac", "animation course", "vfx institute"],
  "digital-marketing": ["digital marketing", "seo", "social media marketing", "smo", "ppc", "google ads", "performance marketing", "digital marketing course", "online marketing institute"],
  "robotics-classes": ["robotics", "arduino", "stem learning", "iot classes", "robotics for kids", "stem lab", "coding and robotics", "drone making"],

  // 5. Professional & Skill Development
  "sales-training": ["sales training", "corporate skills", "marketing training", "b2b sales", "sales coaching institute"],
  "hr-training": ["hr training", "human resource management", "payroll training", "hr course", "hr certification"],
  "interview-preparation": ["interview preparation", "gd pi", "resume writing", "placement training", "mock interview classes", "career counselling"],
  "stock-market-training": ["stock market", "share market", "trading classes", "technical analysis", "nifty", "options trading", "stock trading course", "share market institute"],
  "beauty-makeup-courses": ["makeup academy", "beauty parlour course", "hair styling", "vlcc", "lakme academy", "cosmetology", "nail art", "makeup course", "beautician training institute"],
  "aviation-cabin-crew": ["aviation", "cabin crew", "air hostess training", "frankfinn", "airport management", "air hostess course", "aviation academy"],
  "hotel-management-coaching": ["hotel management", "nchmct", "ihm coaching", "culinary arts", "hospitality", "hotel management institute", "culinary institute"],
  "fashion-designing": ["fashion design", "nift coaching", "nid prep", "tailoring classes", "boutique course", "apparel design", "fashion design institute", "fashion technology course"],
  "nursing-entrance-coaching": ["nursing entrance", "b.sc nursing", "anm gnm", "aiims nursing", "nursing college entrance coaching"],

  // 6. Languages & Performing Arts
  "english-learning": ["spoken english", "english learning", "communication skills", "british academy", "english speaking", "fluent english", "english classes", "english speaking institute"],
  "korean-classes": ["korean language", "topik exam", "japanese language", "jlpt", "french language", "german language", "spanish classes", "japanese classes", "german classes", "french classes", "foreign language institute"],
  "guitar-classes": ["guitar classes", "guitar school", "acoustic guitar", "electric guitar", "guitar institute", "guitar lessons"],
  "piano-classes": ["piano classes", "keyboard classes", "synthesizer", "piano institute", "piano lessons"],
  "tabla-classes": ["tabla classes", "tabla school", "tabla institute", "tabla lessons"],
  "violin-classes": ["violin classes", "violin institute", "violin lessons"],
  "singing-classes": ["singing classes", "vocal music", "classical music", "hindustani vocal", "music academy", "vocal training", "singing institute"],
  "dance-classes": ["dance classes", "dancing", "zumba", "choreography", "hip hop dance", "kathak", "bharatanatyam", "salsa", "contemporary", "dance academy", "dance institute"],
  "theatre-acting": ["theatre", "acting classes", "drama school", "nsd prep", "film acting", "acting institute", "drama classes"],

  // 7. Creative Hobbies & Kids Brain Development
  "art-craft-classes": ["art and craft", "craft classes", "diy workshop", "origami", "pottery", "craft institute", "handicraft classes", "diy art classes", "clay modelling"],
  "sketching": ["sketching", "drawing classes", "fine arts", "painting classes", "water color", "acrylic painting", "sketching classes", "drawing institute", "charcoal drawing"],
  "handwriting-improvement": ["handwriting improvement", "calligraphy classes", "cursive writing", "handwriting classes"],
  "abacus-classes": ["abacus", "ucmas", "sip abacus", "brainobrain", "abacus institute", "mental arithmetic"],
  "vedic-maths": ["vedic maths", "mental math", "vedic maths institute"],
  "phonics": ["phonics classes", "jolly phonics", "reading classes", "phonics institute", "early reading program"],
  "preschool-programs": ["preschool", "play school", "kindergarten", "daycare", "kidzee", "eurokids", "bachpan", "montessori", "preschool institute", "nursery school", "creche"],
  "personality-development": ["personality development", "grooming classes", "soft skills", "personality development institute", "etiquette classes"],
  "public-speaking": ["public speaking", "confidence building", "anchoring classes", "debate", "public speaking institute", "elocution classes", "elocution"],

  // 8. Sports & Field Activities
  "cricket-academy": ["cricket academy", "cricket coaching", "cricket ground", "cricket club", "cricket institute"],
  "football-academy": ["football academy", "soccer coaching", "football club", "football institute"],
  "basketball-academy": ["basketball court", "basketball coaching", "basketball club", "basketball institute"],
  "skating-classes": ["skating rink", "skating classes", "roller skating", "skating institute"],
  "badminton-academy": ["badminton academy", "badminton coaching", "shuttle", "badminton court", "badminton institute"],
  "tennis-academy": ["tennis academy", "lawn tennis", "tennis court", "tennis institute"],
  "swimming-classes": ["swimming classes", "swimming pool", "swim club", "swimmer", "swimming institute", "swimming academy"],

  // 9. Fitness, Yoga & Martial Arts
  "gym": ["gym", "fitness center", "gold gym", "anytime fitness", "workout", "crossfit", "strength training", "weight lifting", "bodybuilding", "fitness studio", "gym center"],
  "yoga-classes": ["yoga classes", "yoga center", "meditation", "pranayama", "hatha yoga", "ashtanga", "power yoga", "iyengar yoga", "yoga studio", "yoga institute", "yoga academy"],
  "karate": ["karate", "taekwondo", "kickboxing", "shotokan", "karate institute", "taekwondo institute"],
  "martial-arts": ["martial arts", "self defence", "judo", "mma", "mixed martial arts", "jiu jitsu", "boxing academy", "martial arts institute", "self defense institute", "wing chun"],

  // 10. Foundational K-12
  "foundation-courses": ["foundation course", "ntse", "olympiad prep", "kvpy", "foundation institute"],
  "olympiad-coaching": ["olympiad coaching", "imo", "nso", "nco", "math olympiad", "olympiad institute"],

  // 11. Class-wise Tuition (previously MISSING entirely)
  // NOTE: matching the exact grade from a place name is unreliable — most
  // "XYZ Tuition Classes" listings never mention a class number. These
  // keyword lists will only catch the minority of listings that explicitly
  // advertise a grade/class. See categorizePlace()'s fallback behaviour
  // below for how the unmatched majority is still handled sensibly.
  "class-1-tuition": ["class 1 tuition", "class i tuition", "1st class tuition", "grade 1 tuition"],
  "class-2-tuition": ["class 2 tuition", "class ii tuition", "2nd class tuition", "grade 2 tuition"],
  "class-3-tuition": ["class 3 tuition", "class iii tuition", "3rd class tuition", "grade 3 tuition"],
  "class-4-tuition": ["class 4 tuition", "class iv tuition", "4th class tuition", "grade 4 tuition"],
  "class-5-tuition": ["class 5 tuition", "class v tuition", "5th class tuition", "grade 5 tuition"],
  "class-6-tuition": ["class 6 tuition", "class vi tuition", "6th class tuition", "grade 6 tuition"],
  "class-7-tuition": ["class 7 tuition", "class vii tuition", "7th class tuition", "grade 7 tuition"],
  "class-8-tuition": ["class 8 tuition", "class viii tuition", "8th class tuition", "grade 8 tuition"],
  "class-9-tuition": ["class 9 tuition", "class ix tuition", "9th class tuition", "grade 9 tuition", "secondary tuition"],
  "class-10-tuition": ["class 10 tuition", "class x tuition", "10th class tuition", "board exam tuition", "matric tuition", "grade 10 tuition"],
  "class-11-tuition": ["class 11 tuition", "class xi tuition", "11th class tuition", "intermediate 1st year", "grade 11 tuition"],
  "class-12-tuition": ["class 12 tuition", "class xii tuition", "12th class tuition", "intermediate 2nd year", "board tuition", "grade 12 tuition"],
};

// ════════════════════════════════════════════════════════════════════════
// GROUP_CATEGORY_MAP
// Maps each MAX_COVERAGE_GROUPS["name"] to the DB category slugs that are
// plausible matches for places returned by that group's search query.
// Keyword matching is only ever attempted within this restricted candidate
// list — this is what keeps "academy"/"institute"/"classes" style generic
// words from cross-matching into unrelated categories.
// ════════════════════════════════════════════════════════════════════════

export const GROUP_CATEGORY_MAP: Record<string, string[]> = {
  "JEE Coaching": ["jee-coaching"],
  "NEET & Medical": ["neet-coaching"],
  "GATE & Engineering PG": ["gate-coaching"],
  "Foundation & Olympiad": ["foundation-courses", "olympiad-coaching"],

  "UPSC & Civil Services": ["upsc-coaching"],
  "State PCS": ["state-pcs-coaching"],
  "Judiciary Coaching": ["judiciary-coaching", "law-coaching"],

  "SSC & Govt Mass Exams": ["ssc-coaching", "railway-coaching"],
  "Banking & Insurance": ["banking-coaching"],
  "Defence Exams": ["defence-coaching", "nda-coaching", "afcat-coaching"],
  "Teaching Exams": ["ugc-net-coaching", "csir-net-coaching", "ctet-coaching", "tet-coaching"],

  "Finance & Accounts": ["ca-coaching", "cs-coaching", "cma-coaching"],
  "Law & Management": ["cat-coaching", "cuet-coaching", "clat-coaching", "law-coaching"],
  "Paramedical & Nursing": ["nursing-entrance-coaching"],
  "Study Abroad": ["ielts-coaching", "gre-coaching", "sat-coaching"],

  "Senior School Tuitions": ["class-11-tuition", "class-12-tuition"],
  "Middle School Tuitions": ["class-6-tuition", "class-7-tuition", "class-8-tuition", "class-9-tuition", "class-10-tuition"],
  "Primary Tuitions": ["class-1-tuition", "class-2-tuition", "class-3-tuition", "class-4-tuition", "class-5-tuition"],

  "IT & Core Tech": ["coding-classes", "aws-training"],
  "Cyber Security & Networking": ["cyber-security-training"],
  "Design & Animation": ["ui-ux-design", "graphic-design", "animation-vfx"],
  "Digital Marketing": ["digital-marketing", "video-editing"],
  "Corporate & Soft Skills": ["sales-training", "hr-training", "interview-preparation", "personality-development", "public-speaking"],
  "Stock Market & Finance Skills": ["stock-market-training"],
  "Spoken English": ["english-learning"],
  "Foreign Languages": ["korean-classes"],
  "Vocational Courses": ["fashion-designing", "hotel-management-coaching", "aviation-cabin-crew"],
  "Beauty & Wellness Courses": ["beauty-makeup-courses"],

  "Music Academies": ["guitar-classes", "piano-classes", "violin-classes", "tabla-classes", "singing-classes"],
  "Dance & Theatre": ["dance-classes", "theatre-acting"],
  "Fine Arts": ["art-craft-classes", "sketching"],
  "Kids Brain Development": ["abacus-classes", "vedic-maths", "robotics-classes", "phonics", "handwriting-improvement"],
  "Early Childhood & Preschool": ["preschool-programs"],

  "Field Sports": ["cricket-academy", "football-academy", "basketball-academy"],
  "Racquet Sports": ["badminton-academy", "tennis-academy"],
  "Aquatics": ["swimming-classes"],
  "Skating & Action Sports": ["skating-classes"],
  "Martial Arts": ["karate", "martial-arts"],

  "Gym & Fitness": ["gym"],
  "Yoga & Meditation": ["yoga-classes"],
};

// ════════════════════════════════════════════════════════════════════════
// categorizePlace()
// Given a place name and the list of candidate slugs for the group it was
// found under, return the slug(s) whose keywords matched.
//
// FALLBACK DESIGN DECISION (please review — easy to change):
// If NO keyword matches, this returns ALL candidateSlugs rather than an
// empty array. Rationale: the place was already found by a query targeted
// at exactly those candidate categories, so "no specific keyword" usually
// means "generic name, but still genuinely one of these categories" (e.g.
// a "Sunrise Tuition Classes" inside the Middle School Tuitions group is
// almost certainly fine being tagged under classes 6-10 rather than under
// none of them). The trade-off is lower precision for multi-category
// groups (e.g. Music Academies, Field Sports) where a generic name gets
// tagged into every sub-category in that group.
//
// To make this auditable, the caller should log every fallback case (see
// the low-confidence log in the import script) so slugs/keywords can be
// tightened over time instead of silently mis-tagging data forever.
// ════════════════════════════════════════════════════════════════════════

export function categorizePlace(
  placeName: string,
  address: string,
  candidateSlugs: string[]
): { matchedSlugs: string[]; isFallback: boolean } {
  const name = `${placeName} ${address}`.toLowerCase();

  const matched = candidateSlugs.filter((slug) => {
    const keywords = CATEGORY_KEYWORD_MAP[slug] || [];
    return keywords.some((kw) => name.includes(kw));
  });

  if (matched.length > 0) {
    return { matchedSlugs: matched, isFallback: false };
  }

  // No keyword matched -> fall back to every candidate for this group.
  return { matchedSlugs: candidateSlugs, isFallback: true };
}