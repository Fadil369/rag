// صاغ - SAGH Enhanced App with Advanced Engines
// BrainSAIT | برينسايت

class SAGHApp {
    constructor() {
        this.documents = [];
        this.currentProvider = 'gemini';
        this.messages = [];
        this.isProcessing = false;
        this.currentLanguage = 'ar';
        this.apiKeys = this.loadAPIKeys();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedDocuments();
        this.updateUI();
    }

    // ==================== FILE UPLOAD WITH SPINNER ====================
    setupEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-teal', 'bg-gray-700');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-teal', 'bg-gray-700');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-teal', 'bg-gray-700');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        // Click to upload
        dropZone.addEventListener('click', () => fileInput.click());
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // AI Provider selection
        document.querySelectorAll('.ai-provider-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentProvider = e.target.dataset.provider;
                this.updateProviderUI();
            });
        });

        // Engine buttons
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeDocument());
        document.getElementById('summarizeBtn')?.addEventListener('click', () => this.summarizeDocument());
        document.getElementById('translateBtn')?.addEventListener('click', () => this.translateDocument());
        document.getElementById('repurposeBtn')?.addEventListener('click', () => this.repurposeDocument());
        
        // Download button
        document.getElementById('downloadBtn')?.addEventListener('click', () => this.downloadResults());

        // Send message
        document.getElementById('sendBtn')?.addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Voice input
        document.getElementById('voiceBtn')?.addEventListener('click', () => this.startVoiceInput());

        // Language toggle
        document.getElementById('langToggle')?.addEventListener('click', () => this.toggleLanguage());

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.executeQuickAction(action);
            });
        });
    }

    async handleFiles(files) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => this.isValidFile(file));

        if (validFiles.length === 0) {
            this.showNotification('يرجى رفع ملفات PDF, DOCX, أو TXT فقط', 'error');
            return;
        }

        for (const file of validFiles) {
            await this.processFile(file);
        }
    }

    isValidFile(file) {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'text/csv',
            'application/json'
        ];
        return validTypes.includes(file.type);
    }

    async processFile(file) {
        const fileId = Date.now() + Math.random();
        
        // Show spinner
        this.showFileSpinner(file.name, fileId);

        try {
            // Extract text based on file type
            let text = '';
            const fileSize = (file.size / (1024 * 1024)).toFixed(2); // MB

            if (file.type === 'application/pdf') {
                text = await this.extractPDFText(file);
            } else if (file.type.includes('word')) {
                text = await this.extractDOCXText(file);
            } else if (file.type === 'text/plain' || file.type === 'text/csv') {
                text = await file.text();
            } else if (file.type === 'application/json') {
                const jsonContent = await file.text();
                text = JSON.stringify(JSON.parse(jsonContent), null, 2);
            }

            const document = {
                id: fileId,
                name: file.name,
                type: file.type,
                size: fileSize,
                text: text,
                uploadDate: new Date().toISOString(),
                chunks: this.chunkDocument(text),
                metadata: {
                    wordCount: text.split(/\s+/).length,
                    charCount: text.length,
                    language: this.detectLanguage(text)
                }
            };

            this.documents.push(document);
            this.saveDocuments();
            
            // Hide spinner and show success
            this.hideFileSpinner(fileId);
            this.showNotification(`✅ تم رفع: ${file.name} (${fileSize} MB)`, 'success');
            this.updateDocumentsList();
            
            // Auto-analyze
            await this.quickAnalyze(document);

        } catch (error) {
            console.error('Error processing file:', error);
            this.hideFileSpinner(fileId);
            this.showNotification(`❌ خطأ في معالجة: ${file.name}`, 'error');
        }
    }

    showFileSpinner(fileName, fileId) {
        const spinnerHTML = `
            <div id="spinner-${fileId}" class="file-spinner glass-card p-4 mb-3 flex items-center gap-4">
                <div class="spinner-ring">
                    <div></div><div></div><div></div><div></div>
                </div>
                <div class="flex-1">
                    <p class="text-white font-semibold">${fileName}</p>
                    <p class="text-gray-400 text-sm">جاري المعالجة...</p>
                </div>
                <div class="text-2xl">📄</div>
            </div>
        `;
        
        const container = document.getElementById('uploadSpinners');
        if (container) {
            container.insertAdjacentHTML('beforeend', spinnerHTML);
        }
    }

    hideFileSpinner(fileId) {
        const spinner = document.getElementById(`spinner-${fileId}`);
        if (spinner) {
            spinner.classList.add('fade-out');
            setTimeout(() => spinner.remove(), 500);
        }
    }

    // ==================== ADVANCED ANALYSIS ENGINE ====================
    async analyzeDocument(docId = null) {
        const doc = docId ? this.documents.find(d => d.id === docId) : this.documents[this.documents.length - 1];
        
        if (!doc) {
            this.showNotification('لا توجد مستندات لتحليلها', 'error');
            return;
        }

        this.showEngineSpinner('تحليل متقدم');

        try {
            const analysis = {
                summary: await this.generateSummary(doc.text, 'detailed'),
                keyPoints: await this.extractKeyPoints(doc.text),
                entities: await this.extractEntities(doc.text),
                sentiment: await this.analyzeSentiment(doc.text),
                topics: await this.extractTopics(doc.text),
                statistics: {
                    wordCount: doc.metadata.wordCount,
                    charCount: doc.metadata.charCount,
                    avgWordLength: (doc.metadata.charCount / doc.metadata.wordCount).toFixed(2),
                    readingTime: Math.ceil(doc.metadata.wordCount / 200), // minutes
                    language: doc.metadata.language
                }
            };

            this.displayAnalysisResults(doc.name, analysis);
            this.hideEngineSpinner();

        } catch (error) {
            console.error('Analysis error:', error);
            this.hideEngineSpinner();
            this.showNotification('خطأ في التحليل', 'error');
        }
    }

    async quickAnalyze(doc) {
        const quickAnalysis = `
            📊 **تحليل سريع: ${doc.name}**
            
            📝 عدد الكلمات: ${doc.metadata.wordCount.toLocaleString('ar-SA')}
            📄 عدد الحروف: ${doc.metadata.charCount.toLocaleString('ar-SA')}
            🌍 اللغة: ${doc.metadata.language === 'ar' ? 'العربية' : 'English'}
            ⏱️ وقت القراءة: ${Math.ceil(doc.metadata.wordCount / 200)} دقيقة
            💾 الحجم: ${doc.size} MB
        `;

        this.addMessage(quickAnalysis, 'system');
    }

    // ==================== SUMMARIZER ENGINE ====================
    async summarizeDocument(length = 'medium') {
        const doc = this.documents[this.documents.length - 1];
        
        if (!doc) {
            this.showNotification('لا توجد مستندات للتلخيص', 'error');
            return;
        }

        this.showEngineSpinner('جاري التلخيص');

        try {
            const summaries = {
                short: await this.generateSummary(doc.text, 'short'),
                medium: await this.generateSummary(doc.text, 'medium'),
                long: await this.generateSummary(doc.text, 'long')
            };

            const result = `
# 📝 ملخص المستند: ${doc.name}

## 🎯 ملخص قصير (عشر كلمات)
${summaries.short}

## 📋 ملخص متوسط (فقرة واحدة)
${summaries.medium}

## 📚 ملخص مفصل
${summaries.long}

---
*تم التلخيص بواسطة ${this.getProviderName()}*
            `;

            this.addMessage(result, 'ai');
            this.hideEngineSpinner();

        } catch (error) {
            console.error('Summarization error:', error);
            this.hideEngineSpinner();
            this.showNotification('خطأ في التلخيص', 'error');
        }
    }

    async generateSummary(text, length) {
        const prompt = {
            short: `لخص النص التالي في جملة واحدة (10 كلمات كحد أقصى):\n\n${text.substring(0, 2000)}`,
            medium: `لخص النص التالي في فقرة واحدة (50-100 كلمة):\n\n${text.substring(0, 4000)}`,
            long: `قدم ملخصاً مفصلاً للنص التالي (200-300 كلمة)، مع تضمين النقاط الرئيسية:\n\n${text.substring(0, 8000)}`
        };

        return await this.callAI(prompt[length]);
    }

    // ==================== TRANSLATOR ENGINE ====================
    async translateDocument(targetLang = null) {
        const doc = this.documents[this.documents.length - 1];
        
        if (!doc) {
            this.showNotification('لا توجد مستندات للترجمة', 'error');
            return;
        }

        // Auto-detect target language
        if (!targetLang) {
            targetLang = doc.metadata.language === 'ar' ? 'en' : 'ar';
        }

        this.showEngineSpinner('جاري الترجمة');

        try {
            const translated = await this.translateText(doc.text, targetLang);
            
            const result = `
# 🌍 ترجمة المستند: ${doc.name}

## اللغة الأصلية: ${doc.metadata.language === 'ar' ? 'العربية' : 'English'}
## اللغة المترجمة: ${targetLang === 'ar' ? 'العربية' : 'English'}

---

${translated}

---
*تمت الترجمة بواسطة ${this.getProviderName()}*
            `;

            this.addMessage(result, 'ai');
            this.hideEngineSpinner();

            // Offer download
            this.offerDownload('translated', translated, `${doc.name}_translated`);

        } catch (error) {
            console.error('Translation error:', error);
            this.hideEngineSpinner();
            this.showNotification('خطأ في الترجمة', 'error');
        }
    }

    async translateText(text, targetLang) {
        const prompt = `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. Maintain formatting and structure:\n\n${text}`;
        return await this.callAI(prompt);
    }

    // ==================== REPURPOSER ENGINE ====================
    async repurposeDocument(format = 'auto') {
        const doc = this.documents[this.documents.length - 1];
        
        if (!doc) {
            this.showNotification('لا توجد مستندات لإعادة الصياغة', 'error');
            return;
        }

        this.showEngineSpinner('جاري إعادة الصياغة');

        try {
            const repurposed = {
                blogPost: await this.repurposeToBlogPost(doc.text),
                socialMedia: await this.repurposeToSocialMedia(doc.text),
                presentation: await this.repurposeToPresentation(doc.text),
                emailNewsletter: await this.repurposeToNewsletter(doc.text),
                faq: await this.repurposeToFAQ(doc.text)
            };

            const result = `
# ♻️ إعادة صياغة المحتوى: ${doc.name}

## 📝 منشور مدونة
${repurposed.blogPost}

---

## 📱 منشورات وسائل التواصل
${repurposed.socialMedia}

---

## 🎯 عرض تقديمي
${repurposed.presentation}

---

## 📧 نشرة بريدية
${repurposed.emailNewsletter}

---

## ❓ الأسئلة الشائعة
${repurposed.faq}

---
*تمت إعادة الصياغة بواسطة ${this.getProviderName()}*
            `;

            this.addMessage(result, 'ai');
            this.hideEngineSpinner();

            // Offer download of all formats
            this.offerDownload('repurposed', result, `${doc.name}_repurposed`);

        } catch (error) {
            console.error('Repurposing error:', error);
            this.hideEngineSpinner();
            this.showNotification('خطأ في إعادة الصياغة', 'error');
        }
    }

    async repurposeToBlogPost(text) {
        const prompt = `Convert the following document into an engaging blog post with introduction, main points, and conclusion:\n\n${text.substring(0, 4000)}`;
        return await this.callAI(prompt);
    }

    async repurposeToSocialMedia(text) {
        const prompt = `Create 3 social media posts (Twitter, LinkedIn, Instagram) from this content:\n\n${text.substring(0, 2000)}`;
        return await this.callAI(prompt);
    }

    async repurposeToPresentation(text) {
        const prompt = `Create a presentation outline with 5-7 slides from this content:\n\n${text.substring(0, 3000)}`;
        return await this.callAI(prompt);
    }

    async repurposeToNewsletter(text) {
        const prompt = `Convert this into an email newsletter format:\n\n${text.substring(0, 3000)}`;
        return await this.callAI(prompt);
    }

    async repurposeToFAQ(text) {
        const prompt = `Extract and create a FAQ section from this content:\n\n${text.substring(0, 3000)}`;
        return await this.callAI(prompt);
    }

    // ==================== DOWNLOAD FEATURE ====================
    async downloadResults() {
        if (this.messages.length === 0) {
            this.showNotification('لا توجد نتائج للتحميل', 'error');
            return;
        }

        // Show download options modal
        this.showDownloadModal();
    }

    showDownloadModal() {
        const modal = `
            <div id="downloadModal" class="modal-overlay">
                <div class="modal-content glass-card-strong p-8 max-w-2xl">
                    <h3 class="text-2xl font-bold text-white mb-6">📥 تحميل النتائج</h3>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <button onclick="sagh.download('pdf')" class="download-option">
                            <div class="text-4xl mb-2">📄</div>
                            <div class="text-white font-semibold">PDF</div>
                            <div class="text-gray-400 text-sm">مستند PDF</div>
                        </button>
                        
                        <button onclick="sagh.download('docx')" class="download-option">
                            <div class="text-4xl mb-2">📝</div>
                            <div class="text-white font-semibold">DOCX</div>
                            <div class="text-gray-400 text-sm">مستند Word</div>
                        </button>
                        
                        <button onclick="sagh.download('txt')" class="download-option">
                            <div class="text-4xl mb-2">📋</div>
                            <div class="text-white font-semibold">TXT</div>
                            <div class="text-gray-400 text-sm">ملف نصي</div>
                        </button>
                        
                        <button onclick="sagh.download('md')" class="download-option">
                            <div class="text-4xl mb-2">📃</div>
                            <div class="text-white font-semibold">Markdown</div>
                            <div class="text-gray-400 text-sm">Markdown</div>
                        </button>
                        
                        <button onclick="sagh.download('json')" class="download-option">
                            <div class="text-4xl mb-2">🔧</div>
                            <div class="text-white font-semibold">JSON</div>
                            <div class="text-gray-400 text-sm">بيانات JSON</div>
                        </button>
                        
                        <button onclick="sagh.download('html')" class="download-option">
                            <div class="text-4xl mb-2">🌐</div>
                            <div class="text-white font-semibold">HTML</div>
                            <div class="text-gray-400 text-sm">صفحة ويب</div>
                        </button>
                    </div>
                    
                    <button onclick="sagh.closeDownloadModal()" class="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white">
                        إلغاء
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    closeDownloadModal() {
        const modal = document.getElementById('downloadModal');
        if (modal) modal.remove();
    }

    async download(format) {
        const content = this.prepareDownloadContent();
        let blob, filename, mimeType;

        const timestamp = new Date().toISOString().split('T')[0];
        const baseName = `sagh_results_${timestamp}`;

        switch (format) {
            case 'pdf':
                // For PDF, we'll use a library or convert to HTML first
                await this.downloadAsPDF(content, baseName);
                return;
            
            case 'docx':
                blob = new Blob([this.convertToDocx(content)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                filename = `${baseName}.docx`;
                break;
            
            case 'txt':
                blob = new Blob([this.convertToPlainText(content)], { type: 'text/plain' });
                filename = `${baseName}.txt`;
                break;
            
            case 'md':
                blob = new Blob([content], { type: 'text/markdown' });
                filename = `${baseName}.md`;
                break;
            
            case 'json':
                blob = new Blob([JSON.stringify(this.messages, null, 2)], { type: 'application/json' });
                filename = `${baseName}.json`;
                break;
            
            case 'html':
                blob = new Blob([this.convertToHTML(content)], { type: 'text/html' });
                filename = `${baseName}.html`;
                break;
        }

        this.downloadBlob(blob, filename);
        this.closeDownloadModal();
        this.showNotification(`✅ تم التحميل: ${filename}`, 'success');
    }

    prepareDownloadContent() {
        return this.messages
            .filter(m => m.author !== 'system')
            .map(m => `## ${m.author === 'user' ? 'المستخدم' : 'الذكاء الاصطناعي'}\n\n${m.text}\n\n---\n`)
            .join('\n');
    }

    convertToPlainText(content) {
        return content.replace(/[#*`]/g, '').replace(/---/g, '\n');
    }

    convertToHTML(content) {
        // Convert Markdown to HTML
        let html = content
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n/gim, '<br>');
        
        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نتائج صاغ - SAGH Results</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1, h2 { color: #0ea5e9; }
        .content { background: white; padding: 30px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="content">
        <h1>🧠 نتائج صاغ - SAGH Results</h1>
        ${html}
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #888;">
            <p>Powered by BrainSAIT | برينسايت</p>
        </footer>
    </div>
</body>
</html>
        `;
    }

    convertToDocx(content) {
        // Simple DOCX-like format (real DOCX would need a library)
        return this.convertToPlainText(content);
    }

    async downloadAsPDF(content, filename) {
        // For now, convert to HTML and let browser print to PDF
        const htmlContent = this.convertToHTML(content);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        
        this.showNotification('📄 استخدم "طباعة" → "حفظ كـ PDF"', 'info');
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    offerDownload(type, content, filename) {
        const downloadBtn = `
            <button onclick="sagh.downloadContent('${type}', '${filename}')" class="mt-4 px-6 py-3 bg-gradient-to-r from-teal to-medical rounded-xl text-white font-semibold hover:opacity-90 transition-all">
                📥 تحميل النتائج
            </button>
        `;
        
        // Add download button to last message
        const lastMessage = document.querySelector('.message:last-child');
        if (lastMessage) {
            lastMessage.insertAdjacentHTML('beforeend', downloadBtn);
        }
    }

    // ==================== HELPER FUNCTIONS ====================
    async extractKeyPoints(text) {
        const prompt = `استخرج 5-7 نقاط رئيسية من النص التالي:\n\n${text.substring(0, 3000)}`;
        return await this.callAI(prompt);
    }

    async extractEntities(text) {
        const prompt = `استخرج الكيانات المهمة (أشخاص، أماكن، منظمات، تواريخ) من النص:\n\n${text.substring(0, 2000)}`;
        return await this.callAI(prompt);
    }

    async analyzeSentiment(text) {
        const prompt = `حلل المشاعر العامة في النص (إيجابي/سلبي/محايد):\n\n${text.substring(0, 2000)}`;
        return await this.callAI(prompt);
    }

    async extractTopics(text) {
        const prompt = `حدد المواضيع الرئيسية (3-5 مواضيع) في النص:\n\n${text.substring(0, 3000)}`;
        return await this.callAI(prompt);
    }

    chunkDocument(text, chunkSize = 1000) {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, i + chunkSize));
        }
        return chunks;
    }

    detectLanguage(text) {
        const arabicPattern = /[\u0600-\u06FF]/;
        const arabicCount = (text.match(arabicPattern) || []).length;
        return arabicCount > text.length * 0.3 ? 'ar' : 'en';
    }

    // ==================== PDF/DOCX EXTRACTION ====================
    async extractPDFText(file) {
        // Using PDF.js library (needs to be loaded)
        if (typeof pdfjsLib !== 'undefined') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }
            
            return text;
        } else {
            // Fallback: show message to use library
            return `[PDF Content - ${file.name}]\nNote: PDF text extraction requires PDF.js library`;
        }
    }

    async extractDOCXText(file) {
        // Using mammoth.js library (needs to be loaded)
        if (typeof mammoth !== 'undefined') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        } else {
            return `[DOCX Content - ${file.name}]\nNote: DOCX text extraction requires Mammoth.js library`;
        }
    }

    // ==================== AI INTEGRATION ====================
    async callAI(prompt, context = '') {
        if (!this.apiKeys[this.currentProvider]) {
            this.showNotification('يرجى إضافة مفتاح API أولاً', 'error');
            return 'Error: API key required';
        }

        try {
            const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;
            
            switch (this.currentProvider) {
                case 'gemini':
                    return await this.callGemini(fullPrompt);
                case 'claude':
                    return await this.callClaude(fullPrompt);
                case 'openai':
                    return await this.callOpenAI(fullPrompt);
                default:
                    return 'Provider not configured';
            }
        } catch (error) {
            console.error('AI call error:', error);
            return `Error: ${error.message}`;
        }
    }

    async callGemini(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callClaude(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKeys.claude,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096
            })
        });

        const data = await response.json();
        return data.content[0].text;
    }

    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys.openai}`
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // ==================== UI HELPERS ====================
    showEngineSpinner(message) {
        const spinner = `
            <div id="engineSpinner" class="engine-spinner glass-card p-6 mb-4 flex items-center gap-4">
                <div class="spinner-ring"><div></div><div></div><div></div><div></div></div>
                <p class="text-white font-semibold">${message}...</p>
            </div>
        `;
        
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            messagesContainer.insertAdjacentHTML('beforeend', spinner);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    hideEngineSpinner() {
        const spinner = document.getElementById('engineSpinner');
        if (spinner) {
            spinner.classList.add('fade-out');
            setTimeout(() => spinner.remove(), 500);
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };

        const notification = `
            <div class="notification ${colors[type]} text-white px-6 py-4 rounded-xl shadow-lg">
                ${message}
            </div>
        `;

        const container = document.getElementById('notifications') || this.createNotificationContainer();
        container.insertAdjacentHTML('beforeend', notification);

        setTimeout(() => {
            container.firstElementChild?.remove();
        }, 3000);
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
        return container;
    }

    // ==================== MESSAGE HANDLING ====================
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        // Get response from AI with document context
        const context = this.documents.map(d => d.text).join('\n\n');
        const response = await this.callAI(message, context);
        
        this.addMessage(response, 'ai');
    }

    addMessage(text, author) {
        const message = {
            id: Date.now(),
            text,
            author,
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        this.displayMessage(message);
    }

    displayMessage(message) {
        const messageHTML = `
            <div class="message message-${message.author} glass-card p-4 mb-4">
                <div class="flex items-start gap-3">
                    <div class="avatar ${message.author === 'user' ? 'bg-orange' : 'bg-teal'} w-10 h-10 rounded-full flex items-center justify-center">
                        ${message.author === 'user' ? '👤' : '🧠'}
                    </div>
                    <div class="flex-1">
                        <div class="text-white whitespace-pre-wrap">${this.formatMessage(message.text)}</div>
                        <div class="text-gray-400 text-xs mt-2">${new Date(message.timestamp).toLocaleTimeString('ar-SA')}</div>
                    </div>
                </div>
            </div>
        `;

        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    formatMessage(text) {
        // Simple markdown rendering
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 text-teal">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 text-teal">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-teal">$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-2 py-1 rounded">$1</code>')
            .replace(/---/g, '<hr class="my-4 border-gray-700">');
    }

    // ==================== STORAGE ====================
    loadAPIKeys() {
        return JSON.parse(localStorage.getItem('sagh_api_keys') || '{}');
    }

    saveAPIKeys() {
        localStorage.setItem('sagh_api_keys', JSON.stringify(this.apiKeys));
    }

    loadSavedDocuments() {
        const saved = localStorage.getItem('sagh_documents');
        if (saved) {
            this.documents = JSON.parse(saved);
            this.updateDocumentsList();
        }
    }

    saveDocuments() {
        localStorage.setItem('sagh_documents', JSON.stringify(this.documents));
    }

    updateDocumentsList() {
        const list = document.getElementById('documentsList');
        if (!list) return;

        list.innerHTML = this.documents.map(doc => `
            <div class="document-item glass-card p-4 mb-3">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-white font-semibold">${doc.name}</p>
                        <p class="text-gray-400 text-sm">${doc.size} MB • ${doc.metadata.wordCount.toLocaleString('ar-SA')} كلمة</p>
                    </div>
                    <button onclick="sagh.deleteDocument(${doc.id})" class="text-red-400 hover:text-red-300">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    deleteDocument(id) {
        this.documents = this.documents.filter(d => d.id !== id);
        this.saveDocuments();
        this.updateDocumentsList();
        this.showNotification('تم حذف المستند', 'success');
    }

    updateProviderUI() {
        document.querySelectorAll('.ai-provider-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-provider="${this.currentProvider}"]`)?.classList.add('active');
    }

    getProviderName() {
        const names = {
            gemini: 'Google Gemini',
            claude: 'Claude AI',
            openai: 'OpenAI GPT'
        };
        return names[this.currentProvider];
    }

    updateUI() {
        this.updateDocumentsList();
        this.updateProviderUI();
    }

    // Quick actions
    executeQuickAction(action) {
        switch (action) {
            case 'summarize':
                this.summarizeDocument();
                break;
            case 'extract':
                this.addMessage('استخرج البيانات الهامة', 'user');
                this.extractKeyPoints(this.documents[this.documents.length - 1]?.text || '');
                break;
            case 'translate':
                this.translateDocument();
                break;
            case 'search':
                const query = prompt('ابحث عن:');
                if (query) {
                    this.addMessage(`ابحث عن: ${query}`, 'user');
                    this.searchInDocuments(query);
                }
                break;
        }
    }

    async searchInDocuments(query) {
        const results = this.documents.flatMap(doc => 
            doc.chunks.filter(chunk => 
                chunk.toLowerCase().includes(query.toLowerCase())
            ).map(chunk => ({ doc: doc.name, text: chunk }))
        );

        const response = results.length > 0
            ? `وجدت ${results.length} نتيجة:\n\n${results.slice(0, 5).map(r => `📄 ${r.doc}:\n${r.text.substring(0, 200)}...`).join('\n\n')}`
            : 'لم أجد نتائج';

        this.addMessage(response, 'ai');
    }

    // Voice input
    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            this.showNotification('المتصفح لا يدعم الإدخال الصوتي', 'error');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
        recognition.continuous = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('messageInput').value = transcript;
        };

        recognition.onerror = (error) => {
            this.showNotification('خطأ في التعرف على الصوت', 'error');
        };

        recognition.start();
        this.showNotification('🎤 جاري الاستماع...', 'info');
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
        
        // Update UI text
        document.querySelectorAll('[data-ar]').forEach(el => {
            el.textContent = el.getAttribute(`data-${this.currentLanguage}`);
        });
    }

    displayAnalysisResults(docName, analysis) {
        const result = `
# 📊 تحليل متقدم: ${docName}

## 📝 ملخص
${analysis.summary}

## 🎯 النقاط الرئيسية
${analysis.keyPoints}

## 👥 الكيانات
${analysis.entities}

## 💭 تحليل المشاعر
${analysis.sentiment}

## 🏷️ المواضيع
${analysis.topics}

## 📈 الإحصائيات
- عدد الكلمات: ${analysis.statistics.wordCount.toLocaleString('ar-SA')}
- عدد الحروف: ${analysis.statistics.charCount.toLocaleString('ar-SA')}
- متوسط طول الكلمة: ${analysis.statistics.avgWordLength}
- وقت القراءة: ${analysis.statistics.readingTime} دقيقة
- اللغة: ${analysis.statistics.language === 'ar' ? 'العربية' : 'English'}

---
*تم التحليل بواسطة ${this.getProviderName()}*
        `;

        this.addMessage(result, 'ai');
    }
}

// Initialize app
let sagh;
document.addEventListener('DOMContentLoaded', () => {
    sagh = new SAGHApp();
});
