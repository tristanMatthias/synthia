import { ESynth, SynthNodeType, TSynthiaProjectSynthNode } from '@synthia/api';
import { proxa } from 'proxa';
import shortid from 'shortid';

import { SynthiaWave } from '../../../audioNodes';
import CompositeAudioNode from '../../../audioNodes/BaseNode';
import { ctx } from '../../AudioContext';
import { fileService } from '../../File/FileService';
import { Instrument } from '../Instrument';
import { noteToFrequency, stringToNoteAndOctave } from '../keyToFrequency';
import { createAudioNode } from './createAudioNode';
import { defaultSynthNodeProperties } from './defaultSynthNodeProperties';


export class Synth implements Instrument {
  synth: ESynth;
  nodes: { [id: string]: [TSynthiaProjectSynthNode, AudioNode | CompositeAudioNode] } = {}
  output = ctx.createGain();

  constructor(synth: ESynth) {
    this.synth = proxa(synth);

    // Construct the initial nodes
    this.synth.nodes.forEach(n => {
      this.nodes[n.id] = [n, createAudioNode(n)]
    });

    this.output.connect(ctx.destination);
    this.setupConnections();
  }

  private get _waves() {
    return Object.values(this.nodes)
      .filter(([sn]) => sn.type === 'wave') as [
        TSynthiaProjectSynthNode, SynthiaWave
      ][]
  }

  setupConnections() {
    Object.values(this.nodes).forEach(([sn]) => {
      sn.connectedTo.forEach(id =>
        this.connectNode(sn.id, id, false)
      )
    })
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
        if (save) fileService.saveSynth(this.synth);
      }

      return from[1].connect(this.output);
    }

    let to = this.nodes[toId];
    if (!to) throw new Error(`Cannot find node with id ${toId}`);

    from[1].connect(to[1] as AudioNode);
    if (update) {
      from[0].connectedTo.push(toId);
      if (save) fileService.saveSynth(this.synth);
    }
  }


  disconnectNode(fromId: string, toId: string, save = true) {
    const from = this.nodes[fromId];
    if (!from) throw new Error(`Cannot find node with id ${fromId}`);

    // Disconnect from the synth itself
    if (toId === 'root') {
      from[0].connectedTo = from[0].connectedTo.filter(n => n !== toId);
      return from[1].disconnect(this.output);
    }

    let to = this.nodes[toId];
    if (!to) throw new Error(`Cannot find node with id ${toId}`);

    from[1].disconnect(to[1] as AudioNode);
    from[0].connectedTo = from[0].connectedTo.filter(n => n !== toId);

    if (save) fileService.saveSynth(this.synth);
  }


  createNode(x: number, y: number, type: SynthNodeType, props?: any) {
    const properties = props || defaultSynthNodeProperties(type);
    const synthNode: TSynthiaProjectSynthNode = {
      id: shortid(),
      type,
      properties,
      position: { x, y },
      receives: [],
      connectedTo: [],
    }
    const audioNode = createAudioNode(synthNode);

    this.synth.nodes.push(synthNode);
    this.nodes[synthNode.id] = [synthNode, audioNode];

    fileService.saveSynth(this.synth);
    return {synthNode: synthNode, audioNode };
  }

  removeNode(id: string) {
    const node = this.nodes[id];
    if (!node) throw new Error(`Cannot find node with id ${id}`);

    // Disconnect other nodes connected to the deleted one
    Object.values(this.nodes)
      .filter(([n]) => n.connectedTo.includes(id))
      .forEach(([n]) => this.disconnectNode(n.id, id, false));

    // Kill the audio
    node[1].disconnect();

    this.synth.nodes = this.synth.nodes.filter(n => n.id !== id);

    delete this.nodes[id];

    // @ts-ignore
    fileService.saveSynth(this.synth.toJSON())
  }

  play(note: string) {
    return this._waves.map(([, w]) => {
      const f = noteToFrequency(...(stringToNoteAndOctave(note)!));
      return w.play(f);
    });
  }

  triggerRelease(note: string) {
    this._waves.forEach(([, w]) => {
      const f = noteToFrequency(...(stringToNoteAndOctave(note)!));
      w.triggerRelease(f);
    })
  }
}
