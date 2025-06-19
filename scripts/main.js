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

document.addEventListener('mousemove', e => {
    trail.style.top = `${e.clientY}px`;
    trail.style.left = `${e.clientX}px`;
})