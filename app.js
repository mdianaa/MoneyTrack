document.addEventListener('DOMContentLoaded', () => {
    const amtInput       = document.getElementById('amount-input');
    const catInput       = document.getElementById('category-input');
    const typeSelect     = document.getElementById('type-select');
    const currencySelect = document.getElementById('currency-select');
    const addBtn         = document.getElementById('add-btn');
    const list           = document.getElementById('entries-list');
    const filters  = document.querySelectorAll('.filter-btn');
    const totalEl        = document.getElementById('total-sum');
    const savingsEl      = document.getElementById('savings-sum');

    const currencySymbols = { BGN: 'лв.', USD: '$', EUR: '€' };

    let currency = localStorage.getItem('currency') || 'BGN';
    currencySelect.value = currency;

    currencySelect.addEventListener('change', () => {
        currency = currencySelect.value;
        localStorage.setItem('currency', currency);
        loadAndRender();
    });
    let currentFilter = 'all';

    async function loadAndRender() {
        const entries = await getAllEntries(); // от db.js
        render(entries);
    }

    function render(entries) {
        list.innerHTML = '';

        let fullTotal   = 0;
        let fullSavings = 0;
        const symbol = currencySymbols[currency];

        entries.forEach(e => {
            if (e.type === 'expense')   fullTotal   -= e.amount;
            else if (e.type === 'income')  fullTotal   += e.amount;
            else if (e.type === 'saving')  fullSavings += e.amount;
        });

        totalEl.textContent   = `${fullTotal.toFixed(2)} ${symbol}`;
        savingsEl.textContent = `${fullSavings.toFixed(2)} ${symbol}`;

        entries
            .filter(e => currentFilter === 'all' || e.type === currentFilter)
            .forEach(e => {
                const date = new Date(e.date).toLocaleDateString('bg-BG');
                const li = document.createElement('li');
                li.className = `entry-item ${e.type}`;
                li.innerHTML = `
          <span class="date">${date}</span>
          <span class="amount">
            ${e.type === 'expense' ? '−' : '+'}${e.amount.toFixed(2)} ${symbol}
          </span>
          <span class="category">${e.category}</span>
          <button data-id="${e.id}" class="del-btn">🗑️</button>
        `;
                list.append(li);
            });
    }

    addBtn.addEventListener('click', async () => {
        const amt  = parseFloat(amtInput.value);
        const cat  = catInput.value.trim();
        const type = typeSelect.value;

        if (isNaN(amt) || !cat) return;

        const now = new Date().toISOString();

        await addEntry({
            amount:   Math.abs(amt),
            category: cat,
            type:     type,
            date:     now
        });

        amtInput.value = '';
        catInput.value = '';
        loadAndRender();
    });

    list.addEventListener('click', async e => {
        if (e.target.matches('.del-btn')) {
            const id = Number(e.target.dataset.id);
            await deleteEntry(id);
            loadAndRender();
        }
    });

    filters.forEach(btn =>
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadAndRender();
        })
    );

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    if (window.Worker) {
        const syncWorker = new Worker('sync-worker.js');
        window.addEventListener('online', () => syncWorker.postMessage('sync'));
    }

    loadAndRender();
});
