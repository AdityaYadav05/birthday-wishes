/* =========================================
   BIRTHDAY WEBSITE — script.js  (All Tiers)
   ========================================= */

// ══════════════════════════════════════════
// CONFIG — Edit everything here!
// ══════════════════════════════════════════
const CONFIG = {
  name:          "My Dearest",        // Birthday person's name
  musicSrc:      "",                  // Path to .mp3 music file
  videoSrc:      "",                  // Path to .mp4 video file
  togetherSince: "2023-06-15",        // YYYY-MM-DD  (your anniversary / start date)
  typingTexts: [
    "You are the sunshine that lights up my every single day... ☀️",
    "A soul as beautiful as yours deserves all the happiness in the world 🌸",
    "Happy Birthday to someone truly irreplaceable 💖",
    "Every moment with you is a memory I treasure forever ✨",
  ],
  memories: [
    { emoji:"🌸", label:"Memory 1", caption:"The day we laughed till we cried 💕" },
    { emoji:"🌼", label:"Memory 2", caption:"Our secret little adventures 🌟" },
    { emoji:"🦋", label:"Memory 3", caption:"When everything felt perfect ✨" },
    { emoji:"🌷", label:"Memory 4", caption:"Side by side, always 💖" },
    { emoji:"🍓", label:"Memory 5", caption:"Sweet moments, sweeter you 🍰" },
    { emoji:"🌙", label:"Memory 6", caption:"Late nights, forever stars ⭐" },
  ],
};

// ══════════════════════════════════════════
// BACKGROUND CANVAS — Hearts + Shooting Stars
// ══════════════════════════════════════════
const bgCanvas = document.getElementById('bgCanvas');
const bctx     = bgCanvas.getContext('2d');
let hearts = [], stars = [];

function resizeBg() { bgCanvas.width = innerWidth; bgCanvas.height = innerHeight; }
resizeBg();
window.addEventListener('resize', resizeBg);

const rand = (a,b) => a + Math.random()*(b-a);
const HEART_COLS = ['#ffb6c1','#ff6b8a','#ff4d79','#ffd6e0','#ff9ebc','#e8d5f5'];

function mkHeart() {
  return { x:rand(0,bgCanvas.width), y:-20, size:rand(8,22), speed:rand(.8,2.8),
           opacity:rand(.2,.7), swing:rand(-.8,.8), swingSpeed:rand(.01,.03), angle:rand(0,Math.PI*2),
           color:HEART_COLS[Math.floor(Math.random()*HEART_COLS.length)] };
}
function drawHeart(h) {
  bctx.save(); bctx.globalAlpha=h.opacity; bctx.fillStyle=h.color;
  bctx.translate(h.x,h.y); const s=h.size/30; bctx.scale(s,s);
  bctx.beginPath(); bctx.moveTo(0,-10);
  bctx.bezierCurveTo(5,-18,18,-18,18,-6); bctx.bezierCurveTo(18,4,8,12,0,20);
  bctx.bezierCurveTo(-8,12,-18,4,-18,-6); bctx.bezierCurveTo(-18,-18,-5,-18,0,-10);
  bctx.fill(); bctx.restore();
}

function mkStar() {
  const angle = rand(15,55)*Math.PI/180;
  return { x:rand(0,bgCanvas.width), y:rand(0,bgCanvas.height*.4),
           len:rand(80,200), angle, speed:rand(8,18),
           opacity:1, trail:[], done:false };
}
function drawStar(s) {
  const tx = s.x + Math.cos(s.angle)*s.len;
  const ty = s.y + Math.sin(s.angle)*s.len;
  const grad = bctx.createLinearGradient(s.x,s.y,tx,ty);
  grad.addColorStop(0,'rgba(255,255,255,0)');
  grad.addColorStop(.7,`rgba(255,220,230,${s.opacity*.6})`);
  grad.addColorStop(1,`rgba(255,255,255,${s.opacity})`);
  bctx.save(); bctx.strokeStyle=grad; bctx.lineWidth=2;
  bctx.shadowColor='rgba(255,200,220,.8)'; bctx.shadowBlur=6;
  bctx.beginPath(); bctx.moveTo(s.x,s.y); bctx.lineTo(tx,ty);
  bctx.stroke(); bctx.restore();
}

let bgFrame=0;
function animateBg() {
  bctx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  bgFrame++;
  // Hearts
  if(bgFrame%22===0 && hearts.length<50) hearts.push(mkHeart());
  hearts=hearts.filter(h=>h.y<bgCanvas.height+40);
  for(const h of hearts){ h.angle+=h.swingSpeed; h.x+=Math.sin(h.angle)*h.swing; h.y+=h.speed; drawHeart(h); }
  // Shooting stars
  if(bgFrame%180===0) stars.push(mkStar());
  stars=stars.filter(s=>!s.done);
  for(const s of stars){
    s.x+=Math.cos(s.angle)*s.speed; s.y+=Math.sin(s.angle)*s.speed;
    s.opacity-=.018;
    if(s.opacity<=0||s.x>bgCanvas.width+50||s.y>bgCanvas.height+50) s.done=true;
    else drawStar(s);
  }
  requestAnimationFrame(animateBg);
}
animateBg();
for(let i=0;i<20;i++){const h=mkHeart();h.y=rand(0,innerHeight);hearts.push(h);}

// ══════════════════════════════════════════
// CONFETTI CANNON (Tier 2 #1)
// ══════════════════════════════════════════
const confCanvas = document.getElementById('confettiCanvas');
const cctx       = confCanvas.getContext('2d');
confCanvas.width  = innerWidth;
confCanvas.height = innerHeight;
window.addEventListener('resize',()=>{confCanvas.width=innerWidth;confCanvas.height=innerHeight;});

let confPieces = [], confActive = false;
const CONF_COLS = ['#ff4d79','#ffb6c1','#ffd700','#ff9ebc','#e8d5f5','#ffffff','#ff6b8a','#c8b4ff'];

function launchConfetti() {
  if(confActive) return;
  confActive = true;
  confPieces = [];
  for(let i=0;i<220;i++){
    confPieces.push({
      x: rand(innerWidth*.2, innerWidth*.8),
      y: rand(-60,-10),
      vx: rand(-8,8), vy: rand(2,12),
      size: rand(6,14), angle: rand(0,360),
      rotSpeed: rand(-6,6), gravity: rand(.1,.25),
      color: CONF_COLS[Math.floor(Math.random()*CONF_COLS.length)],
      shape: Math.random()>.5?'rect':'circle',
      opacity: 1, drag: rand(.97,.99),
    });
  }
  animateConf();
}
function animateConf() {
  cctx.clearRect(0,0,confCanvas.width,confCanvas.height);
  confPieces=confPieces.filter(p=>p.opacity>0.02&&p.y<confCanvas.height+30);
  for(const p of confPieces){
    p.vy+=p.gravity; p.vx*=p.drag; p.x+=p.vx; p.y+=p.vy;
    p.angle+=p.rotSpeed; p.opacity-=.004;
    cctx.save(); cctx.globalAlpha=p.opacity; cctx.fillStyle=p.color;
    cctx.translate(p.x,p.y); cctx.rotate(p.angle*Math.PI/180);
    if(p.shape==='rect'){ cctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2); }
    else{ cctx.beginPath(); cctx.arc(0,0,p.size/2,0,Math.PI*2); cctx.fill(); }
    cctx.restore();
  }
  if(confPieces.length>0) requestAnimationFrame(animateConf);
  else { confActive=false; cctx.clearRect(0,0,confCanvas.width,confCanvas.height); }
}

// ══════════════════════════════════════════
// TYPING ANIMATION
// ══════════════════════════════════════════
const typingEl = document.getElementById('typingText');
let tIdx=0, cIdx=0, deleting=false, delay=65;
function typeText() {
  const cur=CONFIG.typingTexts[tIdx];
  typingEl.classList.add('typing-cursor');
  if(!deleting){ typingEl.textContent=cur.substring(0,cIdx+1); cIdx++; if(cIdx===cur.length){deleting=true;delay=2600;}else delay=65; }
  else{ typingEl.textContent=cur.substring(0,cIdx-1); cIdx--; if(cIdx===0){deleting=false;tIdx=(tIdx+1)%CONFIG.typingTexts.length;delay=400;}else delay=38; }
  setTimeout(typeText,delay);
}
setTimeout(typeText,1000);

// ══════════════════════════════════════════
// TOGETHER COUNTER (Tier 1 #4)
// ══════════════════════════════════════════
function updateCounter() {
  const start = new Date(CONFIG.togetherSince);
  const now   = new Date();
  let diff    = now - start;
  if(diff<0){ document.getElementById('togetherCounter').style.display='none'; return; }
  const sec  = Math.floor(diff/1000);
  const mins = Math.floor(sec/60);
  const hrs  = Math.floor(mins/60);
  const days = Math.floor(hrs/24);
  // Years & months approximation
  let years=0, months=0;
  let d = new Date(start);
  while(true){ const next=new Date(d); next.setFullYear(next.getFullYear()+1); if(next>now)break; d=next;years++; }
  while(true){ const next=new Date(d); next.setMonth(next.getMonth()+1); if(next>now)break; d=next;months++; }
  const remDays  = Math.floor((now-d)/(1000*60*60*24));
  const remHrs   = now.getHours();
  const remMins  = now.getMinutes();
  const remSecs  = now.getSeconds();
  document.getElementById('cYears').textContent  = years;
  document.getElementById('cMonths').textContent = months;
  document.getElementById('cDays').textContent   = remDays;
  document.getElementById('cHours').textContent  = remHrs;
  document.getElementById('cMins').textContent   = String(remMins).padStart(2,'0');
  document.getElementById('cSecs').textContent   = String(remSecs).padStart(2,'0');
}
updateCounter(); setInterval(updateCounter,1000);

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

const ropeObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const d=parseInt(e.target.dataset.delay||0);
      setTimeout(()=>e.target.classList.add('visible'),d);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal-rope').forEach(el=>ropeObs.observe(el));

// ══════════════════════════════════════════
// ENVELOPE / LOVE LETTER (Tier 1 #2)
// ══════════════════════════════════════════
const envelope     = document.getElementById('envelope');
const envFlap      = document.getElementById('envFlap');
const letterPaper  = document.getElementById('letterPaper');
const letterDate   = document.getElementById('letterDate');
let envOpen = false;

// Set date
const now = new Date();
letterDate.textContent = now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

envelope.addEventListener('click',()=>{
  if(!envOpen){
    envOpen=true;
    envFlap.classList.add('open');
    setTimeout(()=>{ letterPaper.classList.add('open'); },500);
  } else {
    envOpen=false;
    letterPaper.classList.remove('open');
    setTimeout(()=>{ envFlap.classList.remove('open'); },300);
  }
});

// ══════════════════════════════════════════
// BIRTHDAY CAKE (Tier 1 #1)
// ══════════════════════════════════════════
const cakeWrapper  = document.getElementById('cakeWrapper');
const wishMadeMsg  = document.getElementById('wishMadeMsg');
const cakeSubtitle = document.getElementById('cakeSubtitle');
let candlesOut = 0;
const totalCandles = 5;
const flames = Array.from({length:totalCandles},(_,i)=>document.getElementById('flame'+i));

function blowCandle(idx) {
  const flame = flames[idx];
  if(flame.classList.contains('out')) return;
  flame.classList.add('out');
  candlesOut++;
  if(candlesOut===totalCandles) {
    setTimeout(()=>{
      wishMadeMsg.classList.add('show');
      launchConfetti();
      cakeSubtitle.textContent='✨ Your wish has been sent to the stars! ✨';
      spawnBalloons();
    },600);
  }
}

// Tap single candle
document.querySelectorAll('.candle-unit').forEach(cu=>{
  cu.addEventListener('click',e=>{
    e.stopPropagation();
    blowCandle(parseInt(cu.dataset.index));
  });
});
// Tap cake blows all remaining
cakeWrapper.addEventListener('click',()=>{
  flames.forEach((_,i)=>blowCandle(i));
});

// ══════════════════════════════════════════
// LIGHTBOX (Tier 2 — memory card fullscreen)
// ══════════════════════════════════════════
const lightbox  = document.getElementById('lightbox');
const lbImgWrap = document.getElementById('lbImgWrap');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');
let lbIndex = 0;

function openLightbox(idx) {
  lbIndex = idx;
  showLbSlide();
  lightbox.classList.add('open');
  document.body.style.overflow='hidden';
}
function showLbSlide() {
  const m = CONFIG.memories[lbIndex];
  lbImgWrap.innerHTML=`<div class="lb-ph"><span style="font-size:5rem">${m.emoji}</span><span>${m.label}</span></div>`;
  lbCaption.textContent=m.caption;
}
lbClose.addEventListener('click',()=>{ lightbox.classList.remove('open'); document.body.style.overflow=''; });
lightbox.addEventListener('click',e=>{ if(e.target===lightbox){lightbox.classList.remove('open');document.body.style.overflow='';} });
lbPrev.addEventListener('click',()=>{ lbIndex=(lbIndex-1+CONFIG.memories.length)%CONFIG.memories.length; showLbSlide(); });
lbNext.addEventListener('click',()=>{ lbIndex=(lbIndex+1)%CONFIG.memories.length; showLbSlide(); });
// Swipe
let lbTouchX=null;
lightbox.addEventListener('touchstart',e=>lbTouchX=e.touches[0].clientX,{passive:true});
lightbox.addEventListener('touchend',e=>{
  if(lbTouchX===null) return;
  const dx=e.changedTouches[0].clientX-lbTouchX;
  if(Math.abs(dx)>50){ lbIndex=dx<0?(lbIndex+1)%CONFIG.memories.length:(lbIndex-1+CONFIG.memories.length)%CONFIG.memories.length; showLbSlide(); }
  lbTouchX=null;
},{passive:true});

// ══════════════════════════════════════════
// FLIP CARDS (Tier 2 #2)
// ══════════════════════════════════════════
document.querySelectorAll('.flip-card').forEach(card=>{
  card.addEventListener('click',()=>card.classList.toggle('flipped'));
});

// ══════════════════════════════════════════
// GIFT BOX (Tier 2 #5)
// ══════════════════════════════════════════
const giftbox     = document.getElementById('giftbox');
const giftMessage = document.getElementById('giftMessage');
let boxOpened = false;

giftbox.addEventListener('click',()=>{
  if(boxOpened) return;
  // Shake first
  giftbox.style.animation='giftShake .4s ease';
  giftbox.addEventListener('animationend',()=>{
    giftbox.style.animation='';
    giftbox.classList.add('opened');
    boxOpened=true;
    setTimeout(()=>{ giftMessage.classList.add('show'); launchConfetti(); },400);
  },{once:true});
});

// Add shake keyframe dynamically
const ks = document.createElement('style');
ks.textContent=`@keyframes giftShake{0%,100%{transform:rotate(0)}15%{transform:rotate(-8deg)}30%{transform:rotate(8deg)}45%{transform:rotate(-5deg)}60%{transform:rotate(5deg)}75%{transform:rotate(-2deg)}}`;
document.head.appendChild(ks);

// ══════════════════════════════════════════
// DARK MODE TOGGLE (Tier 2 #4)
// ══════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
let dark = localStorage.getItem('bdayDark')==='1';
function applyTheme() {
  document.body.classList.toggle('dark',dark);
  themeIcon.textContent = dark ? '☀️' : '🌙';
}
applyTheme();
themeToggle.addEventListener('click',()=>{ dark=!dark; localStorage.setItem('bdayDark',dark?'1':'0'); applyTheme(); });

// ══════════════════════════════════════════
// BALLOONS
// ══════════════════════════════════════════
const balloonsCont = document.getElementById('balloons');
const bEmojis = ['🎈','🎀','💖','🎊','🌸','🎁','💕','✨','🎉','🌷'];
let balActive = false;

function spawnBalloons() {
  if(balActive) return; balActive=true;
  for(let i=0;i<18;i++){
    setTimeout(()=>{
      const b=document.createElement('div'); b.className='balloon';
      b.textContent=bEmojis[Math.floor(Math.random()*bEmojis.length)];
      b.style.left=rand(3,94)+'%'; b.style.fontSize=rand(1.5,3)+'rem';
      const dur=rand(5,10); b.style.animationDuration=dur+'s'; b.style.animationDelay=rand(0,2)+'s';
      balloonsCont.appendChild(b);
    },i*180);
  }
}
window.addEventListener('scroll',()=>{ if(window.scrollY/(document.body.scrollHeight-innerHeight)>.35) spawnBalloons(); },{passive:true});

// ══════════════════════════════════════════
// MUSIC FAB
// ══════════════════════════════════════════
const musicBtn = document.getElementById('musicBtn');
const musicSVG = document.getElementById('musicSVG');
const pauseSVG = document.getElementById('pauseSVG');
const bgMusic  = document.getElementById('bgMusic');
let isPlaying  = false;

if(CONFIG.musicSrc) { bgMusic.querySelector('source').src=CONFIG.musicSrc; bgMusic.load(); }

musicBtn.addEventListener('click',()=>{
  if(!CONFIG.musicSrc){ showToast('🎵 Add your music URL in CONFIG'); return; }
  if(isPlaying){ bgMusic.pause(); isPlaying=false; musicSVG.classList.remove('d-none'); pauseSVG.classList.add('d-none'); musicBtn.classList.remove('playing'); }
  else{ bgMusic.play().catch(()=>showToast('Could not play music')); isPlaying=true; musicSVG.classList.add('d-none'); pauseSVG.classList.remove('d-none'); musicBtn.classList.add('playing'); }
});

// ══════════════════════════════════════════
// VIDEO MODAL
// ══════════════════════════════════════════
const videoBtn   = document.getElementById('videoBtn');
const videoModal = document.getElementById('videoModal');
const modalClose = document.getElementById('modalClose');
videoBtn.addEventListener('click',()=>{ videoModal.classList.add('open'); document.body.style.overflow='hidden'; });
function closeModal(){ videoModal.classList.remove('open'); document.body.style.overflow=''; }
modalClose.addEventListener('click',closeModal);
videoModal.addEventListener('click',e=>{ if(e.target===videoModal) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeModal(); lightbox.classList.remove('open'); document.body.style.overflow=''; } });

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
function showToast(msg) {
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:7rem;right:1.2rem;background:linear-gradient(135deg,#ff6b8a,#ffb6c1);color:white;padding:.75rem 1.2rem;border-radius:50px;font-family:Nunito,sans-serif;font-size:.85rem;font-weight:700;box-shadow:0 8px 24px rgba(255,105,135,.4);z-index:500;max-width:240px;line-height:1.4;animation:fadeInUp .4s ease;`;
  t.textContent=msg; document.body.appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .5s'; t.style.opacity='0'; setTimeout(()=>t.remove(),500); },3000);
}

// ══════════════════════════════════════════
// APPLY NAME
// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded',()=>{
  if(CONFIG.name&&CONFIG.name!=='My Dearest'){
    document.querySelectorAll('#heroName,[data-name]').forEach(el=>{ el.textContent=CONFIG.name; });
  }
});

// ══════════════════════════════════════════
// PWA SERVICE WORKER
// ══════════════════════════════════════════
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js')
      .then(()=>console.log('💖 SW registered'))
      .catch(e=>console.log('SW error:',e));
  });
}

// ══════════════════════════════════════════
// PAGE LOAD BURST
// ══════════════════════════════════════════
window.addEventListener('load',()=>{
  setTimeout(launchConfetti,800);
  for(let i=0;i<12;i++){
    setTimeout(()=>{const h=mkHeart();h.y=-10;h.speed=rand(2,5);h.size=rand(16,32);h.opacity=.9;hearts.push(h);},i*80);
  }
});

console.log('%c💖 Happy Birthday! 💖','color:#ff4d79;font-size:20px;font-weight:bold;');
console.log('%cEdit CONFIG at top of script.js to personalize!','color:#ff9ebc;');
