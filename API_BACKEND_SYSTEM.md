# ⚙️ BACKEND/SYSTEM APIs (18 endpoints)
**System operations, analytics, and maintenance**  
**Base URL**: `/api/backend`  
**Purpose**: Internal system operations, analytics, and maintenance  
**Access Level**: System/Internal only (service-to-service authentication)  
**Operations**: System operations, data processing, analytics, maintenance

---

## Analytics & Reporting APIs (3 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/analytics/coupon-performance` | GET | Get detailed coupon performance analytics and metrics |
| `/api/backend/analytics/store-performance` | GET | Get store performance analytics and engagement data |
| `/api/backend/analytics/user-behavior` | GET | Get user behavior analytics and interaction patterns |

### Example Usage:
```javascript
// Get coupon performance
fetch('/api/backend/analytics/coupon-performance', {
  headers: { 'X-Service-Token': serviceToken }
})
.then(response => response.json())
.then(data => {
  console.log('Top performing coupons:', data.topCoupons);
  console.log('Click-through rates:', data.ctrData);
  console.log('Conversion metrics:', data.conversions);
});

// Get store analytics
fetch('/api/backend/analytics/store-performance?period=30d', {
  headers: { 'X-Service-Token': serviceToken }
})
```

---

## Data Processing APIs (4 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/data/bulk-import/coupons` | POST | Bulk import coupons from external sources or CSV |
| `/api/backend/data/bulk-import/stores` | POST | Bulk import stores from external sources or CSV |
| `/api/backend/data/export/coupons` | GET | Export coupon data to CSV/JSON format |
| `/api/backend/data/export/stores` | GET | Export store data to CSV/JSON format |

### Example Usage:
```javascript
// Bulk import coupons
const formData = new FormData();
formData.append('file', csvFile);
formData.append('source', 'affiliate-network');

fetch('/api/backend/data/bulk-import/coupons', {
  method: 'POST',
  headers: { 'X-Service-Token': serviceToken },
  body: formData
})

// Export data
fetch('/api/backend/data/export/coupons?format=csv&dateRange=last30days', {
  headers: { 'X-Service-Token': serviceToken }
})
```

---

## System Maintenance APIs (3 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/system/cleanup/expired-coupons` | POST | Automatically clean up expired coupons |
| `/api/backend/system/optimize/database` | POST | Optimize database performance and rebuild indexes |
| `/api/backend/system/logs/errors` | GET | Get system error logs for debugging and monitoring |

### Example Usage:
```javascript
// Clean expired coupons
fetch('/api/backend/system/cleanup/expired-coupons', {
  method: 'POST',
  headers: { 
    'X-Service-Token': serviceToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    dryRun: false,
    batchSize: 100
  })
})

// Get error logs
fetch('/api/backend/system/logs/errors?level=error&limit=50', {
  headers: { 'X-Service-Token': serviceToken }
})
```

---

## Cache Management APIs (3 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/cache/clear/all` | POST | Clear all application cache (Redis/Memory) |
| `/api/backend/cache/clear/coupons` | POST | Clear coupon-specific cache entries |
| `/api/backend/cache/clear/stores` | POST | Clear store-specific cache entries |

### Example Usage:
```javascript
// Clear all cache
fetch('/api/backend/cache/clear/all', {
  method: 'POST',
  headers: { 'X-Service-Token': serviceToken }
})

// Clear specific cache
fetch('/api/backend/cache/clear/coupons', {
  method: 'POST',
  headers: { 
    'X-Service-Token': serviceToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    keys: ['trending-coupons', 'popular-coupons'],
    pattern: 'coupon:*'
  })
})
```

---

## Notification System APIs (2 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/notifications/send/email` | POST | Send email notifications to users (bulk/individual) |
| `/api/backend/notifications/queue/status` | GET | Get notification queue status and processing metrics |

### Example Usage:
```javascript
// Send email notification
fetch('/api/backend/notifications/send/email', {
  method: 'POST',
  headers: { 
    'X-Service-Token': serviceToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    template: 'coupon-expiry-reminder',
    recipients: ['user1@email.com', 'user2@email.com'],
    data: {
      couponTitle: 'Special Discount',
      expiryDate: '2024-12-31'
    }
  })
})

// Check queue status
fetch('/api/backend/notifications/queue/status', {
  headers: { 'X-Service-Token': serviceToken }
})
```

---

## Health Check APIs (2 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/health/database` | GET | Check database connectivity and performance metrics |
| `/api/backend/health/external-services` | GET | Check external service integrations (APIs, CDNs) |

### Example Usage:
```javascript
// Check database health
fetch('/api/backend/health/database', {
  headers: { 'X-Service-Token': serviceToken }
})
.then(response => response.json())
.then(data => {
  console.log('DB Status:', data.status);
  console.log('Response Time:', data.responseTime);
  console.log('Active Connections:', data.connections);
});

// Check external services
fetch('/api/backend/health/external-services', {
  headers: { 'X-Service-Token': serviceToken }
})
```

---

## System Status APIs (1 endpoint)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/backend/system/status` | GET | Get comprehensive system status and health metrics |

### Example Usage:
```javascript
// Get system status
fetch('/api/backend/system/status', {
  headers: { 'X-Service-Token': serviceToken }
})
.then(response => response.json())
.then(data => {
  console.log('System Status:', data.overall);
  console.log('Services:', data.services);
  console.log('Performance:', data.metrics);
});
```

---

## Authentication & Security

### Service-to-Service Authentication:
```javascript
// Required headers for backend APIs
{
  'X-Service-Token': 'backend-service-token',
  'X-Service-Name': 'couponsfeast-backend',
  'Content-Type': 'application/json'
}
```

### Service Token Structure:
```json
{
  "token": "srv_1234567890abcdef",
  "service": "couponsfeast-backend",
  "permissions": ["analytics", "maintenance", "cache", "notifications"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

---

## Response Formats

### Analytics Response:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalClicks": 15420,
      "conversionRate": 12.5,
      "topPerformers": [
        {
          "couponId": "123",
          "title": "50% Off Electronics",
          "clicks": 1250,
          "conversions": 156
        }
      ]
    },
    "period": "last30days",
    "generatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### System Health Response:
```json
{
  "success": true,
  "data": {
    "overall": "healthy",
    "services": {
      "database": {
        "status": "healthy",
        "responseTime": "45ms",
        "connections": 12
      },
      "cache": {
        "status": "healthy",
        "hitRate": "94.2%",
        "memory": "2.1GB/4GB"
      }
    },
    "uptime": "99.9%",
    "lastCheck": "2024-01-01T00:00:00Z"
  }
}
```

---

## Scheduled Operations

### Automated Tasks:
```javascript
// These APIs are typically called by cron jobs or schedulers

// Daily cleanup (runs at 2 AM)
const dailyCleanup = async () => {
  await fetch('/api/backend/system/cleanup/expired-coupons', {
    method: 'POST',
    headers: { 'X-Service-Token': serviceToken }
  });
};

// Weekly optimization (runs Sunday 3 AM)
const weeklyOptimization = async () => {
  await fetch('/api/backend/system/optimize/database', {
    method: 'POST',
    headers: { 'X-Service-Token': serviceToken }
  });
};

// Cache warming (runs every 6 hours)
const cacheWarming = async () => {
  await fetch('/api/backend/cache/clear/all', {
    method: 'POST',
    headers: { 'X-Service-Token': serviceToken }
  });
};
```

---

## Monitoring & Alerting

### Error Handling:
```json
{
  "success": false,
  "error": {
    "code": "SYSTEM_ERROR",
    "message": "Database optimization failed",
    "details": {
      "operation": "index_rebuild",
      "table": "coupons",
      "error": "Lock timeout exceeded"
    },
    "severity": "high",
    "alertSent": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Performance Metrics:
```json
{
  "metrics": {
    "apiResponseTime": "120ms",
    "databaseQueries": 45,
    "cacheHitRate": "92%",
    "memoryUsage": "1.8GB",
    "cpuUsage": "35%"
  }
}
```

---

## Integration Examples

### Node.js Backend Service:
```javascript
// services/backendApi.js
const BACKEND_BASE_URL = '/api/backend';
const SERVICE_TOKEN = process.env.BACKEND_SERVICE_TOKEN;

const backendApi = {
  // Analytics
  getCouponPerformance: async (period = '30d') => {
    const response = await fetch(`${BACKEND_BASE_URL}/analytics/coupon-performance?period=${period}`, {
      headers: { 'X-Service-Token': SERVICE_TOKEN }
    });
    return response.json();
  },

  // Maintenance
  cleanupExpiredCoupons: async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/system/cleanup/expired-coupons`, {
      method: 'POST',
      headers: { 'X-Service-Token': SERVICE_TOKEN }
    });
    return response.json();
  },

  // Cache
  clearCache: async (type = 'all') => {
    const response = await fetch(`${BACKEND_BASE_URL}/cache/clear/${type}`, {
      method: 'POST',
      headers: { 'X-Service-Token': SERVICE_TOKEN }
    });
    return response.json();
  }
};

module.exports = backendApi;
```

---

**Total Backend/System APIs: 18 endpoints**