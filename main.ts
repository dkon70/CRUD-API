import http from 'http'
import notFound from './src/utils/notFound'
import getUsers from './src/methods/getUsers'
import getUser from './src/methods/getUser'
import addUser from './src/methods/addUser'
import updateUser from './src/methods/updateUser'
import deleteUser from './src/methods/deleteUser'

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
        default:
          notFound(res)
          break
      }
    } else if (URL?.startsWith('/api/users/')) {
      if (URL.split('/').length !== 4) {
        if (method === 'GET') {
          notFound(res)
        }
      } else {
        const userID = URL!.split('/').pop()
        if (userID === '') {
          if (method === 'GET') {
            getUsers(req, res)
          } else {
            res.writeHead(400, { 'Content-type': 'text/plain' })
            res.end('Incorrect request method')
          }
        } else {
          if (method === 'GET') {
            getUser(res, String(userID))
          }
          if (method === 'PUT') {
            updateUser(req, res, String(userID))
          }
          if (method === 'DELETE') {
            deleteUser(res, String(userID))
          }
        }
      }
    } else {
      notFound(res)
    }
  })

  server.listen(port)
}

main(3000)
