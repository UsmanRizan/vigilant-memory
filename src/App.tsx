import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { AppFooter } from "@/src/components/AppFooter";
import { AppNav } from "@/src/components/AppNav";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { Marquee } from "@/src/components/Marquee";
import { PrintLabelsView } from "@/src/components/PrintLabelsView";
import { SizeGuideModal } from "@/src/components/SizeGuideModal";
import { totalLkrForPieceCount } from "@/src/constants";
import { getOrderTotal } from "@/src/lib/orderValue";
import type {
  AdminTab,
  CheckoutFormState,
  Order,
  OrderItem,
  OrderStatus,
  View,
} from "@/src/types/order";
import { AdminDashboard } from "@/src/views/AdminDashboard";
import { ConfirmationView } from "@/src/views/ConfirmationView";
import { HomeView } from "@/src/views/HomeView";
import { OrderFormView } from "@/src/views/OrderFormView";
import { SupportView } from "@/src/views/SupportView";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [adminTab, setAdminTab] = useState<AdminTab>("orders");
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">(
    "pending",
  );
  const [filterSize, setFilterSize] = useState<string | "all">("all");
  const [filterDate, setFilterDate] = useState<
    "all" | "today" | "yesterday" | "last7"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShippingMode, setIsShippingMode] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState<CheckoutFormState>({
    name: "",
    phone: "",
    address: "",
    cart: [] as OrderItem[],
  });

  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/admin123") {
      setIsAdmin(true);
      setView("admin");
    }
    setLoading(false);
  }, []);

  const fetchOrders = async (retries = 3) => {
    const url = "/api/orders";
    console.log(`Fetching orders from: ${url} (retries left: ${retries})`);
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `Failed to fetch orders: ${response.status} ${response.statusText}`,
        );
      const data = await response.json();
      setOrders(data.map((o: { _id: string }) => ({ ...o, id: o._id })));
      console.log(`Successfully fetched ${data.length} orders`);
    } catch (err) {
      console.error("API error:", err);
      if (retries > 0) {
        console.log(`Retrying fetchOrders... (${retries} left)`);
        setTimeout(() => fetchOrders(retries - 1), 2000);
      }
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      return;
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled" && o.status !== "failed")
      .reduce((sum, o) => sum + getOrderTotal(o), 0);

    return {
      today: todayOrders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      failed: orders.filter(
        (o) => o.status === "failed" || o.status === "cancelled",
      ).length,
      revenue: totalRevenue,
    };
  }, [orders]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
      })
      .reverse();

    return last7Days.map((date) => {
      const dayOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        const oDate = new Date(o.createdAt);
        return (
          oDate.getFullYear() === date.getFullYear() &&
          oDate.getMonth() === date.getMonth() &&
          oDate.getDate() === date.getDate()
        );
      });

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + getOrderTotal(o), 0),
      };
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = isShippingMode
        ? o.status === "confirmed"
        : filterStatus === "all" || o.status === filterStatus;

      const matchesSize =
        filterSize === "all" ||
        (o.items
          ? o.items.some(
              (item) =>
                item.size === filterSize ||
                item.size.startsWith(filterSize + "-"),
            )
          : o.size === filterSize || o.size?.startsWith(filterSize + "-"));

      const matchesSearch =
        (o.customerName?.toLowerCase() || "").includes(
          searchQuery?.toLowerCase() || "",
        ) ||
        (o.phone || "").includes(searchQuery) ||
        (o.id?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "");

      let matchesDate = true;
      if (filterDate !== "all" && o.createdAt) {
        const orderDate = new Date(o.createdAt);
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        if (filterDate === "today") {
          matchesDate = orderDate >= startOfDay;
        } else if (filterDate === "yesterday") {
          const yesterday = new Date(startOfDay);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = orderDate >= yesterday && orderDate < startOfDay;
        } else if (filterDate === "last7") {
          const last7 = new Date(startOfDay);
          last7.setDate(last7.getDate() - 7);
          matchesDate = orderDate >= last7;
        }
      }

      return matchesStatus && matchesSize && matchesSearch && matchesDate;
    });
  }, [
    orders,
    filterStatus,
    filterSize,
    filterDate,
    searchQuery,
    isShippingMode,
  ]);

  const batchingSummary = useMemo(() => {
    const confirmed = orders.filter((o) => o.status === "confirmed");
    const summary: Record<string, number> = {};
    confirmed.forEach((o) => {
      if (o.items) {
        o.items.forEach((item) => {
          summary[item.size] = (summary[item.size] || 0) + item.quantity;
        });
      } else if (o.size) {
        summary[o.size] = (summary[o.size] || 0) + 1;
      }
    });
    return summary;
  }, [orders]);

  const addSizeToCart = (sizeCode: string) => {
    const existingIndex = formData.cart.findIndex(
      (item) => item.size === sizeCode,
    );

    if (existingIndex > -1) {
      const newCart = [...formData.cart];
      newCart[existingIndex].quantity += 1;
      setFormData({ ...formData, cart: newCart });
    } else {
      setFormData({
        ...formData,
        cart: [...formData.cart, { size: sizeCode, quantity: 1 }],
      });
    }
  };

  const updateCartQuantity = (index: number, delta: number) => {
    const newCart = [...formData.cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setFormData({ ...formData, cart: newCart });
  };

  const cartTotal = useMemo(() => {
    const pieces = formData.cart.reduce((sum, item) => sum + item.quantity, 0);
    return totalLkrForPieceCount(pieces);
  }, [formData.cart]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cart.length === 0) {
      setError("Please add at least one item to your order.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          address: formData.address,
          items: formData.cart.map((item) => ({
            size: item.size,
            quantity: item.quantity,
          })),
          totalValue: cartTotal,
          size: formData.cart
            .map((item) => `${item.size} (x${item.quantity})`)
            .join(", "),
          status: "pending",
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || errorData.error || "Failed to place order",
          );
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Failed to place order (Server Error)");
        }
      }

      setView("confirmation");
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const bulkUpdateStatus = async (newStatus: OrderStatus) => {
    if (selectedOrderIds.size === 0) return;

    try {
      await Promise.all(
        Array.from(selectedOrderIds).map((id) =>
          fetch(`/api/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }),
        ),
      );
      setSelectedOrderIds(new Set());
      fetchOrders();
    } catch (err) {
      console.error("Bulk update error:", err);
    }
  };

  const bulkDeleteOrders = async () => {
    if (selectedOrderIds.size === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedOrderIds.size} orders?`,
      )
    )
      return;

    try {
      const response = await fetch("/api/orders/batch", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedOrderIds) }),
      });
      if (!response.ok) throw new Error("Failed to delete orders");
      setSelectedOrderIds(new Set());
      fetchOrders();
    } catch (err) {
      console.error("Bulk delete error:", err);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Name",
      "Phone",
      "Address",
      "Size",
      "Value",
      "Status",
      "Date",
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.customerName,
      o.phone,
      o.address,
      o.size,
      getOrderTotal(o),
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const toggleSelectOrder = (id: string) => {
    const newSelected = new Set(selectedOrderIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrderIds(newSelected);
  };

  const logout = () => {
    setIsAdmin(false);
    setView("home");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (showPrintView) {
    return (
      <PrintLabelsView
        orders={orders}
        selectedOrderIds={selectedOrderIds}
        onClose={() => setShowPrintView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
      <Marquee />
      <AppNav
        view={view}
        isAdmin={isAdmin}
        onNavigate={setView}
        onLogout={logout}
      />

      <main
        className={`flex-grow pt-8 pb-12 px-4 ${view === "admin" ? "max-w-[1600px]" : "max-w-6xl"} mx-auto w-full`}
      >
        <AnimatePresence mode="wait">
          {view === "home" && (
            <HomeView onGoToOrder={() => setView("order-form")} />
          )}

          {view === "order-form" && (
            <OrderFormView
              formData={formData}
              setFormData={setFormData}
              cartTotal={cartTotal}
              submitting={submitting}
              error={error}
              onSubmit={handleOrderSubmit}
              onOpenSizeGuide={() => setShowSizeGuide(true)}
              onBackToStore={() => setView("home")}
              addSizeToCart={addSizeToCart}
              updateCartQuantity={updateCartQuantity}
            />
          )}

          {view === "confirmation" && (
            <ConfirmationView
              formData={formData}
              cartTotal={cartTotal}
              onBackHome={() => setView("home")}
            />
          )}

          {(view === "shipping-policy" ||
            view === "returns-exchanges" ||
            view === "contact-us") && (
            <SupportView view={view} onBackHome={() => setView("home")} />
          )}

          {view === "admin" && isAdmin && (
            <AdminDashboard
              orders={orders}
              metrics={metrics}
              chartData={chartData}
              filteredOrders={filteredOrders}
              batchingSummary={batchingSummary}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterSize={filterSize}
              setFilterSize={setFilterSize}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isShippingMode={isShippingMode}
              setIsShippingMode={setIsShippingMode}
              selectedOrderIds={selectedOrderIds}
              setSelectedOrderIds={setSelectedOrderIds}
              toggleSelectAll={toggleSelectAll}
              toggleSelectOrder={toggleSelectOrder}
              exportToCSV={exportToCSV}
              setShowPrintView={setShowPrintView}
              bulkUpdateStatus={bulkUpdateStatus}
              bulkDeleteOrders={bulkDeleteOrders}
              updateOrderStatus={updateOrderStatus}
              viewingOrder={viewingOrder}
              setViewingOrder={setViewingOrder}
              adminTab={adminTab}
              setAdminTab={setAdminTab}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
        )}
      </AnimatePresence>

      <AppFooter
        onNavigate={setView}
        onOpenSizeGuide={() => setShowSizeGuide(true)}
      />
    </div>
  );
}
