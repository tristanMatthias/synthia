import { SynthiaProjectSynthNode, SynthiaProjectSynthNodeType } from '@synthia/api/dist/types/index';

import { Connectable } from '../../../lib/mixins/Connectable/Connectable';
import { Receivable } from '../../../lib/mixins/Receivable/Receivable';
import { SElement } from '../../../types';



export const FileNodeTypeToElement = {
  [SynthiaProjectSynthNodeType.oscillator]: SElement.oscillator,
  [SynthiaProjectSynthNodeType.wave]: SElement.wave,
  [SynthiaProjectSynthNodeType.reverb]: SElement.reverb,
  [SynthiaProjectSynthNodeType.delay]: SElement.delay,
  [SynthiaProjectSynthNodeType.filter]: SElement.filter,
  [SynthiaProjectSynthNodeType.pan]: SElement.pan,
}

export const ElementToFileNodeType = {
  [SElement.oscillator]: SynthiaProjectSynthNodeType.oscillator,
  [SElement.wave]: SynthiaProjectSynthNodeType.wave,
  [SElement.reverb]: SynthiaProjectSynthNodeType.reverb,
  [SElement.delay]: SynthiaProjectSynthNodeType.delay,
  [SElement.filter]: SynthiaProjectSynthNodeType.filter,
  [SElement.pan]: SynthiaProjectSynthNodeType.pan,
}


export const createNode = (node: SynthiaProjectSynthNode) => {
  const nodeType = FileNodeTypeToElement[node.type]
  if (!nodeType) throw new Error(`Could not create node of type ${node.type}`);
  let ele = document.createElement(nodeType);

  ele.id = node.id;

  // @ts-ignore
  ele.x = node.position.x;
  // @ts-ignore
  ele.y = node.position.y;

  // @ts-ignore
  ele._endConnect();

  return ele;
}

export const connectNode = (node: SynthiaProjectSynthNode) => {
  const ele = document.getElementById(node.id) as unknown as Connectable;

  // @ts-ignore
  ele.model = node;

  node.connectedTo.forEach(id => {
    const receive = document.getElementById(id) as unknown as Receivable;
    ele.connectTo(receive);
  });

  setTimeout(() => {
    // @ts-ignore
    ele.requestUpdate()
  },10);
}
