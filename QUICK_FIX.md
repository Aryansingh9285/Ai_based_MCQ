# 🚀 Quick Action Plan - Fix 403 API Error

## You're Getting This Error:
```
Error [AxiosError]: Request failed with status code 403
```

## Why It's Happening:
Your Gemini API key is **invalid, expired, or revoked**.

## ✅ Fix It Now (2 Minutes)

### Action 1️⃣: Get New API Key
```
1. Open: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API Key in new Google Cloud project"
4. Copy the new key (looks like: AIzaSyD1234567...)
```

### Action 2️⃣: Update Your Config
```
1. Open file: .env.local
2. Find line: GEMINI_API_KEY=AIzaSy...
3. Replace entire value with new key:
   GEMINI_API_KEY=AIzaSyD...your_new_key...
```

### Action 3️⃣: Restart Server
```bash
# In terminal (where npm run dev is running):
# Press: Ctrl+C (to stop)
# Then run:
npm run dev
```

### Action 4️⃣: Test It
```
1. Open: http://localhost:3000
2. Enter name: "Test"
3. Select domain: "JavaScript"
4. Click: "Launch Quiz Adventure!"
5. Should show questions ✅
```

---

## That's It!

If questions appear → **You're done!** ✅

If error appears → See **API_KEY_FIX_GUIDE.md** for detailed help

---

## What We Fixed in Code

✅ Better error messages  
✅ Loading indicator while fetching  
✅ User-friendly error display  
✅ Rate limit handling  
✅ Specific 403 error guidance  

---

## Files You Need to Edit

Only **one file needs your action:**
```
.env.local
```

Change this line:
```bash
GEMINI_API_KEY=AIzaSyBFOWlEtR9Inlve93rsR5cuTKFUO01LvAI
```

To:
```bash
GEMINI_API_KEY=AIza...YOUR_NEW_KEY_HERE...
```

---

## Common Mistakes to Avoid

❌ **Don't:**
- Add quotes: `GEMINI_API_KEY="AIzaSy..."`
- Add spaces: `GEMINI_API_KEY = AIzaSy...`
- Copy only part: `GEMINI_API_KEY=AIzaSy`

✅ **Do:**
- Copy the entire key
- No spaces or quotes
- Exact format: `GEMINI_API_KEY=AIza...`

---

## How to Know It Worked

| Sign | Meaning |
|------|---------|
| Questions appear on screen | ✅ Working! |
| Red error box | ❌ Still broken |
| Loading spinner | ⏳ Fetching (wait) |
| Terminal shows `200` | ✅ API success |
| Terminal shows `403` | ❌ Bad key |

---

**Time to fix: ~2 minutes**  
**Difficulty: Easy**  
**Files to change: 1**  

Ready? Get that new API key! 🔑
