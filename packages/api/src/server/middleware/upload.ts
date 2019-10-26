import e, { Express } from 'express';


export const upload = async (app: Express) => {
  app.use('/uploads', e.static('uploads'));
}
