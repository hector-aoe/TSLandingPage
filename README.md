# The Spot — Coming Soon Page

A self-contained landing page for **thespot1982.store**: looping vintage-surf
background video, email + SMS signup, social links. Three files, no build
step, no framework — open `index.html` in a browser and it works.

```
thespot1982/
├── index.html      structure & content
├── style.css       all design tokens, colors, fonts, layout
├── script.js       video loading + signup form logic
├── media/          ← you create this folder, see below
└── README.md       this file
```

## 0. Editing in Spyder

Spyder is built for Python, not web files, but it'll happily open and
edit `.html`, `.css`, and `.js` as plain text — just no live preview
pane, so keep a browser tab open alongside it and refresh after saving.
You can run the preview server command below directly in Spyder's
IPython console (bottom-right pane) instead of opening a separate
terminal.

## 1. Preview it locally

Opening `index.html` directly by double-clicking can cause two annoyances:
autoplay sometimes behaves oddly over the `file://` protocol, and the
signup form's `fetch()` call needs a real server to talk to. So instead,
run a tiny local server from inside the `thespot1982` folder:

```bash
# Option A — if you have Node installed
npx serve .

# Option B — if you have Python installed
python3 -m http.server 8000
```

Then open the URL it gives you (e.g. `http://localhost:8000`) in your
browser. On your phone, you can preview it by visiting your computer's
local IP address on the same Wi-Fi (e.g. `http://192.168.1.23:8000`).

## 2. Add your video

Create a folder called `media` next to `index.html`, and drop your file
in as:

```
media/coming-soon.mp4
```

That's the **only file you need** — the page already works with just
this one. If it's missing, the page falls back to a dark teal gradient
so it still looks intentional, never broken.

**Two optional upgrades**, once the basics are working:

- `media/coming-soon.webm` — a WebM version is usually 30–50% smaller
  than MP4 at the same quality. Browsers that support it will use it
  automatically instead of the MP4.
- `media/coming-soon-mobile.mp4` — a smaller, tighter-cropped version
  for phones (e.g. 720×1280 instead of 1920×1080). Phones on cellular
  data will load this instead, which means a faster page and a smaller
  data bill for your visitors.

**Compressing your video** (keeps load times fast on mobile):
- Strip the audio track — it's muted anyway.
- Aim for under ~8MB and 15–20 seconds, looping seamlessly.
- [HandBrake](https://handbrake.fr/) (free, all platforms) is a solid
  tool for this — load your clip, pick the "Fast 1080p30" preset, turn
  off audio, export.

If the footage gets cropped awkwardly on phones vs. desktop, adjust this
line in `style.css`:

```css
.bg-video {
  object-position: center 45%; /* try 30%, 50%, 70% etc. */
}
```

## 3. Connect the signup form

This page has no server of its own, so right now the "Save My Spot"
button just shows a placeholder success message — it doesn't actually
store anyone's info anywhere yet.

The fastest fix is a free form-backend service:

1. Sign up at [Formspree](https://formspree.io) (or
   [Getform](https://getform.io) — both have free tiers).
2. Create a form, and copy the endpoint URL it gives you
   (looks like `https://formspree.io/f/abc123`).
3. Open `script.js` and replace this line near the top:

   ```js
   const SIGNUP_ENDPOINT = "REPLACE_WITH_YOUR_FORM_ENDPOINT";
   ```

   with your real URL. That's it — submissions will start landing in
   your Formspree/Getform inbox (most services can also forward them to
   your email or a Google Sheet).

**About the SMS part:** collecting a phone number on a static page is
easy (it's just a text field), but actually *texting* people needs a
proper platform with carrier compliance built in — a form backend just
stores the number for you. Once you're on Shopify, apps like Klaviyo or
Attentive handle real SMS campaigns. Until then, this form simply
collects the number so you have it ready.

## 4. Update social links

In `index.html`, find the `<div class="socials">` block near the
bottom and replace each `href="#"` with your real profile URL:

```html
<a href="https://instagram.com/yourhandle" aria-label="Instagram">
```

## 5. Customize colors & fonts

Everything lives at the top of `style.css` in `:root`. Change a hex
value there and it updates everywhere it's used:

```css
--teal-deep:  #1E3733;  /* dominant background tone */
--flag-gold:  #D9A441;  /* buttons, accents, focus ring */
--flag-red:   #B23A2E;  /* secondary accent */
--foam:       #EDE6D6;  /* main text color */
```

## 6. Deploy it to thespot1982.store (GitHub Pages)

You already have a GitHub account, and this is free static hosting, so
it's the easiest path. Two ways to get the files up there — pick
whichever feels easier:

**Option A — GitHub Desktop (no terminal commands)**
1. Install [GitHub Desktop](https://desktop.github.com/), sign in.
2. File → New Repository → point it at this `thespot1982` folder (or
   create the repo first, then copy these files into the local folder
   it creates).
3. Commit, then click "Publish repository." Make it Public (GitHub
   Pages on a free plan needs a public repo).

**Option B — command line (e.g. from Spyder's IPython console, or any terminal)**
```bash
cd thespot1982
git init
git add .
git commit -m "Coming soon page"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/thespot1982.git
git push -u origin main
```
(Create the empty repo on github.com first, named `thespot1982`, before
running the `remote add` line — GitHub shows you this exact command on
the repo's page after you create it.)

**Then turn on Pages:**
1. On the repo's GitHub page → **Settings → Pages**.
2. Under "Build and deployment," set Source to **Deploy from a branch**,
   branch **main**, folder **/ (root)**. Save.
3. Your site is now live at `https://YOUR-USERNAME.github.io/thespot1982`.

**Then connect your domain:**
1. Still in **Settings → Pages**, under "Custom domain," type
   `thespot1982.store` and Save. GitHub adds a `CNAME` file to your repo
   automatically — don't delete it.
2. Go to wherever you bought `thespot1982.store` and open its DNS
   settings. Add **four A records**, all with name/host `@`, pointing to:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. Also add a **CNAME record** with name/host `www` pointing to
   `YOUR-USERNAME.github.io` — this makes `www.thespot1982.store` work
   and redirect properly too.
4. Remove any default "parking page" A or CNAME record your registrar
   added when you bought the domain — it'll conflict otherwise.
5. DNS changes can take anywhere from a few minutes to 24 hours. Once it
   resolves, go back to Settings → Pages and tick **Enforce HTTPS**
   (it may be greyed out for a bit until GitHub finishes issuing the
   certificate).

A quick alternative if you'd rather skip DNS for now: GitHub Pages
always works at the free `.github.io` URL above with zero domain setup,
so you can share that link immediately and add the custom domain
whenever you're ready.

When you're ready to move to Shopify, you don't need to migrate
anything — Shopify has its own built-in "password protected / coming
soon" mode you can toggle on instead, and you can reuse this copy and
color palette there if you like the direction.
