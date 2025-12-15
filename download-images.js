#!/usr/bin/env node

// Script to download company images for the Naivas job application
// This script downloads the images from the provided URLs for local use

import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images', 'companies');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Company images data
const images = {
    'quickmart': 'https://baa-architects.com/wp-content/uploads/2020/09/Kenya-Association-of-Manufacturers-Nairobi-2013-10.jpg',
    'carrefour': 'https://kenyare.co.ke/sites/default/files/properties/DSC_0503.JPG',
    'chandarana': 'https://cdn.standardmedia.co.ke/images/wysiwyq/images/CiGi1d5IF8pGHZx98OmmFTXr703SavxFICQ0hCQn.jpg'
};

// Function to download image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filename);

        const request = protocol.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });
        });

        request.on('error', (err) => {
            fs.unlink(filename, () => {}); // Delete the file on error
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlink(filename, () => {}); // Delete the file on error
            reject(err);
        });
    });
}

// Download all images
async function downloadAllImages() {
    console.log('Downloading company images for Naivas job application...\n');

    for (const [company, url] of Object.entries(images)) {
        const filename = path.join(imagesDir, `${company}.jpg`);

        try {
            console.log(`Downloading ${company} image...`);
            await downloadImage(url, filename);
            console.log(`✅ Successfully downloaded ${company} image`);
        } catch (error) {
            console.log(`❌ Failed to download ${company} image: ${error.message}`);
        }
    }

    console.log('\nImage download complete!');
    console.log(`Images downloaded to: ${imagesDir}/`);
    console.log('Files:');

    try {
        const files = fs.readdirSync(imagesDir);
        files.forEach(file => {
            const filePath = path.join(imagesDir, file);
            const stats = fs.statSync(filePath);
            console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB)`);
        });
    } catch (error) {
        console.log('  Error reading downloaded files');
    }
}

downloadAllImages().catch(console.error);
