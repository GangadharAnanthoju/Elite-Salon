/* ============================================
   ELITE SALOON — AI Chat Widget
   Set CHAT_API_URL to your Azure Function endpoint.
   Until then, local fallback answers handle common questions.
   ============================================ */

// Auto-switch: local dev uses localhost, production uses container URL
const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const CHAT_API_URL = IS_LOCAL
  ? 'http://localhost:8001/api/chat'
  : ''; // TODO: replace '' with Azure Container App URL when deployed

const QUICK_REPLIES = [
  'What services do you offer?',
  'How much is a haircut?',
  'I want to book an appointment',
  'What are your hours?',
];

const WELCOME = "Welcome to Elite Saloon ✂️\n\nI can help you book an appointment, answer questions about our services, or tell you anything about the saloon. How can I help?";

const FALLBACK = {
  hours:   "We're open Mon–Fri 9am–8pm, Sat 9am–7pm, and Sun 10am–6pm.",
  booking: "I'd love to help you book! Please tell me:\n1. What service are you after?\n2. Any preferred barber?\n3. Your preferred day and time.",
  price:   "Our prices start at $35 for a classic haircut, $20 for a beard trim, and $50 for a Hair & Beard combo. Full pricing is on our <a href='services.html'>services page</a>.",
  location:"We're at 123 Glamour Avenue, Suite 200, New York, NY. <a href='contact.html'>Get directions →</a>",
  default: "Thanks for reaching out! For anything we can't handle here, call us at <a href='tel:+12125550100'>(212) 555-0100</a> or visit our <a href='contact.html'>contact page</a>.",
};

class ChatWidget {
  constructor() {
    this.toggle    = document.getElementById('chat-toggle');
    this.win       = document.getElementById('chat-window');
    this.closeBtn  = document.getElementById('chat-close');
    this.messages  = document.getElementById('chat-messages');
    this.input     = document.getElementById('chat-input');
    this.sendBtn   = document.getElementById('chat-send');
    this.quickEl   = document.getElementById('quick-replies');
    this.history   = [];
    this.isOpen    = false;
    this.greeted   = false;
    if (!this.toggle) return;
    this.bind();
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
  }

  open() {
    this.isOpen = true;
    this.win?.classList.add('open');
    this.toggle.textContent = '✕';
    if (!this.greeted) {
      this.greeted = true;
      setTimeout(() => { this.addBot(WELCOME); this.showQuickReplies(); }, 280);
    }
    this.input?.focus();
  }

  close() {
    this.isOpen = false;
    this.win?.classList.remove('open');
    this.toggle.textContent = '✂';
  }

  addBot(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = document.createElement('div');
    d.className = 'chat-msg';
    d.innerHTML = `
      <div class="chat-msg__avatar">ES</div>
      <div>
        <div class="chat-msg__bubble">${text.replace(/\n/g, '<br/>')}</div>
        <div class="chat-msg__time">${time}</div>
      </div>`;
    this.messages?.appendChild(d);
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
    if (this.sendBtn) this.sendBtn.disabled = true;
    this.showTyping();

    try {
      const reply = CHAT_API_URL
        ? await this.callAPI(text)
        : this.fallback(text);
      this.hideTyping();
      this.history.push({ role: 'assistant', content: reply });
      this.addBot(reply);
    } catch {
      this.hideTyping();
      this.addBot("Sorry, something went wrong. Please call us at <a href='tel:+12125550100'>(212) 555-0100</a>.");
    } finally {
      if (this.sendBtn) this.sendBtn.disabled = false;
      this.input?.focus();
    }
  }

  async callAPI(msg) {
    const res = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: this.history.slice(-8) }),
    });
    if (!res.ok) throw new Error('API error');
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
      return "We offer haircuts, beard trims, hot towel shaves, hair color, scalp treatments, and combo packages. See the full menu on our <a href='services.html'>services page</a>.";
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
