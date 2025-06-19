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

const trail = document.querySelector('.trail');
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateTrail() {
  currentX += (mouseX - currentX) * 0.2;
  currentY += (mouseY - currentY) * 0.2;
  trail.style.left = `${currentX}px`;
  trail.style.top = `${currentY}px`;
  requestAnimationFrame(animateTrail);
}
animateTrail();