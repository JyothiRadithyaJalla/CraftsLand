import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { useOrders } from '@shared/hooks/useOrders';
import type { Order, OrderStatus } from '@shared/types/order';
import { formatPrice } from '@shared/utils/formatters';
import { InvoiceModal } from '@shared/components/InvoiceModal';
import {
  Search, Eye, X, CheckCircle2, DollarSign, RefreshCw, Receipt
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, refreshOrders } = useOrders();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedBillOrder, setSelectedBillOrder] = useState<Order | null>(null);
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
    setRefundMsg(`Simulated refund of ${formatPrice(order.totalAmount)} processed for ticket ${order.orderNumber}.`);
    setTimeout(() => setRefundMsg(null), 4000);
  };

  return (
    <AdminLayout>
      <MetaTags title="Orders Management | Craftsland Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D8D2] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F172A]">Orders Queue & History</h1>
          <p className="text-xs text-slate-500 font-medium">Live incoming tickets, status overrides, and order details</p>
        </div>
        <button
          onClick={() => refreshOrders()}
          className="px-4 py-2.5 rounded-xl border border-[#D8D8D2] bg-white text-[#0F172A] hover:bg-[#F4F4F1] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Orders Stream
        </button>
      </div>

      {/* Refund Toast Banner */}
      {refundMsg && (
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{refundMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#D8D8D2] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#0F172A] transition-colors"
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
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Order Mode</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#0F172A] transition-colors"
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
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order # or dish..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D8D8D2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D8D8D2] text-slate-600 uppercase text-[10px] font-mono font-bold tracking-wider">
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
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-serif text-sm">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#0F172A]">{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold text-[#0F172A] block">{o.orderType}</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {o.orderType === 'DINE_IN'
                          ? (o.tableNumber?.startsWith('Table') ? o.tableNumber : `Table ${o.tableNumber || 'N/A'}`)
                          : o.deliveryAddress || 'Pickup'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{o.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                    <td className="p-4 font-mono font-bold text-[#0F172A]">{formatPrice(o.totalAmount)}</td>
                    <td className="p-4">
                      <div className="space-y-1.5">
                        <div>
                          {o.orderStatus === 'PENDING' && o.paymentStatus === 'PAID' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-blue-100 border border-blue-300 text-blue-800 tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                              NEW PAID ORDER
                            </span>
                          ) : o.orderStatus === 'ACCEPTED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-100 border border-purple-300 text-purple-800">
                              ACCEPTED
                            </span>
                          ) : o.orderStatus === 'PREPARING' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-100 border border-amber-300 text-amber-800">
                              PREPARING
                            </span>
                          ) : o.orderStatus === 'READY' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 border border-emerald-300 text-emerald-800">
                              READY
                            </span>
                          ) : o.orderStatus === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-100 border border-slate-300 text-slate-700">
                              COMPLETED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-100 border border-rose-300 text-rose-800">
                              {o.orderStatus}
                            </span>
                          )}
                        </div>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className="border border-[#D8D8D2] bg-[#F8FAFC] rounded-lg px-2 py-0.5 text-[11px] font-bold text-[#0F172A] focus:outline-none cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="READY">READY</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-500">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBillOrder(o)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 border border-[#D8D8D2] text-[#0F172A] hover:bg-[#0F172A] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Generate Guest Bill"
                        >
                          <Receipt className="w-3.5 h-3.5" /> Bill
                        </button>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl border border-[#D8D8D2] rounded-3xl p-6 space-y-6 text-[#0F172A] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#D8D8D2] pb-4">
              <div>
                <span className="text-xs text-slate-500 font-mono font-semibold">Order Ticket Detail</span>
                <h3 className="font-serif text-2xl font-bold text-[#0F172A]">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Override Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] border border-[#D8D8D2] p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Dining Mode</span>
                <span className="font-bold text-[#0F172A]">{selectedOrder.orderType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Status</span>
                <span className="font-bold text-emerald-700">{selectedOrder.paymentStatus}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Ref</span>
                <span className="font-mono text-slate-600">{selectedOrder.paymentReference || 'N/A'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Ordered Dishes</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl flex justify-between items-start text-xs">
                  <div>
                    <h5 className="font-serif font-bold text-[#0F172A]">{item.dishName}</h5>
                    <p className="text-slate-500 font-mono">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                    {item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-slate-600 font-mono mt-1">
                        {item.selectedModifiers.map((m, idx) => (
                          <span key={idx} className="block">• {m.optionName}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-[#0F172A]">{formatPrice(item.itemSubtotal)}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs pt-3 border-t border-[#D8D8D2] font-mono">
              <div className="flex justify-between text-slate-600"><span>Subtotal:</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Tax (8.5%):</span><span>{formatPrice(selectedOrder.taxAmount)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Delivery Fee:</span><span>{formatPrice(selectedOrder.deliveryFee)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Gratuity:</span><span>{formatPrice(selectedOrder.tipAmount)}</span></div>
              <div className="flex justify-between text-sm font-bold text-[#0F172A] pt-2 border-t border-[#D8D8D2] font-serif">
                <span>Total Amount:</span>
                <span className="text-[#0F172A] font-mono font-bold text-base">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#D8D8D2]">
              <button
                onClick={() => setSelectedBillOrder(selectedOrder)}
                className="py-2.5 px-5 rounded-xl bg-[#0F172A] text-white hover:bg-[#1E293B] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Receipt className="w-4 h-4" /> Generate Official Bill
              </button>
              <button
                onClick={() => handleProcessRefund(selectedOrder)}
                className="py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <DollarSign className="w-4 h-4" /> Process Demo Refund
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedOrder.id, 'CANCELLED');
                }}
                className="py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Cancel Order Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Folio / Official Tax Invoice Modal */}
      <InvoiceModal
        order={selectedBillOrder}
        isOpen={Boolean(selectedBillOrder)}
        onClose={() => setSelectedBillOrder(null)}
      />
    </AdminLayout>
  );
};
