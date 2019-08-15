import {TSynthiaProjectSynthNode} from '@synthia/api';
import { Connectable } from '../../../lib/mixins/Connectable/Connectable';
import { Receivable } from '../../../lib/mixins/Receivable/Receivable';
import { SElement } from '../../../types';
import { SynthNodeType } from '@synthia/api';


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


export const createNode = (node: TSynthiaProjectSynthNode) => {
  console.log(node);

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

export const connectNode = (node: TSynthiaProjectSynthNode) => {
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
  }, 10);
}
