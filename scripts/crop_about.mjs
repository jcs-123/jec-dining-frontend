import { Jimp } from 'jimp';

async function cropAboutAssets() {
  const sourcePath = 'C:/Users/USER/.gemini/antigravity-ide/brain/390deb70-1b27-4695-92ee-2c85cb60437f/.user_uploaded/media_1789454029000.jpg';
  const img = await Jimp.read(sourcePath);

  // 1. Banner Scene
  const bannerScene = img.clone();
  bannerScene.crop({ x: 560, y: 16, w: 444, h: 244 });
  const featherWidth = 70;
  for (let y = 0; y < bannerScene.bitmap.height; y++) {
    for (let x = 0; x < featherWidth; x++) {
      const idx = (y * bannerScene.bitmap.width + x) * 4;
      const factor = Math.pow(x / featherWidth, 1.6);
      bannerScene.bitmap.data[idx + 3] = Math.round(bannerScene.bitmap.data[idx + 3] * factor);
    }
  }
  await bannerScene.write('public/images/about-banner-scene.png');

  // 2. JEC Campus Architectural Sketch (from y: 340 to 540)
  const campusSketch = img.clone();
  campusSketch.crop({ x: 0, y: 340, w: 145, h: 195 });
  for (let y = 0; y < campusSketch.bitmap.height; y++) {
    for (let x = 0; x < campusSketch.bitmap.width; x++) {
      const idx = (y * campusSketch.bitmap.width + x) * 4;
      let alphaMult = 1.0;
      if (x > 105) {
        alphaMult *= Math.max(0, (145 - x) / 40);
      }
      if (y > 165) {
        alphaMult *= Math.max(0, (195 - y) / 30);
      }
      campusSketch.bitmap.data[idx + 3] = Math.round(campusSketch.bitmap.data[idx + 3] * alphaMult);
    }
  }
  await campusSketch.write('public/images/about-campus-sketch.png');

  // 3. Center Fresh Tea Leaf & Beans
  const teaBeans = img.clone();
  teaBeans.crop({ x: 470, y: 310, w: 85, h: 100 });
  await teaBeans.write('public/images/about-tea-beans.png');
}

cropAboutAssets().catch(console.error);
