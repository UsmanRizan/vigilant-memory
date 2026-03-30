<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/325d8b63-3953-4272-8874-29d8e146d9bb

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to Ubuntu VPS with Nginx (Manual)

This app can be deployed as a single Node process that serves both API routes and the built frontend.

### 1. Provision server dependencies

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 2. Clone and install the app

```bash
cd /var/www
sudo git clone <YOUR_REPO_URL> pure-white-thobes
cd pure-white-thobes
npm ci
```

### 3. Configure production environment

Create a `.env` file in the project root:

```bash
cat > .env << 'EOF'
MONGODB_URI=<your_production_mongodb_uri>
PORT=3000
EOF
```

### 4. Build and start the application

```bash
npm run build
NODE_ENV=production pm2 start npm --name pure-white-thobes -- run start
pm2 save
pm2 startup
```

After `pm2 startup`, run the command PM2 prints to enable auto-start on reboot.

### 5. Configure Nginx reverse proxy

Create Nginx site config:

```bash
sudo tee /etc/nginx/sites-available/pure-white-thobes > /dev/null << 'EOF'
server {
   listen 80;
   server_name <your_domain_or_server_ip>;

   location / {
      proxy_pass http://127.0.0.1:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
   }
}
EOF

sudo ln -s /etc/nginx/sites-available/pure-white-thobes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Validate deployment

```bash
curl http://127.0.0.1:3000/api/health
pm2 status
pm2 logs pure-white-thobes --lines 100
```

### 7. Manual redeploy flow

```bash
cd /var/www/pure-white-thobes
git pull
npm ci
npm run build
pm2 restart pure-white-thobes
```
