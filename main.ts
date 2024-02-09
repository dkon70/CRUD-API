import http from 'http'
import notFound from './src/utils/notFound'
import getUsers from './src/methods/getUsers'

function main(port: number) {
  const server = http.createServer((req, res) => {
    switch (req.url) {
      case '/api/users':
        getUsers(req, res)
        break
      default:
        notFound(res)
        break
    }
  })

  server.listen(port)
}

main(3000)
