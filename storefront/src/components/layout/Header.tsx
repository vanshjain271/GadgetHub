'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useCategories } from '@/hooks/useApi';

export default function Header() {
  const { isAuthenticated, user, openLoginModal } = useAuthStore();
  const { cart } = useCartStore();
  const { categories } = useCategories();

  return (
    <header className="w-full relative z-50">
      {/* Top Announcement Bar */}
      <div className="bg-primary-dark text-white text-sm py-2 px-4 flex justify-between items-center">
          <span className="animate-marquee inline-block">🚀 Free Shipping on all orders!</span>
        <div className="hidden sm:flex gap-4 text-xs font-medium">
          <Link href="#" className="hover:text-accent-light transition-colors">Track Order</Link>
          <Link href="#" className="hover:text-accent-light transition-colors">Support</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-primary text-white py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-3xl text-accent">devices</span>
            <span className="text-2xl font-bold tracking-tight">Arbuda</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow w-full md:w-auto relative group">
            <div className="flex items-center w-full bg-white rounded-md overflow-hidden focus-within:ring-2 ring-accent">
              <input 
                type="text" 
                placeholder="Search for accessories..." 
                className="w-full px-4 py-2.5 text-text-primary outline-none text-sm"
              />
              <button className="bg-accent text-white px-5 py-2.5 hover:bg-accent-dark transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 shrink-0">
            {isAuthenticated ? (
              <Link href="/account" className="flex flex-col items-center hover:text-accent transition-colors group">
                <span className="material-symbols-outlined">person</span>
                <span className="text-[10px] font-medium mt-1 truncate max-w-[60px]">{user?.name || 'Profile'}</span>
              </Link>
            ) : (
              <button onClick={openLoginModal} className="flex flex-col items-center hover:text-accent transition-colors group">
                <span className="material-symbols-outlined">login</span>
                <span className="text-[10px] font-medium mt-1">Login</span>
              </button>
            )}
            
            <Link href="/cart" className="flex flex-col items-center hover:text-accent transition-colors relative group">
              <span className="material-symbols-outlined">favorite</span>
              <span className="text-[10px] font-medium mt-1">Wishlist</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center hover:text-accent transition-colors relative group">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="text-[10px] font-medium mt-1">Cart</span>
              {cart && cart.items && cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="bg-surface border-b border-surface-border shadow-sm text-text-primary font-medium text-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex overflow-x-auto scrollbar-hide py-3 gap-6 items-center">
          <Link href="/category/all" className="whitespace-nowrap hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">menu</span> All Categories
          </Link>
          
          {categories && categories.length > 0 ? (
            categories.map((cat: any) => (
              <Link key={cat._id} href={`/category/${cat.slug}`} className="whitespace-nowrap hover:text-primary transition-colors">
                {cat.name}
              </Link>
            ))
          ) : null}
        </div>
      </nav>
    </header>
  );
}
