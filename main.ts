import http from 'http';
import getUsers from './src/methods/getUsers';

function main(port: number) {
  const server = http.createServer((req, res) => {
    switch (req.url) {
      case '/api/users':
        getUsers(req, res);
    }

  });
  
  server.listen(port);
}

main(3000);