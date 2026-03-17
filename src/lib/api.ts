const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  DEFAULT_API_BASE_URL;

const AUTH_TOKEN_STORAGE_KEY = 'authToken';
const CART_TOKEN_STORAGE_KEY = 'cartToken';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  authToken?: string | null;
  cartToken?: string | null;
  includeCartToken?: boolean;
}

class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getFallbackApiBaseUrl(): string | null {
  if (API_BASE_URL.includes('127.0.0.1')) {
    return API_BASE_URL.replace('127.0.0.1', 'localhost');
  }

  if (API_BASE_URL.includes('localhost')) {
    return API_BASE_URL.replace('localhost', '127.0.0.1');
  }

  return null;
}

export interface ApiUser {
  id: string;
  userName: string;
  email: string;
  phone?: string;
  memberSince: string;
  loyaltyPoints: number;
  isStaff: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  alt: string;
  category: string;
  inStock: boolean;
  stock_quantity: number;
  isAuthentic: boolean;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  discount: number;
  description?: string;
}

export interface ApiCartItem {
  cartItemId: number;
  id: string;
  name: string;
  brand: string;
  category: string;
  variant: string;
  price: number;
  originalPrice?: number | null;
  quantity: number;
  image: string;
  alt: string;
  inStock: boolean;
  stockCount: number;
  isAuthentic: boolean;
  rating: number;
  reviewCount: number;
}

export interface ApiCart {
  cartToken: string;
  itemCount: number;
  items: ApiCartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface CheckoutPayload {
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    deliveryNotes: string;
  };
  paymentInfo: {
    paymentMethod: string;
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
    esewaId?: string;
    khaltiNumber?: string;
  };
}

export interface AdminOverview {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  selectedRevenueMonth: string;
  revenueMonths: string[];
}

export interface AdminProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  originalPrice?: string | number | null;
  image: string;
  alt: string;
  inStock: boolean;
  stockQuantity: number;
  isAuthentic: boolean;
  rating: string | number;
  reviewCount: number;
  isNew: boolean;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AdminProductCreatePayload = Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

export interface AdminPromoCode {
  id: number;
  code: string;
  discountPercentage: number;
  createdAt?: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  createdAt?: string;
}

export interface AdminNewsletterSubscriber {
  id: number;
  email: string;
  createdAt?: string;
}

export interface PromoCodeValidationResponse {
  code: string;
  discountPercentage: number;
}

export interface AdminUserRecord {
  id: number;
  userName: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  isStaff: boolean;
  isActive: boolean;
  memberSince: string;
}

export interface AdminOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  district: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
}

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
}

function writeStorage(key: string, value: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (value === null) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, value);
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    authToken,
    cartToken,
    includeCartToken = false,
  } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const resolvedAuthToken = authToken ?? getStoredAuthToken();
  if (resolvedAuthToken) {
    headers.Authorization = `Token ${resolvedAuthToken}`;
  }

  const shouldIncludeCartToken = includeCartToken || typeof cartToken === 'string';
  if (shouldIncludeCartToken) {
    const resolvedCartToken = cartToken ?? getStoredCartToken();
    if (resolvedCartToken) {
      headers['X-Cart-Token'] = resolvedCartToken;
    }
  }

  const primaryUrl = `${API_BASE_URL}${endpoint}`;
  const fallbackBaseUrl = getFallbackApiBaseUrl();

  let response: Response;

  try {
    response = await fetch(primaryUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (fallbackBaseUrl) {
      try {
        response = await fetch(`${fallbackBaseUrl}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch {
        const protocolHint =
          typeof window !== 'undefined' && window.location.protocol === 'https:' && API_BASE_URL.startsWith('http://')
            ? 'Open the frontend with http://localhost (not https) or use an https backend URL.'
            : 'Make sure backend is running on port 8000 and CORS allows your frontend origin.';

        throw new ApiError(
          `Unable to reach API at ${API_BASE_URL}. Also failed fallback host ${fallbackBaseUrl}. ${protocolHint}`,
          0,
          error,
        );
      }
    } else {
    const protocolHint =
      typeof window !== 'undefined' && window.location.protocol === 'https:' && API_BASE_URL.startsWith('http://')
        ? 'Open the frontend with http://localhost (not https) or use an https backend URL.'
        : 'Make sure backend is running on port 8000 and CORS allows your frontend origin.';

    throw new ApiError(
      `Unable to reach API at ${API_BASE_URL}. ${protocolHint}`,
      0,
      error,
    );
    }
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const detail =
      typeof payload?.detail === 'string'
        ? payload.detail
        : typeof payload?.message === 'string'
        ? payload.message
        : 'Request failed';
    throw new ApiError(detail, response.status, payload);
  }

  return payload as T;
}

export function getStoredAuthToken(): string | null {
  return readStorage(AUTH_TOKEN_STORAGE_KEY);
}

export function setStoredAuthToken(token: string | null): void {
  writeStorage(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearStoredAuth(): void {
  writeStorage(AUTH_TOKEN_STORAGE_KEY, null);
}

export function getStoredCartToken(): string | null {
  return readStorage(CART_TOKEN_STORAGE_KEY);
}

export function setStoredCartToken(token: string | null): void {
  writeStorage(CART_TOKEN_STORAGE_KEY, token);
}

export async function ensureCartToken(): Promise<string> {
  const existingToken = getStoredCartToken();
  if (existingToken) {
    return existingToken;
  }

  const response = await request<{ cartToken: string }>('/cart/session/', {
    method: 'POST',
    includeCartToken: false,
  });
  setStoredCartToken(response.cartToken);
  return response.cartToken;
}

export async function registerUser(payload: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ token: string; user: ApiUser }> {
  const response = await request<{ token: string; user: ApiUser }>('/auth/register/', {
    method: 'POST',
    body: payload,
  });
  setStoredAuthToken(response.token);
  return response;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: ApiUser }> {
  const response = await request<{ token: string; user: ApiUser }>('/auth/login/', {
    method: 'POST',
    body: payload,
  });
  setStoredAuthToken(response.token);
  return response;
}

export async function loginWithGoogleIdToken(idToken: string): Promise<{ token: string; user: ApiUser }> {
  const response = await request<{ token: string; user: ApiUser }>('/auth/google/', {
    method: 'POST',
    body: { idToken },
  });
  setStoredAuthToken(response.token);
  return response;
}

export async function fetchCurrentUser(): Promise<ApiUser> {
  const response = await request<{ user: ApiUser }>('/auth/me/');
  return response.user;
}

export async function logoutUser(): Promise<void> {
  try {
    await request('/auth/logout/', { method: 'POST' });
  } catch {
    // Swallow logout API errors; local auth is still cleared below.
  } finally {
    clearStoredAuth();
  }
}

export async function fetchProducts(params: {
  category?: string;
  brand?: string;
  availability?: string;
  search?: string;
  ordering?: string;
} = {}): Promise<ApiProduct[]> {
  const query = new URLSearchParams();

  if (params.category) query.set('category', params.category);
  if (params.brand) query.set('brand', params.brand);
  if (params.availability) query.set('availability', params.availability);
  if (params.search) query.set('search', params.search);
  if (params.ordering) query.set('ordering', params.ordering);

  const endpoint = query.toString() ? `/catalog/products/?${query.toString()}` : '/catalog/products/';
  return request<ApiProduct[]>(endpoint);
}

export async function fetchProductById(id: string): Promise<ApiProduct> {
  return request<ApiProduct>(`/catalog/products/${id}/`);
}

export async function fetchCart(): Promise<ApiCart> {
  const cartToken = await ensureCartToken();
  const cart = await request<ApiCart>('/cart/', { cartToken });
  if (cart.cartToken && cart.cartToken !== cartToken) {
    setStoredCartToken(cart.cartToken);
  }
  return cart;
}

export async function fetchCartSummary(): Promise<{ cartToken: string; itemCount: number }> {
  const cartToken = await ensureCartToken();
  const summary = await request<{ cartToken: string; itemCount: number }>('/cart/summary/', { cartToken });
  if (summary.cartToken && summary.cartToken !== cartToken) {
    setStoredCartToken(summary.cartToken);
  }
  return summary;
}

export async function addItemToCart(productId: string, quantity = 1): Promise<ApiCart> {
  const cartToken = await ensureCartToken();
  return request<ApiCart>('/cart/items/', {
    method: 'POST',
    cartToken,
    body: {
      productId,
      quantity,
    },
  });
}

export async function updateCartItemQuantity(itemId: number, quantity: number): Promise<ApiCart> {
  const cartToken = await ensureCartToken();
  return request<ApiCart>(`/cart/items/${itemId}/`, {
    method: 'PATCH',
    cartToken,
    body: { quantity },
  });
}

export async function removeCartItem(itemId: number): Promise<ApiCart> {
  const cartToken = await ensureCartToken();
  return request<ApiCart>(`/cart/items/${itemId}/`, {
    method: 'DELETE',
    cartToken,
  });
}

export async function clearCart(): Promise<ApiCart> {
  const cartToken = await ensureCartToken();
  return request<ApiCart>('/cart/clear/', {
    method: 'DELETE',
    cartToken,
  });
}

export async function checkoutOrder(payload: CheckoutPayload): Promise<{
  orderId: string;
  trackingNumber: string;
  status: string;
  total: number;
}> {
  const cartToken = await ensureCartToken();
  return request('/orders/checkout/', {
    method: 'POST',
    cartToken,
    body: payload,
  });
}

export async function trackOrder(orderNumber: string) {
  const query = new URLSearchParams({ order_number: orderNumber });
  return request(`/orders/track/?${query.toString()}`);
}

export async function fetchRecentOrders(limit = 3): Promise<Array<{ id: string; date: string; status: string }>> {
  const query = new URLSearchParams({ limit: String(limit) });
  const response = await request<{ orders: Array<{ id: string; date: string; status: string }> }>(
    `/orders/recent/?${query.toString()}`,
  );
  return response.orders;
}

export async function fetchDashboardData() {
  return request<{
    orderHistory: Array<{
      orderId: string;
      date: string;
      items: string;
      status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
      total: number;
    }>;
    wishlistItems: Array<{ id: string; name: string; price: number; image: string; alt: string; inStock: boolean }>;
    activeOrders: Array<{
      orderId: string;
      estimatedDelivery: string;
      trackingSteps: Array<{ label: string; date: string; completed: boolean; active: boolean }>;
    }>;
    preferences: Array<{ id: string; label: string; description: string; enabled: boolean }>;
    activities: Array<{
      id: string;
      type: 'order' | 'wishlist' | 'promotion';
      title: string;
      description: string;
      timestamp: string;
      icon: string;
    }>;
  }>('/accounts/dashboard/');
}

export async function fetchWishlistItems() {
  const response = await request<{
    items: Array<{ id: string; name: string; price: number; image: string; alt: string; inStock: boolean }>;
  }>('/accounts/wishlist/');
  return response.items;
}

export async function subscribeToNewsletter(email: string): Promise<{
  subscriber: NewsletterSubscriber;
  created: boolean;
}> {
  return request('/newsletter/subscriptions/', {
    method: 'POST',
    body: { email },
  });
}

export async function addWishlistItem(productId: string) {
  return request('/accounts/wishlist/', {
    method: 'POST',
    body: { productId },
  });
}

export async function removeWishlistItem(productId: string) {
  return request(`/accounts/wishlist/${productId}/`, {
    method: 'DELETE',
  });
}

export async function fetchAdminOverview(params: { month?: string } = {}): Promise<AdminOverview> {
  const query = new URLSearchParams();
  if (params.month) query.set('month', params.month);
  const endpoint = query.toString() ? `/admin/overview/?${query.toString()}` : '/admin/overview/';
  return request<AdminOverview>(endpoint);
}

export async function fetchAdminProducts(params: { search?: string; category?: string } = {}): Promise<AdminProduct[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);

  const endpoint = query.toString() ? `/admin/products/?${query.toString()}` : '/admin/products/';
  return request<AdminProduct[]>(endpoint);
}

export async function createAdminProduct(payload: AdminProductCreatePayload): Promise<AdminProduct> {
  return request<AdminProduct>('/admin/products/', {
    method: 'POST',
    body: payload,
  });
}

export async function fetchAdminPromoCodes(params: { search?: string } = {}): Promise<AdminPromoCode[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  const endpoint = query.toString() ? `/admin/promo-codes/?${query.toString()}` : '/admin/promo-codes/';
  return request<AdminPromoCode[]>(endpoint);
}

export async function createAdminPromoCode(payload: {
  code: string;
  discountPercentage: number;
}): Promise<AdminPromoCode> {
  return request<AdminPromoCode>('/admin/promo-codes/', {
    method: 'POST',
    body: payload,
  });
}

export async function deleteAdminPromoCode(promoCodeId: number): Promise<void> {
  await request(`/admin/promo-codes/${promoCodeId}/`, {
    method: 'DELETE',
  });
}

export async function fetchAdminNewsletterSubscribers(
  params: { search?: string } = {},
): Promise<AdminNewsletterSubscriber[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  const endpoint = query.toString()
    ? `/admin/newsletter-subscribers/?${query.toString()}`
    : '/admin/newsletter-subscribers/';
  return request<AdminNewsletterSubscriber[]>(endpoint);
}

export async function deleteAdminNewsletterSubscriber(subscriberId: number): Promise<void> {
  await request(`/admin/newsletter-subscribers/${subscriberId}/`, {
    method: 'DELETE',
  });
}

export async function validatePromoCode(code: string): Promise<PromoCodeValidationResponse> {
  return request<PromoCodeValidationResponse>('/catalog/promo-codes/validate/', {
    method: 'POST',
    body: { code },
  });
}

export async function updateAdminProduct(
  productId: string,
  payload: Partial<Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<AdminProduct> {
  return request<AdminProduct>(`/admin/products/${productId}/`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await request(`/admin/products/${productId}/`, {
    method: 'DELETE',
  });
}

export async function fetchAdminUsers(params: { search?: string } = {}): Promise<AdminUserRecord[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  const endpoint = query.toString() ? `/admin/users/?${query.toString()}` : '/admin/users/';
  return request<AdminUserRecord[]>(endpoint);
}

export async function createAdminUser(payload: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  loyaltyPoints: number;
  isStaff: boolean;
  isActive: boolean;
}): Promise<AdminUserRecord> {
  return request<AdminUserRecord>('/admin/users/', {
    method: 'POST',
    body: payload,
  });
}

export async function updateAdminUser(
  userId: number,
  payload: Partial<{
    fullName: string;
    email: string;
    phone: string;
    password: string;
    loyaltyPoints: number;
    isStaff: boolean;
    isActive: boolean;
  }>,
): Promise<AdminUserRecord> {
  return request<AdminUserRecord>(`/admin/users/${userId}/`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteAdminUser(userId: number): Promise<void> {
  await request(`/admin/users/${userId}/`, {
    method: 'DELETE',
  });
}

export async function fetchAdminOrders(params: { search?: string; status?: string } = {}): Promise<AdminOrder[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  const endpoint = query.toString() ? `/admin/orders/?${query.toString()}` : '/admin/orders/';
  return request<AdminOrder[]>(endpoint);
}

export async function updateAdminOrder(
  orderNumber: string,
  payload: Partial<{
    status: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string | null;
  }>,
): Promise<AdminOrder> {
  return request<AdminOrder>(`/admin/orders/${orderNumber}/`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteAdminOrder(orderNumber: string): Promise<void> {
  await request(`/admin/orders/${orderNumber}/`, {
    method: 'DELETE',
  });
}

export { ApiError };
