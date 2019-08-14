import { EProject } from '@synthia/api/dist/gql/entities/ProjectEntity';
import { v4 as uuid } from 'uuid';

export const defaultProject: EProject = {
  id: uuid(),
  name: "Default project",
  public: true,
  creatorId: "synthia",
  createdAt: new Date(),
  resources: {
    synths: [{
      id: uuid(),
      createdAt: new Date(),
      name: "Simple square",
      public: true,
      creatorId: "synthia",
      nodes: [
        {
          id: uuid(),
          type: 'wave',
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

