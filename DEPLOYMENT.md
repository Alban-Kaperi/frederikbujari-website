# Deploying to a VPS

Step-by-step instructions to put the Saint Matthew Merchant website live on a fresh
**Ubuntu 24.04** VPS with **Nginx**, **PHP 8.5-FPM**, **Node.js 24** and **SQLite**,
then to update it later.

Replace these placeholders everywhere below:

| Placeholder             | Meaning                                               |
| ----------------------- | ----------------------------------------------------- |
| `your-domain.com`       | The website's domain (without `www.`)                 |
| `SERVER_IP`             | The VPS's public IP address                           |
| `deploy`                | The Linux user that owns the site (created in step 2) |
| `/var/www/saintmatthew` | Where the site lives on the server                    |

> Commands starting with `sudo` need an administrator account. Everything else runs as
> the `deploy` user, inside `/var/www/saintmatthew` unless stated otherwise.

---

## What runs on the server

| Piece       | Why it is needed                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Nginx       | Serves the website over HTTPS                                                                       |
| PHP 8.5-FPM | Runs Laravel                                                                                        |
| SQLite      | Stores posts, contact requests, the admin login and sessions (one file: `database/database.sqlite`) |
| Node.js 24  | Builds the CSS/JS, and runs the server-side renderer so search engines get fully rendered pages     |
| Supervisor  | Keeps the server-side renderer running and restarts it after crashes or reboots                     |
| Certbot     | Free HTTPS certificate from Let's Encrypt                                                           |

No queue worker or cron job is needed: contact emails are sent immediately, and the site
has no scheduled tasks.

---

## 1. Point the domain at the server

At your domain registrar, create two DNS records and wait until they resolve
(usually a few minutes, up to a few hours):

| Type | Name  | Value       |
| ---- | ----- | ----------- |
| A    | `@`   | `SERVER_IP` |
| A    | `www` | `SERVER_IP` |

---

## 2. Prepare the server (once)

Log in as root (or a sudo user) and update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

Create the `deploy` user and let it use sudo:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo usermod -aG www-data deploy
```

Turn on the firewall (SSH + web traffic only):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Install PHP 8.5 and the extensions Laravel needs

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.5-fpm php8.5-cli php8.5-sqlite3 php8.5-mbstring php8.5-xml \
  php8.5-curl php8.5-zip php8.5-bcmath php8.5-intl php8.5-gd unzip git sqlite3
```

Allow thumbnail uploads up to 10 MB (the admin accepts images up to 5 MB):

```bash
sudo sed -i 's/^upload_max_filesize = .*/upload_max_filesize = 10M/; s/^post_max_size = .*/post_max_size = 12M/' /etc/php/8.5/fpm/php.ini
sudo systemctl restart php8.5-fpm
```

### Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Install Node.js 24

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install Nginx, Supervisor and Certbot

```bash
sudo apt install -y nginx supervisor certbot python3-certbot-nginx
```

---

## 3. Upload the code

Create the folder and give it to `deploy`:

```bash
sudo mkdir -p /var/www/saintmatthew
sudo chown deploy:www-data /var/www/saintmatthew
```

Then **either** clone it from a private Git repository (recommended, makes updates easy):

```bash
cd /var/www/saintmatthew
git clone git@github.com:YOUR-ACCOUNT/YOUR-REPO.git .
```

**or** copy it from your computer with `rsync` (run this on your computer, in the project
folder; on Windows use Git Bash or WSL, or use the Git option above):

```bash
rsync -az --delete \
  --exclude node_modules --exclude vendor --exclude .env \
  --exclude public/build --exclude public/storage --exclude bootstrap/ssr \
  --exclude storage/app/public --exclude storage/logs --exclude database/database.sqlite \
  --exclude media_for_the_website --exclude .git \
  ./ deploy@SERVER_IP:/var/www/saintmatthew/
```

> Never upload your local `.env`, `database/database.sqlite` or `storage/app/public`:
> the server has its own settings, database and uploaded thumbnails.

---

## 4. Install the dependencies

As `deploy`, in `/var/www/saintmatthew`:

```bash
composer install --no-dev --optimize-autoloader --no-interaction
npm ci
```

---

## 5. Create the production `.env`

```bash
cp .env.example .env
php artisan key:generate
nano .env
```

Set **at least** these values (leave the others as they are):

```dotenv
APP_NAME="Saint Matthew Merchant"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_LEVEL=error

DB_CONNECTION=sqlite

# Real email delivery for contact-form requests (values from your email provider)
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_FROM_ADDRESS="no-reply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Contact details shown on the website, and where form requests are emailed
CONTACT_RECIPIENT=contact@your-domain.com
CONTACT_EMAIL=contact@your-domain.com
CONTACT_PHONE="+355 69 680 0707"
CONTACT_WHATSAPP=

# Company and social profiles
SITE_VAT_NUMBER=330257859
SOCIAL_FACEBOOK_URL=
SOCIAL_INSTAGRAM_URL=
```

Notes:

- **`APP_URL` must be the real `https://` address.** Canonical links, language links, the
  sitemap and social previews are all built from it.
- **`APP_DEBUG=false`** is essential on a live site: `true` shows error details to visitors.
- `CONTACT_WHATSAPP` can stay empty; WhatsApp then uses `CONTACT_PHONE`.
- `SOCIAL_FACEBOOK_URL` / `SOCIAL_INSTAGRAM_URL`: the icons are always shown, and become
  clickable once you fill in the full profile URLs (e.g. `https://www.facebook.com/yourpage`).
- If `MAIL_*` is not set up, requests are still saved and visible under **Requests** in
  the admin, but no email is sent.

---

## 6. Create the database, storage link and build

```bash
touch database/database.sqlite
php artisan migrate --force
php artisan storage:link
npm run build:ssr
```

- `migrate --force` creates every table (posts, contact requests, admin users, sessions…).
- `storage:link` makes uploaded post thumbnails visible at `/storage/...`.
- `build:ssr` builds the website's CSS/JS **and** the server-side renderer
  (`bootstrap/ssr`). It needs `composer install` to have run first.

> Do **not** run `php artisan db:seed` on the server: the seeder creates a test login
> with a well-known password.

Set the folder permissions so PHP can write logs, cache, sessions, the database and uploads:

```bash
sudo chown -R deploy:www-data /var/www/saintmatthew
sudo chmod -R ug+rwX storage bootstrap/cache database
```

Cache the configuration, routes, views and events for speed:

```bash
php artisan optimize
```

---

## 7. Create the admin login

There is no public sign-up. Create the admin account (it asks for the email, name and a
password of at least 12 characters with upper and lower case letters, numbers and symbols):

```bash
php artisan admin:create
```

Run the same command again later to reset a forgotten password, or to add another admin.
The admin area is at `https://your-domain.com/login`.

---

## 8. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/saintmatthew
```

Paste this (replace `your-domain.com`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/saintmatthew/public;

    index index.php;
    charset utf-8;
    client_max_body_size 12M;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/xml;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Long browser caching for fingerprinted build files and site images
    location ~* ^/(build|images)/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files $uri =404;
    }

    location = /favicon.ico { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

> `robots.txt` and `sitemap.xml` are generated by Laravel, so there is no `robots.txt`
> file in `public/` and the `location /` rule above passes them to PHP.

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/saintmatthew /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## 9. Turn on HTTPS

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --redirect
```

Certbot edits the Nginx file, forces HTTPS, and renews the certificate automatically.
Check renewal works:

```bash
sudo certbot renew --dry-run
```

---

## 10. Keep the server-side renderer running

```bash
sudo nano /etc/supervisor/conf.d/saintmatthew-ssr.conf
```

Paste:

```ini
[program:saintmatthew-ssr]
command=php /var/www/saintmatthew/artisan inertia:start-ssr
directory=/var/www/saintmatthew
user=deploy
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
redirect_stderr=true
stdout_logfile=/var/www/saintmatthew/storage/logs/ssr.log
```

Start it:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status saintmatthew-ssr
```

The status should say `RUNNING`. If the renderer is ever down the site still works; pages
are then rendered in the browser instead.

---

## 11. Check that everything works

Open these in a browser:

- `https://your-domain.com` — the Albanian home page
- `https://your-domain.com/en` and `/it` — English and Italian
- `https://your-domain.com/posts` — the Posts page
- `https://your-domain.com/sitemap.xml` and `/robots.txt`
- `https://your-domain.com/login` — log in with the admin account from step 7

Then:

1. Send a test message through the contact form and check it appears under **Requests**
   in the admin (and arrives by email if `MAIL_*` is set).
2. Publish a test post with a thumbnail, check it on the website, then delete it.
3. Check the server-side renderer: `php artisan inertia:check-ssr` should report it is running,
   and `curl -s https://your-domain.com | grep -c "<h1"` should print `1` (the page arrives
   already rendered, which is what search engines read).

### Tell Google about the site

In [Google Search Console](https://search.google.com/search-console), add
`https://your-domain.com`, verify it, and submit `https://your-domain.com/sitemap.xml`
under **Sitemaps**.

---

## Updating the site later

After changing the code locally, bring the changes to the server (`git pull`, or the
`rsync` command from step 3), then run the update script as `deploy`:

```bash
cd /var/www/saintmatthew
bash deploy.sh
```

`deploy.sh` (in the project root) does, in order:

1. Puts the site in maintenance mode.
2. Pulls the latest code (when the folder is a Git checkout).
3. Installs PHP and Node dependencies.
4. Runs new database migrations.
5. Rebuilds the CSS/JS and the server-side renderer.
6. Refreshes Laravel's caches.
7. Restarts the server-side renderer (Supervisor starts it again with the new code).
8. Takes the site out of maintenance mode.

If you changed `.env` only (for example to add the Facebook link), you just need:

```bash
php artisan optimize
```

---

## Backups

Everything that cannot be rebuilt from the code lives in two places. Back them up regularly
(for example nightly, to another server or cloud storage):

| What                                    | Where                                            |
| --------------------------------------- | ------------------------------------------------ |
| Database (posts, requests, admin login) | `/var/www/saintmatthew/database/database.sqlite` |
| Uploaded post thumbnails                | `/var/www/saintmatthew/storage/app/public/`      |
| Settings                                | `/var/www/saintmatthew/.env`                     |

Safe way to copy the database while the site is running:

```bash
sqlite3 database/database.sqlite ".backup 'database/backup-$(date +%F).sqlite'"
```

---

## Troubleshooting

| Problem                               | What to check                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Blank page or "500 Server Error"      | `tail -n 50 storage/logs/laravel.log`                                                          |
| Changes to `.env` have no effect      | Run `php artisan optimize` (settings are cached)                                               |
| "Vite manifest not found"             | Run `npm run build:ssr`                                                                        |
| Post thumbnails do not show           | Run `php artisan storage:link`; check permissions in step 6                                    |
| Thumbnail upload fails for big images | PHP `upload_max_filesize` / `post_max_size` (step 2) and Nginx `client_max_body_size` (step 8) |
| Contact emails do not arrive          | Check the `MAIL_*` values; requests are still under **Requests** in the admin                  |
| "Permission denied" errors            | Repeat the `chown` / `chmod` commands in step 6                                                |
| Renderer not running                  | `sudo supervisorctl status saintmatthew-ssr` and `storage/logs/ssr.log`                        |
