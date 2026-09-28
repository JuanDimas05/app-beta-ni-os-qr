import QRCode from 'qrcode';

export interface QRGenerationOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Genera un Data URL PNG en base64 para un string dado (URL de escaneo)
 */
export async function generateQRDataURL(
  text: string, 
  options?: QRGenerationOptions
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 300,
      margin: options?.margin !== undefined ? options.margin : 1,
      color: {
        dark: options?.color?.dark || '#0f172a',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Error generating QR Code:', err);
    throw err;
  }
}

/**
 * Genera código SVG vectorial para renderizado escalable e impresión nítida
 */
export async function generateQRSVG(
  text: string,
  options?: QRGenerationOptions
): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      width: options?.width || 240,
      margin: options?.margin !== undefined ? options.margin : 1,
      color: {
        dark: options?.color?.dark || '#0f172a',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Error generating SVG QR Code:', err);
    throw err;
  }
}

/**
 * Descarga una imagen generada en PNG
 */
export function downloadDataURLAsFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
