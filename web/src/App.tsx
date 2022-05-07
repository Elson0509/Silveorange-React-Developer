import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

export function App() {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/repos')
      .then((res) => {
        console.log(res.data);
        setRepos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="container-fluid">
      <div className="row">
        {repos.map((repo) => (
          <Card key={repo.id} bg="light">
            <Card.Body>
              <Card.Title>{repo.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Language: {repo.language}
              </Card.Subtitle>
              <Card.Text>Description: {repo.description}</Card.Text>
              <Card.Text>Forks count: {repo.forks_count}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </main>
  );
}
