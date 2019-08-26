
import { ECreateMidiClip, EUpdateMidiClip } from '../gql/entities/MidiClipEntity';
import { ErrorAuthNoAccess, handleSequelizeError } from '../lib/errors';
import { MidiClip } from '../models/MidiClip';
import { Project } from '../models/Project';
import { BaseService } from './BaseService';

export const MidiClipService = new class extends BaseService<
  MidiClip,
  ECreateMidiClip,
  EUpdateMidiClip
  > {
  async myMidiClips(creatorId: string) {
    return await MidiClip.findAll({ where: { creatorId } })
  }

  async findByProject(projectId: string) {
    return await MidiClip.findAll({
      include: [{
        model: Project,
        where: { id: projectId }
      }]
    })
  }

  async createMidiClip(MidiClipInput: ECreateMidiClip, creatorId: string) {
    const { projectId } = MidiClipInput;

    let midiClip;
    try {
      midiClip = await MidiClip.create({ creatorId: creatorId });
    } catch (e) {
      throw await handleSequelizeError(e);
    }

    // If project id present, assign MidiClip to the project
    if (projectId) await this.addToProject(projectId, midiClip);
    return midiClip;
  }

  async updateMidiClip(midiClipInput: EUpdateMidiClip, creatorId: string) {
    const MidiClip = (await this.findById(midiClipInput.id))!;
    if (MidiClip.creatorId !== creatorId) throw new ErrorAuthNoAccess('MidiClip');

    try {
      await MidiClip.update(midiClipInput);
    } catch (e) {
      throw await handleSequelizeError(e);
    }

    return MidiClip;
  }

  async addToProject(projectId: string, midiClip: string | MidiClip) {
    const mc = (midiClip instanceof MidiClip) ? midiClip : (await this.findById(midiClip))!;
    mc.$set('projects', [projectId]);
  }
}(MidiClip)
