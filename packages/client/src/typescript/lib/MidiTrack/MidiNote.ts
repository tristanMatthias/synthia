export class MidiNote {
  constructor(
    public start: number,
    public duration: number,
    public velocity?: number,
    public note?: string,
    public octave?: number,
  ) {}
}
