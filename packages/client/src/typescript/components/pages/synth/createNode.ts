import { SynthiaFileSynthNode, SynthiaFileSynthNodeType } from '../../../lib/File/file.type';
import { Connectable } from '../../../lib/mixins/Connectable/Connectable';
import { Receivable } from '../../../lib/mixins/Receivable/Receivable';
import { SElement } from '../../../types';


export const FileNodeTypeToElement = {
  [SynthiaFileSynthNodeType.oscillator]: SElement.oscillator,
  [SynthiaFileSynthNodeType.wave]: SElement.wave,
  [SynthiaFileSynthNodeType.reverb]: SElement.reverb,
  [SynthiaFileSynthNodeType.delay]: SElement.delay,
  [SynthiaFileSynthNodeType.filter]: SElement.filter,
  [SynthiaFileSynthNodeType.pan]: SElement.pan,
}

export const ElementToFileNodeType = {
  [SElement.oscillator]: SynthiaFileSynthNodeType.oscillator,
  [SElement.wave]: SynthiaFileSynthNodeType.wave,
  [SElement.reverb]: SynthiaFileSynthNodeType.reverb,
  [SElement.delay]: SynthiaFileSynthNodeType.delay,
  [SElement.filter]: SynthiaFileSynthNodeType.filter,
  [SElement.pan]: SynthiaFileSynthNodeType.pan,
}


export const createNode = (node: SynthiaFileSynthNode) => {
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

export const connectNode = (node: SynthiaFileSynthNode) => {
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
