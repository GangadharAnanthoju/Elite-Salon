/* ============================================
   ELITE SALOON — AI Chat Widget
   Set CHAT_API_URL to your Azure Function endpoint.
   Until then, local fallback answers handle common questions.
   ============================================ */

// Auto-switch: local dev uses localhost, production uses container URL
const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const CHAT_API_URL = IS_LOCAL
  ? 'http://localhost:8001/api/chat'
  : 'https://elite-salon-agent.kindmushroom-93329cd8.eastus.azurecontainerapps.io/api/chat';

const QUICK_REPLIES = [
  'I want to book an appointment',
  'What services do you offer?',
  'How much is a haircut?',
  'What are your hours?',
];

const WELCOME = "Welcome to Elite Saloon ✂️\n\nI can help you book an appointment, answer questions about our services, or tell you anything about the saloon. How can I help?";

const BOOKING_LINKS = {
  adrian: 'https://calendly.com/gangadhar-ananthoju-sysintinc/haircut-with-adrian',
  marcus: '', // add Calendly link when ready
  alex:   '', // add Calendly link when ready
  dean:   '', // add Calendly link when ready
};

// Friendly names shown in chat instead of raw URLs
const CALENDLY_LABELS = {
  'https://calendly.com/gangadhar-ananthoju-sysintinc/haircut-with-adrian': 'Book with Adrian',
};

// Open Calendly as popup — lazy loads the script if not already on the page
function openCalendlyPopup(url) {
  if (window.Calendly) {
    Calendly.initPopupWidget({ url });
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://assets.calendly.com/assets/external/widget.css';
  document.head.appendChild(link);
  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.onload = () => setTimeout(() => Calendly.initPopupWidget({ url }), 300);
  document.head.appendChild(script);
}
window.openCalendlyPopup = openCalendlyPopup;

const FALLBACK = {
  hours:   "Our opening hours:\n• Mon – Fri: 9am – 8pm\n• Saturday: 9am – 7pm\n• Sunday: 10am – 6pm\n\nWould you like to book an appointment?",
  booking: `I'd love to help you book! Choose your barber:\n\n` +
           `✂ <a href="#" data-calendly="${BOOKING_LINKS.adrian}" style="color:var(--gold);font-weight:700;text-decoration:underline;">Book with Adrian</a> — Master Barber\n` +
           `✂ <a href="barbers.html" style="color:var(--gold);text-decoration:underline;">View all barbers →</a>`,
  price:   "Our prices start at $35 for a classic haircut, $20 for a beard trim, and $50 for a Hair & Beard combo. Full pricing is on our <a href='services.html'>services page</a>.",
  location:"We're at 123 Glamour Avenue, Suite 200, New York, NY. <a href='contact.html'>Get directions →</a>",
  default: "Thanks for reaching out! For anything we can't handle here, call us at <a href='tel:+12125550100'>(212) 555-0100</a> or visit our <a href='contact.html'>contact page</a>.",
};

class ChatWidget {
  constructor() {
    this.toggle   = document.getElementById('chat-toggle');
    this.win      = document.getElementById('chat-window');
    this.closeBtn = document.getElementById('chat-close');
    this.messages = document.getElementById('chat-messages');
    this.input    = document.getElementById('chat-input');
    this.sendBtn  = document.getElementById('chat-send');
    this.quickEl  = document.getElementById('quick-replies');
    this.history  = JSON.parse(sessionStorage.getItem('es_history') || '[]');
    this.greeted  = !!sessionStorage.getItem('es_html');
    this.isOpen   = false;
    if (!this.toggle) return;
    this.bind();
    this.restore();
    this.bindViewport();
  }

  save() {
    sessionStorage.setItem('es_history', JSON.stringify(this.history));
    if (this.messages) sessionStorage.setItem('es_html', this.messages.innerHTML);
    sessionStorage.setItem('es_open', this.isOpen ? '1' : '0');
  }

  restore() {
    const html = sessionStorage.getItem('es_html');
    if (html && this.messages) {
      this.messages.innerHTML = html;
      this.scrollDown();
    }
    if (sessionStorage.getItem('es_open') === '1') {
      this.win?.classList.add('open');
      this.toggle.textContent = '✕';
      this.isOpen = true;
      this.scrollDown();
    }
  }

  bind() {
    this.toggle.addEventListener('click', () => this.isOpen ? this.close() : this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.sendBtn?.addEventListener('click', () => this.handleSend());
    this.input?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.handleSend(); }
    });
    this.input?.addEventListener('input', () => {
      this.input.style.height = 'auto';
      this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
    });
    // Handle Calendly popup links inside chat bubbles
    this.messages?.addEventListener('click', e => {
      const link = e.target.closest('[data-calendly]');
      if (link) {
        e.preventDefault();
        openCalendlyPopup(link.dataset.calendly);
      }
    });
  }

  open() {
    this.isOpen = true;
    this.win?.classList.add('open');
    this.toggle.textContent = '✕';
    sessionStorage.setItem('es_open', '1');
    if (!this.greeted) {
      this.greeted = true;
      setTimeout(() => { this.addBot(WELCOME); this.showQuickReplies(); }, 280);
    }
    this.input?.focus();
    this.scrollDown();
    if (CHAT_API_URL) this.warmup();
    if (this._vpResize) this._vpResize();
  }

  warmup() {
    fetch(CHAT_API_URL.replace('/api/chat', '/'), { method: 'GET' }).catch(() => {});
  }

  bindViewport() {
    if (!window.visualViewport) return;
    const resize = () => {
      if (!this.isOpen || window.innerWidth > 480) return;
      this.win.style.height = window.visualViewport.height + 'px';
      this.win.style.top    = window.visualViewport.offsetTop + 'px';
    };
    window.visualViewport.addEventListener('resize', resize);
    window.visualViewport.addEventListener('scroll', resize);
    this._vpResize = resize;
  }

  close() {
    this.isOpen = false;
    this.win?.classList.remove('open');
    this.toggle.textContent = '✂';
    if (this.win) { this.win.style.height = ''; this.win.style.top = ''; }
    sessionStorage.setItem('es_open', '0');
  }

  linkify(text) {
    return text.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
      const clean = url.replace(/[.,!?—\-]+$/, '');
      if (clean.includes('calendly.com')) {
        const label = CALENDLY_LABELS[clean] || 'Book Now';
        return `<a href="#" data-calendly="${clean}" style="color:var(--gold);font-weight:700;text-decoration:underline;cursor:pointer;">${label}</a>`;
      }
      return `<a href="${clean}" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline;">${clean}</a>`;
    });
  }

  addBot(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = document.createElement('div');
    d.className = 'chat-msg';
    d.innerHTML = `
      <div class="chat-msg__avatar">ES</div>
      <div>
        <div class="chat-msg__bubble">${this.linkify(text).replace(/\n/g, '<br/>')}</div>
        <div class="chat-msg__time">${time}</div>
      </div>`;
    this.messages?.appendChild(d);
    this.save();
    this.scrollDown();
  }

  addUser(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = document.createElement('div');
    d.className = 'chat-msg chat-msg--user';
    d.innerHTML = `
      <div class="chat-msg__avatar">You</div>
      <div>
        <div class="chat-msg__bubble">${this.escape(text)}</div>
        <div class="chat-msg__time">${time}</div>
      </div>`;
    this.messages?.appendChild(d);
    this.save();
    this.scrollDown();
  }

  showTyping() {
    const d = document.createElement('div');
    d.className = 'chat-msg'; d.id = 'chat-typing';
    d.innerHTML = `<div class="chat-msg__avatar">ES</div>
      <div class="chat-typing"><span></span><span></span><span></span></div>`;
    this.messages?.appendChild(d);
    this.scrollDown();
  }

  hideTyping() { document.getElementById('chat-typing')?.remove(); }

  showQuickReplies() {
    if (!this.quickEl) return;
    this.quickEl.innerHTML = QUICK_REPLIES.map(q =>
      `<button class="chat-quick-reply">${this.escape(q)}</button>`
    ).join('');
    this.quickEl.querySelectorAll('.chat-quick-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        this.quickEl.innerHTML = '';
        this.send(btn.textContent);
      });
    });
  }

  async handleSend() {
    const text = this.input?.value.trim();
    if (!text) return;
    this.input.value = '';
    this.input.style.height = 'auto';
    if (this.quickEl) this.quickEl.innerHTML = '';
    await this.send(text);
  }

  async send(text) {
    this.addUser(text);
    this.history.push({ role: 'user', content: text });
    this.save();
    if (this.sendBtn) this.sendBtn.disabled = true;
    this.showTyping();

    try {
      const reply = CHAT_API_URL
        ? await this.callAPI(text)
        : this.fallback(text);
      this.hideTyping();
      this.history.push({ role: 'assistant', content: reply });
      this.save();
      this.addBot(reply);
    } catch {
      this.hideTyping();
      this.addBot("Sorry, something went wrong. Please call us at <a href='tel:+12125550100'>(212) 555-0100</a>.");
    } finally {
      if (this.sendBtn) this.sendBtn.disabled = false;
      this.input?.focus();
    }
  }

  async callAPI(msg, retry = true) {
    let res;
    try {
      res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: this.history.slice(-8) }),
      });
    } catch {
      if (retry) { await new Promise(r => setTimeout(r, 4000)); return this.callAPI(msg, false); }
      throw new Error('Network error');
    }
    if (!res.ok) {
      if (retry) { await new Promise(r => setTimeout(r, 4000)); return this.callAPI(msg, false); }
      throw new Error('API error');
    }
    const data = await res.json();
    return data.reply || data.message || 'Sorry, I could not process that.';
  }

  fallback(text) {
    const t = text.toLowerCase();
    if (/hour|open|close|when|time/.test(t))                     return FALLBACK.hours;
    if (/book|appoint|reserv|schedul|slot|availab/.test(t))      return FALLBACK.booking;
    if (/price|cost|how much|fee|charge|expensive/.test(t))      return FALLBACK.price;
    if (/location|address|where|find|directions|map/.test(t))    return FALLBACK.location;
    if (/service|offer|do you|what.*do/.test(t))
      return "Our services:\n• Haircut & Style\n• Beard Trim & Sculpt\n• Hair & Beard Combo\n• Hot Towel Shave\n• Hair Color & Highlights\n• Scalp Treatment\n• Full Works\n\nSee full pricing on our <a href='services.html' style='color:var(--gold);text-decoration:underline;'>services page</a>.";
    if (/barber|stylist|who|staff|team/.test(t))
      return "We have four expert barbers — Marcus, James, Alex, and Dean. <a href='barbers.html'>Meet the team →</a>";
    if (/hello|hi |hey|good morning|good afternoon/.test(t))
      return "Hey! Great to have you here. What can I help you with today — booking, pricing, or something else?";
    if (/thank/.test(t))
      return "Anytime! We look forward to seeing you at Elite Saloon. ✂️";
    return FALLBACK.default;
  }

  scrollDown() { if (this.messages) this.messages.scrollTop = this.messages.scrollHeight; }
  escape(s)    { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
}

document.addEventListener('DOMContentLoaded', () => new ChatWidget());
