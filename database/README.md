# AZM Group B2B Platform Database Documentation

This directory contains the complete normalized database architecture for the AZM Group enterprise B2B website.

## Overview

The database is designed to act as a robust Product Information Management (PIM) platform with CRM capabilities for handling B2B leads, quotations, and showroom bookings. The schema features multi-language support (via translation tables), role-based access control (RBAC), and comprehensive tracking/audit capabilities.

While the project's preferred modern stack is **Supabase (PostgreSQL)**, this schema is provided in standard **MySQL** format as specifically requested for environments utilizing MySQL or MariaDB. It is fully normalized (3NF) and optimized for enterprise-scale B2B catalogue management.

### Key Components:
- **Catalog Management:** Brands, Categories, Collections, Products (with translation tables for multi-language support).
- **Attributes System:** Dynamic attributes for technical specifications (materials, finishes, etc.).
- **Content Management:** Pages, Blogs, FAQs, Careers, Testimonials, and media assets.
- **CRM & Lead Generation:** Leads, notes, lead products (quotations), and showroom bookings.
- **System Administration:** RBAC (Roles/Permissions), SEO metadata, dynamic menus, and audit logs.

---

## 1. Installation Instructions

Follow these steps to initialize the database in your MySQL environment:

1. **Access MySQL Command Line or GUI Client (e.g., phpMyAdmin, DBeaver, MySQL Workbench):**
   ```bash
   mysql -u root -p
   ```

2. **Create the Database:**
   ```sql
   CREATE DATABASE azm_b2b_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE azm_b2b_platform;
   ```

3. **Execute the Schema Script:**
   Run the provided `schema.sql` to generate all tables, foreign keys, and indexes.
   ```bash
   mysql -u root -p azm_b2b_platform < database/schema.sql
   ```

4. **Execute the Seed Data Script:**
   Populate the database with the initial demo roles, users, categories, brands, and products.
   ```bash
   mysql -u root -p azm_b2b_platform < database/seed.sql
   ```

5. **Verify Installation:**
   Log into the database and ensure the tables exist and are populated.
   ```sql
   SHOW TABLES;
   SELECT * FROM products;
   ```

---

## 2. Backup Instructions

Regular database backups are crucial for enterprise platforms. We recommend setting up an automated cron job for daily backups.

### Using `mysqldump`

To create a full backup of the database structure and data:

```bash
# Export the entire database to a .sql file
mysqldump -u [username] -p azm_b2b_platform > azm_backup_$(date +%F).sql
```

### Automated Backup Script Example (Cron)

You can create a bash script (`db_backup.sh`) and schedule it via cron to run nightly:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/azm_database"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p[YOUR_PASSWORD] azm_b2b_platform > $BACKUP_DIR/azm_backup_$DATE.sql
# Optional: compress the backup
gzip $BACKUP_DIR/azm_backup_$DATE.sql
```

---

## 3. Restore Instructions

In the event of data loss or when migrating to a new environment, use the following steps to restore the database from a backup file.

> **Warning:** Restoring a database will overwrite existing data. Ensure you are restoring to the correct environment.

1. **Create/Recreate the Database (if necessary):**
   ```bash
   mysql -u root -p -e "DROP DATABASE IF EXISTS azm_b2b_platform; CREATE DATABASE azm_b2b_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

2. **Restore from the `.sql` backup file:**
   ```bash
   mysql -u root -p azm_b2b_platform < path/to/azm_backup_YYYYMMDD.sql
   ```

3. **If the backup is compressed (`.sql.gz`):**
   ```bash
   zcat path/to/azm_backup_YYYYMMDD.sql.gz | mysql -u root -p azm_b2b_platform
   ```

---

## Security Notes
- The default `admin@azmgroup.demo` user is seeded with a placeholder bcrypt hash. You **must** implement secure password hashing (e.g., using `bcrypt` in Node.js/Next.js) before deploying to production.
- Do not store plaintext passwords anywhere.
- Enforce strict IAM policies and database firewall rules to prevent unauthorized access to the production database.
