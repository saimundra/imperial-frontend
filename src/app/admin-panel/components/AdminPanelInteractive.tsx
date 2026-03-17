'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/hooks/useAuth';
import {
  ApiError,
  deleteAdminNewsletterSubscriber,
  createAdminPromoCode,
  createAdminProduct,
  createAdminUser,
  deleteAdminOrder,
  deleteAdminPromoCode,
  deleteAdminProduct,
  deleteAdminUser,
  fetchAdminOrders,
  fetchAdminOverview,
  fetchAdminNewsletterSubscribers,
  fetchAdminPromoCodes,
  fetchAdminProducts,
  fetchAdminUsers,
  type AdminNewsletterSubscriber,
  type AdminOrder,
  type AdminOverview,
  type AdminPromoCode,
  type AdminProduct,
  type AdminUserRecord,
  updateAdminOrder,
  updateAdminProduct,
  updateAdminUser,
} from '@/lib/api';

type AdminTab = 'overview' | 'products' | 'promos' | 'newsletter' | 'users' | 'orders';

interface ProductFormState {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  discountAvailable: boolean;
  image: string;
  alt: string;
  inStock: boolean;
  stockQuantity: string;
  isAuthentic: boolean;
  rating: string;
  reviewCount: string;
  isNew: boolean;
  description: string;
}

interface UserFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  loyaltyPoints: string;
  isStaff: boolean;
  isActive: boolean;
}

interface PromoCodeFormState {
  code: string;
  discountPercentage: string;
}

interface OrderEditState {
  status: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

const PRODUCT_CATEGORIES = ['makeup', 'skincare', 'perfumes'];
const ORDER_STATUSES = ['processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];

const DEFAULT_PRODUCT_FORM: ProductFormState = {
  id: '',
  name: '',
  brand: '',
  category: 'makeup',
  price: '',
  originalPrice: '',
  discountAvailable: false,
  image: '',
  alt: '',
  inStock: true,
  stockQuantity: '',
  isAuthentic: true,
  rating: '',
  reviewCount: '0',
  isNew: false,
  description: '',
};

const DEFAULT_USER_FORM: UserFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  loyaltyPoints: '0',
  isStaff: false,
  isActive: true,
};

const DEFAULT_PROMO_CODE_FORM: PromoCodeFormState = {
  code: '',
  discountPercentage: '10',
};

const getCurrentRevenueMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
};

const formatRevenueMonthLabel = (monthValue: string) => {
  const [year, month] = monthValue.split('-').map(Number);
  if (!year || !month) {
    return monthValue;
  }

  const currentMonth = getCurrentRevenueMonth();
  const formatted = new Intl.DateTimeFormat('en-NP', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));

  return monthValue === currentMonth ? `This Month (${formatted})` : formatted;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

const normalizeProductForm = (product: AdminProduct): ProductFormState => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: String(product.price),
  originalPrice: product.originalPrice == null ? '' : String(product.originalPrice),
  discountAvailable: product.originalPrice != null,
  image: product.image,
  alt: product.alt,
  inStock: product.inStock,
  stockQuantity: String(product.stockQuantity),
  isAuthentic: product.isAuthentic,
  rating: String(product.rating),
  reviewCount: String(product.reviewCount),
  isNew: product.isNew,
  description: product.description || '',
});

const normalizeOrderEdits = (order: AdminOrder): OrderEditState => ({
  status: order.status,
  carrier: order.carrier,
  trackingNumber: order.trackingNumber,
  estimatedDelivery: order.estimatedDelivery || '',
});

const AdminPanelInteractive = () => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [selectedRevenueMonth, setSelectedRevenueMonth] = useState(getCurrentRevenueMonth());

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [promoCodes, setPromoCodes] = useState<AdminPromoCode[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<AdminNewsletterSubscriber[]>([]);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingPromoCodes, setIsLoadingPromoCodes] = useState(false);
  const [isLoadingNewsletterSubscribers, setIsLoadingNewsletterSubscribers] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [newsletterSearch, setNewsletterSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const [productForm, setProductForm] = useState<ProductFormState>(DEFAULT_PRODUCT_FORM);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [userForm, setUserForm] = useState<UserFormState>(DEFAULT_USER_FORM);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [promoCodeForm, setPromoCodeForm] = useState<PromoCodeFormState>(DEFAULT_PROMO_CODE_FORM);

  const [orderEdits, setOrderEdits] = useState<Record<string, OrderEditState>>({});

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const notifyProductsUpdated = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('productsUpdated'));
    }
  };

  const loadOverview = async (month = selectedRevenueMonth) => {
    setIsLoadingOverview(true);
    try {
      const response = await fetchAdminOverview({ month });
      setOverview(response);
      setSelectedRevenueMonth(response.selectedRevenueMonth);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load overview data.'));
    } finally {
      setIsLoadingOverview(false);
    }
  };

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetchAdminProducts({ search: productSearch || undefined });
      setProducts(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load products.'));
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetchAdminUsers({ search: userSearch || undefined });
      setUsers(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load users.'));
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadPromoCodes = async () => {
    setIsLoadingPromoCodes(true);
    try {
      const response = await fetchAdminPromoCodes();
      setPromoCodes(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load promo codes.'));
    } finally {
      setIsLoadingPromoCodes(false);
    }
  };

  const loadNewsletterSubscribers = async () => {
    setIsLoadingNewsletterSubscribers(true);
    try {
      const response = await fetchAdminNewsletterSubscribers({
        search: newsletterSearch || undefined,
      });
      setNewsletterSubscribers(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load newsletter subscribers.'));
    } finally {
      setIsLoadingNewsletterSubscribers(false);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetchAdminOrders({
        search: orderSearch || undefined,
        status: orderStatusFilter === 'all' ? undefined : orderStatusFilter,
      });
      setOrders(response);
      setOrderEdits(
        response.reduce<Record<string, OrderEditState>>((acc, order) => {
          acc[order.orderNumber] = normalizeOrderEdits(order);
          return acc;
        }, {}),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to load orders.'));
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.isStaff) {
      return;
    }

    if (activeTab === 'overview') {
      void loadOverview(selectedRevenueMonth);
    }

    if (activeTab === 'products') {
      void loadProducts();
    }

    if (activeTab === 'promos') {
      void loadPromoCodes();
    }

    if (activeTab === 'newsletter') {
      void loadNewsletterSubscribers();
    }

    if (activeTab === 'users') {
      void loadUsers();
    }

    if (activeTab === 'orders') {
      void loadOrders();
    }
  }, [activeTab, isAuthenticated, user?.isStaff, selectedRevenueMonth]);

  const handleProductSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    await loadProducts();
  };

  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    await loadUsers();
  };

  const handleNewsletterSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    await loadNewsletterSubscribers();
  };

  const handleOrderSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    await loadOrders();
  };

  const resetProductForm = () => {
    setProductForm(DEFAULT_PRODUCT_FORM);
    setEditingProductId(null);
  };

  const resetUserForm = () => {
    setUserForm(DEFAULT_USER_FORM);
    setEditingUserId(null);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const originalPriceValue = productForm.originalPrice.trim();
    if (productForm.discountAvailable && originalPriceValue === '') {
      setErrorMessage('Please enter original price when discount is available.');
      return;
    }

    const basePayload = {
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      originalPrice: productForm.discountAvailable ? Number(originalPriceValue) : null,
      image: productForm.image.trim(),
      alt: productForm.alt.trim(),
      inStock: productForm.inStock,
      stockQuantity: Number(productForm.stockQuantity),
      isAuthentic: productForm.isAuthentic,
      rating: Number(productForm.rating),
      reviewCount: Number(productForm.reviewCount),
      isNew: productForm.isNew,
      description: productForm.description.trim(),
    };

    const productId = productForm.id.trim();

    try {
      if (editingProductId) {
        await updateAdminProduct(editingProductId, basePayload);
        setSuccessMessage('Product updated successfully.');
      } else {
        const payload = productId ? { id: productId, ...basePayload } : basePayload;
        await createAdminProduct(payload);
        setSuccessMessage('Product created successfully.');
      }

      resetProductForm();
      await Promise.all([loadProducts(), loadOverview()]);
      notifyProductsUpdated();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to save product.'));
    }
  };

  const handleEditProduct = (product: AdminProduct) => {
    clearMessages();
    setEditingProductId(product.id);
    setProductForm(normalizeProductForm(product));
  };

  const handleDeleteProduct = async (productId: string) => {
    clearMessages();
    if (!window.confirm('Delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAdminProduct(productId);
      setSuccessMessage('Product deleted successfully.');
      await Promise.all([loadProducts(), loadOverview()]);
      notifyProductsUpdated();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to delete product.'));
    }
  };

  const handlePromoCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const code = promoCodeForm.code.trim().toUpperCase();
    const discountPercentage = Number(promoCodeForm.discountPercentage);

    if (!code) {
      setErrorMessage('Promo code is required.');
      return;
    }

    if (!Number.isFinite(discountPercentage) || discountPercentage < 1 || discountPercentage > 100) {
      setErrorMessage('Discount percentage must be between 1 and 100.');
      return;
    }

    try {
      await createAdminPromoCode({
        code,
        discountPercentage,
      });
      setPromoCodeForm(DEFAULT_PROMO_CODE_FORM);
      setSuccessMessage('Promo code created successfully.');
      await loadPromoCodes();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to create promo code.'));
    }
  };

  const handleDeletePromoCode = async (promoCodeId: number) => {
    clearMessages();
    if (!window.confirm('Delete this promo code?')) {
      return;
    }

    try {
      await deleteAdminPromoCode(promoCodeId);
      setSuccessMessage('Promo code deleted successfully.');
      await loadPromoCodes();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to delete promo code.'));
    }
  };

  const handleDeleteNewsletterSubscriber = async (subscriberId: number) => {
    clearMessages();
    if (!window.confirm('Delete this newsletter subscriber?')) {
      return;
    }

    try {
      await deleteAdminNewsletterSubscriber(subscriberId);
      setSuccessMessage('Newsletter subscriber deleted successfully.');
      await loadNewsletterSubscribers();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to delete newsletter subscriber.'));
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    try {
      if (editingUserId) {
        await updateAdminUser(editingUserId, {
          fullName: userForm.fullName.trim(),
          email: userForm.email.trim(),
          phone: userForm.phone.trim(),
          password: userForm.password.trim() || undefined,
          loyaltyPoints: Number(userForm.loyaltyPoints),
          isStaff: userForm.isStaff,
          isActive: userForm.isActive,
        });
        setSuccessMessage('User updated successfully.');
      } else {
        await createAdminUser({
          fullName: userForm.fullName.trim(),
          email: userForm.email.trim(),
          phone: userForm.phone.trim(),
          password: userForm.password.trim(),
          loyaltyPoints: Number(userForm.loyaltyPoints),
          isStaff: userForm.isStaff,
          isActive: userForm.isActive,
        });
        setSuccessMessage('User created successfully.');
      }

      resetUserForm();
      await Promise.all([loadUsers(), loadOverview()]);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to save user.'));
    }
  };

  const handleEditUser = (record: AdminUserRecord) => {
    clearMessages();
    setEditingUserId(record.id);
    setUserForm({
      fullName: record.userName,
      email: record.email,
      phone: record.phone || '',
      password: '',
      loyaltyPoints: String(record.loyaltyPoints),
      isStaff: record.isStaff,
      isActive: record.isActive,
    });
  };

  const handleDeleteUser = async (userId: number) => {
    clearMessages();
    if (!window.confirm('Delete this user account? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      setSuccessMessage('User deleted successfully.');
      await Promise.all([loadUsers(), loadOverview()]);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to delete user.'));
    }
  };

  const handleOrderEditChange = (orderNumber: string, field: keyof OrderEditState, value: string) => {
    setOrderEdits((current) => ({
      ...current,
      [orderNumber]: {
        ...current[orderNumber],
        [field]: value,
      },
    }));
  };

  const handleUpdateOrder = async (orderNumber: string) => {
    clearMessages();
    const edit = orderEdits[orderNumber];
    if (!edit) {
      return;
    }

    try {
      await updateAdminOrder(orderNumber, {
        status: edit.status,
        carrier: edit.carrier,
        trackingNumber: edit.trackingNumber,
        estimatedDelivery: edit.estimatedDelivery || null,
      });
      setSuccessMessage(`Order ${orderNumber} updated successfully.`);
      await loadOrders();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to update order.'));
    }
  };

  const handleDeleteOrder = async (orderNumber: string) => {
    clearMessages();
    if (!window.confirm(`Delete order ${orderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteAdminOrder(orderNumber);
      setSuccessMessage(`Order ${orderNumber} deleted successfully.`);
      await Promise.all([loadOrders(), loadOverview()]);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to delete order.'));
    }
  };

  const tabButtonClass = (tab: AdminTab) =>
    `px-4 py-2 rounded-lg font-body font-medium transition-luxury ${
      activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card golden-border hover:golden-border-hover'
    }`;

  const stats = useMemo(
    () => [
      {
        label: 'Products',
        value: overview?.totalProducts ?? 0,
        icon: 'SparklesIcon',
      },
      {
        label: 'Users',
        value: overview?.totalUsers ?? 0,
        icon: 'UsersIcon',
      },
      {
        label: 'Orders',
        value: overview?.totalOrders ?? 0,
        icon: 'ShoppingBagIcon',
      },
      {
        label: 'Pending Orders',
        value: overview?.pendingOrders ?? 0,
        icon: 'ClockIcon',
      },
    ],
    [overview],
  );

  const revenueMonthOptions = useMemo(() => {
    const options = overview?.revenueMonths ?? [];
    if (options.includes(selectedRevenueMonth)) {
      return options;
    }
    return [selectedRevenueMonth, ...options];
  }, [overview?.revenueMonths, selectedRevenueMonth]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto rounded-lg bg-card golden-border p-8 text-center space-y-4">
        <h1 className="font-heading text-3xl font-semibold text-foreground">Admin Access Required</h1>
        <p className="font-body text-muted-foreground">Please sign in with an admin account to continue.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium transition-luxury hover:scale-105"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (!user?.isStaff) {
    return (
      <div className="max-w-2xl mx-auto rounded-lg bg-card golden-border p-8 text-center space-y-4">
        <h1 className="font-heading text-3xl font-semibold text-foreground">Unauthorized</h1>
        <p className="font-body text-muted-foreground">Your account does not have admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">Admin Panel</h1>
          <Link
            href="/home-landing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
        </div>
        <p className="font-body text-muted-foreground">
          Manage products, users, newsletter subscribers, and orders for Imperial Glow Nepal.
        </p>
      </section>

      {errorMessage && (
        <div className="p-3 rounded-lg border border-error/30 bg-error/10 text-error text-sm font-body">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-lg border border-success/30 bg-success/10 text-success text-sm font-body">
          {successMessage}
        </div>
      )}

      <section className="flex flex-wrap gap-3">
        <button onClick={() => setActiveTab('overview')} className={tabButtonClass('overview')}>Overview</button>
        <button onClick={() => setActiveTab('products')} className={tabButtonClass('products')}>Products</button>
        <button onClick={() => setActiveTab('promos')} className={tabButtonClass('promos')}>Promo Codes</button>
        <button onClick={() => setActiveTab('newsletter')} className={tabButtonClass('newsletter')}>Newsletter</button>
        <button onClick={() => setActiveTab('users')} className={tabButtonClass('users')}>Users</button>
        <button onClick={() => setActiveTab('orders')} className={tabButtonClass('orders')}>Orders</button>
      </section>

      {activeTab === 'overview' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold text-foreground">System Overview</h2>
            <button
              onClick={() => {
                clearMessages();
                void loadOverview(selectedRevenueMonth);
              }}
              className="px-4 py-2 bg-card golden-border rounded-lg font-body text-sm transition-luxury hover:golden-border-hover"
            >
              Refresh
            </button>
          </div>

          {isLoadingOverview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-32 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-card golden-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-caption text-sm text-muted-foreground">{stat.label}</p>
                    <Icon name={stat.icon} size={20} className="text-primary" />
                  </div>
                  <p className="font-heading text-3xl font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-lg bg-card golden-border p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-caption text-sm text-muted-foreground">Total Revenue</p>
                <p className="font-caption text-xs text-muted-foreground mt-1">
                  {formatRevenueMonthLabel(selectedRevenueMonth)}
                </p>
              </div>
              <select
                value={selectedRevenueMonth}
                onChange={(e) => {
                  clearMessages();
                  setSelectedRevenueMonth(e.target.value);
                }}
                className="px-4 py-2 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus font-body text-sm"
              >
                {revenueMonthOptions.map((month) => (
                  <option key={month} value={month}>
                    {formatRevenueMonthLabel(month)}
                  </option>
                ))}
              </select>
            </div>
            <p className="font-heading text-3xl font-semibold text-primary mt-4">
              NPR {Number(overview?.totalRevenue || 0).toLocaleString('en-NP')}
            </p>
          </div>
        </section>
      )}

      {activeTab === 'products' && (
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Product CRUD</h2>

          <form onSubmit={handleProductSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products by ID, name or brand"
              className="flex-1 px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-card golden-border rounded-lg font-body font-medium transition-luxury hover:golden-border-hover"
            >
              Search
            </button>
          </form>

          <form onSubmit={handleProductSubmit} className="rounded-lg bg-card golden-border p-5 space-y-4">
            <h3 className="font-body text-lg font-semibold text-foreground">
              {editingProductId ? `Edit Product (${editingProductId})` : 'Create New Product'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm((current) => ({ ...current, name: e.target.value }))}
                placeholder="Product name"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm((current) => ({ ...current, brand: e.target.value }))}
                placeholder="Brand"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <select
                value={productForm.category}
                onChange={(e) => setProductForm((current) => ({ ...current, category: e.target.value }))}
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm((current) => ({ ...current, price: e.target.value }))}
                placeholder="Price"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm((current) => ({ ...current, originalPrice: e.target.value }))}
                placeholder="Original price (required for discount)"
                disabled={!productForm.discountAvailable}
                required={productForm.discountAvailable}
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus disabled:opacity-50"
              />
              <input
                type="url"
                value={productForm.image}
                onChange={(e) => setProductForm((current) => ({ ...current, image: e.target.value }))}
                placeholder="Image URL"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="text"
                value={productForm.alt}
                onChange={(e) => setProductForm((current) => ({ ...current, alt: e.target.value }))}
                placeholder="Image alt text"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="number"
                min="0"
                value={productForm.stockQuantity}
                onChange={(e) => setProductForm((current) => ({ ...current, stockQuantity: e.target.value }))}
                placeholder="Stock quantity (available units)"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={productForm.rating}
                onChange={(e) => setProductForm((current) => ({ ...current, rating: e.target.value }))}
                placeholder="Customer rating (0 to 5)"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <label className="flex items-center gap-2 font-body text-sm px-4 py-3 bg-input rounded-lg golden-border">
                <input
                  type="checkbox"
                  checked={productForm.discountAvailable}
                  onChange={(e) =>
                    setProductForm((current) => ({
                      ...current,
                      discountAvailable: e.target.checked,
                      originalPrice: e.target.checked ? current.originalPrice : '',
                    }))
                  }
                />
                Discount available (uses original price)
              </label>
              <p className="md:col-span-2 text-xs font-body text-muted-foreground">
                Two required fields here: Stock quantity (available units) and Customer rating (0 to 5). For discounts, enable discount available and set original price.
              </p>

              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm((current) => ({ ...current, inStock: e.target.checked }))}
                />
                In stock
              </label>
              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={productForm.isAuthentic}
                  onChange={(e) => setProductForm((current) => ({ ...current, isAuthentic: e.target.checked }))}
                />
                Authentic product
              </label>
              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={productForm.isNew}
                  onChange={(e) => setProductForm((current) => ({ ...current, isNew: e.target.checked }))}
                />
                Mark as new
              </label>
            </div>

            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm((current) => ({ ...current, description: e.target.value }))}
              placeholder="Product description"
              rows={4}
              className="w-full px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105"
              >
                {editingProductId ? 'Update Product' : 'Create Product'}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="px-5 py-3 bg-card golden-border rounded-lg font-body font-medium transition-luxury hover:golden-border-hover"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="rounded-lg bg-card golden-border overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-caption text-sm">ID</th>
                  <th className="p-3 text-left font-caption text-sm">Name</th>
                  <th className="p-3 text-left font-caption text-sm">Category</th>
                  <th className="p-3 text-left font-caption text-sm">Price</th>
                  <th className="p-3 text-left font-caption text-sm">Stock</th>
                  <th className="p-3 text-left font-caption text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingProducts ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center font-body text-muted-foreground">Loading products...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center font-body text-muted-foreground">No products found.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t golden-border">
                      <td className="p-3 font-data text-sm">{product.id}</td>
                      <td className="p-3 font-body text-sm">{product.name}</td>
                      <td className="p-3 font-body text-sm capitalize">{product.category}</td>
                      <td className="p-3 font-data text-sm">NPR {Number(product.price).toLocaleString('en-NP')}</td>
                      <td className="p-3 font-data text-sm">{product.stockQuantity}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="px-3 py-1 rounded bg-card golden-border text-sm transition-luxury hover:golden-border-hover"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-1 rounded border border-error/40 text-error text-sm transition-luxury hover:bg-error/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">User CRUD</h2>

          <form onSubmit={handleUserSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users by name or email"
              className="flex-1 px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-card golden-border rounded-lg font-body font-medium transition-luxury hover:golden-border-hover"
            >
              Search
            </button>
          </form>

          <form onSubmit={handleUserSubmit} className="rounded-lg bg-card golden-border p-5 space-y-4">
            <h3 className="font-body text-lg font-semibold text-foreground">
              {editingUserId ? `Edit User #${editingUserId}` : 'Create New User'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={userForm.fullName}
                onChange={(e) => setUserForm((current) => ({ ...current, fullName: e.target.value }))}
                placeholder="Full name"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm((current) => ({ ...current, email: e.target.value }))}
                placeholder="Email"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="tel"
                value={userForm.phone}
                onChange={(e) => setUserForm((current) => ({ ...current, phone: e.target.value }))}
                placeholder="Phone"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
              />
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm((current) => ({ ...current, password: e.target.value }))}
                placeholder={editingUserId ? 'New password (optional)' : 'Password'}
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required={!editingUserId}
              />
              <input
                type="number"
                min="0"
                value={userForm.loyaltyPoints}
                onChange={(e) => setUserForm((current) => ({ ...current, loyaltyPoints: e.target.value }))}
                placeholder="Loyalty points"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
              />

              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={userForm.isStaff}
                  onChange={(e) => setUserForm((current) => ({ ...current, isStaff: e.target.checked }))}
                />
                Admin (staff)
              </label>
              <label className="flex items-center gap-2 font-body text-sm">
                <input
                  type="checkbox"
                  checked={userForm.isActive}
                  onChange={(e) => setUserForm((current) => ({ ...current, isActive: e.target.checked }))}
                />
                Active account
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105"
              >
                {editingUserId ? 'Update User' : 'Create User'}
              </button>
              {editingUserId && (
                <button
                  type="button"
                  onClick={resetUserForm}
                  className="px-5 py-3 bg-card golden-border rounded-lg font-body font-medium transition-luxury hover:golden-border-hover"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="rounded-lg bg-card golden-border overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-caption text-sm">ID</th>
                  <th className="p-3 text-left font-caption text-sm">Name</th>
                  <th className="p-3 text-left font-caption text-sm">Email</th>
                  <th className="p-3 text-left font-caption text-sm">Role</th>
                  <th className="p-3 text-left font-caption text-sm">Points</th>
                  <th className="p-3 text-left font-caption text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center font-body text-muted-foreground">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center font-body text-muted-foreground">No users found.</td>
                  </tr>
                ) : (
                  users.map((record) => (
                    <tr key={record.id} className="border-t golden-border">
                      <td className="p-3 font-data text-sm">{record.id}</td>
                      <td className="p-3 font-body text-sm">{record.userName}</td>
                      <td className="p-3 font-body text-sm">{record.email}</td>
                      <td className="p-3 font-caption text-sm">{record.isStaff ? 'Admin' : 'Customer'}</td>
                      <td className="p-3 font-data text-sm">{record.loyaltyPoints}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(record)}
                            className="px-3 py-1 rounded bg-card golden-border text-sm transition-luxury hover:golden-border-hover"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(record.id)}
                            className="px-3 py-1 rounded border border-error/40 text-error text-sm transition-luxury hover:bg-error/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'promos' && (
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Promo Codes</h2>

          <form onSubmit={handlePromoCodeSubmit} className="rounded-lg bg-card golden-border p-5 space-y-4">
            <h3 className="font-body text-lg font-semibold text-foreground">Create Promo Code</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={promoCodeForm.code}
                onChange={(e) => setPromoCodeForm((current) => ({ ...current, code: e.target.value.toUpperCase() }))}
                placeholder="Promo code (e.g., NEWYEAR25)"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
              <input
                type="number"
                min="1"
                max="100"
                value={promoCodeForm.discountPercentage}
                onChange={(e) => setPromoCodeForm((current) => ({ ...current, discountPercentage: e.target.value }))}
                placeholder="Discount percentage (1-100)"
                className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105"
              >
                Add Promo Code
              </button>
            </div>
          </form>

          <div className="rounded-lg bg-card golden-border overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-caption text-sm">Code</th>
                  <th className="p-3 text-left font-caption text-sm">Discount</th>
                  <th className="p-3 text-left font-caption text-sm">Created</th>
                  <th className="p-3 text-left font-caption text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingPromoCodes ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center font-body text-muted-foreground">Loading promo codes...</td>
                  </tr>
                ) : promoCodes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center font-body text-muted-foreground">No promo codes found.</td>
                  </tr>
                ) : (
                  promoCodes.map((promoCode) => (
                    <tr key={promoCode.id} className="border-t golden-border">
                      <td className="p-3 font-data text-sm">{promoCode.code}</td>
                      <td className="p-3 font-data text-sm">{promoCode.discountPercentage}%</td>
                      <td className="p-3 font-body text-sm">
                        {promoCode.createdAt ? new Date(promoCode.createdAt).toLocaleDateString('en-NP') : '-'}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeletePromoCode(promoCode.id)}
                          className="px-3 py-1 rounded border border-error/40 text-error text-sm transition-luxury hover:bg-error/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'newsletter' && (
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Newsletter Subscribers</h2>

          <form onSubmit={handleNewsletterSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newsletterSearch}
              onChange={(e) => setNewsletterSearch(e.target.value)}
              placeholder="Search subscriber email"
              className="flex-1 px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-card golden-border rounded-lg font-body font-medium transition-luxury hover:golden-border-hover"
            >
              Search
            </button>
          </form>

          <div className="rounded-lg bg-card golden-border overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-caption text-sm">Email</th>
                  <th className="p-3 text-left font-caption text-sm">Subscribed</th>
                  <th className="p-3 text-left font-caption text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingNewsletterSubscribers ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center font-body text-muted-foreground">Loading subscribers...</td>
                  </tr>
                ) : newsletterSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center font-body text-muted-foreground">No newsletter subscribers found.</td>
                  </tr>
                ) : (
                  newsletterSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-t golden-border">
                      <td className="p-3 font-body text-sm">{subscriber.email}</td>
                      <td className="p-3 font-body text-sm">
                        {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleString('en-NP') : '-'}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteNewsletterSubscriber(subscriber.id)}
                          className="px-3 py-1 rounded border border-error/40 text-error text-sm transition-luxury hover:bg-error/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Order Management</h2>

          <form onSubmit={handleOrderSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search order number or customer"
              className="md:col-span-2 px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
            />
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-3 bg-card golden-border rounded-lg font-body font-medium transition-luxury hover:golden-border-hover"
            >
              Search
            </button>
          </form>

          <p className="font-caption text-sm text-muted-foreground">
            Orders are created from checkout. Admin panel supports reading, updating status/details, and deleting orders.
          </p>

          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="rounded-lg bg-card golden-border p-4 font-body text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="rounded-lg bg-card golden-border p-4 font-body text-muted-foreground">No orders found.</div>
            ) : (
              orders.map((order) => {
                const edit = orderEdits[order.orderNumber] || normalizeOrderEdits(order);
                return (
                  <div key={order.orderNumber} className="rounded-lg bg-card golden-border p-5 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div>
                        <h3 className="font-body text-lg font-semibold text-foreground">{order.orderNumber}</h3>
                        <p className="font-caption text-sm text-muted-foreground">
                          {order.customerName} • {order.customerEmail} • NPR {Number(order.total).toLocaleString('en-NP')}
                        </p>
                      </div>
                      <button
                        onClick={() => void handleDeleteOrder(order.orderNumber)}
                        className="px-3 py-2 rounded border border-error/40 text-error text-sm transition-luxury hover:bg-error/10"
                      >
                        Delete Order
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <select
                        value={edit.status}
                        onChange={(e) => handleOrderEditChange(order.orderNumber, 'status', e.target.value)}
                        className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={edit.carrier}
                        onChange={(e) => handleOrderEditChange(order.orderNumber, 'carrier', e.target.value)}
                        placeholder="Carrier"
                        className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                      />

                      <input
                        type="text"
                        value={edit.trackingNumber}
                        onChange={(e) => handleOrderEditChange(order.orderNumber, 'trackingNumber', e.target.value)}
                        placeholder="Tracking number"
                        className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                      />

                      <input
                        type="date"
                        value={edit.estimatedDelivery || ''}
                        onChange={(e) => handleOrderEditChange(order.orderNumber, 'estimatedDelivery', e.target.value)}
                        className="px-4 py-3 bg-input rounded-lg golden-border focus:outline-none focus:golden-border-focus"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => void handleUpdateOrder(order.orderNumber)}
                        className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105"
                      >
                        Update Order
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanelInteractive;
