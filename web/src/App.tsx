import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

export function App() {
  const [repos, setRepos] = useState<any[]>([]);
  const [filteredrepos, setFilteredRepos] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorFetchingData, setErrorFetchingData] = useState(false);

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
        setLanguages(listLanguages(sortedInverseCronology));
        setRepos(sortedInverseCronology);
        setFilteredRepos(sortedInverseCronology);
      })
      .catch((err) => {
        setErrorFetchingData(true);
      })
      .finally(() => {
        setLoading(false);
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
        const reposCopy = [...filteredrepos];
        const newRepos = reposCopy.map((repo: any) => {
          if (repo.full_name === repoName) {
            repo.markdown = res.data;
          }
          return repo;
        });
        setFilteredRepos(newRepos);
      });
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (errorFetchingData) {
    return (
      <Alert variant="danger" className="text-center my-2">
        Error fetching data from the server!
      </Alert>
    );
  }

  return (
    <main className="container-fluid">
      <div>
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
                <Card.Text>
                  Description: {repo.description ?? 'No description provided.'}
                </Card.Text>
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
      </div>
    </main>
  );
}
