// User Permission types
export interface PermissionUser {
  id: string;
  email: string;
  username: string;
  password?: string;
  googleId: string | null;
  phone: string | null;
  name: string;
  avatarUrl: string;
  country: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN';
  status: string;
  permissions: string[];
  isLoggedIn: boolean;
  lastLoginAt: string | null;
  lastLogoutAt: string | null;
  lastActiveAt: string | null;
  isVerified: boolean;
  otp: string | null;
  otpExpiresAt: string | null;
  otpType: string | null;
  stripeCustomerId: string | null;
  currentPlanId: string | null;
  currentPlanStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  email: string;
  username: string;
  password: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  googleId?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface UpdateRoleRequest {
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export interface UpdatePermissionsRequest {
  permissions: string[];
}

export const PERMISSION_GROUPS: Record<string, string[]> = {
  Dashboard: ['dashboard:view'],
  Settings: ['settings:view', 'settings:update'],
  'Users & Permissions': [
    'user:view',
    'user:create',
    'user:delete',
    'user:update_permissions',
  ],
  Leads: [
    'leads:view',
    'leads:create',
    'leads:update',
    'leads:delete',
    'leads:dispatch_report',
    'leads:assignment_manage',
  ],
  Listings: [
    'listings:view',
    'listings:create',
    'listings:update',
    'listings:delete',
  ],
  Boats: ['boats:sync'],
  Content: [
    'blog:manage',
    'banner:manage',
    'about_us:manage',
    'content:manage',
    'footer:manage',
    'faq:manage',
    'why_us:manage',
    'our_team:manage',
    'contact_info:manage',
  ],
  'Featured & Brands': ['featured_brand:manage', 'ai_search_banner:manage'],
  Category: ['category:manage'],
  Contact: ['contact:view', 'contact:update'],
  'Email Subscriptions': ['email_subscribe:view'],
};
