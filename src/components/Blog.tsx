import React from 'react';
import { blogPostsData } from '../data';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogProps {
  onOpenArticle: (id: string) => void;
}

export default function Blog({ onOpenArticle }: BlogProps) {
  return (
    <section id="blog" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 text-left max-w-2xl">
            <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
              THE JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
              AURA Perspective: Design, Culture & Prestige
            </h2>
            <div className="w-12 h-[2.5px] bg-[#D4A737]" />
          </div>
          <p className="text-sm text-slate-500 max-w-xs text-left leading-relaxed font-light">
            Read critical perspectives on spatial design, historic venue curation, and green logistics written by our creative directors.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPostsData.map((post) => (
            <div
              key={post.id}
              className="bg-[#FAFBFD] rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer"
              onClick={() => onOpenArticle(post.id)}
            >
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-xl text-[10px] font-bold uppercase text-[#0B1B2A] tracking-wider border border-[#D4A737]/20">
                  {post.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta strip */}
                  <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#D4A737]" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D4A737]" /> {post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-[#0B1B2A] group-hover:text-[#D4A737] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-light">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-[#0B1B2A]">
                      {post.author.split(' ')[0][0]}{post.author.split(' ')[1][0]}
                    </div>
                    <span className="text-xs font-semibold text-[#0B1B2A]">{post.author}</span>
                  </div>
                  <button className="text-[#D4A737] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Read Journal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
