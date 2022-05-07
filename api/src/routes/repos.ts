import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  fs.readFile(path.join(__dirname, '../../data/repos.json'), (err, data) => {
    // check error
    const jsonData = JSON.parse(data.toString());

    const url = 'https://api.github.com/users/silverorange/repos';

    axios.get(url).then((response) => {
      const urlData = response.data;

      const fullData = jsonData.concat(urlData);

      return res.json(fullData);
    });
  });
});
