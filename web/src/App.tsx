import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

export function App() {
  const [repos, setRepos] = useState<any[]>([]);
  const [filteredrepos, setFilteredRepos] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/repos')
      .then((res) => {
        const reposList = res.data;
        const sortedInverseCronology = reposList.sort(
          // eslint-disable-next-line @typescript-eslint/naming-convention
          (a: { created_at: number }, b: { created_at: number }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        console.log(sortedInverseCronology);
        console.log(listLanguages(sortedInverseCronology));
        setLanguages(listLanguages(sortedInverseCronology));
        setRepos(sortedInverseCronology);
        setFilteredRepos(sortedInverseCronology);
      })
      .catch((err) => {
        // TODO handle error and loading
        console.log(err);
      });
  }, []);

  const listLanguages = (reposlist: any[]): [] => {
    const languagesFilter = reposlist.reduce((acc, curr) => {
      if (acc.includes(curr.language)) {
        return acc;
      } else {
        return [...acc, curr.language];
      }
    }, []);
    return languagesFilter;
  };

  const filterReposByLanguage = (language: string) => {
    if (!language) {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(repos.filter((repo: any) => repo.language === language));
    }
  };

  const clickRepoHandler = (repoName: string) => {
    axios
      .get(`https://raw.githubusercontent.com/${repoName}/master/README.md`)
      .then((res) => {
        console.log(res.data);
        const reposCopy = [...filteredrepos];
        const newRepos = reposCopy.map((repo: any) => {
          if (repo.full_name === repoName) {
            repo.markdown = res.data;
          }
          return repo;
        });
        console.log({ newRepos });
        setFilteredRepos(newRepos);
      });
  };

  return (
    <main className="container-fluid">
      <div className="row">
        <div className="col-12 py-4">
          {languages.map((language: any) => (
            <Button
              variant="primary"
              className="mx-2"
              onClick={() => filterReposByLanguage(language)}
              key={language}
            >
              {language}
            </Button>
          ))}
          <Button
            variant="danger"
            className="mx-2"
            onClick={() => filterReposByLanguage('')}
          >
            Original list
          </Button>
        </div>
      </div>
      <div className="row">
        {filteredrepos.map((repo) => (
          <Card
            key={repo.id}
            bg="light"
            onClick={() => clickRepoHandler(repo.full_name)}
            className="pointer card-repo"
          >
            <Card.Body>
              <Card.Title>{repo.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Language: {repo.language}
              </Card.Subtitle>
              <Card.Text>Description: {repo.description}</Card.Text>
              <Card.Text>Forks count: {repo.forks_count}</Card.Text>
              {repo.markdown ? (
                <div>
                  <hr />
                  <ReactMarkdown>{repo.markdown}</ReactMarkdown>
                </div>
              ) : null}
            </Card.Body>
          </Card>
        ))}
      </div>
    </main>
  );
}
