document.addEventListener('DOMContentLoaded', () => {
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
});

// audio + lyrics
document.querySelectorAll('section.track').forEach(section => {
    const audio = section.querySelector('audio');
    const lyrics = section.querySelectorAll('.lyrics p');
  
    if (!audio || lyrics.length === 0) return;
  
    // ⏱ Loop through each lyric and trigger clip manually
    lyrics.forEach(line => {
      line.addEventListener('click', () => {
        const start = parseFloat(line.dataset.start);
        const end = parseFloat(line.dataset.end);
        
        // Reset & play audio segment
        audio.currentTime = start;
        audio.play();
  
        // Pause at the right moment
        const stopAt = () => {
          if (audio.currentTime >= end) {
            audio.pause();
            audio.removeEventListener('timeupdate', stopAt);
          }
        };
        audio.addEventListener('timeupdate', stopAt);
  
        // Trigger typing animation
        if (!line.classList.contains('active')) {
          line.classList.add('active');
          const fullText = line.textContent;
          line.textContent = '';
          let i = 0;
  
          const type = () => {
            if (i < fullText.length) {
              line.textContent += fullText[i];
              i++;
              setTimeout(type, 35);
            }
          };
          type();
        }
      });
    });
  });

// red cursor
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