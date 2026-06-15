export default function WhyChoose() {
  const features = [
    "No Maida in Millet Cookies",
    "No Preservatives",
    "Made with Natural Millets",
    "High Fiber",
    "Freshly Baked",
    "Premium Ingredients",
  ];

  return (
    <section className="py-20 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#5C4033] mb-4">
          Why Choose LOAVIA™
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          At LOAVIA™, we believe healthy snacking should never compromise on
          taste. Our millet cookies are thoughtfully baked using premium
          ingredients, natural millets, and delicious flavours to create
          guilt-free indulgence for every age group.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="text-3xl mb-3">✅</div>

              <h3 className="text-xl font-semibold text-[#5C4033]">
                {feature}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}