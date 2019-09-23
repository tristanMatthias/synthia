import { ECreateAudioClip, EUpdateAudioClip } from '../gql/entities/AudioClipEntity';
import { ErrorAuthNoAccess, handleSequelizeError } from '../lib/errors';
import { uploadFile } from '../lib/uploadFile';
import { AudioClip } from '../models/AudioClip';
import { Project } from '../models/Project';
import { BaseService } from './BaseService';
import shortid = require('shortid');


export const AudioClipService = new class extends BaseService<
  AudioClip,
  ECreateAudioClip,
  EUpdateAudioClip
  > {
  async myAudioClips(creatorId: string) {
    return await AudioClip.findAll({ where: { creatorId } })
  }


  async findByProject(projectId: string) {
    return await AudioClip.findAll({
      include: [{
        model: Project,
        where: { id: projectId }
      }]
    })
  }


  async createAudioClip(audioClipInput: ECreateAudioClip, creatorId: string) {
    const { projectId, duration, file, name } = audioClipInput;

    const id = shortid();
    const url = await uploadFile(file, id);

    let audioClip;
    try {
      audioClip = await AudioClip.create({ id, url, creatorId: creatorId, duration, file, name });
    } catch (e) {
      throw await handleSequelizeError(e);
    }

    await audioClip.update({ file: url });

    // If project id present, assign AudioClip to the project
    if (projectId) await this.addToProject(projectId, audioClip);
    return audioClip;
  }


  async updateAudioClip(audioClipInput: EUpdateAudioClip, creatorId: string) {
    const AudioClip = (await this.findById(audioClipInput.id))!;
    if (AudioClip.creatorId !== creatorId) throw new ErrorAuthNoAccess('AudioClip');

    try {
      await AudioClip.update(audioClipInput);
    } catch (e) {
      throw await handleSequelizeError(e);
    }

    return AudioClip;
  }

  async addToProject(projectId: string, audioClip: string | AudioClip) {
    const mc = (audioClip instanceof AudioClip) ? audioClip : (await this.findById(audioClip))!;
    mc.$set('projects', [projectId]);
  }
}(AudioClip)
