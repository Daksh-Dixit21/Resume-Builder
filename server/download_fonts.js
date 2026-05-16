import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontUrl = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Lora:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap';

const get = (url, headers) => new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
        let data = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
});

async function main() {
    console.log('Fetching CSS from Google Fonts...');
    const cssBuffer = await get(fontUrl, {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    });
    let css = cssBuffer.toString();

    // Split CSS into blocks by subset
    const blocks = css.split(/\/\* ([^*]+) \*\//);
    const fontMap = {};

    console.log('Processing latin subsets...');

    for (let i = 1; i < blocks.length; i += 2) {
        const subset = blocks[i].trim();
        const content = blocks[i + 1];

        if (subset === 'latin') {
            const fontMatches = content.matchAll(/font-family: '([^']+)';/g);
            for (const match of fontMatches) {
                const family = match[1];
                if (!fontMap[family]) fontMap[family] = "";
                
                // Find all urls in this block
                let blockContent = content;
                const urls = [...content.matchAll(/url\((https:\/\/[^)]+)\)/g)].map(m => m[1]);
                
                for (const url of urls) {
                    console.log(`Downloading ${family} resource...`);
                    const fontData = await get(url, {});
                    const base64 = fontData.toString('base64');
                    blockContent = blockContent.replace(url, `data:font/woff2;base64,${base64}`);
                }
                fontMap[family] += blockContent + "\n";
            }
        }
    }

    const configDir = path.join(__dirname, 'configs');
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    
    fs.writeFileSync(path.join(configDir, 'fonts_manifest.json'), JSON.stringify(fontMap, null, 2));
    console.log('Saved optimized manifest to ' + path.join(configDir, 'fonts_manifest.json'));
    
    // Cleanup old file if exists
    if (fs.existsSync(path.join(configDir, 'fonts.css'))) {
        fs.unlinkSync(path.join(configDir, 'fonts.css'));
    }
}
main().catch(console.error);
