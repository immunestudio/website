(function(){
  var dds = document.querySelectorAll('.dd');
  function closeAll(){ dds.forEach(function(d){ d.classList.remove('open'); d.querySelector('.ddbtn').setAttribute('aria-expanded', 'false'); }); }
  dds.forEach(function(d){
    d.querySelector('.ddbtn').addEventListener('click', function(e){
      e.stopPropagation(); var o = !d.classList.contains('open'); closeAll();
      if (o) { d.classList.add('open'); this.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', closeAll);
  addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(); });
  var nav = document.querySelector('.nav'), last = scrollY;
  if (nav) addEventListener('scroll', function(){
    var y = scrollY, open = nav.querySelector('.dd.open');
    if (y > last + 6 && y > 90 && !open) nav.classList.add('hide');
    else if (y < last - 6 || y < 60) nav.classList.remove('hide');
    nav.classList.toggle('solid', y > 40); last = y;
  }, {passive: true});

  // glass indicator showing which section is currently in view
  var pill = document.querySelector('.pill');
  if (pill) {
    var ind = document.createElement('span'); ind.className = 'ind'; ind.setAttribute('aria-hidden', 'true'); pill.insertBefore(ind, pill.firstChild);
    var links = [].slice.call(pill.querySelectorAll('a:not(.btn):not(.brand)')).filter(function(a){ return !a.closest('.ddm'); });
    var more = pill.querySelector('.ddbtn');
    function place(el){
      [].forEach.call(pill.querySelectorAll('.on'), function(x){ x.classList.remove('on'); });
      if (!el) { ind.style.opacity = 0; return; }
      el.classList.add('on');
      var pr = pill.getBoundingClientRect(), er = el.getBoundingClientRect();
      ind.style.width = er.width + 'px'; ind.style.transform = 'translateX(' + (er.left - pr.left - pill.clientLeft) + 'px)'; ind.style.opacity = 1;
    }
    function find(sec){
      if (sec === 'contact') return more;
      for (var i = 0; i < links.length; i++) { var h = links[i].getAttribute('href') || ''; if (h.slice(h.indexOf('#') + 1) === sec && h.indexOf('#') > -1) return links[i]; }
      return null;
    }
    var path = location.pathname;
    function sync(){
      if (/blogs|team/.test(path)) { place(more); var cur = pill.querySelector('.ddin a[href*="' + (/blogs/.test(path) ? 'blogs' : 'team') + '"]'); if (cur) cur.classList.add('on'); return; }
      place(find(document.documentElement.getAttribute('data-sec')));
    }
    new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['data-sec']});
    addEventListener('resize', sync); addEventListener('load', sync); sync();
  }
})();
