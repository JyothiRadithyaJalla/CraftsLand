// Application Constants & Brand Parameters

export const RESTAURANT_BRAND = {
  name: "L'Étoile Noir",
  tagline: "Haute Cuisine & Sensory Dining",
  address: "45 Rue Saint-Honoré, Gourmet Enclave",
  phone: "+1 (555) 987-6543",
  whatsapp: "+15559876543",
  email: "concierge@letoilenoir.com",
  currency: "USD",
  currencySymbol: "$",
  defaultTaxRate: 0.085, // 8.5%
  defaultDeliveryFee: 15.00,
  freeDeliveryThreshold: 150.00,
  operatingHours: "Tue - Sun: 17:00 - 23:30",
};

export const SEATING_SECTIONS = [
  { id: 'MAIN_DINING', name: 'Main Dining Room', desc: 'Opulent ambiance under crystal chandeliers' },
  { id: 'CHEFS_COUNTER', name: "Chef's Counter", desc: 'Intimate front-row culinary performance' },
  { id: 'TERRACE', name: 'Garden Terrace', desc: 'Open-air courtyard with heated lounge seating' },
  { id: 'PRIVATE_VAULT', name: 'Private Vault', desc: 'VIP secluded dining suite (Up to 12 guests)' },
] as const;
