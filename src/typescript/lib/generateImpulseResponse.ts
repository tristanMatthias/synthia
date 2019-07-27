export interface GenerateImpulseResponseOptions {
  decayTime: number,
  fadeInTime: number,
  roomSize: number,
  lpFreqEnd: number
}

/**
 * Generates a reverb impulse response.
 * @param ctx Audio Context
 * @param params Impulse Response options
 */
export const generateImpulseResponse = async(
  ctx: AudioContext | OfflineAudioContext,
  params: GenerateImpulseResponseOptions
) => {
  const numChannels = 2;

  // params.decayTime is the -60dB fade time. We let it go 50% longer to get to -90dB.
  const totalTime = params.decayTime * 1.5;
  const decaySampleFrames = Math.round(params.decayTime * ctx.sampleRate);
  const numSampleFrames = Math.round(totalTime * ctx.sampleRate);
  const fadeInSampleFrames = Math.round((params.fadeInTime || 0) * ctx.sampleRate);

  // 60dB is a factor of 1 million in power, or 1000 in amplitude.
  const decayBase = Math.pow(1 / 1000, 1 / decaySampleFrames);
  const reverbIR = ctx.createBuffer(numChannels, numSampleFrames, ctx.sampleRate);

  for (let i = 0; i < numChannels; i++) {
    const chan = reverbIR.getChannelData(i);

    for (let j = 0; j < numSampleFrames; j++) {
      // A random number from - 1 to 1. * /
      const randomSample = Math.random() * 2 - 1;
      chan[j] = randomSample * Math.pow(decayBase, j);
    }

    for (let j = 0; j < fadeInSampleFrames; j++) {
      chan[j] *= (j / fadeInSampleFrames);
    }
  }

  return await applyDecay(
    reverbIR,
    params.roomSize || 0,
    params.lpFreqEnd || 0,
    params.decayTime,
  );
};

// @ts-ignore
window.generateImpulseResponse = generateImpulseResponse;

// /** Creates a canvas element showing a graph of the given data.

//     @param {!Float32Array} data An array of numbers, or a Float32Array.
//     @param {number} width Width in pixels of the canvas.
//     @param {number} height Height in pixels of the canvas.
//     @param {number} min Minimum value of data for the graph (lower edge).
//     @param {number} max Maximum value of data in the graph (upper edge).
//     @return {!CanvasElement} The generated canvas element. */
// reverbGen.generateGraph = function (data, width, height, min, max) {
//   var canvas = document.createElement('canvas');
//   canvas.width = width;
//   canvas.height = height;
//   var gc = canvas.getContext('2d');
//   gc.fillStyle = '#000';
//   gc.fillRect(0, 0, canvas.width, canvas.height);
//   gc.fillStyle = '#fff';
//   var xscale = width / data.length;
//   var yscale = height / (max - min);
//   for (var i = 0; i < data.length; i++) {
//     gc.fillRect(i * xscale, height - (data[i] - min) * yscale, 1, 1);
//   }
//   return canvas;
// }


// /** Saves an AudioBuffer as a 16-bit WAV file on the client's host
//     file system. Normalizes it to peak at +-32767, and optionally
//     truncates it if there's a lot of "silence" at the end.

//     @param {!AudioBuffer} buffer The buffer to save.
//     @param {string} name Name of file to create.
//     @param {number?} minTail Defines what counts as "silence" for
//     auto-truncating the buffer. If there is a point past which every
//     value of every channel is less than opt_minTail, then the buffer
//     is truncated at that point. This is expressed as an integer,
//     applying to the post-normalized and integer-converted
//     buffer. The default is 0, meaning don't truncate. */
// const saveWavFile = (
//   buffer: AudioBuffer,
//   name: string,
//   minTail?: number
// ) => {
//   const bitsPerSample = 16;
//   const bytesPerSample = 2;
//   const sampleRate = buffer.sampleRate;
//   const numChannels = buffer.numberOfChannels;
//   const channels = getAllChannelData(buffer);
//   let numSampleFrames = channels[0].length;
//   let scale = 32767;

//   // Find normalization constant.
//   var max = 0;
//   for (let i = 0; i < numChannels; i++) {
//     for (let j = 0; j < numSampleFrames; j++) {
//       max = Math.max(max, Math.abs(channels[i][j]));
//     }
//   }
//   if (max) scale = 32767 / max;

//   // Find truncation point.
//   if (minTail) {
//     let truncateAt = 0;
//     for (let i = 0; i < numChannels; i++) {
//       for (let j = 0; j < numSampleFrames; j++) {
//         var absSample = Math.abs(Math.round(scale * channels[i][j]));
//         if (absSample > minTail) {
//           truncateAt = j;
//         }
//       }
//     }
//     numSampleFrames = truncateAt + 1;
//   }

//   var sampleDataBytes = bytesPerSample * numChannels * numSampleFrames;
//   var fileBytes = sampleDataBytes + 44;
//   var arrayBuffer = new ArrayBuffer(fileBytes);
//   var dataView = new DataView(arrayBuffer);

//   // "RIFF"
//   dataView.setUint32(0, 1179011410, true);
//   // file length
//   dataView.setUint32(4, fileBytes - 8, true);
//   // "WAVE"
//   dataView.setUint32(8, 1163280727, true);
//   // "fmt "
//   dataView.setUint32(12, 544501094, true);
//   // fmt chunk length
//   dataView.setUint32(16, 16, true)
//   // PCM format
//   dataView.setUint16(20, 1, true);
//   // NumChannels
//   dataView.setUint16(22, numChannels, true);
//   // SampleRate
//   dataView.setUint32(24, sampleRate, true);
//   var bytesPerSampleFrame = numChannels * bytesPerSample;
//   // ByteRate
//   dataView.setUint32(28, sampleRate * bytesPerSampleFrame, true);
//   // BlockAlign
//   dataView.setUint16(32, bytesPerSampleFrame, true);
//   // BitsPerSample
//   dataView.setUint16(34, bitsPerSample, true);
//   // "data"
//   dataView.setUint32(36, 1635017060, true);
//   dataView.setUint32(40, sampleDataBytes, true);

//   for (var j = 0; j < numSampleFrames; j++) {
//     for (var i = 0; i < numChannels; i++) {
//       dataView.setInt16(44 + j * bytesPerSampleFrame + i * bytesPerSample,
//         Math.round(scale * channels[i][j]), true);
//     }
//   }

//   var blob = new Blob([arrayBuffer], { 'type': 'audio/wav' });
//   var url = window.URL.createObjectURL(blob);
//   var linkEl = document.createElement('a');
//   linkEl.href = url;
//   linkEl.download = name;
//   linkEl.style.display = 'none';
//   document.body.appendChild(linkEl);
//   linkEl.click();
// };


/**
 * Applies a decay with a low pass filter that decreases in frequency over the decay period
 * @param input AudioBuffer to modify
 * @param lpFreqStart Low Pass frequency start
 * @param lpFreqEnd Low pass frequency end
 * @param decayPeriod Duration of the low pass ramp decline
 */
const applyDecay = (
  input: AudioBuffer,
  lpFreqStart: number,
  lpFreqEnd: number,
  decayPeriod: number,
) => new Promise<AudioBuffer>(res => {

  if (lpFreqStart == 0) return res(input);

  const channelData = getAllChannelData(input);
  const context = new OfflineAudioContext(input.numberOfChannels, channelData[0].length, input.sampleRate);
  const player = context.createBufferSource();
  player.buffer = input;
  const filter = context.createBiquadFilter();

  lpFreqStart = Math.min(lpFreqStart, input.sampleRate / 2);
  lpFreqEnd = Math.min(lpFreqEnd, input.sampleRate / 2);

  filter.type = "lowpass";
  filter.Q.value = 0.0001;
  filter.frequency.setValueAtTime(lpFreqStart, 0);
  filter.frequency.linearRampToValueAtTime(lpFreqEnd, decayPeriod);

  player.connect(filter);
  filter.connect(context.destination);
  player.start();
  context.oncomplete = event => res(event.renderedBuffer);
  context.startRendering();
})

/**
 * Converts a AudioBuffer to an array of Float32 arrays containing the channel sample
 * @param buffer Buffer to get channel data from
 */
const getAllChannelData = (buffer: AudioBuffer) => {
  const channels = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels[i] = buffer.getChannelData(i);
  }
  return channels;
};
