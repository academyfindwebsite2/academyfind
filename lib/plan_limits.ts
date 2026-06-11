export const PLAN_DISPLAY_NAMES = {
    BASIC: "Listing (Free)",
    VERIFIED: "Verified",
    PREMIUM: "Premium",
    ULTRA: "Elite"
} as const;

export const PLAN_LIMITS = {
    BASIC: {
        hasLeads: false,
        hasVerifiedBadge: false,
        hasAnalytics: false,
        maxTeachers: 0,
        maxResults: 0,
        maxVideos: 0,
        hasPriorityRanking: false,
    },
    VERIFIED: {
        hasLeads: true,
        hasVerifiedBadge: true,
        hasAnalytics: false,
        maxTeachers: 0,
        maxResults: 0,
        maxVideos: 0,
        hasPriorityRanking: false,
    },
    PREMIUM: {
        hasLeads: true,
        hasVerifiedBadge: true,
        hasAnalytics: true,
        maxTeachers: 4,
        maxResults: 4,
        maxVideos: 4,
        maxClassroomPics: 4,
        hasPriorityRanking: false,
    },
    ULTRA: {
        hasLeads: true,
        hasVerifiedBadge: true,
        hasAnalytics: true,
        maxTeachers: 4,
        maxResults: 4,
        maxVideos: 4,
        maxClassroomPics: 4,
        hasPriorityRanking: true, // 🌟 Top Search Ranking
    }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;