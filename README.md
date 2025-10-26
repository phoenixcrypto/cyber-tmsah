# Cyber TMSAH - Educational Platform

A modern, responsive educational platform built with Next.js 14, TypeScript, and TailwindCSS. This project provides a comprehensive learning management system with a cyber-themed design.

## 🚀 Features

- **Modern Design**: Cyber-themed UI with neon accents and glass morphism effects
- **Responsive Layout**: Fully responsive design optimized for all devices
- **Fast Performance**: Optimized for speed with Next.js 14 and static generation
- **Type Safety**: Built with TypeScript for better development experience
- **Mobile-First**: Mobile dropdown navigation and touch-friendly interface
- **Accessibility**: WCAG compliant with proper focus management
- **SEO Optimized**: Meta tags, structured data, and performance optimizations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Deployment**: Vercel/Cloudflare Pages
- **Version Control**: Git/GitHub

## 📁 Project Structure

```
cyber-tmsah/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── contact/           # Contact page
│   ├── materials/         # Learning materials
│   ├── schedule/          # Class schedule
│   ├── tasks/             # Task management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading component
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section
│   └── Navbar.tsx         # Navigation bar
├── lib/                   # Utility functions
│   └── content-manager.ts # Content management
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/cyber-tmsah.git
cd cyber-tmsah
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Colors

The project uses a custom color palette defined in `tailwind.config.ts`:

- `cyber-dark`: #0a0a0a (Background)
- `cyber-neon`: #00ff88 (Primary accent)
- `cyber-violet`: #8b5cf6 (Secondary accent)
- `cyber-green`: #10b981 (Success)
- `cyber-blue`: #3b82f6 (Info)

### Fonts

- **Primary**: Inter (System font)
- **Accent**: Orbitron (Monospace)

### Animations

Custom CSS animations are defined in `globals.css`:

- `fade-in`: Smooth fade-in effect
- `slide-up`: Slide up from bottom
- `glow-pulse`: Pulsing glow effect
- `gradient-shift`: Animated gradient background

## 📱 Responsive Design

The project is fully responsive with breakpoints:

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1600px

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`

### Manual Deployment

```bash
npm run build
npm run export
# Upload the 'out' directory to your hosting provider
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CUSTOM_KEY=your-custom-key
```

### Next.js Configuration

The `next.config.js` file includes:

- Image optimization
- Security headers
- Compression
- Static generation
- Webpack optimizations

## 📊 Performance

The project is optimized for performance:

- Static Site Generation (SSG)
- Image optimization
- Code splitting
- Tree shaking
- Minification
- Compression

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ZEYAD MOHAMED**

- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS team for the utility-first CSS framework
- Lucide team for the beautiful icons
- Vercel team for the deployment platform

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/cyber-tmsah/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the author directly

---

**Made with ❤️ by ZEYAD MOHAMED**