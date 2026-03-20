
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
export const revalidate = 60;
export default async function BlogPage() {
  const posts = await prisma.post.findMany({ where:{published:true}, orderBy:{publishedAt:"desc"} });
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured || p.id !== featured?.id);
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Blog</span>
          <h1 className="font-heading font-black text-5xl mb-4">Tech Insights & <span className="grad-text">Expert Advice</span></h1>
          <p className="text-slate-400 text-lg max-w-xl">Practical guides, case studies, and industry news from the Jay TechWave team.</p>
        </ScrollReveal>
        {featured && (
          <ScrollReveal className="mb-12">
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-0 card-dark overflow-hidden rounded-3xl hover:border-teal-400/35 transition-all hover:-translate-y-1">
              {featured.coverImage ? <Image src={featured.coverImage} alt={featured.title} width={800} height={400} className="w-full h-72 lg:h-auto object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-72 bg-slate-800 flex items-center justify-center text-4xl">📝</div>}
              <div className="p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4"><span className="text-[10px] font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">{featured.category}</span><span className="text-slate-600 text-xs">{featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString() : ""}</span></div>
                <h2 className="font-heading font-black text-2xl mb-3 group-hover:text-teal-400 transition-colors">{featured.title}</h2>
                <p className="text-slate-400 leading-relaxed">{featured.excerpt}</p>
                <span className="mt-6 text-teal-400 font-heading font-bold text-sm group-hover:gap-3 flex items-center gap-2">Read Full Article →</span>
              </div>
            </Link>
          </ScrollReveal>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <ScrollReveal key={post.id} delay={i % 3 * 80}>
              <Link href={`/blog/${post.slug}`} className="group block card-dark hover:border-teal-400/35 hover:-translate-y-1 transition-all overflow-hidden rounded-2xl h-full">
                {post.coverImage && <div className="overflow-hidden"><Image src={post.coverImage} alt={post.title} width={600} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3"><span className="text-[10px] font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">{post.category}</span><span className="text-slate-600 text-xs">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</span></div>
                  <h3 className="font-heading font-bold text-base mb-2 group-hover:text-teal-400 transition-colors leading-snug">{post.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {posts.length === 0 && <div className="text-center py-20 text-slate-500">No blog posts yet. <Link href="/admin/blogs" className="text-teal-400">Add one in the admin →</Link></div>}
      </div>
    </div>
  );
}
