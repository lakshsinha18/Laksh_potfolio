(function () {
  /* Isobar-style contour lines behind the hero */
  var canvas = document.getElementById('isobars');
  var ctx = canvas.getContext('2d');
  function draw() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0b6e7f';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    var lines = 26;
    for (var i = 0; i < lines; i++) {
      var t = i / (lines - 1);
      var base = h * (0.08 + t * 0.92);
      ctx.globalAlpha = 0.07 + 0.2 * Math.sin(t * Math.PI) * (i % 5 === 0 ? 1.4 : 0.8);
      ctx.beginPath();
      for (var x = 0; x <= w; x += 6) {
        var u = x / w;
        var y = base
          + Math.sin(u * 5.2 + t * 4.1) * 16
          + Math.sin(u * 11.5 - t * 6.3) * 6
          + Math.sin(u * 2.1 + t * 1.7) * 26 * (1 - t * 0.5);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  draw();
  window.addEventListener('resize', draw);
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  } catch (e) {}
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* Copy buttons */
  function selectText(el) {
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }
  var buttons = document.querySelectorAll('.copy');
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-target'));
      var text = el.textContent.trim();
      function done(msg) {
        var old = btn.textContent;
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = old; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { selectText(el); done('Selected'); });
      } else {
        selectText(el);
        done('Selected');
      }
    });
  });
})();
