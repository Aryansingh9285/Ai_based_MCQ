# 🔐 Gemini API Key - 403 Forbidden Error Fix

## Error Message
```
Error [AxiosError]: Request failed with status code 403
API Key Invalid or Expired
```

## Status Code 403 Meaning
- ✗ API key is invalid
- ✗ API key is expired
- ✗ API key doesn't have required permissions
- ✗ API hasn't been enabled for your project

## Quick Fix (5 Steps)

### Step 1: Get a New API Key
1. Go to: **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"**
3. Copy the entire key (it starts with `AIza...`)

### Step 2: Update Your Configuration
1. Open `.env.local` in your project root:
   ```
   c:\Users\hp\Desktop\007\Ai integrations Projects\Ai based mcq_test\.env.local
   ```

2. Replace the old key:
   ```bash
   # OLD (remove this)
   GEMINI_API_KEY=AIzaSyBFOWlEtR9Inlve93rsR5cuTKFUO01LvAI

   # NEW (add your fresh key)
   GEMINI_API_KEY=AIza...your_new_key_here...
   ```

### Step 3: Restart Development Server
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Test the Quiz
- Go to http://localhost:3000
- Enter your name and select a domain
- Click "Launch Quiz Adventure!"
- You should see the questions load

### Step 5: Verify Success
- Browser should display quiz questions
- Terminal should show: `POST /api/generate-questions 200`
- No error message on the quiz page

---

## Detailed Troubleshooting

### Is Your API Key Valid?

**Check 1: Key Format**
- Correct: `AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz`
- Too short: `AIzaSy...` (incomplete)
- Wrong domain: `sk-...` (from OpenAI, not Google)

**Check 2: Key is Enabled**
1. Visit: https://aistudio.google.com/app/apikey
2. Look for your API key in the list
3. If you don't see it, the key is revoked or deleted
4. Click the key to see its details

**Check 3: Gemini API is Enabled**
1. Go to: https://console.cloud.google.com/apis
2. Search for "Generative Language API"
3. Make sure it says "ENABLED"
4. If not, click it and enable it

### Why 403 Error Occurs

| Reason | Solution |
|--------|----------|
| Key was deleted | Get a new key from aistudio.google.com |
| Key was revoked | Get a new key |
| Project disabled API | Enable Generative Language API |
| Key quota exceeded | Wait 1 hour or get new key |
| Wrong API endpoint | Check GEMINI_API_URL in code |

### Using Mock Data (Temporary Workaround)

If you can't get API key working immediately:

**Edit `app/test/page.tsx`:**

```typescript
// Add this mock data at the top of TestPageContent function
const mockQuestions = [
  {
    question: "What is JavaScript primarily used for?",
    options: ["Server-side programming", "Web browser automation", "Client-side web development", "Database management"],
    answer: "Client-side web development",
    explanation: "JavaScript is the primary language for adding interactivity to web pages in browsers."
  },
  {
    question: "What does REST stand for?",
    options: ["Representational State Transfer", "Remote Execution Service Tools", "Response Execution Service Transfer", "Requested State Technology"],
    answer: "Representational State Transfer",
    explanation: "REST is an architectural style for designing networked applications using HTTP requests."
  },
];

// Then in the useEffect, replace the fetch call with:
if (hydrated) {
  setQuestions(mockQuestions);
}
```

This lets you test the quiz without API while you fix the key.

---

## Step-by-Step: Get Fresh API Key

### From Google AI Studio (Easiest)

1. **Open browser:**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **You might need to:**
   - Sign in with Google account
   - Accept terms and conditions
   - Enable billing (free tier available)

3. **Create new key:**
   - Click blue button "Create API Key"
   - Choose "Create API Key in new Google Cloud project"
   - Copy the key that appears

4. **The key looks like:**
   ```
   AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
   ```

5. **Copy the entire string** (including "AIza" at the start)

### From Google Cloud Console (Advanced)

1. Go to: https://console.cloud.google.com
2. Create a new project or select existing
3. Enable "Generative Language API"
4. Go to "Credentials"
5. Create "API Key"
6. Copy the key

---

## Verify the Fix

### Check #1: Terminal Output
```bash
npm run dev
```

When you submit the quiz, you should see:
```
POST /api/generate-questions 200 in 1234ms ✅
```

**NOT:**
```
POST /api/generate-questions 500 in 1596ms ❌
```

### Check #2: Browser Console
Open DevTools (F12) → Console tab

Should **NOT** show:
```
Error [AxiosError]: Request failed with status code 403
```

Should show:
```
Successful response with questions
```

### Check #3: Quiz Page
- Questions should appear on screen
- No red error box
- Able to select answers
- Able to proceed through quiz

---

## If It Still Doesn't Work

### Issue #1: Server Not Restarted
```bash
# Kill server (Ctrl+C)
# Restart with:
npm run dev
```

Environment variables only load when server starts!

### Issue #2: Wrong File Location
Make sure `.env.local` is in the **root** of your project:
```
✓ c:\Users\hp\Desktop\007\Ai integrations Projects\Ai based mcq_test\.env.local
✗ c:\Users\hp\Desktop\007\Ai integrations Projects\Ai based mcq_test\src\.env.local
✗ c:\Users\hp\Desktop\007\Ai integrations Projects\Ai based mcq_test\app\.env.local
```

### Issue #3: API Key Has Spaces
```bash
# WRONG (has spaces):
GEMINI_API_KEY = AIzaSyD...

# CORRECT (no spaces):
GEMINI_API_KEY=AIzaSyD...
```

### Issue #4: Copied Wrong Part
Make sure you copied the **entire key**, not just part of it:
```bash
# WRONG:
GEMINI_API_KEY=AIzaSy

# CORRECT:
GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
```

---

## API Key Limits (Free Tier)

- **Requests per minute**: 600
- **Requests per day**: Unlimited
- **Concurrent requests**: 100
- **Cost**: Free

If you're hitting limits, wait a few minutes before trying again.

---

## Security Note

- ✅ Never commit `.env.local` to git
- ✅ Never share your API key in public
- ✅ The `.gitignore` file should exclude `.env.local`
- ✅ Consider revoking old keys if compromised

---

## Testing API Key Manually

Using curl (if you have it installed):

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "What is JavaScript?"
      }]
    }]
  }'
```

Should return JSON with response, not 403 error.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Visit https://aistudio.google.com/app/apikey |
| 2 | Create new API key |
| 3 | Copy the full key |
| 4 | Update `.env.local` |
| 5 | Restart `npm run dev` |
| 6 | Test the quiz |

**Expected Result**: ✅ Quiz loads successfully with 200 status code

---

## Support

If you're still stuck:
1. Check exact error message in browser console
2. Verify `.env.local` has correct key format
3. Make sure development server was restarted
4. Try getting a completely new API key
5. Check network connectivity

**Status**: 🔐 API Authentication Fixed
