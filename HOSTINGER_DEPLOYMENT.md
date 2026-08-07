# AZM Group - Hostinger Shared Hosting Deployment Guide

This guide provides step-by-step instructions to deploy the AZM Group platform (a React frontend with potentially a PHP/MySQL or Firebase backend) to Hostinger shared hosting.

## 1. Production Build Command

To prepare the React application for production, run the following command in your local terminal:

```bash
npm run build
```

*(This command uses Vite to bundle the application and output the production-ready static files).*

## 2. Build-Output Instructions

After the build process completes, a new directory named `dist/` will be generated in your project root. 
This folder contains the compiled HTML, CSS, JavaScript, and assets required for the frontend.

**Important Files in `dist/`:**
* `index.html` - The main entry point
* `assets/` - Contains all compiled scripts and stylesheets
* `.htaccess` - (If placed in `public/`, it will be copied to `dist/.htaccess` automatically)

## 3. Upload Instructions

1. Log in to your **Hostinger hPanel**.
2. Navigate to **Websites > Manage > File Manager**.
3. Open the `public_html/` folder.
4. **Clean up:** Delete the default `default.php` or `index.php` if it's a fresh Hostinger setup.
5. **Upload:** Drag and drop the *contents* of your local `dist/` folder directly into `public_html/`. 
6. Ensure that `index.html` and `.htaccess` sit directly at the root of `public_html/`.

Your structure should look like this:
```
public_html/
├── index.html
├── .htaccess
├── assets/
├── api/ (If you have PHP backend files)
└── uploads/ (For user-uploaded media)
```

## 4. MySQL Database Creation Guide

If you are using a MySQL backend alongside or instead of Firebase:
1. Go to **Hostinger hPanel > Databases > Management**.
2. Under "Create a New MySQL Database and Database User", enter:
   * **Database Name:** e.g., `azmgroup_db`
   * **MySQL Username:** e.g., `azmgroup_user`
   * **Password:** Generate a strong password and save it securely.
3. Click **Create**.

## 5. SQL Import Guide

1. In hPanel, go to **Databases > phpMyAdmin**.
2. Click **Enter phpMyAdmin** next to your newly created database.
3. In phpMyAdmin, select your database from the left sidebar.
4. Click the **Import** tab at the top.
5. Choose your `.sql` export file.
6. Click **Go** to import the tables and initial data.

## 6. Database Credential Configuration

For your backend API (if using PHP/Node on Hostinger), you must configure the credentials:
1. Open your API configuration file (e.g., `api/config.php` or `.env`).
2. Update it with the Hostinger database details:
```env
DB_HOST=localhost
DB_NAME=u123456789_azmgroup_db
DB_USER=u123456789_azmgroup_user
DB_PASS=YourStrongPasswordHere!
```
*(Note: Hostinger automatically prefixes DB names and usernames with an ID).*

## 7. SMTP Configuration

To ensure emails (Contact Forms, Quotations) are delivered reliably:
1. In hPanel, go to **Emails > Email Accounts**.
2. Create a new email address (e.g., `info@azmgroup.ae`).
3. View the **Configuration Settings** for SMTP.
4. Update your backend or `.env` file with these details:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@azmgroup.ae
SMTP_PASS=YourEmailPassword
SMTP_ENCRYPTION=ssl
```

## 8. File-Permission Guide

Incorrect permissions will cause HTTP 403 Forbidden or 500 Internal Server errors.
In Hostinger File Manager:
1. Select your files and folders.
2. Click the **Permissions** icon.
3. Set the following standard permissions:
   * **Directories:** `755` (Owner can read/write/execute, others can read/execute)
   * **Files:** `644` (Owner can read/write, others can read)
   * **`uploads/` folder:** `755` (Must be writable by the server).

## 9. Upload-Folder Configuration

1. Create a folder named `uploads` inside `public_html/`.
2. Ensure permissions are `755`.
3. To prevent PHP execution inside the uploads folder (for security), create a `.htaccess` file *inside* the `uploads/` directory with this content:
```apache
# Disable PHP execution in the uploads folder
<FilesMatch "\.(php|phtml|php3|php4|php5|php7|php8|phps)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
```

## 10. Admin Account Setup

If your admin accounts are managed in MySQL:
1. Access **phpMyAdmin**.
2. Open the `users` table.
3. Ensure there is a user with the role `super_admin`.
4. The password should be securely hashed (e.g., bcrypt). Use a script to generate a hashed password, or use the app's "Forgot Password" feature if configured.

If using **Firebase**:
1. Go to Firebase Console > Authentication.
2. Add your admin email (`alifartdxb@gmail.com`).
3. In Firestore, open the `users` collection.
4. Ensure the document matching the UID of the admin has `role: 'super_admin'`.

## 11. Domain and SSL Setup

1. In hPanel, go to **Domains > Details** to ensure your nameservers point to Hostinger.
2. Go to **Security > SSL**.
3. Hostinger provides lifetime free SSL. Click **Install SSL** for your domain.
4. The `.htaccess` file provided handles the automatic HTTP to HTTPS redirection.

## 12. Cache-Clearing Guide

When pushing new updates:
1. **Hostinger Cache:** In hPanel, click on the **Dashboard** for your website and click **Flush Cache** (if using Hostinger's caching).
2. **CDN Cache:** If using Cloudflare, go to Caching > Configuration and click **Purge Everything**.
3. **Browser Cache:** Because Vite hashes filenames (e.g., `main-b8d9c.js`), users usually get the latest version automatically. The provided `.htaccess` ensures `index.html` is never cached.

## 13. Backup Process

1. In hPanel, go to **Files > Backups**.
2. **File Backup:** Select `Generate new backup` for website files.
3. **Database Backup:** Select the database and generate a backup.
4. Download the generated `.tar.gz` and `.sql` files and store them securely offline.

## 14. Restore Process

1. In hPanel, go to **Files > Backups**.
2. Select **Restore Files** to revert `public_html/` to a previous state.
3. Select **Restore Database** and choose the database to revert.
4. Alternatively, upload your manual backups using File Manager and phpMyAdmin.

## 15. Deployment Troubleshooting Guide

* **Issue: "404 Not Found" when refreshing a page (e.g., `/en/products`)**
  * **Fix:** Ensure the `.htaccess` file is present in `public_html/` and includes the React Router rewrite rules (mapping everything to `index.html`).
* **Issue: API returning 404**
  * **Fix:** Check if your `.htaccess` has the `RewriteCond %{REQUEST_URI} ^/api/ [NC]` rule to prevent the API from routing to React's `index.html`.
* **Issue: White blank screen on load**
  * **Fix:** Open Browser DevTools (F12) > Console. Check for missing JS/CSS files. Ensure base URL in `vite.config.ts` is `/` (default).
* **Issue: Uploads failing (Permission Denied)**
  * **Fix:** Ensure the `uploads/` folder has `755` permissions.
* **Issue: Database Connection Error**
  * **Fix:** Verify `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS` in your configuration. Hostinger usernames and DB names include a unique prefix (e.g., `u123456_`).

## 16. API Configuration
A centralized API configuration file has been created at `src/config/api.ts` to handle all endpoint base URLs instead of hardcoding `localhost` URLs. You can customize the base URL using the `VITE_API_BASE_URL` environment variable.
