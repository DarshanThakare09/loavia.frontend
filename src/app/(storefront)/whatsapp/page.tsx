import Link from "next/link";

export default function WhatsAppPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2] px-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">

        <h1 className="text-4xl font-bold text-[#5C4033] mb-4">
          Order on WhatsApp
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Thank you for choosing Loavia!
          <br />
          Connect with us on WhatsApp to place your order,
          ask product-related questions, or get personalized recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <a
            href="#"
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition"
          >
            Continue to WhatsApp
          </a>

          <Link
            href="/"
            className="px-8 py-4 bg-[#5C4033] text-white font-semibold rounded-full hover:bg-[#7A5A4B] transition"
          >
            Back to Home
          </Link>

        </div>

      </div>
    </div>
  );
}