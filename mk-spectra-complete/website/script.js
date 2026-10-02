/* =====================================================
   MK SPECTRA — site settings (EDIT THESE)
   ===================================================== */
var SITE = {
  // Contact form: create a free form at https://formspree.io and paste its ID (the part after /f/)
  FORMSPREE_ID: "YOUR_FORM_ID",
  // WhatsApp: country code + number, digits only (India example: 919876543210)
  WHATSAPP_NUMBER: "91XXXXXXXXXX",
  WHATSAPP_MESSAGE: "Hi, I'd like to know more about your services.",
  // Google Analytics 4 measurement ID, e.g. "G-ABC123XYZ9". Leave as is to keep analytics off.
  GA_ID: "G-XXXXXXXXXX",
  // Map on the Contact page: your business address or place name, e.g. "Anna Nagar, Chennai, Tamil Nadu, India"
  MAP_QUERY: "Srivilliputhur, Tamil Nadu, India"
};

/* ---------- Google Analytics (loads only when GA_ID is set AND the visitor accepts cookies) ---------- */
var GA_ON=!!(SITE.GA_ID && !/X{6,}/.test(SITE.GA_ID));
function loadGA(){
  if(!GA_ON||window.__gaLoaded)return;window.__gaLoaded=true;
  var s=document.createElement('script');s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(SITE.GA_ID);
  document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  gtag('js',new Date());gtag('config',SITE.GA_ID);
}

(function(){
  /* ---------- header / mobile menu ---------- */
  var header=document.getElementById('siteHeader'),
      toggle=document.getElementById('menuToggle'),
      links=document.querySelectorAll('#siteNav a');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  toggle.addEventListener('click',function(){
    var open=header.classList.toggle('open');
    toggle.setAttribute('aria-expanded',open);
    toggle.textContent=open?'\u2715':'\u2630';
  });
  links.forEach(function(a){a.addEventListener('click',function(){
    header.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='\u2630';
  });});

  /* ---------- reveal on scroll ---------- */
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  }else{els.forEach(function(el){el.classList.add('in');});}

  /* ---------- active nav link (in-page anchors) ---------- */
  var map={};links.forEach(function(a){var h=a.getAttribute('href');if(h&&h.charAt(0)==='#')map[h]=a;});
  var secs=Object.keys(map).map(function(h){return document.getElementById(h.slice(1));}).filter(Boolean);
  if(secs.length && 'IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.remove('active');});
        var a=map['#'+e.target.id];if(a)a.classList.add('active');}
    });},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){so.observe(s);});
  }

  /* ---------- WhatsApp floating button ---------- */
  var wa=document.createElement('a');
  wa.className='wa-btn';wa.target='_blank';wa.rel='noopener';
  wa.setAttribute('aria-label','Chat with us on WhatsApp');
  wa.href='https://wa.me/'+SITE.WHATSAPP_NUMBER+'?text='+encodeURIComponent(SITE.WHATSAPP_MESSAGE);
  wa.innerHTML='<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.02 3C9.38 3 4 8.38 4 15.02c0 2.12.55 4.19 1.6 6.02L4 29l8.13-1.57a12 12 0 0 0 3.89.65C22.66 28.08 28 22.7 28 16.06 28 9.4 22.66 3 16.02 3zm0 22.06c-1.2 0-2.38-.32-3.4-.93l-.24-.15-4.83.93.95-4.7-.16-.25a9.02 9.02 0 0 1-1.4-4.84c0-4.98 4.06-9.03 9.05-9.03 4.98 0 9.03 4.05 9.03 9.03 0 4.99-4.05 9.94-9 9.94zm4.96-6.77c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.64 1.11 2.82c.14.18 1.92 2.94 4.66 4.12.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.29.23-.63.23-1.17.16-1.29-.07-.11-.25-.18-.52-.32z"/></svg>';
  document.body.appendChild(wa);


  /* ---------- cookie consent (shown only when Google Analytics is configured) ---------- */
  function getC(){try{return localStorage.getItem('mk_cookie');}catch(e){return null;}}
  function setC(v){try{localStorage.setItem('mk_cookie',v);}catch(e){}}
  if(GA_ON){
    var cv=getC();
    if(cv==='yes'){loadGA();}
    else if(cv===null){
      var cb=document.createElement('div');cb.className='cookie';cb.setAttribute('role','dialog');cb.setAttribute('aria-label','Cookie notice');
      cb.innerHTML='<p>We use cookies to understand how visitors use our site. See our <a href="privacy.html">Privacy Policy</a>.</p><div class="row"><button class="yes" type="button">Accept</button><button class="no" type="button">Decline</button></div>';
      document.body.appendChild(cb);
      cb.querySelector('.yes').onclick=function(){setC('yes');loadGA();cb.remove();};
      cb.querySelector('.no').onclick=function(){setC('no');cb.remove();};
    }
  }

  /* ---------- back to top ---------- */
  var tt=document.createElement('button');
  tt.className='to-top';tt.type='button';tt.setAttribute('aria-label','Back to top');tt.innerHTML='&#8593;';
  document.body.appendChild(tt);
  tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  window.addEventListener('scroll',function(){tt.classList.toggle('show',window.scrollY>700);},{passive:true});

  /* ---------- portfolio filter ---------- */
  var fbtns=document.querySelectorAll('.fbtn');
  if(fbtns.length){
    fbtns.forEach(function(bt){bt.addEventListener('click',function(){
      var f=bt.getAttribute('data-f');
      fbtns.forEach(function(x){x.classList.toggle('active',x===bt);x.setAttribute('aria-pressed',x===bt);});
      document.querySelectorAll('#portGrid .port-card').forEach(function(c){c.hidden=!(f==='all'||c.getAttribute('data-cat')===f);});
    });});
  }

  /* ---------- image lightbox ---------- */
  var shots=document.querySelectorAll('.thumb img.shot');
  if(shots.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Project image');
    lb.innerHTML='<button class="x" type="button" aria-label="Close">&#10005;</button><button class="pv" type="button" aria-label="Previous">&#8249;</button><img alt=""><div class="cap"></div><button class="nx" type="button" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);
    var lbImg=lb.querySelector('img'),lbCap=lb.querySelector('.cap'),cur=0,list=[],lastFocus=null;
    function vis(){return Array.prototype.filter.call(shots,function(i){var c=i.closest('.port-card');return i.isConnected&&!(c&&c.hidden);});}
    function show(n){cur=(n+list.length)%list.length;var im=list[cur];lbImg.src=im.currentSrc||im.src;lbImg.alt=im.alt;
      var h=im.closest('.port-card');lbCap.textContent=h&&h.querySelector('h3')?h.querySelector('h3').textContent:'';
      var multi=list.length>1;lb.querySelector('.pv').style.display=lb.querySelector('.nx').style.display=multi?'':'none';}
    function openLb(im){list=vis();lastFocus=document.activeElement;show(list.indexOf(im));lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('.x').focus();}
    function closeLb(){lb.classList.remove('open');document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
    shots.forEach(function(im){im.addEventListener('click',function(){openLb(im);});});
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    lb.querySelector('.x').onclick=closeLb;lb.querySelector('.pv').onclick=function(){show(cur-1);};lb.querySelector('.nx').onclick=function(){show(cur+1);};
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')closeLb();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1);});
  }

  /* ---------- contact page map ---------- */
  var mapBox=document.querySelector('.map-box');
  if(mapBox && SITE.MAP_QUERY){
    var f=document.createElement('iframe');
    f.src='https://www.google.com/maps?q='+encodeURIComponent(SITE.MAP_QUERY)+'&output=embed';
    f.title='Our location on Google Maps';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';
    f.setAttribute('allowfullscreen','');
    mapBox.innerHTML='';mapBox.appendChild(f);
  }

  /* ---------- contact form ---------- */
  var form=document.getElementById('contactForm');
  if(form){
    var status=document.getElementById('formStatus'),btn=form.querySelector('.submit');
    function setStatus(cls,msg){status.className='form-status '+cls;status.textContent=msg;}
    function validate(){
      var ok=true;
      form.querySelectorAll('.field').forEach(function(f){
        var i=f.querySelector('input,select,textarea');if(!i||!i.hasAttribute('required'))return;
        var bad=!i.value.trim()||(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim()));
        f.classList.toggle('invalid',bad);if(bad)ok=false;
      });
      return ok;
    }
    form.addEventListener('input',function(e){var f=e.target.closest('.field');if(f)f.classList.remove('invalid');});
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(form.querySelector('.hp input').value)return;      // spam trap
      if(!validate()){setStatus('bad','Please fill in the highlighted fields.');return;}
      if(!SITE.FORMSPREE_ID||SITE.FORMSPREE_ID==='YOUR_FORM_ID'){
        console.warn('Contact form: set FORMSPREE_ID in script.js');
        setStatus('bad','The form is not connected yet. Please reach us on WhatsApp or by email.');return;
      }
      btn.disabled=true;btn.textContent='Sending\u2026';status.className='form-status';
      fetch('https://formspree.io/f/'+SITE.FORMSPREE_ID,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
        .then(function(r){
          if(r.ok){form.reset();setStatus('ok','Thank you! Your message has been sent. We will get back to you soon.');
            if(window.gtag)gtag('event','generate_lead',{method:'contact_form'});}
          else{throw new Error('bad status');}
        })
        .catch(function(){setStatus('bad','Something went wrong. Please try again, or message us on WhatsApp.');})
        .finally(function(){btn.disabled=false;btn.textContent='Send message';});
    });
  }
})();
