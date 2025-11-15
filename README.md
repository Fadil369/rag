# صاغ - SAGH Platform

> الذكاء الاصطناعي التوليدي المدعوم بالاسترجاع  
> Retrieval-Augmented Generative AI Platform

منصة متقدمة لتحليل المستندات بالذكاء الاصطناعي مع دعم كامل للعربية والإنجليزية.  
Advanced AI-powered document analysis platform with full Arabic and English support.

## ✨ المزايا الرئيسية | Key Features

### 🧠 ذكاء اصطناعي متقدم | Advanced AI
- دعم ثلاثة محركات ذكاء اصطناعي رائدة: Google Gemini, Claude AI, OpenAI GPT
- تحليل سياقي عميق للمستندات
- إجابات دقيقة مع الاستشهاد بالمصادر

### 📄 معالجة المستندات | Document Processing
- دعم PDF, DOCX, TXT
- استخراج النصوص تلقائياً
- تنظيم المعلومات بشكل ذكي

### 🌍 دعم متعدد اللغات | Multi-language Support
- واجهة ثنائية اللغة (عربي/إنجليزي)
- معالجة المستندات بكلا اللغتين
- ترجمة تلقائية عند الحاجة

### 🎤 تفاعل صوتي | Voice Interaction
- إدخال صوتي بالعربية والإنجليزية
- تحويل النص إلى كلام طبيعي
- تجربة محادثة تفاعلية

### ⚡ أداء فوري | Instant Performance
- معالجة سريعة للاستفسارات
- نتائج في الوقت الفعلي
- تجربة مستخدم سلسة

## 🚀 التجربة السريعة | Quick Start

### عبر GitHub Pages:
زر الموقع المباشر: https://fadil369.github.io/rag/

### محلياً | Locally:
```bash
# نسخ المستودع
git clone https://github.com/Fadil369/rag.git

# فتح الملف
open index.html
```

## 🎯 كيفية الاستخدام | How to Use

1. **ارفع مستنداتك** - قم برفع ملفات PDF, DOCX, أو TXT
2. **اختر محرك الذكاء** - اختر بين Gemini, Claude, أو GPT
3. **ابدأ المحادثة** - اسأل أي سؤال عن مستنداتك
4. **احصل على إجابات** - إجابات فورية ودقيقة مع المصادر

## 🛠️ التقنيات المستخدمة | Technologies

- **Frontend**: HTML5, CSS3, TailwindCSS, JavaScript (ES6+)
- **AI Providers**: 
  - Google Gemini Pro
  - Anthropic Claude
  - OpenAI GPT-4
- **Features**: 
  - Web Speech API
  - File API
  - LocalStorage
  - Responsive Design

## 📦 البنية | Structure

```
rag/
├── index.html                          # الصفحة الرئيسية
├── files/
│   ├── rag-arabic-business-enhanced.html  # التطبيق الكامل
│   ├── app.js                          # منطق التطبيق
│   ├── services.js                     # خدمات API
│   └── README.md                       # دليل files/
├── worker/                             # Cloudflare Worker
└── README.md                           # هذا الملف
```

## 🔐 الأمان والخصوصية | Security & Privacy

- جميع مفاتيح API مخزنة محلياً في المتصفح
- لا يتم إرسال البيانات لخوادمنا
- الاتصال المباشر مع مزودي الذكاء الاصطناعي فقط
- إمكانية حذف جميع البيانات في أي وقت

## 📚 التوثيق | Documentation

- [دليل النشر | Deployment Guide](./CLOUDFLARE_DEPLOYMENT.md)
- [البدء السريع | Quick Start](./DEPLOYMENT_QUICK_START.md)
- [ملخص المشروع | Project Summary](./files/PROJECT_SUMMARY.md)

## License

MIT
