# Qantom Lab — Backend + Admin Panel

Node.js + Express backend, MongoDB Atlas database, and an admin panel for the Qantom Lab website.

```
Frontend:  public/index.html (HTML/CSS/JS — the existing site, served statically)
Backend:   Express (server.js) + REST API under /api
Database:  MongoDB Atlas (via Mongoose)
Admin:     public/admin/index.html, served at /admin
```

## What's included

- REST API for Courses, Testimonials, Gallery items, FAQ, Site Settings, Contact messages and Newsletter subscribers.
- Session-based admin login using the `ADMIN_USERNAME` / `ADMIN_PASSWORD` set in `.env` (works with or without a database).
- Admin panel (`/admin`) to add/edit/delete courses, testimonials, gallery items and FAQ entries; edit site-wide settings (contact info, WhatsApp, social links, About stats); read contact messages; and view/export newsletter subscribers.
- **The public site is now fully dynamic.** Courses, Testimonials, Gallery and FAQ are fetched from MongoDB on every page load and rendered client-side — any change made in the admin panel (add, edit, delete, publish/unpublish) appears on the site the next time it's loaded, with no rebuild or redeploy. Site-wide settings (WhatsApp number/message, contact email/phone, social links, the four About-section stats) are also pulled from the database and applied everywhere they appear.
  - "Instantly" here means *on next page load* — this is a static HTML site with no persistent server connection to visitors' browsers, so a tab that's already open won't update itself live without a refresh. Every new visit or reload always reflects the current database.
  - If the API can't be reached (e.g. the backend isn't running yet), the site falls back to the static content already baked into `index.html` instead of showing an empty section.
  - Course/Testimonial/Gallery/FAQ items support an optional Arabic field (title/description/quote/question/answer) — fill it in and the Arabic language toggle will show it; leave it blank and the toggle falls back to the English text.
  - Courses use a fixed `category` (AI & ML, XR/VR/AR, Engines & Games, Arduino & Robotics, Programming, Web & Design, Security & Data) so they plug into the existing search/filter bar on the site.
- The public site's Contact form and Newsletter signup save to MongoDB (previously these existed only as a `mailto:` link / a fake success message).
- Rate limiting on login, contact and newsletter endpoints. Helmet security headers. CORS configured for same-origin use.

## 1. Install dependencies

```bash
cd qantom-lab-backend
npm install
```

## 2. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Under **Database Access**, create a database user with a password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` for testing/any IP — tighten this for production).
4. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
5. Add `/qantomlab` before the `?` so it points at a database named `qantomlab`.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` — your Atlas connection string from step 2. If left unset, the server still runs: the public site shows its built-in static content and admin login works, but nothing can be saved. The admin session is then kept in a signed cookie, so login also works on serverless hosts like Vercel.
- `SESSION_SECRET` — any long random string (the .env.example file shows a command to generate one).
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the login for `/admin`. Change them and restart the server to update the login.

## 4. Seed the database (optional but recommended)

```bash
npm run seed
```

Populates MongoDB with the 17 courses, 5 testimonials and 6 gallery items that are already on the live site, so the admin panel starts pre-filled with real content instead of empty tables. Safe to re-run — it clears and re-inserts each collection.

## 5. Run the server

```bash
npm start          # production
npm run dev        # auto-restarts on file changes
```

Then open:
- **Public site:** http://localhost:5000/
- **Admin panel:** http://localhost:5000/admin

## Deploying

This is a single Express app serving both the public site and the admin panel, so it deploys as one service. It works as-is on Render, Railway, Fly.io, a VPS, etc. — set the same environment variables from `.env` in your host's dashboard, and make sure `NODE_ENV=production`.

If you deploy the frontend separately (a different domain than the API), set `CLIENT_ORIGIN` in `.env` to that domain, and note that session cookies require `https` in production (the `secure` cookie flag is automatically enabled when `NODE_ENV=production`).

## API overview

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | — | Admin login |
| POST | /api/auth/logout | — | Admin logout |
| GET | /api/auth/me | admin | Current admin session |
| GET | /api/courses | — | List published courses (`?all=1` as admin for everything) |
| POST/PUT/DELETE | /api/courses | admin | Manage courses |
| GET | /api/testimonials | — | List published testimonials |
| POST/PUT/DELETE | /api/testimonials | admin | Manage testimonials |
| GET | /api/gallery | — | List published gallery items |
| POST/PUT/DELETE | /api/gallery | admin | Manage gallery items |
| POST | /api/contact | — | Submit the contact form |
| GET/PATCH/DELETE | /api/contact | admin | Read/manage contact messages |
| POST | /api/newsletter | — | Subscribe an email |
| GET/DELETE | /api/newsletter | admin | View/remove subscribers |
| GET | /api/newsletter/export.csv | admin | Download subscribers as CSV |
| GET | /api/faq | — | List published FAQ items (`?all=1` as admin) |
| POST/PUT/DELETE | /api/faq | admin | Manage FAQ items |
| GET | /api/settings | — | Get site settings (contact, WhatsApp, social, About stats) |
| PUT | /api/settings | admin | Update site settings |

## How the public site stays in sync

`public/index.html` fetches `/api/courses`, `/api/testimonials`, `/api/gallery`, `/api/faq` and `/api/settings` on every page load and renders those sections client-side — the search/filter bar, course details modal, testimonial carousel, gallery lightbox, FAQ accordion/tabs, WhatsApp links and About stats all continue to work exactly as before, just driven by whatever is in MongoDB instead of hardcoded HTML. If the API is unreachable, the static fallback content already in the file is left in place so the site is never empty.
