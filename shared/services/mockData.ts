import type { Category, Dish } from '../types/menu';
import type { Order } from '../types/order';
import type { Reservation } from '../types/reservation';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Caviar & Starters', slug: 'starters', displayOrder: 1, isActive: true },
  { id: 'c2', name: "Chef's Tasting Menu", slug: 'chefs-tasting', displayOrder: 2, isActive: true },
  { id: 'c3', name: 'Signature Mains', slug: 'mains', displayOrder: 3, isActive: true },
  { id: 'c4', name: 'Artisanal Desserts', slug: 'desserts', displayOrder: 4, isActive: true },
  { id: 'c5', name: 'Sommelier Cellar & Cocktails', slug: 'wines', displayOrder: 5, isActive: true },
  { id: 'c6', name: 'Private Reserve Spirits', slug: 'spirits', displayOrder: 6, isActive: true },
];

export const MOCK_DISHES: Dish[] = [
  {
    id: 'd1',
    categoryId: 'c1',
    categorySlug: 'starters',
    name: 'Imperial Beluga Caviar Tartlet',
    slug: 'beluga-caviar-tartlet',
    description: 'Oscietra caviar, smoked crème fraîche, golden buckwheat tartlet with 24k gold leaf accent.',
    price: 95.00,
    mediaUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop',
    calories: 240,
    dietaryTags: ['CHEFS_CHOICE'],
    allergens: ['Dairy', 'Fish', 'Gluten'],
    winePairing: 'Dom Pérignon Vintage 2013',
    isAvailable: true,
    modifiers: [
      {
        id: 'm1',
        title: 'Caviar Grade Upgrade',
        required: false,
        options: [
          { id: 'o1', name: 'Royal Osetra (+30g)', price: 45.00 },
          { id: 'o2', name: 'Golden Almas Special Reserve', price: 90.00 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    categoryId: 'c1',
    categorySlug: 'starters',
    name: 'Hokkaido Scallop Carpaccio',
    slug: 'hokkaido-scallop-carpaccio',
    description: 'Thinly sliced Hokkaido sea scallops, finger lime caviar, white truffle oil, and yuzu foam.',
    price: 42.00,
    mediaUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1200&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop',
    calories: 190,
    dietaryTags: ['GLUTEN_FREE', 'CHEFS_CHOICE'],
    allergens: ['Mollusks'],
    winePairing: 'Chablis Grand Cru Les Clos 2020',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd3',
    categoryId: 'c3',
    categorySlug: 'mains',
    name: 'A5 Miyazaki Wagyu Tenderloin',
    slug: 'a5-wagyu-tenderloin',
    description: 'Miyazaki A5 beef tenderloin, charred onion puree, bone marrow jus, smoked sea salt.',
    price: 165.00,
    mediaUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop',
    calories: 620,
    dietaryTags: ['CHEFS_CHOICE', 'GLUTEN_FREE'],
    allergens: ['Beef'],
    winePairing: 'Château Margaux 2015',
    isAvailable: true,
    modifiers: [
      {
        id: 'm2',
        title: 'Preparation & Doneness',
        required: true,
        options: [
          { id: 'o3', name: 'Rare', price: 0 },
          { id: 'o4', name: 'Medium Rare', price: 0 },
          { id: 'o5', name: 'Medium', price: 0 }
        ]
      },
      {
        id: 'm3',
        title: 'Truffle Shavings',
        required: false,
        options: [
          { id: 'o6', name: 'Fresh Périgord Black Truffle (+5g)', price: 25.00 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd4',
    categoryId: 'c3',
    categorySlug: 'mains',
    name: 'Wild Roasted Chilean Sea Bass',
    slug: 'chilean-sea-bass',
    description: 'Pan-roasted Chilean sea bass, saffron fumet, baby leeks, buttered asparagus tips.',
    price: 78.00,
    mediaUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop',
    calories: 480,
    dietaryTags: ['GLUTEN_FREE'],
    allergens: ['Fish', 'Dairy'],
    winePairing: 'Puligny-Montrachet 2021',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd5',
    categoryId: 'c4',
    categorySlug: 'desserts',
    name: 'L’Étoile Noir Smoked Chocolate Sphere',
    slug: 'smoked-chocolate-sphere',
    description: 'Valrhona 70% dark chocolate sphere, warm salted caramel drizzle, Madagascar vanilla bean gelato.',
    price: 28.00,
    mediaUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1200&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=600&auto=format&fit=crop',
    calories: 380,
    dietaryTags: ['CHEFS_CHOICE', 'VEGETARIAN'],
    allergens: ['Dairy', 'Eggs'],
    winePairing: 'Château d’Yquem Sauternes 2010',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#LNO-8921',
    orderType: 'DINE_IN',
    tableNumber: '14',
    subtotal: 207.00,
    taxAmount: 17.60,
    deliveryFee: 0.00,
    discountAmount: 0.00,
    tipAmount: 0.00,
    totalAmount: 224.60,
    orderStatus: 'PREPARING',
    paymentStatus: 'PAID',
    specialInstructions: 'Extra crisp on wagyu charred onion puree',
    items: [
      {
        id: 'oi-1',
        orderId: 'ord-101',
        dishId: 'd3',
        dishName: 'A5 Miyazaki Wagyu Tenderloin',
        unitPrice: 165.00,
        quantity: 1,
        selectedModifiers: [
          { modifierTitle: 'Preparation & Doneness', optionName: 'Medium Rare', price: 0 }
        ],
        itemSubtotal: 165.00
      },
      {
        id: 'oi-2',
        orderId: 'ord-101',
        dishId: 'd2',
        dishName: 'Hokkaido Scallop Carpaccio',
        unitPrice: 42.00,
        quantity: 1,
        selectedModifiers: [],
        itemSubtotal: 42.00
      }
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-501',
    bookingReference: '#RES-4012',
    guestName: 'Lord Sterling Vance',
    guestEmail: 'sterling@vance-holdings.com',
    guestPhone: '+1 555-019-2834',
    partySize: 4,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '20:00',
    seatingSection: 'CHEFS_COUNTER',
    specialRequests: 'Anniversary celebration. Sommelier pairing recommendation appreciated.',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  }
];
