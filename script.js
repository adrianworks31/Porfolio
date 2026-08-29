
document.addEventListener('DOMContentLoaded', () => {
  const topbarStatus = document.getElementById('topbarStatus');
  const railFill = document.getElementById('railFill');
  const traceBarFill = document.getElementById('traceBarFill');
  const railLinks = Array.from(document.querySelectorAll('.rail__nodes a'));
  const sections = Array.from(document.querySelectorAll('.section'));

  // --- 1. Boot sequence message ---
  setTimeout(() => {
    if (topbarStatus) topbarStatus.textContent = 'SYSTEM: ONLINE';
  }, 900);

  // --- 2 & 3. Scroll progress + active section ---
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    if (railFill) railFill.style.height = (progress * 100) + '%';
    if (traceBarFill) traceBarFill.style.width = (progress * 100) + '%';

    // Determine active section (the one closest to viewport center-top)
    let activeId = sections[0] ? sections[0].id : null;
    const triggerLine = window.innerHeight * 0.35;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerLine) {
        activeId = section.id;
      }
    }

    railLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + activeId;
      link.classList.toggle('is-active', isActive);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- 4. Reveal sections as they enter the viewport ---
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => {
      if (section.id !== 'hero') observer.observe(section);
      else section.classList.add('is-visible');
    });
  } else {
    // Fallback: just show everything
    sections.forEach((section) => section.classList.add('is-visible'));
  }
});
