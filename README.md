# Sly.AI - Local AI Assistant for Obsidian

**Chat with your vault using local AI models (Qwen, Llama, Mistral). No cloud, no subscriptions, complete privacy.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Obsidian](https://img.shields.io/badge/obsidian-%3E%3D0.15.0-purple)

## 🌟 What is Sly.AI?

Sly.AI brings powerful local AI directly into Obsidian. Run Qwen, Llama, Mistral, and other open-source models locally on your machine - no API keys, no data leaving your computer, no monthly fees.

### Free Features

- ✅ **Chat with AI** - Ask questions about your notes
- ✅ **Summarize Notes** - Get quick summaries of long documents
- ✅ **Quick Questions** - Select text and ask the AI about it
- ✅ **100% Local** - All processing happens on your machine
- ✅ **Complete Privacy** - Your data never leaves your computer

### ⭐ Pro Features ($15 one-time or $5/month)

- 🚀 **Code Review** - Get AI-powered code analysis and suggestions
- 🤖 **Multi-Model Support** - Compare responses from Qwen, Llama, Mistral
- ⚡ **Batch Processing** - Process your entire vault at once
- 🎨 **Custom Prompts** - Create and save custom AI workflows
- 📊 **Advanced Analysis** - Deep insights into your knowledge base
- 🎯 **Priority Support** - Get help when you need it
- 🔥 **Early Access** - Be first to try new features

## 💰 Pricing

| Plan | Price | What You Get |
|------|-------|--------------|
| **Free** | $0 | Chat, summarize, basic features |
| **Pro (Monthly)** | $5/month | All Pro features, cancel anytime |
| **Pro (Lifetime)** | $15 once | All Pro features, forever |

**[Get Pro →](https://sly.ai/pro)**

## 🚀 Quick Start

### 1. Install Ollama (Free Local AI Runtime)

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Or download from https://ollama.com
```

### 2. Install AI Models

```bash
# Install Qwen (recommended)
ollama pull qwen2.5:latest

# Optional: Install more models
ollama pull llama3:latest
ollama pull mistral:latest
```

### 3. Install Sly.AI Plugin

#### From Obsidian Community Plugins (Recommended)

1. Open Obsidian Settings
2. Go to **Community Plugins** → Browse
3. Search for "**Sly.AI**"
4. Click **Install** → **Enable**

#### Manual Installation

1. Download the [latest release](https://github.com/AssiamahS/sly-ai-obsidian-plugin/releases)
2. Extract to `.obsidian/plugins/sly-ai/`
3. Reload Obsidian
4. Enable the plugin

### 4. Configure

1. Open Settings → Sly.AI
2. Verify API endpoint: `http://localhost:11434/api/generate`
3. Set model name: `qwen2.5:latest`
4. Click "Test Connection" to verify

## 📖 Usage

### Chat with AI

- Click the **brain icon** 🧠 in the sidebar, or
- Use command palette (`Cmd/Ctrl + P`) → "Chat with AI"

### Summarize Notes

1. Open any note
2. `Cmd/Ctrl + P` → "Summarize current note"
3. AI summary appears at the bottom

### Ask About Selection

1. Select text in your note
2. `Cmd/Ctrl + P` → "Ask AI about selection"
3. Enter your question
4. Answer copied to clipboard

### Code Review (Pro)

1. Select code or open a code file
2. `Cmd/Ctrl + P` → "⭐ PRO: Code Review"
3. Get detailed analysis, bugs, improvements

### Multi-Model Chat (Pro)

1. `Cmd/Ctrl + P` → "⭐ PRO: Multi-Model Chat"
2. Ask a question
3. See responses from Qwen, Llama, AND Mistral side-by-side

## 🔑 Activating Pro

### Option 1: Buy a License

1. Visit **[sly.ai/pro](https://sly.ai/pro)**
2. Choose monthly ($5) or lifetime ($15)
3. Get your license key: `SLYAI-XXXX-XXXX-XXXX-XXXX`
4. In Obsidian Settings → Sly.AI → Enter license key
5. ✓ Pro activated!

### Option 2: Already Have a Key?

1. Settings → Sly.AI
2. Paste your license key
3. All Pro features unlock instantly

## 🛠️ Technical Details

### Requirements

- Obsidian >= 0.15.0
- Ollama (or compatible local LLM server)
- Any Ollama-compatible model (Qwen, Llama, Mistral, etc.)

### Supported Models

- Qwen 2.5 (recommended)
- Llama 3
- Mistral
- Code Llama
- Any Ollama-compatible model

### API

Sly.AI uses Ollama's API format. If you're running a different local LLM server, just point to the right endpoint in settings.

### Privacy

- **100% local** - All AI runs on your machine
- **No tracking** - We don't collect any data
- **No cloud** - Your notes never leave your computer
- **No API keys** - No accounts to create

## 🎯 Business Model

### Why Freemium?

We believe everyone should have access to local AI. The free version is fully functional and will always be free.

Pro features fund development and support while keeping the core features accessible to everyone.

### What's Your Money Going Toward?

- 🔧 **Continuous Development** - New features, bug fixes, improvements
- 📚 **Documentation** - Guides, tutorials, examples
- 🤝 **Support** - Help when you need it
- 🎨 **Design** - Beautiful UI/UX
- 🚀 **Infrastructure** - License validation, website, CDN

### Refund Policy

Not happy? **Full refund within 30 days, no questions asked.**

Email: support@sly.ai

## 🤝 For Developers

### Building from Source

```bash
git clone https://github.com/AssiamahS/sly-ai-obsidian-plugin.git
cd sly-ai-obsidian-plugin
npm install
npm run build
```

### Development

```bash
npm run dev  # Watch mode
```

### Contributing

Pull requests welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

## 📊 Roadmap

- [ ] Voice input/output
- [ ] Image analysis (multimodal AI)
- [ ] Custom fine-tuned models
- [ ] Collaborative AI (share prompts with team)
- [ ] Integration with GitHub Copilot
- [ ] RAG (Retrieval Augmented Generation) for better context

## 🐛 Troubleshooting

### "Failed to connect to AI"

**Fix:**
1. Make sure Ollama is running: `ollama serve`
2. Test in terminal: `curl http://localhost:11434/api/generate`
3. Check Settings → Sly.AI → Test Connection

### "Model not found"

**Fix:**
```bash
ollama pull qwen2.5:latest
```

### Pro features not working

**Fix:**
1. Settings → Sly.AI
2. Re-enter license key
3. If still broken, email: support@sly.ai

## 💬 Support

- 📧 Email: support@sly.ai
- 💬 Discord: [Join community](https://discord.gg/slyai)
- 🐛 Issues: [GitHub Issues](https://github.com/AssiamahS/sly-ai-obsidian-plugin/issues)

## 📜 License

MIT License - Free to use, modify, distribute

The Pro licensing system is separate and proprietary.

## 🙏 Credits

Created by **[Sylvester Assiamah](https://sylvesterassiamah.com)** ([@AssiamahS](https://github.com/AssiamahS))

Powered by:
- [Ollama](https://ollama.com) - Local LLM runtime
- [Qwen](https://github.com/QwenLM/Qwen) - Open-source AI models
- [Obsidian](https://obsidian.md) - Knowledge management

---

**Ready to supercharge your notes with AI?**

**[⭐ Get Pro →](https://sly.ai/pro)** | **[📚 Docs](https://docs.sly.ai)** | **[💬 Discord](https://discord.gg/slyai)**

