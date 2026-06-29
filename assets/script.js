
(() => {
  const body = document.body;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  window.addEventListener('load', () => setTimeout(() => body.classList.add('loaded'), 450));
  setTimeout(() => body.classList.add('loaded'), 1600);

  const topbar = $('[data-topbar]');
  const onScroll = () => topbar && topbar.classList.toggle('scrolled', scrollY > 18);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  const page = body.dataset.page;
  $$('[data-page]').forEach(a => { if(a.dataset.page === page) a.classList.add('active'); });

  const burger = $('.burger'), nav = $('[data-nav]');
  burger?.addEventListener('click', () => { burger.classList.toggle('open'); nav.classList.toggle('open'); });
  nav?.addEventListener('click', e => { if(e.target.tagName === 'A'){burger?.classList.remove('open'); nav.classList.remove('open');} });

  const savedTheme = localStorage.getItem('sabbia-theme');
  if(savedTheme) document.documentElement.dataset.theme = savedTheme;
  $('.theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? '' : 'dark';
    if(next) document.documentElement.dataset.theme = next; else delete document.documentElement.dataset.theme;
    localStorage.setItem('sabbia-theme', next);
  });

  const reveal = $$('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target); }
    }), {threshold:.14, rootMargin:'0px 0px -40px 0px'});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add('in-view'));

  // Button ripple
  $$('.btn, .filters button, .theme-toggle').forEach(el => el.addEventListener('click', ev => {
    const r = document.createElement('span'); r.className = 'ripple';
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + 'px';
    r.style.left = (ev.clientX - rect.left - size/2) + 'px';
    r.style.top = (ev.clientY - rect.top - size/2) + 'px';
    el.appendChild(r); setTimeout(() => r.remove(), 600);
  }));

  // Smooth page fade for internal links
  $$('a[href$=".html"]').forEach(a => a.addEventListener('click', e => {
    if(e.metaKey || e.ctrlKey || a.target === '_blank') return;
    const href = a.getAttribute('href'); if(!href || href.startsWith('#')) return;
    e.preventDefault(); body.classList.add('page-leave'); setTimeout(() => location.href = href, 230);
  }));

  // Menu filters
  const filters = $('[data-filters]');
  if(filters){
    filters.addEventListener('click', e => {
      const btn = e.target.closest('button[data-filter]'); if(!btn) return;
      $$('button', filters).forEach(b => b.classList.remove('active')); btn.classList.add('active');
      const f = btn.dataset.filter;
      $$('[data-category]').forEach(card => {
        const show = f === 'all' || card.dataset.category === f;
        card.classList.toggle('hide', !show);
        if(show){ card.classList.remove('in-view'); setTimeout(() => card.classList.add('in-view'), 20); }
      });
    });
  }

  // Locations map switching
  const places = $('[data-places]');
  const frame = $('[data-map-frame]');
  if(places && frame){
    const cards = $$('.place-card', places);
    cards[0]?.classList.add('active');
    cards.forEach(card => card.addEventListener('click', e => {
      if(e.target.closest('a')) return;
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      frame.src = card.dataset.map;
    }));
  }

  // Gallery lightbox
  const lb = $('[data-lightbox]');
  if(lb){
    const img = $('img', lb); const close = $('button', lb);
    $$('[data-img]').forEach(item => item.addEventListener('click', () => { img.src = item.dataset.img; lb.classList.add('open'); }));
    const hide = () => lb.classList.remove('open');
    close.addEventListener('click', hide); lb.addEventListener('click', e => { if(e.target === lb) hide(); });
    addEventListener('keydown', e => { if(e.key === 'Escape') hide(); });
  }

  // Custom cursor
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  if(dot && ring && matchMedia('(pointer:fine)').matches){
    let x=0,y=0,rx=0,ry=0;
    addEventListener('mousemove', e => { x=e.clientX; y=e.clientY; dot.style.transform=`translate(${x-3.5}px,${y-3.5}px)`; }, {passive:true});
    function raf(){ rx += (x-rx)*.18; ry += (y-ry)*.18; ring.style.transform=`translate(${rx-17}px,${ry-17}px)`; requestAnimationFrame(raf); } raf();
    $$('a,button,.place-card').forEach(el => { el.addEventListener('mouseenter',()=>ring.classList.add('hover')); el.addEventListener('mouseleave',()=>ring.classList.remove('hover')); });
  }

  // Sand particles, low count to keep site fast
  const layer = $('.sand-layer');
  if(layer && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(let i=0;i<34;i++){
      const d = document.createElement('span'); d.className = 'sand-dot';
      d.style.setProperty('--x', Math.random()*100 + 'vw');
      d.style.setProperty('--dx', (Math.random()*120-60) + 'px');
      d.style.setProperty('--dur', (9+Math.random()*12) + 's');
      d.style.animationDelay = (-Math.random()*18) + 's';
      layer.appendChild(d);
    }
  }
})();
