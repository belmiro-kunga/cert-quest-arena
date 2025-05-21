import { useState } from 'react';
import { PWASplashScreenState } from '../types/pwa';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  accept: string;
  disabled?: boolean;
  preview?: PWASplashScreenState;
}

export default function FileUploader({
  onFileSelected,
  accept,
  disabled = false,
  preview
}: FileUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 object-contain"
              />
            ) : preview?.preview ? (
              <img
                src={preview.preview}
                alt="Preview"
                className="w-24 h-24 object-contain"
              />
            ) : (
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <p className="mb-2 text-sm text-gray-500 text-center">
            {previewUrl ? 'Clique para alterar' : 'Arraste e solte um arquivo'}
          </p>
        </div>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}
