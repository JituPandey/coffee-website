#!/bin/bash

# Coffee Shop Website - Production Build Script
# This script prepares the website for deployment

echo "🔨 Building Artisan Coffee Website..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy main files to dist
cp index.html dist/
cp styles.css dist/
cp styles-enhanced.css dist/
cp script.js dist/
cp script-enhanced.js dist/

# Copy documentation
cp README.md dist/
cp PORTFOLIO-GUIDE.md dist/

echo "✅ Build complete!"
echo "📦 Files ready for deployment in ./dist directory"
echo "🌐 Your site should be live on Netlify shortly!"

# Display deployment info
echo ""
echo "🚀 Deployment Information:"
echo "📁 Repository: https://github.com/JituPandey/coffee-website"
echo "🌍 Live Site: [Your Netlify URL will appear here]"
echo ""
echo "💡 Next steps:"
echo "1. Check your live site on Netlify"
echo "2. Test all features (cart, theme toggle, search)"
echo "3. Add the live URL to your resume and LinkedIn"
echo "4. Share the project with potential employers!"
