import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MetaTags } from '../../components/common/MetaTags';
import { useOrders } from '../../hooks/useOrders';
import type { Order, OrderStatus } from '../../types/order';
import {
  Search, Eye, X, CheckCircle2, DollarSign, RefreshCw
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, refreshOrders } = useOrders();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundMsg, setRefundMsg] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    if (typeFilter !== 'ALL' && o.orderType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchTable = o.tableNumber?.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.dishName.toLowerCase().includes(q));
      if (!matchNum && !matchTable && !matchItem) return false;
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const handleProcessRefund = (order: Order) => {
    setRefundMsg(`Simulated refund of $${order.totalAmount.toFixed(2)} processed for ticket ${order.orderNumber}.`);
    setTimeout(() => setRefundMsg(null), 4000);
  };

  return (
    <AdminLayout>
      <MetaTags title="Orders Management | L'Étoile Noir Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Orders Queue & History</h1>
          <p className="text-xs text-gray-400">Live incoming tickets, status overrides, and order details</p>
        </div>
        <button
          onClick={() => refreshOrders()}
          className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Orders Stream
        </button>
      </div>

      {/* Refund Toast Banner */}
      {refundMsg && (
        <div className="glass-card p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{refundMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-[#12141C]/80">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Order Mode</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Modes</option>
              <option value="DINE_IN">Dine-In</option>
              <option value="PICKUP">Pickup</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order # or dish..."
            className="w-full bg-[#0B0C10] border border-white/15 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0C10] border-b border-white/10 text-gray-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Ticket #</th>
                <th className="p-4">Mode & Table/Addr</th>
                <th className="p-4">Dishes Count</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Placed At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-serif text-sm">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#D4AF37]">{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold text-[#F4F1EA] block">{o.orderType}</span>
                      <span className="text-[11px] text-gray-400">
                        {o.orderType === 'DINE_IN' ? `Table ${o.tableNumber || 'N/A'}` : o.deliveryAddress || 'Pickup'}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{o.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                    <td className="p-4 font-mono font-bold text-[#F4F1EA]">${o.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`bg-[#0B0C10] border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                          o.orderStatus === 'COMPLETED'
                            ? 'border-emerald-500 text-emerald-400'
                            : o.orderStatus === 'CANCELLED'
                            ? 'border-red-500 text-red-400'
                            : 'border-[#D4AF37] text-[#D4AF37]'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono text-gray-400">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0C10] font-semibold text-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0C10]/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl bg-[#12141C] border border-[#D4AF37]/30 rounded-3xl p-6 space-y-6 text-[#F4F1EA] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-gray-400 font-mono">Order Ticket Detail</span>
                <h3 className="font-serif text-2xl font-bold text-gold-gradient">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Override Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-4 rounded-xl text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Dining Mode</span>
                <span className="font-bold text-[#D4AF37]">{selectedOrder.orderType}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Payment Status</span>
                <span className="font-bold text-emerald-400">{selectedOrder.paymentStatus}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Payment Ref</span>
                <span className="font-mono text-gray-300">{selectedOrder.paymentReference || 'N/A'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#F4F1EA]">Ordered Dishes</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="glass-card p-3.5 rounded-xl flex justify-between items-start text-xs">
                  <div>
                    <h5 className="font-serif font-bold text-[#F4F1EA]">{item.dishName}</h5>
                    <p className="text-gray-400 font-mono">${item.unitPrice.toFixed(2)} × {item.quantity}</p>
                    {item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-[#D4AF37] font-mono mt-1">
                        {item.selectedModifiers.map((m, idx) => (
                          <span key={idx} className="block">• {m.optionName}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-[#F4F1EA]">${item.itemSubtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs pt-3 border-t border-white/10 font-mono">
              <div className="flex justify-between text-gray-400"><span>Subtotal:</span><span>${selectedOrder.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Tax (8.5%):</span><span>${selectedOrder.taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Delivery Fee:</span><span>${selectedOrder.deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Gratuity:</span><span>${selectedOrder.tipAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold text-[#F4F1EA] pt-2 border-t border-white/10 font-serif">
                <span>Total Amount:</span>
                <span className="text-gold-gradient">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => handleProcessRefund(selectedOrder)}
                className="py-2.5 px-4 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" /> Process Demo Refund
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedOrder.id, 'CANCELLED');
                }}
                className="py-2.5 px-4 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Cancel Order Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
