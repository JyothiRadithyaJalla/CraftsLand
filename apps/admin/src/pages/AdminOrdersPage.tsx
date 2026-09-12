import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { useOrders } from '@shared/hooks/useOrders';
import type { Order, OrderStatus } from '@shared/types/order';
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
      <MetaTags title="Orders Management | Craftsland Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Orders Queue & History</h1>
          <p className="text-xs text-[#B8AEA1]">Live incoming tickets, status overrides, and order details</p>
        </div>
        <button
          onClick={() => refreshOrders()}
          className="px-4 py-2 rounded-xl border border-[#3A3027] bg-[#171310] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B84A32] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Orders Stream
        </button>
      </div>

      {/* Refund Toast Banner */}
      {refundMsg && (
        <div className="bg-[#211B16] p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{refundMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-[#211B16] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#3A3027] shadow-md">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#B8AEA1] uppercase font-semibold">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-1.5 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
            >
              <option value="ALL" className="bg-[#211B16] text-[#F5EFE5]">All Statuses</option>
              <option value="PENDING" className="bg-[#211B16] text-[#F5EFE5]">Pending</option>
              <option value="ACCEPTED" className="bg-[#211B16] text-[#F5EFE5]">Accepted</option>
              <option value="PREPARING" className="bg-[#211B16] text-[#F5EFE5]">Preparing</option>
              <option value="READY" className="bg-[#211B16] text-[#F5EFE5]">Ready</option>
              <option value="COMPLETED" className="bg-[#211B16] text-[#F5EFE5]">Completed</option>
              <option value="CANCELLED" className="bg-[#211B16] text-[#F5EFE5]">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#B8AEA1] uppercase font-semibold">Order Mode</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-1.5 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
            >
              <option value="ALL" className="bg-[#211B16] text-[#F5EFE5]">All Modes</option>
              <option value="DINE_IN" className="bg-[#211B16] text-[#F5EFE5]">Dine-In</option>
              <option value="PICKUP" className="bg-[#211B16] text-[#F5EFE5]">Pickup</option>
              <option value="DELIVERY" className="bg-[#211B16] text-[#F5EFE5]">Delivery</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#B8AEA1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order # or dish..."
            className="w-full bg-[#171310] border border-[#3A3027] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
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
            <tbody className="divide-y divide-[#3A3027]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#B8AEA1] font-serif text-sm">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#2A231C]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#C85A3A]">{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold text-[#F5EFE5] block">{o.orderType}</span>
                      <span className="text-[11px] text-[#B8AEA1]">
                        {o.orderType === 'DINE_IN'
                          ? (o.tableNumber?.startsWith('Table') ? o.tableNumber : `Table ${o.tableNumber || 'N/A'}`)
                          : o.deliveryAddress || 'Pickup'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[#B8AEA1]">{o.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                    <td className="p-4 font-mono font-bold text-[#F5EFE5]">${o.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`bg-[#171310] border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                          o.orderStatus === 'COMPLETED'
                            ? 'border-emerald-500 text-emerald-400'
                            : o.orderStatus === 'CANCELLED'
                            ? 'border-red-500 text-red-400'
                            : 'border-[#B84A32] text-[#C85A3A]'
                        }`}
                      >
                        <option value="PENDING" className="bg-[#211B16] text-[#F5EFE5]">PENDING</option>
                        <option value="ACCEPTED" className="bg-[#211B16] text-[#F5EFE5]">ACCEPTED</option>
                        <option value="PREPARING" className="bg-[#211B16] text-[#F5EFE5]">PREPARING</option>
                        <option value="READY" className="bg-[#211B16] text-[#F5EFE5]">READY</option>
                        <option value="COMPLETED" className="bg-[#211B16] text-[#F5EFE5]">COMPLETED</option>
                        <option value="CANCELLED" className="bg-[#211B16] text-[#F5EFE5]">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono text-[#B8AEA1]">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 rounded-lg bg-[#B84A32]/15 border border-[#B84A32]/30 text-[#C85A3A] hover:bg-[#B84A32] hover:text-[#F5EFE5] font-semibold text-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#211B16] w-full max-w-2xl border border-[#3A3027] rounded-3xl p-6 space-y-6 text-[#F5EFE5] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#3A3027] pb-4">
              <div>
                <span className="text-xs text-[#B8AEA1] font-mono">Order Ticket Detail</span>
                <h3 className="font-serif text-2xl font-bold text-red-gradient">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Override Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#171310] border border-[#3A3027] p-4 rounded-xl text-xs">
              <div>
                <span className="text-[#B8AEA1] block text-[10px]">Dining Mode</span>
                <span className="font-bold text-[#C85A3A]">{selectedOrder.orderType}</span>
              </div>
              <div>
                <span className="text-[#B8AEA1] block text-[10px]">Payment Status</span>
                <span className="font-bold text-emerald-400">{selectedOrder.paymentStatus}</span>
              </div>
              <div>
                <span className="text-[#B8AEA1] block text-[10px]">Payment Ref</span>
                <span className="font-mono text-[#B8AEA1]">{selectedOrder.paymentReference || 'N/A'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#F5EFE5]">Ordered Dishes</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="bg-[#171310] border border-[#3A3027] p-3.5 rounded-xl flex justify-between items-start text-xs">
                  <div>
                    <h5 className="font-serif font-bold text-[#F5EFE5]">{item.dishName}</h5>
                    <p className="text-[#B8AEA1] font-mono">${item.unitPrice.toFixed(2)} × {item.quantity}</p>
                    {item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-[#C85A3A] font-mono mt-1">
                        {item.selectedModifiers.map((m, idx) => (
                          <span key={idx} className="block">• {m.optionName}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-[#F5EFE5]">${item.itemSubtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs pt-3 border-t border-[#3A3027] font-mono">
              <div className="flex justify-between text-[#B8AEA1]"><span>Subtotal:</span><span>${selectedOrder.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#B8AEA1]"><span>Tax (8.5%):</span><span>${selectedOrder.taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#B8AEA1]"><span>Delivery Fee:</span><span>${selectedOrder.deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#B8AEA1]"><span>Gratuity:</span><span>${selectedOrder.tipAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold text-[#F5EFE5] pt-2 border-t border-[#3A3027] font-serif">
                <span>Total Amount:</span>
                <span className="text-red-gradient">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#3A3027]">
              <button
                onClick={() => handleProcessRefund(selectedOrder)}
                className="py-2.5 px-4 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <DollarSign className="w-4 h-4" /> Process Demo Refund
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedOrder.id, 'CANCELLED');
                }}
                className="py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-400 hover:bg-red-900/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
