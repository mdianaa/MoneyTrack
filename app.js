document.addEventListener('DOMContentLoaded', () => {
    const amtInput = document.getElementById('amount-input');
    const catInput = document.getElementById('category-input');
    const typeSelect = document.getElementById('type-select');
    const currencySelect = document.getElementById('currency-select');
    const addBtn = document.getElementById('add-btn');
    const list = document.getElementById('entries-list');
    const filters = document.querySelectorAll('.filter-btn');
    const totalEl = document.getElementById('total-sum');

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
        const entries = await getAllEntries();
        render(entries);
    }

    function render(entries) {
        list.innerHTML = '';
        let total = 0;
        const symbol = currencySymbols[currency];

        entries
            .filter(e => currentFilter === 'all' || e.type === currentFilter)
            .forEach(e => {
                const li = document.createElement('li');
                li.className = `entry-item ${e.type}`;
                li.innerHTML = `
          <span class="amount">
            ${e.type === 'expense' ? '−' : '+'}${e.amount.toFixed(2)} ${symbol}
          </span>
          <span class="category">${e.category}</span>
          <button data-id="${e.id}" class="del-btn">🗑️</button>
        `;

                list.append(li);
                total += e.type === 'expense'
                    ? -e.amount
                    :  e.amount;
            });

        totalEl.textContent = `${total.toFixed(2)} ${symbol}`;
    }

    addBtn.addEventListener('click', async () => {
        const amt = parseFloat(amtInput.value);
        const cat = catInput.value.trim();
        const type= typeSelect.value;

        if (isNaN(amt) || !cat) return;

        await addEntry({
            amount:   Math.abs(amt),
            category: cat,
            type:     type,
            date:     Date.now()
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
