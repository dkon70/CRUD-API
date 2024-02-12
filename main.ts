import http from 'http'
import notFound from './src/utils/notFound.js'
import getUsers from './src/methods/getUsers.js'
import getUser from './src/methods/getUser.js'
import addUser from './src/methods/addUser.js'
import updateUser from './src/methods/updateUser.js'
import deleteUser from './src/methods/deleteUser.js'
import 'dotenv/config'
import cluster from 'cluster'
import { availableParallelism } from 'os'
import { DataType } from './src/types/types.js'

function main(port: number, db: DataType[]) {
  process.on('message', function (message: DataType[]) {
    db = message
  })
  const server = http.createServer((req, res) => {
    const URL = req.url
    const method = req.method
    if (URL === '/api/users') {
      switch (method) {
        case 'GET':
          getUsers(req, res, db)
          break
        case 'POST':
          addUser(req, res, db)
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
            getUsers(req, res, db)
          } else {
            res.writeHead(400, { 'Content-type': 'text/plain' })
            res.end('Incorrect request method')
          }
        } else {
          if (method === 'GET') {
            getUser(res, String(userID), db)
          }
          if (method === 'PUT') {
            updateUser(req, res, String(userID), db)
          }
          if (method === 'DELETE') {
            deleteUser(res, String(userID), db)
          }
        }
      }
    } else {
      notFound(res)
    }
  })

  server.listen(port, () => {
    if (cluster.isPrimary) {
      console.log('Balancer is running on port:', port)
    } else {
      console.log('Worker is running on port:', port)
    }
  })
}
const cpus = availableParallelism()
const targetPorts: number[] = []
let currentPortIndex = 0
for (let i = 1; i < cpus; i++) {
  targetPorts.push(Number(process.env.PORT) + i)
}

if (process.argv.pop() === '--multi') {
  if (cluster.isPrimary) {
    let dataBase: DataType[] = []
    const balancer = http.createServer((req, res) => {
      const targetPort = targetPorts[currentPortIndex]
      currentPortIndex = (currentPortIndex + 1) % targetPorts.length
      const options = {
        hostname: 'localhost',
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      }

      const proxyReq = http.request(options, (proxyRes) => {
        for (const worker of Object.values(cluster.workers!)) {
          worker!.send(dataBase)
        }
        res.writeHead(proxyRes.statusCode!, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      })

      req.pipe(proxyReq, { end: true })
    })
    balancer.listen(Number(process.env.PORT), function () {
      console.log('balancer on:', Number(process.env.PORT))
    })
    for (let i = 1; i < cpus; i++) {
      const worker = cluster.fork({ PORT: Number(process.env.PORT) + i })
      worker.on('message', function (message: DataType[]) {
        dataBase = message
      })
      worker.send(dataBase)
    }

    cluster.on('message', (worker, message) => {
      if (message.type === 'database') {
        console.log('Received database from worker', worker.id)
        const dataBase = message.data
        main(Number(process.env.PORT), dataBase)
      }
    })
  }
} else {
  main(Number(process.env.PORT), [])
}
