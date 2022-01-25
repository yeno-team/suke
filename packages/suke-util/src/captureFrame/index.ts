/*! capture-frame. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
'use strict'

export function captureFrame (video: HTMLVideoElement, format: 'png' | 'jpeg' | 'webp'): { image: Buffer, width: number, height: number} {
  if (video == null || video.nodeName !== 'VIDEO') {
    throw new TypeError('First argument must be a <video> element or selector');
  }

  if (format == null) {
    format = 'png';
  }

  const canvas = document.createElement('canvas');
  const width = canvas.width = video.videoWidth;
  const height = canvas.height = video.videoHeight;

  canvas.getContext('2d')?.drawImage(video, 0, 0);

  const dataUri = canvas.toDataURL('image/' + format);
  const data = dataUri.split(',')[1];

  return {
    image: Buffer.from(data, 'base64'),
    width,
    height
  }
}