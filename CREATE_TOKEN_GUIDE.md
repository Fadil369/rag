# 🔑 Create Cloudflare API Token - Step by Step

## Visual Guide to Creating Your Token
**Powered by BrainSAIT | برينسايت**

---

## 🎯 **Quick Start**

1. Open: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Click "Create Token"
5. Copy the token
6. Run `./setup-new-token.sh` and paste it

---

## 📸 **Detailed Step-by-Step Guide**

### **Step 1: Navigate to API Tokens**

```bash
open https://dash.cloudflare.com/profile/api-tokens
```

**What you'll see:**
- Page title: "API Tokens"
- Blue button: "Create Token"
- List of any existing tokens

---

### **Step 2: Click "Create Token"**

**Location:** Top right of the page (blue button)

**What happens:**
- Opens token creation wizard
- Shows list of templates

---

### **Step 3: Find "Edit Cloudflare Workers" Template**

**Look for:**
```
┌─────────────────────────────────────┐
│  Edit Cloudflare Workers            │
│  ⚙️ Workers Scripts: Edit           │
│                                     │
│  [Use template]                     │
└─────────────────────────────────────┘
```

**Click:** "Use template" button

**✨ This is the important one!** It has all the permissions you need.

---

### **Step 4: Review Permissions (Don't Change Anything)**

You'll see:

**Account Resources:**
- ✅ Workers Scripts: Edit
- ✅ Workers KV Storage: Edit
- ✅ Workers Routes: Edit
- ✅ Workers Tail: Read
- ✅ User Details: Read

**Zone Resources:**
- ✅ Zone: Read
- ✅ Workers Routes: Edit

**These are perfect! Don't change them.**

---

### **Step 5: Scroll Down and Click "Continue to summary"**

**Review shows:**
- Template name
- Permissions granted
- TTL (Time to Live)

**Click:** "Continue to summary" (blue button)

---

### **Step 6: Click "Create Token"**

**Final confirmation page:**
- Shows what the token can do
- Warning: You can only see the token once!

**Click:** "Create Token" (blue button)

---

### **Step 7: COPY THE TOKEN IMMEDIATELY**

**CRITICAL:** This is the only time you'll see the full token!

**What you'll see:**
```
┌────────────────────────────────────────────┐
│  Your token has been created               │
│                                            │
│  aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcd │
│                                            │
│  [Copy] button                             │
└────────────────────────────────────────────┘
```

**Actions:**
1. Click the "Copy" button OR
2. Manually select and copy the entire token
3. Paste it somewhere safe temporarily

**⚠️ If you close this page without copying, you'll need to create a new token!**

---

### **Step 8: Save the Token**

Now that you have the token, run our setup script:

```bash
cd /Users/fadil369/rag
./setup-new-token.sh
```

**It will:**
1. Ask you to paste the token
2. Verify it works
3. Test with Wrangler
4. Set it up for deployment

---

## ✅ **Verification Checklist**

After creating and setting up your token:

- [ ] Token copied from Cloudflare
- [ ] Pasted into `./setup-new-token.sh`
- [ ] Script says "Token is VALID!"
- [ ] `wrangler whoami` shows your account
- [ ] Ready to deploy!

---

## 🎯 **What the Token Looks Like**

**Valid token format:**
- 40-50 characters long
- Mix of letters and numbers
- Example: `aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcd`

**NOT valid:**
- `1234567893feefc5f0q5000bfo0c38d90bbeb` ❌ (too short/sample)
- `your-token-here` ❌ (placeholder)
- Tokens with spaces ❌

---

## 🔒 **Security Tips**

### ✅ Do This:
- Copy token immediately
- Store securely
- Use environment variable
- Rotate periodically

### ❌ Don't Do This:
- Share in chat/email
- Commit to Git
- Screenshot and share
- Use same token everywhere

---

## 🐛 **Troubleshooting**

### "Invalid request headers"
- Token is wrong/invalid
- Create a new one following steps above

### "Authentication error [code: 10000]"
- Token lacks permissions
- Make sure you used "Edit Cloudflare Workers" template

### "Can't find Edit Cloudflare Workers template"
- Scroll down in templates list
- Look for Workers icon (⚙️)
- Or create custom token with Workers permissions

---

## 📋 **Quick Reference**

### Create Token
```
1. Visit: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Click "Continue to summary"
5. Click "Create Token"
6. Copy the token
```

### Setup Token
```bash
./setup-new-token.sh
# Paste token when prompted
```

### Verify Token
```bash
export CLOUDFLARE_API_TOKEN="your-token"
wrangler whoami
```

### Deploy
```bash
./setup-secrets.sh
./deploy.sh
```

---

## 🚀 **After Token Creation**

Once you have a valid token and `./setup-new-token.sh` succeeds:

```bash
# You're now authenticated!

# Next step: Setup AI provider secrets
./setup-secrets.sh

# Then: Deploy everything
./deploy.sh
```

---

## 💡 **Why This Template?**

The "Edit Cloudflare Workers" template is special because it:

✅ Includes all permissions needed for Workers deployment
✅ Includes secrets management permissions
✅ Includes KV storage permissions
✅ Includes routing permissions
✅ Pre-configured by Cloudflare experts
✅ Most commonly used for Workers development

**It's the easiest and safest option!**

---

## 📞 **Need Help?**

### Token Creation Issues
- Cloudflare Dashboard: https://dash.cloudflare.com
- Cloudflare Support: https://support.cloudflare.com

### Deployment Issues
- See: `AUTH_FIX_GUIDE.md`
- See: `CLOUDFLARE_DEPLOYMENT.md`

---

## ✨ **Ready?**

1. **Open:** https://dash.cloudflare.com/profile/api-tokens
2. **Create:** Token using "Edit Cloudflare Workers" template
3. **Copy:** The token
4. **Run:** `./setup-new-token.sh`
5. **Deploy:** `./setup-secrets.sh && ./deploy.sh`

---

**Powered by BrainSAIT | برينسايت**

🇸🇦 Leading the AI revolution in the Arab world
