;(function(){
'use strict';

/* ═══════════ SOUND ENGINE ═══════════ */
class SoundEngine {
  constructor(){ this.ctx=null; this.on=true; this.ready=false; }
  init(){
    if(this.ready) return;
    try{ this.ctx=new(window.AudioContext||window.webkitAudioContext)(); this.ready=true; }
    catch(e){ this.on=false; }
  }
  play(t){
    if(!this.on||!this.ctx) return;
    if(this.ctx.state==='suspended') this.ctx.resume();
    this['_'+t]&&this['_'+t]();
  }
  _osc(type,f1,f2,dur,vol){
    const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(f1,t);
    if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur*.7);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur);
  }
  _primary(){ this._osc('sine',600,200,.14,.22); }
  _secondary(){
    const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type='triangle'; o.frequency.setValueAtTime(500,t);
    o.frequency.exponentialRampToValueAtTime(900,t+.08);
    o.frequency.exponentialRampToValueAtTime(700,t+.12);
    g.gain.setValueAtTime(.18,t); g.gain.exponentialRampToValueAtTime(.001,t+.13);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t+.13);
  }
  _nav(){ this._osc('sine',1200,800,.04,.08); }
  _social(){
    const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type='sine'; o.frequency.setValueAtTime(400,t);
    o.frequency.exponentialRampToValueAtTime(800,t+.06);
    o.frequency.exponentialRampToValueAtTime(600,t+.1);
    g.gain.setValueAtTime(.13,t); g.gain.exponentialRampToValueAtTime(.001,t+.11);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t+.11);
  }
  _skill(){ this._osc('sine',700,500,.04,.07); }
  _card(){ this._osc('triangle',800,600,.05,.05); }
  _project(){
    const c=this.ctx,t=c.currentTime,len=c.sampleRate*.18;
    const buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);
    const n=c.createBufferSource(); n.buffer=buf;
    const f=c.createBiquadFilter(); f.type='bandpass'; f.Q.value=2;
    f.frequency.setValueAtTime(1000,t); f.frequency.exponentialRampToValueAtTime(3000,t+.09);
    f.frequency.exponentialRampToValueAtTime(500,t+.18);
    const g=c.createGain(); g.gain.setValueAtTime(.07,t); g.gain.exponentialRampToValueAtTime(.001,t+.18);
    n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t+.18);
  }
  _toggle(){ this._osc('square',600,600,.035,.05); }
  _success(){
    const c=this.ctx,t=c.currentTime;
    [523.25,659.25,783.99].forEach((fr,i)=>{
      const o=c.createOscillator(),g=c.createGain();
      o.type='sine'; o.frequency.setValueAtTime(fr,t+i*.1);
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.13,t+i*.1+.02);
      g.gain.exponentialRampToValueAtTime(.001,t+i*.1+.28);
      o.connect(g).connect(c.destination); o.start(t+i*.1); o.stop(t+i*.1+.28);
    });
  }
  toggle(){ this.on=!this.on; return this.on; }
}
const snd=new SoundEngine();

/* ═══════════ DOM READY ═══════════ */
document.addEventListener('DOMContentLoaded',()=>{
  loader(); cursor(); header(); scrollAnim(); counters();
  magnetic(); soundToggle(); soundTriggers(); progress(); btt(); ripples(); form(); bentoTilt();
});

/* ═══════════ LOADER ═══════════ */
function loader(){
  const el=document.getElementById('loader');
  const pct=document.getElementById('loaderPercent');
  let v=0;
  const iv=setInterval(()=>{
    v+=Math.random()*12+2;
    if(v>100) v=100;
    pct.textContent=Math.floor(v);
    if(v>=100){
      clearInterval(iv);
      setTimeout(()=>{
        el.classList.add('done');
        setTimeout(()=>{ el.style.display='none'; triggerHero(); },800);
      },400);
    }
  },60);
  setTimeout(()=>{ v=100; },4000); // safety
}

function triggerHero(){
  document.querySelectorAll('.hero .anim').forEach((el,i)=>{
    const d=parseInt(el.dataset.delay||0);
    setTimeout(()=>el.classList.add('in'),d);
  });
}

/* ═══════════ CURSOR ═══════════ */
function cursor(){
  const dot=document.getElementById('cur'),ring=document.getElementById('curFollow');
  if(!dot||!ring||'ontouchstart' in window){
    if(dot) dot.style.display='none';
    if(ring) ring.style.display='none';
    return;
  }
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  (function loop(){
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  // hover states
  document.addEventListener('mouseover',e=>{
    if(e.target.closest('a,button,[data-sound],.sk-tags span')){
      dot.classList.add('cur--hover'); ring.classList.add('cur-follow--hover');
    }
  });
  document.addEventListener('mouseout',e=>{
    if(e.target.closest('a,button,[data-sound],.sk-tags span')){
      dot.classList.remove('cur--hover'); ring.classList.remove('cur-follow--hover');
    }
  });
}

/* ═══════════ HEADER ═══════════ */
function header(){
  const hdr=document.getElementById('header');
  const burger=document.getElementById('burger');
  const mob=document.getElementById('mobNav');
  const links=mob.querySelectorAll('.mob-link');

  window.addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>60),{passive:true});

  burger.addEventListener('click',()=>{
    burger.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow=mob.classList.contains('open')?'hidden':'';
  });
  links.forEach(l=>l.addEventListener('click',()=>{
    burger.classList.remove('open'); mob.classList.remove('open');
    document.body.style.overflow='';
  }));

  // active nav
  const secs=document.querySelectorAll('section[id]');
  const navAs=document.querySelectorAll('.nav-a:not(.nav-a--cta)');
  window.addEventListener('scroll',()=>{
    const y=scrollY+250;
    secs.forEach(s=>{
      const t=s.offsetTop,h=s.offsetHeight,id=s.id;
      const a=[...navAs].find(a=>a.getAttribute('href')==='#'+id);
      if(a) a.classList.toggle('active',y>=t&&y<t+h);
    });
  },{passive:true});
}

/* ═══════════ SCROLL ANIMATIONS ═══════════ */
function scrollAnim(){
  const els=document.querySelectorAll('.anim');
  const ob=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target;
        if(el.closest('.hero')) return; // hero handled separately
        const d=parseInt(el.dataset.delay||0);
        setTimeout(()=>el.classList.add('in'),d);
        ob.unobserve(el);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>ob.observe(el));
}

/* ═══════════ COUNTERS ═══════════ */
function counters(){
  const els=document.querySelectorAll('.counter');
  const ob=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ animC(e.target); ob.unobserve(e.target); }
    });
  },{threshold:.5});
  els.forEach(c=>ob.observe(c));
}
function animC(el){
  const target=+el.dataset.target,dur=1800,start=performance.now();
  (function tick(now){
    const p=Math.min((now-start)/dur,1);
    const ease=1-Math.pow(1-p,3);
    el.textContent=Math.floor(target*ease);
    if(p<1) requestAnimationFrame(tick);
    else el.textContent=target;
  })(start);
}

/* ═══════════ MAGNETIC ═══════════ */
function magnetic(){
  document.querySelectorAll('.magnetic').forEach(b=>{
    b.addEventListener('mousemove',e=>{
      const r=b.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      b.style.transform=`translate(${x*.18}px,${y*.18}px)`;
    });
    b.addEventListener('mouseleave',()=>{ b.style.transform=''; });
  });
}

/* ═══════════ SOUND TOGGLE ═══════════ */
function soundToggle(){
  const btn=document.getElementById('sndToggle');
  const on=btn.querySelector('.snd-on'),off=btn.querySelector('.snd-off');
  btn.addEventListener('click',()=>{
    snd.init();
    const enabled=snd.toggle();
    on.style.display=enabled?'block':'none';
    off.style.display=enabled?'none':'block';
    if(enabled) snd.play('toggle');
  });
}

/* ═══════════ SOUND TRIGGERS ═══════════ */
function soundTriggers(){
  document.addEventListener('click',function first(){ snd.init(); document.removeEventListener('click',first); },{once:true});
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-sound]');
    if(el){ snd.init(); snd.play(el.dataset.sound); }
  });
}

/* ═══════════ PROGRESS BAR ═══════════ */
function progress(){
  const bar=document.getElementById('progressBar');
  window.addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?scrollY/h*100:0)+'%';
  },{passive:true});
}

/* ═══════════ BACK TO TOP ═══════════ */
function btt(){
  const btn=document.getElementById('btt');
  window.addEventListener('scroll',()=>btn.classList.toggle('show',scrollY>500),{passive:true});
  btn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
}

/* ═══════════ RIPPLES ═══════════ */
function ripples(){
  document.querySelectorAll('.btn-fill,.btn-outline').forEach(b=>{
    b.addEventListener('click',function(e){
      const r=document.createElement('span'); r.classList.add('btn-ripple');
      const rect=this.getBoundingClientRect();
      const sz=Math.max(rect.width,rect.height);
      r.style.width=r.style.height=sz+'px';
      r.style.left=(e.clientX-rect.left-sz/2)+'px';
      r.style.top=(e.clientY-rect.top-sz/2)+'px';
      this.appendChild(r); setTimeout(()=>r.remove(),550);
    });
  });
}

/* ═══════════ CONTACT FORM ═══════════ */

/* ═══════════ BENTO TILT ═══════════ */
function bentoTilt(){
  if('ontouchstart' in window) return;
  document.querySelectorAll('.bento-cell').forEach(cell=>{
    cell.addEventListener('mousemove',e=>{
      const r=cell.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      cell.style.transform=`perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
      // move glow to cursor position
      const glow=cell.querySelector('.bento-glow');
      if(glow){
        glow.style.opacity='1';
        glow.style.background=`radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, rgba(240,40,60,.1) 0%, transparent 55%)`;
      }
    });
    cell.addEventListener('mouseleave',()=>{
      cell.style.transform='';
      const glow=cell.querySelector('.bento-glow');
      if(glow){ glow.style.opacity='0'; }
    });
  });
}

function form(){
  const f=document.getElementById('contactForm');
  if(!f) return;
  f.addEventListener('submit',e=>{
    e.preventDefault(); snd.play('success');
    const btn=f.querySelector('button[type="submit"]');
    const orig=btn.innerHTML;
    btn.innerHTML='<span class="btn-label">Sent ✓</span>';
    btn.style.background='#1E4D3F'; btn.disabled=true;
    setTimeout(()=>{ btn.innerHTML=orig; btn.style.background=''; btn.disabled=false; f.reset(); },2500);
  });
}

})();
