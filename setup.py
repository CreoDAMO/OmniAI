
#!/usr/bin/env python3
"""
OmniAI Platform Setup Script
"""

import os
import sys
import subprocess

def install_dependencies():
    """Install Python dependencies"""
    print("🔧 Installing Python dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("✅ Dependencies installed successfully!")

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    directories = [
        "backend/core/routes",
        "frontend/static",
        "uploads",
        "logs"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"   Created: {directory}")
    
    print("✅ Directories created successfully!")

def setup_environment():
    """Setup environment file"""
    print("🔐 Setting up environment...")
    
    if not os.path.exists(".env"):
        print("   Copying .env.example to .env")
        if os.path.exists(".env.example"):
            import shutil
            shutil.copy(".env.example", ".env")
            print("   ⚠️  Please edit .env file with your API keys")
        else:
            print("   ⚠️  .env.example not found")
    else:
        print("   .env file already exists")
    
    print("✅ Environment setup complete!")

def main():
    """Main setup function"""
    print("🚀 OmniAI Platform Setup")
    print("=" * 40)
    
    try:
        create_directories()
        install_dependencies()
        setup_environment()
        
        print("\n" + "=" * 40)
        print("🎉 Setup complete!")
        print("\nNext steps:")
        print("1. Edit .env file with your API keys")
        print("2. Run: python main.py")
        print("3. Visit: http://localhost:5000")
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
