#!/bin/bash

# Remove sensitive PayPal credentials from all files
echo "Removing sensitive PayPal credentials..."

# Replace Client ID with placeholder
find . -name "*.md" -o -name "*.html" -o -name "*.js" -o -name "*.sh" | grep -v node_modules | xargs sed -i '' 's/YOUR_PAYPAL_CLIENT_ID_HERE/YOUR_PAYPAL_CLIENT_ID_HERE/g'

# Replace any other sensitive data
find . -name "*.md" -o -name "*.html" -o -name "*.js" -o -name "*.sh" | grep -v node_modules | xargs sed -i '' 's/rilindishpk1_api1\.gmail\.com/YOUR_PAYPAL_API_USERNAME/g'
find . -name "*.md" -o -name "*.html" -o -name "*.js" -o -name "*.sh" | grep -v node_modules | xargs sed -i '' 's/YOUR_PAYPAL_API_PASSWORD/YOUR_PAYPAL_API_PASSWORD/g'
find . -name "*.md" -o -name "*.html" -o -name "*.js" -o -name "*.sh" | grep -v node_modules | xargs sed -i '' 's/A31fFfXfoxG9kgdtT-o\.xQAQ7OWgAKtiGap7\.Pzf3OUT0114cvPCPM3-/YOUR_PAYPAL_API_SIGNATURE/g'

echo "Sensitive data removed. Please review and commit changes."
