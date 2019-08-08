// @ts-ignore
export const AudioCtx: new () => AudioContext = window.AudioContext || window.webkitAudioContext || false;
// @ts-ignore
export const OfflineAudioCtx: OfflineAudioContext['constructor'] = window.OfflineAudioContext || window.webkitOfflineAudioContext || false;


export const ctx = new AudioCtx();
