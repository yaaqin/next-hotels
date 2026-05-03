export interface NavItem {
  key: string;
  label: string;
  path?: string;
  parentKey?: string;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        key: 'profile',
        label: 'Profile',
        path: '/dashboard/profile',
        parentKey: 'dashboard',
      },
      {
        key: 'floor',
        label: 'Floor',
        path: '/dashboard/floor',
        parentKey: 'dashboard',
      },
      {
        key: 'menu',
        label: 'Menu',
        path: '/dashboard/menu',
        parentKey: 'dashboard',
      },
    ],
  },
  {
    key: 'site',
    label: 'Site',
    path: '/dashboard/site',
    children: [
      {
        key: 'room',
        label: 'Room',
        path: '/dashboard/room',
        parentKey: 'site',
      },
      {
        key: 'room-type',
        label: 'Room Type',
        path: '/dashboard/room-type',
        parentKey: 'site',
      },
      {
        key: 'gallery',
        label: 'Gallery',
        path: '/dashboard/gallery',
        parentKey: 'site',
      },
      {
        key: 'image',
        label: 'Image',
        path: '/dashboard/image',
        parentKey: 'site',
      },
      {
        key: 'booking',
        label: 'Booking',
        path: '/dashboard/booking',
        parentKey: 'site',
      },
      {
        key: 'price proposal',
        label: 'Price Proposal',
        path: '/dashboard/price-proposal',
        parentKey: 'site',
      },
      {
        key: 'facility',
        label: 'Facility',
        parentKey: 'site',
        children: [
          {
            key: 'facility-type',
            label: 'Facility Type',
            path: '/dashboard/facility/type',
            parentKey: 'facility',
          },
          {
            key: 'facility-item',
            label: 'Facility Item',
            path: '/dashboard/facility',
            parentKey: 'facility',
          },
          {
            key: 'facility-group',
            label: 'Facility group',
            path: '/dashboard/facility/group',
            parentKey: 'facility',
          },
        ],
      },
    ],
  },
  {
    key: 'user',
    label: 'User Management',
    path: '/user',
    children: [
      {
        key: 'admin',
        label: 'Admin',
        path: '/user/admin',
        parentKey: 'user',
      },
      {
        key: 'user-log',
        label: 'User Log',
        path: '/dashboard/user-log',
        parentKey: 'user',
      },
      {
        key: 'refund',
        label: 'Refund',
        path: '/dashboard/refund',
        parentKey: 'user',
      },
      {
        key: 'menu',
        label: 'Menu',
        path: '/dashboard/menu',
        parentKey: 'user',
      },
    ],
  },
  {
    key: 'rsto',
    label: 'Food',
    path: '/food',
    children: [
      {
        key: 'food-menu',
        label: 'Food Menu',
        path: '/dashboard/food',
        parentKey: 'food',
      },
      {
        key: 'partner-proposal',
        label: 'Partnership',
        path: '/dashboard/partner-proposal',
        parentKey: 'food',
      },
      {
        key: 'resto-admin',
        label: 'Admin Restaurant',
        path: '/dashboard/admin-restaurant',
        parentKey: 'food',
      },
      {
        key: 'food-category',
        label: 'Food Category',
        path: '/dashboard/food-category',
        parentKey: 'food',
      },
      {
        key: 'order-history',
        label: 'History',
        path: '/dashboard/food-history',
        parentKey: 'food',
      },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    path: '/finance',
    children: [
      {
        key: 'refund',
        label: 'Refund',
        path: '/dashboard/refund',
        parentKey: 'finance',
      },
      {
        key: 'price-plan',
        label: 'Price Plan',
        path: '/finance/price-plan',
        parentKey: 'finance',
      },
      {
        key: 'finance-history',
        label: 'History',
        path: '/finance/history',
        parentKey: 'finance',
      },
      {
        key: 'revenue',
        label: 'Revenue',
        path: '/finance/revenue',
        parentKey: 'finance',
      },
      {
        key: 'withdraw',
        label: 'Withdraw',
        path: '/dashboard/withdraw',
        parentKey: 'finance',     
      },
    ],
  },
  {
    key: 'operational',
    label: 'Operational',
    path: '/operational',
    children: [
      {
        key: 'opr',
        label: 'Opertaional',
        path: '/dashboard/operational',
        parentKey: 'operational',
      },
      {
        key: 'room-maintain',
        label: 'Room Maintenance',
        path: '/dashboard/room-maintenance',
        parentKey: 'operational',
      },
    ],
  },
];
