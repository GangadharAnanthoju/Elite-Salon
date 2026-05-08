# Operations: Google Calendar Availability Blocker

This script (`blockgooglecalender.py`) automatically creates recurring "Non-Working" blocks on a Google Calendar to control Calendly availability for Elite Salon.

## What It Does

Creates weekly recurring blocked time slots so clients cannot book appointments outside of business hours. The blocks are marked as **Busy (opaque)**, which Calendly respects when checking availability.

### Default Schedule

| Day | Open Hours | Blocked Before | Blocked After |
|-----|-----------|----------------|---------------|
| Monday – Friday | 9:00 AM – 8:00 PM | 12:00 AM – 9:00 AM | 8:00 PM – 11:59 PM |
| Saturday | 9:00 AM – 7:00 PM | 12:00 AM – 9:00 AM | 7:00 PM – 11:59 PM |
| Sunday | 10:00 AM – 6:00 PM | 12:00 AM – 10:00 AM | 6:00 PM – 11:59 PM |

---

## Setup Instructions

### 1. Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `Calendly-Availability-Blocker`).
3. Navigate to **APIs & Services > Library**, search for **Google Calendar API**, and click **Enable**.
   > You must enable the Calendar API **before** running the script, otherwise your credentials won't have permission to access your calendar.

---

### 2. Configure the OAuth Consent Screen

The OAuth consent screen tells Google what your app is and who can use it. If you see an **Overview** page with a blue **Get Started** button, you haven't configured it yet — follow these steps:

#### Step 1 — Click "Get Started"

Click the blue **Get started** button in the center of the page to launch the configuration wizard.

#### Step 2 — Enter App Information

Fill in the basic app details:

| Field | Value |
| ----- | ----- |
| App name | `My Calendar Script` (or any name you prefer) |
| User support email | Select your own email from the dropdown |
| Developer contact info | Enter your email again at the bottom |

Click **Save and Continue**.

#### Step 3 — Select Audience (User Type)

After saving app info, look for an **Audience** or **User Type** step in the wizard or the left-hand sidebar.

- If you are using a personal **@gmail.com** account, it will default to or only offer **External** — this is correct, select it.
- If the option is greyed out, standard Gmail accounts are automatically treated as External, so you can proceed.

#### Step 4 — Add Scopes

When prompted to add scopes, click **Add or Remove Scopes** and add:

```text
https://www.googleapis.com/auth/calendar
```

This grants the script permission to read and write calendar events.

#### Step 5 — Add Test Users (if needed)

While your app is in **Testing** mode, only listed accounts can authorize it. Add your Gmail address as a test user so the script can run.

---

### 3. Create OAuth Credentials (Client ID)

Once the consent screen is configured:

1. Go to the **Clients** tab on the left sidebar (under **Google Auth Platform** or **APIs & Services > Credentials**).
2. Click **Create Client** (or **Create Credentials > OAuth client ID**).
3. Select **Desktop app** as the application type.
4. Give it a name (e.g., `Calendar Blocker`) and click **Create**.
5. Click **Download JSON** — this file is your `credentials.json`.
6. Rename it to `credentials.json` and place it in the same folder as `blockgooglecalender.py`.

> **Important:** Never commit `credentials.json` or `token.json` to version control. Add both to `.gitignore`.

### 4. Install Python Dependencies

```bash
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

---

## Running the Script

```bash
cd operations
python blockgooglecalender.py
```

On first run, a browser window will open for OAuth authorization. After you approve, a `token.json` file is created locally for future runs.

---

## Configuration

Open `blockgooglecalender.py` and update these values as needed:

| Variable | Description |
|----------|-------------|
| `calendar_id` | The Google Calendar ID to block (found in Calendar Settings > Integrate calendar) |
| `blocks` | List of time blocks — adjust `start`, `end`, and `days` for your schedule |
| `timeZone` | Set to your local timezone (e.g., `America/New_York`, `America/Chicago`) |

### Finding Your Calendar ID

1. Open [Google Calendar](https://calendar.google.com/).
2. Click the three dots next to your calendar name > **Settings and sharing**.
3. Scroll to **Integrate calendar** and copy the **Calendar ID**.

---

## Files

| File | Description |
|------|-------------|
| `blockgooglecalender.py` | Main script — creates recurring calendar blocks |
| `credentials.json` | OAuth client secret (downloaded from Google Cloud, **not committed**) |
| `token.json` | Auto-generated auth token after first login (**not committed**) |

---

## Notes

- Run the script once — the blocks are **recurring (weekly)**, so you do not need to re-run it every week.
- If you change the `SCOPES` in the script, delete `token.json` and re-authenticate.
- To remove the blocks, delete them manually from Google Calendar or use the Calendar API's `events.delete` endpoint.
