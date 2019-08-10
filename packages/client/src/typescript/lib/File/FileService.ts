import { EProject } from '@synthia/api';

import { API } from '../API/API';
import { EventObject } from '../EventObject/EventObject';
import { defaultProject } from './defaultProject';


interface FileServiceEvents {
  loaded: EProject;
}

export class FileService extends EventObject<FileServiceEvents> {


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

  async load(url: string) {
    this.file = await fetch(url).then(r => r.json());
  }

  async newProject() {
    const pj = await API.createProject({
      name: 'New Synthia project',
      public: true
    });
    this.file = pj;
  }

  // async create() {
  //   const project: EProject = JSON.parse(JSON.stringify(this.file));
  //   project.creatorId = state.user.data!.id;
  //   delete project.id;
  //   delete project.createdAt;
  //   const {resources} = project;
  //   delete project.resources;
  //   const pj = await API.request<EProject>('mutation', 'createProject', {project});
  //   const synths = await Promise.all(
  //     resources.synths.map(s => API.request<ESynth>(
  //       'mutation',
  //       'createSynth',
  //       {synth: {...s, projectId: pj.id}}
  //     ))
  //   );
  // }


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
}
