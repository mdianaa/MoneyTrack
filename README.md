# MoneyTrack  
**Personal Finance Management PWA**

## Table of Contents
1. [Introduction](#introduction)  
2. [Key Features](#key-features)  
3. [Technology Stack](#technology-stack)  
4. [Project Structure](#project-structure)  
5. [File Overview](#file-overview)  
6. [Usage](#usage)  
7. [Installation & Running](#installation--running)  
8. [Future Improvements](#future-improvements)  

---

## Introduction
**MoneyTrack** is a Progressive Web App (PWA) for tracking personal finances: incomes, expenses, and savings.  
It works offline via a Service Worker, can be installed on mobile devices, and stores data persistently in IndexedDB.

---

## Key Features
- **CRUD operations**: add, view, delete entries  
- **Entry types**:  
  - **Income**  
  - **Expense**  
  - **Savings**  
- **Filtering**: view all entries or filter by type  
- **Currency selection**: BGN, USD, EUR (saved in `localStorage`)  
- **Monthly budget**: set a monthly limit with automatic carry-over of unspent funds  
- **Offline support**: static asset caching via Service Worker  
- **Background sync**: scaffold via Web Worker for future backend integration  

---

## Technology Stack
- **HTML5 & CSS3**: responsive UI with CSS Grid and custom properties  
- **JavaScript (ES6+)**: DOM manipulation, PWA logic  
- **IndexedDB** (`db.js`): asynchronous wrapper for CRUD and budgets  
- **Service Worker** (`service-worker.js`): `stale-while-revalidate` caching strategy  
- **Web Worker** (`sync-worker.js`): scaffold for background synchronization  

---

## File Overview

### `index.html`
- Loads `manifest.json` & `style.css`  
- **Header**: title, subtitle, dropdowns for currency & entry type  
- **Form** (`.entry-form`): amount, category inputs & “Add” button  
- **Filters** (`#filters`): All, Income, Expense, Savings  
- **Monthly Budget** (`#monthly-budget-section`): set limit, view rollover, spent, remaining  
- **Entry List** (`#entries-list`): container for generated entries  
- **Footer**: total balance & total savings  

### `style.css`
- **CSS variables**: main colors, income, expense, savings accents  
- **Layout**: Grid for forms & lists, Flex for header, filters, footer  
- **Custom dropdowns**: `.custom-select select` with SVG arrow  
- **Effects**: hover, transitions, gaps, margins for improved UX  

### `db.js`
- **openDB()**: initializes IndexedDB, object stores:
  - `entries` (keyPath=`id`)  
  - `budgets` (keyPath=`category`)  
  - `monthlyBudgets` (keyPath=`month`)  
- **getAllEntries() / addEntry() / deleteEntry()**  
- **getAllBudgets() / upsertBudget()**  
- **getMonthlyBudget(month) / upsertMonthlyBudget({month,limit})**  

### `app.js`
- On **DOMContentLoaded**: selects DOM elements  
- **Dropdowns**:  
  - Currency (`#currency-select` + `localStorage`)  
  - Entry type (`#type-select`)  
- **CRUD**:  
  - `addEntry()` on “Add” button  
  - Delete via `.del-btn`  
- **Render entries**:  
  - `renderEntries(entries)` filters and displays date, amount, category, delete button  
  - Updates `#total-sum` & `#savings-sum`  
- **Monthly budget**:  
  - `renderMonthlyBudget(entries)` with carry-over logic  
  - `#save-monthly-budget` listener for `upsertMonthlyBudget`  
- **Category budgets**: `renderBudgets(entries)` + CRUD for `budgets`  
- **PWA integration**: registers `service-worker.js`  
- **Background sync**: starts `sync-worker.js` on `online`  

### `service-worker.js`
- **Cache name**: `expense-cache-v1`  
- **install**: caches core assets  
- **activate**: cleans old caches  
- **fetch**: `stale-while-revalidate` strategy  

### `sync-worker.js`
- **message listener** for `"sync"`  
- Placeholder for backend synchronization  

---

## Usage
1. Select currency and entry type (Income/Expense/Savings)  
2. Enter amount and category, click “➕ Add”  
3. View entries with date, amount, and category  
4. Filter by type or view all  
5. Set a monthly budget and see rollover, spent, and remaining  
6. Manage category-specific budgets with progress bars  
7. Delete entries with the 🗑️ button  

---

## Installation & Running
```bash
git clone https://github.com/mdianaa/MoneyTrack
cd MoneyTrack
npx http-server
