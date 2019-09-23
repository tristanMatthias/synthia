import aws from 'aws-sdk';
import { Readable } from 'stream';
import { CONFIG } from '../config';


let s3: aws.S3;


if (CONFIG.s3 && CONFIG.s3.bucket) {
  s3 = new aws.S3({
    region: CONFIG.s3.region,
    accessKeyId: CONFIG.s3.key,
    secretAccessKey: CONFIG.s3.secret,
    params: {
      Bucket: CONFIG.s3.bucket
    }
  });
}


export namespace S3 {
  export const upload = async (
    id: string,
    file: Readable,
    mimeType: string
  ): Promise<aws.S3.ManagedUpload.SendData> =>

    // Create in S3 with the generated file id
    await new Promise((resolve, rej) => {
      s3.upload({
        Body: file,
        Key: id,
        ContentType: mimeType,
        Bucket: CONFIG.s3.bucket
      })

        // .on('httpUploadProgress', (progress: aws.S3.ProgressEvent) => { })

        .send((err, d) => {
          if (err) rej(err);
          resolve(d);
        });
    });
}
