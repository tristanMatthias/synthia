import { EMidiClip, EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';


export class MidiClip {
  notes: EMidiClipNote[];

  constructor(
    public midiClipObject: EMidiClip
  ) {
    this.notes = midiClipObject.notes;
  }

  addNote(note: EMidiClipNote) {
    this.midiClipObject.notes.push(note);
  }
}
