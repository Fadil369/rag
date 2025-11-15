# 🔐 Cloudflare Authentication Setup

## Setup Wrangler with Your API Token
**Powered by BrainSAIT | برينسايت**

Your Cloudflare API Token: `IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC`

---

## ⚡ Quick Setup (Recommended)

### Run the automated script:
```bash
cd /Users/fadil369/rag
source ./setup-cf-auth.sh
```

This will:
- ✅ Set your API token
- ✅ Verify authentication
- ✅ Show your Cloudflare account info

---

## 🔧 Manual Setup Options

### Option 1: Temporary (Current Session Only)

```bash
export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"

# Verify it works
wrangler whoami
```

**Pros:**
- Quick and easy
- No files modified

**Cons:**
- Need to re-run after closing terminal
- Only works in current session

---

### Option 2: Permanent (Add to Shell Profile)

For **zsh** (macOS default):
```bash
echo 'export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"' >> ~/.zshrc
source ~/.zshrc
```

For **bash**:
```bash
echo 'export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"' >> ~/.bashrc
source ~/.bashrc
```

**Verify:**
```bash
wrangler whoami
```

**Pros:**
- Works in all future sessions
- No need to re-authenticate

**Cons:**
- Token stored in shell config file
- Accessible to all terminal sessions

---

### Option 3: Config File Method

Create Wrangler config file:
```bash
mkdir -p ~/.wrangler
cat > ~/.wrangler/config/default.toml << 'EOF'
api_token = "IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"
EOF
```

**Verify:**
```bash
wrangler whoami
```

**Pros:**
- Wrangler-specific configuration
- Works automatically

**Cons:**
- Token stored in plain text file

---

## ✅ Verify Authentication

After setting up, run:

```bash
wrangler whoami
```

**Expected output:**
```
 ⛅️ wrangler 3.x.x
-------------------
Getting User settings...
👋 You are logged in with an API Token, associated with the email '{your-email}'!
┌──────────────────────────┬──────────────────────────────┐
│ Account Name             │ Account ID                    │
├──────────────────────────┼──────────────────────────────┤
│ {Your Account Name}      │ {Your Account ID}            │
└──────────────────────────┴──────────────────────────────┘
```

If you see this, you're ready to deploy! ✅

---

## 🚀 Next Steps After Authentication

Once authenticated, you can proceed with deployment:

### 1. Setup API Keys (AI Providers)
```bash
./setup-secrets.sh
```

### 2. Deploy Everything
```bash
./deploy.sh
```

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Solution 1:** Check if token is set
```bash
echo $CLOUDFLARE_API_TOKEN
# Should show: IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC
```

**Solution 2:** Re-export the token
```bash
export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"
```

**Solution 3:** Check token permissions
- Go to: https://dash.cloudflare.com/profile/api-tokens
- Verify the token has:
  - Workers Scripts: Edit
  - Account Settings: Read
  - Zone: Read

---

### Error: "wrangler: command not found"
Install Wrangler:
```bash
npm install -g wrangler
```

Or with Homebrew:
```bash
brew install cloudflare-wrangler2
```

---

### Error: "Invalid API token"
The token might be:
1. Expired - Create a new one at https://dash.cloudflare.com/profile/api-tokens
2. Missing permissions - Check token settings
3. Typo - Verify the token matches exactly

---

## 🔒 Security Best Practices

### Do This ✅
- Keep API token secret
- Don't commit to Git (already in .gitignore)
- Rotate token periodically
- Use environment variables

### Don't Do This ❌
- Share token in chat/email
- Commit to version control
- Use in client-side code
- Share screenshots with token visible

---

## 📋 Quick Reference

### Set Token (Temporary)
```bash
export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"
```

### Set Token (Permanent - zsh)
```bash
echo 'export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"' >> ~/.zshrc
source ~/.zshrc
```

### Verify
```bash
wrangler whoami
```

### Remove Token (if needed)
```bash
unset CLOUDFLARE_API_TOKEN
# Or remove from ~/.zshrc and reload
```

---

## 🎯 Complete Setup Flow

```bash
# 1. Authenticate with Cloudflare
source ./setup-cf-auth.sh

# 2. Verify authentication
wrangler whoami

# 3. Setup AI provider secrets
./setup-secrets.sh

# 4. Deploy everything
./deploy.sh

# 5. Configure custom domains (in Cloudflare Dashboard)
# - rag-api.brainsait.io (Worker)
# - rag.brainsait.io (Pages)
```

---

## 📞 Need Help?

### Cloudflare Dashboard
- API Tokens: https://dash.cloudflare.com/profile/api-tokens
- Workers: https://dash.cloudflare.com/?to=/:account/workers
- DNS: https://dash.cloudflare.com/?to=/:account/:zone/dns

### Documentation
- Wrangler Auth: https://developers.cloudflare.com/workers/wrangler/commands/#login
- API Tokens: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

### BrainSAIT Support
- Email: support@brainsait.io
- Website: https://brainsait.io

---

## ✨ Ready to Deploy?

Once you see your account info from `wrangler whoami`, you're ready!

**Next command:**
```bash
./setup-secrets.sh && ./deploy.sh
```

---

**Powered by BrainSAIT | برينسايت**

🇸🇦 Leading the AI revolution in the Arab world
