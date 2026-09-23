# The Protocol 2026 - Standalone Registration Portal

A dedicated, lightweight, zero-dependency operative registration portal for **The Protocol 2026** (NIT Warangal IEEE Student Branch).

It allows participants to enlist their name, roll number, and contact number. Submissions are dispatched directly into the master Google Form, and participants are shown a confirmed registration summary page ("Thank You for Registering").

---

## 🚀 How to Host Separately

This folder is **100% self-contained** (static HTML, CSS, JavaScript). You can host it anywhere with zero build setup:

### Option 1: Vercel (Recommended, < 1 minute)
1. Initialize this folder as a git repository or push it to a new GitHub repository:
   ```bash
   cd registration-portal
   git init
   git add .
   git commit -m "Initial registration portal"
   ```
2. In [Vercel Dashboard](https://vercel.com):
   - Click **Add New Project** -> **Import Git Repository**.
   - Framework preset: **Other** (Static).
   - Click **Deploy**.
   *(Alternatively, run `npx vercel` inside this folder).*

### Option 2: Netlify (Drag & Drop, 10 seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `registration-portal/` folder into the browser window.
3. Your registration page is live immediately with an SSL URL!

### Option 3: GitHub Pages
1. Push this folder to a GitHub repository.
2. In repository **Settings** -> **Pages**:
   - Source: Deploy from branch -> `main` / `root`.
   - Click **Save**.

### Option 4: Local Preview / Self-Hosted
Run the local dev server using Node:
```bash
npm run dev
# or
npx serve . -l 3001
# or with Python
python3 -m http.server 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## ⚙️ Google Form Configuration

The submission endpoint and field entry IDs are defined at the top of `app.js` and in the hidden form in `index.html`:

```javascript
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScKFfelKxXfuFFkeiD3R05oSVM28QOeMIS8vR9KL8mjQbv0Ng/formResponse',
  entryName: 'entry.371560776',
  entryRollNo: 'entry.2112393183',
  entryPhone: 'entry.754048162'
};
```

### Changing the Google Form
If you ever create a new Google Form:
1. Open the form in Google Forms and click the three dots -> **Get pre-filled link**.
2. Type test values (e.g. `NAME`, `ROLL`, `PHONE`) into each field and click **Get link**.
3. Copy the link and inspect the query parameters (`entry.XXXXX=NAME`, etc.) to find the IDs.
4. Replace `formUrl` (ensuring it ends with `/formResponse`) and the corresponding `entry.XXXX` values in `app.js` and `index.html`.

---

## 🎨 Visual Identity & Architecture

- **Editorial Typography**: Loads authentic Google Fonts (`Newsreader`, `Space Grotesk`, `JetBrains Mono`).
- **Resilient Dual Submission**: Combines hidden iframe submission target (eliminates any browser CORS barriers) with background asynchronous `fetch(..., { mode: 'no-cors' })`.
- **Confirmation State**: Presents an authentic editorial stamp, enlistment timestamp, unique reference code, and venue briefing.
