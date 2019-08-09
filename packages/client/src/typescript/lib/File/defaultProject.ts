import { SynthiaProject, SynthiaProjectSynthNodeType } from '@synthia/api/dist/types/index';

export const defaultProject: SynthiaProject = {
  id: "af877d59-4911-494a-b18d-1a8f8e5ba875",
  name: "Default project",
  public: true,
  creatorId: "synthia",
  createdAt: new Date(),
  resources: {
    synths: [{
      id: "eb2c4d17-f4db-44e4-8f4f-2afc862c3454",
      createdAt: new Date(),
      name: "Simple square",
      public: true,
      creatorId: "synthia",
      nodes: [
        {
          id: "625ddab9-d059-45cb-bff3-26f91658249d",
          type: SynthiaProjectSynthNodeType.wave,
          properties: {
            type: "sawtooth",
            attack: 0.2,
            attackLevel: 1,
            decay: 0.2,
            decayLevel: 0.7,
            delay: 0,
            release: 0.2,
            pitch: 0,
            gain: 0.8
          },
          position: {
            x: 50,
            y: 42.7667
          },
          receives: [],
          connectedTo: ["root"]
        }
      ]
    }]
  }
}

