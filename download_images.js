const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/DJI_Phantom_4_-_Overhead.jpg',
        name: 'product-drone.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sony-PlayStation-5-Bare.jpg',
        name: 'product-console.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Home_Mini.jpg',
        name: 'product-speaker.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Oculus-Rift-Touch-Controllers-Pair.jpg',
        name: 'product-vr.jpg'
    }
];

const downloadDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

images.forEach(img => {
    const filePath = path.join(downloadDir, img.name);
    const file = fs.createWriteStream(filePath);

    https.get(img.url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${img.name}`);
            });
        } else {
            console.error(`Failed to download ${img.name}: ${response.statusCode}`);
            file.close();
            fs.unlink(filePath, () => { });
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${img.name}: ${err.message}`);
        file.close();
        fs.unlink(filePath, () => { });
    });
});
