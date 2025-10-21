# 📤 Obsidian Community Plugin Submission Guide

**How to Get Sly.AI Listed in the Official Obsidian Plugin Directory**

## Prerequisites

Before submitting, make sure:

- [x] Plugin works flawlessly
- [x] No critical bugs
- [x] Clean, well-documented code
- [x] Good README with clear instructions
- [x] Screenshots/demo video
- [x] Tested on Windows, macOS, Linux (if possible)
- [x] Follows Obsidian's guidelines

## Submission Process

### Step 1: Prepare Your Repository

1. **Make sure these files exist:**
   ```
   sly-ai-obsidian-plugin/
   ├── manifest.json       ← Required
   ├── main.js             ← Compiled plugin
   ├── styles.css          ← Optional but recommended
   ├── README.md           ← Required
   └── versions.json       ← Required for updates
   ```

2. **Build the plugin:**
   ```bash
   npm run build
   ```

3. **Test the plugin:**
   - Copy to `.obsidian/plugins/sly-ai/`
   - Enable and test all features
   - Fix any bugs

4. **Commit everything:**
   ```bash
   git add .
   git commit -m "Ready for community plugin submission"
   git push
   ```

### Step 2: Create a Release

1. **Go to your GitHub repo:**
   https://github.com/AssiamahS/sly-ai-obsidian-plugin

2. **Click "Releases" → "Create a new release"**

3. **Tag version:** `1.0.0`

4. **Release title:** `Sly.AI v1.0.0 - Local AI Assistant`

5. **Description:**
   ```markdown
   ## What's New

   Initial release of Sly.AI - Local AI Assistant for Obsidian

   ### Features
   - Chat with your vault using local AI (Qwen, Llama, Mistral)
   - Summarize notes with one command
   - Ask questions about selected text
   - 100% privacy - all processing happens locally
   - Pro version with code review, multi-model chat, and more

   ### Installation
   1. Install Ollama
   2. Pull an AI model: `ollama pull qwen2.5:latest`
   3. Install plugin from Community Plugins
   4. Configure in settings

   See README for full documentation.
   ```

6. **Upload files:**
   - Attach `main.js`
   - Attach `manifest.json`
   - Attach `styles.css`

7. **Publish release**

### Step 3: Submit to Community Plugins

1. **Fork the community plugins repo:**
   https://github.com/obsidianmd/obsidian-releases

2. **Clone your fork:**
   ```bash
   git clone https://github.com/AssiamahS/obsidian-releases.git
   cd obsidian-releases
   ```

3. **Add your plugin to `community-plugins.json`:**

   Find the right alphabetical spot and add:

   ```json
   {
     "id": "sly-ai",
     "name": "Sly.AI - Local AI Assistant",
     "author": "Sly.AI (Sylvester Assiamah)",
     "description": "Chat with your vault using local AI (Qwen, Llama, Mistral). Code review, smart search, and AI-powered knowledge management with complete privacy.",
     "repo": "AssiamahS/sly-ai-obsidian-plugin",
     "branch": "master"
   }
   ```

4. **Commit and push:**
   ```bash
   git add community-plugins.json
   git commit -m "Add Sly.AI - Local AI Assistant plugin"
   git push
   ```

5. **Create Pull Request:**
   - Go to your fork on GitHub
   - Click "Pull Request"
   - Title: `Add Sly.AI - Local AI Assistant`
   - Description:
     ```markdown
     ## Plugin Information

     - **Name:** Sly.AI - Local AI Assistant
     - **ID:** sly-ai
     - **Author:** Sly.AI (Sylvester Assiamah)
     - **Repo:** https://github.com/AssiamahS/sly-ai-obsidian-plugin

     ## Description

     Sly.AI brings local AI directly into Obsidian. Users can chat with their vault, summarize notes, and get AI assistance without sending data to the cloud.

     Features:
     - Works with Ollama (Qwen, Llama, Mistral)
     - 100% local processing
     - Complete privacy
     - Free tier + optional Pro features

     ## Testing

     - [x] Tested on macOS
     - [x] Tested on Windows
     - [x] Tested on Linux
     - [x] No critical bugs
     - [x] Follows community guidelines

     ## Screenshots

     [Add screenshots here]
     ```

6. **Submit PR**

### Step 4: Wait for Review

- Obsidian team will review (usually 1-2 weeks)
- They may request changes
- Address feedback quickly
- Once approved, your plugin goes live!

## After Approval

### 1. Monitor Downloads

Check your GitHub repo's traffic to see downloads.

### 2. Support Users

- Monitor GitHub issues
- Respond to questions
- Fix bugs quickly

### 3. Update Regularly

When releasing updates:

1. **Update version in `manifest.json`:**
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **Update `versions.json`:**
   ```json
   {
     "1.0.0": "0.15.0",
     "1.1.0": "0.15.0"
   }
   ```

3. **Build and create release:**
   ```bash
   npm run build
   git tag 1.1.0
   git push --tags
   ```

4. **Create GitHub release with assets**

5. **Users get auto-update!**

## Tips for Getting Approved

### DO ✅

- Write clear, concise documentation
- Include screenshots/GIFs
- Test on multiple platforms
- Follow code quality standards
- Respond professionally to feedback
- Be patient

### DON'T ❌

- Submit broken code
- Include ads or tracking
- Violate Obsidian's guidelines
- Be pushy or impatient
- Ignore requested changes

## Common Rejection Reasons

1. **Missing required files**
   - Solution: Include manifest.json, versions.json, README.md

2. **Bugs in core functionality**
   - Solution: Test thoroughly before submitting

3. **Poor documentation**
   - Solution: Write clear README with examples

4. **Security concerns**
   - Solution: Don't access external APIs without user consent

5. **Violates guidelines**
   - Solution: Read https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines

## Marketing After Approval

Once live in the community plugins:

### Week 1
- [ ] Post on r/ObsidianMD
- [ ] Tweet with #ObsidianMD
- [ ] Email Obsidian YouTubers
- [ ] Post in Obsidian Discord

### Week 2-4
- [ ] Create tutorial videos
- [ ] Write blog posts
- [ ] Engage with users
- [ ] Fix reported bugs

## Resources

- **Obsidian Plugin Guidelines:**
  https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines

- **Sample Plugins:**
  - Templater
  - Dataview
  - Kanban

- **Obsidian Developer Docs:**
  https://docs.obsidian.md/

- **Community Plugins Repo:**
  https://github.com/obsidianmd/obsidian-releases

## Checklist

Before submitting, verify:

- [ ] manifest.json has correct id, name, version
- [ ] README.md is complete and clear
- [ ] main.js is built and works
- [ ] styles.css (if used) is clean
- [ ] versions.json exists
- [ ] GitHub release created with assets
- [ ] Plugin tested in clean vault
- [ ] No console errors
- [ ] Follows Obsidian's API correctly
- [ ] No hardcoded paths
- [ ] Works cross-platform
- [ ] Graceful error handling
- [ ] No data sent to external servers without consent

---

**You're ready! Let's get Sly.AI in front of thousands of Obsidian users. 🚀**

Good luck, Sly!
