// https://github.com/miselaytes-anton/web-audio-experiments/blob/master/packages/freeverb/merge-params.js

/**
 * Allows for batch updating of audio parameters for multiple AudioNodes
 *
 * @example
 * const osc1 = ctx.createOscillator('square');
 * const osc2 = ctx.createOscillator('sine');
 * const osc3 = ctx.createOscillator('sawtooth');
 * const freq = mergeParams([osc1.frequency, osc2.frequency, osc3.frequency])
 *
 * # Update all frequencies
 * freq.setValueAtTime(800, ctx.currentTime)
 *
 * @param params A group of parameters that are the same
 */
export const mergeParams = (params: AudioParam[]) => {

  const singleParam = params[0];
  const parameter: Partial<AudioParam> = {};
  const audioNodeMethods = Object.getOwnPropertyNames(AudioParam.prototype)
    .filter(prop => typeof singleParam[prop as keyof AudioParam] === 'function') as (keyof AudioParam)[];


  //allows things like parameter.setValueAtTime(x, ctx.currentTime)
  audioNodeMethods.forEach(method => {
    // @ts-ignore
    parameter[method] = (...args: any[]) => {
      const _args = Array.prototype.slice.call(args);
      // @ts-ignore
      params.forEach((param) => singleParam[method].apply(param, _args));
    };
  });

  //allows to do parameter.value = x
  Object.defineProperties(parameter, {
    value: {
      get: function () {
        return singleParam.value;
      },
      set: function (value) {
        params.forEach(param => {
          param.value = value;
        });
      }
    }
  });

  return parameter;
}
