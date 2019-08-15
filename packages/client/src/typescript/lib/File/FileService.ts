import {EProject} from '@synthia/api';

import { API } from '../API/API';
import { EventObject } from '../EventObject/EventObject';
import { defaultProject } from './defaultProject';


interface FileServiceEvents {
  loaded: EProject;
}

export const fileService = new class FileService extends EventObject<FileServiceEvents> {


  private _fileReader = new FileReader();

  private _file: EProject;
  public get file(): EProject {
    return this._file;
  }
  public set file(v: EProject) {
    this._file = v;

    if (v) this.emit('loaded', v);
  }


  constructor(){
    super();
    this._fileReader.addEventListener('load', file => {
      // @ts-ignore
      this.file = JSON.parse(file.target.result);
    });
  }


  async fromJSON(json: string | EProject) {
    if (typeof json === 'string') this.file = JSON.parse(json);
    this.file = json as EProject;
  }

  async loadDefault() {
    this.file = defaultProject;
  }

  async load(projectId: string) {
    this.file = await API.loadProject(projectId);
  }

  async list() {
    return await API.listProjects();
  }

  async newProject(name = 'New Synthia project') {
    const pj = await API.createProject({
      name,
      public: true
    });
    const synth = await API.createSynth({
      name: 'My Synth',
      projectId: pj.id,
      public: true,
      nodes: []
    });
    pj.resources.synths.push(synth);
    this.file = pj;
  }

  async openFile() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.addEventListener('change', (e) => {
      // @ts-ignore
      const f = e.target.files[0];

      // Read in the image file as a data URL.
      this._fileReader.readAsText(f);
    });

    inp.click();
    inp.remove();
  }


  async download() {
    if (!this._file) return false;

    const a = document.createElement('a');
    a.download = `${this._file.name}.synth`;
    const data = new Blob([JSON.stringify(this._file)], { type: 'text/plain' });

    a.href = window.URL.createObjectURL(data);
    a.click();
    a.remove();

    return true;
  }


  async save(file: EProject) {
    return await Promise.all(file.resources.synths.map(s => {
      // Clean each synth
      // @ts-ignore
      const synth = s.toJSON();
      delete synth.createdAt;
      delete synth.creatorId;
      // @ts-ignore
      delete synth.creator;
      // @ts-ignore
      delete synth.projects;
      return API.updateSynth(synth)
    }));
  }
}()