# Tutorial: Deploying a GTCX Validator Node

**Time to complete:** 45 minutes  
**Prerequisites:** Docker, basic Linux administration  
**What you'll build:** A running GTCX validator node on testnet

---

## Overview

Validator nodes are the backbone of the GTCX network. They:

- Verify TradePass credentials
- Validate GeoTag location claims
- Calculate and attest GCI scores
- Participate in PANX Oracle consensus
- Store and replicate custody records

This tutorial guides you through deploying your own validator node.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR VALIDATOR NODE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   API        │  │   Consensus  │  │   Storage    │          │
│  │   Gateway    │  │   Engine     │  │   Layer      │          │
│  │   :8080      │  │   :26656     │  │   PostgreSQL │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│  ┌────────────────────────┴────────────────────────┐           │
│  │              Message Queue (Redis)               │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ P2P Network
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GTCX TESTNET NETWORK                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Node 1  │──│ Node 2  │──│ Node 3  │──│  ...    │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: System Requirements

### Minimum Requirements (Testnet)

| Resource | Minimum       | Recommended  |
| -------- | ------------- | ------------ |
| CPU      | 2 cores       | 4 cores      |
| RAM      | 4 GB          | 8 GB         |
| Storage  | 50 GB SSD     | 100 GB SSD   |
| Network  | 10 Mbps       | 100 Mbps     |
| OS       | Ubuntu 22.04+ | Ubuntu 24.04 |

### Production Requirements

| Resource | Minimum     | Recommended |
| -------- | ----------- | ----------- |
| CPU      | 8 cores     | 16 cores    |
| RAM      | 32 GB       | 64 GB       |
| Storage  | 500 GB NVMe | 1 TB NVMe   |
| Network  | 1 Gbps      | 10 Gbps     |
| HSM      | Optional    | Required    |

---

## Step 2: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Log out and back in for group changes
exit
```

After logging back in:

```bash
# Verify Docker installation
docker --version
docker compose version
```

---

## Step 3: Download GTCX Validator

```bash
# Create directory
mkdir -p ~/gtcx-validator && cd ~/gtcx-validator

# Download validator package
curl -LO https://releases.gtcx.io/validator/v3.0.0/gtcx-validator-v3.0.0.tar.gz

# Extract
tar -xzf gtcx-validator-v3.0.0.tar.gz

# Verify checksum
sha256sum -c gtcx-validator-v3.0.0.tar.gz.sha256
```

Expected structure:

```
gtcx-validator/
├── docker-compose.yml
├── config/
│   ├── validator.yaml
│   ├── genesis.json
│   └── peers.txt
├── scripts/
│   ├── init.sh
│   ├── start.sh
│   └── backup.sh
└── data/
    └── .gitkeep
```

---

## Step 4: Generate Node Identity

```bash
# Initialize node identity
./scripts/init.sh

# This generates:
# - Node keypair (data/keys/node.key)
# - Validator keypair (data/keys/validator.key)
# - Node ID (data/node_id)
```

Output:

```
🔑 Generating node identity...

   Node ID:     gtcx_node_a1b2c3d4e5f6...
   Public Key:  ed25519:7x8y9z...

   ⚠️  IMPORTANT: Back up data/keys/ directory securely!

✅ Node identity created successfully
```

**⚠️ Backup your keys!** Store `data/keys/` in a secure location.

---

## Step 5: Configure the Node

Edit `config/validator.yaml`:

```yaml
# Node Configuration
node:
  # Your node's display name
  moniker: 'my-validator-node'

  # Network to join
  network: 'testnet' # Options: testnet, ghana, mainnet

  # Listen addresses
  api_address: '0.0.0.0:8080'
  p2p_address: '0.0.0.0:26656'
  rpc_address: '0.0.0.0:26657'

# Validation settings
validation:
  # Enable validation (requires stake)
  enabled: true

  # Verification types this node supports
  capabilities:
    - tradepass
    - geotag
    - gci
    - vaultmark

  # GeoTag verification settings
  geotag:
    # Maximum distance from claim to verify (km)
    max_verification_distance: 100
    # Require photo evidence
    require_photos: true

# Database
database:
  host: 'postgres'
  port: 5432
  name: 'gtcx_validator'
  user: 'gtcx'
  # Password from environment variable
  password_env: 'POSTGRES_PASSWORD'

# Logging
logging:
  level: 'info' # debug, info, warn, error
  format: 'json'

# Metrics
metrics:
  enabled: true
  port: 9090
  path: '/metrics'

# HSM (optional, recommended for production)
hsm:
  enabled: false
  # provider: "yubihsm"  # or "aws_cloudhsm", "azure_keyvault"
  # config_path: "/etc/hsm/config.json"
```

---

## Step 6: Configure Peers

Edit `config/peers.txt` to add seed nodes:

```
# GTCX Testnet Seed Nodes
# Format: node_id@ip:port

gtcx_seed_eu1@seed-eu1.testnet.gtcx.io:26656
gtcx_seed_us1@seed-us1.testnet.gtcx.io:26656
gtcx_seed_af1@seed-af1.testnet.gtcx.io:26656
```

---

## Step 7: Set Environment Variables

Create `.env` file:

```bash
cat > .env << 'EOF'
# Database
POSTGRES_PASSWORD=your_secure_password_here

# API Key (get from https://developers.gtcx.io)
GTCX_API_KEY=your_api_key_here

# Optional: External IP for P2P
EXTERNAL_IP=auto

# Optional: Logging
LOG_LEVEL=info
EOF
```

**⚠️ Security:** Never commit `.env` to version control!

---

## Step 8: Start the Node

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps
```

Expected output:

```
NAME                    STATUS              PORTS
gtcx-validator-api      Up 2 minutes        0.0.0.0:8080->8080/tcp
gtcx-validator-node     Up 2 minutes        0.0.0.0:26656-26657->26656-26657/tcp
gtcx-validator-postgres Up 2 minutes        5432/tcp
gtcx-validator-redis    Up 2 minutes        6379/tcp
```

---

## Step 9: Verify Node is Running

### Check logs

```bash
docker compose logs -f gtcx-validator-node
```

Look for:

```
INFO Starting GTCX Validator Node v3.0.0
INFO Node ID: gtcx_node_a1b2c3d4e5f6...
INFO Connecting to network: testnet
INFO Discovered 12 peers
INFO Syncing blockchain... (this may take a few minutes)
INFO Sync complete. Block height: 1234567
INFO Validator ready. Listening for verification requests.
```

### Check API health

```bash
curl http://localhost:8080/health
```

Response:

```json
{
  "status": "healthy",
  "version": "3.0.0",
  "network": "testnet",
  "block_height": 1234567,
  "peers": 12,
  "synced": true
}
```

### Check node info

```bash
curl http://localhost:8080/v1/node/info
```

Response:

```json
{
  "node_id": "gtcx_node_a1b2c3d4e5f6...",
  "moniker": "my-validator-node",
  "network": "testnet",
  "capabilities": ["tradepass", "geotag", "gci", "vaultmark"],
  "uptime_seconds": 3600,
  "verifications_processed": 42
}
```

---

## Step 10: Register as Validator (Optional)

To participate in consensus and earn rewards, register your node:

```bash
# Register validator (requires testnet tokens)
curl -X POST http://localhost:8080/v1/validator/register \
  -H "Content-Type: application/json" \
  -d '{
    "stake_amount": "1000",
    "commission_rate": "0.10",
    "description": "My GTCX Validator",
    "website": "https://myvalidator.example.com",
    "contact": "operator@example.com"
  }'
```

**Note:** Testnet tokens are free. Request them at https://faucet.testnet.gtcx.io

---

## Monitoring

### Built-in Dashboard

Access the validator dashboard at: http://localhost:8080/dashboard

### Prometheus Metrics

Metrics available at: http://localhost:9090/metrics

Key metrics:

| Metric                         | Description                    |
| ------------------------------ | ------------------------------ |
| `gtcx_verifications_total`     | Total verifications processed  |
| `gtcx_verification_latency_ms` | Verification latency histogram |
| `gtcx_peers_connected`         | Number of connected peers      |
| `gtcx_block_height`            | Current block height           |
| `gtcx_consensus_rounds`        | Consensus rounds participated  |

### Grafana Dashboard

Import the GTCX dashboard:

```bash
# ID: 12345 (hypothetical)
# Or download from: https://grafana.gtcx.io/dashboards
```

---

## Operations

### Stop the node

```bash
docker compose stop
```

### Restart the node

```bash
docker compose restart
```

### View logs

```bash
# All logs
docker compose logs -f

# Specific service
docker compose logs -f gtcx-validator-node
```

### Backup data

```bash
./scripts/backup.sh
# Creates: backups/gtcx-backup-YYYYMMDD-HHMMSS.tar.gz
```

### Update to new version

```bash
# Stop node
docker compose down

# Download new version
curl -LO https://releases.gtcx.io/validator/v3.1.0/gtcx-validator-v3.1.0.tar.gz
tar -xzf gtcx-validator-v3.1.0.tar.gz

# Start with new version
docker compose up -d
```

---

## Troubleshooting

### Node not syncing

```
WARN Sync stalled at block 123456
```

**Solutions:**

1. Check internet connectivity
2. Verify peers in `config/peers.txt`
3. Restart the node: `docker compose restart`

### Connection refused

```
Error: connection refused to seed-eu1.testnet.gtcx.io:26656
```

**Solutions:**

1. Check firewall allows outbound 26656
2. Try different seed nodes
3. Check if testnet is under maintenance

### Database errors

```
Error: connection to database failed
```

**Solutions:**

1. Check PostgreSQL is running: `docker compose ps`
2. Verify password in `.env` matches `validator.yaml`
3. Check database logs: `docker compose logs postgres`

### Out of disk space

```
Error: no space left on device
```

**Solutions:**

1. Prune old Docker images: `docker system prune`
2. Archive old logs
3. Expand disk or add storage

---

## Security Checklist

- [ ] Keys backed up securely
- [ ] `.env` file has restricted permissions (`chmod 600 .env`)
- [ ] Firewall configured (allow 26656, restrict 8080)
- [ ] Regular backups scheduled
- [ ] Monitoring alerts configured
- [ ] HSM configured (production only)
- [ ] Node behind reverse proxy with TLS (production)

---

## Next Steps

- [Network Protocol](../specs/network-protocol.md) — PANX consensus and validator attestation
- [Security Framework](../specs/security-framework.md) — Cryptographic standards for validators
- [First Integration Tutorial](./first-integration.md) — Build a client that talks to your validator
