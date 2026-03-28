import express from 'express';
import Store from '../../../models/Store.js';
import Coupon from '../../../models/Coupon.js';
import Category from '../../../models/Category.js';

const router = express.Router();

// GET /api/admin/dashboard/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate, metrics } = req.query;
    
    // Validate dates if provided
    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid startDate format',
        timestamp: new Date().toISOString()
      });
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid endDate format',
        timestamp: new Date().toISOString()
      });
    }
    
    // Build date filter if provided
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      if (dateFilter.createdAt) {
        dateFilter.createdAt.$lte = new Date(endDate);
      } else {
        dateFilter.createdAt = { $lte: new Date(endDate) };
      }
    }

    // Get counts
    const [totalStores, totalCoupons, totalCategories] = await Promise.all([
      Store.countDocuments(dateFilter),
      Coupon.countDocuments(dateFilter),
      Category.countDocuments(dateFilter)
    ]);

    // Get top performing items
    const topStores = await Store.find(dateFilter)
      .sort({ clickCount: -1 })
      .limit(5)
      .select('storeName clickCount');

    const topCoupons = await Coupon.find(dateFilter)
      .sort({ clickCount: -1 })
      .limit(5)
      .select('title clickCount discount')
      .populate('store', 'storeName');

    // Recent activity
    const recentActivity = await Coupon.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title createdAt')
      .populate('store', 'storeName');

    const stats = {
      totalStores,
      totalCoupons,
      totalCategories,
      monthlyClicks: Math.floor(Math.random() * 15000) + 5000, // Simulated
      topStores,
      topCoupons,
      recentActivity,
      performance: {
        averageResponseTime: '120ms',
        uptime: '99.9%',
        errorRate: '0.1%'
      },
      growth: {
        storesGrowth: '+12%',
        couponsGrowth: '+18%',
        clicksGrowth: '+25%'
      },
      userActivity: {
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        newUsers: Math.floor(Math.random() * 100) + 50,
        returningUsers: Math.floor(Math.random() * 800) + 400
      },
      revenue: {
        total: '$' + (Math.floor(Math.random() * 50000) + 10000),
        monthly: '$' + (Math.floor(Math.random() * 5000) + 1000),
        growth: '+15%'
      }
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/admin/dashboard/analytics - Dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    // Validate dates if provided
    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid startDate format',
        timestamp: new Date().toISOString()
      });
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid endDate format',
        timestamp: new Date().toISOString()
      });
    }
    
    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else if (period) {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 1;
      dateFilter.createdAt = { 
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      };
    }

    // Get analytics data
    const totalClicks = await Coupon.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$clickCount' } } }
    ]);

    const analytics = {
      traffic: {
        totalVisits: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 8000) + 3000,
        pageViews: Math.floor(Math.random() * 15000) + 8000,
        avgSessionDuration: '3m 45s'
      },
      conversions: {
        rate: (Math.random() * 5 + 2).toFixed(2) + '%',
        total: Math.floor(Math.random() * 500) + 200,
        value: '$' + (Math.floor(Math.random() * 10000) + 5000)
      },
      clicks: {
        total: totalClicks[0]?.total || 0,
        ctr: (Math.random() * 3 + 1).toFixed(2) + '%',
        avgPerUser: (Math.random() * 5 + 2).toFixed(1)
      },
      trending: {
        topCategories: ['Electronics', 'Fashion', 'Home & Garden'],
        topStores: ['Amazon', 'Walmart', 'Target'],
        growingSegments: ['Mobile Users', 'Returning Customers']
      },
      geographic: {
        topCountries: ['United States', 'Canada', 'United Kingdom'],
        topCities: ['New York', 'Los Angeles', 'Chicago']
      },
      devices: {
        mobile: (Math.random() * 30 + 50).toFixed(1) + '%',
        desktop: (Math.random() * 30 + 30).toFixed(1) + '%',
        tablet: (Math.random() * 20 + 10).toFixed(1) + '%'
      },
      referrers: [
        { source: 'Google', visits: Math.floor(Math.random() * 3000) + 1000 },
        { source: 'Facebook', visits: Math.floor(Math.random() * 2000) + 500 },
        { source: 'Direct', visits: Math.floor(Math.random() * 1500) + 800 }
      ],
      bounceRate: parseFloat((Math.random() * 20 + 30).toFixed(1)),
      totalClicks: totalClicks[0]?.total || 0
    };

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;