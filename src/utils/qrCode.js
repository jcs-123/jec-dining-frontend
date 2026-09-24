import QRCode from 'qrcode';

export const generateQrDataUrl = async (text, options = {}) => {
  if (!text) return '';
  try {
    return await QRCode.toDataURL(text, {
      width: options.width || 220,
      margin: options.margin || 1,
      color: {
        dark: options.darkColor || '#0C383E',
        light: options.lightColor || '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  }
};
