import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  IndianRupee,
  Users,
  RefreshCw,
  LogOut,
  Search,
  Eye,
  X,
  Package,
  Mail,
  Phone,
  CreditCard,
  CalendarDays,
  Menu,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  // ==============================
  // LOAD DASHBOARD
  // ==============================
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/orders/admin-dashboard/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        setLoggedIn(false);
        setData(null);
        setError("");
        return;
      }

      if (!response.ok || !result.success) {
        setLoggedIn(false);
        setError(result.message || "Unable to load dashboard.");
        return;
      }

      setData(result);
      setLoggedIn(true);
      setUsername(result.username || username);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setLoggedIn(false);
      setError("Unable to connect to Django server.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INITIAL CHECK
  // ==============================
  useEffect(() => {
    loadDashboard();
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/admin-login/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: loginUsername,
            password: loginPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setLoginError(result.message || "Invalid username or password.");
        return;
      }

      setUsername(result.username || loginUsername);
      setLoginPassword("");

      await loadDashboard();
    } catch (err) {
      console.error("Login Error:", err);
      setLoginError("Unable to connect to Django server.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/admin-logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (err) {
      console.error("Logout Error:", err);
    }

    setLoggedIn(false);
    setData(null);
    setUsername("");
    setLoginUsername("");
    setLoginPassword("");
    setSelectedOrder(null);
  };

  // ==============================
  // FILTER ORDERS
  // ==============================
  const filteredOrders = useMemo(() => {
    const orders = data?.orders || [];

    return orders.filter((order) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(order.order_reference || "")
          .toLowerCase()
          .includes(search) ||
        String(order.customer_name || "")
          .toLowerCase()
          .includes(search) ||
        String(order.customer_email || "")
          .toLowerCase()
          .includes(search) ||
        String(order.customer_mobile || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        String(order.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  // ==============================
  // LOADING
  // ==============================
  if (loading && !loggedIn && !loginError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // LOGIN PAGE
  // ==============================
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl -top-20 -left-20" />
          <div className="absolute w-72 h-72 bg-orange-500/10 rounded-full blur-3xl bottom-0 right-0" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 flex items-center justify-center shadow-lg mb-5">
                <ShieldCheck size={32} className="text-orange-400" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Density Electronics
              </h1>

              <p className="text-slate-500 mt-2">
                Secure Admin Dashboard
              </p>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-blue-700 text-white font-bold transition shadow-lg disabled:bg-slate-400"
              >
                {loginLoading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="mt-7 text-center text-xs text-slate-400">
              Density Electronics • Admin Access
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // DASHBOARD
  // ==============================
  const totalOrders = data?.summary?.total_orders ?? 0;
  const paidOrders = data?.summary?.paid_orders ?? 0;
  const totalSales = Number(data?.summary?.total_sales ?? 0);

  const customers = new Set(
    (data?.orders || [])
      .map((order) => order.customer_email)
      .filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* ==============================
          TOP HEADER
      ============================== */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center">
              <LayoutDashboard size={23} className="text-slate-950" />
            </div>

            <div>
              <h1 className="font-black text-lg sm:text-xl">
                Density Electronics
              </h1>

              <p className="text-xs text-slate-400">
                Admin Control Panel
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{username}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-red-600 hover:border-red-600 transition font-bold text-sm"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="sm:hidden p-2 rounded-lg hover:bg-slate-800"
          >
            <Menu size={24} />
          </button>
        </div>

        {mobileMenu && (
          <div className="sm:hidden border-t border-slate-800 px-4 py-4">
            <div className="mb-3">
              <p className="font-bold">{username}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 font-bold"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* ==============================
          MAIN
      ============================== */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PAGE TITLE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          <div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Overview
            </p>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
              Dashboard
            </h2>

            <p className="text-slate-500 mt-1">
              Monitor your Density Electronics orders and sales.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition font-bold text-sm"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <a
              href="http://localhost:5173/"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition font-bold text-sm"
            >
              <ExternalLink size={17} />
              Store
            </a>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* ==============================
            SUMMARY CARDS
        ============================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingBag size={24} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Paid Orders"
            value={paidOrders}
            icon={<CreditCard size={24} />}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Total Sales"
            value={`₹${totalSales.toFixed(2)}`}
            icon={<IndianRupee size={24} />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />

          <StatCard
            title="Customers"
            value={customers}
            icon={<Users size={24} />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* ==============================
            QUICK INFO
        ============================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-950 to-blue-950 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-300 text-sm font-bold">
                  Total Revenue
                </p>

                <h3 className="text-3xl sm:text-4xl font-black mt-2">
                  ₹{totalSales.toFixed(2)}
                </h3>

                <p className="text-slate-400 text-sm mt-3">
                  Revenue generated from recorded orders.
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center">
                <IndianRupee size={28} className="text-slate-950" />
              </div>
            </div>

            <div className="mt-7 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width:
                    totalOrders > 0
                      ? `${Math.min(
                          (paidOrders / totalOrders) * 100,
                          100
                        )}%`
                      : "0%",
                }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Payment completion</span>
              <span>
                {totalOrders > 0
                  ? Math.round((paidOrders / totalOrders) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Order Status
                </p>

                <h3 className="text-xl font-black mt-1">
                  Payment Overview
                </h3>
              </div>

              <Package className="text-blue-600" />
            </div>

            <div className="space-y-4">
              <ProgressRow
                label="Paid"
                value={paidOrders}
                total={totalOrders}
              />

              <ProgressRow
                label="Other"
                value={Math.max(totalOrders - paidOrders, 0)}
                total={totalOrders}
              />
            </div>
          </div>
        </div>

        {/* ==============================
            ORDERS SECTION
        ============================== */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-blue-600" />

                  <h2 className="text-xl font-black">
                    Recent Orders
                  </h2>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  View and manage customer orders.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full sm:w-32 px-4 pr-9 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-semibold bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h3 className="font-black text-lg">
                No orders found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={`${order.order_reference}-${index}`}
                      className="border-t border-slate-100 hover:bg-blue-50/40 transition"
                    >
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-900">
                          {order.order_reference || "-"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {order.items?.length || 0} item(s)
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">
                          {order.customer_name || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">
                          {order.customer_email || "-"}
                        </p>

                        {order.customer_mobile && (
                          <p className="text-xs text-slate-400 mt-1">
                            {order.customer_mobile}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-black text-slate-900">
                          ₹
                          {Number(
                            order.total_amount || 0
                          ).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">
                          {order.created_at || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold transition"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
            Showing{" "}
            <strong className="text-slate-800">
              {filteredOrders.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-800">
              {data?.orders?.length || 0}
            </strong>{" "}
            orders
          </div>
        </section>
      </main>

      {/* ==============================
          ORDER MODAL
      ============================== */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 sm:px-7 py-5 flex items-center justify-between z-10">
              <div>
                <p className="text-xs uppercase tracking-wider font-black text-blue-600">
                  Order Details
                </p>

                <h2 className="text-xl sm:text-2xl font-black mt-1">
                  {selectedOrder.order_reference}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {/* CUSTOMER INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
                <DetailCard
                  icon={<Users size={18} />}
                  label="Customer"
                  value={selectedOrder.customer_name || "-"}
                />

                <DetailCard
                  icon={<Mail size={18} />}
                  label="Email"
                  value={selectedOrder.customer_email || "-"}
                />

                <DetailCard
                  icon={<Phone size={18} />}
                  label="Mobile"
                  value={selectedOrder.customer_mobile || "-"}
                />

                <DetailCard
                  icon={<IndianRupee size={18} />}
                  label="Total Amount"
                  value={`₹${Number(
                    selectedOrder.total_amount || 0
                  ).toFixed(2)}`}
                />

                <DetailCard
                  icon={<CreditCard size={18} />}
                  label="Payment Status"
                  value={selectedOrder.status || "-"}
                />

                <DetailCard
                  icon={<CalendarDays size={18} />}
                  label="Created At"
                  value={selectedOrder.created_at || "-"}
                />
              </div>

              {/* RAZORPAY */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-7">
                <h3 className="font-black text-lg mb-4">
                  Payment Information
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <InfoLine
                    label="Razorpay Order ID"
                    value={
                      selectedOrder.razorpay_order_id || "-"
                    }
                  />

                  <InfoLine
                    label="Razorpay Payment ID"
                    value={
                      selectedOrder.razorpay_payment_id || "-"
                    }
                  />
                </div>
              </div>

              {/* ITEMS */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package
                    size={20}
                    className="text-blue-600"
                  />

                  <h3 className="font-black text-lg">
                    Ordered Items
                  </h3>
                </div>

                {selectedOrder.items &&
                selectedOrder.items.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full min-w-[550px]">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                            Product
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                            Qty
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                            Price
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedOrder.items.map(
                          (item, index) => {
                            const quantity = Number(
                              item.quantity || 0
                            );

                            const price = Number(
                              item.price || 0
                            );

                            const itemTotal =
                              item.item_total !== undefined
                                ? Number(item.item_total)
                                : quantity * price;

                            return (
                              <tr
                                key={index}
                                className="border-t border-slate-100"
                              >
                                <td className="px-4 py-4 font-bold">
                                  {item.product_name || "-"}
                                </td>

                                <td className="px-4 py-4">
                                  {quantity}
                                </td>

                                <td className="px-4 py-4">
                                  ₹{price.toFixed(2)}
                                </td>

                                <td className="px-4 py-4 font-black">
                                  ₹{itemTotal.toFixed(2)}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-50 text-slate-500 text-sm">
                    No item details available for this order.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 sm:px-7 py-4 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// STAT CARD
// ==============================
function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {value}
          </h3>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// ==============================
// PROGRESS ROW
// ==============================
function ProgressRow({ label, value, total }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-bold text-slate-700">
          {label}
        </span>

        <span className="font-bold text-slate-500">
          {value}
        </span>
      </div>

      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ==============================
// STATUS BADGE
// ==============================
function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let classes =
    "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "paid") {
    classes =
      "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "pending") {
    classes =
      "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "failed") {
    classes =
      "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-black ${classes}`}
    >
      {status || "Unknown"}
    </span>
  );
}

// ==============================
// DETAIL CARD
// ==============================
function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        {icon}

        <span className="text-xs font-black uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>

      <p className="font-bold text-slate-900 break-words">
        {value}
      </p>
    </div>
  );
}

// ==============================
// INFO LINE
// ==============================
function InfoLine({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-900 break-all">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;