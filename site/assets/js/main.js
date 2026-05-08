/* ============================================
   ELITE SALOON — Main JS
   ============================================ */

// ---- Nav scroll effect (home page only — others are always scrolled) ----
const nav = document.getElementById('main-nav');
if (nav && !nav.classList.contains('scrolled')) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Mobile menu ----
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobile-menu')?.classList.add('open');
});
document.getElementById('mobile-close')?.addEventListener('click', () => {
  document.getElementById('mobile-menu')?.classList.remove('open');
});
document.getElementById('mobile-menu')?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobile-menu')?.classList.remove('open'));
});

// ---- Toast helper ----
function showToast(msg, type = 'default') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
window.showToast = showToast;

// ---- Lightbox ----
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.getElementById('lightbox-close')?.addEventListener('click', () => lightbox?.classList.remove('open'));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox?.classList.remove('open'); });

function initGalleryLightbox() {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (!lightboxImg || !lightbox) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
}

// ---- Open chat (called by Book buttons) ----
function openChat() {
  const toggle = document.getElementById('chat-toggle');
  const win    = document.getElementById('chat-window');
  if (win && !win.classList.contains('open')) toggle?.click();
}
window.openChat = openChat;

// ---- Render: Service Cards ----
function renderServiceCards(services, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = services.map(s => `
    <div class="service-card">
      <div class="service-card__icon">${s.icon}</div>
      <div class="service-card__name">${s.name}</div>
      <p>${s.description}</p>
      <div class="service-card__price">${s.startingFrom} &nbsp;·&nbsp; ${s.duration}</div>
    </div>
  `).join('');
}

// ---- Render: Pricing List ----
function renderPricing(data, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.categories.map(cat => `
    <div class="pricing-category">
      <div class="pricing-category__header">
        <span class="pricing-category__title">${cat.name}</span>
      </div>
      ${cat.items.map(item => `
        <div class="pricing-item">
          <div class="pricing-item__left">
            <div class="pricing-item__name">${item.name}</div>
            ${item.description ? `<div class="pricing-item__desc">${item.description}</div>` : ''}
          </div>
          <div class="pricing-item__price">${item.price}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// ---- Render: Barber preview cards (home) ----
function renderBarberPreview(team, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = team.slice(0, 4).map(m => `
    <div class="barber-card">
      <div class="barber-card__photo">
        ${hasPhoto(m.photo)
          ? `<img src="${m.photo}" alt="${m.name}" loading="lazy" /><div class="barber-card__photo-overlay"></div>`
          : `<div class="barber-card__placeholder">${m.initials}</div>`}
      </div>
      <div class="barber-card__info">
        <div class="barber-card__name">${m.name}</div>
        <div class="barber-card__role">${m.role}</div>
        ${m.tagline ? `<div class="barber-card__tagline">${m.tagline}</div>` : ''}
        <div class="barber-card__tags" style="margin-top:0.75rem;">
          ${m.specialties.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Render: Full barber list (barbers page) ----
function renderBarbersFull(team, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = team.map((m, i) => `
    <div class="barber-full-card">
      <div class="barber-full-card__photo">
        ${hasPhoto(m.photo)
          ? `<img src="${m.photo}" alt="${m.name}" loading="lazy" />`
          : `<div class="barber-full-card__photo-placeholder">${m.initials}</div>`}
      </div>
      <div class="barber-full-card__body">
        <div class="barber-full-card__num">0${i + 1}</div>
        <div class="barber-full-card__name">${m.name}</div>
        <div class="barber-full-card__role">${m.role} &nbsp;·&nbsp; ${m.experience} Experience</div>
        ${m.tagline ? `<div class="barber-full-card__tagline">"${m.tagline}"</div>` : ''}
        <p class="barber-full-card__bio">${m.bio}</p>
        <div class="barber-full-card__specialties">
          <div class="barber-full-card__specialties-label">Specialties</div>
          <div class="barber-card__tags">
            ${m.specialties.map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-outline" onclick="openChat()" style="font-size:0.68rem; padding:0.65rem 1.5rem;">
            Book with ${m.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Helper: check if photo file is expected to exist ----
function hasPhoto(path) {
  if (!path) return false;
  // Only treat as having a photo if it's one of the known uploaded files
  const known = ['marcus.png', 'Andrian.png', 'AlexR.png', 'DeanK.png'];
  return known.some(f => path.includes(f));
}

// ============================================================
// Embedded data — works with file:// and HTTP both
// Edit here to update services/pricing across all pages
// ============================================================

const SERVICES_DATA = [
  { id:'haircut',   name:'Haircut & Style',       icon:'✂️',  description:'Precision cuts shaped to your face and lifestyle. Includes consultation, wash, cut, and finish.',                              startingFrom:'From $35', duration:'45 min' },
  { id:'beard',     name:'Beard Trim & Shape',     icon:'🪒',  description:'Clean lines, sharp edges, and a sculpted finish. Your beard deserves the same attention as your hair.',                        startingFrom:'From $20', duration:'20 min' },
  { id:'combo',     name:'Hair & Beard Combo',     icon:'💈',  description:'The full treatment — precision haircut paired with a beard trim for a complete, polished look.',                               startingFrom:'From $50', duration:'60 min' },
  { id:'shave',     name:'Hot Towel Shave',        icon:'🔥',  description:'The classic barbershop ritual. Hot towel, premium lather, straight razor — the closest shave possible.',                      startingFrom:'From $40', duration:'45 min' },
  { id:'color',     name:'Hair Color & Highlights',icon:'🎨',  description:'From subtle enhancements to bold transformations. Ammonia-free products applied by our color specialist.',                    startingFrom:'From $65', duration:'60–120 min' },
  { id:'treatment', name:'Scalp Treatment',        icon:'💆',  description:'Deep conditioning and scalp massage to restore health, reduce dryness, and promote growth.',                                   startingFrom:'From $45', duration:'30 min' },
];

const PRICING_DATA = {
  categories: [
    { name: 'Haircuts', items: [
      { name:'Classic Haircut',            price:'$35', description:'Wash, cut, and style finish.' },
      { name:'Fade (Low / Mid / High)',    price:'$40', description:'Precision fade with skin or blended finish.' },
      { name:'Textured / Crop Cut',        price:'$40', description:'Modern textured styling included.' },
      { name:"Kids Cut (under 12)",        price:'$25' },
      { name:'Senior Cut (60+)',           price:'$28' },
    ]},
    { name: 'Beard Services', items: [
      { name:'Beard Trim & Shape',         price:'$20', description:'Clean edges, defined lines.' },
      { name:'Beard Design / Sculpt',      price:'$28', description:'Custom shape for your face structure.' },
      { name:'Beard Condition & Oil',      price:'$15', description:'Deep nourishment and shine treatment.' },
    ]},
    { name: 'Combo Packages', items: [
      { name:'Hair & Beard Combo',         price:'$50', description:'Full haircut + beard trim & shape.' },
      { name:'Fade & Beard Combo',         price:'$55', description:'Precision fade + beard design.' },
      { name:'The Full Works',             price:'$75', description:'Haircut, beard sculpt, hot towel, scalp massage.' },
    ]},
    { name: 'Shaving', items: [
      { name:'Hot Towel Straight Razor Shave', price:'$40', description:'The classic barbershop experience.' },
      { name:'Head Shave (razor finish)',  price:'$45' },
      { name:'Neck & Edge Tidy',           price:'$12', description:'Between-visit clean-up.' },
    ]},
    { name: 'Hair Color', items: [
      { name:'Single Process Color',       price:'$65', description:'All-over application with ammonia-free products.' },
      { name:'Highlights (partial)',       price:'$80' },
      { name:'Highlights (full)',          price:'$110' },
      { name:'Grey Blending',             price:'$70', description:'Natural, seamless blend of grey.' },
      { name:'Toner / Gloss',             price:'$35' },
    ]},
    { name: 'Treatments', items: [
      { name:'Scalp Massage & Treatment',  price:'$45', description:'30-minute deep conditioning and massage.' },
      { name:'Hot Oil Treatment',          price:'$35' },
      { name:'Dandruff Treatment',         price:'$40' },
    ]},
  ]
};

const TEAM_DATA = [
  { id:'adrian', name:'Adrian',   role:'Master Barber',       tagline:'Precision. Style. Confidence.',              bio:'Adrian brings a rare combination of artistry and precision to every cut. As Master Barber at Elite Saloon, he sets the standard — from clean fades to sharp beard lines, his work speaks for itself.',  photo:'assets/images/team/Andrian.png', initials:'AD', specialties:['Precision Fades','Beard Sculpting','Classic Cuts','Hot Towel Shave'],    experience:'10 Years' },
  { id:'marcus', name:'Marcus',   role:'Senior Barber',       tagline:'Sharp looks. Every time.',                   bio:'Marcus is the definition of consistency — every client leaves the chair looking sharper than when they sat down. Known for his meticulous technique and eye for detail, he has built a loyal following.', photo:'assets/images/team/marcus.png',  initials:'MC', specialties:['Textured Cuts','Line-Ups','Hair & Beard Combo','Skin Fades'],          experience:'8 Years'  },
  { id:'alex',   name:'Alex R.',  role:'Color Specialist',    tagline:'Precision. Creativity. Perfection.',         bio:'Alex brings a fine-art background to every color consultation. Specialising in natural tones, grey blending, and bold transformations, he creates results that look intentional and effortless.',         photo:'assets/images/team/AlexR.png',   initials:'AR', specialties:['Hair Color','Grey Blending','Highlights','Balayage'],                   experience:'7 Years'  },
  { id:'dean',   name:'Dean K.',  role:'Grooming Specialist', tagline:"It's not just a cut. It's your signature.", bio:'Dean is the go-to for hot towel shaves and beard sculpting. His methodical approach and genuine care for every client\'s comfort make his chair the most requested in the house.',                       photo:'assets/images/team/DeanK.png',   initials:'DK', specialties:['Hot Towel Shave','Beard Sculpting','Scalp Treatments','Straight Razor'], experience:'6 Years'  },
];

// ---- Page init ----
function init() {
  renderServiceCards(SERVICES_DATA, 'services-preview');
  renderServiceCards(SERVICES_DATA, 'services-full');
  renderPricing(PRICING_DATA,       'pricing-full');
  renderBarberPreview(TEAM_DATA,    'barbers-preview');
  initGalleryLightbox();
}

init();
