import datetime
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

# If modifying these SCOPES, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']

def main():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('calendar', 'v3', credentials=creds)

    # Use 'primary' or the specific ID for your 'adrian' calendar
    calendar_id = '4de7bc1dca7e2f9722bb5c5dfde9459f9edff8b927d040ef9cd9dd7123a039c3@group.calendar.google.com'

    # Configuration for recurring blocks (Times you are UNAVAILABLE)
    # Note: Times are in 24h format. 'BYDAY' uses MO, TU, WE, TH, FR, SA, SU.
    blocks = [
        # Monday - Friday: Block Night (8 PM to 9 AM next day)
        {"summary": "Non-Working", "start": "20:00", "end": "23:59", "days": "MO,TU,WE,TH,FR"},
        {"summary": "Non-Working", "start": "00:00", "end": "09:00", "days": "MO,TU,WE,TH,FR"},
        
        # Saturday: Block before 9 AM and after 7 PM
        {"summary": "Non-Working", "start": "00:00", "end": "09:00", "days": "SA"},
        {"summary": "Non-Working", "start": "19:00", "end": "23:59", "days": "SA"},

        # Sunday: Block before 10 AM and after 6 PM
        {"summary": "Non-Working", "start": "00:00", "end": "10:00", "days": "SU"},
        {"summary": "Non-Working", "start": "18:00", "end": "23:59", "days": "SU"},
    ]

    for block in blocks:
        # Create the start/end timestamps for today to anchor the recurrence
        today = datetime.date.today().isoformat()
        event = {
            'summary': block['summary'],
            'description': 'Automated block for Calendly availability',
            'start': {
                'dateTime': f'{today}T{block["start"]}:00',
                'timeZone': 'America/New_York', # Adjust to your timezone
            },
            'end': {
                'dateTime': f'{today}T{block["end"]}:00',
                'timeZone': 'America/New_York',
            },
            'recurrence': [
                f'RRULE:FREQ=WEEKLY;BYDAY={block["days"]}'
            ],
            'transparency': 'opaque', # This makes it "BUSY"
        }

        event = service.events().insert(calendarId=calendar_id, body=event).execute()
        print(f"Created block: {event.get('htmlLink')}")

if __name__ == '__main__':
    main()