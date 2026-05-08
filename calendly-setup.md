# Calendly Setup Guide
> Internal reference — steps to configure Calendly for each salon client

---

## Pricing

| Plan | Per seat/mo (yearly) | Per seat/mo (monthly) |
|---|---|---|
| Standard | $10 | $12 |

| Salon Size | Barbers | Yearly billing | Monthly billing |
|---|---|---|---|
| Small | 2 barbers | $20/mo | $24/mo |
| Medium | 4 barbers | $40/mo | $48/mo |
| Large | 8 barbers | $80/mo | $96/mo |

> 💡 Always bill the client yearly to lock in $10/seat. Pass the cost to the client or absorb into your monthly retainer.

---

## Initial Setup Per Barber

1. Create a Calendly account (or add a seat to the salon's existing account)
2. Create an event type for each service (e.g. *Haircut with Adrian*, *Hot Shave with Dean*)
3. Set duration per service (e.g. 45 min for haircut, 30 min for beard trim)
4. Set availability hours to match the salon's working hours
5. Block out lunch hours if required
6. Copy the booking link and add it to the website barber profile

---

## SMS Reminders (Client → before appointment)

Calendly can send automated reminders to clients before their appointment.

**To configure:**
1. Go to **Scheduling** → find the event type → **Edit**
2. **More options** → **Notifications and workflows**
3. Under **Workflows**, add:
   - **24 hours before** — SMS or email reminder
   - **4 hours before** — SMS or email reminder
4. Save

> ❓ Ask client: *"Would you like reminders sent 24 hours and 4 hours before each appointment?"*

---

## Reschedule Link (Client self-service)

Clients can reschedule on their own without calling the salon.

**To turn it on:**
1. Go to **Scheduling** → find the event type → **Edit**
2. **More options** → **Notifications and workflows**
3. Under **Basic notifications**, edit **Calendar invitation / Email confirmation**
4. In **Cancellation policy**, check **"Include cancel and reschedule links in email invitations and reminders"**
5. **Save and close**

Once enabled, clients receive a Reschedule link in their confirmation email to pick a new time — no manual intervention needed from the salon.

> ❓ Ask client: *"Do you want clients to be able to reschedule themselves via email link?"*

---

## Cancellation Alerts (Salon owner notification)

When a client cancels, the salon owner can be notified two ways:

**Option 1 — Push Notification (free, built-in)**
- Open the Calendly mobile app
- Tap **Notifications** → Tap settings icon (top right)
- Enable **Event notifications** (covers new bookings, cancellations, rescheduling)

**Option 2 — SMS Alert (requires extra setup)**
- Go to **Account settings → Communication settings → Phone numbers for SMS**
- Add the salon owner's phone number
- Set up an SMS Workflow to trigger on cancellation

> ❓ Ask client: *"When a client cancels, do you want an alert on your phone as a push notification or via SMS text message?"*

---

## Per-Barber Link Tracker

Use this table to track booking links per client salon:

| Barber | Event Type | Calendly Link | Status |
|---|---|---|---|
| Adrian | Haircut with Adrian | https://calendly.com/gangadhar-ananthoju-sysintinc/haircut-with-adrian | ✅ Live |
| Marcus | — | — | ⏳ Pending |
| Alex R. | — | — | ⏳ Pending |
| Dean K. | — | — | ⏳ Pending |

---

## Checklist — New Salon Calendly Setup

- [ ] Account created / seats added
- [ ] Event type created per barber
- [ ] Availability hours set (including lunch block)
- [ ] 24hr reminder enabled
- [ ] 4hr reminder enabled
- [ ] Reschedule link enabled in email
- [ ] Cancellation alert configured (push or SMS)
- [ ] Booking links added to website
- [ ] Test booking completed end-to-end

---

*Last updated: May 2026 | SysInt Internal Use Only*
