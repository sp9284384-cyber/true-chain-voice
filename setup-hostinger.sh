#!/bin/bash
# ==============================================================================
#  TrueChain — Hostinger VPS One-Click Setup Script
#  Run this script on your Hostinger Ubuntu VPS (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================

set -e

echo "🚀 Starting TrueChain installation on Hostinger VPS..."

# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20, Python 3.11, Nginx, Git, PM2
sudo apt install -y curl git python3-pip python3-venv nginx certbot python3-certbot-nginx

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

sudo npm install -g pm2

# 3. Clone Repository (or pull latest)
PROJECT_DIR="/var/www/truechain"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📦 Cloning project repository..."
    sudo git clone https://github.com/sp9284384-cyber/trust-chain-voice.git "$PROJECT_DIR"
    sudo chown -R $USER:$USER "$PROJECT_DIR"
else
    echo "🔄 Updating existing project..."
    cd "$PROJECT_DIR"
    git pull origin main
fi

# 4. Setup FastAPI Backend
echo "🐍 Setting up Python FastAPI Backend..."
cd "$PROJECT_DIR/truechain-backend/backend"
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# Create storage directory for encrypted evidence
mkdir -p storage/evidence

# Start Backend with PM2
pm2 delete truechain-backend || true
pm2 start "./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000" --name "truechain-backend"

# 5. Setup Next.js Frontend
echo "⚡ Setting up Next.js Frontend..."
cd "$PROJECT_DIR/truechain-frontend5"
npm install

# Build Next.js app
npm run build

# Start Frontend with PM2
pm2 delete truechain-frontend || true
pm2 start "npm start" --name "truechain-frontend"

# Save PM2 process list to autostart on reboot
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME || true

echo "✅ TrueChain Backend running on port 8000"
echo "✅ TrueChain Frontend running on port 3000"
echo "🎉 Hostinger VPS deployment completed successfully!"
