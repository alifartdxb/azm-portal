import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Mock data for demonstration
  const post = {
    title: 'The Future of Sustainable Bathroom Design',
    author: 'AZM Editorial',
    date: 'Oct 15, 2023',
    category: 'Design Trends',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop',
    content: `
      <p class="mb-6">The luxury bathroom industry is undergoing a profound transformation. As environmental consciousness grows among developers, architects, and homeowners in the UAE, the demand for sustainable yet luxurious sanitary ware has never been higher. This shift is redefining what it means to create a premium bathroom space.</p>
      
      <h3 class="text-2xl font-bold text-brand-secondary mt-10 mb-4">Water-Saving Technologies Without Compromise</h3>
      <p class="mb-6">Historically, water conservation in bathroom fixtures often meant a compromise in performance. Today, advanced engineering from brands like VADO UK has bridged this gap. Aerators integrated into basin mixers and showerheads infuse water with air, delivering a voluminous, luxurious flow while significantly reducing actual water consumption.</p>
      
      <p class="mb-6">These innovations are not just environmentally responsible; they are increasingly mandated by green building codes such as LEED and Estidama across the region. Specifying these products ensures compliance while maintaining the high-end experience expected in five-star hospitality and luxury residential projects.</p>

      <h3 class="text-2xl font-bold text-brand-secondary mt-10 mb-4">Eco-Friendly Materials and Manufacturing</h3>
      <p class="mb-6">Sustainability extends beyond the product's operational life. The materials used and the manufacturing processes employed are under greater scrutiny. The use of highly durable, recyclable materials like high-grade brass and stainless steel ensures longevity, reducing the frequency of replacement and the associated environmental impact.</p>

      <blockquote class="border-l-4 border-brand-primary pl-6 py-2 my-8 text-xl font-medium text-stone-600 italic">
        "True luxury in the modern era is inextricably linked to sustainability. A product must not only look and perform beautifully, but it must also respect the environment."
      </blockquote>

      <h3 class="text-2xl font-bold text-brand-secondary mt-10 mb-4">The Role of Smart Technology</h3>
      <p class="mb-6">Smart bathroom technology is playing a crucial role in sustainability. Sensor-operated faucets, once primarily confined to commercial spaces, are increasingly popular in high-end residential designs. These touchless solutions prevent water wastage and improve hygiene. Furthermore, advanced shower systems allow users to precisely control temperature and flow, eliminating the energy waste associated with finding the perfect setting.</p>

      <p class="mb-6">As AZM Group continues to partner with leading global brands, we remain committed to providing the UAE market with solutions that embody both unparalleled luxury and environmental stewardship. The future of bathroom design is undoubtedly sustainable.</p>
    `
  };

  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title={`${post.title} | AZM Group Blog`}
        description="Read our latest insights on sustainable bathroom design and industry trends."
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-500 hover:text-brand-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Insights
        </Link>

        <div className="mb-8">
          <div className="inline-block bg-stone-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-secondary mb-4">
            {post.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-brand-secondary mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between border-y border-stone-200 py-4">
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
            </div>
            <button className="text-stone-400 hover:text-brand-primary transition-colors" aria-label="Share article">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="aspect-[21/9] bg-stone-100 rounded-2xl overflow-hidden mb-12 relative">
          <OptimizedImage 
            src={post.image} 
            alt={post.title}
          />
        </div>

        <div 
          className="prose prose-stone prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-secondary prose-a:text-brand-primary hover:prose-a:text-brand-secondary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
