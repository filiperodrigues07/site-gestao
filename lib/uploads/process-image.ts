import sharp from "sharp";

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;
const PNG_QUALITY = 82;

/**
 * Redimensiona e recomprime uma imagem enviada pelo admin antes de gravar em
 * disco — sem isso, uma foto de 20-40MB direto do celular seria servida
 * exatamente assim para todo visitante do site. GIFs passam direto (o sharp
 * perderia a animação ao reprocessar).
 */
export async function processImageBuffer(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType === "image/gif") {
    return buffer;
  }

  try {
    const image = sharp(buffer).rotate().resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });

    switch (mimeType) {
      case "image/png":
        return await image.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
      case "image/webp":
        return await image.webp({ quality: WEBP_QUALITY }).toBuffer();
      case "image/jpeg":
      default:
        return await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    }
  } catch {
    // Arquivo veio corrompido ou em formato inesperado: mantém o original
    // em vez de falhar o upload inteiro por causa da otimização.
    return buffer;
  }
}
