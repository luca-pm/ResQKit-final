# ResQKit web app and ISU dashboard

The browser version of ResQKit, plus the ISU dashboard at `/dashboard`, which
watches a live incident session from the phone app over a WebSocket.

```bash
cp .env.example .env     # VITE_API_BASE_URL points at the backend (port 8001)
npm install
npm run dev              # http://127.0.0.1:5174
```

The backend must be running (see the main [README](../README.md)). To pair the
dashboard with a phone, turn on Real-data mode in the app (Account → Settings → Advanced settings),
start an emergency, and enter the pairing code shown on the 112 screen.
