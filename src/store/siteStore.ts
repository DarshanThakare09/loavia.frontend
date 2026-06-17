import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CategoryItem {
  name: string;
  image: string;
  link: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface SiteState {
  // Hero & Header
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  
  // Best Sellers Section
  bestSellersTitle: string;
  bestSellersSubtitle: string;

  // Featured Products Section
  featuredProductsTitle: string;
  featuredProductsSubtitle: string;
  featuredProductsCtaText: string;
  
  // Why Choose Section
  whyChooseTitle: string;
  whyChooseDescription: string;
  whyChooseFeatures: string[];
  
  // Categories Section
  categoriesList: CategoryItem[];
  
  // Gifting Section
  giftingTitle: string;
  giftingDescription: string;
  
  // Testimonials Section
  testimonialsList: TestimonialItem[];

  // About Page settings
  aboutStoryTitle: string;
  aboutStorySubtitle: string;
  aboutFounderName: string;
  aboutFounderText: string;
  aboutMeaningTitle: string;
  aboutMeaningSubtitle: string;
  aboutMeaningText1: string;
  aboutMeaningText2: string;
  aboutMeaningText3: string;
  aboutNashikRootsTitle: string;
  aboutNashikRootsText1: string;
  aboutNashikRootsText2: string;
  aboutStat1Number: string;
  aboutStat1Title: string;
  aboutStat1Desc: string;
  aboutStat2Number: string;
  aboutStat2Title: string;
  aboutStat2Desc: string;
  aboutStat3Number: string;
  aboutStat3Title: string;
  aboutStat3Desc: string;
  
  // Setters
  updateAnnouncement: (text: string) => void;
  updateHero: (title: string, subtitle: string) => void;
  updateBestSellers: (title: string, subtitle: string) => void;
  updateFeaturedProducts: (title: string, subtitle: string, ctaText: string) => void;
  updateWhyChoose: (title: string, description: string, features: string[]) => void;
  updateCategories: (categories: CategoryItem[]) => void;
  updateGifting: (title: string, description: string) => void;
  updateAboutStory: (title: string, subtitle: string) => void;
  updateAboutFounder: (name: string, text: string) => void;
  updateAboutMeaning: (title: string, subtitle: string, t1: string, t2: string, t3: string) => void;
  updateAboutRoots: (title: string, t1: string, t2: string) => void;
  updateAboutStats: (
    s1Num: string, s1Title: string, s1Desc: string,
    s2Num: string, s2Title: string, s2Desc: string,
    s3Num: string, s3Title: string, s3Desc: string
  ) => void;
  
  // Testimonial Actions (CRUD)
  addTestimonial: (testimonial: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: number, testimonialData: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: number) => void;
}

const defaultCategories: CategoryItem[] = [
  { name: "Classic Collection", image: "/premium_cookie.png", link: "/shop?category=classic" },
  { name: "Vegan Options", image: "/vegan_cookie.png", link: "/shop?category=vegan" },
  { name: "Gluten-Free", image: "/gluten_free_cookie.png", link: "/shop?category=gluten-free" },
  { name: "Stuffed Cookies", image: "/stuffed_cookie.png", link: "/shop?category=stuffed" },
];

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    content: "These are genuinely the best cookies I've ever had. The Double Dark Chocolate is incredibly rich, and the packaging makes it feel so premium. Worth every penny!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Verified Buyer",
    content: "I sent the 12-pack custom box to my team for the holidays. They arrived fresh and everyone loved them. The UI for building the box was super easy to use.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Roberts",
    role: "Verified Buyer",
    content: "I'm obsessed with the healthy alternatives. They actually taste like real, indulgent cookies without the guilt. LOAVIA has a customer for life.",
    rating: 5
  }
];

const defaultWhyChooseFeatures = [
  "No Maida in Millet Cookies",
  "No Preservatives",
  "Made with Natural Millets",
  "High Fiber",
  "Freshly Baked",
  "Premium Ingredients",
];

const defaultFounderText = `Baking has always been more than a passion — it has been a part of my heart and identity. After my children became independent and began shaping their own paths, I chose to dedicate my time to something that truly fulfilled me — the art of baking.

My journey formally began in 2021, when I stepped into professional baking with curiosity and determination. I trained through specialized baking courses, and in 2022, I proudly earned my certification as a Pâtissier Chef. Soon after, I established Akshar Foods and introduced my bakery brand, “The Pastry Saga,” where every creation was crafted with love, care, and detail.

Yet, deep within, I carried a larger vision — to create cookies that were not only delicious but also genuinely nourishing. This vision naturally led me to the world of millets.

Millets are not new to India; they are part of our ancient food heritage. Rich in fiber, protein, calcium, iron, and essential minerals, they once formed the foundation of our traditional diet. Over time, with modern lifestyles and processed foods, these powerful grains slowly faded from our daily lives.

As I explored them deeper, I realized their true potential — supporting children’s growth, improving digestion, strengthening heart health, and enhancing overall wellness.

However, transforming these ancient grains into a truly delicious cookie was not easy. After countless experiments, refinements, and passion-driven trials, I finally created what I had envisioned — a wholesome, balanced, and delightful bite.

Today, LOAVIA™ proudly brings you premium millet cookies crafted with love, freshness, and purpose — where health meets indulgence.`;

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      // Hero & Header Default Values
      announcementText: "✨ Free shipping on all orders over ₹999! Taste the magic of Nashik. ✨    |    100% Organic, Zero Preservatives    |    Use code LOAVIA10 for 10% off your first order! ✨",
      heroTitle: "Healthy Inside,\nYummy Outside.",
      heroSubtitle: "Premium millet cookies and healthy bakery products crafted with wholesome ingredients, rich flavours, and freshly baked goodness.",
      
      // Best Sellers Default Values
      bestSellersTitle: "Our Best Sellers",
      bestSellersSubtitle: "The cookies everyone is talking about.",

      // Featured Products Default Values
      featuredProductsTitle: "Featured Products",
      featuredProductsSubtitle: "Explore our most loved millet cookies crafted for tea-time indulgence, healthy snacking, and premium gifting.",
      featuredProductsCtaText: "Explore Products",
      
      // Why Choose Default Values
      whyChooseTitle: "Why Choose LOAVIA™",
      whyChooseDescription: "At LOAVIA™, we believe healthy snacking should never compromise on taste. Our millet cookies are thoughtfully baked using premium ingredients, natural millets, and delicious flavours to create guilt-free indulgence for every age group.",
      whyChooseFeatures: defaultWhyChooseFeatures,
      
      // Categories Default Values
      categoriesList: defaultCategories,
      
      // Gifting Default Values
      giftingTitle: "Healthy gifting made Delicious",
      giftingDescription: "Celebrate special moments with beautifully crafted LOAVIA™ cookie hampers. Our premium millet cookies make thoughtful gifts for festivals, corporate events, family celebrations, and special occasions.",
      
      // Testimonials Default Values
      testimonialsList: defaultTestimonials,

      // About Page Defaults
      aboutStoryTitle: "Our Story",
      aboutStorySubtitle: "Born in the heart of Maharashtra. Baked with world-class perfection.",
      aboutFounderName: "Pranita Vivek Patil",
      aboutFounderText: defaultFounderText,
      aboutMeaningTitle: "LOAVIA™",
      aboutMeaningSubtitle: "A Celebration of Love for Wholesome Baking",
      aboutMeaningText1: "The name LOAVIA™ is inspired by Loaf — bakery and baked goodness and Via/Avia — journey, lifestyle, and nourishment.",
      aboutMeaningText2: "At LOAVIA™, freshness and health matter more than mass production. We use fresh ingredients and freshly prepared millets in every batch, which is why our millet cookies have a shelf life of only one month.",
      aboutMeaningText3: "Our mission is to bring back the goodness of traditional grains in a delicious modern form for today’s generation.",
      aboutNashikRootsTitle: "The Nashik Roots",
      aboutNashikRootsText1: "Nestled in the vibrant agricultural heartland of Nashik, Maharashtra, LOAVIA began as a passionate dream to redefine the Indian cookie experience. We believe that an authentic Indian brand can seamlessly blend local agricultural richness with international baking standards.",
      aboutNashikRootsText2: "Every LOAVIA cookie is handcrafted daily in small batches in our Nashik kitchen. We don't just bake; we weave the spirit, warmth, and flavor of India into every single bite, creating pure, unadulterated joy without any preservatives or artificial flavors.",
      aboutStat1Number: "100%",
      aboutStat1Title: "Organic Flour",
      aboutStat1Desc: "Sourced responsibly for the best texture and health benefits.",
      aboutStat2Number: "Zero",
      aboutStat2Title: "Preservatives",
      aboutStat2Desc: "Absolutely no artificial colors, flavors, or chemicals.",
      aboutStat3Number: "Daily",
      aboutStat3Title: "Freshly Baked",
      aboutStat3Desc: "Made fresh every morning in our Nashik kitchen.",

      // Setters
      updateAnnouncement: (text) => set({ announcementText: text }),
      updateHero: (title, subtitle) => set({ heroTitle: title, heroSubtitle: subtitle }),
      updateBestSellers: (title, subtitle) => set({ bestSellersTitle: title, bestSellersSubtitle: subtitle }),
      updateFeaturedProducts: (title, subtitle, ctaText) => set({
        featuredProductsTitle: title,
        featuredProductsSubtitle: subtitle,
        featuredProductsCtaText: ctaText,
      }),
      updateWhyChoose: (title, description, features) => set({ 
        whyChooseTitle: title, 
        whyChooseDescription: description, 
        whyChooseFeatures: features 
      }),
      updateCategories: (categoriesList) => set({ categoriesList }),
      updateGifting: (title, description) => set({ giftingTitle: title, giftingDescription: description }),
      updateAboutStory: (title, subtitle) => set({ 
        aboutStoryTitle: title, 
        aboutStorySubtitle: subtitle 
      }),
      updateAboutFounder: (name, text) => set({ 
        aboutFounderName: name, 
        aboutFounderText: text 
      }),
      updateAboutMeaning: (title, subtitle, t1, t2, t3) => set({ 
        aboutMeaningTitle: title, 
        aboutMeaningSubtitle: subtitle, 
        aboutMeaningText1: t1,
        aboutMeaningText2: t2,
        aboutMeaningText3: t3
      }),
      updateAboutRoots: (title, t1, t2) => set({ 
        aboutNashikRootsTitle: title, 
        aboutNashikRootsText1: t1, 
        aboutNashikRootsText2: t2 
      }),
      updateAboutStats: (s1Num, s1Title, s1Desc, s2Num, s2Title, s2Desc, s3Num, s3Title, s3Desc) => set({
        aboutStat1Number: s1Num, aboutStat1Title: s1Title, aboutStat1Desc: s1Desc,
        aboutStat2Number: s2Num, aboutStat2Title: s2Title, aboutStat2Desc: s2Desc,
        aboutStat3Number: s3Num, aboutStat3Title: s3Title, aboutStat3Desc: s3Desc
      }),

      // Testimonial Actions
      addTestimonial: (newTestimonial) => set((state) => ({
        testimonialsList: [
          ...state.testimonialsList,
          { ...newTestimonial, id: Date.now() }
        ]
      })),
      updateTestimonial: (id, testimonialData) => set((state) => ({
        testimonialsList: state.testimonialsList.map(t => t.id === id ? { ...t, ...testimonialData } : t)
      })),
      deleteTestimonial: (id) => set((state) => ({
        testimonialsList: state.testimonialsList.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'loavia-site-storage',
    }
  )
);
