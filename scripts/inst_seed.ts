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
  { name: "Old Ghaziabad (Ghantaghar & Delhi Gate)", lat: 28.6702, lng: 77.4446, radius: 2500 },
  { name: "Kavi Nagar & Nehru Nagar", lat: 28.6660, lng: 77.4330, radius: 2000 },
  { name: "Raj Nagar", lat: 28.7041, lng: 77.4306, radius: 2000 },
  { name: "Raj Nagar Extension", lat: 28.7034, lng: 77.4145, radius: 3000 },
  { name: "Sanjay Nagar & Shastri Nagar", lat: 28.6850, lng: 77.4300, radius: 2000 },
  { name: "Vijay Nagar", lat: 28.6445, lng: 77.4257, radius: 2000 },
  { name: "Mohan Nagar & GT Road", lat: 28.6725, lng: 77.3590, radius: 2500 },
  { name: "Sahibabad", lat: 28.6629, lng: 77.3434, radius: 2500 },
  { name: "Vaishali", lat: 28.6434, lng: 77.3401, radius: 2000 },
  { name: "Kaushambi", lat: 28.6435, lng: 77.3230, radius: 1500 },
  { name: "Indirapuram Core (Shakti Khand & Ahinsa Khand)", lat: 28.6460, lng: 77.3590, radius: 2500 },
  { name: "Indirapuram East (Niti Khand & Vaibhav Khand)", lat: 28.6360, lng: 77.3790, radius: 2500 },
  { name: "Vasundhara", lat: 28.6628, lng: 77.3734, radius: 2500 },
  { name: "Crossing Republik", lat: 28.6303, lng: 77.4349, radius: 2500 },
  { name: "Govindpuram & Lal Kuan (Meerut Road)", lat: 28.6975, lng: 77.4180, radius: 3000 },
  { name: "Loni", lat: 28.7505, lng: 77.2890, radius: 3500 },
  { name: "Muradnagar", lat: 28.7809, lng: 77.4987, radius: 3500 },
  { name: "Modinagar", lat: 28.8383, lng: 77.5811, radius: 3000 },
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

  const hubs = cityKey === "ghaziabad" ? CITY_HUBS : [{ name: city.name, lat: null, lng: null, radius: null }];

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
      "ghaziabad",
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
