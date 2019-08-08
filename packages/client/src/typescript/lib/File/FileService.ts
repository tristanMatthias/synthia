import { EventObject } from '../EventObject/EventObject';
import { defaultProject } from './defaultProject';
import { SynthiaFile } from './file.type';

interface FileServiceEvents {
  loaded: SynthiaFile;
}

export class FileService extends EventObject<FileServiceEvents> {


  private _fileReader = new FileReader();

  private _file: SynthiaFile;
  public get file(): SynthiaFile {
    return this._file;
  }
  public set file(v: SynthiaFile) {
    this._file = v;
    if (v) this.emit('loaded', v);
  }


  constructor(){
    super();
    this._fileReader.addEventListener('load', file => {
      // @ts-ignore
      this.file = JSON.parse(file.target.result);
    });

    this._file = defaultProject;
  }


  async fromJSON(json: string | SynthiaFile) {
    if (typeof json === 'string') this.file = JSON.parse(json);
    this.file = json as SynthiaFile;
  }

  async load(url: string) {
    this.file = await fetch(url).then(r => r.json());
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
    a.download = `${this._file.meta.name}.synth`;
    const data = new Blob([JSON.stringify(this._file)], { type: 'text/plain' });

    a.href = window.URL.createObjectURL(data);
    a.click();
    a.remove();

    return true;
  }
}
