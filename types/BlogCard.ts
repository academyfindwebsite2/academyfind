// types/blog.ts

export type BlogCardPost = {
  id: string;
  title: string;
  slug: string;

  excerpt: string | null;

  coverImage: string | null;
  coverImageAlt: string | null;

  readingTime: number | null;
  publishedAt: Date | null;

  viewCount: number;
  likeCount: number;
  commentCount: number;

  authorProfile?: {
    displayName: string;
    username: string;
    avatarUrl: string | null;
    isVerified: boolean;
  } | null;

  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  brand: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  } | null;
};
