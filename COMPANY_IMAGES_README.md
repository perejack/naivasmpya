# Company Images Setup

This document explains how to set up the company images for the Naivas job application system.

## Quick Setup

### Option 1: Run the Download Script (Recommended)

**For Linux/Mac:**
```bash
chmod +x download-images.sh
./download-images.sh
```

**For Windows:**
```bash
node download-images.js
```

This will download all company images to `public/images/companies/` directory.

### Option 2: Manual Download

Download the following images and place them in `public/images/companies/`:

1. **QuickMart**: https://baa-architects.com/wp-content/uploads/2020/09/Kenya-Association-of-Manufacturers-Nairobi-2013-10.jpg
   - Save as: `quickmart.jpg`

2. **Carrefour Kenya**: https://kenyare.co.ke/sites/default/files/properties/DSC_0503.JPG
   - Save as: `carrefour.jpg`

3. **Chandarana Foodplus**: https://cdn.standardmedia.co.ke/images/wysiwyq/images/CiGi1d5IF8pGHZx98OmmFTXr703SavxFICQ0hCQn.jpg
   - Save as: `chandarana.jpg`

## File Structure

After setup, your project should have:
```
public/
  images/
    companies/
      quickmart.jpg
      carrefour.jpg
      chandarana.jpg
```

## Features

- **High-quality images** showing actual retail locations
- **Fallback handling** - if images fail to load, shows company name as placeholder
- **Responsive design** - images adapt to mobile and desktop screens
- **Error resilience** - graceful handling of network issues

## Company Details

### QuickMart Supermarkets
- **Image**: Modern retail building in Nairobi
- **Rating**: 4.6 stars
- **Employees**: 5,000+
- **Salary Range**: KSh 28,000 - 35,000

### Carrefour Kenya
- **Image**: Large supermarket exterior
- **Rating**: 4.7 stars
- **Employees**: 3,000+
- **Salary Range**: KSh 30,000 - 38,000

### Chandarana Foodplus
- **Image**: Premium grocery store front
- **Rating**: 4.8 stars
- **Employees**: 2,000+
- **Salary Range**: KSh 32,000 - 40,000

## Troubleshooting

### Images not loading?
1. Check if files exist in `public/images/companies/`
2. Verify file names match exactly (case-sensitive)
3. Check network connectivity
4. Try running the download script again

### Script fails?
- Ensure you have `curl` (Linux/Mac) or `node` (Windows) installed
- Check your internet connection
- Try downloading manually if script fails

## Technical Details

- Images are loaded with error handling
- Fallback to SVG placeholder if image fails
- Optimized for web performance
- Responsive sizing for all screen sizes
