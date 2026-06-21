"use client";

import { useSiteStore, CategoryItem } from "@/store/siteStore";
import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, IndianRupee, ShoppingBag, Users, Cookie, Settings } from "lucide-react";
import FeaturedProductsManager from "@/components/admin/FeaturedProductsManager";
import GiftingSectionAdmin from "@/components/admin/GiftingSectionAdmin";
import ReviewManagement from "@/components/admin/ReviewManagement";

export default function AdminDashboard() {
  const router = useRouter();
  const { 
    // State values from store
    announcementText, heroTitle, heroSubtitle,
    bestSellersTitle, bestSellersSubtitle,
    whyChooseTitle, whyChooseDescription, whyChooseFeatures,
    categoriesList,
    giftingTitle, giftingDescription,

    // About Page state values from store
    aboutStoryTitle, aboutStorySubtitle,
    aboutFounderName, aboutFounderText,
    aboutMeaningTitle, aboutMeaningSubtitle,
    aboutMeaningText1, aboutMeaningText2, aboutMeaningText3,
    aboutNashikRootsTitle, aboutNashikRootsText1, aboutNashikRootsText2,
    aboutStat1Number, aboutStat1Title, aboutStat1Desc,
    aboutStat2Number, aboutStat2Title, aboutStat2Desc,
    aboutStat3Number, aboutStat3Title, aboutStat3Desc,
    
    // Setters
    updateAnnouncement, updateHero, updateBestSellers, updateWhyChoose, updateCategories, updateGifting,
    updateAboutStory, updateAboutFounder, updateAboutMeaning, updateAboutRoots, updateAboutStats,
  } = useSiteStore();

  const { allOrders, allUsers } = useAuthStore();
  const { products } = useProductStore();

  const [activeSection, setActiveSection] = useState("hero");

  // Hero section state
  const [announcement, setAnnouncement] = useState(announcementText);
  const [title, setTitle] = useState(heroTitle);
  const [subtitle, setSubtitle] = useState(heroSubtitle);

  // Best Sellers section state
  const [bsTitle, setBsTitle] = useState(bestSellersTitle);
  const [bsSubtitle, setBsSubtitle] = useState(bestSellersSubtitle);

  // Why Choose section state
  const [wcTitle, setWcTitle] = useState(whyChooseTitle);
  const [wcDescription, setWcDescription] = useState(whyChooseDescription);
  const [wcFeatures, setWcFeatures] = useState<string[]>(whyChooseFeatures);
  const [newFeature, setNewFeature] = useState("");

  // Categories section state
  const [cats, setCats] = useState<CategoryItem[]>(categoriesList);

  // Gifting section state
  const [gTitle, setGTitle] = useState(giftingTitle);
  const [gDescription, setGDescription] = useState(giftingDescription);

  // About Page states
  const [abStoryTitle, setAbStoryTitle] = useState(aboutStoryTitle);
  const [abStorySubtitle, setAbStorySubtitle] = useState(aboutStorySubtitle);
  const [abFounderName, setAbFounderName] = useState(aboutFounderName);
  const [abFounderText, setAbFounderText] = useState(aboutFounderText);
  const [abMeaningTitle, setAbMeaningTitle] = useState(aboutMeaningTitle);
  const [abMeaningSubtitle, setAbMeaningSubtitle] = useState(aboutMeaningSubtitle);
  const [abMeaningT1, setAbMeaningT1] = useState(aboutMeaningText1);
  const [abMeaningT2, setAbMeaningT2] = useState(aboutMeaningText2);
  const [abMeaningT3, setAbMeaningT3] = useState(aboutMeaningText3);
  const [abRootsTitle, setAbRootsTitle] = useState(aboutNashikRootsTitle);
  const [abRootsT1, setAbRootsT1] = useState(aboutNashikRootsText1);
  const [abRootsT2, setAbRootsT2] = useState(aboutNashikRootsText2);
  const [abS1Num, setAbS1Num] = useState(aboutStat1Number);
  const [abS1Title, setAbS1Title] = useState(aboutStat1Title);
  const [abS1Desc, setAbS1Desc] = useState(aboutStat1Desc);
  const [abS2Num, setAbS2Num] = useState(aboutStat2Number);
  const [abS2Title, setAbS2Title] = useState(aboutStat2Title);
  const [abS2Desc, setAbS2Desc] = useState(aboutStat2Desc);
  const [abS3Num, setAbS3Num] = useState(aboutStat3Number);
  const [abS3Title, setAbS3Title] = useState(aboutStat3Title);
  const [abS3Desc, setAbS3Desc] = useState(aboutStat3Desc);

  // Sync state if store updates in background
  useEffect(() => {
    setAnnouncement(announcementText);
    setTitle(heroTitle);
    setSubtitle(heroSubtitle);
    setBsTitle(bestSellersTitle);
    setBsSubtitle(bestSellersSubtitle);
    setWcTitle(whyChooseTitle);
    setWcDescription(whyChooseDescription);
    setWcFeatures(whyChooseFeatures);
    setCats(categoriesList);
    setGTitle(giftingTitle);
    setGDescription(giftingDescription);
    setAbStoryTitle(aboutStoryTitle);
    setAbStorySubtitle(aboutStorySubtitle);
    setAbFounderName(aboutFounderName);
    setAbFounderText(aboutFounderText);
    setAbMeaningTitle(aboutMeaningTitle);
    setAbMeaningSubtitle(aboutMeaningSubtitle);
    setAbMeaningT1(aboutMeaningText1);
    setAbMeaningT2(aboutMeaningText2);
    setAbMeaningT3(aboutMeaningText3);
    setAbRootsTitle(aboutNashikRootsTitle);
    setAbRootsT1(aboutNashikRootsText1);
    setAbRootsT2(aboutNashikRootsText2);
    setAbS1Num(aboutStat1Number);
    setAbS1Title(aboutStat1Title);
    setAbS1Desc(aboutStat1Desc);
    setAbS2Num(aboutStat2Number);
    setAbS2Title(aboutStat2Title);
    setAbS2Desc(aboutStat2Desc);
    setAbS3Num(aboutStat3Number);
    setAbS3Title(aboutStat3Title);
    setAbS3Desc(aboutStat3Desc);
  }, [
    announcementText, heroTitle, heroSubtitle,
    bestSellersTitle, bestSellersSubtitle,
    whyChooseTitle, whyChooseDescription, whyChooseFeatures,
    categoriesList,
    giftingTitle, giftingDescription,
    aboutStoryTitle, aboutStorySubtitle,
    aboutFounderName, aboutFounderText,
    aboutMeaningTitle, aboutMeaningSubtitle,
    aboutMeaningText1, aboutMeaningText2, aboutMeaningText3,
    aboutNashikRootsTitle, aboutNashikRootsText1, aboutNashikRootsText2,
    aboutStat1Number, aboutStat1Title, aboutStat1Desc,
    aboutStat2Number, aboutStat2Title, aboutStat2Desc,
    aboutStat3Number, aboutStat3Title, aboutStat3Desc
  ]);

  const handleSaveHero = () => {
    updateAnnouncement(announcement);
    updateHero(title, subtitle);
    alert("Hero settings saved successfully!");
  };

  const handleSaveBestSellers = () => {
    updateBestSellers(bsTitle, bsSubtitle);
    alert("Best Sellers settings saved successfully!");
  };

  const handleSaveWhyChoose = () => {
    updateWhyChoose(wcTitle, wcDescription, wcFeatures);
    alert("Why Choose settings saved successfully!");
  };

  const handleSaveCategories = () => {
    updateCategories(cats);
    alert("Categories saved successfully!");
  };

  const handleSaveGifting = () => {
    updateGifting(gTitle, gDescription);
    alert("Gifting settings saved successfully!");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSaveAbout = () => {
    updateAboutStory(abStoryTitle, abStorySubtitle);
    updateAboutFounder(abFounderName, abFounderText);
    updateAboutMeaning(abMeaningTitle, abMeaningSubtitle, abMeaningT1, abMeaningT2, abMeaningT3);
    updateAboutRoots(abRootsTitle, abRootsT1, abRootsT2);
    updateAboutStats(
      abS1Num, abS1Title, abS1Desc,
      abS2Num, abS2Title, abS2Desc,
      abS3Num, abS3Title, abS3Desc
    );
    alert("About & Brand Story settings saved successfully!");
  };

  const handleAddFeature = () => {
    if (newFeature && !wcFeatures.includes(newFeature)) {
      setWcFeatures([...wcFeatures, newFeature]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (f: string) => {
    setWcFeatures(wcFeatures.filter(feature => feature !== f));
  };

  const handleCatChange = (index: number, field: keyof CategoryItem, value: string) => {
    const updatedCats = [...cats];
    updatedCats[index] = { ...updatedCats[index], [field]: value };
    setCats(updatedCats);
  };

  // Calculate live analytics
  const activeOrders = allOrders.filter(o => o.status !== "Cancelled");
  const totalRevenue = activeOrders.reduce((acc, curr) => acc + curr.total, 0);
  const ordersCount = allOrders.length;
  const customersCount = allUsers.length;
  const productsCount = products.length;

  const stats = [
    { name: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600 bg-emerald-50 border-emerald-100", route: "/admin/orders", label: "Orders" },
    { name: "Total Orders", value: ordersCount, icon: ShoppingBag, color: "text-blue-600 bg-blue-50 border-blue-100", route: "/admin/orders", label: "Orders" },
    { name: "Active Customers", value: customersCount, icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100", route: "/admin/users", label: "Customers" },
    { name: "Catalog Products", value: productsCount, icon: Cookie, color: "text-amber-600 bg-amber-50 border-amber-100", route: "/admin/products", label: "Products" },
  ];

  const handleStatCardClick = (route: string) => {
    router.push(route);
  };

  const sections = [
    { id: "hero", label: "Hero & Announcement" },
    { id: "bestsellers", label: "Best Sellers Header" },
    { id: "whychoose", label: "Why Choose Section" },
    { id: "categories", label: "Featured Categories" },
    { id: "featuredproducts", label: "Featured Products" },
    { id: "gifting", label: "Gifting Section" },
    { id: "testimonials", label: "Review Management" },
    { id: "about", label: "About & Brand Story" },
  ];

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-brand-brown font-serif">Dashboard</h1>
        <p className="text-brand-text-secondary mt-1">Manage global website settings and monitor activity</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.name}
              onClick={() => handleStatCardClick(stat.route)}
              className="p-6 bg-white rounded-2xl border border-brand-brown/5 shadow-sm hover:shadow-md hover:border-brand-brown/10 cursor-pointer flex items-center space-x-4 transition-all duration-200 ease-in-out hover:-translate-y-0.5 text-left"
              aria-label={`Navigate to ${stat.label} - ${stat.name}`}
            >
              <div className={`p-3 rounded-xl border ${stat.color.split(' ').slice(1).join(' ')}`}>
                <Icon className={`w-6 h-6 ${stat.color.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-bold text-brand-text-primary mt-1 font-serif">{stat.value}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Storefront Settings customizer panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Nav */}
        <aside className="w-full md:w-64 border-r border-brand-brown/10 bg-brand-light/40 flex-shrink-0 p-4 space-y-1">
          <p className="text-[10px] font-bold text-brand-text-secondary/70 uppercase tracking-widest mb-3 ml-3 flex items-center">
            <Settings className="w-3.5 h-3.5 mr-1" /> Homepage Sections
          </p>
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSection === sec.id
                  ? "bg-brand-brown text-white shadow-sm"
                  : "text-brand-text-secondary hover:bg-brand-light"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </aside>

        {/* Right Editor Form */}
        <main className="flex-1 p-6 sm:p-8 space-y-6">
          
          {/* Hero & Announcement */}
          {activeSection === "hero" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-brown font-serif border-b border-brand-brown/10 pb-2">Hero & Header Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Announcement Bar Text
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none min-h-[85px] text-sm"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Hero Section Title (use \n for line breaks)
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none min-h-[85px] text-sm font-serif"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Hero Section Subtitle
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px] text-sm"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveHero}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-semibold cursor-pointer text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Section</span>
                </button>
              </div>
            </div>
          )}

          {/* Best Sellers Header */}
          {activeSection === "bestsellers" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-brown font-serif border-b border-brand-brown/10 pb-2">Best Sellers Section Header</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm font-semibold"
                    value={bsTitle}
                    onChange={(e) => setBsTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Section Subtitle
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none min-h-[80px] text-sm"
                    value={bsSubtitle}
                    onChange={(e) => setBsSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveBestSellers}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-semibold cursor-pointer text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Best Sellers</span>
                </button>
              </div>
            </div>
          )}

          {/* Featured Products */}
          {activeSection === "featuredproducts" && (
            <div className="animate-in fade-in duration-300">
              <FeaturedProductsManager />
            </div>
          )}

          {/* Why Choose Section */}
          {activeSection === "whychoose" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-brown font-serif border-b border-brand-brown/10 pb-2">Why Choose Us Section</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm font-semibold"
                    value={wcTitle}
                    onChange={(e) => setWcTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Section Description Text
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px] text-sm"
                    value={wcDescription}
                    onChange={(e) => setWcDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">
                    Add Feature Badge
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
                      placeholder="e.g. Organic Millet Sweetened"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-brand-brown text-white hover:bg-brand-gold rounded-xl transition-colors text-sm font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-brand-light/50 border border-brand-brown/5 rounded-xl min-h-[60px]">
                    {wcFeatures.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-brown text-white text-xs font-bold rounded-full flex items-center shadow-sm">
                        {f}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(f)}
                          className="ml-2 hover:text-brand-gold transition-colors text-xs font-bold cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {wcFeatures.length === 0 && (
                      <span className="text-xs text-brand-text-secondary/70 italic m-auto">No features added yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveWhyChoose}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-semibold cursor-pointer text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Why Choose</span>
                </button>
              </div>
            </div>
          )}

          {/* Featured Categories */}
          {activeSection === "categories" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-brown font-serif border-b border-brand-brown/10 pb-2">Featured Categories (4 circles)</h2>
              
              <div className="space-y-6">
                {cats.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-brand-light/30 border border-brand-brown/10 rounded-2xl space-y-3 shadow-inner">
                    <span className="font-bold text-xs text-brand-gold uppercase tracking-wider block mb-1">Category {idx + 1}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-text-secondary mb-1">Category Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-xs font-semibold"
                          value={cat.name}
                          onChange={(e) => handleCatChange(idx, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-text-secondary mb-1">Image Path / URL</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-xs"
                          value={cat.image}
                          onChange={(e) => handleCatChange(idx, "image", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-text-secondary mb-1">Shop Route Link</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-xs"
                          value={cat.link}
                          onChange={(e) => handleCatChange(idx, "link", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveCategories}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-semibold cursor-pointer text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Categories</span>
                </button>
              </div>
            </div>
          )}

          {/* Gifting Section */}
          {activeSection === "gifting" && (
            <div className="animate-in fade-in duration-300">
              <GiftingSectionAdmin />
            </div>
          )}

          {/* Review Management */}
          {activeSection === "testimonials" && (
            <div className="animate-in fade-in duration-300">
              <ReviewManagement />
            </div>
          )}

          {/* About & Brand Story */}
          {activeSection === "about" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-brand-brown font-serif border-b border-brand-brown/10 pb-2">About & Brand Story Settings</h2>
              
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                
                {/* Story Hero */}
                <div className="p-4 bg-brand-light/30 border border-brand-brown/5 rounded-2xl space-y-3">
                  <span className="font-bold text-xs text-brand-gold uppercase tracking-wider block">1. Story Hero Header</span>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Hero Title</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs font-semibold" value={abStoryTitle} onChange={e => setAbStoryTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Hero Subtitle</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs" value={abStorySubtitle} onChange={e => setAbStorySubtitle(e.target.value)} />
                  </div>
                </div>

                {/* Founder Info */}
                <div className="p-4 bg-brand-light/30 border border-brand-brown/5 rounded-2xl space-y-3">
                  <span className="font-bold text-xs text-brand-gold uppercase tracking-wider block">2. Founder Profile & Narrative</span>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Founder Full Name</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs font-semibold" value={abFounderName} onChange={e => setAbFounderName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Founder Journey Narrative</label>
                    <textarea className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs min-h-[160px] leading-relaxed" value={abFounderText} onChange={e => setAbFounderText(e.target.value)} />
                  </div>
                </div>

                {/* Brand Name Meaning */}
                <div className="p-4 bg-brand-light/30 border border-brand-brown/5 rounded-2xl space-y-3">
                  <span className="font-bold text-xs text-brand-gold uppercase tracking-wider block">3. Brand Name Meaning</span>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Meaning Title</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs font-semibold" value={abMeaningTitle} onChange={e => setAbMeaningTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Meaning Subtitle</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs font-semibold text-brand-brown" value={abMeaningSubtitle} onChange={e => setAbMeaningSubtitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Meaning Text Block 1</label>
                    <textarea className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs min-h-[60px]" value={abMeaningT1} onChange={e => setAbMeaningT1(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Meaning Text Block 2</label>
                    <textarea className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs min-h-[60px]" value={abMeaningT2} onChange={e => setAbMeaningT2(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Meaning Text Block 3</label>
                    <textarea className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs min-h-[60px]" value={abMeaningT3} onChange={e => setAbMeaningT3(e.target.value)} />
                  </div>
                </div>

                {/* Nashik Roots */}
                <div className="p-4 bg-brand-light/30 border border-brand-brown/5 rounded-2xl space-y-3">
                  <span className="font-bold text-xs text-brand-gold uppercase tracking-wider block">4. Nashik Roots Story</span>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Roots Heading</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs font-semibold" value={abRootsTitle} onChange={e => setAbRootsTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Roots Paragraph 1</label>
                    <textarea className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs min-h-[80px]" value={abRootsT1} onChange={e => setAbRootsT1(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1">Roots Paragraph 2</label>
                    <textarea className="w-full px-3 py-1.5 border border-brand-brown/20 rounded-xl text-xs min-h-[80px]" value={abRootsT2} onChange={e => setAbRootsT2(e.target.value)} />
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="p-4 bg-brand-light/30 border border-brand-brown/5 rounded-2xl space-y-4">
                  <span className="font-bold text-xs text-brand-gold uppercase tracking-wider block">5. Quality Statistics Counters</span>
                  
                  {/* Stat 1 */}
                  <div className="p-3 bg-white border border-brand-brown/5 rounded-xl space-y-2">
                    <span className="font-semibold text-xs text-brand-brown block">Counter Card 1</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Big Number</label>
                        <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs" value={abS1Num} onChange={e => setAbS1Num(e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Title</label>
                        <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs font-bold" value={abS1Title} onChange={e => setAbS1Title(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Description</label>
                      <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs" value={abS1Desc} onChange={e => setAbS1Desc(e.target.value)} />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="p-3 bg-white border border-brand-brown/5 rounded-xl space-y-2">
                    <span className="font-semibold text-xs text-brand-brown block">Counter Card 2</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Big Number</label>
                        <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs" value={abS2Num} onChange={e => setAbS2Num(e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Title</label>
                        <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs font-bold" value={abS2Title} onChange={e => setAbS2Title(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Description</label>
                      <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs" value={abS2Desc} onChange={e => setAbS2Desc(e.target.value)} />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="p-3 bg-white border border-brand-brown/5 rounded-xl space-y-2">
                    <span className="font-semibold text-xs text-brand-brown block">Counter Card 3</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Big Number</label>
                        <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs" value={abS3Num} onChange={e => setAbS3Num(e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Title</label>
                        <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs font-bold" value={abS3Title} onChange={e => setAbS3Title(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-text-secondary mb-0.5">Description</label>
                      <input type="text" className="w-full px-2 py-1 border border-brand-brown/20 rounded-lg text-xs" value={abS3Desc} onChange={e => setAbS3Desc(e.target.value)} />
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveAbout}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-semibold cursor-pointer text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Settings</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
