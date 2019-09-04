import { ESynth, SynthNodeType, TSynthiaProjectSynthNode } from '@synthia/api';
import { proxa } from 'proxa';
import shortid from 'shortid';
import Tone, { Encoding, PolySynth, Limiter, ProcessingNode } from 'tone';
import { fileService } from '../../File/FileService';
import { createToneNode, ToneNode } from './createToneNode';
import { defaultSynthNodeProperties } from './defaultSynthNodeProperties';
import { Instrument } from '../Instrument';
import { Clock } from '../../Clock';


// import {tone} from 'tone';

export class NodeSynth extends Tone.PolySynth implements Instrument {

  id: string;
  instrumentObject: ESynth;
  output: Tone.Volume;
  nodes: { [id: string]: [TSynthiaProjectSynthNode, ToneNode] } = {}

  private _limiter = new Limiter(-50);


  constructor(instrumentObject: ESynth) {
    super();
    this.id = instrumentObject.id;
    this.instrumentObject = proxa(instrumentObject);

    // Construct the initial nodes
    this.instrumentObject.nodes.forEach(n => {
      this.nodes[n.id] = [n, createToneNode(n)]
    });
    this.setupConnections();
    this._limiter.connect(this.output);


    Clock.on('seek', this.releaseAll.bind(this));

  }

  private get _synths() {
    return Object.values(this.nodes)
      .filter(([sn]) => sn.type === 'wave') as [
        TSynthiaProjectSynthNode, PolySynth
      ][]
  }

  setupConnections() {
    Object.values(this.nodes).forEach(([sn]) => {
      sn.connectedTo.forEach(id =>
        this.connectNode(sn.id, id, false)
      )
    })
  }

  connect(unit: ProcessingNode, outputNum?: number, inputNum?: number) {
    this.output.connect(unit, outputNum, inputNum);
    return this;
  }

  connectNode(
    fromId: string,
    toId: string,
    update = true,
    save = true
  ) {
    const from = this.nodes[fromId];
    if (!from) throw new Error(`Cannot find node with id ${fromId}`);

    // Connect to the synth itself
    if (toId === 'root') {
      if (update) {
        from[0].connectedTo.push(toId);
        if (save) fileService.saveSynth(this.instrumentObject);
      }

      return from[1].connect(this._limiter);
    }

    let to = this.nodes[toId];
    if (!to) throw new Error(`Cannot find node with id ${toId}`);

    from[1].connect(to[1]);
    if (update) {
      from[0].connectedTo.push(toId);
      if (save) fileService.saveSynth(this.instrumentObject);
    }
    return true;
  }


  disconnectNode(fromId: string, toId: string, save = true) {
    const from = this.nodes[fromId];
    if (!from) throw new Error(`Cannot find node with id ${fromId}`);

    // Disconnect from the synth itself
    if (toId === 'root') {
      from[0].connectedTo = from[0].connectedTo.filter(n => n !== toId);
      return from[1].disconnect(this._limiter);
    }

    let to = this.nodes[toId];
    if (!to) throw new Error(`Cannot find node with id ${toId}`);

    from[1].disconnect(to[1]);
    from[0].connectedTo = from[0].connectedTo.filter(n => n !== toId);

    if (save) fileService.saveSynth(this.instrumentObject);
    return true;
  }


  async createNode(x: number, y: number, type: SynthNodeType
    , props?: any) {
    const properties = props || defaultSynthNodeProperties(type);
    const synthNode: TSynthiaProjectSynthNode = {
      id: shortid(),
      type,
      properties,
      position: { x, y },
      receives: [],
      connectedTo: [],
    }
    const audioNode = await createToneNode(synthNode);

    this.instrumentObject.nodes.push(synthNode);
    this.nodes[synthNode.id] = [synthNode, audioNode];

    fileService.saveSynth(this.instrumentObject);
    return { synthNode: synthNode, audioNode };
  }

  removeNode(id: string) {
    const node = this.nodes[id];
    if (!node) throw new Error(`Cannot find node with id ${id}`);

    // Disconnect other nodes connected to the deleted one
    Object.values(this.nodes)
      .filter(([n]) => n.connectedTo.includes(id))
      .forEach(([n]) => this.disconnectNode(n.id, id, false));

    // Kill the audio
    node[1].dispose();

    this.instrumentObject.nodes = this.instrumentObject.nodes.filter(n => n.id !== id);

    delete this.nodes[id];

    // @ts-ignore
    fileService.saveSynth(this.instrumentObject.toJSON())
  }


  triggerAttack(notes: Encoding.Frequency[], time: Encoding.Time = '+0.01', velocity?: number) {
    this._synths.forEach(([,s]) => s.triggerAttack(notes, time, velocity));
    return this;
  }


  /**
   * Trigger the release portion of the envelope
   */
  triggerRelease(notes: Encoding.Frequency[], time: Encoding.Time = '+0.01') {
    this._synths.forEach(([,s]) => s.triggerRelease(notes, time));
    return this;
  }


  releaseAll() {
    console.log('releasing all');

    this._synths.forEach(([, s]) => s.releaseAll())
    return this;
  }
}
