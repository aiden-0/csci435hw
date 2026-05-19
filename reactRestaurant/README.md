# Aiden's Restaurant

React, Vite, Express, and MongoDB restaurant app.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and adjust `MONGODB_URI` if needed:

   ```bash
   cp .env.example .env
   ```

3. Start MongoDB locally, then run both the API and React app:

   ```bash
   npm run dev:full
   ```

The React app runs at `http://localhost:5173`. The Express API runs at `http://localhost:5000`.

## Deploying to Vercel

The project includes a Vercel Function at `api/index.js`, so the same Express API is available under `/api` after deployment.

In the Vercel project settings, add this environment variable for Production, Preview, and Development:

```bash
MONGODB_URI=mongodb+srv://aidencoolha123_db_user:YOUR_PASSWORD@webdev.ye7nzsz.mongodb.net/aiden_restaurant?retryWrites=true&w=majority
```

Do not commit your real `.env` file. It is ignored by Git.

In MongoDB Atlas, make sure **Network Access** allows Vercel to connect. For a class project, `0.0.0.0/0` is the simplest option, though a narrower rule is better for production.

After deployment, test these URLs on your Vercel domain:

```text
https://your-project.vercel.app/api/health
https://your-project.vercel.app/api/menu
https://your-project.vercel.app/menu
```

## API

- `GET /api/menu` returns menu items from MongoDB.
- `POST /api/menu` creates a menu item.
- `PATCH /api/menu/:id` updates a menu item.
- `DELETE /api/menu/:id` deletes a menu item.
- `GET /api/cart/:sessionId` returns a persisted cart.
- `PUT /api/cart/:sessionId` saves cart updates.
- `DELETE /api/cart/:sessionId` clears a cart.
- `GET /api/orders` returns saved orders.
- `POST /api/orders` creates an order and clears that cart.
- `PATCH /api/orders/:id` updates an order status.
- `POST /api/orders/:id/items` adds a menu item to an order, or increases its quantity if it is already there.
- `PATCH /api/orders/:id/items/:menuItemId` updates an existing order item's quantity.
- `DELETE /api/orders/:id/items/:menuItemId` removes one menu item line from an order and recalculates the total.
- `DELETE /api/orders/:id` deletes an order.

If the `menuitems` collection is empty when the server starts, the backend seeds it with the original restaurant menu.
