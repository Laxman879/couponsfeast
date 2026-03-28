const { defineConfig } = require('cypress')
const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/couponsfeast'

async function ensureConnected() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URI)
  }
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {
      on('task', {
        async seedStores() {
          await ensureConnected()
          const col = mongoose.connection.db.collection('stores')
          const count = await col.countDocuments()
          if (count === 0) {
            await col.insertMany([
              { storeName: 'Amazon',   slug: 'amazon',   logo: 'https://logo.clearbit.com/amazon.com',   websiteUrl: 'https://www.amazon.com',   description: 'Global e-commerce platform', category: 'Shopping', createdAt: new Date(), updatedAt: new Date() },
              { storeName: 'Flipkart', slug: 'flipkart', logo: 'https://logo.clearbit.com/flipkart.com', websiteUrl: 'https://www.flipkart.com', description: "India's leading marketplace",  category: 'Shopping', createdAt: new Date(), updatedAt: new Date() },
              { storeName: 'Myntra',   slug: 'myntra',   logo: 'https://logo.clearbit.com/myntra.com',   websiteUrl: 'https://www.myntra.com',   description: 'Top fashion store',          category: 'Fashion',  createdAt: new Date(), updatedAt: new Date() },
              { storeName: 'Swiggy',   slug: 'swiggy',   logo: 'https://logo.clearbit.com/swiggy.com',   websiteUrl: 'https://www.swiggy.com',   description: 'Food delivery platform',     category: 'Food',     createdAt: new Date(), updatedAt: new Date() },
              { storeName: 'Zomato',   slug: 'zomato',   logo: 'https://logo.clearbit.com/zomato.com',   websiteUrl: 'https://www.zomato.com',   description: 'Restaurant discovery',       category: 'Food',     createdAt: new Date(), updatedAt: new Date() },
            ])
          }
          return null
        },
        async clearDatabase() {
          try {
            if (mongoose.connection.readyState !== 1) {
              await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/couponsfeast')
            }
            // Clear all collections and wait for completion
            const collections = await mongoose.connection.db.listCollections().toArray()
            for (const collection of collections) {
              await mongoose.connection.db.collection(collection.name).deleteMany({})
            }
            return null
          } catch (error) {
            console.log('Clear database error:', error)
            return null
          }
        }
      })
    }
  }
})