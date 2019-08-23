import { SynthNodeType, TSynthiaProjectSynthNode } from '@synthia/api';

import CompositeAudioNode from '../../../../audioNodes/BaseNode';
import { InitialPosition } from '../../../../lib/mixins/Draggable/Draggable';
import { SElement } from '../../../../types';
import { BaseNode } from '../../../synthNodes/SynthBaseNode/BaseNode';
import { Connectable } from '../../../../lib/mixins/Connectable/Connectable';
import { Receivable } from '../../../../lib/mixins/Receivable/Receivable';


export const FileNodeTypeToElement = {
  ['oscillator']: SElement.oscillator,
  ['wave']: SElement.wave,
  ['reverb']: SElement.reverb,
  ['delay']: SElement.delay,
  ['filter']: SElement.filter,
  ['pan']: SElement.pan,
}

export const ElementToFileNodeType: Partial<{[key in SElement]: SynthNodeType}> = {
  [SElement.oscillator]: 'oscillator',
  [SElement.wave]: 'wave',
  [SElement.reverb]: 'reverb',
  [SElement.delay]: 'delay',
  [SElement.filter]: 'filter',
  [SElement.pan]: 'pan',
}


export const createComponentNode = (
  synthNode: TSynthiaProjectSynthNode,
  audioNode: AudioNode | CompositeAudioNode,
  initial = false
) => {
  const nodeType = FileNodeTypeToElement[synthNode.type]
  if (!nodeType) throw new Error(`Could not create node of type ${synthNode.type}`);

  let ele = document.createElement(nodeType) as BaseNode<any, any> & InitialPosition & Connectable;
  ele.id = synthNode.id;

  ele.audioNode = audioNode;
  ele.synthNode = synthNode;
  ele.x = synthNode.position.x;
  ele.y = synthNode.position.y;

  // @ts-ignore
  if (initial) ele._endConnect();

  return ele;
}


export const connectComponentNode = (ele: Connectable & BaseNode<any, any>) => {
  ele.synthNode.connectedTo.forEach((id: string) => {
    const receive = document.getElementById(id) as unknown as Receivable;
    ele.connectTo(receive);
  });

  setTimeout(() => {
    // @ts-ignore
    ele.requestUpdate()
  }, 10);
}
