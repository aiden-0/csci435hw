import MenuItem from './models/MenuItem.js'

const defaultMenuItems = [
  { name: 'Caeser Salad', category: 'Appetizers', price: 6 },
  { name: 'Tomato Soup', category: 'Appetizers', price: 5 },
  { name: 'Breadsticks', category: 'Appetizers', price: 4 },
  { name: 'Signature Tomato Pasta', category: 'Main Dishes', price: 12 },
  { name: 'Beef Wellington', category: 'Main Dishes', price: 67 },
  { name: 'Cheeseburger', category: 'Main Dishes', price: 10 },
  { name: 'Ice Cream', category: 'Desserts', price: 4 },
  { name: 'Chocolate Cake', category: 'Desserts', price: 5 },
  { name: 'Cheesecake', category: 'Desserts', price: 6 },
]

export async function seedMenuIfEmpty() {
  const count = await MenuItem.countDocuments()

  if (count === 0) {
    await MenuItem.insertMany(defaultMenuItems)
    console.log('Seeded default menu items.')
  }
}
