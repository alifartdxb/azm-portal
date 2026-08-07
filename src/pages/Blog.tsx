import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';

export function Blog() {
  const posts = [
    {
      id: 1,
      slug: 'future-sustainable-bathroom-design',
      title: 'The Future of Sustainable Bathroom Design',
      excerpt: 'Exploring water-saving technologies and eco-friendly materials reshaping the luxury bathroom industry in the UAE and beyond.',
      author: 'AZM Editorial',
      date: 'Oct 15, 2023',
      category: 'Design Trends',
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      slug: 'vado-uk-legacy',
      title: 'VADO UK: A Legacy of Brassware Excellence',
      excerpt: 'Discover why VADO remains the preferred choice for premium hospitality projects, combining British engineering with unparalleled design.',
      author: 'Technical Team',
      date: 'Sep 28, 2023',
      category: 'Brand Focus',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      slug: 'choosing-kitchen-sink',
      title: 'Choosing the Right Kitchen Sink Material',
      excerpt: 'From stainless steel to composite granite, a comprehensive guide to selecting the perfect sink for your next kitchen project.',
      author: 'AZM Editorial',
      date: 'Sep 10, 2023',
      category: 'Buying Guide',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title="Blog & Insights | AZM Group UAE"
        description="Stay updated with the latest trends, guides, and news in premium sanitary ware, kitchen solutions, and building materials."
      />

      <div className="bg-stone-50 py-16 lg:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-brand-secondary mb-6">Insights & News</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Expert perspectives, design inspiration, and industry updates from AZM Group.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link to={`/blog/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-stone-100">
                <OptimizedImage 
                  src={post.image} 
                  alt={post.title}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                  {post.category}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                </div>
                <h2 className="text-xl font-bold text-brand-secondary mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-primary hover:text-brand-secondary transition-colors">
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
