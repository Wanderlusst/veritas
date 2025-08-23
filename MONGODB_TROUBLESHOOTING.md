# 🚨 MongoDB Connection Troubleshooting Guide

## ❌ **Current Issue**: 500 Internal Server Error on `/api/posts`

Your MongoDB connection is failing on Vercel. Here's how to fix it:

---

## 🔍 **Step 1: Check Vercel Environment Variables**

### **1.1 Go to Vercel Dashboard**
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **veritas** project
3. Go to **Settings → Environment Variables**

### **1.2 Verify These Variables Are Set**:
```bash
# REQUIRED - Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veritas?retryWrites=true&w=majority

# REQUIRED - NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL=https://veritas-c8o4.vercel.app

# REQUIRED - App Configuration
NODE_ENV=production
```

### **1.3 Environment Variable Setup**:
- ✅ **Production Environment**: Add all variables
- ✅ **Preview Environment**: Add all variables  
- ✅ **Development Environment**: Add all variables

---

## 🔐 **Step 2: Fix MongoDB Atlas Network Access**

### **2.1 Allow Vercel IP Addresses**
Go to [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access** and add:

```
# Option 1: Allow All IPs (Less Secure)
0.0.0.0/0

# Option 2: Allow Vercel IPs (More Secure)
76.76.19.36/32
76.76.19.37/32
76.76.19.38/32
76.76.19.39/32
76.76.19.40/32
```

### **2.2 Verify Database User Permissions**
1. Go to **Database Access**
2. Check your user has **Read and Write** permissions
3. Ensure user is **not** restricted by IP

---

## 🔧 **Step 3: Test MongoDB Connection**

### **3.1 Test Locally First**
```bash
# In your local project
npm run dev
# Check if MongoDB connects locally
```

### **3.2 Test Connection String Format**
Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/veritas?retryWrites=true&w=majority
```

**Common Issues**:
- ❌ **Wrong password** - Check special characters
- ❌ **Wrong database name** - Should be `veritas`
- ❌ **Wrong cluster name** - Verify in Atlas
- ❌ **Network restrictions** - Check IP whitelist

---

## 🚀 **Step 4: Redeploy After Fixes**

### **4.1 Force Redeploy**
```bash
# Push a small change to trigger redeploy
git add .
git commit -m "🔧 Fix MongoDB connection"
git push origin main
```

### **4.2 Check Vercel Logs**
1. Go to **Vercel Dashboard → Functions**
2. Click on your failed function
3. Check **Function Logs** for MongoDB errors

---

## 🐛 **Step 5: Debug Common Issues**

### **Issue 1: Environment Variables Not Set**
**Symptoms**: `MONGODB_URI is not defined`
**Fix**: Set environment variables in Vercel dashboard

### **Issue 2: Network Access Denied**
**Symptoms**: `ECONNREFUSED` or `ENOTFOUND`
**Fix**: Add Vercel IPs to MongoDB Atlas whitelist

### **Issue 3: Authentication Failed**
**Symptoms**: `Authentication failed`
**Fix**: Check username/password in connection string

### **Issue 4: Database Not Found**
**Symptoms**: `Database veritas not found`
**Fix**: Create database or check database name

---

## 📱 **Step 6: Test Your Fix**

### **6.1 Test Health Check**
```bash
curl https://veritas-c8o4.vercel.app/api/health
```

### **6.2 Test Posts API**
```bash
curl https://veritas-c8o4.vercel.app/api/posts?page=1&limit=10
```

### **6.3 Expected Response**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-08-23T...",
    "uptime": 123.45
  }
}
```

---

## 🔒 **Step 7: Security Best Practices**

### **7.1 Environment Variables**
- ✅ **Never commit** `.env.local` to git
- ✅ **Use Vercel dashboard** for production secrets
- ✅ **Rotate secrets** regularly

### **7.2 MongoDB Atlas**
- ✅ **Use strong passwords**
- ✅ **Limit IP access** when possible
- ✅ **Enable MFA** on Atlas account

---

## 🆘 **Still Having Issues?**

### **Check Vercel Function Logs**:
1. Go to **Vercel Dashboard → Functions**
2. Find your failed function
3. Click **View Function Logs**
4. Look for MongoDB connection errors

### **Common Error Messages**:
```
❌ "MONGODB_URI is not defined" → Set environment variable
❌ "ECONNREFUSED" → Check network access
❌ "Authentication failed" → Check username/password
❌ "Database not found" → Check database name
```

---

## ✅ **Success Checklist**

- [ ] **Environment variables** set in Vercel
- [ ] **MongoDB Atlas** network access configured
- [ ] **Database user** has correct permissions
- [ ] **Connection string** format is correct
- [ ] **Application redeployed** after fixes
- [ ] **Health check** endpoint working
- [ ] **Posts API** returning data

---

## 🎯 **Quick Fix Summary**

1. **Set MONGODB_URI** in Vercel environment variables
2. **Allow Vercel IPs** in MongoDB Atlas
3. **Redeploy** your application
4. **Test** the health check endpoint

**🚀 Your MongoDB connection should work after these steps!**
