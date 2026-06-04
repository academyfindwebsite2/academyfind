import "dotenv/config";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CITY_HUBS: Record<string, string[]> = {
  noida: [
    "Sector 62",
    "Sector 15",
    "Sector 18",
    "Sector 93",
    "Sector 50",
    "Sector 27",
  ],

  delhi: [
    "Mukherjee Nagar",
    "Rajendra Nagar",
    "Kalu Sarai",
    "Laxmi Nagar",
    "Dwarka",
    "Rohini",
    "Connaught Place",
  ],

  mumbai: [
    "Andheri West",
    "Dadar",
    "Borivali East",
    "Ghatkopar",
    "Vashi",
  ],

  bangalore: [
    "Koramangala",
    "HSR Layout",
    "Indiranagar",
    "Jayanagar",
    "Malleswaram",
  ],

  hyderabad: [
    "Ameerpet",
    "Kukatpally",
    "Madhapur",
    "Gachibowli",
  ],

  chennai: [
    "Anna Nagar",
    "Adyar",
    "Velachery",
    "T Nagar",
    "Tambaram",
  ],

  kolkata: [
    "Salt Lake",
    "Park Street",
    "Dum Dum",
    "Howrah",
    "Garia",
  ],

  ahmedabad: [
    "Navrangpura",
    "Satellite",
    "Vastrapur",
    "Maninagar",
    "CG Road",
  ],

  surat: [
    "Adajan",
    "Vesu",
    "Varachha",
    "Athwa",
  ],

  jaipur: [
    "Malviya Nagar",
    "Mansarovar",
    "Vaishali Nagar",
    "Gopalpura",
  ],

  kota: [
    "Rajeev Gandhi Nagar",
    "Jawahar Nagar",
    "Talwandi",
    "Kunhari",
  ],

  bikaner: [
    "Vyas Colony",
    "Rani Bazar",
    "Pawan Puri",
    "Mukta Prasad",
    "Gangashahar",
  ],

  lucknow: [
    "Hazratganj",
    "Gomti Nagar",
    "Aliganj",
    "Indira Nagar",
    "Alambagh",
  ],

  kanpur: [
    "Kakadeo",
    "Swaroop Nagar",
    "Mall Road",
    "Govind Nagar",
  ],

  gurgaon: [
    "Sector 14",
    "Sector 29",
    "DLF Phase 1",
    "DLF Phase 3",
    "Golf Course Road",
  ],

  faridabad: [
    "NIT",
    "Sector 15",
    "Sector 16",
    "Sector 21C",
  ],

  chandigarh: [
    "Sector 17",
    "Sector 22",
    "Sector 34",
    "Sector 35",
  ],

  patna: [
    "Boring Road",
    "Kankarbagh",
    "Rajendra Nagar",
    "Ashok Rajpath",
  ],

  indore: [
    "Vijay Nagar",
    "Bhawarkua",
    "Palasia",
    "Geeta Bhawan",
  ],

  bhopal: [
    "MP Nagar",
    "Arera Colony",
    "New Market",
    "Kolar Road",
  ],

  nagpur: [
    "Dharampeth",
    "Ramdaspeth",
    "Sitabuldi",
    "Wardha Road",
  ],

  pune: [
    "Kothrud",
    "Hinjewadi",
    "Viman Nagar",
    "Hadapsar",
  ],

  bhubaneswar: [
    "Patia",
    "Saheed Nagar",
    "Nayapalli",
    "Unit 4",
  ],
};

async function searchPlaces(query: string) {
  const allPlaces: any[] = [];

  let pageToken: string | undefined;

  do {
    const body: any = {
      textQuery: query,
      pageSize: 20,
    };

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

          "X-Goog-FieldMask":
            [
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
      console.error(
        `HTTP ${response.status} for query: ${query}`
      );
      break;
    }

    const data = await response.json();

    if(data.error){
      console.error(
        `Google API Error for query: ${query}`,data.error
      );
      break;
    }

    allPlaces.push(...(data.places || []));

    pageToken = data.nextPageToken;

    if (pageToken) {
      await sleep(2000);
    }
  } while (pageToken);

  return allPlaces;
}

function getImageUrl(photoName: string) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&key=${GOOGLE_API_KEY}`;
}

async function importCategoryCity(
  category: any,
  city: any
) {
  const cityKey = city.slug
    .toLowerCase()
    .trim();

  const hubs =
    CITY_HUBS[cityKey] || [
      city.name,
    ];

  console.log(
    `\n🚀 ${category.name} -> ${city.name}`
  );

  const uniquePlaces =
    new Map<string, any>();

  for (const hub of hubs) {
    const query =
      `${category.name} near ${hub}, ${city.name}`;

    console.log(
      `🔍 ${query}`
    );

    const places =
      await searchPlaces(query);

    console.log(
      `Returned: ${places.length}`
    );

    for (const place of places) {
      uniquePlaces.set(
        place.id,
        place
      );
    }

    await sleep(500);
  }

  const places =
    Array.from(
      uniquePlaces.values()
    );

  console.log(
    `🎯 Unique: ${places.length}`
  );

  for (const place of places) {
    try {
      if (
        !place.displayName?.text
      )
        continue;

      const imageUrl =
        place.photos?.[0]?.name
          ? getImageUrl(
              place.photos[0]
                .name
            )
          : null;

      const slug =
        `${slugify(
          place.displayName.text,
          {
            lower: true,
            strict: true,
          }
        )}-${place.id.slice(
          0,
          6
        )}`;

      const institute =
        await prisma.institute.upsert({
          where: {
            googlePlaceId:
              place.id,
          },

          update: {
            website:
              place.websiteUri ??
              null,

            phone:
              place.nationalPhoneNumber ??
              null,

            googleRating:
              place.rating ??
              0,

            googleReviewCount:
              place.userRatingCount ??
              0,

            imageUrl,
          },

          create: {
            name:
              place.displayName
                .text,

            slug,

            address:
              place.formattedAddress,

            latitude:
              place.location
                ?.latitude ??
              null,

            longitude:
              place.location
                ?.longitude ??
              null,

            website:
              place.websiteUri ??
              null,

            phone:
              place.nationalPhoneNumber ??
              null,

            googlePlaceId:
              place.id,

            googleRating:
              place.rating ??
              0,

            googleReviewCount:
              place.userRatingCount ??
              0,

            googleMapsUrl:
              place.googleMapsUri ??
              null,

            imageUrl,

            cityId:
              city.id,
          },
        });

      await prisma.instituteCategory.upsert({
        where: {
          instituteId_categoryId:
            {
              instituteId:
                institute.id,

              categoryId:
                category.id,
            },
        },

        update: {},

        create: {
          instituteId:
            institute.id,

          categoryId:
            category.id,
        },
      });

      console.log(
        `✅ ${institute.name}`
      );

      await sleep(200);
    } catch (error) {
      console.error(error);
    }
  }
}

async function main() {
  const categories =
    await prisma.category.findMany({
      where: {
        level: 2,
        isActive: true,
      },
    });

  const cities =
    await prisma.city.findMany();

  console.log(
    `Categories: ${categories.length}`
  );

  console.log(
    `Cities: ${cities.length}`
  );

  // TEST MODE
  const selectedCategories =
    categories.filter((c) =>
      [
        "jee-coaching",
        "neet-coaching",
        "upsc-coaching",
        "cuet-coaching",
        "banking-coaching",
        "clat-coaching",
        "ssc-coaching",
        "railway-coaching",
        "cat-coaching",
        "gate-coaching",
        "ca-coaching",
        "ielts-coaching",
        "gmat-coaching",
        "web-development",
        "cyber-security-training",
        "english-speaking",
        "dance-classes",
        "music-classes",
        "cricket-academy",
        "football-academy",
        "abacus-classes",
        "chess-academy",
        "yoga-classes",
        "martial-arts",
      ].includes(c.slug)
    );

  const selectedCities = cities.filter((c) =>
  [
    "delhi",
    "mumbai",
    "pune",
    "nagpur",
    "bangalore",
    "hyderabad",
    "chennai",
    "kolkata",
    "ahmedabad",
    "surat",
    "jaipur",
    "kota",
    "sikar",
    "jodhpur",
    "lucknow",
    "kanpur",
    "noida",
    "gurgaon",
    "faridabad",
    "chandigarh",
    "patna",
    "indore",
    "bhopal",
    "bhubaneswar",
    "gwalior",
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

  console.log(
    "\n🎉 Import Completed"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });