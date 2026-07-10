# Yaser Khan Chowdhury - State Minister Portfolio Website

This is a premium, high-performance portfolio website built using Next.js 16 (App Router), styled with vanilla CSS, and backed by MongoDB. It is designed specifically to serve as a secure, fast, and accessible portal for the State Minister of Information & Broadcasting.

---

## 🚀 Pre-Deployment Checklist

Before going live, ensure you have gathered:
1. **Domain Name**: Purchased from a registrar (e.g., Namecheap, GoDaddy, Dynadot).
2. **MongoDB Atlas Connection String**: A free or paid cloud database instance.
3. **SMTP Email Credentials**: SMTP details (like Google Workspace, Gmail App Password, or cPanel Mail) to forward messages from the contact form to `contact@yaserkhanchowdhury.com`.

---

## 🛠️ Step 1: Set Up Cloud Database (MongoDB Atlas)

Since local databases (`mongodb://127.0.0.1:27017`) cannot be reached by cloud hosts, you must host your data on a cloud database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. Create a new cluster (select the **M0 Free tier**).
3. In the security settings:
   - Add a database user with a username and strong password.
   - Set IP Access List to `0.0.0.0/0` (Allow access from anywhere) so serverless providers like Vercel can connect.
4. Go to the Database dashboard, click **Connect** -> **Drivers** -> copy the connection string. It will look like this:
   ```env
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Keep this string ready for your environment variables.

---

## 📤 Step 2: Choose Your Hosting Option

### Option A: Vercel (Recommended - Fastest & Easiest)
Vercel is the creator of Next.js, and offers free, high-speed global CDN hosting for frontends.

1. Push your repository code to a private GitHub, GitLab, or Bitbucket repository.
2. Sign up at [Vercel.com](https://vercel.com) using your GitHub account.
3. Click **Add New** -> **Project** -> Import your repository.
4. Expand the **Environment Variables** section and add the following keys:
   * `MONGODB_URI`: *[Your MongoDB Atlas connection string]*
   * `SMTP_HOST`: `smtp.gmail.com` *(or your custom SMTP host)*
   * `SMTP_PORT`: `587` *(or 465)*
   * `SMTP_USER`: *[Your SMTP username]*
   * `SMTP_PASS`: *[Your SMTP App Password]*
5. Click **Deploy**. Vercel will build and launch your site in under 2 minutes.

---

### Option B: Self-Hosted VPS (DigitalOcean, Linode, AWS)
If you prefer running on a dedicated Linux VPS:

1. Connect to your VPS via SSH and install Node.js (v20+), Git, and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   sudo npm install -g pm2
   ```
2. Clone your repository, navigate to the folder, and create a `.env.local` file with your variables:
   ```env
   MONGODB_URI=mongodb+srv://...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
3. Install dependencies, build the application, and run it with PM2:
   ```bash
   npm install
   npm run build
   pm2 start npm --name "minister-portfolio" -- start
   ```
4. Setup Nginx as a reverse proxy to forward traffic from Port `80`/`443` to Port `3000`.

---

## 🌐 Step 3: Link Your Custom Domain

### If using Vercel:
1. Go to your project dashboard on Vercel -> **Settings** -> **Domains**.
2. Type your purchased domain (e.g., `yaserkhanchowdhury.com`) and click **Add**.
3. Vercel will display the DNS records you need to update at your domain registrar. Typically:
   * **A Record**: Point `@` to `76.76.21.21`
   * **CNAME Record**: Point `www` to `cname.vercel-dns.com`
4. Update these records in your domain registrar's DNS panel (e.g. Namecheap, GoDaddy).
5. Vercel will automatically generate a free SSL certificate (`https://`) within a few minutes of DNS verification.

### If using VPS:
Point your domain's A record directly to your VPS public IP address and configure Certbot (Let's Encrypt) in Nginx for SSL:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yaserkhanchowdhury.com -d www.yaserkhanchowdhury.com
```

---

## 🔒 Security Best Practices for Production
* **Never commit credentials**: Ensure `.env.local` remains in your `.gitignore` file and is never uploaded to public version control.
* **Database Access**: Limit database permissions on MongoDB Atlas to the specific portfolio database user.
* **Email Safety**: Use Gmail "App Passwords" or SMTP API keys instead of your main account password.
# ykc
