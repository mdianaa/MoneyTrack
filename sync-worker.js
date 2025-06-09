self.addEventListener('message', e => {
    if (e.data === 'sync') {
        console.log('Sync expenses with server...');
        // Тук можеш да добавиш логика за изпращане и получаване на данни от бекенда
    }
});
