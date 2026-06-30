import AuthorCard from "@/components/blog/article/AuthorCard";
import Breadcrumb from "@/components/blog/article/BreadCrumb";
import Comments from "@/components/blog/article/Comments";
import FAQSection from "@/components/blog/article/FAQSection";
import NewsletterCTA from "@/components/blog/article/NewsLetterCTA";
import ArticleActions from "@/components/blog/article/PostActions";
import PostContent from "@/components/blog/article/PostContent";
import PostHero from "@/components/blog/article/PostHero";
import ReadingProgress from "@/components/blog/article/ReadinProgress";
import RelatedInstitute from "@/components/blog/article/RelatedInstitutes";
import RelatedPosts from "@/components/blog/article/RelatedPosts";
import ShareButtons from "@/components/blog/article/ShareButtons";
import StickyCTA from "@/components/blog/article/StickyCTA";
import TableOfContents from "@/components/blog/article/TableOfContents";
import { getCachedSession } from "@/lib/auth/session";
import { getBlogPostBySlug, getisBookmarked, getRelatedInstitute, getUserReaction, getRelatedPosts, incrementBlogViewCount } from "@/lib/User/user/blog/blogpost";
import { notFound } from "next/navigation";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type TOCItem ={
  id: string;
  text: string;
  level: number;
}

export default async function BlogDetailPage({
  params,
}: Props) {
  const { slug } = await params;
  const [post, session] = await Promise.all([
  getBlogPostBySlug(slug),
  getCachedSession(),
]);
  if (!post) {
    return (
      notFound()
    );
  }

  const userId = session?.user?.id;

  const [userReaction, hasBookmarked, relatedInstitute, relatedPosts] = await Promise.all([
    userId ? getUserReaction(post.id || "", userId) : null,
    userId ? getisBookmarked(post.id || "", userId) : null,
    getRelatedInstitute(post.relatedInstituteId || ""),
    getRelatedPosts(post.id || "", post.categoryId || ""),
  ]);

  void incrementBlogViewCount(post.id || "");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ReadingProgress />

      <PostHero post={post} />

      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.category?.name || "Uncategorized", href: `/blog/category/${post.category?.slug}` }, { label: post.title }]} />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main>
              <PostContent html={post.contentHtml} className="prose-lg" />

              <FAQSection faqs={post.faqs} />

              {post.authorProfile ? (
                <AuthorCard author={post.authorProfile} />
              ) : null}

              <RelatedPosts posts={relatedPosts} />

              <RelatedInstitute institute={post.relatedInstitute} />

              <NewsletterCTA />

              <Comments comments={post.comments} canComment={!!userId} />
          </main>

          <aside>
              <TableOfContents items={(post.tableOfContents as TOCItem[]) ?? []} />

              <StickyCTA instituteSlug={relatedInstitute?.slug} />

              <ShareButtons title={post.title} slug={post.slug} url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`} />

            <ArticleActions 
              postId={post.id}
              slug={post.slug}
              initialLikes={post.likeCount}
              initialBookmarks={post.bookmarkCount}
              initialComments={post.commentCount}
              hasLikedInitially={userReaction === "LIKE"}
              hasHelpfullyInitially={userReaction === "HELPFUL"}
              hasLovedInitially={userReaction === "LOVE"}
              hasBookmarkedInitially={hasBookmarked === true}
              isLoggedIn={!!userId} 
            />
          </aside>
      </div>
    </div>
  );
}
