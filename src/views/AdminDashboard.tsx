import type { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Ban,
  Box,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  LayoutDashboard,
  MessageCircle,
  Package,
  Printer,
  Search,
  Trash2,
  TrendingUp,
  TruckIcon,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminTab, Order, OrderStatus } from '@/src/types/order';
import { getOrderTotal } from '@/src/lib/orderValue';
import { OrderDetailModal } from '@/src/views/admin/OrderDetailModal';
import { BatchingModal } from '@/src/views/admin/BatchingModal';

export interface AdminDashboardProps {
  orders: Order[];
  metrics: {
    revenue: number;
    today: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    failed: number;
  };
  chartData: { date: string; orders: number; revenue: number }[];
  filteredOrders: Order[];
  batchingSummary: Record<string, number>;
  filterStatus: OrderStatus | 'all';
  setFilterStatus: (s: OrderStatus | 'all') => void;
  filterSize: string | 'all';
  setFilterSize: (s: string | 'all') => void;
  filterDate: 'all' | 'today' | 'yesterday' | 'last7';
  setFilterDate: (d: 'all' | 'today' | 'yesterday' | 'last7') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isShippingMode: boolean;
  setIsShippingMode: Dispatch<SetStateAction<boolean>>;
  selectedOrderIds: Set<string>;
  setSelectedOrderIds: Dispatch<SetStateAction<Set<string>>>;
  toggleSelectAll: () => void;
  toggleSelectOrder: (id: string) => void;
  exportToCSV: () => void;
  setShowPrintView: (v: boolean) => void;
  bulkUpdateStatus: (s: OrderStatus) => void;
  bulkDeleteOrders: () => void;
  updateOrderStatus: (id: string, s: OrderStatus) => Promise<void>;
  viewingOrder: Order | null;
  setViewingOrder: (o: Order | null) => void;
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;
}

export function AdminDashboard(props: AdminDashboardProps) {
  const {
    orders,
    metrics,
    chartData,
    filteredOrders,
    batchingSummary,
    filterStatus,
    setFilterStatus,
    filterSize,
    setFilterSize,
    filterDate,
    setFilterDate,
    searchQuery,
    setSearchQuery,
    isShippingMode,
    setIsShippingMode,
    selectedOrderIds,
    setSelectedOrderIds,
    toggleSelectAll,
    toggleSelectOrder,
    exportToCSV,
    setShowPrintView,
    bulkUpdateStatus,
    bulkDeleteOrders,
    updateOrderStatus,
    viewingOrder,
    setViewingOrder,
    adminTab,
    setAdminTab,
  } = props;

  return (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end border-b-brutal pb-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter">DASHBOARD</h2>
                  <p className="font-mono text-[10px] font-bold opacity-50">MANAGE YOUR ORDERS AND PRODUCTION.</p>
                </div>
                <div className="font-mono text-[10px] font-bold opacity-50">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { label: 'REVENUE', value: `${metrics.revenue.toLocaleString()} LKR`, icon: DollarSign, color: 'bg-stone-900 text-white', sub: 'TOTAL REVENUE' },
                  { label: 'TODAY', value: metrics.today, icon: Clock, color: 'bg-stone-50', sub: 'NEW ORDERS' },
                  { label: 'PENDING', value: metrics.pending, icon: AlertCircle, color: 'bg-amber-50', sub: 'AWAITING CONFIRMATION' },
                  { label: 'CONFIRMED', value: metrics.confirmed, icon: CheckCircle, color: 'bg-blue-50', sub: 'READY FOR PRODUCTION' },
                  { label: 'SHIPPED', value: metrics.shipped, icon: TruckIcon, color: 'bg-indigo-50', sub: 'IN TRANSIT' },
                  { label: 'DELIVERED', value: metrics.delivered, icon: Package, color: 'bg-emerald-50', sub: 'COMPLETED' },
                  { label: 'FAILED', value: metrics.failed, icon: Ban, color: 'bg-red-50', sub: 'CANCELLED/FAILED' },
                ].map((m) => (
                  <div key={m.label} className={`${m.color} p-5 border-brutal hover:translate-y-[-2px] transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 border border-black ${m.label === 'REVENUE' ? 'bg-white text-black' : 'bg-white'}`}>
                        <m.icon size={16} />
                      </div>
                      <span className={`text-[9px] font-black font-mono tracking-tighter ${m.label === 'REVENUE' ? 'opacity-60' : 'opacity-40'}`}>{m.label}</span>
                    </div>
                    <div className="text-3xl font-black tracking-tighter mb-1 truncate">{m.value}</div>
                    <div className={`text-[8px] font-bold font-mono uppercase ${m.label === 'REVENUE' ? 'opacity-60' : 'opacity-40'}`}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-brutal bg-white p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm font-mono">
                      <TrendingUp size={16} /> SALES OVERVIEW (LAST 7 DAYS)
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-black" />
                        <span className="text-[9px] font-bold font-mono opacity-50">ORDERS</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                        />
                        <RechartsTooltip 
                          cursor={{ fill: '#f5f5f5' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-black text-white p-3 border border-white/10 font-mono text-[10px]">
                                  <div className="font-black mb-1">{payload[0].payload.date}</div>
                                  <div className="flex justify-between gap-8">
                                    <span>ORDERS:</span>
                                    <span className="font-black">{payload[0].value}</span>
                                  </div>
                                  <div className="flex justify-between gap-8">
                                    <span>REVENUE:</span>
                                    <span className="font-black">{payload[0].payload.revenue} LKR</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="orders" fill="#000">
                          {chartData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#000' : '#333'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-black text-white p-8 card-brutal space-y-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                      <div className="text-xs font-black font-mono tracking-widest">QUICK ACTIONS</div>
                      <LayoutDashboard size={16} className="opacity-40" />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={exportToCSV}
                        className="w-full py-4 bg-white text-black text-[10px] font-black font-mono hover:bg-stone-200 transition-all flex items-center justify-center gap-3"
                      >
                        <Download size={16} /> DOWNLOAD SALES REPORT
                      </button>
                      <button 
                        onClick={() => setAdminTab('batching')}
                        className="w-full py-4 border border-white/20 text-white text-[10px] font-black font-mono hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                      >
                        <Box size={16} /> PRODUCTION BATCHING
                      </button>
                    </div>
                  </div>
                  <div className="p-6 border border-white/10 bg-white/5 space-y-2">
                    <div className="text-[9px] font-black font-mono opacity-40">SYSTEM STATUS</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black font-mono">ALL SYSTEMS OPERATIONAL</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar: Filters */}
                <div className="lg:w-72 space-y-6 flex-shrink-0">
                  <div className="card-brutal p-6 space-y-8 bg-white sticky top-24">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-xs font-mono">
                        <Filter size={14} /> CONTROL PANEL
                      </div>
                      {(filterStatus !== 'all' || filterSize !== 'all' || filterDate !== 'all' || searchQuery !== '') && (
                        <button 
                          onClick={() => {
                            setFilterStatus('all');
                            setFilterSize('all');
                            setFilterDate('all');
                            setSearchQuery('');
                          }}
                          className="text-[9px] font-bold font-mono underline hover:opacity-50"
                        >
                          RESET
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black font-mono opacity-30 tracking-widest">ORDER STATUS</label>
                        <div className="grid grid-cols-1 gap-1">
                          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed'].map(s => (
                            <button
                              key={s}
                              onClick={() => setFilterStatus(s as any)}
                              className={`text-left px-3 py-2 text-[10px] font-bold font-mono border transition-all flex justify-between items-center ${
                                filterStatus === s 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-black border-transparent hover:border-black'
                              }`}
                            >
                              <span>{s?.toUpperCase() || ''}</span>
                              <span className="opacity-40 text-[8px]">
                                {s === 'all' ? orders.length : orders.filter(o => o.status === s).length}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black font-mono opacity-30 tracking-widest">TIME PERIOD</label>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            { id: 'all', label: 'ALL TIME' },
                            { id: 'today', label: 'TODAY' },
                            { id: 'yesterday', label: 'YESTERDAY' },
                            { id: 'last7', label: '7 DAYS' }
                          ].map(d => (
                            <button
                              key={d.id}
                              onClick={() => setFilterDate(d.id as any)}
                              className={`text-center px-2 py-2 text-[9px] font-bold font-mono border transition-all ${
                                filterDate === d.id 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-black border-transparent hover:border-black'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black font-mono opacity-30 tracking-widest">SIZE FILTER</label>
                        <div className="grid grid-cols-3 gap-1">
                          {['all', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                            <button
                              key={s}
                              onClick={() => setFilterSize(s)}
                              className={`text-center px-2 py-2 text-[9px] font-bold font-mono border transition-all ${
                                filterSize === s 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-black border-transparent hover:border-black'
                              }`}
                            >
                              {s?.toUpperCase() || ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-black space-y-3">
                      <button 
                        onClick={() => setIsShippingMode(!isShippingMode)}
                        className={`w-full py-3 text-[10px] font-black font-mono border border-black transition-all flex items-center justify-center gap-2 ${
                          isShippingMode 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black hover:bg-stone-100'
                        }`}
                      >
                        <TruckIcon size={14} /> SHIPPING MODE: {isShippingMode ? 'ON' : 'OFF'}
                      </button>
                      <p className="text-[8px] font-bold font-mono opacity-40 text-center leading-tight">
                        SHIPPING MODE FILTERS FOR CONFIRMED ORDERS READY TO BE DISPATCHED.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black text-white p-6 card-brutal space-y-6">
                    <div className="flex items-center justify-between border-b border-white/20 pb-3">
                      <div className="text-[10px] font-black font-mono">PRODUCTION QUEUE</div>
                      <Box size={14} className="opacity-40" />
                    </div>
                    <div className="space-y-3">
                      {Object.entries(batchingSummary).length > 0 ? (
                        Object.entries(batchingSummary).map(([size, count]) => (
                          <div key={size} className="flex justify-between items-center text-[11px] font-mono">
                            <span className="opacity-50 tracking-tighter">SIZE {size}</span>
                            <span className="font-bold bg-white text-black px-1.5">{count}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] opacity-40 italic font-mono">NO CONFIRMED ORDERS</div>
                      )}
                    </div>
                    <button 
                      onClick={() => setAdminTab('batching')}
                      className="w-full py-3 bg-white text-black text-[10px] font-black font-mono hover:bg-stone-200 transition-all border border-white"
                    >
                      GENERATE BATCH LIST
                    </button>
                  </div>
                </div>

                {/* Main Content: Orders Table */}
                <div className="flex-grow space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow max-w-xl">
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                        <input 
                          type="text"
                          placeholder="SEARCH BY NAME, PHONE, OR ORDER ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 text-xs border-brutal bg-white focus:bg-stone-50 transition-all font-bold placeholder:opacity-30"
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-black font-mono opacity-30">SHOWING {filteredOrders.length} OF {orders.length} ORDERS</span>
                        <div className="w-1 h-1 bg-black/10 rounded-full" />
                        <span className="text-[9px] font-black font-mono opacity-30">LAST UPDATED: {new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={exportToCSV}
                        className="btn-brutal p-4 flex items-center gap-2"
                        title="Export CSV"
                      >
                        <Download size={18} />
                        <span className="text-[10px] font-black font-mono hidden sm:inline">EXPORT</span>
                      </button>
                      <button 
                        disabled={selectedOrderIds.size === 0}
                        onClick={() => setShowPrintView(true)}
                        className="btn-brutal px-6 py-4 text-[10px] font-black font-mono flex items-center gap-2 disabled:opacity-30"
                      >
                        <Printer size={18} /> PRINT LABELS
                      </button>
                    </div>
                  </div>

                  {/* Bulk Actions Bar */}
                  <AnimatePresence>
                    {selectedOrderIds.size > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="bg-black text-white p-4 flex flex-col sm:flex-row items-center justify-between card-brutal gap-4"
                      >
                        <div className="text-[11px] font-black font-mono px-4 flex items-center gap-4">
                          <div className="bg-white text-black w-8 h-8 flex items-center justify-center font-black">
                            {selectedOrderIds.size}
                          </div>
                          <span className="tracking-tighter">ORDERS SELECTED FOR BATCH UPDATE</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => bulkUpdateStatus('confirmed')} className="px-4 py-2 bg-white text-black text-[10px] font-black font-mono hover:bg-stone-200 transition-colors">CONFIRM</button>
                          <button onClick={() => bulkUpdateStatus('shipped')} className="px-4 py-2 bg-white text-black text-[10px] font-black font-mono hover:bg-stone-200 transition-colors">SHIP</button>
                          <button onClick={() => bulkUpdateStatus('delivered')} className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black font-mono hover:bg-emerald-600 transition-colors">DELIVER</button>
                          <button onClick={() => bulkUpdateStatus('cancelled')} className="px-4 py-2 bg-red-500 text-white text-[10px] font-black font-mono hover:bg-red-600 transition-colors">CANCEL</button>
                          <button onClick={bulkDeleteOrders} className="px-4 py-2 bg-red-900 text-white text-[10px] font-black font-mono hover:bg-red-950 transition-colors flex items-center gap-2">
                            <Trash2 size={14} /> DELETE
                          </button>
                          <div className="w-px h-8 bg-white/20 mx-2" />
                          <button onClick={() => setSelectedOrderIds(new Set())} className="p-2 hover:bg-white/10 transition-colors" title="Clear Selection"><X size={20} /></button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="border-brutal bg-white overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[12px]">
                        <thead>
                          <tr className="bg-black text-white font-mono">
                            <th className="p-5 w-12 text-center border-r border-white/10">
                              <input 
                                type="checkbox" 
                                checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 accent-white cursor-pointer"
                              />
                            </th>
                            <th className="p-5 font-black border-r border-white/10 tracking-tighter">CUSTOMER / ID</th>
                            <th className="p-5 font-black border-r border-white/10 tracking-tighter">DELIVERY ADDRESS</th>
                            <th className="p-5 font-black text-center border-r border-white/10 tracking-tighter">ITEMS</th>
                            <th className="p-5 font-black text-center border-r border-white/10 tracking-tighter">VALUE</th>
                            <th className="p-5 font-black border-r border-white/10 tracking-tighter">STATUS</th>
                            <th className="p-5 font-black text-right tracking-tighter">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-32 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-20">
                                  <Search size={48} />
                                  <p className="font-black font-mono text-sm tracking-widest uppercase">NO MATCHING ORDERS FOUND</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map(order => (
                              <tr key={order.id} className={`transition-colors group ${selectedOrderIds.has(order.id) ? 'bg-stone-50' : 'hover:bg-stone-50/50'}`}>
                                <td className="p-5 text-center border-r border-black/5">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedOrderIds.has(order.id)}
                                    onChange={() => toggleSelectOrder(order.id)}
                                    className="w-4 h-4 accent-black cursor-pointer"
                                  />
                                </td>
                                <td className="p-5 border-r border-black/5">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-black text-sm tracking-tight">{order.customerName?.toUpperCase() || ''}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[10px] font-bold opacity-60">{order.phone}</span>
                                      <span className="w-1 h-1 bg-black/20 rounded-full" />
                                      <span className="font-mono text-[9px] opacity-40 tracking-widest">#{order.id?.slice(-6).toUpperCase() || ''}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-5 border-r border-black/5">
                                  <div className="max-w-[240px] text-[10px] font-bold font-mono leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity" title={order.address}>
                                    {order.address?.toUpperCase() || ''}
                                  </div>
                                </td>
                                <td className="p-5 text-center border-r border-black/5">
                                  <div className="flex flex-col gap-1 items-center">
                                    <span className="font-mono font-black bg-stone-100 px-2 py-1 text-[10px] border border-black/5">{order.size}</span>
                                    {order.items && order.items.length > 1 && (
                                      <span className="text-[8px] font-black font-mono opacity-40">{order.items.length} ITEMS</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-5 text-center border-r border-black/5">
                                  <div className="flex flex-col items-center">
                                    <span className="font-black text-sm">{getOrderTotal(order)}</span>
                                    <span className="text-[9px] font-black font-mono opacity-40">LKR</span>
                                  </div>
                                </td>
                                <td className="p-5 border-r border-black/5">
                                  <div className="flex justify-center">
                                    <span className={`px-3 py-1.5 text-[9px] font-black font-mono border-brutal shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                                      order.status === 'pending' ? 'bg-white text-black' :
                                      order.status === 'confirmed' ? 'bg-blue-500 text-white' :
                                      order.status === 'shipped' ? 'bg-indigo-500 text-white' :
                                      order.status === 'delivered' ? 'bg-emerald-500 text-white' :
                                      'bg-red-500 text-white'
                                    }`}>
                                      {order.status?.toUpperCase() || ''}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => setViewingOrder(order)}
                                      className="p-2.5 border border-black hover:bg-black hover:text-white transition-all"
                                      title="View Details"
                                    >
                                      <Eye size={16} />
                                    </button>
                                    <a 
                                      href={`https://wa.me/${order.phone?.replace(/\s/g, '') || ''}?text=${encodeURIComponent(`HI ${order.customerName?.toUpperCase() || ''}! YOU ORDERED A WHITE THOBE 🤍 PLEASE REPLY YES TO CONFIRM (SIZE: ${order.size}, TOTAL: ${getOrderTotal(order)} LKR, ADDRESS: ${order.address})`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2.5 border border-black hover:bg-emerald-500 hover:text-white transition-all group/wa"
                                      title="WhatsApp Customer"
                                    >
                                      <MessageCircle size={16} className="group-hover/wa:scale-110 transition-transform" />
                                    </a>
                                    <div className="w-px h-8 bg-black/10 mx-1" />
                                    <div className="flex items-center gap-1">
                                      {order.status === 'pending' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="p-2.5 border border-black hover:bg-black hover:text-white transition-all" title="Confirm Order"><Check size={16} /></button>
                                      )}
                                      {order.status === 'confirmed' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="p-2.5 border border-black hover:bg-black hover:text-white transition-all" title="Mark as Shipped"><TruckIcon size={16} /></button>
                                      )}
                                      {order.status === 'shipped' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="p-2.5 border border-black hover:bg-black hover:text-white transition-all" title="Mark as Delivered"><Package size={16} /></button>
                                      )}
                                      <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="p-2.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Cancel Order"><Ban size={16} /></button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-black/10">
                      {filteredOrders.length === 0 ? (
                        <div className="p-20 text-center opacity-20">
                          <Search size={32} className="mx-auto mb-4" />
                          <p className="font-black font-mono text-[10px] tracking-widest">NO ORDERS</p>
                        </div>
                      ) : (
                        filteredOrders.map(order => (
                          <div key={order.id} className="p-6 space-y-4 bg-white">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="font-black text-sm tracking-tight">{order.customerName?.toUpperCase() || ''}</div>
                                <div className="font-mono text-[10px] font-bold opacity-50">{order.phone}</div>
                                <div className="font-mono text-[9px] opacity-30">#{order.id?.slice(-6).toUpperCase() || ''}</div>
                              </div>
                              <span className={`px-2 py-1 text-[8px] font-black font-mono border-brutal shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                                order.status === 'pending' ? 'bg-white text-black' :
                                order.status === 'confirmed' ? 'bg-blue-500 text-white' :
                                order.status === 'shipped' ? 'bg-indigo-500 text-white' :
                                order.status === 'delivered' ? 'bg-emerald-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                {order.status?.toUpperCase() || ''}
                              </span>
                            </div>
                            
                            <div className="p-3 bg-stone-50 border border-black/5 text-[10px] font-bold font-mono leading-relaxed opacity-70">
                              {order.address?.toUpperCase() || ''}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="text-[8px] font-black font-mono opacity-30">SIZE</div>
                                  <div className="text-xs font-black font-mono">{order.size}</div>
                                </div>
                                <div>
                                  <div className="text-[8px] font-black font-mono opacity-30">VALUE</div>
                                  <div className="text-xs font-black font-mono">{getOrderTotal(order)} LKR</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setViewingOrder(order)} className="p-2 border border-black"><Eye size={14} /></button>
                                <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="p-2 border border-black bg-black text-white"><Check size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

      <OrderDetailModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        updateOrderStatus={updateOrderStatus}
        onLocalStatusChange={(o, status) => setViewingOrder({ ...o, status })}
      />
      {adminTab === 'batching' && (
        <BatchingModal batchingSummary={batchingSummary} onClose={() => setAdminTab('orders')} />
      )}
    </motion.div>
  );
}
