const createNutritionTable = (details: {
  servingSize: string;
  totalFat: string;
  satFat: string;
  cholesterol: string;
  sodium: string;
  totalCarb: string;
  fiber: string;
  sugars: string;
  protein: string;
}) => [
  { key: "Serving Size", value: details.servingSize },
  { key: "Total Fat", value: details.totalFat },
  { key: "Saturated Fat", value: details.satFat },
  { key: "Trans Fat", value: "0g" },
  { key: "Cholesterol", value: details.cholesterol },
  { key: "Sodium", value: details.sodium },
  { key: "Total Carbohydrates", value: details.totalCarb },
  { key: "Dietary Fiber", value: details.fiber },
  { key: "Total Sugars", value: details.sugars },
  { key: "Protein", value: details.protein },
];

export const PRODUCTS = [
  { 
    id: "1", 
    name: "Classic Chocolate Chip", 
    price: 299, 
    image: "/premium_cookie.png", 
    rating: 4.9, 
    reviews: 128, 
    category: "Classic", 
    tags: ["Sweet", "Classic"],
    moods: ["Happy", "Cozy"],
    description: "Our signature cookie that started it all. Baked to perfection with crisp edges, a soft, chewy center, and loaded with premium Belgian dark chocolate chunks. Each bite delivers the perfect balance of sweet, buttery dough and rich, melty chocolate.",
    ingredients: "Organic All-Purpose Flour, Grass-fed Butter, Brown Sugar, Organic Cane Sugar, Pasture-raised Eggs, Belgian Dark Chocolate Chunks (54%), Pure Vanilla Extract, Sea Salt, Baking Soda.",
    images: ["/premium_cookie.png", "/cookie_gift_box.png", "/premium_cookie.png", "/premium_cookie.png"],
    calories: "220 kcal",
    nutritionTable: createNutritionTable({
      servingSize: "1 cookie (50g)",
      totalFat: "11g (14% DV)",
      satFat: "6g (30% DV)",
      cholesterol: "25mg (8% DV)",
      sodium: "130mg (6% DV)",
      totalCarb: "28g (10% DV)",
      fiber: "1.5g (5% DV)",
      sugars: "18g",
      protein: "3g"
    })
  },
  { 
    id: "2", 
    name: "Double Dark Chocolate", 
    price: 349, 
    image: "/premium_cookie.png", 
    rating: 4.8, 
    reviews: 95, 
    category: "Classic", 
    tags: ["Sweet", "Chocolate"],
    moods: ["Relaxed"],
    description: "For the true chocolate lover. A rich, dark cocoa dough studded with semi-sweet chocolate chips and finished with a sprinkle of flaky sea salt.",
    ingredients: "Organic All-Purpose Flour, Dutch-Process Cocoa Powder, Grass-fed Butter, Brown Sugar, Eggs, Semi-Sweet Chocolate, Vanilla, Flaky Sea Salt.",
    images: ["/premium_cookie.png", "/cookie_gift_box.png", "/premium_cookie.png", "/premium_cookie.png"],
    calories: "240 kcal",
    nutritionTable: createNutritionTable({
      servingSize: "1 cookie (50g)",
      totalFat: "13g (17% DV)",
      satFat: "8g (40% DV)",
      cholesterol: "20mg (7% DV)",
      sodium: "140mg (6% DV)",
      totalCarb: "29g (11% DV)",
      fiber: "3g (11% DV)",
      sugars: "15g",
      protein: "4g"
    })
  },
  { id: "3", name: "Oatmeal Raisin Bliss", price: 279, image: "/premium_cookie.png", rating: 4.7, reviews: 64, category: "Vegan", tags: ["Healthy", "Fruity"], moods: ["Cozy", "Relaxed"], description: "A comforting classic...", ingredients: "Oats, Flour...", images: ["/premium_cookie.png", "/premium_cookie.png"], calories: "190 kcal", nutritionTable: createNutritionTable({ servingSize: "1 cookie (50g)", totalFat: "7g", satFat: "3g", cholesterol: "0mg", sodium: "110mg", totalCarb: "32g", fiber: "4g", sugars: "14g", protein: "3g" }) },
  { id: "4", name: "Peanut Butter Crunch", price: 329, image: "/premium_cookie.png", rating: 4.9, reviews: 112, category: "Classic", tags: ["Nutty", "Sweet"], moods: ["Energetic", "Happy"], description: "Peanut butter goodness...", ingredients: "Peanuts, Flour...", images: ["/premium_cookie.png", "/premium_cookie.png"], calories: "230 kcal", nutritionTable: createNutritionTable({ servingSize: "1 cookie (50g)", totalFat: "12g", satFat: "4g", cholesterol: "15mg", sodium: "160mg", totalCarb: "24g", fiber: "2g", sugars: "12g", protein: "5g" }) },
  { id: "5", name: "Matcha White Chocolate", price: 399, image: "/premium_cookie.png", rating: 4.6, reviews: 45, category: "Specialty", tags: ["Tea", "Sweet"], moods: ["Relaxed"], description: "Earthy matcha meets sweet white chocolate...", ingredients: "Matcha, White Chocolate...", images: ["/premium_cookie.png", "/premium_cookie.png"], calories: "210 kcal", nutritionTable: createNutritionTable({ servingSize: "1 cookie (50g)", totalFat: "9g", satFat: "5g", cholesterol: "18mg", sodium: "115mg", totalCarb: "27g", fiber: "1g", sugars: "17g", protein: "3g" }) },
  { id: "6", name: "Salted Caramel Pecan", price: 379, image: "/premium_cookie.png", rating: 4.9, reviews: 88, category: "Stuffed", tags: ["Sweet", "Nutty", "Caramel"], moods: ["Happy", "Energetic"], description: "Stuffed with caramel...", ingredients: "Caramel, Pecans...", images: ["/premium_cookie.png", "/premium_cookie.png"], calories: "250 kcal", nutritionTable: createNutritionTable({ servingSize: "1 cookie (50g)", totalFat: "14g", satFat: "7g", cholesterol: "22mg", sodium: "180mg", totalCarb: "30g", fiber: "2g", sugars: "19g", protein: "3g" }) },
  { id: "7", name: "Vegan Lemon Poppyseed", price: 299, image: "/premium_cookie.png", rating: 4.5, reviews: 34, category: "Vegan", tags: ["Citrus", "Healthy"], moods: ["Energetic"], description: "Zesty and vegan...", ingredients: "Lemon, Poppyseeds...", images: ["/premium_cookie.png", "/premium_cookie.png"], calories: "180 kcal", nutritionTable: createNutritionTable({ servingSize: "1 cookie (50g)", totalFat: "6g", satFat: "1.5g", cholesterol: "0mg", sodium: "105mg", totalCarb: "26g", fiber: "2g", sugars: "13g", protein: "2g" }) },
  { id: "8", name: "Gluten-Free Macadamia", price: 449, image: "/premium_cookie.png", rating: 4.8, reviews: 56, category: "Gluten-Free", tags: ["Nutty", "Premium"], moods: ["Happy", "Relaxed"], description: "Rich macadamia nuts...", ingredients: "GF Flour, Macadamia...", images: ["/premium_cookie.png", "/premium_cookie.png"], calories: "260 kcal", nutritionTable: createNutritionTable({ servingSize: "1 cookie (50g)", totalFat: "16g", satFat: "8g", cholesterol: "20mg", sodium: "125mg", totalCarb: "25g", fiber: "1.5g", sugars: "15g", protein: "3g" }) },
];
