# A simple React-next menu building application.

###
+ A simple cart-item picker for food items.
+ A simple toy-csv-database with a small CRUD-implementation, using Node.JS and nexts server components.
+ A simple CRUD-UI for the "menu-builder", or as i call it, the Admin page.

### Worth mentioning
- I made this in ~3–4 hours.

- I have a couple of compromises:
The UI in “admin” or “menu-builder” (accessible via /admin) isn’t the prettiest, but I wanted to focus on UX and functionality there. It works as a CRUD-ish based application.
I’ve implemented input validation, confirmation validation, etc. You can remove and add items in bulk, but you can’t modify values of existing ones. I have implemented the function for this, but didn’t have time to create a proper prompt or UI for it. BUT it does communicate with it.

- I don’t have any toasts or really UX-friendly confirmations for when a request has been sent successfully. I would love to have that though, and could implement it with a bit more time.

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

For a preview build
```bash
npm run build
``

#### Homepage (menu)
Open [http://localhost:3000](http://localhost:3000)

#### Menu-builder (admin, as I call it).
Open [http://localhost:3000/admin](http://localhost:3000/admin)
