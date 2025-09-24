// Simple in-memory database for demo
let tours = [
  {
    id: 1,
    category: "Hiking",
    name: "Mountain Peak Adventure",
    description: "Experience breathtaking views from the summit of our local mountain peaks. This guided hiking tour includes wildlife spotting and photography opportunities.",
    slots: 12,
    image: "/pics/1.jpg"
  },
  {
    id: 2,
    category: "Water Sports",
    name: "Kayaking Experience",
    description: "Paddle through pristine waters while observing local wildlife. Perfect for beginners and experienced kayakers alike.",
    slots: 8,
    image: "/pics/2.jpg"
  },
  {
    id: 3,
    category: "Wildlife",
    name: "Bird Watching Safari",
    description: "Join our expert guides for an early morning bird watching adventure. Discover rare species in their natural habitat.",
    slots: 15,
    image: "/pics/3.jpg"
  },
  {
    id: 4,
    category: "Hiking",
    name: "Forest Trail Walk",
    description: "Explore ancient forest trails and learn about local flora and fauna. Suitable for all fitness levels.",
    slots: 20,
    image: "/pics/4.jpg"
  }
];

let bookings = [];
let nextTourId = 5;
let nextBookingId = 1;

export { tours, bookings, nextTourId, nextBookingId };