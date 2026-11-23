// Marca la sección activa durante el scroll y al navegar por anclas.
(function () {
  function initNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav__list a[href^="#"]'));
    var pairs = links.map(function (link) {
      return { link: link, section: document.getElementById(link.getAttribute('href').slice(1)) };
    }).filter(function (pair) { return Boolean(pair.section); });
    if (!pairs.length) return;

    function update() {
      var offset = Math.max(120, Math.min(window.innerHeight * 0.35, 260));
      var current = pairs[0].section.id;
      pairs.forEach(function (pair) {
        if (pair.section.getBoundingClientRect().top <= offset) current = pair.section.id;
      });
      // Al llegar al final de la página, seleccionar la última sección.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = pairs[pairs.length - 1].section.id;
      }
      pairs.forEach(function (pair) {
        if (pair.section.id === current) pair.link.setAttribute('aria-current', 'location');
        else pair.link.removeAttribute('aria-current');
      });
    }

    var scheduled = false;
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () { scheduled = false; update(); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    update();
  }
  window.initNav = initNav;
})();
