import { ECreateSynth, EUpdateSynth } from '../gql/entities/SynthEntity';
import { handleSequelizeError, ErrorAuthNoAccess } from '../lib/errors';
import { Project } from '../models/Project';
import { Synth } from '../models/Synth';
import { BaseService } from './BaseService';

export const SynthService = new class extends BaseService<
  Synth,
  ECreateSynth,
  EUpdateSynth
> {
  async mySynths(creatorId: string) {
    return await Synth.findAll({ where: {creatorId} })
  }

  async findByProject(projectId: string) {
    return await Synth.findAll({
      include: [{
        model: Project,
        where: { id: projectId }
      }]
    })
  }

  async createSynth(synthInput: ECreateSynth, creatorId: string) {
    const {nodes, projectId, ...input} = synthInput;

    let synth;
    try {
      synth = await Synth.create({ ...input, nodes: nodes || [], creatorId: creatorId});
    } catch (e) {
      throw await handleSequelizeError(e);
    }

    // If project id present, assign synth to the project
    if (projectId) await synth.$add('projects', [projectId]);
    return synth;
  }

  async updateSynth(synthInput: EUpdateSynth, creatorId: string) {
    const synth = (await this.findById(synthInput.id))!;
    if (synth.creatorId !== creatorId) throw new ErrorAuthNoAccess('synth');

    try {
      await synth.update(synthInput);
    } catch (e) {
      throw await handleSequelizeError(e);
    }

    return synth;
  }
}(Synth)
