import "dotenv/config";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import fs from "fs"; // File system module add kiya track karne ke liye

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const PROGRESS_FILE = "./import_progress.json"; // Is file me save hoga data

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// const CITY_HUBS = [

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // NORTH DELHI
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // Mukherjee Nagar: most UPSC-dense area in India — tiny radius intentional
//   { name: "Mukherjee Nagar (UPSC Hub)", lat: 28.7057, lng: 77.2040, radius: 1200 },
//   { name: "Kamla Nagar & Civil Lines",   lat: 28.6860, lng: 77.2150, radius: 2000 },
//   { name: "Model Town & Adarsh Nagar",   lat: 28.7110, lng: 77.1930, radius: 2000 },
//   { name: "Burari & Jahangirpuri",        lat: 28.7380, lng: 77.2050, radius: 2500 },
//   { name: "Alipur & Badli",              lat: 28.7750, lng: 77.1500, radius: 3000 },
//   { name: "Narela & Bawana",             lat: 28.8050, lng: 77.0960, radius: 4000 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // NORTH-WEST DELHI / ROHINI
//   // Rohini = 25+ sectors = needs 5 separate hubs
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "Shalimar Bagh & Ashok Vihar",          lat: 28.7000, lng: 77.1590, radius: 2000 },
//   { name: "Pitampura & Netaji Subhash Place",      lat: 28.6980, lng: 77.1340, radius: 1500 },
//   { name: "Rohini Sector 7-11 (Core)",             lat: 28.7080, lng: 77.1150, radius: 2000 },
//   { name: "Rohini Sector 13-18",                   lat: 28.7350, lng: 77.1050, radius: 2500 },
//   { name: "Rohini Sector 21-25 & Kirari",          lat: 28.7480, lng: 77.0850, radius: 3000 },
//   { name: "Paschim Vihar & Madipur",               lat: 28.6670, lng: 77.1030, radius: 2000 },
//   { name: "Punjabi Bagh & Shivaji Park",           lat: 28.6700, lng: 77.1350, radius: 1500 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // WEST DELHI
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "Rajouri Garden & Tagore Garden", lat: 28.6490, lng: 77.1210, radius: 2000 },
//   { name: "Tilak Nagar & Subhash Nagar",    lat: 28.6430, lng: 77.1480, radius: 1500 },
//   { name: "Janakpuri",                      lat: 28.6290, lng: 77.0840, radius: 2000 },
//   { name: "Uttam Nagar & Dwarka Mor",       lat: 28.6160, lng: 77.0580, radius: 2000 },
//   { name: "Vikaspuri & Bindapur",           lat: 28.6060, lng: 77.0380, radius: 2000 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // SOUTH-WEST DELHI / DWARKA
//   // Dwarka is 23 sectors = 3 separate hubs needed
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "North Dwarka (Sec 6-9, 11-12)",       lat: 28.6000, lng: 77.0480, radius: 2500 },
//   { name: "Central Dwarka (Sec 10, 13, 17-18)",  lat: 28.5820, lng: 77.0570, radius: 2000 },
//   { name: "South Dwarka (Sec 19-23)",            lat: 28.5520, lng: 77.0560, radius: 2500 },
//   { name: "Bijwasan & Palam",                    lat: 28.5330, lng: 77.0700, radius: 3000 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // CENTRAL DELHI
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "Karol Bagh",                        lat: 28.6530, lng: 77.1900, radius: 1500 },
//   { name: "Patel Nagar & Rajendra Nagar",      lat: 28.6400, lng: 77.1700, radius: 2000 },
//   { name: "Paharganj & Sadar Bazar",           lat: 28.6490, lng: 77.2130, radius: 1500 },
//   { name: "Chandni Chowk & Old Delhi",         lat: 28.6510, lng: 77.2310, radius: 1500 },
//   { name: "Connaught Place & Rajendra Place",  lat: 28.6360, lng: 77.2070, radius: 2000 },
//   { name: "ITO & Darya Ganj",                 lat: 28.6330, lng: 77.2440, radius: 1500 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // SOUTH DELHI
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "R.K. Puram & Vasant Vihar",         lat: 28.5720, lng: 77.1850, radius: 2000 },
//   { name: "Munirka & Vasant Kunj North",       lat: 28.5430, lng: 77.1680, radius: 2000 },
//   { name: "Hauz Khas & Green Park",            lat: 28.5530, lng: 77.2050, radius: 2000 },
//   { name: "Malviya Nagar & Saket",             lat: 28.5280, lng: 77.2100, radius: 2000 },
//   { name: "Lajpat Nagar & Defence Colony",     lat: 28.5690, lng: 77.2350, radius: 2000 },
//   { name: "Greater Kailash 1 & 2",             lat: 28.5370, lng: 77.2370, radius: 2000 },
//   { name: "Kalkaji & Govindpuri",              lat: 28.5140, lng: 77.2530, radius: 2000 },
//   { name: "Sangam Vihar & Khanpur",            lat: 28.5060, lng: 77.2350, radius: 2500 },
//   { name: "Nehru Place & Okhla Phase 1",       lat: 28.5480, lng: 77.2600, radius: 2000 },
//   { name: "Mehrauli & Chattarpur",             lat: 28.5010, lng: 77.1850, radius: 3000 },
//   { name: "Badarpur & Tughlakabad",            lat: 28.4950, lng: 77.2800, radius: 2500 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // SOUTH-EAST DELHI
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "Jamia Nagar & Okhla Phase 2-3", lat: 28.5570, lng: 77.2900, radius: 2000 },
//   { name: "Jasola & Sarita Vihar",         lat: 28.5380, lng: 77.2900, radius: 1500 },
//   { name: "Shaheen Bagh",                  lat: 28.5490, lng: 77.3070, radius: 1500 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // EAST DELHI
//   // Laxmi Nagar is East Delhi's Mukherjee Nagar — tight radius
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "Laxmi Nagar (Coaching Hub)",      lat: 28.6300, lng: 77.2720, radius: 1500 },
//   { name: "Krishna Nagar & Gandhi Nagar",    lat: 28.6580, lng: 77.2620, radius: 2000 },
//   { name: "Preet Vihar & Vivek Vihar",       lat: 28.6540, lng: 77.3000, radius: 2000 },
//   { name: "Mayur Vihar Phase 1",             lat: 28.6080, lng: 77.2960, radius: 1500 },
//   { name: "Mayur Vihar Phase 2 & 3",         lat: 28.6020, lng: 77.3200, radius: 2000 },
//   { name: "IP Extension & Patparganj",       lat: 28.6220, lng: 77.3130, radius: 2000 },
//   { name: "Kondli, Mandawali & Ghazipur",    lat: 28.6060, lng: 77.3450, radius: 2500 },

//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   // NORTH-EAST DELHI
//   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   { name: "Shahdara & Vishwas Nagar",       lat: 28.6720, lng: 77.2870, radius: 2000 },
//   { name: "Dilshad Garden & Shastri Park",  lat: 28.6820, lng: 77.3150, radius: 2000 },
//   { name: "Yamuna Vihar & Bhajanpura",      lat: 28.7120, lng: 77.2820, radius: 2500 },
//   { name: "Mustafabad & Maujpur",           lat: 28.7000, lng: 77.2950, radius: 2000 },
//   { name: "Nand Nagri & Seemapuri",         lat: 28.6960, lng: 77.3200, radius: 2500 },
//   { name: "Wazirabad & Khajuri Khas",       lat: 28.7450, lng: 77.3020, radius: 3000 },
// ];

const CITY_HUBS = [
  { name: "Central Meerut & Abu Lane", lat: 28.9730, lng: 77.7120, radius: 3000 },
  { name: "Shastri Nagar & CCS University", lat: 28.9660, lng: 77.7470, radius: 3500 },
  { name: "Modipuram & Pallavpuram", lat: 29.0620, lng: 77.7100, radius: 4000 },
  { name: "Ganga Nagar & IIMT University", lat: 29.0000, lng: 77.7620, radius: 3000 },
  { name: "Garh Road Highway", lat: 28.9480, lng: 77.7660, radius: 3500 },
  { name: "Meerut Cantt & Sadar", lat: 29.0060, lng: 77.7020, radius: 3000 },
  { name: "Kankar Khera & Shradhapuri", lat: 29.0090, lng: 77.6780, radius: 3000 },
  { name: "Delhi Road & Partapur", lat: 28.9320, lng: 77.6740, radius: 4000 },
  { name: "Old City & Brahmpuri", lat: 28.9620, lng: 77.6980, radius: 3000 },
  { name: "Subharti & West Bypass", lat: 28.9600, lng: 77.6380, radius: 3500 },
  { name: "Mawana Road Corridor", lat: 29.0250, lng: 77.7800, radius: 4000 },
  { name: "Hapur Road South", lat: 28.9250, lng: 77.7300, radius: 3500 },
];

// Helper function to calculate a strict bounding box (rectangle) from center lat/lng & radius
function getBoundingBox(lat: number, lng: number, radiusMeters: number) {
  const latOffset = radiusMeters / 111320; 
  const lngOffset = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));

  return {
    low: {
      latitude: lat - latOffset,
      longitude: lng - lngOffset,
    },
    high: {
      latitude: lat + latOffset,
      longitude: lng + lngOffset,
    },
  };
}

// Track Progress Helpers
function getCompletedCategories() {
  if (fs.existsSync(PROGRESS_FILE)) {
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(data);
  }
  return [];
}

function markCategoryCompleted(slug: string) {
  const completed = getCompletedCategories();
  if (!completed.includes(slug)) {
    completed.push(slug);
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(completed, null, 2));
  }
}

// 1. FIXED SEARCH PLACES FUNCTION
async function searchPlaces(queryText: string, hub?: { lat: number; lng: number; radius: number }) {
  const allPlaces: any[] = [];
  let pageToken: string | undefined;

  do {
    const body: any = {
      textQuery: queryText,
      pageSize: 20,
    };

    // Strict boundary enforcement
    if (hub && hub.lat !== undefined && hub.lng !== undefined && hub.radius !== undefined) {
      body.locationRestriction = {
        rectangle: getBoundingBox(hub.lat, hub.lng, hub.radius)
      };
    }

    if (pageToken) {
      body.pageToken = pageToken;
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": [
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.location",
            "places.websiteUri",
            "places.nationalPhoneNumber",
            "places.rating",
            "places.userRatingCount",
            "places.googleMapsUri",
            "places.photos",
            "places.types",
            "nextPageToken",
          ].join(","),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error(`HTTP ${response.status} for query: ${queryText}`);
      break;
    }

    const data = await response.json();

    if (data.error) {
      console.error(`Google API Error for query: ${queryText}`, data.error);
      break;
    }

    allPlaces.push(...(data.places || []));
    pageToken = data.nextPageToken;

    if (pageToken) {
      await sleep(2000); // Prevents INVALID_REQUEST pagination errors
    }
  } while (pageToken);

  return allPlaces;
}

function getImageUrl(photoName: string) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&key=${GOOGLE_API_KEY}`;
}

// 2. PROCESSING PIPELINE
async function importCategoryCity(category: any, city: any) {
  const cityKey = city.slug.toLowerCase().trim();

  const hubs = cityKey === "meerut" ? CITY_HUBS : [{ name: city.name, lat: null, lng: null, radius: null }];

  console.log(`\n🚀 Processing: ${category.name} -> ${city.name}`);
  const Keywords = ["coaching", "classes", "academy", "tuition", "institute"];
  const categoryNameLower = category.name.toLowerCase();
  
  // Check karte hain ki naam me inme se koi word hai kya?
  const hasEducationalWord = Keywords.some(word => categoryNameLower.includes(word));
  
  // Agar nahi hai, toh "Institute" add kar do (best for Graphic Design, Video Editing etc.)
  const searchQuery = hasEducationalWord ? category.name : `${category.name} Classes`;
  console.log("Search Query is -> -> ",searchQuery);
  const uniquePlaces = new Map<string, any>();

  console.log(`Processing ${hubs.length} hubs`);

  for (const hub of hubs) {
    console.log(`📍 Scanning Hub Area: ${hub.name || city.name}`);
    
    let places: any[] = [];
    
    if (hub.lat !== null && hub.lng !== null) {
      // Clean query: Let the Bounding Box do the filtering work
      places = await searchPlaces(`${searchQuery}`, { lat: hub.lat, lng: hub.lng, radius: hub.radius });
    } else {
      places = await searchPlaces(`${searchQuery} in ${city.name}`);
    }

    console.log(`Fetched ${places.length} items from this hub segment.`);

    // THE DEBUGGER: See exactly what Google is returning to verify accuracy
    if (places.length > 0) {
      console.log(
        `↳ Top 3 results:`,
        places.slice(0, 3).map((p) => p.displayName?.text).join(" | ")
      );
    }

    for (const place of places) {
      // Safely filters data duplicates instantly at application level
      uniquePlaces.set(place.id, place);
    }

    await sleep(1000); 
  }

  const placesToProcess = Array.from(uniquePlaces.values());
  console.log(`🎯 Total Unique Locations Consolidated for Category: ${placesToProcess.length}`);

  // 3. DATABASE TRANSACTION & UPSERT LOOP
  for (const place of placesToProcess) {
    try {
      if (!place.displayName?.text) continue;

      const imageUrl = place.photos?.[0]?.name ? getImageUrl(place.photos[0].name) : null;
      const slug = `${slugify(place.displayName.text, { lower: true, strict: true })}-${place.id.slice(0, 6)}`;

      const institute = await prisma.institute.upsert({
        where: { googlePlaceId: place.id },
        update: {
          website: place.websiteUri ?? null,
          phone: place.nationalPhoneNumber ?? null,
          googleRating: place.rating ?? 0,
          googleReviewCount: place.userRatingCount ?? 0,
          //imageUrl,
        },
        create: {
          name: place.displayName.text,
          slug,
          address: place.formattedAddress,
          latitude: place.location?.latitude ?? null,
          longitude: place.location?.longitude ?? null,
          website: place.websiteUri ?? null,
          phone: place.nationalPhoneNumber ?? null,
          googlePlaceId: place.id,
          googleRating: place.rating ?? 0,
          googleReviewCount: place.userRatingCount ?? 0,
          googleMapsUrl: place.googleMapsUri ?? null,
          imageUrl,
          cityId: city.id,
        },
      });

      if (imageUrl && !institute.imageUrl?.includes("cloudinary.com")) {
        await prisma.institute.update({
          where: { id: institute.id },
          data: { imageUrl },
        });
      }

      await prisma.instituteCategory.upsert({
        where: {
          instituteId_categoryId: {
            instituteId: institute.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          instituteId: institute.id,
          categoryId: category.id,
        },
      });

      console.log(`✅ Upserted Into Database: ${institute.name}`);
      await sleep(100); 
    } catch (error) {
      console.error(`❌ DB Insert Error for location ID ${place.id}:`, error);
    }
  }
}

async function main() {
  const categories = await prisma.category.findMany();
  const cities = await prisma.city.findMany();

  const selectedCategories = categories.filter((c) =>
  [
    "jee-coaching",
    "neet-coaching",
    "upsc-coaching",
    "cat-coaching",
    "clat-coaching",
    "cuet-coaching",
    "ssc-coaching",
    "banking-coaching",
    "railway-coaching",
    "defence-coaching",
    "gate-coaching",
    "law-coaching",
    "ca-coaching",
    "ielts-coaching",
    "gre-coaching",
    // "coding-classes",
    "cyber-security-training",
    "english-learning",
    "guitar-classes",
    "piano-classes",
    "tabla-classes",
    // "violin-classes",
    "dance-classes",
    "singing-classes",
    "art-craft-classes",
    "sketching",
    "csir-net-coaching",
    "ctet-coaching",
    "cricket-academy",
    "football-academy",
    "swimming-classes",
    "gym",
    "yoga-classes",
    "sat-coaching",
    "aviation-cabin-crew",
    "hotel-management-coaching",
    "fashion-designing",
    "nursing-entrance-coaching",
    // "class-1-tuition",
    // "class-2-tuition",
    // "class-3-tuition", 
    // "class-4-tuition", 
    // "class-5-tuition", 
    // "class-6-tuition", 
    // "class-7-tuition", 
    // "class-8-tuition", 
    "class-9-tuition", 
    "class-10-tuition", 
    "class-11-tuition", 
    "class-12-tuition", 
    "state-pcs-coaching", 
    "nda-coaching", 
    "ugc-net-coaching",  
    "aws-training", 
    // "ui-ux-design", 
    "graphic-design", 
    "video-editing", 
    "animation-vfx",
    "digital-marketing", 
    "sales-training",
    "stock-market-training",  
    "hr-training", 
    "interview-preparation", 
    "beauty-makeup-courses",  
    "korean-classes", 
    "theatre-acting", 
    "basketball-academy", 
    "skating-classes", 
    "karate",
    "handwriting-improvement",
    // "foundation-courses",
    // "olympiad-coaching",
    // "tabla-classes",
    "afcat-coaching",
    "tet-coaching",
    "cma-coaching",
    "cs-coaching",
    "judiciary-coaching",
    "phonics",
    "preschool-programs",
    "personality-development",
    "public-speaking",
    "abacus-classes",
    "vedic-maths",
    "robotics-classes",
    "martial-arts",
    "badminton-academy",
    "tennis-academy",


  ].includes(c.slug)
);

  const selectedCities = cities.filter((c) =>
    [
      "meerut",
    ].includes(c.slug)
  );

  // PEHLE SE HO CHUKI CATEGORIES LOAD KARO
  const completedCategories = getCompletedCategories();
  if (completedCategories.length > 0) {
    console.log(`\n📄 Progress File Found! Skipping ${completedCategories.length} already completed categories...`);
  }

  for (const category of selectedCategories) {
    // AGAR CATEGORY PEHLE HI HO CHUKI HAI TOH SKIP KAR DO
    if (completedCategories.includes(category.slug)) {
      console.log(`\n⏭️ Skipping Category: [${category.name}] - Already processed previously.`);
      continue;
    }

    for (const city of selectedCities) {
      await importCategoryCity(
        category,
        city
      );
    }
    
    // CITY IMPORT SUCCESSFUL HONE KE BAAD FILE ME SAVE KARO
    markCategoryCompleted(category.slug);
    console.log(`\n📁 PROGRESS SAVED: [${category.name}] added to import_progress.json`);
  }

  console.log("\n🎉 ALL IMPORTS COMPLETED SUCCESSFULLY!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });


//   const MAX_COVERAGE_GROUPS = [
//   // ─── ACADEMICS: ENGINEERING & MEDICAL ───────────────────────────────────────
//   { name: "JEE Coaching", query: "IIT JEE Mains Advanced engineering entrance coaching", types: ["tutoring_center"] },
//   { name: "NEET & Medical", query: "NEET AIIMS medical entrance biology chemistry coaching", types: ["tutoring_center"] },
//   { name: "GATE & Engineering PG", query: "GATE engineering postgraduate technical entrance coaching", types: ["tutoring_center"] },
//   { name: "Foundation & Olympiad", query: "Foundation course NTSE Olympiad KVPY school competition coaching", types: ["tutoring_center"] },

//   // ─── ACADEMICS: CIVIL SERVICES ───────────────────────────────────────────────
//   { name: "UPSC & Civil Services", query: "UPSC IAS IPS Civil Services coaching academy", types: ["tutoring_center"] },
//   { name: "State PCS", query: "State PCS BPSC UPPSC MPPSC RPSC coaching center", types: ["tutoring_center"] },
//   { name: "Judiciary Coaching", query: "Judiciary law court civil judge coaching institute", types: ["tutoring_center"] },

//   // ─── ACADEMICS: GOVT EXAMS ───────────────────────────────────────────────────
//   { name: "SSC & Govt Mass Exams", query: "SSC CGL CHSL MTS Railway RRB NTPC coaching", types: ["tutoring_center"] },
//   { name: "Banking & Insurance", query: "Banking IBPS SBI PO Clerk RBI NABARD coaching", types: ["tutoring_center"] },
//   { name: "Defence Exams", query: "NDA AFCAT CDS SSB Sainik School defence academy", types: ["tutoring_center"] },
//   { name: "Teaching Exams", query: "UGC NET CSIR CTET TET STET PRT teaching coaching", types: ["tutoring_center"] },

//   // ─── ACADEMICS: PROFESSIONAL ─────────────────────────────────────────────────
//   { name: "Finance & Accounts", query: "CA CS CMA chartered accountant ICAI coaching", types: ["tutoring_center"] },
//   { name: "Law & Management", query: "CAT CUET CLAT MBA law management entrance coaching", types: ["tutoring_center"] },
//   { name: "Paramedical & Nursing", query: "Nursing entrance ANM GNM BSc Nursing paramedical coaching", types: ["tutoring_center"] },
//   { name: "Study Abroad", query: "IELTS GRE SAT TOEFL PTE GMAT visa counselling coaching", types: ["tutoring_center"] },

//   // ─── ACADEMICS: SCHOOL TUITIONS ──────────────────────────────────────────────
//   { name: "Senior School Tuitions", query: "Class 11 12 science commerce arts board tuition coaching", types: ["tutoring_center"] },
//   { name: "Middle School Tuitions", query: "Class 6 7 8 9 10 tuition all subjects coaching", types: ["tutoring_center"] },
//   { name: "Primary Tuitions", query: "Class 1 2 3 4 5 primary school tuition coaching", types: ["tutoring_center"] },

//   // ─── SKILL & IT ──────────────────────────────────────────────────────────────
//   { name: "IT & Core Tech", query: "Coding Java Python AWS Full Stack software training institute", types: ["educational_institution"] },
//   { name: "Cyber Security & Networking", query: "Cyber security ethical hacking CCNA networking training institute", types: ["educational_institution"] },
//   { name: "Design & Animation", query: "UI UX Graphic Design Animation VFX 3D institute", types: ["educational_institution"] },
//   { name: "Digital Marketing", query: "Digital Marketing SEO SEM Video Editing content creation institute", types: ["educational_institution"] },
//   { name: "Corporate & Soft Skills", query: "Sales HR Interview Prep personality development public speaking communication", types: ["educational_institution"] },
//   { name: "Stock Market & Finance Skills", query: "Stock Market trading investment finance course institute", types: ["educational_institution"] },
//   { name: "Spoken English", query: "Spoken English language fluency communication skills institute", types: ["educational_institution"] },
//   { name: "Foreign Languages", query: "Korean French German Spanish Japanese foreign language institute", types: ["educational_institution"] },
//   { name: "Vocational Courses", query: "Fashion Designing Hotel Management Aviation Cabin Crew vocational institute", types: ["educational_institution"] },
//   { name: "Beauty & Wellness Courses", query: "Makeup Academy Beautician Hair Styling cosmetology course", types: ["educational_institution"] },

//   // ─── KIDS, ARTS & HOBBIES ────────────────────────────────────────────────────
//   { name: "Music Academies", query: "Music classes Guitar Piano Violin Tabla Harmonium Singing", types: ["music_school"] },
//   { name: "Dance & Theatre", query: "Dance classes Bharatnatyam Kathak Zumba Theatre Acting choreography", types: ["dance_school"] },
//   { name: "Fine Arts", query: "Art Craft Sketching Painting Drawing Calligraphy classes", types: ["art_school"] },
//   { name: "Kids Brain Development", query: "Abacus Vedic Maths Robotics Phonics Handwriting improvement", types: ["tutoring_center"] },
//   { name: "Early Childhood & Preschool", query: "Preschool playgroup daycare kindergarten Montessori", types: ["preschool"] },

//   // ─── SPORTS ──────────────────────────────────────────────────────────────────
//   { name: "Field Sports", query: "Cricket Football Basketball Athletics volleyball sports academy", types: ["sports_club", "sports_complex"] },
//   { name: "Racquet Sports", query: "Badminton Tennis Table Tennis coaching academy", types: ["sports_club"] },
//   { name: "Aquatics", query: "Swimming classes aquatic academy pool coaching", types: ["swimming_pool", "sports_club", "sports_complex"] },
//   { name: "Skating & Action Sports", query: "Skating Roller Skating Skateboarding coaching academy", types: ["sports_club"] },
//   { name: "Martial Arts", query: "Karate Taekwondo Judo Kickboxing MMA Kung Fu martial arts", types: ["gym", "sports_club"] },

//   // ─── GYM, YOGA & WELLNESS ────────────────────────────────────────────────────
//   { name: "Gym & Fitness", query: "Gym fitness center workout crossfit strength training", types: ["gym", "fitness_center"] },
//   { name: "Yoga & Meditation", query: "Yoga classes meditation pranayama asana mindfulness center", types: ["gym", "health_beauty"] },
// ];

// const MEERUT_HUBS = [
//   // ✅ Hub 1 — ACCURATE, no change
//   { name: "Central Meerut & Abu Lane", lat: 28.9730, lng: 77.7120, radius: 3000 },

//   // ✅ Hub 2 — ACCURATE (CCS University 0.7km from center)
//   { name: "Shastri Nagar & CCS University", lat: 28.9660, lng: 77.7470, radius: 3500 },

//   // ✅ Hub 3 — ACCURATE (Modipuram verified at 29.066, 77.710)
//   { name: "Modipuram & Pallavpuram", lat: 29.0620, lng: 77.7100, radius: 4000 },

//   // ⚠️ Hub 4 — CORRECTED (IIMT actually at 29.000, 77.761 — shifted NE)
//   { name: "Ganga Nagar & IIMT University", lat: 29.0000, lng: 77.7620, radius: 3000 },

//   // ✅ Hub 5 — ACCURATE
//   { name: "Garh Road Highway", lat: 28.9480, lng: 77.7660, radius: 3500 },

//   // ✅ Hub 6 — ACCURATE
//   { name: "Meerut Cantt & Sadar", lat: 29.0060, lng: 77.7020, radius: 3000 },

//   // ✅ Hub 7 — ACCURATE
//   { name: "Kankar Khera & Shradhapuri", lat: 29.0090, lng: 77.6780, radius: 3000 },

//   // ✅ Hub 8 — ACCURATE
//   { name: "Delhi Road & Partapur", lat: 28.9320, lng: 77.6740, radius: 4000 },

//   // ⚠️ Hub 9 — CORRECTED (Brahmpuri at 28.971, 77.696 — center shifted north)
//   { name: "Old City & Brahmpuri", lat: 28.9620, lng: 77.6980, radius: 3000 },

//   // ⚠️ Hub 10 — CORRECTED (Subharti at 28.957, 77.634 — center moved southwest)
//   { name: "Subharti & West Bypass", lat: 28.9600, lng: 77.6380, radius: 3500 },

//   // 🆕 Hub 11 — NEW: Mawana Road Corridor
//   // Covers: NH-119 stretch, colleges between city & Mawana, Ganga Nagar outer
//   { name: "Mawana Road Corridor", lat: 29.0250, lng: 77.7800, radius: 4000 },

//   // 🆕 Hub 12 — NEW: Hapur Road South
//   // Covers: Hapur Chungi, Lisari Gate outer, south-east institutes beyond Hub 9
//   { name: "Hapur Road South", lat: 28.9250, lng: 77.7300, radius: 3500 },
// ];


// import "dotenv/config";
// import { prisma } from "@/lib/prisma";
// import slugify from "slugify";
// import fs from "fs";
// import { categorizePlace, GROUP_CATEGORY_MAP } from "./category-keyword-map";

// const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

// // Renamed on purpose: progress is now tracked per MAX_COVERAGE_GROUPS name,
// // not per DB category slug — NOT compatible with an old
// // import_progress.json from the previous version of this script.
// const PROGRESS_FILE = "./import_progress_groups.json";
// const LOW_CONFIDENCE_FILE = "./low_confidence_categorization.json";

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }


// const MEERUT_HUBS = [
//   { name: "Central Meerut & Abu Lane", lat: 28.9730, lng: 77.7120, radius: 3000 },
//   { name: "Shastri Nagar & CCS University", lat: 28.9660, lng: 77.7470, radius: 3500 },
//   { name: "Modipuram & Pallavpuram", lat: 29.0620, lng: 77.7100, radius: 4000 },
//   { name: "Ganga Nagar & IIMT University", lat: 29.0000, lng: 77.7620, radius: 3000 },
//   { name: "Garh Road Highway", lat: 28.9480, lng: 77.7660, radius: 3500 },
//   { name: "Meerut Cantt & Sadar", lat: 29.0060, lng: 77.7020, radius: 3000 },
//   { name: "Kankar Khera & Shradhapuri", lat: 29.0090, lng: 77.6780, radius: 3000 },
//   { name: "Delhi Road & Partapur", lat: 28.9320, lng: 77.6740, radius: 4000 },
//   { name: "Old City & Brahmpuri", lat: 28.9620, lng: 77.6980, radius: 3000 },
//   { name: "Subharti & West Bypass", lat: 28.9600, lng: 77.6380, radius: 3500 },
//   { name: "Mawana Road Corridor", lat: 29.0250, lng: 77.7800, radius: 4000 },
//   { name: "Hapur Road South", lat: 28.9250, lng: 77.7300, radius: 3500 },
// ];

// function getHubsForCity(city: { slug: string; name: string }) {
//   const key = city.slug.toLowerCase().trim();
//   if (key === "meerut") return MEERUT_HUBS;
//   // Cities without a hand-tuned hub grid get one city-wide search instead.
//   return [{ name: city.name, lat: null as number | null, lng: null as number | null, radius: null as number | null }];
// }

// function getBoundingBox(lat: number, lng: number, radiusMeters: number) {
//   const latOffset = radiusMeters / 111320;
//   const lngOffset = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));

//   return {
//     low: { latitude: lat - latOffset, longitude: lng - lngOffset },
//     high: { latitude: lat + latOffset, longitude: lng + lngOffset },
//   };
// }

// // ════════════════════════════════════════════════════════════════════════
// // MAX_COVERAGE_GROUPS — unchanged from what you gave me. These are now the
// // ONLY search queries the script runs (instead of one query per DB
// // category), so a 90-category catalogue collapses into ~40 broad fetches.
// // ════════════════════════════════════════════════════════════════════════
// const MAX_COVERAGE_GROUPS = [
//   { name: "JEE Coaching", query: "IIT JEE Mains Advanced engineering entrance coaching" },
//   { name: "NEET & Medical", query: "NEET AIIMS medical entrance biology chemistry coaching" },
//   { name: "GATE & Engineering PG", query: "GATE engineering postgraduate technical entrance coaching" },
//   { name: "Foundation & Olympiad", query: "Foundation course NTSE Olympiad KVPY school competition coaching" },

//   { name: "UPSC & Civil Services", query: "UPSC IAS IPS Civil Services coaching academy" },
//   { name: "State PCS", query: "State PCS BPSC UPPSC MPPSC RPSC coaching center" },
//   { name: "Judiciary Coaching", query: "Judiciary law court civil judge coaching institute" },

//   { name: "SSC & Govt Mass Exams", query: "SSC CGL CHSL MTS Railway RRB NTPC coaching" },
//   { name: "Banking & Insurance", query: "Banking IBPS SBI PO Clerk RBI NABARD coaching" },
//   { name: "Defence Exams", query: "NDA AFCAT CDS SSB Sainik School defence academy" },
//   { name: "Teaching Exams", query: "UGC NET CSIR CTET TET STET PRT teaching coaching" },

//   { name: "Finance & Accounts", query: "CA CS CMA chartered accountant ICAI coaching" },
//   { name: "Law & Management", query: "CAT CUET CLAT MBA law management entrance coaching" },
//   { name: "Paramedical & Nursing", query: "Nursing entrance ANM GNM BSc Nursing paramedical coaching" },
//   { name: "Study Abroad", query: "IELTS GRE SAT TOEFL PTE GMAT visa counselling coaching" },

//   { name: "Senior School Tuitions", query: "Class 11 12 science commerce arts board tuition coaching" },
//   { name: "Middle School Tuitions", query: "Class 6 7 8 9 10 tuition all subjects coaching" },
//   { name: "Primary Tuitions", query: "Class 1 2 3 4 5 primary school tuition coaching" },

//   { name: "IT & Core Tech", query: "Coding Java Python AWS Full Stack software training institute" },
//   { name: "Cyber Security & Networking", query: "Cyber security ethical hacking CCNA networking training institute" },
//   { name: "Design & Animation", query: "UI UX Graphic Design Animation VFX 3D institute" },
//   { name: "Digital Marketing", query: "Digital Marketing SEO SEM Video Editing content creation institute" },
//   { name: "Corporate & Soft Skills", query: "Sales HR Interview Prep personality development public speaking communication" },
//   { name: "Stock Market & Finance Skills", query: "Stock Market trading investment finance course institute" },
//   { name: "Spoken English", query: "Spoken English language fluency communication skills institute" },
//   { name: "Foreign Languages", query: "Korean French German Spanish Japanese foreign language institute" },
//   { name: "Vocational Courses", query: "Fashion Designing Hotel Management Aviation Cabin Crew vocational institute" },
//   { name: "Beauty & Wellness Courses", query: "Makeup Academy Beautician Hair Styling cosmetology course" },

//   { name: "Music Academies", query: "Music classes Guitar Piano Violin Tabla Harmonium Singing" },
//   { name: "Dance & Theatre", query: "Dance classes Bharatnatyam Kathak Zumba Theatre Acting choreography" },
//   { name: "Fine Arts", query: "Art Craft Sketching Painting Drawing Calligraphy classes" },
//   { name: "Kids Brain Development", query: "Abacus Vedic Maths Robotics Phonics Handwriting improvement" },
//   { name: "Early Childhood & Preschool", query: "Preschool playgroup daycare kindergarten Montessori" },

//   { name: "Field Sports", query: "Cricket Football Basketball Athletics volleyball sports academy" },
//   { name: "Racquet Sports", query: "Badminton Tennis Table Tennis coaching academy" },
//   { name: "Aquatics", query: "Swimming classes aquatic academy pool coaching" },
//   { name: "Skating & Action Sports", query: "Skating Roller Skating Skateboarding coaching academy" },
//   { name: "Martial Arts", query: "Karate Taekwondo Judo Kickboxing MMA Kung Fu martial arts" },

//   { name: "Gym & Fitness", query: "Gym fitness center workout crossfit strength training" },
//   { name: "Yoga & Meditation", query: "Yoga classes meditation pranayama asana mindfulness center" },
// ];

// // ── Progress tracking (now per GROUP name, not per DB category) ───────────
// function getCompletedGroups(): string[] {
//   if (fs.existsSync(PROGRESS_FILE)) {
//     return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
//   }
//   return [];
// }

// function markGroupCompleted(groupName: string) {
//   const completed = getCompletedGroups();
//   if (!completed.includes(groupName)) {
//     completed.push(groupName);
//     fs.writeFileSync(PROGRESS_FILE, JSON.stringify(completed, null, 2));
//   }
// }

// // ── Low-confidence log: every place tagged via the group-wide fallback
// // (no specific keyword matched) gets recorded here so you can tighten the
// // keyword map later instead of silently over-tagging forever ─────────────
// type LowConfidenceEntry = {
//   placeId: string;
//   name: string;
//   group: string;
//   assignedSlugs: string[];
// };

// function appendLowConfidenceEntries(entries: LowConfidenceEntry[]) {
//   if (entries.length === 0) return;
//   let existing: LowConfidenceEntry[] = [];
//   if (fs.existsSync(LOW_CONFIDENCE_FILE)) {
//     existing = JSON.parse(fs.readFileSync(LOW_CONFIDENCE_FILE, "utf-8"));
//   }
//   fs.writeFileSync(LOW_CONFIDENCE_FILE, JSON.stringify([...existing, ...entries], null, 2));
// }

// // ── Google Places search (unchanged) ───────────────────────────────────────
// async function searchPlaces(
//   queryText: string,
//   hub?: { lat: number | null; lng: number | null; radius: number | null }
// ) {
//   const allPlaces: any[] = [];
//   let pageToken: string | undefined;

//   do {
//     const body: any = { textQuery: queryText, pageSize: 20 };

//     if (hub && hub.lat !== null && hub.lng !== null && hub.radius !== null) {
//       body.locationRestriction = { rectangle: getBoundingBox(hub.lat, hub.lng, hub.radius) };
//     }

//     if (pageToken) body.pageToken = pageToken;

//     const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": GOOGLE_API_KEY,
//         "X-Goog-FieldMask": [
//           "places.id",
//           "places.displayName",
//           "places.formattedAddress",
//           "places.location",
//           "places.websiteUri",
//           "places.nationalPhoneNumber",
//           "places.rating",
//           "places.userRatingCount",
//           "places.googleMapsUri",
//           "places.photos",
//           "places.types",
//           "nextPageToken",
//         ].join(","),
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       console.error(`HTTP ${response.status} for query: ${queryText}`);
//       break;
//     }

//     const data = await response.json();

//     if (data.error) {
//       console.error(`Google API Error for query: ${queryText}`, data.error);
//       break;
//     }

//     allPlaces.push(...(data.places || []));
//     pageToken = data.nextPageToken;

//     if (pageToken) await sleep(2000);
//   } while (pageToken);

//   return allPlaces;
// }

// function getImageUrl(photoName: string) {
//   return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&key=${GOOGLE_API_KEY}`;
// }

// // ════════════════════════════════════════════════════════════════════════
// // CORE PIPELINE — one group's query is run across every hub for a city;
// // every fetched place is then tagged into the correct DB category(ies)
// // using categorizePlace() restricted to that group's candidate slugs.
// // ════════════════════════════════════════════════════════════════════════
// async function importGroupForCity(
//   group: { name: string; query: string },
//   city: { id: string; slug: string; name: string },
//   slugToCategory: Map<string, { id: string; slug: string }>
// ) {
//   const candidateSlugs = GROUP_CATEGORY_MAP[group.name] || [];

//   const candidateCategories = candidateSlugs
//     .map((slug) => slugToCategory.get(slug))
//     .filter((c): c is { id: string; slug: string } => Boolean(c));

//   if (candidateCategories.length === 0) {
//     console.warn(
//       `⚠️ Skipping group "${group.name}" — none of its candidate slugs (${candidateSlugs.join(", ")}) exist in the categories table.`
//     );
//     return;
//   }

//   const hubs = getHubsForCity(city);
//   console.log(`\n🚀 Processing Group: ${group.name} -> ${city.name}`);
//   console.log(`Candidate categories: ${candidateSlugs.join(", ")}`);
//   console.log(`Processing ${hubs.length} hubs`);

//   const uniquePlaces = new Map<string, any>();

//   for (const hub of hubs) {
//     console.log(`📍 Scanning Hub Area: ${hub.name || city.name}`);

//     const places = await searchPlaces(group.query, {
//       lat: hub.lat,
//       lng: hub.lng,
//       radius: hub.radius,
//     });

//     console.log(`Fetched ${places.length} items from this hub segment.`);
//     if (places.length > 0) {
//       console.log(`↳ Top 3 results:`, places.slice(0, 3).map((p) => p.displayName?.text).join(" | "));
//     }

//     for (const place of places) uniquePlaces.set(place.id, place);
//     await sleep(1000);
//   }

//   const placesToProcess = Array.from(uniquePlaces.values());
//   console.log(`🎯 Total Unique Locations Consolidated: ${placesToProcess.length}`);

//   const lowConfidenceEntries: LowConfidenceEntry[] = [];

//   for (const place of placesToProcess) {
//     try {
//       if (!place.displayName?.text) continue;

//       const { matchedSlugs, isFallback } = categorizePlace(place.displayName.text,place.formattedAddress ?? "" , candidateSlugs);

//       const categoriesToAssign = matchedSlugs
//         .map((slug) => slugToCategory.get(slug))
//         .filter((c): c is { id: string; slug: string } => Boolean(c));

//       if (isFallback) {
//         lowConfidenceEntries.push({
//           placeId: place.id,
//           name: place.displayName.text,
//           group: group.name,
//           assignedSlugs: matchedSlugs,
//         });
//       }

//       const imageUrl = place.photos?.[0]?.name ? getImageUrl(place.photos[0].name) : null;
//       const slug = `${slugify(place.displayName.text, { lower: true, strict: true })}-${place.id.slice(0, 6)}`;

//       const institute = await prisma.institute.upsert({
//         where: { googlePlaceId: place.id },
//         update: {
//           website: place.websiteUri ?? null,
//           phone: place.nationalPhoneNumber ?? null,
//           googleRating: place.rating ?? 0,
//           googleReviewCount: place.userRatingCount ?? 0,
//         },
//         create: {
//           name: place.displayName.text,
//           slug,
//           address: place.formattedAddress,
//           latitude: place.location?.latitude ?? null,
//           longitude: place.location?.longitude ?? null,
//           website: place.websiteUri ?? null,
//           phone: place.nationalPhoneNumber ?? null,
//           googlePlaceId: place.id,
//           googleRating: place.rating ?? 0,
//           googleReviewCount: place.userRatingCount ?? 0,
//           googleMapsUrl: place.googleMapsUri ?? null,
//           imageUrl,
//           cityId: city.id,
//         },
//       });

//       if (imageUrl && !institute.imageUrl?.includes("cloudinary.com")) {
//         await prisma.institute.update({ where: { id: institute.id }, data: { imageUrl } });
//       }

//       // Link to EVERY matched category — a place can legitimately belong
//       // to more than one (e.g. "Guitar & Piano Academy" matches both).
//       for (const category of categoriesToAssign) {
//         await prisma.instituteCategory.upsert({
//           where: { instituteId_categoryId: { instituteId: institute.id, categoryId: category.id } },
//           update: {},
//           create: { instituteId: institute.id, categoryId: category.id },
//         });
//       }

//       console.log(
//         `✅ Upserted: ${institute.name} -> [${categoriesToAssign.map((c) => c.slug).join(", ")}]${isFallback ? " (fallback — flagged for review)" : ""}`
//       );
//       await sleep(100);
//     } catch (error) {
//       console.error(`❌ DB Insert Error for location ID ${place.id}:`, error);
//     }
//   }

//   appendLowConfidenceEntries(lowConfidenceEntries);
//   if (lowConfidenceEntries.length > 0) {
//     console.log(`📝 Logged ${lowConfidenceEntries.length} fallback-categorized places to ${LOW_CONFIDENCE_FILE} for review.`);
//   }
// }

// async function main() {
//   const categories = await prisma.category.findMany();
//   const cities = await prisma.city.findMany();

//   const slugToCategory = new Map(categories.map((c) => [c.slug, c]));

//   const selectedCities = cities.filter((c) => ["meerut"].includes(c.slug));
//   if (selectedCities.length === 0) {
//     console.log("🔍 DB mein ye saari cities hain:", cities.map(c => c.slug));
//   console.log("❌ ERROR: Meerut city not found in the database! Please add it first.");
//   return; // Script yahi rok dega
// }

//   const completedGroups = getCompletedGroups();
//   if (completedGroups.length > 0) {
//     console.log(`\n📄 Progress File Found! Skipping ${completedGroups.length} already completed groups...`);
//   }

//   for (const group of MAX_COVERAGE_GROUPS) {
//     if (completedGroups.includes(group.name)) {
//       console.log(`\n⏭️ Skipping Group: [${group.name}] - Already processed previously.`);
//       continue;
//     }

//     for (const city of selectedCities) {
//       await importGroupForCity(group, city, slugToCategory);
//     }

//     markGroupCompleted(group.name);
//     console.log(`\n📁 PROGRESS SAVED: [${group.name}] added to ${PROGRESS_FILE}`);
//   }

//   console.log("\n🎉 ALL IMPORTS COMPLETED SUCCESSFULLY!");
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });