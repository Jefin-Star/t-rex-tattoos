export interface TattooAnalysisResult {
  title: string;
  style: string;
  placement: string;
  caption: string;
  tags: string[];
  inkPalette: string;
  estimatedSession: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export async function analyzeUploadedTattooFile(file: File): Promise<{
  previewDataUrl: string;
  analysis: TattooAnalysisResult;
}> {
  const dataUrl = await fileToBase64(file);
  const response = await fetch('/api/analyze-tattoo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: dataUrl,
      mimeType: file.type || 'image/jpeg',
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.analysis) {
    throw new Error(payload.error || 'Vision AI analysis failed.');
  }

  return {
    previewDataUrl: dataUrl,
    analysis: payload.analysis as TattooAnalysisResult,
  };
}

export async function analyzeLocalStudioAsset(
  localAssetPath: string
): Promise<TattooAnalysisResult> {
  const response = await fetch('/api/analyze-tattoo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localAssetPath }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.analysis) {
    throw new Error(payload.error || 'Vision AI analysis failed.');
  }

  return payload.analysis as TattooAnalysisResult;
}
