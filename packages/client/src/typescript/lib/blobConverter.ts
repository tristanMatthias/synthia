// @ts-ignore
import { context } from 'tone';

export const blobMerge = (blobs: Blob[]) => new Blob(blobs, { 'type': 'audio/ogg; codecs=opus' });

export const blobToOgg = (blobs: Blob[], name: string, download = false) => new Promise<string>(res => {

  // Make blob out of our blobs, and open it.
  const blob = new Blob(blobs, { 'type': 'audio/ogg; codecs=opus' });

  const fr = new FileReader();
  // Make blob out of our blobs, and open it.
  fr.onload = () => {
    if (download) {
      const a = document.createElement('a');
      a.href = fr.result as string;
      a.download = `${name}.ogg`;
      a.target = '_blank';
      a.click();
    }
    res(fr.result as string);
  }
  fr.readAsDataURL(blob);
});


export const blobToAudioBuffer = (blobs: Blob[]) => new Promise<AudioBuffer>(res => {
  let fileReader = new FileReader();
  const blob = new Blob(blobs, { 'type': 'audio/ogg; codecs=opus' });

  fileReader.onloadend = () => {
    (context as AudioContext).decodeAudioData(fileReader.result as ArrayBuffer, res);
  }

  fileReader.readAsArrayBuffer(blob);
});
