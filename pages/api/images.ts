import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import * as fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const baselineDir = path.join('/tmp', 'baseline');
  const baselineImageFiles = fs.readdirSync(baselineDir);
  

  

  res.status(200).json(baselineImageFiles);
}
