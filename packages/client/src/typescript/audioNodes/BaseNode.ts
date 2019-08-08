// https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode

export default class CompositeAudioNode {
  protected _input: GainNode;
  protected _output: GainNode;

  get _isCompositeAudioNode() {
    return true;
  }

  get gain() {
    return this._output.gain;
  }

  constructor(
    protected _ctx: AudioContext | OfflineAudioContext
  ) {
    this._input = this._ctx.createGain();
    this._output = this._ctx.createGain();
  }

  connect(..._args: any[]) {
    // TODO: Fix up this type
    // @ts-ignore
    return this._output.connect.apply(this._output, arguments);
  }

  disconnect(..._args: any[]) {
    // TODO: Fix up this type
    // @ts-ignore
    return this._output.disconnect.apply(this._output, arguments);
  }
}


// @ts-ignore
AudioNode.prototype._connect = AudioNode.prototype.connect;
// @ts-ignore
AudioNode.prototype.connect = function () {
  var args = Array.prototype.slice.call(arguments);
  if (args[0]._isCompositeAudioNode)
    args[0] = args[0]._input;

  // @ts-ignore
  return this._connect.apply(this, args);
};
