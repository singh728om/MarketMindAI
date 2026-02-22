export const MOCK_BRAND = {
  name: "CHIC ELAN",
  category: "Fashion & Lifestyle",
  marketplaces: ["Amazon", "Flipkart", "Myntra"],
  products: [
    { id: "p1", name: "Premium Silk Ethnic Kurta", sku: "CE-KT-001", price: 2499, status: "Active" },
    { id: "p2", name: "Designer Velvet Lehenga", sku: "CE-LH-002", price: 8999, status: "Active" },
    { id: "p3", name: "Modern Cotton Blend Saree", sku: "CE-SR-003", price: 3499, status: "Out of Stock" }
  ]
};

export const KPI_DATA = [
  { title: "Total Sales", value: "₹45.2L", change: "+12.5%", trend: "up" },
  { title: "CTR", value: "4.8%", change: "+0.4%", trend: "up" },
  { title: "Conversion", value: "3.2%", change: "-0.2%", trend: "down" },
  { title: "ROAS", value: "4.2x", change: "+0.5x", trend: "up" }
];

export const PERFORMANCE_CHART = [
  { name: "Mon", sales: 4000, ctr: 2.4 },
  { name: "Tue", sales: 3000, ctr: 1.3 },
  { name: "Wed", sales: 2000, ctr: 9.8 },
  { name: "Thu", sales: 2780, ctr: 3.9 },
  { name: "Fri", sales: 1890, ctr: 4.8 },
  { name: "Sat", sales: 2390, ctr: 3.8 },
  { name: "Sun", sales: 3490, ctr: 4.3 }
];

export const ACTIVITY_FEED = [
  { id: 1, type: "Listing", name: "Silk Kurta Optimization", status: "Completed", time: "2h ago" },
  { id: 2, type: "Photoshoot", name: "Velvet Lehenga Shoot", status: "Running", time: "5m ago" },
  { id: 3, type: "Report", name: "Weekly Performance Narrative", status: "Queued", time: "Just now" }
];
