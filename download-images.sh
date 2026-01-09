#!/bin/bash

# Script to download company images for the Naivas job application
# This script downloads the images from the provided URLs for local use

echo "Downloading company images for Naivas job application..."

# Create images directory if it doesn't exist
mkdir -p public/images/companies

# Company images data
declare -A images=(
    ["quickmart"]="https://baa-architects.com/wp-content/uploads/2020/09/Kenya-Association-of-Manufacturers-Nairobi-2013-10.jpg"
    ["carrefour"]="https://kenyare.co.ke/sites/default/files/properties/DSC_0503.JPG"
    ["chandarana"]="https://cdn.standardmedia.co.ke/images/wysiwyq/images/CiGi1d5IF8pGHZx98OmmFTXr703SavxFICQ0hCQn.jpg"
)

# Download each image
for company in "${!images[@]}"; do
    url="${images[$company]}"
    filename="public/images/companies/${company}.jpg"

    echo "Downloading ${company} image..."
    curl -L -o "$filename" "$url"

    if [ $? -eq 0 ]; then
        echo "✅ Successfully downloaded ${company} image"
    else
        echo "❌ Failed to download ${company} image"
    fi
done

echo "Image download complete!"
echo ""
echo "Images downloaded to: public/images/companies/"
echo "Files:"
ls -la public/images/companies/
