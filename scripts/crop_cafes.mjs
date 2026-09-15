import { Jimp } from 'jimp';

async function cropCafePhotos() {
  const sourcePath = 'C:/Users/USER/.gemini/antigravity-ide/brain/390deb70-1b27-4695-92ee-2c85cb60437f/.user_uploaded/media_1789454529286.png';
  const img = await Jimp.read(sourcePath);
  console.log('Source size:', img.bitmap.width, 'x', img.bitmap.height);

  // Card 1: JEC Cafe photo
  // In 1024x341, Card 1 photo is approx x: 82, y: 105, w: 190, h: 190
  const cafePhoto = img.clone();
  cafePhoto.crop({ x: 82, y: 105, w: 190, h: 190 });
  await cafePhoto.write('public/images/cafe-jec-neon.png');
  console.log('Saved public/images/cafe-jec-neon.png');

  // Card 2: JEC Bytes photo
  // Card 2 photo is approx x: 523, y: 105, w: 198, h: 190
  const bytesPhoto = img.clone();
  bytesPhoto.crop({ x: 523, y: 105, w: 198, h: 190 });
  await bytesPhoto.write('public/images/cafe-bytes-neon.png');
  console.log('Saved public/images/cafe-bytes-neon.png');
}

cropCafePhotos().catch(console.error);
