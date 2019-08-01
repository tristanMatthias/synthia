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
