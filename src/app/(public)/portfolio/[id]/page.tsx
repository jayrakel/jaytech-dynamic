import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export default async function PortfolioDetail({ params }: { params: { id: string } }) {
  // Fetch the specific project from the database using the ID in the URL
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/portfolio" className="hover:text-teal-400 transition-colors">Portfolio</Link>
          <span>›</span>
          <span className="text-teal-400">{project.category}</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/10 px-3 py-1.5 rounded-full">{project.category}</span>
        </div>

        <h1 className="font-heading font-black text-4xl lg:text-5xl leading-tight mb-6">{project.title}</h1>
        
        <p className="text-slate-400 text-xl leading-relaxed mb-10">{project.description}</p>

        {/* Show Live URL button if you added one in the admin panel */}
        {project.liveUrl && (
          <div className="mb-12">
            <a href={project.liveUrl} target="_blank" rel="noopener" className="inline-block px-8 py-3.5 rounded-xl font-heading font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-teal-500/20" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
              Visit Live Site ↗
            </a>
          </div>
        )}

        {/* Featured Image */}
        {project.image && (
          <Image src={project.image} alt={project.title} width={1200} height={600} className="w-full rounded-2xl mb-16 border border-slate-800 object-cover" />
        )}

        {/* Call to Action */}
        <div className="border-t border-slate-800 pt-16 text-center">
          <h3 className="font-heading font-bold text-2xl mb-4">Want to build something similar?</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Let's discuss how we can bring your ideas to life.</p>
          <Link href="/contact" className="inline-block px-8 py-3.5 rounded-xl border border-teal-400/30 text-teal-400 font-heading font-bold hover:bg-teal-400/5 hover:border-teal-400 transition-all">
            Start a Conversation
          </Link>
        </div>

      </div>
    </div>
  );
}