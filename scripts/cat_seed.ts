import { prisma } from "../lib/prisma";

const categories = [
  {
    name: "Academic Coaching",
    slug: "academic-coaching",
    children: [
      {
        name: "School Tuition",
        slug: "school-tuition",
        children: [
          { name: "Class 1 Tuition", slug: "class-1-tuition" },
          { name: "Class 2 Tuition", slug: "class-2-tuition" },
          { name: "Class 3 Tuition", slug: "class-3-tuition" },
          { name: "Class 4 Tuition", slug: "class-4-tuition" },
          { name: "Class 5 Tuition", slug: "class-5-tuition" },
          { name: "Class 6 Tuition", slug: "class-6-tuition" },
          { name: "Class 7 Tuition", slug: "class-7-tuition" },
          { name: "Class 8 Tuition", slug: "class-8-tuition" },
          { name: "Class 9 Tuition", slug: "class-9-tuition" },
          { name: "Class 10 Tuition", slug: "class-10-tuition" },
          { name: "Class 11 Tuition", slug: "class-11-tuition" },
          { name: "Class 12 Tuition", slug: "class-12-tuition" },
          { name: "Online Tuition", slug: "online-tuition" },
          { name: "Home Tuition", slug: "home-tuition" },
        ],
      },
      {
        name: "Engineering",
        slug: "engineering",
        children: [
          { name: "JEE Coaching", slug: "jee-coaching" },
          { name: "Foundation Courses", slug: "foundation-courses" },
          { name: "Olympiad Coaching", slug: "olympiad-coaching" },
        ],
      },
      {
        name: "Medical",
        slug: "medical",
        children: [
          { name: "NEET Coaching", slug: "neet-coaching" },
          { name: "Nursing Entrance", slug: "nursing-entrance-coaching" },
        ],
      },
      {
        name: "University Entrance",
        slug: "university-entrance",
        children: [
          { name: "CUET Coaching", slug: "cuet-coaching" }
        ],
      },
    ],
  },

  {
    name: "Government Exams",
    slug: "government-exams",
    children: [
      {
        name: "Civil Services",
        slug: "civil-services",
        children: [
          { name: "UPSC Coaching", slug: "upsc-coaching" },
          { name: "State PCS Coaching", slug: "state-pcs-coaching" },
        ],
      },
      {
        name: "SSC",
        slug: "ssc",
        children: [{ name: "SSC Coaching", slug: "ssc-coaching" }],
      },
      {
        name: "Banking",
        slug: "banking",
        children: [{ name: "Banking Coaching", slug: "banking-coaching" }],
      },
      {
        name: "Railway",
        slug: "railway",
        children: [{ name: "Railway Coaching", slug: "railway-coaching" }],
      },
      {
        name: "Defence",
        slug: "defence",
        children: [
          { name: "NDA Coaching", slug: "nda-coaching" },
          { name: "CDS Coaching", slug: "cds-coaching" },
          { name: "AFCAT Coaching", slug: "afcat-coaching" },
        ],
      },
      {
        name: "Teaching Exams",
        slug: "teaching-exams",
        children: [
          { name: "UGC NET Coaching", slug: "ugc-net-coaching" },
          { name: "CSIR NET Coaching", slug: "csir-net-coaching" },
          { name: "CTET Coaching", slug: "ctet-coaching" },
          { name: "TET Coaching", slug: "tet-coaching" },
        ],
      },
    ],
  },

  {
    name: "Higher Education & Professional",
    slug: "higher-education-professional",
    children: [
      {
        name: "Management",
        slug: "management",
        children: [{ name: "CAT Coaching", slug: "cat-coaching" }],
      },
      {
        name: "Engineering",
        slug: "engineering-professional",
        children: [{ name: "GATE Coaching", slug: "gate-coaching" }],
      },
      {
        name: "Law",
        slug: "law",
        children: [
          { name: "CLAT Coaching", slug: "clat-coaching" },
          { name: "Judiciary Coaching", slug: "judiciary-coaching" },
        ],
      },
      {
        name: "Commerce",
        slug: "commerce",
        children: [
          { name: "CA Coaching", slug: "ca-coaching" },
          { name: "CS Coaching", slug: "cs-coaching" },
          { name: "CMA Coaching", slug: "cma-coaching" },
        ],
      },
    ],
  },

  {
    name: "Study Abroad",
    slug: "study-abroad",
    children: [
      {
        name: "Language Tests",
        slug: "language-tests",
        children: [
          { name: "IELTS Coaching", slug: "ielts-coaching" },
          { name: "TOEFL Coaching", slug: "toefl-coaching" },
          { name: "PTE Coaching", slug: "pte-coaching" },
        ],
      },
      {
        name: "Undergraduate Admissions",
        slug: "undergraduate-admissions",
        children: [{ name: "SAT Coaching", slug: "sat-coaching" }],
      },
      {
        name: "Graduate Admissions",
        slug: "graduate-admissions",
        children: [
          { name: "GRE Coaching", slug: "gre-coaching" },
          { name: "GMAT Coaching", slug: "gmat-coaching" },
        ],
      },
      {
        name: "Consulting",
        slug: "consulting",
        children: [
          { name: "Study Abroad Consultants", slug: "study-abroad-consultants" },
          { name: "MBBS Abroad Consultancy", slug: "mbbs-abroad-consultancy" },
        ],
      },
    ],
  },

  {
    name: "Computer & Technology",
    slug: "computer-technology",
    children: [
      {
        name: "Programming",
        slug: "programming",
        children: [
          { name: "Coding Classes", slug: "coding-classes" },
          { name: "Web Development", slug: "web-development" },
          { name: "App Development", slug: "app-development" },
          { name: "Software Testing", slug: "software-testing" },
        ],
      },
      {
        name: "Data & AI",
        slug: "data-ai",
        children: [
          { name: "Data Science Training", slug: "data-science-training" },
          { name: "AI & ML Courses", slug: "ai-ml-courses" },
        ],
      },
      {
        name: "Cloud & Infrastructure",
        slug: "cloud-infrastructure",
        children: [
          { name: "Cloud Computing", slug: "cloud-computing" },
          { name: "AWS Training", slug: "aws-training" },
          { name: "DevOps Training", slug: "devops-training" },
        ],
      },
      {
        name: "Security",
        slug: "security",
        children: [
          { name: "Cyber Security Training", slug: "cyber-security-training" },
        ],
      },
      {
        name: "Design & Multimedia",
        slug: "design-multimedia",
        children: [
          { name: "UI/UX Design", slug: "ui-ux-design" },
          { name: "Graphic Design", slug: "graphic-design" },
          { name: "Video Editing", slug: "video-editing" },
          { name: "Animation & VFX", slug: "animation-vfx" },
        ],
      },
    ],
  },

  {
    name: "Business & Professional Skills",
    slug: "business-professional-skills",
    children: [
      {
        name: "Marketing & Sales",
        slug: "marketing-sales",
        children: [
          { name: "Digital Marketing", slug: "digital-marketing" },
          { name: "Sales Training", slug: "sales-training" },
        ],
      },
      {
        name: "Finance & Accounting",
        slug: "finance-accounting",
        children: [
          { name: "Stock Market Training", slug: "stock-market-training" },
          { name: "Financial Modelling", slug: "financial-modelling" },
          { name: "Tally & GST Training", slug: "tally-gst-training" },
        ],
      },
      {
        name: "Management",
        slug: "business-management",
        children: [
          { name: "Business Analytics", slug: "business-analytics" },
          { name: "Project Management", slug: "project-management" },
          { name: "HR Training", slug: "hr-training" },
          { name: "Entrepreneurship", slug: "entrepreneurship-training" },
        ],
      },
      {
        name: "Career Prep",
        slug: "career-prep",
        children: [
          { name: "Interview Preparation", slug: "interview-preparation" },
          { name: "Resume Building", slug: "resume-building" },
          { name: "Employability Training", slug: "employability-training" },
          { name: "Career Counselling", slug: "career-counselling" },
        ],
      },
    ],
  },

  {
    name: "Vocational & Job-Oriented",
    slug: "vocational-job-oriented",
    children: [
      {
        name: "Healthcare Vocations",
        slug: "healthcare-vocations",
        children: [
          { name: "Medical Coding", slug: "medical-coding" },
          { name: "Medical Lab Technician", slug: "medical-lab-technician" },
        ],
      },
      {
        name: "Hospitality & Aviation",
        slug: "hospitality-aviation",
        children: [
          { name: "Hotel Management", slug: "hotel-management-coaching" },
          { name: "Aviation & Cabin Crew", slug: "aviation-cabin-crew" },
        ],
      },
      {
        name: "Lifestyle & Creative",
        slug: "lifestyle-creative",
        children: [
          { name: "Beauty & Makeup", slug: "beauty-makeup-courses" },
          { name: "Culinary & Baking", slug: "culinary-baking-classes" },
          { name: "Fashion Designing", slug: "fashion-designing" },
          { name: "Interior Designing", slug: "interior-designing" },
        ],
      },
    ],
  },

  {
    name: "Language Learning",
    slug: "language-learning",
    children: [
      {
        name: "English & Hindi",
        slug: "english-hindi",
        children: [
          { name: "Spoken English", slug: "spoken-english" },
          { name: "Spoken Hindi", slug: "spoken-hindi" },
        ],
      },
      {
        name: "European Languages",
        slug: "european-languages",
        children: [
          { name: "French Classes", slug: "french-classes" },
          { name: "German Classes", slug: "german-classes" },
          { name: "Spanish Classes", slug: "spanish-classes" },
        ],
      },
      {
        name: "Asian Languages",
        slug: "asian-languages",
        children: [
          { name: "Japanese Classes", slug: "japanese-classes" },
          { name: "Korean Classes", slug: "korean-classes" },
        ],
      },
    ],
  },

  {
    name: "Arts & Creativity",
    slug: "arts-creativity",
    children: [
      {
        name: "Performing Arts",
        slug: "performing-arts",
        children: [
          { name: "Dance Classes", slug: "dance-classes" },
          { name: "Music Classes", slug: "music-classes" },
          { name: "Singing Classes", slug: "singing-classes" },
          { name: "Theatre & Acting", slug: "theatre-acting" },
        ],
      },
      {
        name: "Musical Instruments",
        slug: "musical-instruments",
        children: [
          { name: "Guitar Classes", slug: "guitar-classes" },
          { name: "Piano Classes", slug: "piano-classes" },
          { name: "Tabla Classes", slug: "tabla-classes" },
          { name: "Violin Classes", slug: "violin-classes" },
        ],
      },
      {
        name: "Visual Arts",
        slug: "visual-arts",
        children: [
          { name: "Drawing & Painting", slug: "drawing-painting" },
          { name: "Fine Arts", slug: "fine-arts" },
          { name: "Sketching", slug: "sketching" },
          { name: "Art & Craft Classes", slug: "art-craft-classes" },
        ],
      },
    ],
  },

  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    children: [
      {
        name: "Water Sports",
        slug: "water-sports",
        children: [{ name: "Swimming Classes", slug: "swimming-classes" }],
      },
      {
        name: "Team Sports",
        slug: "team-sports",
        children: [
          { name: "Cricket Academy", slug: "cricket-academy" },
          { name: "Football Academy", slug: "football-academy" },
          { name: "Basketball Academy", slug: "basketball-academy" },
        ],
      },
      {
        name: "Racquet Sports",
        slug: "racquet-sports",
        children: [
          { name: "Badminton Academy", slug: "badminton-academy" },
          { name: "Tennis Academy", slug: "tennis-academy" },
        ],
      },
      {
        name: "Athletics & Movement",
        slug: "athletics-movement",
        children: [
          { name: "Gymnastics", slug: "gymnastics" },
          { name: "Skating Classes", slug: "skating-classes" },
          { name: "Athletics", slug: "athletics" },
        ],
      },
      {
        name: "Wellness & Combat",
        slug: "wellness-combat",
        children: [
          { name: "Yoga Classes", slug: "yoga-classes" },
          { name: "Martial Arts", slug: "martial-arts" },
          { name: "Karate", slug: "karate" },
          { name: "Taekwondo", slug: "taekwondo" },
        ],
      },
    ],
  },

  {
    name: "Kids & Hobby Learning",
    slug: "kids-hobby-learning",
    children: [
      {
        name: "Early Education",
        slug: "early-education",
        children: [
          { name: "Phonics", slug: "phonics" },
          { name: "Preschool Programs", slug: "preschool-programs" },
          { name: "Handwriting Improvement", slug: "handwriting-improvement" },
        ],
      },
      {
        name: "Skill Development",
        slug: "skill-development",
        children: [
          { name: "Abacus Classes", slug: "abacus-classes" },
          { name: "Vedic & Mental Maths", slug: "vedic-mental-maths" },
          { name: "Robotics & STEM", slug: "robotics-stem" },
          { name: "Coding for Kids", slug: "coding-for-kids" },
        ],
      },
      {
        name: "Mind Sports",
        slug: "mind-sports",
        children: [{ name: "Chess Academy", slug: "chess-academy" }],
      },
      {
        name: "Personality Growth",
        slug: "personality-growth",
        children: [
          { name: "Personality Development", slug: "personality-development" },
          { name: "Public Speaking", slug: "public-speaking" },
          { name: "Life Coach", slug: "life-coach" },
        ],
      },
    ],
  },
];

async function createCategory(
  category: any,
  parentId: string | null = null,
  level = 0
) {
  const created = await prisma.category.upsert({
    where: {
      slug: category.slug,
    },
    update: {
      parentId,
      level,
    },
    create: {
      name: category.name,
      slug: category.slug,
      parentId,
      level,
    },
  });

  if (category.children?.length) {
    for (const child of category.children) {
      await createCategory(child, created.id, level + 1);
    }
  }
}

async function main() {
  for (const category of categories) {
    await createCategory(category);
  }

  const count = await prisma.category.count();

  console.log(`✅ Categories Seeded (${count} categories)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });