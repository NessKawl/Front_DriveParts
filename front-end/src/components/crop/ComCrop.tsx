import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

interface ComCropProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  image: string | null;
  onCropComplete: (croppedImage: string) => void;
}

export default function ComCrop({ isOpen, setIsOpen, image, onCropComplete }: ComCropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function generateCroppedImage() {
    if (!image || !croppedAreaPixels) return;

    const croppedBase64 = await cropImage(image, croppedAreaPixels);
    onCropComplete(croppedBase64);
    setIsOpen(false);
  }

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg flex flex-col gap-4">

        <div className="relative w-full h-64 bg-gray-200 rounded overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={generateCroppedImage}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Cortar
          </button>
        </div>
      </div>
    </div>
  );
}


// Função para recortar a imagem em base64
async function cropImage(imageSrc: string, crop: any): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx: any = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas.toDataURL("image/png");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
