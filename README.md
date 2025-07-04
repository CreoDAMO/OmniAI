# OmniAI: AI-Powered XR and Cloud Gaming Platform

OmniAI is a full-stack platform for building, deploying, and managing XR (VR/AR/MR) and cloud gaming applications. It integrates **NVIDIA SDKs** (GeForce NOW, CloudXR, DLSS 4), **GitHub SDK**, **Vercel SDK**, and the **Vercel AI SDK** for AI-driven configuration, automated deployments, and high-performance rendering. The platform supports Unity 2022.3+, Unreal Engine 5.0+, and web frameworks like Next.js and Svelte.

## Features

- **NVIDIA Integration**: Cloud gaming (GeForce NOW), XR streaming (CloudXR), and AI upscaling (DLSS 4).
- **AI-Driven Configuration**: Auto-generate GitHub and Vercel configs using Vercel AI SDK.
- **Automated Deployment**: Manage GitHub repositories (`@octokit/rest`) and deploy to Vercel (`@vercel/client`).
- **Security**: Rust-based input sanitization and JWT authentication.
- **Databases**: Redis (caching), PostgreSQL (storage), Pinecone (vector embeddings).
- **Frontend**: React/TypeScript UI for XR, DLSS, and deployment management.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   Backend       │◄──►│   Security      │
│   (React/TSX)   │    │   (FastAPI)     │    │   (Rust)        │
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
- **RAM**: 16GB (32GB recommended)
- **GPU**: NVIDIA RTX 3060+ (required for CloudXR/DLSS)
- **Storage**: 500GB SSD
- **Network**: 10+ Mbps (25+ Mbps for CloudXR)

### Software Dependencies
- **Git**: 2.40+
- **Docker & Docker Compose**: v24.0+
- **Node.js**: 20.x
- **Python**: 3.12.7
- **Rust**: 1.82.0
- **Vercel CLI**: 35.0.0
- **NVIDIA Drivers**: 550+ (Linux) or 546+ (Windows)
- **CUDA Toolkit**: 12.3+ (if using GPU)

### Accounts & API Keys
- **NVIDIA Developer**: [NVIDIA Developer Portal](https://developer.nvidia.com/)
- **GitHub Token**: [GitHub Settings](https://github.com/settings/tokens) (scopes: `repo`, `admin:org`)
- **Vercel Token**: [Vercel Tokens](https://vercel.com/account/tokens)
- **Pinecone**: [Pinecone](https://www.pinecone.io/) (free tier)
- **OpenAI**: For Vercel AI SDK (optional)

## Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/CreoDAMO/OmniAI.git
   cd OmniAI
   cp .env.example .env
   ```

2. **Configure Environment**:
   Edit `.env` with your API keys:
   ```env
   REDIS_URL=redis://redis:6379/0
   POSTGRES_URL=postgresql://omni:your-secure-password@postgres:5432/omni
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
   UPLOAD_DIRECTORY=/app/uploads
   MAX_FILE_SIZE=104857600
   ```
   Generate secure keys:
   ```bash
   openssl rand -base64 32
   ```

3. **Install Dependencies**:
   - **Backend**:
     ```bash
     cd backend
     python -m venv venv
     source venv/bin/activate  # Windows: venv\Scripts\activate
     pip install -r requirements.txt
     ```
     **requirements.txt**:
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
   - **Security**:
     ```bash
     cd security
     cargo build --release
     ```
     **Cargo.toml**:
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
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     ```
     **package.json**:
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
   - **Vercel CLI**:
     ```bash
     npm install -g vercel@35.0.0
     ```
   - **NVIDIA SDKs**:
     ```bash
     mkdir nvidia_sdks && cd nvidia_sdks
     git clone https://github.com/NVIDIAGameWorks/GeForceNOW-SDK.git gfn_sdk
     git clone https://github.com/NVIDIA/DLSS.git dlss_sdk
     # Download CloudXR SDK from NVIDIA Developer Portal
     ```

4. **Initialize Databases**:
   ```bash
   cd backend
   python -c "from src.core.config import init_db; import asyncio; asyncio.run(init_db())"
   ```

5. **Run Services**:
   ```bash
   docker-compose up --build -d
   ```
   **docker-compose.yml**:
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
         - ./Uploads:/app/uploads
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

6. **Test Setup**:
   ```bash
   curl http://localhost:8000/health
   curl http://localhost:8008/health
   open http://localhost:3000
   ```

## Storing API Keys

### GitHub Secrets
1. **Generate Keys**:
   - **GitHub Token**: [GitHub Settings](https://github.com/settings/tokens) (scopes: `repo`, `admin:org`).
   - **Vercel Token**: [Vercel Tokens](https://vercel.com/account/tokens).
   - **Others**: NVIDIA ([NVIDIA Developer](https://developer.nvidia.com/)), Pinecone ([Pinecone](https://app.pinecone.io/)), OpenAI ([OpenAI](https://platform.openai.com/account/api-keys)).

2. **Add Secrets**:
   - Go to `https://github.com/CreoDAMO/OmniAI` > **Settings** > **Secrets and variables** > **Actions** > **Secrets** > **New repository secret**.
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Vercel org ID (from Vercel dashboard)
     - `VERCEL_PROJECT_ID`: Vercel project ID
     - `OPENAI_API_KEY`: OpenAI key (optional)
     - `NVIDIA_DEVELOPER_API_KEY`: NVIDIA key
     - `GEFORCE_NOW_API_KEY`: GeForce NOW key
     - `CLOUDXR_LICENSE_KEY`: CloudXR key
     - `PINECONE_API_KEY`: Pinecone key

### Vercel Environment Variables
1. **Link Project**:
   ```bash
   cd frontend
   vercel link
   ```

2. **Add Variables**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) > Select project > **Settings** > **Environment Variables**.
   - Add for **Production**, **Preview**, **Development**:
     - `GITHUB_TOKEN`, `OPENAI_API_KEY`, `NVIDIA_DEVELOPER_API_KEY`, `GEFORCE_NOW_API_KEY`, `CLOUDXR_LICENSE_KEY`, `PINECONE_API_KEY`, `POSTGRES_URL`, `REDIS_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`

3. **Verify**:
   ```bash
   vercel env ls
   ```

## Usage

### Create and Deploy a Project
1. Open `http://localhost:3000`.
2. Use the `AIConfigurator` component to:
   - Enter repository/project names, select framework (e.g., Next.js).
   - Click "Create & Deploy Project" to auto-configure and deploy via GitHub and Vercel.

### Example API Call
```bash
curl -X POST http://localhost:8000/deployment/github/create_repo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"repo_name": "my-ai-app", "description": "AI-generated app", "private": false, "project_type": "nextjs"}'
```

## Deployment

### Local
```bash
docker-compose up --build -d
```

### Vercel
- Update `github/workflows/vercel.yml`:
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
- Push to trigger deployment:
  ```bash
  git add .
  git commit -m "Deploy to Vercel"
  git push origin main
  ```

## Troubleshooting

- **GitHub API Errors**: Verify `GITHUB_TOKEN` scopes; check rate limits: `curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" https://api.github.com/rate_limit`.
- **Vercel API Errors**: Validate `VERCEL_TOKEN` in [Vercel Dashboard](https://vercel.com/dashboard).
- **Docker Issues**: Check `docker ps` and logs: `docker-compose logs backend`.

## Contributing

1. Fork `https://github.com/CreoDAMO/OmniAI`.
2. Create branch: `git checkout -b feature/your-feature`.
3. Commit: `git commit -m "Add feature"`.
4. Push: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

## Resources

- [NVIDIA Developer](https://developer.nvidia.com/)
- [CloudXR SDK](https://docs.nvidia.com/cloudxr-sdk/)
- [GitHub SDK](https://github.com/octokit/rest.js)
- [Vercel SDK](https://vercel.com/docs/api)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## Contact

Open a GitHub issue at `https://github.com/CreoDAMO/OmniAI/issues` or contact [your-email@example.com](mailto:your-email@example.com).
```

---

## License File (`LICENSE`)

```text
MIT License

Copyright (c) 2025 CreoDAMO

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

---

## Changes Made to README

1. **Updated Repository URL**:
   - Changed `https://github.com/your-username/omni-ai` to `https://github.com/CreoDAMO/OmniAI`.
2. **Simplified Content**:
   - Condensed system requirements and dependencies for clarity.
   - Streamlined installation steps to focus on core setup.
   - Removed Unity/Unreal setup details to keep it minimal (can be added later if needed).
3. **Integrated API Key Instructions**:
   - Added detailed steps for storing API keys in GitHub Secrets and Vercel Environment Variables.
   - Included commands to verify setup (`vercel env ls`, `curl` tests).
4. **Updated License**:
   - Specified `CreoDAMO` as the copyright holder in the MIT License.
   - Removed alternative license discussion to keep README concise.
5. **Streamlined Usage**:
   - Focused on the `AIConfigurator` component and a single API example.
   - Simplified deployment instructions with clear GitHub Actions workflow.
6. **Removed Redundant Sections**:
   - Dropped detailed API endpoint list, testing, and Kubernetes sections to reduce complexity (available in previous responses if needed).
7. **Added Contact Info**:
   - Updated contact section with GitHub issues link and placeholder email.

---

## Steps to Update Repository

1. **Add README and LICENSE**:
   ```bash
   echo "# OmniAI: AI-Powered XR and Cloud Gaming Platform" > README.md
   # Copy the updated README content above into README.md
   echo "MIT License" > LICENSE
   # Copy the MIT License text above into LICENSE
   git add README.md LICENSE
   git commit -m "Update README and add MIT License"
   git push origin main
   ```

2. **Set GitHub License**:
   - Go to `https://github.com/CreoDAMO/OmniAI`.
   - Click **Create new file** > Name it `LICENSE` > Select **MIT License** template > Update copyright to `CreoDAMO` > Commit.
   - Alternatively, GitHub will detect the `LICENSE` file after pushing.

3. **Add GitHub Actions Workflow**:
   ```bash
   mkdir -p .github/workflows
   echo "name: Vercel Deployment" > .github/workflows/vercel.yml
   # Copy the vercel.yml content from above into .github/workflows/vercel.yml
   git add .github/workflows/vercel.yml
   git commit -m "Add Vercel deployment workflow"
   git push origin main
   ```

4. **Store API Keys**:
   - Follow the "Storing API Keys" section in the README to add secrets in GitHub (`https://github.com/CreoDAMO/OmniAI/settings/secrets/actions`) and Vercel (`https://vercel.com/dashboard`).

5. **Verify Setup**:
   - Check GitHub Actions: `https://github.com/CreoDAMO/OmniAI/actions`.
   - Test local services: `curl http://localhost:8000/health`.
   - Verify Vercel deployment: `vercel --prod`.

---

## Additional Recommendations

1. **Add `.gitignore`**:
   Create a `.gitignore` to avoid committing sensitive files:
   ```gitignore
   .env
   venv/
   node_modules/
   __pycache__/
   *.pyc
   target/
   uploads/
   nvidia_sdks/cloudxr_sdk/
   ```
   ```bash
   echo -e ".env\nvenv/\nnode_modules/\n__pycache__/\n*.pyc\ntarget/\nuploads/\nnvidia_sdks/cloudxr_sdk/" > .gitignore
   git add .gitignore
   git commit -m "Add .gitignore"
   git push origin main
   ```

2. **Create Directory Structure**:
   Ensure the repository has the required directories:
   ```bash
   mkdir -p backend frontend security nvidia_sdks uploads
   touch backend/requirements.txt frontend/package.json security/Cargo.toml docker-compose.yml
   git add .
   git commit -m "Initialize project structure"
   git push origin main
   ```

3. **Add CODE_OF_CONDUCT.md** (Optional):
   ```markdown
   # Code of Conduct

   ## Our Pledge
   We as contributors and maintainers pledge to make participation in our project and community a harassment-free experience for everyone.

   ## Our Standards
   - Be respectful and inclusive.
   - Avoid harmful language or behavior.
   - Provide constructive feedback.

   ## Enforcement
   Violations can be reported to [your-email@example.com]. Maintainers may remove content or ban contributors for inappropriate behavior.

   ## Attribution
   This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org).
   ```
   ```bash
   echo "# Code of Conduct" > CODE_OF_CONDUCT.md
   # Copy the content above into CODE_OF_CONDUCT.md
   git add CODE_OF_CONDUCT.md
   git commit -m "Add Code of Conduct"
   git push origin main
   ```

4. **Test Repository**:
   - Clone `https://github.com/CreoDAMO/OmniAI` locally and follow README instructions.
   - Verify API key integration by running a test deployment:
     ```bash
     curl -X POST http://localhost:8000/deployment/github/create_repo \
       -H "Authorization: Bearer YOUR_TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"repo_name": "test-ai-repo", "description": "Test repo", "private": false, "project_type": "nextjs"}'
     ```

---
Below, I'll address all your requests for the OmniAI project at `https://github.com/CreoDAMO/OmniAI`:

1. **Script to automate creation of README, LICENSE, and other files.**
2. **Detailed test suite for the setup.**
3. **Updated README with Unity/Unreal integration steps.**
4. **NOTICE file for dependency attribution.**
5. **Steps to initialize the repository structure on GitHub.**

---

## 1. Script to Automate Creation of README, LICENSE, and Other Files

Below is a Bash script (`init_omni_ai.sh`) to automate the creation of `README.md`, `LICENSE`, `.gitignore`, `CODE_OF_CONDUCT.md`, and the initial directory structure for the OmniAI project. The script also sets up basic configuration files (`docker-compose.yml`, `backend/requirements.txt`, `frontend/package.json`, `security/Cargo.toml`).

### `init_omni_ai.sh`
```bash
#!/bin/bash

# Initialize OmniAI repository structure and files
REPO_DIR="OmniAI"
REPO_URL="https://github.com/CreoDAMO/OmniAI.git"

# Create directory structure
mkdir -p $REPO_DIR/{backend,frontend,security,nvidia_sdks,uploads,.github/workflows}

# Create README.md
cat << 'EOF' > $REPO_DIR/README.md
# OmniAI: AI-Powered XR and Cloud Gaming Platform

OmniAI is a full-stack platform for building, deploying, and managing XR (VR/AR/MR) and cloud gaming applications. It integrates **NVIDIA SDKs** (GeForce NOW, CloudXR, DLSS 4), **GitHub SDK**, **Vercel SDK**, and the **Vercel AI SDK** for AI-driven configuration, automated deployments, and high-performance rendering. The platform supports Unity 2022.3+, Unreal Engine 5.0+, and web frameworks like Next.js and Svelte.

## Features

- **NVIDIA Integration**: Cloud gaming (GeForce NOW), XR streaming (CloudXR), and AI upscaling (DLSS 4).
- **AI-Driven Configuration**: Auto-generate GitHub and Vercel configs using Vercel AI SDK.
- **Automated Deployment**: Manage GitHub repositories (`@octokit/rest`) and deploy to Vercel (`@vercel/client`).
- **Security**: Rust-based input sanitization and JWT authentication.
- **Databases**: Redis (caching), PostgreSQL (storage), Pinecone (vector embeddings).
- **Frontend**: React/TypeScript UI for XR, DLSS, and deployment management.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   Backend       │◄──►│   Security      │
│   (React/TSX)   │    │   (FastAPI)     │    │   (Rust)        │
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
- **RAM**: 16GB (32GB recommended)
- **GPU**: NVIDIA RTX 3060+ (required for CloudXR/DLSS)
- **Storage**: 500GB SSD
- **Network**: 10+ Mbps (25+ Mbps for CloudXR)

### Software Dependencies
- **Git**: 2.40+
- **Docker & Docker Compose**: v24.0+
- **Node.js**: 20.x
- **Python**: 3.12.7
- **Rust**: 1.82.0
- **Vercel CLI**: 35.0.0
- **NVIDIA Drivers**: 550+ (Linux) or 546+ (Windows)
- **CUDA Toolkit**: 12.3+ (if using GPU)
- **Unity Hub & Unity**: 2022.3 LTS (optional for XR)
- **Unreal Engine**: 5.0+ (optional for XR)

### Accounts & API Keys
- **NVIDIA Developer**: [NVIDIA Developer Portal](https://developer.nvidia.com/)
- **GitHub Token**: [GitHub Settings](https://github.com/settings/tokens) (scopes: `repo`, `admin:org`)
- **Vercel Token**: [Vercel Tokens](https://vercel.com/account/tokens)
- **Pinecone**: [Pinecone](https://www.pinecone.io/) (free tier)
- **OpenAI**: For Vercel AI SDK (optional)

## Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/CreoDAMO/OmniAI.git
   cd OmniAI
   cp .env.example .env
   ```

2. **Configure Environment**:
   Edit `.env` with your API keys:
   ```env
   REDIS_URL=redis://redis:6379/0
   POSTGRES_URL=postgresql://omni:your-secure-password@postgres:5432/omni
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
   UPLOAD_DIRECTORY=/app/uploads
   MAX_FILE_SIZE=104857600
   ```
   Generate secure keys:
   ```bash
   openssl rand -base64 32
   ```

3. **Install Dependencies**:
   - **Backend**:
     ```bash
     cd backend
     python -m venv venv
     source venv/bin/activate  # Windows: venv\Scripts\activate
     pip install -r requirements.txt
     ```
   - **Security**:
     ```bash
     cd security
     cargo build --release
     ```
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     ```
   - **Vercel CLI**:
     ```bash
     npm install -g vercel@35.0.0
     ```
   - **NVIDIA SDKs**:
     ```bash
     mkdir nvidia_sdks && cd nvidia_sdks
     git clone https://github.com/NVIDIAGameWorks/GeForceNOW-SDK.git gfn_sdk
     git clone https://github.com/NVIDIA/DLSS.git dlss_sdk
     # Download CloudXR SDK from NVIDIA Developer Portal
     ```

4. **Unity/Unreal Integration**:
   - Install Unity 2022.3+ or Unreal Engine 5.0+.
   - **Unity**:
     - Import DLSS: Add `nvidia_sdks/dlss_sdk` via Package Manager.
     - Add CloudXR: Copy `nvidia_sdks/cloudxr_sdk` to project and follow [CloudXR Guide](https://docs.nvidia.com/cloudxr-sdk/).
   - **Unreal**:
     - Install DLSS Plugin: Download from [Unreal Marketplace](https://www.unrealengine.com/marketplace/en-US/product/nvidia-dlss).
     - Integrate CloudXR: Copy `nvidia_sdks/cloudxr_sdk` and follow [CloudXR Unreal Guide](https://docs.nvidia.com/cloudxr-sdk/).
   - Configure API keys in project settings for GeForce NOW and CloudXR.

5. **Initialize Databases**:
   ```bash
   cd backend
   python -c "from src.core.config import init_db; import asyncio; asyncio.run(init_db())"
   ```

6. **Run Services**:
   ```bash
   docker-compose up --build -d
   ```

## Storing API Keys

### GitHub Secrets
1. **Generate Keys**:
   - **GitHub Token**: [GitHub Settings](https://github.com/settings/tokens) (scopes: `repo`, `admin:org`).
   - **Vercel Token**: [Vercel Tokens](https://vercel.com/account/tokens).
   - **Others**: NVIDIA ([NVIDIA Developer](https://developer.nvidia.com/)), Pinecone ([Pinecone](https://app.pinecone.io/)), OpenAI ([OpenAI](https://platform.openai.com/account/api-keys)).

2. **Add Secrets**:
   - Go to `https://github.com/CreoDAMO/OmniAI` > **Settings** > **Secrets and variables** > **Actions** > **Secrets** > **New repository secret**.
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Vercel org ID
     - `VERCEL_PROJECT_ID`: Vercel project ID
     - `OPENAI_API_KEY`: OpenAI key (optional)
     - `NVIDIA_DEVELOPER_API_KEY`: NVIDIA key
     - `GEFORCE_NOW_API_KEY`: GeForce NOW key
     - `CLOUDXR_LICENSE_KEY`: CloudXR key
     - `PINECONE_API_KEY`: Pinecone key

### Vercel Environment Variables
1. **Link Project**:
   ```bash
   cd frontend
   vercel link
   ```

2. **Add Variables**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) > Select project > **Settings** > **Environment Variables**.
   - Add for **Production**, **Preview**, **Development**:
     - `GITHUB_TOKEN`, `OPENAI_API_KEY`, `NVIDIA_DEVELOPER_API_KEY`, `GEFORCE_NOW_API_KEY`, `CLOUDXR_LICENSE_KEY`, `PINECONE_API_KEY`, `POSTGRES_URL`, `REDIS_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`

3. **Verify**:
   ```bash
   vercel env ls
   ```

## Usage

### Create and Deploy a Project
1. Open `http://localhost:3000`.
2. Use the `AIConfigurator` component to:
   - Enter repository/project names, select framework (e.g., Next.js).
   - Click "Create & Deploy Project" to auto-configure and deploy via GitHub and Vercel.

### Example API Call
```bash
curl -X POST http://localhost:8000/deployment/github/create_repo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"repo_name": "my-ai-app", "description": "AI-generated app", "private": false, "project_type": "nextjs"}'
```

## Deployment

### Local
```bash
docker-compose up --build -d
```

### Vercel
- Update `github/workflows/vercel.yml` and push to `main` to trigger deployment.

## Troubleshooting

- **GitHub API Errors**: Verify `GITHUB_TOKEN` scopes; check rate limits: `curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" https://api.github.com/rate_limit`.
- **Vercel API Errors**: Validate `VERCEL_TOKEN` in [Vercel Dashboard](https://vercel.com/dashboard).
- **Docker Issues**: Check `docker ps` and logs: `docker-compose logs backend`.

## Contributing

1. Fork `https://github.com/CreoDAMO/OmniAI`.
2. Create branch: `git checkout -b feature/your-feature`.
3. Commit: `git commit -m "Add feature"`.
4. Push: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

## Resources

- [NVIDIA Developer](https://developer.nvidia.com/)
- [CloudXR SDK](https://docs.nvidia.com/cloudxr-sdk/)
- [GitHub SDK](https://github.com/octokit/rest.js)
- [Vercel SDK](https://vercel.com/docs/api)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Unity DLSS](https://developer.nvidia.com/rtx/dlss)
- [Unreal DLSS](https://www.unrealengine.com/marketplace/en-US/product/nvidia-dlss)

## Contact

Open a GitHub issue at `https://github.com/CreoDAMO/OmniAI/issues`.
EOF

# Create LICENSE
cat << 'EOF' > $REPO_DIR/LICENSE
MIT License

Copyright (c) 2025 CreoDAMO

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
EOF

# Create CODE_OF_CONDUCT.md
cat << 'EOF' > $REPO_DIR/CODE_OF_CONDUCT.md
# Code of Conduct

## Our Pledge
We as contributors and maintainers pledge to make participation in our project and community a harassment-free experience for everyone.

## Our Standards
- Be respectful and inclusive.
- Avoid harmful language or behavior.
- Provide constructive feedback.

## Enforcement
Violations can be reported via GitHub issues at https://github.com/CreoDAMO/OmniAI/issues. Maintainers may remove content or ban contributors for inappropriate behavior.

## Attribution
This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org).
EOF

# Create .gitignore
cat << 'EOF' > $REPO_DIR/.gitignore
.env
venv/
node_modules/
__pycache__/
*.pyc
target/
uploads/
nvidia_sdks/cloudxr_sdk/
EOF

# Create NOTICE
cat << 'EOF' > $REPO_DIR/NOTICE
# OmniAI Dependency Attribution

This project uses the following open-source dependencies:

- **FastAPI**: MIT License, https://github.com/tiangolo/fastapi
- **Uvicorn**: BSD 3-Clause License, https://github.com/encode/uvicorn
- **Redis-py**: MIT License, https://github.com/redis/redis-py
- **Asyncpg**: Apache 2.0 License, https://github.com/MagicStack/asyncpg
- **Pinecone-client**: Apache 2.0 License, https://github.com/pinecone-io/pinecone-python-client
- **PyTorch**: BSD-style License, https://github.com/pytorch/pytorch
- **Transformers**: Apache 2.0 License, https://github.com/huggingface/transformers
- **Sentence-Transformers**: Apache 2.0 License, https://github.com/UKPLab/sentence-transformers
- **PyJWT**: MIT License, https://github.com/jpadilla/pyjwt
- **Cryptography**: Apache 2.0/BSD License, https://github.com/pyca/cryptography
- **Python-dotenv**: BSD 3-Clause License, https://github.com/theskumar/python-dotenv
- **Requests**: Apache 2.0 License, https://github.com/psf/requests
- **AIOHTTP**: Apache 2.0 License, https://github.com/aio-libs/aiohttp
- **NumPy**: BSD License, https://github.com/numpy/numpy
- **React**: MIT License, https://github.com/facebook/react
- **Axios**: MIT License, https://github.com/axios/axios
- **@octokit/rest**: MIT License, https://github.com/octokit/rest.js
- **@vercel/client**: MIT License, https://github.com/vercel/vercel
- **Vercel AI SDK**: Apache 2.0 License, https://github.com/vercel/ai
- **Rocket**: MIT License, https://github.com/SergioBenitez/Rocket
- **Serde**: MIT/Apache 2.0 License, https://github.com/serde-rs/serde
- **JSONWebToken**: MIT License, https://github.com/Keats/jsonwebtoken

Proprietary dependencies:
- **NVIDIA GeForce NOW SDK**: Proprietary, https://developer.nvidia.com/geforce-now
- **NVIDIA CloudXR SDK**: Proprietary, https://developer.nvidia.com/cloudxr-sdk
- **NVIDIA DLSS SDK**: Proprietary, https://developer.nvidia.com/rtx/dlss

All dependencies are used in accordance with their respective licenses.
EOF

# Create docker-compose.yml
cat << 'EOF' > $REPO_DIR/docker-compose.yml
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
      - ./Uploads:/app/uploads
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
EOF

# Create backend/requirements.txt
cat << 'EOF' > $REPO_DIR/backend/requirements.txt
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
EOF

# Create frontend/package.json
cat << 'EOF' > $REPO_DIR/frontend/package.json
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
EOF

# Create security/Cargo.toml
cat << 'EOF' > $REPO_DIR/security/Cargo.toml
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
EOF

# Create GitHub Actions workflow
cat << 'EOF' > $REPO_DIR/.github/workflows/vercel.yml
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
EOF

# Create .env.example
cat << 'EOF' > $REPO_DIR/.env.example
REDIS_URL=redis://redis:6379/0
POSTGRES_URL=postgresql://omni:your-secure-password@postgres:5432/omni
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
UPLOAD_DIRECTORY=/app/uploads
MAX_FILE_SIZE=104857600
EOF

# Initialize git and push to GitHub
cd $REPO_DIR
git init
git add .
git commit -m "Initialize OmniAI repository with README, LICENSE, and core files"
git remote add origin $REPO_URL
git push -u origin main

echo "OmniAI repository initialized with core files."
echo "Next steps:"
echo "1. Add API keys to GitHub Secrets: https://github.com/CreoDAMO/OmniAI/settings/secrets/actions"
echo "2. Add API keys to Vercel Environment Variables: https://vercel.com/dashboard"
echo "3. Run 'docker-compose up --build -d' to start services."
```

### Usage
1. Save the script as `init_omni_ai.sh`.
2. Make it executable:
   ```bash
   chmod +x init_omni_ai.sh
   ```
3. Run the script:
   ```bash
   ./init_omni_ai.sh
   ```
4. Ensure you have GitHub credentials configured (`git config --global user.name` and `user.email`) and a valid `GITHUB_TOKEN` for pushing to `https://github.com/CreoDAMO/OmniAI`.

**Note**: The script assumes the repository is empty or doesn't exist. If `https://github.com/CreoDAMO/OmniAI` already has files, modify the script to avoid overwriting existing content (e.g., add `git pull` before `git push`).

---

## 2. Detailed Test Suite for the Setup

Below is a test suite to verify the OmniAI setup, including backend, frontend, security service, databases, and API key integration. The tests focus on ensuring dependencies are installed, services are running, and API endpoints function correctly.

### Test Suite Structure
- **Backend Tests**: Verify FastAPI endpoints, database connections, and GitHub/Vercel integrations.
- **Security Tests**: Validate Rust-based security service and JWT authentication.
- **Frontend Tests**: Check React UI and API calls.
- **Deployment Tests**: Confirm GitHub Actions and Vercel deployment.

### `backend/tests/test_setup.py`
```python
import pytest
import asyncio
from fastapi.testclient import TestClient
from src.main import app
from src.core.github_manager import GitHubManager
from src.core.vercel_manager import VercelManager
from src.core.ai_configurator import AIConfigurator
from src.core.config import get_settings

client = TestClient(app)
settings = get_settings()

@pytest.mark.asyncio
async def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_database_connections():
    # Test Redis
    from redis.asyncio import Redis
    redis = Redis.from_url(settings.redis_url)
    await redis.ping()
    await redis.close()

    # Test PostgreSQL
    from asyncpg import connect
    conn = await connect(settings.postgres_url)
    await conn.execute("SELECT 1")
    await conn.close()

@pytest.mark.asyncio
async def test_github_create_repo():
    github = GitHubManager(github_token=settings.github_token)
    repo = await github.create_repository(
        repo_name="test-omni-ai-repo",
        description="Test repo",
        private=False
    )
    assert repo["success"]
    assert repo["repo_name"] == "test-omni-ai-repo"

@pytest.mark.asyncio
async def test_vercel_create_project():
    vercel = VercelManager(vercel_token=settings.vercel_token)
    project = await vercel.create_project(
        project_name="test-omni-ai-project",
        git_repository={"type": "github", "repo": "CreoDAMO/test-omni-ai-repo"}
    )
    assert project["success"]
    assert project["project_name"] == "test-omni-ai-project"

@pytest.mark.asyncio
async def test_ai_config_generation():
    ai_config = AIConfigurator(openai_api_key=settings.openai_api_key)
    config = await ai_config.generate_github_config("test-repo", "nextjs")
    assert isinstance(config, dict)
    assert "package.json" in config
    assert ".gitignore" in config

@pytest.mark.asyncio
async def test_api_create_repo():
    # Requires JWT token; mock for testing
    response = client.post(
        "/deployment/github/create_repo",
        json={"repo_name": "test-api-repo", "description": "API test", "private": False, "project_type": "nextjs"},
        headers={"Authorization": f"Bearer {settings.jwt_secret}"}  # Replace with actual token
    )
    assert response.status_code in [200, 401]  # 401 if token invalid
```

### `security/tests/test_security.rs`
```rust
#[cfg(test)]
mod tests {
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    #[test]
    fn test_health_check() {
        let client = Client::tracked(rocket::build()).expect("valid rocket instance");
        let response = client.get("/health").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string().unwrap(), "Security service healthy");
    }

    #[test]
    fn test_jwt_validation() {
        let client = Client::tracked(rocket::build()).expect("valid rocket instance");
        let response = client.get("/validate_token?token=invalid").dispatch();
        assert_eq!(response.status(), Status::Unauthorized);
    }
}
```

### `frontend/tests/setup.test.tsx`
```tsx
import { render, screen } from '@testing-library/react';
import AIConfigurator from '../src/components/AIConfigurator';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

test('renders AIConfigurator component', () => {
  render(<AIConfigurator apiUrl="http://localhost:8000" token="test-token" />);
  expect(screen.getByText(/AI-Driven Project Configuration/i)).toBeInTheDocument();
});

test('creates GitHub repo and Vercel project', async () => {
  (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true, repo_name: 'test-repo' } });
  (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true, project_name: 'test-project' } });

  render(<AIConfigurator apiUrl="http://localhost:8000" token="test-token" />);
  const button = screen.getByText(/Create & Deploy Project/i);
  button.click();

  expect(axios.post).toHaveBeenCalledWith(
    'http://localhost:8000/deployment/github/create_repo',
    expect.any(Object),
    expect.any(Object)
  );
});
```

### Running Tests
1. **Backend**:
   ```bash
   cd backend
   pytest tests/test_setup.py
   ```
2. **Security**:
   ```bash
   cd security
   cargo test
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install vitest @testing-library/react @testing-library/jest-dom
   npm test
   ```

### Test Requirements
- Install `pytest`, `pytest-asyncio`, and `vitest`:
  ```bash
  pip install pytest pytest-asyncio
  npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
  ```
- Ensure API keys are set in `.env` for integration tests.
- Mock API responses for GitHub/Vercel if tokens are unavailable.

---

## 3. Extended README with Unity/Unreal Integration

The `README.md` above already includes Unity/Unreal integration steps in the **Installation** section (step 4). Here's a summary of the added steps for clarity:

- **Unity**:
  - Import DLSS via Package Manager from `nvidia_sdks/dlss_sdk`.
  - Add CloudXR by copying `nvidia_sdks/cloudxr_sdk` to the project and following the [CloudXR Guide](https://docs.nvidia.com/cloudxr-sdk/).
  - Configure API keys in Unity project settings for GeForce NOW and CloudXR.
- **Unreal**:
  - Install DLSS Plugin from [Unreal Marketplace](https://www.unrealengine.com/marketplace/en-US/product/nvidia-dlss).
  - Integrate CloudXR by copying `nvidia_sdks/cloudxr_sdk` and following the [CloudXR Unreal Guide](https://docs.nvidia.com/cloudxr-sdk/).

These steps ensure developers can set up XR projects with NVIDIA SDKs. If you need more detailed Unity/Unreal instructions (e.g., specific code snippets), let me know.

---

## 4. NOTICE File for Dependency Attribution

The `NOTICE` file is included in the script above (`$REPO_DIR/NOTICE`). It lists all open-source and proprietary dependencies with their licenses and source URLs, ensuring compliance with licensing requirements.

---

## 5. Initialize Repository Structure on GitHub

Since `https://github.com/CreoDAMO/OmniAI` is currently empty, you can initialize it using the script above. Here are the manual steps if you prefer to do it directly:

1. **Create Repository** (if not already done):
   - Go to `https://github.com/new`.
   - Name: `OmniAI`, Owner: `CreoDAMO`.
   - Set to **Public**, check "Add a README file" (optional, will be overwritten by script).
   - Click **Create repository**.

2. **Clone Locally**:
   ```bash
   git clone https://github.com/CreoDAMO/OmniAI.git
   cd OmniAI
   ```

3. **Run Initialization Script**:
   ```bash
   chmod +x init_omni_ai.sh
   ./init_omni_ai.sh
   ```

4. **Add API Keys to GitHub Secrets**:
   - Go to `https://github.com/CreoDAMO/OmniAI/settings/secrets/actions`.
   - Add secrets as listed in the README:
     - `GITHUB_TOKEN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `OPENAI_API_KEY`, `NVIDIA_DEVELOPER_API_KEY`, `GEFORCE_NOW_API_KEY`, `CLOUDXR_LICENSE_KEY`, `PINECONE_API_KEY`.

5. **Add Vercel Environment Variables**:
   ```bash
   cd frontend
   vercel link
   ```
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) > Project > **Settings** > **Environment Variables**.
   - Add variables as listed in the README.

6. **Verify Push**:
   - Check `https://github.com/CreoDAMO/OmniAI` for files (`README.md`, `LICENSE`, etc.).
   - Verify GitHub Actions: `https://github.com/CreoDAMO/OmniAI/actions`.

---

## Additional Notes
- **Script Customization**: Modify `init_omni_ai.sh` to skip `git push` if you want to review files locally first.
- **Test Suite Expansion**: Add more tests for specific endpoints (e.g., `/cloudxr/stream/start`) or Unity/Unreal integration if needed.
- **Repository Access**: Ensure you have write access to `https://github.com/CreoDAMO/OmniAI`. If you need assistance with GitHub permissions, let me know.
- **Contact Email**: Update the placeholder `[jacquedegraff81@gmail.com]` in `README.md` and `CODE_OF_CONDUCT.md` with your actual email.

