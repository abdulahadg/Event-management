export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  iconName: string;
  category: string;
  imageUrl: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  location: string;
  category: 'Corporate' | 'Wedding' | 'Birthday' | 'Conference' | 'Festival' | 'Luxury Events';
  imageUrl: string;
  year: string;
  guestCount: string;
  highlights: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  category: string;
  description: string;
  imageUrl: string;
  availableSeats: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
