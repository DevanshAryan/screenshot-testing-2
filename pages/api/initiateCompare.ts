import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

import tasks from '@/src/tasks';

const exec = (command: string) =>
  new Promise((resolve,reject) => {
    execCallback(command, (err, stdout) => {
      if(err)
      return reject(err);
    
      console.log(stdout);
      return resolve(stdout);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { baseUrl, compareUrl } = req.body;

  if (!baseUrl || !compareUrl) {
    return res.status(500).json({ error: 'baseUrl and compareUrl are required' });
  }

  const newTaskId = uuidv4();

  tasks.setTaskStatus(newTaskId, 'in progress');

  process.nextTick(async () => {
    try {
      process.env.TARGET_URL = baseUrl;
      await exec('yarn lost-pixel update');

      process.env.TARGET_URL = compareUrl;
      await exec('yarn lost-pixel');

      tasks.setTaskStatus(newTaskId, 'completed');
    } catch (error) {
      tasks.setTaskStatus(newTaskId, 'error');
    }
  });

  res.status(200).json({ taskId: newTaskId });
}
