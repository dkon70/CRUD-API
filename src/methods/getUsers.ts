import { ServerResponse, IncomingMessage } from 'http'
// import data from '../db/db.js'
import { DataType } from '../types/types.js'

function getUsers(req: IncomingMessage, res: ServerResponse, data: DataType[]) {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  } else {
    res.writeHead(400, { 'Content-type': 'text/plain' })
    res.end('Incorrect request method')
  }
}

export default getUsers
