const intro = document.querySelector('.intro-text');
if (intro) {
    let text = intro.textContent;
    intro.textContent = '';
    let i = 0;
    const type = () => {
        if (i < text.length) {
        intro.textContent += text[i];
        i++;
        setTimeout(type, 100);
        }
    };
    type();
}

const lyrics = document.querySelectorAll('.lyric-text');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const lyric = entry.target;
            const text = lyric.dataset.lyric;
            lyric.textContent = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    lyric.textContent += text[i];
                    i++;
                    setTimeout(type, 100);
                }
            };
            type();
            observer.unobserve(lyric); // only animate once
        }
    });
}, {
    threshold: 0.5
});

lyrics.forEach(lyric => {
    lyric.dataset.lyric = lyric.textContent;
    observer.observe(lyric);
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
  currentX += (mouseX - currentX) * 0.15;
  currentY += (mouseY - currentY) * 0.15;

  trail.style.left = `${currentX}px`;
  trail.style.top = `${currentY}px`;

  requestAnimationFrame(animateTrail);
}
animateTrail();