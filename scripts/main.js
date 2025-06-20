document.addEventListener('DOMContentLoaded', () => {
  // 🔓 Unlock autoplay when button is clicked
  const startBtn = document.getElementById('start-audio');
  const unlockAudio = document.getElementById('unlock-audio');

  if (startBtn && unlockAudio) {
    startBtn.addEventListener('click', () => {
      unlockAudio.volume = 0;
      unlockAudio.play().then(() => {
        unlockAudio.pause();
        unlockAudio.volume = 1;
        document.getElementById('audio-gate').remove();
      }).catch(err => {
        console.warn("Autoplay unlock failed:", err);
        alert("Please click again to enable sound.");
      });
    });
  }

  // 🖋 Intro typing animation (for homepage)
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

  // 🎧 Click-triggered lyric segments
  document.querySelectorAll('section.track').forEach(section => {
    const audio = section.querySelector('audio');
    const lyrics = section.querySelectorAll('.lyrics p');
    if (!audio || lyrics.length === 0) return;

    lyrics.forEach(line => {
      line.addEventListener('click', () => {
        const start = parseFloat(line.dataset.start);
        const end = parseFloat(line.dataset.end);

        // Reset other lines
        lyrics.forEach(l => {
          if (l !== line) {
            l.classList.remove('active');
            l.textContent = l.dataset.lyric;
          }
        });

        // Play this clip
        audio.currentTime = start;
        audio.play();

        const stopAt = () => {
          if (audio.currentTime >= end) {
            audio.pause();
            audio.removeEventListener('timeupdate', stopAt);
          }
        };
        audio.addEventListener('timeupdate', stopAt);

        // Typing effect
        if (!line.classList.contains('active')) {
          line.classList.add('active');
          const fullText = line.dataset.lyric;
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

  // 🔁 Scroll-activated lyric & audio
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const audio = section.querySelector('audio');
        const lyric = section.querySelector('.lyrics p');
        if (!audio || !lyric) return;

        const start = parseFloat(lyric.dataset.start);
        const end = parseFloat(lyric.dataset.end);
        const fullText = lyric.dataset.lyric;

        audio.currentTime = start;
        audio.play();

        const stopAt = () => {
          if (audio.currentTime >= end) {
            audio.pause();
            audio.removeEventListener('timeupdate', stopAt);
          }
        };
        audio.addEventListener('timeupdate', stopAt);

        // Typing animation
        lyric.classList.add('active');
        lyric.textContent = '';
        let i = 0;
        const type = () => {
          if (i < fullText.length) {
            lyric.textContent += fullText[i];
            i++;
            setTimeout(type, 35);
          }
        };
        type();

        observer.unobserve(section); // only once
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('section.track').forEach(section => {
    observer.observe(section);
  });

  // ✨ Red cursor trail
  const trail = document.querySelector('.trail');
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

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
});