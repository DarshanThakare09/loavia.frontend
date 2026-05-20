import { ArrowUpRight, DollarSign, Package, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { name: 'Total Revenue', value: '₹14,50,000', change: '+12.5%', icon: DollarSign },
    { name: 'Total Orders', value: '1,425', change: '+18.2%', icon: Package },
    { name: 'Total Customers', value: '8,234', change: '+4.3%', icon: Users },
    { name: 'Products Sold', value: '12,500', change: '+24.5%', icon: ShoppingBag },
  ];

  const recentOrders = [
    { id: '#ORD-8X9Y2Z', customer: 'John Doe', date: 'Today, 10:45 AM', status: 'Processing', total: '₹4,097' },
    { id: '#ORD-7A2B4C', customer: 'Emma Roberts', date: 'Today, 09:12 AM', status: 'Shipped', total: '₹1,799' },
    { id: '#ORD-9P1Q3R', customer: 'Michael Chen', date: 'Yesterday, 04:30 PM', status: 'Delivered', total: '₹3,499' },
    { id: '#ORD-5L8M2N', customer: 'Sarah Jenkins', date: 'Yesterday, 11:15 AM', status: 'Delivered', total: '₹598' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-brown">Dashboard</h1>
        <p className="text-brand-text-secondary">Overview of your store's performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-brown">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-bold">
                  <span>{stat.change}</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              <p className="text-brand-text-secondary text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-brand-brown">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/5 overflow-hidden">
        <div className="p-6 border-b border-brand-brown/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-brown">Recent Orders</h2>
          <button className="text-brand-gold hover:text-brand-brown text-sm font-bold transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light/50 text-brand-text-secondary text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-brand-brown/5">Order ID</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Customer</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Date</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Status</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-brown/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-light/30 transition-colors">
                  <td className="p-4 font-medium text-brand-brown">{order.id}</td>
                  <td className="p-4 text-brand-text-secondary">{order.customer}</td>
                  <td className="p-4 text-brand-text-secondary">{order.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-brand-brown">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
