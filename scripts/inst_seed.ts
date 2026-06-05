import "dotenv/config";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// THE ULTIMATE 47-HUB GRID FOR NOIDA & GREATER NOIDA
const CITY_HUBS = [
  // 1. DENSE COACHING HUBS
  { name: "Sector 62", lat: 28.6215, lng: 77.3639, radius: 1500 },
  { name: "Sector 15 & 16 Metro Hub", lat: 28.5785, lng: 77.3182, radius: 1500 },
  { name: "Sector 18 (Atta Market)", lat: 28.5705, lng: 77.3260, radius: 1500 },
  { name: "Sector 27 & 28", lat: 28.5802, lng: 77.3330, radius: 1500 },
  { name: "Sector 50 & 51", lat: 28.5750, lng: 77.3690, radius: 1500 },
  
  // 2. MIXED RESIDENTIAL/COMMERCIAL CLUSTERS
  { name: "Sector 11 & 12 Cluster", lat: 28.5992, lng: 77.3315, radius: 2000 },
  { name: "Sector 22 & 24 Cluster", lat: 28.5940, lng: 77.3505, radius: 2000 },
  { name: "Sector 34 & 35 (Near City Centre)", lat: 28.5772, lng: 77.3524, radius: 2000 },
  { name: "Sector 41, 44 & 45 Area", lat: 28.5580, lng: 77.3450, radius: 2000 },
  { name: "Sector 49 & 48 Barola Area", lat: 28.5570, lng: 77.3680, radius: 2000 },
  { name: "Sector 55 & 56 Khora Border", lat: 28.6080, lng: 77.3480, radius: 2000 },
  { name: "Sector 61 & 70 Cluster", lat: 28.5980, lng: 77.3750, radius: 2000 },
  { name: "Sector 73, 74 & 75", lat: 28.5880, lng: 77.3890, radius: 2000 },
  { name: "Sector 76, 77 & 78 Cluster", lat: 28.5720, lng: 77.3950, radius: 2000 },
  { name: "Sector 93 & 82", lat: 28.5280, lng: 77.3910, radius: 2000 },
  { name: "Sector 100, 104 & 107", lat: 28.5440, lng: 77.3730, radius: 2000 },
  { name: "Sector 110 & Phase 2 Area", lat: 28.5350, lng: 77.4100, radius: 2000 }, 
  { name: "Sector 119 & 120 Cluster", lat: 28.5910, lng: 77.4020, radius: 1500 }, 
  { name: "Sector 121 & 122 Area", lat: 28.5990, lng: 77.4140, radius: 2000 }, 
  { name: "Sector 137", lat: 28.5140, lng: 77.4120, radius: 2000 },
  
  // 3. NOIDA EXTENSION / GAUR CITY DENSE NODES
  { name: "Gaur City / Sector 4 Noida Extension", lat: 28.6095, lng: 77.4410, radius: 2500 },
  { name: "Techzone 4 / Knowledge Park 5 Node", lat: 28.5820, lng: 77.4560, radius: 2500 },
  { name: "Sector 1 / Bisrakh (Deep Extension)", lat: 28.5950, lng: 77.4450, radius: 2000 },
  { name: "Crossings Republik Border", lat: 28.6300, lng: 77.4350, radius: 1500 },

  // 4. GREATER NOIDA MAJOR COACHING NODES
  { name: "Pari Chowk & Alpha 1/2", lat: 28.4670, lng: 77.5120, radius: 2000 },
  { name: "Beta 1 & Gamma 1", lat: 28.4810, lng: 77.5090, radius: 2000 },
  { name: "Knowledge Park 1 & 2", lat: 28.4640, lng: 77.4910, radius: 2000 },
  { name: "Knowledge Park 3 & Delta 1 Area", lat: 28.4830, lng: 77.4840, radius: 2000 },
  { name: "Surajpur Area", lat: 28.5200, lng: 77.4900, radius: 2500 }, 
  { name: "Kasna / UPSIDC Area", lat: 28.4230, lng: 77.5250, radius: 2000 }, 
  { name: "Dadri Main Road / Ecotech II", lat: 28.5440, lng: 77.4850, radius: 2000 },

  // 5. HIGH-DENSITY URBAN VILLAGES & LOCAL MARKETS
  { name: "Bhangel Main Market", lat: 28.5365, lng: 77.4045, radius: 1200 },
  { name: "Mamura Village", lat: 28.6035, lng: 77.3745, radius: 1200 },
  { name: "Harola Sector 5 Market", lat: 28.5905, lng: 77.3265, radius: 1200 },
  { name: "Nithari Sector 31 Area", lat: 28.5785, lng: 77.3455, radius: 1200 },
  { name: "Chhalera Sector 44", lat: 28.5595, lng: 77.3540, radius: 1000 },

  // 6. NEW EMERGING & TRANSIT NODES
  { name: "Sector 63", lat: 28.6250, lng: 77.3820, radius: 1500 },
  { name: "Sector 125 & 126", lat: 28.5440, lng: 77.3325, radius: 1500 },
  { name: "Sector 102 & 101", lat: 28.5410, lng: 77.3910, radius: 1200 },
  { name: "Khora Colony", lat: 28.6185, lng: 77.3400, radius: 1200 },
  { name: "Sector 132 & 135", lat: 28.5020, lng: 77.3710, radius: 2000 },
  { name: "Sector 150", lat: 28.4350, lng: 77.4650, radius: 2500 }, 
  { name: "Botanical Garden / Sector 38", lat: 28.5640, lng: 77.3340, radius: 1500 },
  { name: "Sector 16B", lat: 28.6040, lng: 77.4330, radius: 2000 },
  { name: "Sector 142 & 143", lat: 28.5020, lng: 77.4080, radius: 2000 },
  { name: "Sector 52 & 53 / Hoshyarpur", lat: 28.5840, lng: 77.3550, radius: 1500 },
  { name: "Zeta, Eta & Omicron Cluster", lat: 28.5080, lng: 77.4980, radius: 2000 }
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

  const hubs = cityKey === "noida" ? CITY_HUBS : [{ name: city.name, lat: null, lng: null, radius: null }];

  console.log(`\n🚀 Processing: ${category.name} -> ${city.name}`);

  const uniquePlaces = new Map<string, any>();

  console.log(`Processing ${hubs.length} hubs`);

  for (const hub of hubs) {
    console.log(`📍 Scanning Hub Area: ${hub.name || city.name}`);
    
    let places: any[] = [];
    
    if (hub.lat !== null && hub.lng !== null) {
      // Clean query: Let the Bounding Box do the filtering work
      places = await searchPlaces(`${category.name}`, { lat: hub.lat, lng: hub.lng, radius: hub.radius });
    } else {
      places = await searchPlaces(`${category.name} in ${city.name}`);
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
          imageUrl,
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

  const selectedCategories =
    categories.filter((c) =>
      [
        // "jee-coaching",
        // "neet-coaching",
        // "upsc-coaching",
        // "cuet-coaching",
        // "banking-coaching",
        // "clat-coaching",
        // "ssc-coaching",
        // "railway-coaching",
        // "cat-coaching",
        // "gate-coaching",
        // "ca-coaching",
        // "ielts-coaching",
        // "gre-coaching",
        // "web-development",
        // "cyber-security-training",
        // "english-speaking",
        // "dance-classes",
        // "music-classes",
        // "cricket-academy",
        // "football-academy",
        // "abacus-classes",
        // "chess-academy",
        // "yoga-classes",
        // "martial-arts",
        // "coding-classes",
        // "commerce-coaching",
        "law-coaching",
        // "swimming-classes"
      ].includes(c.slug)
    );

  const selectedCities = cities.filter((c) =>
    [
      "noida",
    ].includes(c.slug)
  );

  for (const category of selectedCategories) {
    for (const city of selectedCities) {
      await importCategoryCity(
        category,
        city
      );
    }
  }

  console.log("\n🎉 Import Completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });