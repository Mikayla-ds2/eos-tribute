document.addEventListener('DOMContentLoaded', () => {
  // Intro typing animation
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

  // Audio + lyric sync on click
  document.addEventListener('DOMContentLoaded', () => {
  const tracksNav = document.getElementById('tracks-nav');
  if (tracksNav) {
    tracksNav.addEventListener('click', () => {
      // Try to unlock autoplay before navigating
      document.querySelectorAll('audio').forEach(audio => {
        audio.volume = 0;
        audio.play().then(() => {
          audio.pause();
          audio.volume = 1; // Reset volume after unlocking
        }).catch(err => {
          console.warn('Autoplay failed to unlock:', err);
        });
      });
    });
  }
  
});
  document.querySelectorAll('section.track').forEach(section => {
    const audio = section.querySelector('audio');
    const lyrics = section.querySelectorAll('.lyrics p');
    if (!audio || lyrics.length === 0) return;

    lyrics.forEach(line => {
      line.addEventListener('click', () => {
        const start = parseFloat(line.dataset.start);
        const end = parseFloat(line.dataset.end);

        // Reset other lyrics
        lyrics.forEach(l => {
          if (l !== line) {
            l.classList.remove('active');
            l.textContent = l.dataset.lyric;
          }
        });

        // Play clip
        audio.currentTime = start;
        audio.play();

        const stopAt = () => {
          if (audio.currentTime >= end) {
            audio.pause();
            audio.removeEventListener('timeupdate', stopAt);
          }
        };
        audio.addEventListener('timeupdate', stopAt);

        // Animate current lyric
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

  // Scroll-triggered section activation
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

        // Reset and play only the lyric portion
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

        // Only trigger once
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.5
  });

  // Attach observer to each track section
  document.querySelectorAll('section.track').forEach(section => {
    observer.observe(section);
  });

  // Cursor trail effect
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