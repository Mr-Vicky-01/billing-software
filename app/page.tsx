import MenuGrid from '@/components/Menu/MenuGrid';
import FloatingCartButton from '@/components/common/FloatingCartButton';
import { getMenuItems } from '@/lib/db';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Server-side data fetching
  const items = await getMenuItems();

  return (
    <>
      <div className="min-h-screen bg-dark-mesh">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-32">
          {/* Hero Section */}
          <div className="relative mb-16 sm:mb-20 text-center">
            {/* Ambient glow behind hero */}
            <div className="absolute inset-0 -z-10 blur-3xl rounded-full transform -translate-y-1/2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full" />
            </div>

            <div className="animate-reveal-up">
              <div className="inline-flex items-center justify-center p-2 mb-8 bg-dark-200/60 backdrop-blur-sm rounded-full border border-accent/15 shadow-dark">
                <span className="px-3 py-1 text-xs font-semibold tracking-widest text-accent uppercase bg-accent/10 rounded-full">New Collection</span>
                <span className="ml-2 text-sm text-ivory-muted pr-1">Check out our latest arrivals</span>
              </div>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 text-gold-gradient animate-reveal-up stagger-1">
              Premium Sports Gear
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-ivory-muted mb-10 leading-relaxed animate-reveal-up stagger-2">
              Elevate your game with our curated collection of high-performance equipment.
              Designed for champions, built for durability.
            </p>

            {/* Stats/Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {[
                { label: 'Products', value: items.length, icon: '🛍️' },
                { label: 'Quality', value: 'Premium', icon: '⭐' },
                { label: 'Delivery', value: 'Fast', icon: '🚚' },
                { label: 'Support', value: '24/7', icon: '💬' },
              ].map((stat, index) => (
                <div key={index} className={`dark-card p-4 rounded-2xl text-center hover-glow animate-reveal-up stagger-${index + 3}`}>
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-ivory-dim uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 animate-reveal-up stagger-7">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ivory flex items-center gap-3">
                <span className="w-1 h-8 bg-accent rounded-full" />
                Featured Products
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-dark-50/30 to-transparent ml-6" />
            </div>

            <MenuGrid items={items} />
          </div>
        </div>
      </div>
      <FloatingCartButton />
    </>
  );
}
