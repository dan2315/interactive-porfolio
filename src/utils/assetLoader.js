export async function loadWithProgress(url, onProgress) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = response.headers.get('content-length');
  const total = parseInt(contentLength, 10);

  if (!total) {
    console.warn(`Content-Length missing for ${url}`);
  }

  const reader = response.body.getReader();
  const chunks = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    if (onProgress) {
      onProgress({
        loaded: receivedLength,
        total: total || receivedLength,
        progress: total ? (receivedLength / total) * 100 : 0
      });
    }
  }

  const allChunks = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  return allChunks;
}

export function createBlobURL(data, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  return URL.createObjectURL(blob);
}