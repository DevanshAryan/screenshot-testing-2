import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';

const fs = require('fs');
const path = require('path');

const currentDirectory = process.cwd();
console.log('Current working directory:', currentDirectory);

// Read the contents of the current directory
console.log('11');
fs.readdir(currentDirectory, (err:any, files:any) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Log the files in the directory
    console.log('Files in the directory:');
    files.forEach((file:any) => {
        console.log(file);
    });
});

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      console.error('err:', err);
      return resolve(stdout);
    });
  });

// console.log(33);

function getAllScenarioFiles(directoryPath: string): string[] {
  const scenarioFiles: string[] = [];

  function traverseDirectory(currentPath: string) {
    const files: string[] = fs.readdirSync(currentPath);

    files.forEach((file: string) => {
      const filePath = path.join(currentPath, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        traverseDirectory(filePath); // Recursively traverse subdirectories
      } else if (file.endsWith('.png')) {
        const fileName = path.basename(file, '.png');
        scenarioFiles.push(fileName);
      }
    });
  }

  traverseDirectory(directoryPath);

  return scenarioFiles;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lostpixeldir=path.join(process.cwd(),'public', 'resources','.lostpixel');
  if(!fs.existsSync(lostpixeldir))
    {
      fs.mkdirSync(path.join(process.cwd(),'public'))
      fs.mkdirSync(path.join(process.cwd(),'public','resources'))
      fs.mkdirSync(path.join(process.cwd(),'public','resources','.lostpixel'))

    }
  const baselineDir = path.join(process.cwd(), 'public', 'resources','.lostpixel','baseline');
  console.log('62');
  console.log(baselineDir);
  console.log(process.cwd());
  console.log(__dirname);
  const baselineImageFiles = fs.readdirSync(baselineDir);
  const baselineFiles = baselineImageFiles.map((file: string) => {
    return file;
  });

  const currentDir = path.join(process.cwd(), 'public', 'resources','.lostpixel','current');
  console.log(69);
  const currentImageFiles = fs.readdirSync(currentDir);
  const currentFiles = currentImageFiles.map((file: string) => {
    return file;
  });

  const diffDir = path.join(process.cwd(), 'public', 'resources','.lostpixel','difference');
  console.log(76);
  const diffImageFiles = fs.readdirSync(diffDir);
  const diffFiles = diffImageFiles.map((file: string) => {
    return file;
  });


  const images =  baselineFiles.map((file: string) => {
    return {
      fileName: file,
      baseImageSrc: `resources/.lostpixel/baseline/${file}`,
      currentImageSrc: `resources/.lostpixel/baseline/${file}`,
      diffImageSrc: diffFiles.includes(file) ?  `resources/.lostpixel/difference/${file}`: undefined,
    }
  })


  res.status(200).json(images);
}
