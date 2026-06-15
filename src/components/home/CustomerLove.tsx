export default function CustomerLove() {
  return (
    <section className="py-20 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#5C4033] mb-4">
          Customer Love
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          Loved by families, fitness enthusiasts, and mindful snackers across India.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="text-yellow-500 text-2xl mb-4">
              ★★★★★
            </div>

            <p className="text-gray-600 mb-4">
              Healthy and delicious. Perfect for tea-time!
            </p>

            <h4 className="font-semibold text-[#5C4033]">
              Priya S.
            </h4>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="text-yellow-500 text-2xl mb-4">
              ★★★★★
            </div>

            <p className="text-gray-600 mb-4">
              My family absolutely loves these millet cookies.
            </p>

            <h4 className="font-semibold text-[#5C4033]">
              Rahul K.
            </h4>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="text-yellow-500 text-2xl mb-4">
              ★★★★★
            </div>

            <p className="text-gray-600 mb-4">
              Premium quality and amazing taste. Highly recommended!
            </p>

            <h4 className="font-semibold text-[#5C4033]">
              Neha P.
            </h4>
          </div>

        </div>
      </div>
    </section>
  );
}