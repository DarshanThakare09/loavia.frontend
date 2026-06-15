import Link from "next/link";

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#5C4033] mb-4">
          Featured Products
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Explore our most loved millet cookies crafted for tea-time
          indulgence, healthy snacking, and premium gifting.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#F8F5F2] p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-[#5C4033] mb-3">
              Classic Millet Cookies
            </h3>
            <p className="text-gray-600">
              A wholesome everyday snack.
            </p>
          </div>

          <div className="bg-[#F8F5F2] p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-[#5C4033] mb-3">
              Chocolate Millet Cookies
            </h3>
            <p className="text-gray-600">
              Rich chocolate with healthy goodness.
            </p>
          </div>

          <div className="bg-[#F8F5F2] p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-[#5C4033] mb-3">
              Dry Fruit Millet Cookies
            </h3>
            <p className="text-gray-600">
              Premium gifting and healthy snacking.
            </p>
          </div>
        </div>

        <Link
          href="/shop"
          className="px-8 py-4 bg-[#5C4033] text-white rounded-full hover:bg-[#7A5A4B] transition"
        >
          Explore Products
        </Link>
      </div>
    </section>
  );
}