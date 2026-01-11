# API Error Troubleshooting Guide

## Error: POST /api/generate-questions 500

This error indicates that the Gemini API request is failing. Follow these steps to resolve it:

### **Step 1: Verify API Key Configuration**

1. **Get your Gemini API Key:**
   - Visit: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the generated key

2. **Configure Environment Variable:**
   - Create a `.env.local` file in the project root
   - Add: `GEMINI_API_KEY=your_api_key_here`
   - Example: `GEMINI_API_KEY=AIzaSyD1234567890abcdefghijk...`

3. **Verify the file:**
   ```
   c:\Users\hp\Desktop\007\Ai integrations Projects\Ai based mcq_test\.env.local
   ```

### **Step 2: Restart the Development Server**

After adding the API key:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The server must restart to pick up the new environment variables.

### **Step 3: Check Network and API Access**

1. **Verify internet connectivity** - The app needs to access Google's API servers
2. **Check firewall/proxy** - Ensure your network allows HTTPS requests to googleapis.com
3. **Test API key validity** - The key might have expired or been revoked

### **Step 4: Monitor Browser Console**

1. Open DevTools (F12)
2. Go to Network tab
3. Click Submit on the quiz
4. Look for the `/api/generate-questions` request
5. Click on it and check the Response tab for error details

### **Step 5: Check Server Logs**

Look at your terminal where `npm run dev` is running for detailed error messages:

```
Gemini API Error: {
  status: 401,
  statusText: 'Unauthorized',
  error: '...'
}
```

### **Common Error Codes**

| Status | Meaning | Solution |
|--------|---------|----------|
| **401** | Unauthorized | Invalid or expired API key |
| **403** | Forbidden | API key doesn't have permission |
| **429** | Too Many Requests | Rate limit exceeded, wait before retrying |
| **500** | Internal Server Error | Gemini API service issue |

### **Manual API Testing**

Test the API directly with curl:

```bash
curl -X POST http://localhost:3000/api/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"domain":"JavaScript"}'
```

### **Step 6: Verify File Structure**

Ensure all files exist:
```
✓ pages/api/generate-questions.ts
✓ .env.local (with GEMINI_API_KEY)
✓ app/page.tsx
✓ app/test/page.tsx
✓ components/QuestionCard.tsx
```

### **Alternative: Use Mock Data for Testing**

If you can't get the API key working immediately, you can temporarily use mock questions:

1. Edit `app/test/page.tsx`
2. Replace the fetch with mock data:

```typescript
const mockQuestions = [
  {
    question: "What is JavaScript?",
    options: ["Programming Language", "Markup Language", "Framework", "Database"],
    answer: "Programming Language",
    explanation: "JavaScript is a programming language used for web development."
  }
];

if (hydrated) {
  setQuestions(mockQuestions); // Use mock instead of fetch
}
```

### **Reset Everything**

If nothing works:

```bash
# Delete node_modules and cache
rm -rf node_modules .next
npm install
npm run dev
```

Then add your `.env.local` file again.

---

## Required Environment Variables

```env
GEMINI_API_KEY=your_actual_api_key_from_aistudio.google.com
```

## Support

If the error persists:
1. Check the exact error message in the browser console
2. Verify the API key is valid and has proper permissions
3. Ensure `.env.local` is in the correct location
4. Check that the development server has restarted after adding the key
