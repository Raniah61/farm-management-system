# farm-management-system
it manages farm databases to ensure smooth record keeping
# 🌱 SmartFarm DB Console

An integrated agricultural management system and real-time database console designed to mirror SQLite/relational database schema tables for livestock, poultry, production logs, health tracking, and feed inventories.

---

## 🚀 Features

* **Interactive Dashboard & Views:** Seamlessly switch between different database tables including Animals, Poultry Batches, Production Records, Health Logs, Feed Inventory, and Feeding Schedules.
* **Dynamic Record Insertion:** Built-in modal forms that allow users to insert new records directly into the console tables with immediate UI updates.
* **Live Audit Logging:** Automatically tracks and appends system transactions (`INSERT`, `UPDATE`) with timestamps to an audit log table.
* **Responsive Green Theme:** Styled with a professional agricultural dark green and mint color palette, optimized for both desktop and mobile screens.
* **Desktop & Mobile App Ready:** Easily installable as a standalone progressive web app or desktop shortcut.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom variables, Flexbox/Grid)
* **Scripting:** Vanilla JavaScript (DOM manipulation, dynamic table rendering, event handlers)
* **Architecture:** Client-side single-page application (SPA) mimicking relational database constraints.

---

## 📂 Project Structure

```text
smartfarm-console/
│
├── index.html       # Main application layout, views, and JavaScript logic
├── style.css        # Complete stylesheet (Green theme, components, modals)
└── README.md        # Project documentation
