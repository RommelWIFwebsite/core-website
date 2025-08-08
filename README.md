# 🚀 CORE Cryptocurrency Website

A futuristic, interactive website for the $CORE cryptocurrency token, featuring a spectacular terminal interface and modern cyberpunk aesthetics.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Terminal**: Full-featured command-line interface with 15+ commands
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Loading Animation**: Spectacular startup sequence with progress indicators
- **Smooth Animations**: CSS3 and JavaScript powered transitions
- **Particle Effects**: Dynamic background particles with mouse interaction
- **Matrix Rain**: Animated background effects in terminal mode

### 🛡️ Security Features
- **No External Dependencies**: Pure HTML, CSS, and JavaScript
- **Performance Optimized**: Lightweight with fast loading times
- **Cross-browser Compatible**: Works on all modern browsers
- **SEO Optimized**: Meta tags, semantic HTML, and accessibility features

### 🎮 Interactive Elements
- **Terminal Commands**: Type `help` to see all available commands
- **Navigation**: Smooth scroll with active section highlighting
- **Copy to Clipboard**: One-click contract address copying
- **Easter Eggs**: Hidden commands and Konami code support
- **Sound Effects**: Optional audio feedback (can be disabled)

## 🏗️ Project Structure

```
CORE-Website/
├── 📄 index.html          # Main HTML structure
├── 📄 styles.css          # Complete styling with animations
├── 📄 script.js           # Main JavaScript functionality
├── 📄 terminal.js         # Dedicated terminal simulator
└── 📋 README.md           # This documentation
```

## 🚀 Quick Start

### Option 1: Direct Opening
1. Download all files to a folder
2. Double-click `index.html` to open in your browser
3. Enjoy the CORE experience!

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎛️ Terminal Commands

### Basic Commands
- `help` - Show all available commands
- `about` - Learn about CORE philosophy
- `status` - Display system status
- `price` - Show token price information
- `clear` - Clear terminal screen
- `whoami` - Display user information

### Advanced Commands (Admin Level)
- `sudo access` - Gain administrator privileges
- `matrix` - Toggle matrix mode
- `hack [target]` - Simulate hacking sequence
- `scan [target]` - Security vulnerability scan
- `encrypt [data]` - Encrypt data with CORE algorithm
- `decode [data]` - Decode encrypted data

### Hidden Commands
- `easter` - Find the easter egg
- `konami` - Activate legendary code
- `fortune` - Get CORE wisdom

## 🎨 Design Features

### Color Palette
- **Primary Background**: Deep black (#0a0a0a)
- **Secondary Background**: Dark gray (#111111)
- **Accent Primary**: Navy blue (#4A90E2)
- **Accent Secondary**: Dark navy (#2E5C8A)
- **Accent Tertiary**: Purple (#8855ff)
- **Text Primary**: White (#ffffff)

### Typography
- **Primary Font**: Inter (clean, modern sans-serif)
- **Monospace Font**: JetBrains Mono (terminal and code)
- **Font Sizes**: Responsive scaling from mobile to desktop

### Animations
- **Loading Sequence**: Multi-stage progress animation
- **Particle System**: 50+ interactive particles
- **Matrix Rain**: Falling character animation
- **Reveal Animations**: Scroll-triggered element reveals
- **Typewriter Effect**: Terminal text typing animation

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop Small**: 769px - 1024px
- **Desktop Large**: > 1024px

## 🔧 Customization

### Modifying Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
  --color-accent-primary: #4A90E2;  /* Change primary accent */
  --color-accent-secondary: #2E5C8A; /* Change secondary accent */
  /* ... other colors */
}
```

### Adding Terminal Commands
In `terminal.js`, add new commands to the `commands` object:
```javascript
commands.newcommand = {
  description: 'Your command description',
  usage: 'newcommand [args]',
  level: 'guest', // or 'admin' or 'hidden'
  execute: (args) => {
    return ['Command output line 1', 'Line 2', ...];
  }
};
```

### Modifying Content
- Edit sections in `index.html`
- Update tokenomics in the tokenomics section
- Modify roadmap timeline items
- Change contract address in `script.js` CONFIG object

## 🎵 Sound Configuration

Sounds are disabled by default. To enable:
```javascript
// In script.js
const CONFIG = {
  // ... other config
  soundEnabled: true  // Change to true
};
```

## 🔍 SEO & Performance

### Included Features
- Meta tags for social sharing
- Semantic HTML5 structure
- Alt texts for images
- Fast loading with optimized assets
- Preload critical resources
- Compressed and minified code

### Performance Tips
- All assets are self-contained (no CDN dependencies)
- Images are optimized SVGs
- CSS and JS are minified in production
- Lazy loading for non-critical elements

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+
- ⚠️ Internet Explorer: Not supported

## 🐛 Troubleshooting

### Common Issues

1. **Terminal not working**
   - Ensure JavaScript is enabled
   - Check browser console for errors
   - Refresh the page

2. **Animations not smooth**
   - Check if reduced motion is enabled in OS
   - Try disabling browser extensions
   - Update graphics drivers

3. **Mobile menu not working**
   - Clear browser cache
   - Check for JavaScript errors
   - Ensure viewport meta tag is present

4. **Fonts not loading**
   - Check internet connection
   - Google Fonts may be blocked
   - Fallback fonts will be used automatically

## 🚀 Deployment

### GitHub Pages
1. Create a new repository
2. Upload all files
3. Enable GitHub Pages in repository settings
4. Your site will be available at `username.github.io/repository-name`

### Netlify
1. Drag and drop the folder to Netlify
2. Your site will be live instantly
3. Optional: Set up custom domain

### Traditional Hosting
1. Upload all files to your web server
2. Ensure `index.html` is in the root directory
3. Configure server to serve static files

## 🔒 Security Considerations

- No external dependencies reduce attack surface
- No backend server required
- No user data collection
- All code is transparent and auditable
- Contract address should be verified before use

## 💡 Easter Eggs & Hidden Features

1. **Konami Code**: Try the classic ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA sequence
2. **Terminal Exploration**: Many commands unlock others
3. **Mouse Particles**: Move your mouse over particles
4. **Admin Mode**: Use `sudo access` in terminal
5. **Matrix Mode**: Enable in admin mode
6. **Hidden Commands**: Type `easter` in terminal

## 🤝 Contributing

This is a complete, production-ready website. Feel free to:
- Customize for your own token
- Add new terminal commands
- Improve animations
- Add new sections
- Enhance mobile experience

## 📄 License

This project is released under the MIT License. Feel free to use it for your own cryptocurrency project.

## 🙏 Credits

- **Design Inspiration**: pjon.ai
- **Philosophy**: The universal concept of "core" in everything
- **Typography**: Google Fonts (Inter, JetBrains Mono)
- **Icons**: Custom SVG icons and Unicode symbols

## 📞 Support

If you encounter any issues or have questions:
1. Check this README first
2. Look at browser console for errors
3. Ensure all files are in the same directory
4. Try opening in a different browser

---

## 🌟 Final Notes

This website represents the essence of CORE - clean, powerful, and eternal. The terminal interface is not just decoration; it's a fully functional command-line experience that users will love to explore.

The philosophy embedded in the design reflects the core belief that at the center of everything lies something pure and essential. Through blockchain technology, love moves via corecore, connecting all participants in an eternal network of value and trust.

**Remember**: This is more than just a website - it's an experience, a journey into the core of everything.

---

*Built with ❤️ and the essence of CORE*
