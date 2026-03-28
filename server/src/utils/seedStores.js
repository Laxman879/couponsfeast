import Store from "../models/Store.js";

export const seedStores = async () => {
  try {
    const count = await Store.countDocuments();
    if (count > 0) return;

    await Store.insertMany([
      {
        storeName: "Amazon",
        slug: "amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        websiteUrl: "https://www.amazon.com",
        description: "Global e-commerce platform for all kinds of products",
        category: "Shopping"
      },
      {
        storeName: "Flipkart",
        slug: "flipkart",
        logo: "https://logo.clearbit.com/flipkart.com",
        websiteUrl: "https://www.flipkart.com",
        description: "India's leading e-commerce marketplace",
        category: "Shopping"
      },
      {
        storeName: "Myntra",
        slug: "myntra",
        logo: "https://logo.clearbit.com/myntra.com",
        websiteUrl: "https://www.myntra.com",
        description: "India's top fashion and lifestyle store",
        category: "Fashion"
      },
      {
        storeName: "Swiggy",
        slug: "swiggy",
        logo: "https://logo.clearbit.com/swiggy.com",
        websiteUrl: "https://www.swiggy.com",
        description: "Online food delivery platform",
        category: "Food"
      },
      {
        storeName: "Zomato",
        slug: "zomato",
        logo: "https://logo.clearbit.com/zomato.com",
        websiteUrl: "https://www.zomato.com",
        description: "Restaurant discovery and food delivery service",
        category: "Food"
      }
    ]);

    console.log("Stores seeded successfully (5 stores)");
  } catch (error) {
    console.error("Error seeding stores:", error.message);
  }
};
