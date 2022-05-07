import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Repo } from '../models/Repo';
export const repos = Router();


repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');
  res.header('Content-Type', 'application/json');

  res.status(200);

  fs.readFile(path.join(__dirname, '../../data/repos.json'), (err, data) => {
    if (err) {
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
    const jsonData = JSON.parse(data.toString());

    const url = 'https://api.github.com/users/silverorange/repos';

    axios.get(url).then((response) => {
      const urlData = response.data;

      const fullData = jsonData.concat(urlData);

      const falseRepos = fullData.filter((el: Repo) => !el.fork);

      return res.json(falseRepos);
    });
  });
});
