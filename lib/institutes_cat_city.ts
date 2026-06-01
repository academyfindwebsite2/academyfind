import {prisma} from "@/lib/prisma";

export async function getInstitutesByCategoryAndCity(categorySlug: string, citySlug: string) {
    return prisma.institute.findMany({
        where: {
            city: {
                slug: citySlug,
            },
            categories: {
            some:{
                category:{
                    slug: categorySlug,
                },
            },
        },
    },
    include:{
        city: true,
        reviews: true,
    }

})
}