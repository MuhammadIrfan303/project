export const mockProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Downtown',
    description: 'A beautiful modern apartment in the heart of downtown. This spacious 2-bedroom apartment features high ceilings, large windows, and a modern kitchen with stainless steel appliances. The building offers a fitness center, rooftop terrace, and 24-hour concierge service.',
    price: 450000,
    type: 'apartment',
    status: 'for-sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    location: 'Downtown, New York',
    address: '123 Main St, New York, NY 10001',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Elevator', 'Gym', 'Parking', 'Swimming Pool', 'Security'],
    featured: true,
    createdAt: '2023-01-15T10:30:00.000Z',
    agent: {
      id: 'agent1',
      name: 'John Smith',
      phone: '(123) 456-7890',
      email: 'john@example.com',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: '2',
    title: 'Luxury Villa with Ocean View',
    description: 'Stunning luxury villa with breathtaking ocean views. This 5-bedroom, 4-bathroom villa features an infinity pool, spacious terrace, and a gourmet kitchen. The master suite includes a private balcony and a spa-like bathroom. Located in an exclusive gated community with 24-hour security.',
    price: 2500000,
    type: 'house',
    status: 'for-sale',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    location: 'Malibu, California',
    address: '456 Ocean Dr, Malibu, CA 90265',
    coordinates: { lat: 34.0259, lng: -118.7798 },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Security', 'Ocean View'],
    featured: true,
    createdAt: '2023-02-20T14:45:00.000Z',
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson',
      phone: '(234) 567-8901',
      email: 'sarah@example.com',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  },
  {
    id: '3',
    title: 'Cozy Suburban Family Home',
    description: 'Charming 3-bedroom family home in a quiet suburban neighborhood. Features include a renovated kitchen, hardwood floors, and a spacious backyard with a deck perfect for entertaining. The finished basement provides additional living space. Close to schools, parks, and shopping centers.',
    price: 350000,
    type: 'house',
    status: 'for-sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    location: 'Brookfield, Illinois',
    address: '789 Maple Ave, Brookfield, IL 60513',
    coordinates: { lat: 41.8225, lng: -87.8470 },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Backyard', 'Basement', 'Garage', 'Fireplace', 'Central Air'],
    featured: false,
    createdAt: '2023-03-10T09:15:00.000Z',
    agent: {
      id: 'agent3',
      name: 'Michael Brown',
      phone: '(345) 678-9012',
      email: 'michael@example.com',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  },
  {
    id: '4',
    title: 'Modern Loft in Arts District',
    description: 'Stylish loft in the vibrant Arts District. This open-concept space features exposed brick walls, high ceilings, and large industrial windows. The kitchen includes high-end appliances and a breakfast bar. Building amenities include a rooftop lounge, fitness center, and secure parking.',
    price: 3500,
    type: 'apartment',
    status: 'for-rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 950,
    location: 'Arts District, Los Angeles',
    address: '101 Artist Way, Los Angeles, CA 90013',
    coordinates: { lat: 34.0403, lng: -118.2351 },
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Elevator', 'Gym', 'Parking', 'Rooftop', 'Pet Friendly'],
    featured: true,
    createdAt: '2023-04-05T16:20:00.000Z',
    agent: {
      id: 'agent4',
      name: 'Emily Davis',
      phone: '(456) 789-0123',
      email: 'emily@example.com',
      photo: 'https://randomuser.me/api/portraits/women/4.jpg'
    }
  },
  {
    id: '5',
    title: 'Waterfront Condo with City Views',
    description: 'Luxurious waterfront condo with stunning city skyline views. This 2-bedroom unit features floor-to-ceiling windows, a gourmet kitchen with quartz countertops, and a spacious balcony. The building offers a fitness center, infinity pool, and concierge services.',
    price: 750000,
    type: 'condo',
    status: 'for-sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    location: 'Harbor East, Baltimore',
    address: '222 Waterfront Dr, Baltimore, MD 21202',
    coordinates: { lat: 39.2822, lng: -76.6024 },
    images: [
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Elevator', 'Gym', 'Swimming Pool', 'Balcony', 'Waterfront'],
    featured: false,
    createdAt: '2023-05-12T11:30:00.000Z',
    agent: {
      id: 'agent5',
      name: 'David Wilson',
      phone: '(567) 890-1234',
      email: 'david@example.com',
      photo: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  },
  {
    id: '6',
    title: 'Historic Brownstone in Brooklyn',
    description: 'Beautifully renovated brownstone in a historic Brooklyn neighborhood. This 4-bedroom home retains its original charm with crown moldings, hardwood floors, and a decorative fireplace, while offering modern updates including a chef\'s kitchen and spa-like bathrooms.',
    price: 1850000,
    type: 'house',
    status: 'for-sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    location: 'Park Slope, Brooklyn',
    address: '333 Prospect Park West, Brooklyn, NY 11215',
    coordinates: { lat: 40.6681, lng: -73.9806 },
    images: [
      'https://images.unsplash.com/photo-1625602812206-5ec545ca1231?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Backyard', 'Fireplace', 'Basement', 'High Ceilings', 'Original Details'],
    featured: true,
    createdAt: '2023-06-18T13:45:00.000Z',
    agent: {
      id: 'agent1',
      name: 'John Smith',
      phone: '(123) 456-7890',
      email: 'john@example.com',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  }
];
export const mockTestimonials = [
  {
    id: '1',
    name: 'Ayesha Khan',
    role: 'Home Buyer',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    text: 'I found my dream home through RealEstate Hub! The search features made it easy to filter exactly what I was looking for, and the virtual tour saved me so much time. Highly recommend!'
  },
  {
    id: '2',
    name: 'Ali Ahmed',
    role: 'Property Investor',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    text: 'As an investor, I appreciate the detailed property information and analytics available on RealEstate Hub. It helps me make informed decisions quickly. The chat feature also makes it easy to connect with sellers.'
  },
  {
    id: '3',
    name: 'Fatima Malik',
    role: 'First-time Buyer',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    text: 'Being a first-time buyer was intimidating, but RealEstate Hub made the process so much easier. The interface is user-friendly, and I loved getting notifications when new properties matching my criteria were listed.'
  },
  {
    id: '4',
    name: 'Usman Riaz',
    role: 'Commercial Client',
    image: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    text: 'Found the perfect office space for my startup within days of searching. The location-based filters were incredibly helpful!'
  },
  {
    id: '5',
    name: 'Sana Javed',
    role: 'Rental Client',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    text: 'The rental process was seamless. I could compare multiple properties side by side and schedule viewings directly through the app.'
  }
];

export const mockTeamMembers = [
  {
    id: '1',
    name: 'Alexandra Morgan',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/women/23.jpg',
    bio: 'With over 15 years in real estate, Alexandra founded RealEstate Hub to revolutionize how people find their perfect homes.'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Chief Property Officer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Marcus ensures all listings meet our quality standards and works directly with premium property sellers.'
  },
  {
    id: '3',
    name: 'Sophia Chen',
    role: 'Head of Customer Experience',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Sophia leads our customer support team, ensuring every user has a seamless experience on our platform.'
  }
];