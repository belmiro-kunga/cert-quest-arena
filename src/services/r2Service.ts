import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import {
  R2_BUCKET_NAME,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_PUBLIC_BASE_URL
} from "@/config/r2";

// Validação básica das variáveis de ambiente
if (!R2_BUCKET_NAME || !R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_BASE_URL) {
  console.error("Variáveis de ambiente para configuração do R2 não estão definidas corretamente.");
  // Considerar lançar um erro ou ter um mecanismo de fallback se essas configurações são críticas
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const r2Service = {
  async uploadAudio(file: File): Promise<string> {
    if (!R2_BUCKET_NAME || !R2_PUBLIC_BASE_URL) {
      throw new Error("Configuração do R2 para upload está incompleta.");
    }
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`; // Substitui espaços no nome do arquivo
    const arrayBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: arrayBuffer,
      ContentType: file.type || 'application/octet-stream', // Fornece um fallback para ContentType
      CacheControl: 'public, max-age=31536000', // Cache de 1 ano
    });
    await s3Client.send(command);
    return `${R2_PUBLIC_BASE_URL}/${fileName}`;
  },

  async deleteAudio(audioUrl: string): Promise<void> {
    if (!R2_BUCKET_NAME || !R2_PUBLIC_BASE_URL || !audioUrl.startsWith(R2_PUBLIC_BASE_URL)) {
      console.warn("URL do áudio inválida ou configuração do R2 incompleta para deleção.");
      return;
    }
    const fileName = audioUrl.replace(`${R2_PUBLIC_BASE_URL}/`, '');
    if (fileName) {
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
      });
      await s3Client.send(command);
    }
  },

  async checkAudioExists(audioUrl: string): Promise<boolean> {
    if (!R2_BUCKET_NAME || !R2_PUBLIC_BASE_URL || !audioUrl.startsWith(R2_PUBLIC_BASE_URL)) {
      console.warn("URL do áudio inválida ou configuração do R2 incompleta para verificação.");
      return false;
    }
    const fileName = audioUrl.replace(`${R2_PUBLIC_BASE_URL}/`, '');
    if (fileName) {
      try {
        const command = new HeadObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: fileName,
        });
        await s3Client.send(command);
        return true;
      } catch (error: any) {
        // Especificamente para o SDK v3, erros como NotFound podem ter $metadata
        if (error.name === 'NotFound' || (error.$metadata && error.$metadata.httpStatusCode === 404)) {
          return false;
        }
        console.error("Erro ao verificar existência do áudio:", error);
        // Re-throw outros erros que não são 'NotFound'
        throw error;
      }
    }
    return false;
  }
};
