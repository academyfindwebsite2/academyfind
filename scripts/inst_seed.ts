import "dotenv/config";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import fs from "fs"; // File system module add kiya track karne ke liye

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const PROGRESS_FILE = "./import_progress.json"; // Is file me save hoga data

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



const CITY_HUBS = [
  { name: "Old Gurgaon (Sadar Bazar & Railway Station)", lat: 28.4595, lng: 77.0266, radius: 2000 },
  { name: "Sector 14 & 15 (Atul Kataria Chowk Hub)", lat: 28.4648, lng: 77.0296, radius: 1800 },
  { name: "Sector 17, 18 & 22 (New Colony Belt)", lat: 28.4805, lng: 77.0220, radius: 2000 },
  { name: "Sector 31, 32 & 34 (Huda City Centre)", lat: 28.4625, lng: 77.0427, radius: 2000 },

  // 2. MG ROAD / SUSHANT LOK CORRIDOR
  { name: "MG Road & Sector 27-28", lat: 28.4726, lng: 77.0626, radius: 2000 },
  { name: "Sushant Lok 1 & 2 / Sector 43", lat: 28.4614, lng: 77.0726, radius: 2000 },

  // 3. DLF PHASES / CYBER CITY BELT
  { name: "DLF Phase 1 & Sikanderpur", lat: 28.4817, lng: 77.0875, radius: 2000 },
  { name: "DLF Phase 2 & 3 / Cyber Hub", lat: 28.4949, lng: 77.0891, radius: 2000 },
  { name: "DLF Phase 4 & 5 / Nirvana Country", lat: 28.5055, lng: 77.0950, radius: 2000 },

  // 4. SOHNA ROAD BELT
  { name: "Sector 48, 49 & 50 (Sohna Road Mid)", lat: 28.4230, lng: 77.0670, radius: 2500 },
  { name: "Sector 56, 57 & South City 2", lat: 28.4094, lng: 77.0823, radius: 2500 },
  { name: "Badshahpur / Sector 65-68", lat: 28.3980, lng: 77.1050, radius: 2500 },

  // 5. GOLF COURSE EXTENSION ROAD
  { name: "Sector 55, 58 & 59 (Golf Course Ext)", lat: 28.4300, lng: 77.1050, radius: 2000 },
  { name: "Sector 62, 63 & 66", lat: 28.4150, lng: 77.1100, radius: 2000 },

  // 6. DWARKA EXPRESSWAY / NORTH GURGAON
  { name: "Sector 80, 81 & 82 (Dwarka Exp South)", lat: 28.4490, lng: 77.0380, radius: 2000 },
  { name: "Sector 88, 90 & 92 (Pataudi Road Node)", lat: 28.4600, lng: 77.0200, radius: 2000 },
  { name: "Sector 102-105 (Dwarka Exp North)", lat: 28.4866, lng: 76.9882, radius: 3000 }, // FIXED — was 6.1km off
  { name: "Sector 108-110 (Dwarka Exp Far North)", lat: 28.5180, lng: 76.9850, radius: 3000 }, // FIXED — was 5.6km off

  // 7. PALAM VIHAR / SECTOR 22-23
  { name: "Palam Vihar & Sector 23A", lat: 28.5107, lng: 77.0370, radius: 2500 },
  { name: "Sector 22-23A (Near Delhi Border)", lat: 28.5072, lng: 77.0640, radius: 2000 },

  // 8. SOUTH-WEST / HERO HONDA CORRIDOR
  { name: "Hero Honda Chowk & Sector 37C-40", lat: 28.4480, lng: 77.0200, radius: 2000 },
  { name: "Sector 9, 10 & 10A (Basai Road)", lat: 28.4720, lng: 76.9950, radius: 2000 },

  // 9. MANESAR / IMT
  { name: "Manesar Town & IMT Manesar", lat: 28.3515, lng: 76.9428, radius: 3500 },
  // 10. SOHNA (standalone sub-city)
  { name: "Sohna Town", lat: 28.2486, lng: 77.0730, radius: 3000 },

  { name: "Sector 82-83 (NH8 / Vatika Belt)", lat: 28.3930, lng: 76.9680, radius: 2500 },
  { name: "Sector 95-99 (SPR / New Gurgaon West)", lat: 28.4406, lng: 76.9350, radius: 4000 },
  { name: "IMT Manesar Industrial (Sector 1-11)", lat: 28.3650, lng: 76.9000, radius: 3000 },

  { name: "Golf Course Road (Sector 42-54 Belt)", lat: 28.4510, lng: 77.0900, radius: 2000 },

  { name: "Udyog Vihar (Phase 1-6)", lat: 28.4970, lng: 77.0720, radius: 2000 },

  { name: "SPR / Sector 69-75 (South Gurgaon)", lat: 28.4020, lng: 77.0880, radius: 2500 },
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

  const hubs = cityKey === "gurugram" ? CITY_HUBS : [{ name: city.name, lat: null, lng: null, radius: null }];

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
      "gurugram",
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
