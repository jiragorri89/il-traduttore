# Il Traduttore — Launch Guide (no terminal required)

Everything here happens in your web browser. Total time to a live product: about 2 hours.

---

## Step 1 — Put the code on GitHub (15 min)

1. Create a free account at **github.com**.
2. Click **+** (top right) → **New repository**. Name: `il-traduttore`. Keep it **Private**. Create.
3. On the empty repo page, click **"uploading an existing file"**.
4. Drag in ALL the files from this folder — including the `api` folder (drag the folder itself; GitHub keeps the structure). Files: `index.html`, `manifest.json`, `icon-192.png`, `icon-512.png`, and `api/translate.js`.
5. Click **Commit changes**.

## Step 2 — Deploy on Vercel (15 min)

1. Go to **vercel.com** → sign up → **Continue with GitHub**.
2. Click **Add New → Project** → Import `il-traduttore`.
3. Before deploying, open **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = your key from console.anthropic.com (create one there if needed)
   - `SKIP_LICENSE_CHECK` = `true`   ← temporary, lets YOU test AI mode before payments exist
4. Click **Deploy**. In ~1 minute you get a live URL like `il-traduttore.vercel.app`.
5. Open it on your phone. Test: dictionary lookup, audio, AI mode (tap "I have a license key" and enter anything — with SKIP_LICENSE_CHECK on, any key works).
6. **Set a spend cap now**: console.anthropic.com → Billing → set a monthly limit ($10 is plenty to start).

**Add to Home Screen** (this is what makes it feel like an app):
iPhone Safari → Share button → **Add to Home Screen**. It gets your icon and opens full-screen.


## Step 2b — Watch how your class uses it (10 min)

Two free tools, both anonymous (no cookies, no personal data):

**Visitors — Vercel Analytics.** In your Vercel project → Analytics tab → Enable. That's it (the code is already in the app). You'll see daily visitors and returning users — your retention signal.

**What they search — GoatCounter.** This is the gold: every word looked up, every word the dictionary MISSED, every AI translation.
1. Sign up free at **goatcounter.com** — pick a code (e.g. `iltraduttore`).
2. In GitHub, edit `index.html` → find `const GOATCOUNTER_CODE = ""` → put your code between the quotes → Commit. Vercel redeploys automatically.
3. Your dashboard at `iltraduttore.goatcounter.com` now shows paths like:
   - `/lookup/allora` — dictionary hits (what the class is studying)
   - `/miss/qualsiasi` — words NOT in the dictionary ← **this is your to-do list; send these to Claude weekly to add them**
   - `/ai/chiacchierare` — AI lookups
   - `/add-word` — personal dictionary adds

**Be straight with your class**: one sentence when you share the link — "it collects anonymous usage stats (which words get searched) so I can improve it." No names, no accounts, nothing personal — but say it anyway.

**What to look for after 2 weeks:** Are people coming back without you reminding them? (Retention = the only signal that predicts anyone would ever pay.) Which misses repeat? (Content roadmap.) Is AI mode or dictionary mode winning? (Tells you where the value is.)

## Step 3 — Set up payments with Lemon Squeezy (30 min)

Lemon Squeezy handles checkout, credit cards, sales tax/VAT worldwide, and license keys — you write zero code. They take ~5% + payment fees.

1. Sign up at **lemonsqueezy.com**, activate your store (identity verification takes minutes to a day).
2. **Products → New Product**:
   - Name: Il Traduttore Pro
   - Pricing: **Subscription**, $19/year
   - Under the product's variant settings, enable **License keys** (this is the critical switch — it's what generates a key per buyer)
3. Publish the product and copy its **Buy link** (looks like `https://YOURSTORE.lemonsqueezy.com/buy/...`).
4. In GitHub, open `index.html` → click the pencil icon (edit) → find `__PAYMENT_LINK__` and replace it with your Buy link → Commit. Vercel redeploys automatically in ~1 min.
5. In Vercel → Settings → Environment Variables → change `SKIP_LICENSE_CHECK` to `false` → **Redeploy** (Deployments tab → ⋯ → Redeploy).
6. **Test the full loop**: buy your own product (LS has a test mode — use it), get the license email, tap "I have a license key" in the app, paste it, run an AI lookup. If it translates: you have a working paid product.

How the money flows: buyer pays on Lemon Squeezy → gets emailed a license key → enters it once in the app → every AI request sends the key to your server → server checks it with Lemon Squeezy → valid keys get translations. Cancelled subscriptions automatically stop validating.

## Step 4 — Make it findable (ongoing)

- **Name your URL**: Vercel → Settings → Domains. Free option: pick a better `something.vercel.app` name. Better: buy a domain (~$12/yr) like `iltraduttore.app` and connect it — required for looking legit.
- Where your buyers are (post in Spanish — that's your edge and the product's edge):
  - Reddit: r/italianlearning, r/Italian (English but active)
  - Facebook: groups for "ciudadanía italiana" — Argentines/Latinos applying for Italian citizenship by descent are the single most motivated Spanish-speaking Italian-learner population on the internet
  - TikTok/Reels: "falsos amigos italiano-español" content. "En italiano, BURRO es mantequilla 🤯" is a proven viral format — each video is an ad for your app
- Launch price idea: first 100 customers $9/year ("precio fundador"), then $19.

## Step 5 — Before charging money (important)

- **Spot-check the dictionary**: the 1,081 entries were AI-written. Check a random 50 against WordReference. Fix anything off (edit `index.html` on GitHub — entries are readable JSON). Your credibility is the product.
- **Add a privacy line**: a simple page or footer text: "Dictionary mode works entirely on your device. In AI mode, the word you type is sent to our server and Anthropic's API to generate the translation; it is not stored. Your personal word list stays on your device." Lemon Squeezy checkout covers payment terms.
- Refund policy: set one in Lemon Squeezy (14-day no-questions is standard and builds trust).

## Costs

| Item | Cost |
|---|---|
| GitHub, Vercel | free |
| Lemon Squeezy | ~5% + fees per sale, no monthly cost |
| AI lookups | ~$0.001 each (only Pro users trigger them) |
| Domain (optional) | ~$12/yr |

Break-even is roughly your domain cost. Everything else scales with revenue.

## When something breaks

Paste the error (browser console: right-click → Inspect → Console, or Vercel → Deployments → logs) into your Claude chat. Most fixes are one line.
