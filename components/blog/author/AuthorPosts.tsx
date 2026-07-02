import BlogCard from "../cards/BlogCard";
import { BlogCardPost } from "@/types/BlogCard";

type AuthorPostGridProps = {
  posts: BlogCardPost[];
};

export default function AuthorPostGrid({
  posts,
}: AuthorPostGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
      {posts.map((post: BlogCardPost) => (
        <BlogCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}