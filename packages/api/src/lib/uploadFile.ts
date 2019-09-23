import { createWriteStream, WriteStream } from 'fs';
import { Writable } from 'stream';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';

import { Upload } from '../types/types';
import { CONFIG, Env } from '../config';
import { S3 } from './s3';

fs.exists(CONFIG.localUploadDir, (e) => {
  if (!e) fs.mkdir(CONFIG.localUploadDir, () => { });
});

/**
 * Upload a file to Google Bucket, or save to file system if in dev/test
 * environment.
 * @param createReadStream Function returning a readable stream
 * @param ext File extension
 * @param entityType Type of entity file is associated to
 * @param entityId Entity ID file is associated to
 * @param name Name of the file
 */
export const uploadFile = async (
  file: Upload,
  entityId: string,
  entityType = 'audioClip',
): Promise<string> => {

  const { createReadStream, mimetype } = await file;
  const ext = mimetype.split('/')[1];

  let url: string;
  let stream: WriteStream | Writable;

  // If dev or test environment, store the file locally, otherwise upload to S3.
  if ([Env.development].includes(CONFIG.env)) {

    url = `${entityType}.${entityId}.${(new Date()).getTime()}.${ext}`;
    stream = createWriteStream(
      path.resolve(CONFIG.localUploadDir, url)
    );

    await new Promise(async (res, rej) =>
      createReadStream()
        .pipe(stream)
        .on('finish', () => res(url))
        // TODO: Handle error gracefully
        .on('error', (e) => {
          console.log(e);

          rej(false)
        })
    );
    url = `/uploads/${url}`;


  } else {
    // Upload to s3
    url = (await S3.upload(
      `/${entityType}/${md5(entityId.toString())}/${(new Date()).getTime()}.${ext}`,
      createReadStream(),
      mimetype)
    ).Location;
  }

  console.log('got url', url);


  return url;
};
