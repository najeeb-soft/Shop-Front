# 🛒 E-commerce Site

A modern, full-stack e-commerce application built with a focus on performance and seamless user experience. 

[![Built with Replit](https://img.shields.io/badge/Built%20with-Replit-blue?style=flat-square)](https://replit.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## ✨ Features

* **🛍️ Dynamic Product Catalog**: Browse products with high-quality imagery and responsive layouts.
* **🔍 Detailed Product Views**: Deep-dive into product specifications and descriptions.
* **🛒 Persistent Shopping Cart**: State-managed cart that keeps track of your items as you shop.
* **💳 Order Lifecycle**: Integrated flow for placing orders and reviewing transaction history.
* **🔐 Secure Auth**: Built-in authentication using **Replit Auth** for a friction-less login experience.

---

## 💻 Tech Stack

### Frontend
* **Framework**: [React](https://reactjs.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **State Management**: [Zustand](https://docs.pmnd.rs/zustand/)
* **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Database
* **Runtime**: [Node.js](https://nodejs.org/)
* **Server**: [Express](https://expressjs.com/)
* **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
* **Database**: [PostgreSQL](https://www.postgresql.org/)

---

## 📂 Project Structure

```text
├── client/          # React frontend (Vite)
├── server/          # Express backend & API logic
├── shared/          # Shared TypeScript types & Drizzle schemas
├── public/          # Static assets & images
└── drizzle/         # Database migrations
