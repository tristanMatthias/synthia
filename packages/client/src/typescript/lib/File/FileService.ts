import {EProject, ESynth, ESynthNodeInput} from '@synthia/api';

import { API } from '../API/API';
import { EventObject } from '../EventObject/EventObject';


interface FileServiceEvents {
  loaded: EProject;
}

export const fileService = new class FileService extends EventObject<FileServiceEvents> {


  private _fileReader = new FileReader();

  private _file: EProject | null;
  public get file(): EProject | null {
    return this._file;
  }
  public set file(v: EProject | null) {
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

  async load(projectId: string) {
    if (this.file && projectId === this.file.id) return;
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
    await this.newSynth('My Synth', pj);
    this.file = pj;

    return pj;
  }

  async newSynth(name = 'My synth', project = this.file) {
    if (!project) return false;
    const synth = await API.createSynth({
      name,
      projectId: project.id,
      public: true,
      nodes: []
    });
    project.resources.synths.push(synth);
    return synth;
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

  async close() {
    this.file = null;
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
    API.updateProject({ id: file.id, name: file.name })
    // return await Promise.all(file.resources.synths.map(s => {
    //   // Clean each synth
    //   // @ts-ignore
    //   const synth = s.toJSON();
    //   delete synth.createdAt;
    //   delete synth.creatorId;
    //   // @ts-ignore
    //   delete synth.creator;
    //   // @ts-ignore
    //   delete synth.projects;
    //   return API.updateSynth(synth)
    // }));
  }

  saveSynth(synth: ESynth) {
    return API.updateSynth({
      id: synth.id,
      nodes: synth.nodes as ESynthNodeInput[]
    });
  }
}()
