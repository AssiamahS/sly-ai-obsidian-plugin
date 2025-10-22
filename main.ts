import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	requestUrl
} from 'obsidian';

interface SlyAISettings {
	// API Settings
	apiEndpoint: string;
	modelName: string;

	// License
	licenseKey: string;
	isPro: boolean;

	// Pro Settings
	enableCodeReview: boolean;
	enableMultiModel: boolean;
	customPrompts: Record<string, string>;
}

const DEFAULT_SETTINGS: SlyAISettings = {
	apiEndpoint: 'http://localhost:11434/api/generate', // Ollama default
	modelName: 'qwen3:8b',
	licenseKey: '',
	isPro: false,
	enableCodeReview: false,
	enableMultiModel: false,
	customPrompts: {}
}

export default class SlyAIPlugin extends Plugin {
	settings: SlyAISettings;

	async onload() {
		await this.loadSettings();

		// Check license status
		this.validateLicense();

		// Add ribbon icon
		this.addRibbonIcon('brain', 'Sly.AI Chat', () => {
			new ChatModal(this.app, this).open();
		});

		// FREE COMMANDS

		this.addCommand({
			id: 'chat-with-ai',
			name: 'Chat with AI',
			callback: () => {
				new ChatModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'summarize-note',
			name: 'Summarize current note',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const content = editor.getValue();
				await this.summarizeText(content, editor);
			}
		});

		this.addCommand({
			id: 'ask-about-selection',
			name: 'Ask AI about selection',
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				if (!selection) {
					new Notice('Please select some text first');
					return;
				}
				new QuickAskModal(this.app, this, selection).open();
			}
		});

		// PRO COMMANDS (gated)

		this.addCommand({
			id: 'code-review',
			name: '⭐ PRO: Code Review',
			editorCallback: async (editor: Editor) => {
				if (!this.settings.isPro) {
					this.showProUpgrade('Code Review');
					return;
				}
				const code = editor.getSelection() || editor.getValue();
				await this.reviewCode(code, editor);
			}
		});

		this.addCommand({
			id: 'batch-process-vault',
			name: '⭐ PRO: Batch Process Vault',
			callback: async () => {
				if (!this.settings.isPro) {
					this.showProUpgrade('Batch Processing');
					return;
				}
				new BatchProcessModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'multi-model-chat',
			name: '⭐ PRO: Multi-Model Chat',
			callback: async () => {
				if (!this.settings.isPro) {
					this.showProUpgrade('Multi-Model Chat');
					return;
				}
				new MultiModelChatModal(this.app, this).open();
			}
		});

		// Settings tab
		this.addSettingTab(new SlyAISettingTab(this.app, this));

		// Status bar
		const statusBarItem = this.addStatusBarItem();
		statusBarItem.setText(this.settings.isPro ? '⭐ Sly.AI Pro' : 'Sly.AI Free');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// License Validation
	validateLicense() {
		const key = this.settings.licenseKey;

		if (!key) {
			this.settings.isPro = false;
			return;
		}

		// Simple validation - in production, validate against server
		// Format: SLYAI-XXXX-XXXX-XXXX-XXXX
		const isValid = this.checkLicenseFormat(key);

		if (isValid) {
			this.settings.isPro = true;
			new Notice('✓ Sly.AI Pro activated!');
		} else {
			this.settings.isPro = false;
			new Notice('Invalid license key');
		}
	}

	checkLicenseFormat(key: string): boolean {
		// Basic format check
		const pattern = /^SLYAI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

		if (!pattern.test(key)) {
			return false;
		}

		// In production, validate against your server
		// For now, accept any properly formatted key
		return true;
	}

	showProUpgrade(feature: string) {
		new ProUpgradeModal(this.app, feature).open();
	}

	// AI Methods

	async callAI(prompt: string, systemPrompt?: string): Promise<string> {
		try {
			const response = await requestUrl({
				url: this.settings.apiEndpoint,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: this.settings.modelName,
					prompt: prompt,
					system: systemPrompt || 'You are a helpful AI assistant integrated into Obsidian.',
					stream: false
				})
			});

			return response.json.response;
		} catch (error) {
			console.error('AI API Error:', error);
			throw new Error(`Failed to connect to AI: ${error.message}`);
		}
	}

	async summarizeText(text: string, editor: Editor) {
		new Notice('Summarizing...');

		try {
			const summary = await this.callAI(
				`Please provide a concise summary of the following text:\n\n${text}`,
				'You are a summarization assistant. Provide clear, concise summaries.'
			);

			editor.replaceSelection(`\n\n## AI Summary\n\n${summary}\n`);
			new Notice('✓ Summary generated');
		} catch (error) {
			new Notice(`Error: ${error.message}`);
		}
	}

	async reviewCode(code: string, editor: Editor) {
		new Notice('Reviewing code...');

		try {
			const review = await this.callAI(
				`Please review this code and provide:\n1. Issues/bugs\n2. Suggestions for improvement\n3. Security concerns\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
				'You are an expert code reviewer. Be concise but thorough.'
			);

			editor.replaceSelection(`\n\n## AI Code Review\n\n${review}\n`);
			new Notice('✓ Code review complete');
		} catch (error) {
			new Notice(`Error: ${error.message}`);
		}
	}
}

// Chat Modal
class ChatModal extends Modal {
	plugin: SlyAIPlugin;
	chatHistory: Array<{role: string, content: string}> = [];

	constructor(app: App, plugin: SlyAIPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		contentEl.addClass('sly-ai-chat-modal');

		contentEl.createEl('h2', {text: '💬 Chat with Sly.AI'});

		// Chat container
		const chatContainer = contentEl.createDiv({cls: 'sly-ai-chat-container'});

		// Input area
		const inputContainer = contentEl.createDiv({cls: 'sly-ai-input-container'});

		const input = inputContainer.createEl('textarea', {
			placeholder: 'Ask me anything about your notes...',
			cls: 'sly-ai-input'
		});

		const sendBtn = inputContainer.createEl('button', {
			text: 'Send',
			cls: 'mod-cta'
		});

		sendBtn.onclick = async () => {
			const message = input.value.trim();
			if (!message) return;

			// Add user message
			this.addMessage('user', message, chatContainer);
			input.value = '';

			// Get AI response
			try {
				const response = await this.plugin.callAI(message);
				this.addMessage('ai', response, chatContainer);
			} catch (error) {
				this.addMessage('error', `Error: ${error.message}`, chatContainer);
			}
		};

		// Enter to send
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendBtn.click();
			}
		});
	}

	addMessage(role: string, content: string, container: HTMLElement) {
		const messageEl = container.createDiv({cls: `sly-ai-message sly-ai-message-${role}`});
		const label = role === 'user' ? 'You' : role === 'ai' ? 'Sly.AI' : 'Error';
		messageEl.createEl('strong', {text: `${label}: `});
		messageEl.createSpan({text: content});
		container.scrollTop = container.scrollHeight;
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// Quick Ask Modal
class QuickAskModal extends Modal {
	plugin: SlyAIPlugin;
	selection: string;

	constructor(app: App, plugin: SlyAIPlugin, selection: string) {
		super(app);
		this.plugin = plugin;
		this.selection = selection;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		contentEl.createEl('h3', {text: 'Ask about selection'});
		contentEl.createEl('p', {text: `Selected: "${this.selection.substring(0, 100)}..."`});

		const input = contentEl.createEl('input', {
			type: 'text',
			placeholder: 'What would you like to know?'
		});
		input.style.width = '100%';
		input.style.marginTop = '10px';

		const askBtn = contentEl.createEl('button', {
			text: 'Ask',
			cls: 'mod-cta'
		});
		askBtn.style.marginTop = '10px';

		askBtn.onclick = async () => {
			const question = input.value;
			if (!question) return;

			const fullPrompt = `Based on this text:\n\n"${this.selection}"\n\n${question}`;

			try {
				const answer = await this.plugin.callAI(fullPrompt);
				new Notice('Answer copied to clipboard');
				navigator.clipboard.writeText(answer);
				this.close();
			} catch (error) {
				new Notice(`Error: ${error.message}`);
			}
		};
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// Pro Upgrade Modal
class ProUpgradeModal extends Modal {
	feature: string;

	constructor(app: App, feature: string) {
		super(app);
		this.feature = feature;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		contentEl.addClass('sly-ai-pro-modal');

		contentEl.createEl('h2', {text: '⭐ Upgrade to Sly.AI Pro'});
		contentEl.createEl('p', {text: `"${this.feature}" is a Pro feature.`});

		const benefits = contentEl.createEl('div', {cls: 'sly-ai-pro-benefits'});
		benefits.createEl('h3', {text: 'Pro Features:'});

		const list = benefits.createEl('ul');
		list.createEl('li', {text: '✓ Code Review & Analysis'});
		list.createEl('li', {text: '✓ Multi-Model Support (Qwen, Llama, Mistral)'});
		list.createEl('li', {text: '✓ Batch Process Entire Vault'});
		list.createEl('li', {text: '✓ Custom AI Prompts'});
		list.createEl('li', {text: '✓ Priority Support'});
		list.createEl('li', {text: '✓ Early Access to New Features'});

		const pricing = contentEl.createEl('div', {cls: 'sly-ai-pricing'});
		pricing.createEl('h3', {text: 'Pricing'});
		pricing.createEl('p', {text: '💰 $15 one-time payment'});
		pricing.createEl('p', {text: 'or $5/month subscription'});

		const buyBtn = contentEl.createEl('button', {
			text: 'Get Pro →',
			cls: 'mod-cta'
		});
		buyBtn.style.fontSize = '16px';
		buyBtn.style.padding = '12px 24px';
		buyBtn.onclick = () => {
			window.open('https://sly.ai/pro', '_blank');
		};

		const enterKey = contentEl.createEl('div', {cls: 'sly-ai-enter-key'});
		enterKey.createEl('p', {text: 'Already have a license key?'});
		const keyInput = enterKey.createEl('input', {
			type: 'text',
			placeholder: 'SLYAI-XXXX-XXXX-XXXX-XXXX'
		});
		keyInput.style.width = '300px';
		keyInput.style.marginTop = '8px';
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// Batch Process Modal (Pro only)
class BatchProcessModal extends Modal {
	plugin: SlyAIPlugin;

	constructor(app: App, plugin: SlyAIPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		contentEl.createEl('h2', {text: '⚡ Batch Process Vault'});
		contentEl.createEl('p', {text: 'Process multiple notes with AI'});

		// Action selection
		const actionSelect = contentEl.createEl('select');
		actionSelect.createEl('option', {text: 'Summarize all notes', value: 'summarize'});
		actionSelect.createEl('option', {text: 'Extract keywords', value: 'keywords'});
		actionSelect.createEl('option', {text: 'Generate titles', value: 'titles'});

		const processBtn = contentEl.createEl('button', {
			text: 'Start Processing',
			cls: 'mod-cta'
		});
		processBtn.style.marginTop = '20px';

		processBtn.onclick = async () => {
			new Notice('Batch processing started...');
			this.close();
			// Implement batch processing logic
		};
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// Multi-Model Chat Modal (Pro only)
class MultiModelChatModal extends Modal {
	plugin: SlyAIPlugin;

	constructor(app: App, plugin: SlyAIPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		contentEl.createEl('h2', {text: '🤖 Multi-Model Chat'});
		contentEl.createEl('p', {text: 'Compare responses from different AI models'});

		const modelSelect = contentEl.createEl('select');
		modelSelect.createEl('option', {text: 'Qwen 2.5', value: 'qwen2.5:latest'});
		modelSelect.createEl('option', {text: 'Llama 3', value: 'llama3:latest'});
		modelSelect.createEl('option', {text: 'Mistral', value: 'mistral:latest'});

		// Chat interface
		const input = contentEl.createEl('textarea', {placeholder: 'Your question...'});
		input.style.width = '100%';
		input.style.marginTop = '10px';

		const askBtn = contentEl.createEl('button', {text: 'Ask All Models', cls: 'mod-cta'});
		askBtn.style.marginTop = '10px';

		const resultsContainer = contentEl.createDiv({cls: 'sly-ai-multi-results'});

		askBtn.onclick = async () => {
			const question = input.value;
			if (!question) return;

			resultsContainer.empty();
			new Notice('Querying models...');

			// Query each model
			const models = ['qwen2.5:latest', 'llama3:latest', 'mistral:latest'];
			for (const model of models) {
				const originalModel = this.plugin.settings.modelName;
				this.plugin.settings.modelName = model;

				try {
					const response = await this.plugin.callAI(question);
					const resultDiv = resultsContainer.createDiv({cls: 'model-result'});
					resultDiv.createEl('h4', {text: model});
					resultDiv.createEl('p', {text: response});
				} catch (error) {
					resultsContainer.createEl('p', {text: `${model}: Error`});
				}

				this.plugin.settings.modelName = originalModel;
			}
		};
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// Settings Tab
class SlyAISettingTab extends PluginSettingTab {
	plugin: SlyAIPlugin;

	constructor(app: App, plugin: SlyAIPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl('h2', {text: 'Sly.AI Settings'});

		// License Section
		containerEl.createEl('h3', {text: '⭐ License'});

		if (this.plugin.settings.isPro) {
			containerEl.createEl('p', {
				text: '✓ Pro version activated',
				cls: 'sly-ai-pro-badge'
			});
		} else {
			const proInfo = containerEl.createDiv();
			proInfo.createEl('p', {text: 'Upgrade to Pro for advanced features!'});
			const upgradeBtn = proInfo.createEl('button', {
				text: 'Get Pro →',
				cls: 'mod-cta'
			});
			upgradeBtn.onclick = () => {
				window.open('https://sly.ai/pro', '_blank');
			};
		}

		new Setting(containerEl)
			.setName('License Key')
			.setDesc('Enter your Sly.AI Pro license key')
			.addText(text => text
				.setPlaceholder('SLYAI-XXXX-XXXX-XXXX-XXXX')
				.setValue(this.plugin.settings.licenseKey)
				.onChange(async (value) => {
					this.plugin.settings.licenseKey = value;
					await this.plugin.saveSettings();
					this.plugin.validateLicense();
					this.display(); // Refresh
				}));

		// API Settings
		containerEl.createEl('h3', {text: 'API Settings'});

		new Setting(containerEl)
			.setName('API Endpoint')
			.setDesc('Ollama API endpoint (usually http://localhost:11434/api/generate)')
			.addText(text => text
				.setPlaceholder('http://localhost:11434/api/generate')
				.setValue(this.plugin.settings.apiEndpoint)
				.onChange(async (value) => {
					this.plugin.settings.apiEndpoint = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Model Name')
			.setDesc('Recommended: qwen3:8b (balanced), qwen2.5-coder:7b (code), qwen2.5:14b (quality)')
			.addText(text => text
				.setPlaceholder('qwen3:8b')
				.setValue(this.plugin.settings.modelName)
				.onChange(async (value) => {
					this.plugin.settings.modelName = value;
					await this.plugin.saveSettings();
				}));

		// Test connection
		new Setting(containerEl)
			.setName('Test Connection')
			.setDesc('Test connection to AI model')
			.addButton(button => button
				.setButtonText('Test')
				.onClick(async () => {
					try {
						await this.plugin.callAI('Say hi!');
						new Notice('✓ Connection successful');
					} catch (error) {
						new Notice(`✗ Connection failed: ${error.message}`);
					}
				}));
	}
}
