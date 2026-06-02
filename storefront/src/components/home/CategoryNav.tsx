import Image from 'next/image';

const categories = [
  { name: 'Mobiles', icon: 'smartphone' },
  { name: 'Chargers', icon: 'bolt' },
  { name: 'Cables', icon: 'cable' },
  { name: 'Earbuds', icon: 'headphones' },
  { name: 'Neckbands', icon: 'headset_mic' },
  { name: 'Smart Watches', icon: 'watch' },
  { name: 'Power Banks', icon: 'battery_charging_full' },
  { name: 'Covers', icon: 'cases' },
  { name: 'Laptops', icon: 'laptop_mac' },
  { name: 'Deals', icon: 'local_offer', isNew: true },
];

export default function CategoryNav() {
  return (
    <div className="bg-white border-b border-surface-border py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex overflow-x-auto scrollbar-hide justify-between gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
              <div className="w-14 h-14 rounded-full bg-background border border-surface-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-colors relative">
                <span className="material-symbols-outlined text-[28px] text-text-secondary group-hover:text-primary transition-colors">{cat.icon}</span>
                {cat.isNew && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">NEW</span>
                )}
              </div>
              <span className="text-xs font-medium text-text-primary group-hover:text-primary transition-colors">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
