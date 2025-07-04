
# OmniAI on Replit

Welcome to OmniAI - an AI-powered XR and Cloud Gaming Platform designed to run seamlessly on Replit!

## 🚀 Quick Start

1. **Fork this Repl** to get your own copy
2. **Add Environment Variables** in the Secrets tab (see [Environment Setup](#environment-setup))
3. **Click the Run button** to start the platform
4. **Access the dashboard** at the provided URL

## 📁 Project Structure

```
omni-ai/
├── frontend/           # React/TypeScript UI with Mantine
├── backend/           # Python FastAPI backend
├── middleware/        # Rust security and caching layer
├── docs/             # Complete implementation guide
└── stress_test.py    # Performance testing suite
```

## 🛠️ Available Workflows

This Repl includes several pre-configured workflows accessible from the Run dropdown:

- **Run OmniAI Platform** ⭐ - Main workflow (Run button)
- **Backend Only** - Just the Python backend for testing
- **Stress Test Platform** - Run comprehensive tests
- **Build All Components** - Build frontend, middleware, and backend

## 🔧 Environment Setup

Click on the **Secrets** tab and add these environment variables:

### Required for Basic Operation
```
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

### NVIDIA Integration (Optional)
```
NVIDIA_DEVELOPER_API_KEY=your-nvidia-developer-key
GEFORCE_NOW_API_KEY=your-gfn-api-key
CLOUDXR_LICENSE_KEY=your-cloudxr-license
```

### GitHub & Vercel Integration (Optional)
```
GITHUB_TOKEN=your-github-personal-access-token
VERCEL_TOKEN=your-vercel-api-token
```

### AI Services (Optional)
```
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-west1-gcp
```

## 🌐 How to Use

### 1. Basic Setup
- The platform runs on multiple ports:
  - **Frontend**: Port 3000 (React UI)
  - **Backend**: Port 8000 (FastAPI)
  - **Middleware**: Port 8080 (Rust security layer)

### 2. Access the Dashboard
- Once running, open the webview to access the React dashboard
- Navigate between GitHub, Vercel, and NVIDIA integrations
- Create repositories and deploy projects directly from the UI

### 3. API Endpoints
The backend provides REST APIs at `/api/`:
- `/api/github/` - GitHub repository management
- `/api/vercel/` - Vercel deployment automation
- `/api/nvidia/` - NVIDIA SDK integration

### 4. Testing
Run the stress test workflow to verify all components:
- Tests backend health endpoints
- Validates API integrations
- Monitors performance metrics

## 🔍 Troubleshooting

### Common Issues

**"npm: command not found"**
- This is expected in the Replit environment
- Use the "Backend Only" workflow for testing without frontend
- The frontend components are included for reference

**Missing API Keys**
- Add required secrets in the Secrets tab
- Restart the Repl after adding new secrets
- Check the console for specific missing variables

**Port Conflicts**
- Replit automatically handles port forwarding
- The main application runs on port 8000
- Frontend (if available) runs on port 3000

### Debug Commands
Use the Shell tab to run:
```bash
# Check backend health
curl http://0.0.0.0:8000/health

# View logs
python quick_test.py

# Test specific components
python stress_test.py
```

## 📖 Features

### 🤖 AI-Powered Development
- **Automated Configuration**: AI generates GitHub and Vercel configs
- **Smart Deployments**: Intelligent project setup and deployment
- **Code Generation**: AI-driven asset and code creation

### 🎮 NVIDIA Integration
- **GeForce NOW**: Cloud gaming integration
- **CloudXR**: XR content streaming
- **DLSS**: AI-powered graphics enhancement

### 🔗 Deployment Automation
- **GitHub SDK**: Repository creation and management
- **Vercel SDK**: Automated deployments
- **CI/CD**: Integrated workflow automation

### 🛡️ Security & Performance
- **Rust Middleware**: High-performance security layer
- **Rate Limiting**: API protection
- **Input Validation**: Secure data handling
- **Caching**: Redis-powered performance

## 📚 Documentation

For detailed implementation guides and API documentation, see:
- [`docs/OmniAI_Complete_Implementation_Guide.md`](docs/OmniAI_Complete_Implementation_Guide.md)
- [`README.md`](README.md) - Complete project overview

## 🤝 Contributing

1. Fork this Repl
2. Make your changes
3. Test using the stress test workflow
4. Submit issues or improvements via GitHub

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Report problems via GitHub issues
- **Testing**: Use the built-in stress test for debugging

---

**Ready to build the future of XR and Cloud Gaming?** 🚀

Click the **Run** button to start your OmniAI platform!
