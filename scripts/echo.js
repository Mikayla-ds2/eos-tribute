document.getElementById('echoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('echoInput');
    const text = input.value.trim();

    if (text) {
        const feed = document.getElementById('echoFeed');
        const entry = document.createElement('div');
        entry.className = 'echo';
        entry.innerText = `"${text}"\n- Left at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
        feed.prepend(entry);

        // Save to local storage
        const echoes = JSON.parse(localStorage.getItem('echoes') || '[]');
        echoes.unshift(text)
        localStorage.setItem('echoes', JSON.stringify(echoes));

        input.value = '';
    }
});