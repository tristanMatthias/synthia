import { TSynthiaProjectSynthNode } from "@synthia/api";
import { SynthiaWave } from "../../../audioNodes/Wave";
import { ctx } from "../../AudioContext";
import { SynthiaDelay } from "../../../audioNodes/Delay";

export const createAudioNode = (node: TSynthiaProjectSynthNode) => {

  switch (node.type) {
    case "wave":
      const wave = new SynthiaWave(ctx);
      Object.assign(wave, node.properties);
      return wave;

    case "delay":
      return new SynthiaDelay(ctx, {
        delayTime: node.properties.delayTime,
        dryWet: node.properties.dryWet,
        feedback: node.properties.feedback
      });

    case "reverb":
      const reverb = new SynthiaDelay(ctx);
      Object.assign(reverb, node.properties);
      return reverb;

    case 'filter':
      return new BiquadFilterNode(ctx, {
        Q: node.properties.q,
        frequency: node.properties.frequency,
        type: node.properties.type,
        gain: node.properties.gain
      });

    case 'pan':
      return new StereoPannerNode(ctx, {
        pan: node.properties.pan
      });

    default:
      throw new Error(`Could not create audio node with type ${node.type}`);
  }
}
