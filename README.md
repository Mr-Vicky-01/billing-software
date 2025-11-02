# Sports Shop Billing System

A complete billing software for sports shops built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Menu Display**: View all sports items with prices and images
- **Shopping Cart**: Add items by clicking, manage quantities, view totals
- **Billing**: Pay Now, Print Bill, Clear Cart functionality
- **Menu Management**: Full CRUD operations for menu items
- **Sales Reports**: Monthly sales analytics and statistics
- **Data Persistence**: All data stored in browser LocalStorage

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Menu Items**: Navigate to "Manage Menu" to add sports items with name, price, image URL, and description.

2. **Browse Menu**: On the home page, click on any item to add it to your cart.

3. **View Cart**: Click "Cart" in navigation to see your items, update quantities, or remove items.

4. **Pay & Print**: Use "Pay Now" to complete a transaction, or "Print Bill" to print a receipt.

5. **View Reports**: Check monthly sales reports with statistics and top-selling items.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/context` - React context for cart state
- `/lib` - Utility functions and types

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- React Context API
- LocalStorage for data persistence
