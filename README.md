---

## Описание на файловете

### `index.html`
- Зарежда `manifest.json` и `style.css`  
- **Header** с:
  - Заглавие, подзаглавие  
  - Dropdown менюта за валута и тип запис  
- **Form** (`.entry-form`): поле за сума, категория, бутон „Add“  
- **Филтри** (`#filters`): All, Income, Expense, Savings  
- **Секция Mesечен бюджет** (`#monthly-budget-section`): лимит, rollover, spent, remaining  
- **Списък** (`#entries-list`): динамично генерирани записи  
- **Footer**: общ баланс и спестявания  

### `style.css`
- **CSS променливи**: цветове за основен акцент, приходи, разходи, спестяване  
- **Layout**:  
  - Grid за формата и списъка  
  - Flex за header.settings, filters, footer  
- **Custom dropdown**: `.custom-select select` със SVG-стрелка  
- **Ефекти**: hover, transition, gap, margin  

### `db.js`
- **openDB()**: инициализира IndexedDB базата, създава обекти стор:
  - `entries` (keyPath=`id`)  
  - `budgets` (keyPath=`category`)  
  - `monthlyBudgets` (keyPath=`month`)  
- **getAllEntries() / addEntry() / deleteEntry()**  
- **getAllBudgets() / upsertBudget()**  
- **getMonthlyBudget(month) / upsertMonthlyBudget({month,limit})**  

### `app.js`
- **DOMContentLoaded**: намери всички DOM елементи  
- **Dropdowns**:  
  - Валута: #currency-select + `localStorage`  
  - Тип запис: #type-select  
- **CRUD**:  
  - `addEntry()` при бутон „Add“  
  - Изтриване с `.del-btn`  
- **Рендиране на записи**:  
  - `renderEntries(entries)` филтрира и показва дата, сума, категория, бутон  
  - Актуализира `<span id="total-sum">` и `<span id="savings-sum">`  
- **Месечен бюджет**:  
  - `renderMonthlyBudget(entries)` с carry-over от предишния месец  
  - `saveMonthlyBtn` listener за `upsertMonthlyBudget`  
- **Бюджети по категории**: `renderBudgets(entries)` + CRUD за `budgets`  
- **PWA**: регистрация на `service-worker.js`  
- **Web Worker**: стартиране на `sync-worker.js` при `online`  

### `service-worker.js`
- **Cache name**: `expense-cache-v1`  
- **install**: кешира основните assets  
- **activate**: почиства стари кешове  
- **fetch**: stale-while-revalidate  

### `sync-worker.js`
- **message listener** за `"sync"`  
- **placeholder** за бекенд синхронизация  

---

## Употреба
1. Избери валута и тип (Income/Expense/Savings)  
2. Въведи сума, категория и натисни „➕ Add“  
3. Виж записите в списъка с дата и сума  
4. Филтрирай по тип запис  
5. Задай месечен бюджет и виж експенсив, rollover и останал лимит  
6. Управлявай бюджети по категории (лимит + прогрес бар)  
7. Изтриваш записи с бутон 🗑️  

---

## Инсталация и стартиране
```bash
git clone https://github.com/mdianaa/MoneyTrack
cd MoneyTrack
npx http-server
