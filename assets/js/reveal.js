// Animación de aparición al hacer scroll sobre los elementos .reveal.
// Respeta prefers-reduced-motion: si el usuario lo pide, se muestra
// todo directamente, sin animar (accesibilidad — principio II).
(function () {
  function initReveal() {
    // Los contadores se animan una sola vez, sin alterar el valor final.
    var counters = document.querySelectorAll('.project-card__metrics strong[data-count]');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function animateCounter(el) {
      if (el.dataset.counted === 'true') return;
      el.dataset.counted = 'true';
      var end = Number(el.dataset.count);
      if (!Number.isFinite(end) || reduceMotion) { el.textContent = String(end); return; }
      var start = null;
      var duration = 800;
      function frame(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(end * eased));
        if (progress < 1) window.requestAnimationFrame(frame);
        else el.textContent = String(end);
      }
      window.requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window && !reduceMotion) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }

    var targets = document.querySelectorAll('.reveal');
    if (targets.length === 0) return;

    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('reveal--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  window.initReveal = initReveal;
})();
