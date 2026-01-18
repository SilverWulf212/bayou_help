# Bayou Help 🌊

A free, public web app that offers quick, simple help to people facing homelessness in Acadiana (South Louisiana)—using local resources, short guidance, and AI grounded in real data.

## 🎯 Mission

Bayou Help provides instant, accessible assistance to people experiencing homelessness or housing instability in Acadiana. The app connects users with verified local services, offers practical guidance, and works on any mobile device under challenging conditions.

## ✨ Features

- **AI Chat Assistant**: Simple, respectful guidance written at a 6th-grade reading level
- **Resource Finder**: Search for shelters, food pantries, and local services by location
- **Location-Aware**: Filter resources by parish or city
- **Mobile-First**: Designed for smartphones with limited data plans
- **Privacy-Focused**: No user accounts, no data storage, quick exit button
- **Offline Support**: Core resources available even when connection is poor

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SilverWulf212/bayou_help.git
   cd bayou_help
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` and set:
   ```
   PORT=3000
   ADMIN_PASSWORD=your-secure-password-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Client at http://localhost:5173
   - Server at http://localhost:3000

### Building for Production

```bash
npm run build
```

Built files will be in:
- `client/dist` - Frontend assets
- `server/src` - Backend (no build step needed)

## 🏗️ Project Structure

```
bayou_help/
├── client/          # React frontend (Vite + Tailwind CSS)
├── server/          # Express.js backend
├── shared/          # Shared types and utilities
├── package.json     # Root workspace configuration
└── README.md
```

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Deployment**: Self-hosted or low-cost cloud (VPS, Fly.io, etc.)

## 📝 Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build for production
- `npm run lint` - Lint all code

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔒 Security

This application handles sensitive use cases. Please see [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built to serve the Acadiana community in South Louisiana. Designed with input from local shelters, social workers, and people with lived experience of homelessness.

## 📞 Contact

For questions or feedback about this project, please open an issue on GitHub.

---

**Note**: This is a community project. It is not a substitute for professional help. In emergencies, always call 911 or your local crisis hotline.

