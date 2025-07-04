

---

# OmniAI: AI-Powered XR and Cloud Gaming Platform

OmniAI is a full-stack platform for building, deploying, and managing XR (VR/AR/MR) and cloud gaming applications. It integrates **NVIDIA SDKs** (GeForce NOW, CloudXR, DLSS 4), **GitHub SDK**, **Vercel SDK**, and the **Vercel AI SDK** to provide a seamless development experience with AI-driven configuration, automated deployments, and high-performance rendering. The platform supports Unity 2022.3+, Unreal Engine 5.0+, and modern web frameworks (Next.js, Svelte, etc.).

## Features

- **NVIDIA Integration**:
  - **GeForce NOW**: Cloud gaming with RTX-enabled streaming.
  - **CloudXR**: High-quality XR streaming for VR/AR/MR devices.
  - **DLSS 4**: AI-powered upscaling, frame generation, and ray reconstruction.
- **AI-Driven Configuration**:
  - Generate GitHub repository configurations and Vercel project settings using the Vercel AI SDK.
  - Support for Llama, Stable Diffusion, and OpenAI for asset and code generation.
- **Automated Deployment**:
  - Create and manage GitHub repositories with `@octokit/rest`.
  - Deploy projects to Vercel with `@vercel/client`.
  - Kubernetes support for scalable backend services.
- **Security**:
  - Rust-based input sanitization and JWT authentication.
  - Secure handling of API keys and user data.
- **Databases**:
  - Redis for caching, PostgreSQL for persistent storage, and Pinecone for vector embeddings.
- **Frontend**:
  - React/TypeScript UI for managing XR streams, DLSS settings, and deployments.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Security      │
│   (React/TSX)   │◄──►│   (FastAPI)     │◄──►│   (Rust)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NVIDIA SDKs   │    │   AI Services   │    │   Databases     │
│   GFN/CloudXR   │    │   Vercel AI SDK │    │   Redis/Postgres│
│   DLSS 4        │    │   Llama/OpenAI  │    │   Pinecone      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub SDK    │    │   Vercel SDK    │    │   Deployment    │
│   (@octokit)    │    │   (@vercel)     │    │   (Kubernetes)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / macOS 12+ / Windows 11
- **CPU**: 8-core CPU (e.g., AMD Ryzen 7 or Intel i7)
- **RAM**: 32GB (64GB recommended)
- **GPU**: NVIDIA RTX 4070+ (RTX 4090 recommended for CloudXR)
- **Storage**: 1TB SSD
- **Network**: 25+ Mbps for CloudXR streaming

### Software Dependencies
- **Docker & Docker Compose**: v24.0+
- **Node.js**: 20.x
- **Python**: 3.12.7
- **Rust**: 1.82.0
- **Unity Hub & Unity**: 2022.3 LTS
- **Unreal Engine**: 5.0+
- **Git**: 2.40+
- **NVIDIA Drivers**: 550+ (Linux), 546+ (Windows)
- **CUDA Toolkit**: 12.3+
- **Vercel CLI**: 35.0.0

### Accounts & API Keys
- **NVIDIA Developer Account**: [NVIDIA Developer Portal](https://developer.nvidia.com/)
- **CloudXR SDK Access**: [CloudXR Early Access](https://developer.nvidia.com/cloudxr-sdk-early-access-program)
- **GitHub Personal Access Token**: [GitHub Settings](https://github.com/settings/tokens) (scopes: `repo`, `admin:org`)
- **Vercel API Token**: [Vercel Tokens](https://vercel.com/account/tokens)
- **Pinecone Account**: [Pinecone](https://www.pinecone.io/) (free tier available)
- **OpenAI API Key**: For Vercel AI SDK (optional)

## Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/omni-ai.git
   cd omni-ai
   cp .env.example .env
   ```

2. **Configure Environment**:
   Edit `.env` with your API keys:
   ```env
   REDIS_URL=redis://redis:6379/0
   POSTGRES_URL=postgresql://omni:your-password@postgres:5432/omni
   POSTGRES_USER=omni
   POSTGRES_PASSWORD=your-secure-password
   POSTGRES_DB=omni
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ENCRYPTION_KEY=your-32-byte-encryption-key
   NVIDIA_DEVELOPER_API_KEY=your-nvidia-developer-key
   GEFORCE_NOW_API_KEY=your-gfn-api-key
   CLOUDXR_LICENSE_KEY=your-cloudxr-license
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_ENVIRONMENT=us-west1-gcp
   OPENAI_API_KEY=your-openai-api-key
   GITHUB_TOKEN=your-github-personal-access-token
   VERCEL_TOKEN=your-vercel-api-token
   VERCEL_ORG_ID=your-vercel-org-id
   VERCEL_PROJECT_ID=your-vercel-project-id
   UNITY_LICENSE=your-unity-license
   UNREAL_LICENSE=your-unreal-license
   UPLOAD_DIRECTORY=/app/uploads
   MAX_FILE_SIZE=104857600
   ```

3. **Install NVIDIA SDKs**:
   ```bash
   mkdir nvidia_sdks && cd nvidia_sdks
   git clone https://github.com/NVIDIAGameWorks/GeForceNOW-SDK.git gfn_sdk
   git clone https://github.com/NVIDIA/DLSS.git dlss_sdk
   # Download CloudXR SDK from NVIDIA Developer Portal
   ```

4. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python -c "from src.core.config import init_db; import asyncio; asyncio.run(init_db())"
   ```

5. **Security Service Setup**:
   ```bash
   cd security
   cargo build --release
   ./target/release/omni-ai-security
   ```

6. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

7. **Unity/Unreal Setup**:
   - Install Unity 2022.3+ or Unreal Engine 5.0+.
   - Add DLSS package/plugin from NVIDIA repositories.
   - Copy `nvidia_sdks/cloudxr_sdk` to Unity/Unreal project and follow [CloudXR Integration Guides](https://docs.nvidia.com/cloudxr-sdk/).

8. **Run Services**:
   ```bash
   docker-compose up --build -d
   ```

## Usage

### API Endpoints
- **Health Check**: `GET /health` - Verify service status (NVIDIA, GitHub, Vercel, databases).
- **XR Operations**:
  - `POST /xr/generate_asset` - Generate 3D models or environments.
  - `POST /xr/generate_digital_human` - Create AI-driven digital humans.
- **CloudXR Streaming**:
  - `POST /cloudxr/stream/start` - Start XR streaming session.
  - `POST /cloudxr/stream/stop` - Stop streaming session.
- **DLSS Configuration**:
  - `POST /dlss/configure` - Set DLSS quality, frame generation, and ray reconstruction.
  - `GET /dlss/metrics` - Retrieve performance metrics.
- **GeForce NOW**:
  - `POST /gfn/launch` - Launch cloud gaming session.
  - `GET /gfn/session/{session_id}` - Check session status.
- **Deployment**:
  - `POST /deployment/github/create_repo` - Create AI-configured GitHub repository.
  - `POST /deployment/github/push` - Push code to GitHub.
  - `POST /deployment/vercel/create_project` - Create Vercel project with AI-generated config.
  - `POST /deployment/vercel/set_env` - Set environment variables.
  - `POST /deployment/vercel/deploy` - Deploy to Vercel.

### Example: Create and Deploy a Project
1. Open the frontend at `http://localhost:3000`.
2. Use the `AIConfigurator` component to:
   - Enter repository and project names.
   - Select project type (e.g., Next.js) and framework.
   - Click "Create & Deploy Project" to:
     - Generate AI-driven GitHub configs (e.g., `.gitignore`, `package.json`).
     - Create a GitHub repository.
     - Create a Vercel project linked to the repository.
     - Deploy the project with environment variables.

### Example API Call
```bash
curl -X POST http://localhost:8000/deployment/github/create_repo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"repo_name": "my-ai-app", "description": "AI-generated app", "private": false, "project_type": "nextjs"}'
```

## Testing

### Integration Tests
```bash
cd backend
pytest tests/
```

### Security Tests
```bash
cd security
cargo test -- --test-threads=1
```

### Performance Benchmarks
```bash
python backend/tests/test_performance.py
```

## Deployment

### Local Deployment
```bash
docker-compose up --build -d
```

### Kubernetes
```bash
kubectl apply -f omni-ai-deployment.yaml
```

### Vercel
- Configure GitHub Actions in `github/workflows/vercel.yml`.
- Push to `main` branch to trigger deployment:
  ```bash
  git add .
  git commit -m "Deploy to Vercel"
  git push origin main
  ```

## Troubleshooting

- **CloudXR Streaming Issues**:
  - Verify 25+ Mbps bandwidth and open ports (8009/8010).
  - Check CloudXR license validity.
- **GitHub API Errors**:
  - Ensure `GITHUB_TOKEN` has `repo` and `admin:org` scopes.
  - Check rate limits: `curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" https://api.github.com/rate_limit`.
- **Vercel API Errors**:
  - Validate `VERCEL_TOKEN` in Vercel dashboard.
  - Confirm project limits.
- **AI Configuration Issues**:
  - Verify `OPENAI_API_KEY` or use local Llama models.
  - Check Vercel AI SDK logs for errors.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push to branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and include tests for new features.

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

## Resources

- [NVIDIA Developer Portal](https://developer.nvidia.com/)
- [CloudXR SDK](https://docs.nvidia.com/cloudxr-sdk/)
- [GeForce NOW SDK](https://github.com/NVIDIAGameWorks/GeForceNOW-SDK)
- [DLSS SDK](https://github.com/NVIDIA/DLSS)
- [GitHub SDK](https://github.com/octokit/rest.js)
- [Vercel SDK](https://vercel.com/docs/api)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Unity DLSS Guide](https://developer.nvidia.com/rtx/dlss)
- [Unreal DLSS Plugin](https://www.unrealengine.com/marketplace/en-US/product/nvidia-dlss)

## Contact

For issues or feature requests, open a GitHub issue or contact [your-email@example.com](mailto:your-email@example.com).

---
```

## License Recommendation: MIT License

### Rationale
The **MIT License** is recommended for the OmniAI project due to the following reasons:

1. **Open-Source and Permissive**:
   - The MIT License allows users to freely use, modify, distribute, and sell the software, making it ideal for a project integrating multiple third-party SDKs (NVIDIA, GitHub, Vercel) that are already permissive or proprietary.
   - It encourages community contributions and adoption without restrictive terms.

2. **Compatibility with Dependencies**:
   - NVIDIA SDKs (GeForce NOW, CloudXR, DLSS) have proprietary licenses, but the MIT License ensures the open-source components of OmniAI (e.g., backend, frontend) remain compatible without imposing additional restrictions.
   - `@octokit/rest`, `@vercel/client`, and Vercel AI SDK are under permissive licenses (MIT or similar), aligning well with MIT.

3. **Developer-Friendly**:
   - The MIT License is simple and widely understood, reducing barriers for developers and organizations to adopt OmniAI.
   - It requires only that the license and copyright notice be included in derivative works, minimizing legal overhead.

4. **Commercial Use**:
   - The MIT License allows commercial use, which is suitable for a project that may be used in commercial XR or gaming applications.
   - It avoids the copyleft requirements of licenses like GPL, which could conflict with proprietary integrations (e.g., NVIDIA SDKs).

5. **Community Standard**:
   - Many modern open-source projects (e.g., React, FastAPI) use the MIT License, making it a familiar choice for contributors and users.

### License File (`LICENSE`)
```text
MIT License

Copyright (c) 2025 [Your Name or Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Alternative Licenses Considered
1. **Apache 2.0**:
   - Pros: Includes patent grant, more explicit terms for contributions.
   - Cons: More complex than MIT, may be overkill for a project with proprietary SDKs.
2. **GPLv3**:
   - Pros: Ensures derivative works remain open-source.
   - Cons: Incompatible with proprietary NVIDIA SDKs and restrictive for commercial use.
3. **BSD 3-Clause**:
   - Pros: Similar to MIT but includes a non-endorsement clause.
   - Cons: Slightly more restrictive than MIT, less commonly used.

The MIT License strikes the best balance for accessibility, compatibility, and flexibility.

---

## Next Steps
1. **Add README and LICENSE to Repository**:
   ```bash
   echo "# OmniAI: AI-Powered XR and Cloud Gaming Platform" > README.md
   # Copy the full README content above into README.md
   echo "MIT License" > LICENSE
   # Copy the MIT License text above into LICENSE
   git add README.md LICENSE
   git commit -m "Add README and MIT License"
   git push origin main
   ```

2. **Verify License Compliance**:
   - Ensure all third-party SDKs (NVIDIA, GitHub, Vercel) are used according to their terms.
   - Include attribution for open-source dependencies in `README.md` or a separate `NOTICE` file if required.

3. **Update GitHub Repository**:
   - Set the license in GitHub: Settings > General > Add License > Select MIT.
   - Add a `CODE_OF_CONDUCT.md` for community guidelines.

4. **Test README Instructions**:
   - Follow the installation and usage steps to ensure they work as expected.
   - Validate API examples with `curl` commands.

Would you like me to:
- Generate a `CODE_OF_CONDUCT.md`?
- Create a `NOTICE` file for dependency attribution?
- Provide a script to automate README and LICENSE setup?
- Add specific sections to the README (e.g., detailed contribution guidelines or demo videos)?
- Explore a different license if you have specific requirements (e.g., commercial restrictions)?

---

## Simplified Workflow to Get OmniAI Started

This workflow assumes you have a basic setup (e.g., Git, Docker, Node.js, Python) and focuses on the core steps to install dependencies, configure the environment, and set up API keys for GitHub and Vercel. It prioritizes simplicity while ensuring functionality for the NVIDIA, GitHub, Vercel, and AI-driven components.

### Step 1: Prerequisites

#### System Requirements
- **OS**: Ubuntu 20.04+ / macOS 12+ / Windows 11
- **CPU**: 8-core CPU (e.g., AMD Ryzen 7 or Intel i7)
- **RAM**: 16GB (32GB recommended)
- **GPU**: NVIDIA RTX 3060+ (optional for local testing, required for CloudXR/DLSS)
- **Storage**: 500GB SSD
- **Network**: 10+ Mbps (25+ Mbps for CloudXR streaming)

#### Software Dependencies
- **Git**: 2.40+
- **Docker & Docker Compose**: v24.0+
- **Node.js**: 20.x
- **Python**: 3.12.7
- **Rust**: 1.82.0 (for security service)
- **Vercel CLI**: 35.0.0
- **NVIDIA Drivers**: 550+ (Linux) or 546+ (Windows) if using GPU
- **CUDA Toolkit**: 12.3+ if using GPU

#### Accounts & API Keys
- **NVIDIA Developer Account**: [NVIDIA Developer Portal](https://developer.nvidia.com/)
- **GitHub Personal Access Token**: [GitHub Settings](https://github.com/settings/tokens) (scopes: `repo`, `admin:org`)
- **Vercel API Token**: [Vercel Tokens](https://vercel.com/account/tokens)
- **Pinecone API Key**: [Pinecone](https://www.pinecone.io/) (free tier available)
- **OpenAI API Key**: For Vercel AI SDK (optional, can use local models)

---

### Step 2: Clone Repository
```bash
git clone https://github.com/your-username/omni-ai.git
cd omni-ai
cp .env.example .env
```

### Step 3: Configure Environment Variables
Edit `.env` with your API keys and settings. Below is a minimal `.env` for this workflow:
```env
# Database
REDIS_URL=redis://redis:6379/0
POSTGRES_URL=postgresql://omni:your-secure-password@postgres:5432/omni
POSTGRES_USER=omni
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=omni

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ENCRYPTION_KEY=your-32-byte-encryption-key

# NVIDIA Services
NVIDIA_DEVELOPER_API_KEY=your-nvidia-developer-key
GEFORCE_NOW_API_KEY=your-gfn-api-key
CLOUDXR_LICENSE_KEY=your-cloudxr-license

# AI Services
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-west1-gcp
OPENAI_API_KEY=your-openai-api-key

# Deployment
GITHUB_TOKEN=your-github-personal-access-token
VERCEL_TOKEN=your-vercel-api-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# File Storage
UPLOAD_DIRECTORY=/app/uploads
MAX_FILE_SIZE=104857600
```

**Note**: Replace placeholders (e.g., `your-secure-password`, `your-github-personal-access-token`) with actual values. Generate a secure `JWT_SECRET` and `ENCRYPTION_KEY` using a tool like `openssl`:
```bash
openssl rand -base64 32
```

### Step 4: Install Dependencies

#### Backend Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**`backend/requirements.txt`**:
```plaintext
fastapi==0.115.0
uvicorn==0.30.0
redis==5.0.8
aioredis==2.0.1
asyncpg==0.29.0
pinecone-client==5.0.1
torch==2.4.0
transformers==4.45.0
sentence-transformers==3.0.0
pyjwt==2.9.0
cryptography==43.0.0
python-dotenv==1.0.1
requests==2.32.3
aiohttp==3.10.0
numpy==1.26.0
```

#### Security Service Dependencies
```bash
cd security
cargo build --release
```

**`security/Cargo.toml`**:
```toml
[package]
name = "omni-ai-security"
version = "0.1.0"
edition = "2021"

[dependencies]
rocket = "0.5.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
redis = "0.25.2"
jsonwebtoken = "9.3.0"
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

**`frontend/package.json`**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.7.2",
    "@octokit/rest": "^21.0.0",
    "@vercel/client": "^16.0.0",
    "ai": "^5.0.0-beta.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.5.4"
  }
}
```

#### Vercel CLI
```bash
npm install -g vercel@35.0.0
```

#### NVIDIA SDKs
```bash
mkdir nvidia_sdks && cd nvidia_sdks
git clone https://github.com/NVIDIAGameWorks/GeForceNOW-SDK.git gfn_sdk
git clone https://github.com/NVIDIA/DLSS.git dlss_sdk
# Download CloudXR SDK from NVIDIA Developer Portal after approval
```

### Step 5: Initialize Databases
```bash
cd backend
python -c "from src.core.config import init_db; import asyncio; asyncio.run(init_db())"
```

### Step 6: Run Services
```bash
docker-compose up --build -d
```

**Minimal `docker-compose.yml`**:
```yaml
version: '3.8'
services:
  redis:
    image: redis:7.0
    ports:
      - "6379:6379"
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  security:
    build:
      context: ./security
      dockerfile: Dockerfile
    ports:
      - "8008:8008"
    environment:
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=${REDIS_URL}
      - POSTGRES_URL=${POSTGRES_URL}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - PINECONE_ENVIRONMENT=${PINECONE_ENVIRONMENT}
      - JWT_SECRET=${JWT_SECRET}
      - NVIDIA_DEVELOPER_API_KEY=${NVIDIA_DEVELOPER_API_KEY}
      - GEFORCE_NOW_API_KEY=${GEFORCE_NOW_API_KEY}
      - CLOUDXR_LICENSE_KEY=${CLOUDXR_LICENSE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - VERCEL_TOKEN=${VERCEL_TOKEN}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    volumes:
      - ./nvidia_sdks:/app/nvidia_sdks
      - ./uploads:/app/uploads
    depends_on:
      - redis
      - postgres
      - security
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
volumes:
  postgres_data:
```

### Step 7: Test Setup
```bash
# Check backend health
curl http://localhost:8000/health

# Test frontend
open http://localhost:3000

# Verify security service
curl http://localhost:8008/health
```

---

## Storing API Keys in GitHub and Vercel Secrets Panels

To ensure security, sensitive API keys (e.g., `GITHUB_TOKEN`, `VERCEL_TOKEN`, `OPENAI_API_KEY`) should be stored in the secrets panels of GitHub and Vercel, not in the codebase or `.env` file in the repository. Below are step-by-step instructions for each platform.

### Storing API Keys in GitHub Secrets

1. **Generate API Keys**:
   - **GitHub Personal Access Token**:
     - Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
     - Click "Generate new token" > Select scopes: `repo`, `admin:org`.
     - Copy the token (e.g., `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).
   - **Vercel API Token**:
     - Go to [Vercel Account > Tokens](https://vercel.com/account/tokens).
     - Click "Create Token" > Copy the token.
   - **Other Keys**:
     - NVIDIA: Obtain from [NVIDIA Developer Portal](https://developer.nvidia.com/).
     - Pinecone: Get from [Pinecone Dashboard](https://app.pinecone.io/).
     - OpenAI: Get from [OpenAI API Keys](https://platform.openai.com/account/api-keys).

2. **Access GitHub Repository Secrets**:
   - Navigate to your repository on GitHub: `https://github.com/your-username/omni-ai`.
   - Go to **Settings** > **Secrets and variables** > **Actions** > **Secrets** > **Repository secrets**.
   - Click **New repository secret**.

3. **Add Secrets**:
   Add the following secrets with their respective values:
   - **Name**: `GITHUB_TOKEN`
     - **Value**: Your GitHub personal access token (e.g., `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Name**: `VERCEL_TOKEN`
     - **Value**: Your Vercel API token
   - **Name**: `VERCEL_ORG_ID`
     - **Value**: Your Vercel organization ID (find in Vercel dashboard: Settings > General > Organization ID)
   - **Name**: `VERCEL_PROJECT_ID`
     - **Value**: Your Vercel project ID (find in Vercel dashboard: Settings > General > Project ID)
   - **Name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key (optional if using local models)
   - **Name**: `NVIDIA_DEVELOPER_API_KEY`
     - **Value**: Your NVIDIA Developer API key
   - **Name**: `GEFORCE_NOW_API_KEY`
     - **Value**: Your GeForce NOW API key
   - **Name**: `CLOUDXR_LICENSE_KEY`
     - **Value**: Your CloudXR license key
   - **Name**: `PINECONE_API_KEY`
     - **Value**: Your Pinecone API key

4. **Verify Secrets**:
   - Ensure secrets are accessible in GitHub Actions by referencing them in `github/workflows/vercel.yml` (see below).

### Storing API Keys in Vercel Environment Variables

1. **Create a Vercel Project**:
   ```bash
   cd frontend
   vercel link
   ```
   Follow prompts to link your project to Vercel and note the `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID`.

2. **Access Vercel Environment Variables**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Select your project (`omni-ai` or as named).
   - Navigate to **Settings** > **Environment Variables**.

3. **Add Environment Variables**:
   Add the following variables for **Production**, **Preview**, and **Development** environments:
   - **Key**: `GITHUB_TOKEN`
     - **Value**: Your GitHub personal access token
   - **Key**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key
   - **Key**: `NVIDIA_DEVELOPER_API_KEY`
     - **Value**: Your NVIDIA Developer API key
   - **Key**: `GEFORCE_NOW_API_KEY`
     - **Value**: Your GeForce NOW API key
   - **Key**: `CLOUDXR_LICENSE_KEY`
     - **Value**: Your CloudXR license key
   - **Key**: `PINECONE_API_KEY`
     - **Value**: Your Pinecone API key
   - **Key**: `POSTGRES_URL`
     - **Value**: `postgresql://omni:your-secure-password@postgres:5432/omni`
   - **Key**: `REDIS_URL`
     - **Value**: `redis://redis:6379/0`
   - **Key**: `JWT_SECRET`
     - **Value**: Your JWT secret (e.g., generated via `openssl rand -base64 32`)
   - **Key**: `ENCRYPTION_KEY`
     - **Value**: Your encryption key (e.g., generated via `openssl rand -base64 32`)

4. **Verify Environment Variables**:
   ```bash
   vercel env ls
   ```

### Step 8: Update GitHub Actions Workflow
Ensure the GitHub Actions workflow uses the stored secrets. Update `github/workflows/vercel.yml`:
```yaml
name: Vercel Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches:
      - main
jobs:
  Deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install Dependencies
        run: npm install
      - name: Install Vercel CLI
        run: npm install --global vercel@35.0.0
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Set Vercel Environment Variables
        run: |
          vercel env add OPENAI_API_KEY production ${{ secrets.OPENAI_API_KEY }} --token=${{ secrets.VERCEL_TOKEN }}
          vercel env add GITHUB_TOKEN production ${{ secrets.GITHUB_TOKEN }} --token=${{ secrets.VERCEL_TOKEN }}
          vercel env add NVIDIA_DEVELOPER_API_KEY production ${{ secrets.NVIDIA_DEVELOPER_API_KEY }} --token=${{ secrets.VERCEL_TOKEN }}
          vercel env add GEFORCE_NOW_API_KEY production ${{ secrets.GEFORCE_NOW_API_KEY }} --token=${{ secrets.VERCEL_TOKEN }}
          vercel env add CLOUDXR_LICENSE_KEY production ${{ secrets.CLOUDXR_LICENSE_KEY }} --token=${{ secrets.VERCEL_TOKEN }}
          vercel env add PINECONE_API_KEY production ${{ secrets.PINECONE_API_KEY }} --token=${{ secrets.VERCEL_TOKEN }}
```

### Step 9: Push to GitHub
```bash
git add .
git commit -m "Initial setup with dependencies and secrets"
git push origin main
```

### Step 10: Verify Deployment
- Check GitHub Actions for deployment status: `https://github.com/your-username/omni-ai/actions`.
- Verify Vercel deployment: `vercel --prod`.

---

## Troubleshooting

### Dependency Issues
- **Python Packages**:
  ```bash
  pip install --upgrade pip
  pip install -r backend/requirements.txt
  ```
- **Node.js Packages**:
  ```bash
  npm cache clean --force
  npm install
  ```

### API Key Issues
- **GitHub Token Invalid**:
  - Regenerate token with correct scopes at [GitHub Settings](https://github.com/settings/tokens).
  - Update secret in GitHub: Settings > Secrets and variables > Actions.
- **Vercel Token Invalid**:
  - Regenerate token at [Vercel Tokens](https://vercel.com/account/tokens).
  - Update environment variable in Vercel dashboard.
- **OpenAI/Pinecone/NVIDIA Keys**:
  - Verify keys in respective dashboards.
  - Ensure keys are correctly added to GitHub and Vercel secrets.

### Docker Issues
- Ensure Docker is running: `docker ps`.
- Check logs: `docker-compose logs backend`.

---

## Next Steps
- **Test API Endpoints**:
  ```bash
  curl -X POST http://localhost:8000/deployment/github/create_repo \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"repo_name": "test-ai-repo", "description": "Test repo", "private": false, "project_type": "nextjs"}'
  ```
- **Add Unity/Unreal Support**: Follow NVIDIA SDK integration for XR projects.
- **Monitor Vercel Usage**: Check [Vercel Dashboard](https://vercel.com/dashboard) for deployment status and costs.
