export default function WhyChooseUs() {
  return (
    <div className="bg-white py-12 border-t border-surface-border mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
          </div>
          <h4 className="font-bold text-text-primary">100% Genuine</h4>
          <p className="text-sm text-text-secondary">Authentic products with brand warranty</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
          </div>
          <h4 className="font-bold text-text-primary">Free Delivery</h4>
          <p className="text-sm text-text-secondary">Free shipping on orders above ₹499</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">currency_rupee</span>
          </div>
          <h4 className="font-bold text-text-primary">Best Prices</h4>
          <p className="text-sm text-text-secondary">Unbeatable prices and daily offers</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
          </div>
          <h4 className="font-bold text-text-primary">24/7 Support</h4>
          <p className="text-sm text-text-secondary">Dedicated customer service team</p>
        </div>
      </div>
    </div>
  );
}
