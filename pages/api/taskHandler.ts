// Inside your /api/taskHandler.ts file:
import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

import tasks from '@/src/tasks';

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      return resolve(stdout);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { baseUrl, compareUrl } = req.body;

    if (!baseUrl || !compareUrl) {
      return res.status(500).json({ error: 'baseUrl and compareUrl are required' });
    }

    // Generate a unique task ID
    const newTaskId = uuidv4();

    tasks.setTaskStatus(newTaskId, 'in progress');

    process.nextTick(async () => {
      try {
        process.env.TARGET_URL = baseUrl;
        await exec('yarn lost-pixel update');

        process.env.TARGET_URL = compareUrl;
        await exec('yarn lost-pixel');
        await exec('node internals/scripts/lostPixelJson.js');

        tasks.setTaskStatus(newTaskId, 'completed');
      } catch (error) {
        tasks.setTaskStatus(newTaskId, 'error');
      }
    });

    // Return the task ID to the client immediately
    res.status(200).json({ taskId: newTaskId });
  } else if (req.method === 'GET') {
    // This is the /checkTaskStatus endpoint
    const taskId = req.query.taskId as string;

    if (!taskId || !tasks.getTaskStatus(taskId)) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Return the status of the task
    res.status(200).json({ status: tasks.getTaskStatus(taskId) });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}