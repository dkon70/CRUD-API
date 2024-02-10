import http from 'http'
import notFound from './src/utils/notFound'
import getUsers from './src/methods/getUsers'
import getUser from './src/methods/getUser'
import addUser from './src/methods/addUser'

function main(port: number) {
  const server = http.createServer((req, res) => {
    const URL = req.url
    const method = req.method
    if (URL === '/api/users') {
      switch (method) {
        case 'GET':
          getUsers(req, res)
          break
        case 'POST':
          addUser(req, res)
          break
      }
    } else if (URL?.startsWith('/api/users/')) {
      if (URL.split('/').length !== 4) {
        notFound(res)
      } else {
        const userID = URL!.split('/').pop()
        if (userID === '') {
          getUsers(req, res)
        } else {
          getUser(res, String(userID))
        }
      }
    } else {
      notFound(res)
    }
  })

  server.listen(port)
}

main(3000)
