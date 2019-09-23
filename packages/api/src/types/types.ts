import { Readable } from "stream";

export class Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}
