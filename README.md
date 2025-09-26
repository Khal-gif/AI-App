# 🍌 Nano Banana - AI Image Generation Tool

Professional AI-powered image generation and editing tool built with Next.js 14, Google AI, and shadcn/ui.

## 🚀 Features

- **Text-to-Image Generation** - Create stunning images from text descriptions using Google AI
- **Professional Interface** - Clean, professional UI following strict design system guidelines
- **Real-time Processing** - Live progress tracking and feedback
- **Style Presets** - Multiple artistic styles (photorealistic, digital art, oil painting, etc.)
- **Quality Controls** - Adjustable quality and creativity parameters
- **Image Upload** - Support for editing existing images
- **State Management** - Persistent generation history with Zustand

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API Key (required for image generation)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd nano-banana
npm install
```

2. **Configure Google AI API:**

   a. Get your API key from [Google AI Studio](https://ai.google.dev/)
   
   b. Create `.env.local` file in the root directory:
   ```bash
   # Google AI API Configuration
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   
   # Development Configuration  
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Enable debug logging
   DEBUG_AI_GENERATION=true
   ```

   c. **Important:** Never commit your API key to git. The `.env.local` file is already in `.gitignore`.

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Basic Image Generation

1. **Launch the Editor:** Click "Launch Editor" from the home page
2. **Enter a Prompt:** Describe the image you want to create
3. **Choose Style:** Select from photorealistic, digital art, oil painting, etc.
4. **Adjust Settings:** Fine-tune quality and creativity levels
5. **Generate:** Click "Generate Image" and watch the progress
6. **View Results:** Your generated image will appear in the canvas

### Advanced Features

- **Negative Prompts:** Specify what to avoid in the image
- **Style Presets:** Choose from 6 different artistic styles
- **Quality Control:** Adjust from basic to high-quality output
- **Image Upload:** Upload existing images for editing
- **History:** Access previously generated images

## 🧠 API Integration

### Google AI Integration

The app integrates with Google AI's image generation capabilities:

- **Model:** `gemini-2.5-flash` for text processing
- **Enhanced Prompting:** Automatic style and quality enhancement
- **Fallback System:** Graceful degradation if API is unavailable
- **Performance Monitoring:** Built-in SLA tracking (10s timeout)

### API Endpoints

- **`POST /api/generate`** - Generate images from text prompts
- **`POST /api/process`** - Process uploaded images
- **`GET /api/generate`** - Health check and configuration status

## 🎨 Design System

Built with professional design standards:

- **Typography:** Mulish font with 4 controlled weights (400/500/600/700)
- **Spacing:** 8pt grid system throughout
- **Components:** shadcn/ui foundation for all UI elements
- **Colors:** Semantic token system
- **Responsive:** Mobile-first responsive design

## 📊 Console Logging

The application provides detailed console logging for debugging:

```bash
🎯 GOOGLE AI GENERATION REQUEST:
📝 User Prompt: A majestic dragon flying over a mystical forest
🎨 Style: photorealistic
⭐ Quality: 80
🧠 Creativity: 7.5
⏰ Timestamp: 2024-01-15T10:30:00.000Z
---
🚀 Making request to Google AI...
✅ Google AI Response received
🖼️ Generated image URL: https://...
✅ Google AI Generation completed:
⏱️ Processing time: 3240ms
===
```

## 🔧 Development

### Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run type-check` - TypeScript type checking
- `npm run validate` - Run lint + type-check

### Project Structure

```
nano-banana/
├── app/                     # Next.js 14 App Router
│   ├── api/                # API routes
│   │   ├── generate/       # Google AI image generation
│   │   └── process/        # Image processing
│   ├── editor/             # Main editor interface
│   └── page.tsx           # Landing page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── canvas/            # Canvas-specific components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Utilities and stores
│   ├── store.ts           # Zustand state management
│   └── utils.ts           # Utility functions
└── .env.local            # Environment variables (not committed)
```

## 🔐 Security

- **API Key Protection:** Environment variables prevent client-side exposure
- **Server-side Processing:** All AI calls made server-side
- **Input Validation:** Comprehensive request validation
- **Error Handling:** Graceful error handling with fallbacks

## 📝 Contributing

1. Follow the design system guidelines in `PLAYBOOK.md`
2. Use semantic component naming
3. Maintain 8pt grid spacing
4. Add proper TypeScript types
5. Include console logging for debugging

## 📄 License

[Add your license information here]

---

**Built with ❤️ using Next.js 14, Google AI, and shadcn/ui**