# 🗺️ Map Builder

**Live Demo:** [LaraVue Map Builder](https://laravue-map-builder-production.up.railway.app/)

![Map Builder Screenshot 1](https://github.com/user-attachments/assets/78c4a1f7-4f5b-4ad7-b424-7dc004094b19)

![Map Builder Screenshot 2](https://github.com/user-attachments/assets/bb10e892-5867-43b0-be3c-ad9da9d63fc1)

Map Builder is a web application that allows users to create **interactive maps for websites**.  
It helps site owners visually guide their users by placing interactive markers on a map and attaching content, links, and actions to each location.

Users can build maps with a **drag-and-drop interface**, preview them instantly, and manage their existing maps from a dashboard.

---

# 🚀 Tech Stack

### Frontend
- Vue.js
- TypeScript
- TailwindCSS
- Shadcn

### Backend
- Laravel
- Inertia.js

### Database
- PostgreSQL

### Deployment
- Railway

---

# ✨ Core Features

## Interactive Map Builder
Create fully interactive maps using a visual editor.

- Drag and drop map markers
- Resize and position map pointers
- Attach titles, descriptions, and links to markers
- Preview maps before saving

## Map Display
Render interactive maps that allow users to explore your website visually.

- Clickable markers
- Interactive tooltips
- Optional external links

## Manage Existing Maps
A dashboard for managing maps you have created.

- View all created maps
- Edit existing maps
- Preview maps
- Delete maps

## Drag and Drop Interface
Markers can be positioned directly on the map using a smooth drag-and-drop experience.

## Map Pointer Toolbar
Each marker includes an intuitive toolbar for:

- Editing content
- Adjusting pointer settings
- Enabling animations
- Linking to external pages

## Authentication
User accounts allow maps to be securely saved and managed.

## Dark Mode
Full dark mode support for comfortable editing in low-light environments.

---

# 🧭 Use Cases

Map Builder can be used for:

- Website navigation maps
- Interactive documentation
- SaaS onboarding flows
- Product walkthrough maps
- Game-style exploration interfaces

---

# 🛠️ Local Development

Clone the repository

```bash
git clone https://github.com/yourusername/map-builder.git
cd map-builder
```

Install backend dependencies

```bash
composer install
```

Install frontend dependencies

```bash
npm install
```

Run development servers

```bash
php artisan serve
npm run dev
```

Run database migrations

```bash
php artisan migrate
```

---

# 📦 Deployment

This project is deployed using **Railway**, which handles:

- Laravel hosting
- PostgreSQL database
- Environment configuration
- Automatic deployments

---

# 🔮 Upcoming Improvements

### CI/CD Integration
Automated build and deployment pipelines.

### Automated Testing
- Unit testing
- End-to-end (E2E) testing
- Integration testing

### Additional Features
- Map sharing
- Public embeddable maps
- Advanced pointer animations
- Map templates
