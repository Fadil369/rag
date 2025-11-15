# 🔧 Authentication Fix Guide

## The Issue
OAuth login timed out after 2 minutes waiting for browser authorization.

---

## 🎯 **Best Solution: Create Proper API Token**

This is easier and more reliable than OAuth for CLI usage.

### Step 1: Create Token with Correct Permissions

1. **Go to:** https://dash.cloudflare.com/profile/api-tokens

2. **Click:** "Create Token"

3. **Choose Template:** "Edit Cloudflare Workers"
   - This gives all necessary permissions automatically

4. **OR Create Custom Token with these permissions:**

   **Account Permissions:**
   - ✅ Workers Scripts: Edit
   - ✅ Workers KV Storage: Edit
   - ✅ Workers Routes: Edit
   - ✅ Workers Tail: Read
   - ✅ Account Settings: Read

   **Zone Permissions:**
   - ✅ Zone: Read
   - ✅ Workers Routes: Edit

5. **Click:** "Continue to summary"

6. **Click:** "Create Token"

7. **Copy the token** (starts with something like `xxxx...`)

### Step 2: Use the New Token

```bash
cd /Users/fadil369/rag

# Set the new token
export CLOUDFLARE_API_TOKEN="paste-your-new-token-here"

# Verify it works
wrangler whoami

# If it works, make it permanent:
echo 'export CLOUDFLARE_API_TOKEN="paste-your-new-token-here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Deploy

```bash
./setup-secrets.sh
./deploy.sh
```

---

## 🔄 **Alternative: Fix OAuth Login**

If you prefer OAuth, try these fixes:

### Option A: Manual Browser Opening

```bash
./manual-login.sh
```

**Then:**
1. Watch terminal for URL
2. If browser doesn't open automatically, manually copy URL and paste in browser
3. Click "Allow" quickly (< 2 minutes)

### Option B: Try Different Port

```bash
wrangler login --browser --host localhost --port 8977
```

### Option C: Disable Browser Auto-Open

```bash
wrangler login --no-browser
```

This will show you the URL. Copy it manually and open in browser.

---

## 📋 **Quick Reference**

### Check Current Auth
```bash
wrangler whoami
```

### Clear Auth and Start Over
```bash
wrangler logout
wrangler login
```

### Use API Token (Recommended)
```bash
export CLOUDFLARE_API_TOKEN="your-token"
wrangler whoami  # Verify
```

---

## 🎯 **Recommended: Use API Token Template**

**Easiest method - 2 minutes:**

1. Visit: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Select **"Edit Cloudflare Workers"** template
4. Click "Use template"
5. Click "Continue to summary"
6. Click "Create Token"
7. Copy token
8. Run:
   ```bash
   export CLOUDFLARE_API_TOKEN="token-you-just-copied"
   wrangler whoami
   ```

If you see your account name, you're ready! ✅

---

## ✅ **After Authentication Works**

Once `wrangler whoami` shows your account:

```bash
# Setup AI provider secrets
./setup-secrets.sh

# Deploy everything
./deploy.sh
```

---

## 🐛 **Troubleshooting**

### "Authentication error [code: 10000]"
- Token lacks permissions
- Use "Edit Cloudflare Workers" template

### "Timed out waiting for authorization code"
- Browser didn't open
- Use API token instead (recommended)

### "Invalid API token"
- Token expired
- Create new token

### "wrangler: command not found"
```bash
npm install -g wrangler
```

---

## 💡 **Why API Token is Better for This**

| Method | Pros | Cons |
|--------|------|------|
| **API Token** | ✅ No browser needed<br>✅ Works in CI/CD<br>✅ Can be revoked easily | ❌ Manual permission setup |
| OAuth | ✅ Easy initial setup | ❌ Requires browser<br>❌ Can timeout<br>❌ Harder to automate |

**For deployment automation, API Token is recommended.**

---

## 🚀 **Next Steps**

1. **Create API token** using "Edit Cloudflare Workers" template
2. **Set token:**
   ```bash
   export CLOUDFLARE_API_TOKEN="your-new-token"
   ```
3. **Verify:**
   ```bash
   wrangler whoami
   ```
4. **Deploy:**
   ```bash
   ./setup-secrets.sh && ./deploy.sh
   ```

---

**Powered by BrainSAIT | برينسايت**
