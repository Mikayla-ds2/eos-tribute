document.addEventListener('DOMContentLoaded', () => {
  // 🔓 Improved autoplay unlock and first track start
  const startBtn = document.getElementById('start-audio');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Create a temporary silent audio element for unlock
      const tempAudio = new Audio();
      tempAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCTGH0fPTgjMGHm7A7+OZURE=';
      tempAudio.volume = 0;
      
      tempAudio.play().then(() => {
        console.log('Autoplay unlocked successfully');
        
        // Remove the gate overlay
        const gate = document.getElementById('audio-gate');
        if (gate) gate.remove();
        
        // Start the first track immediately
        startFirstTrack();
        
      }).catch(err => {
        console.warn('Autoplay unlock failed:', err);
        
        // Try alternative approach - just start the first track directly
        // The user click should be enough to enable audio
        const gate = document.getElementById('audio-gate');
        if (gate) gate.remove();
        
        // Give a small delay to let the page settle
        setTimeout(() => {
          startFirstTrack();
        }, 100);
      });
    });
  }

  // Function to start the first track
  function startFirstTrack() {
    const firstTrack = document.querySelector('section.track');
    if (!firstTrack) return;
    
    const audio = firstTrack.querySelector('audio');
    const lyric = firstTrack.querySelector('.lyrics p');
    
    if (!audio || !lyric) return;
    
    const start = parseFloat(lyric.dataset.start);
    const end = parseFloat(lyric.dataset.end);
    const fullText = lyric.dataset.lyric;

    // Ensure audio is loaded before playing
    const playWhenReady = () => {
      audio.currentTime = start;
      audio.play().then(() => {
        console.log('First track started playing');
        
        // Stop at the end time
        const stopAt = () => {
          if (audio.currentTime >= end) {
            audio.pause();
            audio.removeEventListener('timeupdate', stopAt);
          }
        };
        audio.addEventListener('timeupdate', stopAt);

        // Animate the lyrics - use data-lyric for typing
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
        
      }).catch(err => {
        console.warn('Failed to play first track:', err);
      });
    };

    // Check if audio is ready
    if (audio.readyState >= 2) {
      playWhenReady();
    } else {
      audio.addEventListener('canplay', playWhenReady, { once: true });
    }
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
        const fullText = line.dataset.lyric;

        // Reset other lines to their original text
        lyrics.forEach(l => {
          if (l !== line) {
            l.classList.remove('active');
            // Reset to original data-lyric text
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

        // Typing effect - use data-lyric attribute
        if (!line.classList.contains('active')) {
          line.classList.add('active');
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

        // Add this right before the typing animation in all three places
console.log('Raw data-lyric:', lyric.dataset.lyric);
console.log('Length:', lyric.dataset.lyric.length);
console.log('Character codes:', Array.from(lyric.dataset.lyric).map(c => c.charCodeAt(0)));

        // Typing animation - use data-lyric attribute
        lyric.classList.add('active');
        lyric.textContent = '';
        let i = 0;
        const type = () => {
          if (i < fullText.length) {
            lyric.textContent += fullText[i];
            i++;
            setTimeout(type, 100);
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
  if (trail) {
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
  }
});