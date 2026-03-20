
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
export const revalidate = 60;
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where:{ slug: params.slug, published: true } });
  if (!post) notFound();
  await prisma.post.update({ where:{ id: post.id }, data:{ views:{ increment: 1 } } });
  const related = await prisma.post.findMany({ where:{ published:true, category:post.category, NOT:{ id: post.id } }, take: 3 });
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <span>›</span><Link href="/blog" className="hover:text-teal-400 transition-colors">Blog</Link>
          <span>›</span><span className="text-teal-400">{post.category}</span>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/10 px-3 py-1.5 rounded-full">{post.category}</span>
          <span className="text-slate-500 text-sm">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}) : ""}</span>
          <span className="text-slate-600 text-sm">· {post.views} views</span>
        </div>
        <h1 className="font-heading font-black text-4xl lg:text-5xl leading-tight mb-6">{post.title}</h1>
        <p className="text-slate-400 text-xl leading-relaxed mb-10">{post.excerpt}</p>
        {post.coverImage && <Image src={post.coverImage} alt={post.title} width={900} height={480} className="w-full rounded-2xl mb-12 object-cover h-80" />}
        <div className="prose prose-invert prose-teal max-w-none text-slate-300 prose-headings:font-heading prose-headings:text-white prose-a:text-teal-400 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-800">
            {post.tags.map(t => <span key={t} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400">#{t}</span>)}
          </div>
        )}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading font-bold text-xl mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group card-dark hover:border-teal-400/35 hover:-translate-y-1 transition-all rounded-xl p-5">
                  <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-teal-400 block mb-2">{r.category}</span>
                  <h4 className="font-heading font-bold text-sm group-hover:text-teal-400 transition-colors leading-snug">{r.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
