import { EMidiClip, EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';


export class MidiClip {
  notes: EMidiClipNote[];

  constructor(
    public midiClip: EMidiClip
  ) {
    this.notes = midiClip.notes;
  }
}
