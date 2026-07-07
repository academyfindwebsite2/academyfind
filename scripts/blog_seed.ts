import { prisma } from "../lib/prisma";
import slugify from "slugify";

async function main() {
  console.log("Seeding blog database...");

  // 1. Get or Create a User for Author Profile
  let user = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!user) {
    user = await prisma.user.findFirst();
  }

  if (!user) {
    console.log("No users found. Creating a default admin user...");
    user = await prisma.user.create({
      data: {
        name: "AcademyFind Editor",
        email: "editor@academyfind.com",
        username: "academyfind_editor",
        role: "ADMIN",
        isActive: true,
      },
    });
  }

  console.log(`Using user: ${user.name} (${user.email}) for author profile`);

  // 2. Create Blog Author Profile
  const authorProfile = await prisma.blogAuthorProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      displayName: user.name || "AcademyFind Editorial",
      username: "academyfind_editor",
      designation: "Chief Editor",
      experience: 8,
      specialization: "Coaching & Career Guidance",
      bio: "Expert writer and educational consultant at AcademyFind, specializing in exam patterns, preparation strategies, and coaching institute reviews.",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
    },
    update: {},
  });

  console.log(`Author Profile set up: ${authorProfile.displayName}`);

  // 3. Create Categories
  const categoriesData = [
    { name: "JEE", slug: "jee", description: "JEE Main & Advanced preparation tips, coaching reviews, and counseling updates.", color: "amber", order: 1 },
    { name: "NEET", slug: "neet", description: "NEET prep strategy, cut-offs, syllabus analysis, and expert guidance.", color: "emerald", order: 2 },
    { name: "CUET", slug: "cuet", description: "Common University Entrance Test notifications, tips, and books.", color: "indigo", order: 3 },
    { name: "UPSC", slug: "upsc", description: "IAS, IPS, and Civil Services preparation guides, optional subject choices, and interview reviews.", color: "blue", order: 4 },
    { name: "CAT", slug: "cat", description: "Common Admission Test prep tips, IIM reviews, and preparation roadmaps.", color: "orange", order: 5 },
    { name: "SSC", slug: "ssc", description: "SSC CGL, CHSL, and other government job exam updates and strategies.", color: "violet", order: 6 },
    { name: "CLAT", slug: "clat", description: "Common Law Admission Test advice, legal careers, and law school guides.", color: "rose", order: 7 },
    { name: "NDA", slug: "nda", description: "National Defence Academy exam strategy, physical tests, and interview guidance.", color: "cyan", order: 8 },
    { name: "Study Tips", slug: "study-tips", description: "Study hacks, revision schedules, memory tricks, and productivity guides.", color: "slate", order: 9 },
    { name: "Career", slug: "career", description: "Career options, stream choices, college reviews, and professional paths.", color: "pink", order: 10 },
    { name: "Admissions", slug: "admissions", description: "University admissions, counselling procedures, and seat allocation updates.", color: "teal", order: 11 },
    { name: "Scholarships", slug: "scholarships", description: "National and international scholarships, fellowships, and financial aid guides.", color: "green", order: 12 },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.blogCategory.upsert({
        where: { slug: cat.slug },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color: cat.color,
          order: cat.order,
          isActive: true,
        },
        update: {
          name: cat.name,
          description: cat.description,
          color: cat.color,
          order: cat.order,
        },
      })
    )
  );

  console.log(`Seeded ${categories.length} blog categories`);

  // 4. Create Tags
  const tagsData = ["JEE Main", "NEET Prep", "Kota Coaching", "UPSC Strategy", "Study Hacks", "Admission Guide", "CUET 2026", "Revision Tips"];
  const tags = await Promise.all(
    tagsData.map((tagName) => {
      const slug = slugify(tagName, { lower: true, strict: true, trim: true });
      return prisma.blogTag.upsert({
        where: { slug },
        create: { name: tagName, slug },
        update: {},
      });
    })
  );

  console.log(`Seeded ${tags.length} blog tags`);

  // 5. Create Brands
  const brandsData = [
    { name: "Allen Career Institute", slug: "allen", bio: "India's premier coaching institute for JEE and NEET preparation." },
    { name: "FIITJEE", slug: "fiitjee", bio: "Leading coaching institute for JEE and competitive exams." },
    { name: "Resonance", slug: "resonance", bio: "Highly reputed coaching institute in Kota." },
  ];

  const brands = await Promise.all(
    brandsData.map((brand) =>
      prisma.blogBrand.upsert({
        where: { slug: brand.slug },
        create: {
          name: brand.name,
          slug: brand.slug,
          bio: brand.bio,
          isActive: true,
        },
        update: {},
      })
    )
  );

  console.log(`Seeded ${brands.length} blog brands`);

  // 6. Seed Blog Posts
  const postsData = [
    {
      title: "Best JEE Coaching Institutes in Kota (2026 Complete Guide)",
      slug: "best-jee-coaching-institutes-kota",
      excerpt: "Compare top JEE coaching institutes in Kota based on faculty, results, fees, hostel facilities and student reviews.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
      categorySlug: "jee",
      readTime: 8,
      isFeatured: true,
      featuredOrder: 1,
      content: `
        <p>Choosing the right JEE coaching institute in Kota is one of the most critical decisions in an engineering aspirant's journey. Known as India's coaching capital, Kota attracts over 2 lakh students annually. But with dozens of options, which one is best for you?</p>
        <h2>Top JEE Coaching Institutes in Kota</h2>
        <p>Here is a detailed comparison of the top institutes based on recent results, faculty experience, and infrastructure:</p>
        <h3>1. Allen Career Institute</h3>
        <p>Allen is currently the largest coaching institute in Kota with state-of-the-art campuses and a highly structured teaching methodology. Their study material and test series are considered the gold standard for JEE Main & Advanced.</p>
        <h3>2. Resonance</h3>
        <p>Resonance is known for its academic discipline and excellent faculty pool. Their revision packages and mock test analyses help students identify weak areas and improve ranks systematically.</p>
        <h2>Key Factors to Consider Before Admission</h2>
        <ul>
          <li><strong>Faculty:</strong> Check if classes are taught by senior faculty or junior trainees.</li>
          <li><strong>Batch Size:</strong> Smaller batch sizes ensure personal attention.</li>
          <li><strong>Hostel & Mess:</strong> Comfortable lodging is essential to avoid burnout.</li>
        </ul>
      `,
      faqs: [
        { question: "What is the average fee for JEE coaching in Kota?", answer: "The fee ranges from Rs. 1,20,000 to Rs. 1,60,000 per year, excluding hostel charges." },
        { question: "Is self-study enough for JEE Main?", answer: "While self-study is crucial, professional coaching provides structured learning, competitive peer environments, and immediate doubt clearance." }
      ]
    },
    {
      title: "Top NEET Coaching Institutes in Delhi",
      slug: "top-neet-coaching-delhi",
      excerpt: "Everything you should know before taking admission in Delhi's top NEET institutes.",
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80",
      categorySlug: "neet",
      readTime: 5,
      isFeatured: true,
      featuredOrder: 2,
      content: `
        <p>Delhi is home to some of the finest medical coaching centers in India. For students aiming to crack NEET UG and get into top colleges like AIIMS, choosing the right guidance is key. Let's compare the best centers in Delhi.</p>
        <h2>Best NEET Centers in Delhi</h2>
        <p>Delhi offers institutes that cater to different learning styles, batch sizes, and locations. Out of these, South Delhi (Kalu Sarai) and West Delhi (Janakpuri) are the primary hubs.</p>
        <ul>
          <li><strong>Aakash Institute:</strong> The undisputed leader in medical prep with a massive network and highly comprehensive test papers.</li>
          <li><strong>Physics Wallah (PW Vidyapeeth):</strong> Highly affordable option with top-tier online support and interactive offline classes.</li>
        </ul>
      `,
      faqs: [
        { question: "Which location in Delhi is best for NEET preparation?", answer: "Kalu Sarai and Janakpuri are the primary educational hubs with a density of top coaching centers and student PG facilities." }
      ]
    },
    {
      title: "How to Choose the Right Coaching Institute",
      slug: "choose-right-coaching",
      excerpt: "Avoid these common mistakes students make before joining a coaching institute.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      categorySlug: "study-tips",
      readTime: 6,
      isFeatured: true,
      featuredOrder: 3,
      content: `
        <p>Every year, lakhs of students enroll in coaching centers with big dreams, but many end up disappointed due to wrong choices. Here is a checklist to help you choose the right coaching institute.</p>
        <h2>Checklist for Coaching Selection</h2>
        <p>Do not go blindly by advertisements. Follow these guidelines:</p>
        <ol>
          <li><strong>Talk to senior students:</strong> Get honest reviews about the daily classes and doubt-solving cells.</li>
          <li><strong>Request a demo class:</strong> Attend 2-3 lectures before paying the full fees to check if you follow the teacher's pace.</li>
          <li><strong>Refund Policy:</strong> Understand the refund terms in case you decide to leave mid-session.</li>
        </ol>
      `,
      faqs: [
        { question: "Can I request a demo class before paying fees?", answer: "Yes, most reputed coachings offer 2-3 free trial classes to help students evaluate the faculty." }
      ]
    },
    {
      title: "Complete CUET Preparation Strategy",
      slug: "cuet-preparation-strategy",
      excerpt: "A realistic preparation roadmap for CUET aspirants with subject-wise planning.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
      categorySlug: "cuet",
      readTime: 7,
      isFeatured: false,
      content: `
        <p>The Common University Entrance Test (CUET) has changed college admissions in India. Here is a definitive roadmap to scoring 99+ percentile in CUET 2026.</p>
        <h2>Understand the CUET Exam Pattern</h2>
        <p>The exam comprises three sections: Language, Domain-Specific Subjects, and the General Test. Dominating the Domain subjects (based on NCERT Class 12 syllabus) is the key to getting into top North Campus colleges in DU.</p>
      `,
      faqs: []
    },
    {
      title: "Best UPSC Coaching in Delhi",
      slug: "upsc-coaching-delhi",
      excerpt: "Compare faculty, answer writing, GS batches and interview guidance.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
      categorySlug: "upsc",
      readTime: 10,
      isFeatured: false,
      content: `
        <p>Delhi is the ultimate hub for Civil Services preparation. With popular hubs like Old Rajinder Nagar (ORN) and Mukherjee Nagar, choosing a coaching requires deep analysis.</p>
        <h2>Key UPSC Institutes in ORN</h2>
        <p>We review the GS Foundation courses of Vajiram & Ravi, Vision IAS, and Next IAS to find the best package for beginners.</p>
      `,
      faqs: []
    },
    {
      title: "Top 10 NEET Coaching Institutes in Kota",
      slug: "top-neet-coaching-kota",
      excerpt: "Discover the articles students are reading the most this week for NEET coaching.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
      categorySlug: "neet",
      readTime: 7,
      isFeatured: false,
      content: `
        <p>Kota is famous not just for IIT JEE, but also for medical prep. Here is a list of top 10 NEET coaching centers in Kota with detailed pros and cons.</p>
      `,
      faqs: []
    }
  ];

  for (const post of postsData) {
    const category = categories.find((c: any) => c.slug === post.categorySlug);

    const seededPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        contentMarkdown: post.content,
        contentHtml: post.content,
        coverImage: post.image,
        readingTime: post.readTime,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        isFeatured: post.isFeatured || false,
        featuredOrder: post.featuredOrder || 0,
        publishedAt: new Date(),
        authorProfileId: authorProfile.id,
        categoryId: category?.id || null,
        faqs: {
          create: post.faqs.map((faq, idx) => ({
            question: faq.question,
            answer: faq.answer,
            order: idx,
          })),
        },
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.image,
        readingTime: post.readTime,
        isFeatured: post.isFeatured || false,
        featuredOrder: post.featuredOrder || 0,
      },
    });

    console.log(`Seeded post: ${seededPost.title} (${seededPost.slug})`);
  }

  // Update counts in db for Categories and Tags
  for (const category of categories) {
    const count = await prisma.blogPost.count({
      where: { categoryId: category.id, status: "PUBLISHED" },
    });
    await prisma.blogCategory.update({
      where: { id: category.id },
      data: { postCount: count },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
