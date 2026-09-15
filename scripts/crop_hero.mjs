import { Jimp } from 'jimp';
import path from 'path';

async function cropHero() {
  const sourcePath = 'C:/Users/USER/.gemini/antigravity-ide/brain/390deb70-1b27-4695-92ee-2c85cb60437f/.user_uploaded/media_1789449080922.png';
  console.log('Reading image:', sourcePath);
  
  const image = await Jimp.read(sourcePath);
  console.log('Original size:', image.bitmap.width, 'x', image.bitmap.height);

  // 1. Clean Crop right-side food spread (Burger + Fries + Frappe on wooden board)
  const foodSpread = image.clone();
  foodSpread.crop({ x: 485, y: 44, w: 539, h: 188 });
  await foodSpread.write('frontend/public/images/hero-burger-spread.png');
  console.log('Saved clean hero-burger-spread.png');
}

cropHero().catch(console.error);
