# Deployment Guide — airindex.today

Adding the air quality index site to the existing Hetzner server that already runs uvi.today and pollen.today.

**Prerequisites:** Server already configured per the uv-site DEPLOY.md (user `deploy`, Docker, Caddy, `caddy_net` network, ip-geo service — all running).

Current server layout:

```
~/apps/
├── caddy/           ← shared reverse proxy (Caddyfile + certs)
├── ip-geo/          ← shared IP geolocation service
├── uv-site/         ← UV index app
└── pollennow/       ← pollen forecast app
```

After this guide:

```
~/apps/
├── caddy/           ← updated Caddyfile with airindex.today block
│   └── certs/       ← + airindex.pem, airindex-key.pem
├── ip-geo/
├── uv-site/
├── pollennow/
└── airindex/        ← new app
```

---

## 1. Create GitHub Repo & Push Code

On your local machine:

```bash
cd ~/projs/airindex
git init
git add -A
git commit -m "Initial air quality index site"
```

Create a **private** repo at https://github.com/new — name it `airindex`, no README/license.

```bash
git remote add origin git@github.com:shumanski/airindex.git
git branch -M main
git push -u origin main
```

---

## 2. Add Deploy Key on GitHub

The server already has `~/.ssh/github_deploy`. Register it with the new repo.

1. Go to https://github.com/shumanski/airindex/settings/keys
2. Click **Add deploy key**
3. Title: `hetzner-deploy`
4. Paste the public key from the server:

```bash
# On the server — copy this output:
cat ~/.ssh/github_deploy.pub
```

5. Leave **Allow write access** unchecked
6. Click **Add key**

> If you get "Key already in use", generate a repo-specific deploy key:
> ```bash
> ssh-keygen -t ed25519 -C "deploy@airindex" -f ~/.ssh/github_deploy_airindex -N ""
> ```
> Then add to `~/.ssh/config`:
> ```
> Host github-airindex
>   HostName github.com
>   IdentityFile ~/.ssh/github_deploy_airindex
>   IdentitiesOnly yes
> ```
> And clone using: `git clone git@github-airindex:shumanski/airindex.git`

---

## 3. Configure Cloudflare

### 3.1 Add domain to Cloudflare

1. In Cloudflare dashboard → **Add a site** → enter `airindex.today`
2. Select **Free** plan
3. Update nameservers at your domain registrar
4. Wait for nameserver propagation

### 3.2 DNS records

In the **airindex.today** zone:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| A | `@` | `YOUR_SERVER_IP` | **Proxied** (orange cloud) | Auto |
| A | `www` | `YOUR_SERVER_IP` | **Proxied** (orange cloud) | Auto |

Replace `YOUR_SERVER_IP` with the Hetzner server IP (same as uvitoday.com / pollen.today).

### 3.3 SSL/TLS settings

1. **SSL/TLS → Overview** → set encryption mode to **Full (strict)**
2. **SSL/TLS → Edge Certificates** → enable **Always Use HTTPS**
3. **SSL/TLS → Edge Certificates** → set **Minimum TLS Version** to **1.2**

### 3.4 Generate Origin Certificate

1. Go to **SSL/TLS → Origin Server → Create Certificate**
2. Keep defaults: Cloudflare-generated key, RSA 2048
3. Hostnames: `airindex.today`, `*.airindex.today`
4. Validity: **15 years**
5. Click **Create** → **copy both the certificate and private key now** (the key won't be shown again)

Save them on the server:

```bash
# Paste the CERTIFICATE:
cat > ~/apps/caddy/certs/airindex.pem << 'EOF'
-----BEGIN CERTIFICATE-----
(paste certificate here)
-----END CERTIFICATE-----
EOF

# Paste the PRIVATE KEY:
cat > ~/apps/caddy/certs/airindex-key.pem << 'EOF'
-----BEGIN PRIVATE KEY-----
(paste private key here)
-----END PRIVATE KEY-----
EOF

chmod 600 ~/apps/caddy/certs/airindex*
```

---

## 4. Update Caddyfile

Edit the shared Caddyfile to add the airindex.today blocks:

```bash
nano ~/apps/caddy/Caddyfile
```

Add the following after the existing site blocks:

```caddyfile
airindex.today {
    tls /etc/caddy/certs/airindex.pem /etc/caddy/certs/airindex-key.pem
    reverse_proxy airindex-site:3000

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=(self)"
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' scripts.simpleanalyticscdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: queue.simpleanalyticscdn.com; connect-src 'self' queue.simpleanalyticscdn.com; font-src 'self'"
        -Server
        -Via
    }

    @static path /_next/static/*
    header @static Cache-Control "public, max-age=31536000, immutable"

    encode gzip zstd
}

www.airindex.today {
    tls /etc/caddy/certs/airindex.pem /etc/caddy/certs/airindex-key.pem
    header -Server
    header -Via
    redir https://airindex.today{uri} permanent
}
```

> **Note:** `reverse_proxy airindex-site:3000` works because both Caddy and airindex-site are on the `caddy_net` Docker network. The hostname `airindex-site` is the container name from docker-compose.yml.

---

## 5. Clone and Build the App

```bash
cd ~/apps
git clone git@github.com:shumanski/airindex.git
cd airindex
```

Create the production `.env`:

```bash
cat > .env << 'EOF'
SITE_URL=https://airindex.today
CACHE_TTL_MINUTES=30
CACHE_MAX_ENTRIES=10000
EOF
chmod 600 .env
```

Create the data directory for feedback:

```bash
mkdir -p data
```

Build and start:

```bash
docker compose build --no-cache
docker compose up -d
```

---

## 6. Reload Caddy

Reload Caddy to pick up the new Caddyfile (zero downtime):

```bash
cd ~/apps/caddy
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

If the reload fails, validate first:

```bash
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
```

---

## 7. Verify

```bash
# Check the site loads
curl -sI https://airindex.today | grep -iE 'cf-ray|server|strict-transport|status'

# Check www redirect
curl -sI https://www.airindex.today | grep -i location

# Check all containers are running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected output:
- `cf-ray:` header present (Cloudflare is proxying)
- `strict-transport-security: max-age=31536000...`
- `location: https://airindex.today/` (from www redirect)
- Containers: `caddy`, `uv-site`, `pollen-site`, `airindex-site`, `ip-geo` — all `Up`

---

## 8. Updating the Site

When you push new code:

```bash
cd ~/apps/airindex
git pull
docker compose build --no-cache
docker compose up -d
```

Downtime: ~10-20 seconds during rebuild. Caddy keeps running — only the app container restarts.

---

## 9. Rollback

If something breaks after deploy:

```bash
cd ~/apps/airindex
git log --oneline -5          # find the last good commit
git checkout <commit-hash>
docker compose build --no-cache
docker compose up -d
```

---

## Summary of Changes to Existing Infrastructure

| What | Where | Change |
|------|-------|--------|
| Caddyfile | `~/apps/caddy/Caddyfile` | Add `airindex.today` + `www.airindex.today` blocks |
| TLS certs | `~/apps/caddy/certs/` | Add `airindex.pem` + `airindex-key.pem` |
| New app | `~/apps/airindex/` | Clone repo, create `.env`, build container |
| Cloudflare | New zone `airindex.today` | DNS A records, Full (strict) SSL, origin cert |
| GitHub | New repo `airindex` | Add deploy key |

Nothing in the uv-site or pollennow repos/containers changes.
