import { ServerResponse } from 'http'
// import data from '../db/db.js'
import getUserById from '../utils/getUserById.js'
import { validate as uuidValidate } from 'uuid'
import { DataType } from '../types/types.js'
import cluster from 'cluster'

function getUser(res: ServerResponse, id: string, data: DataType[]) {
  if (!uuidValidate(id)) {
    res.writeHead(400, { 'Content-type': 'text/plain' })
    res.end('Incorrect ID')
    return
  }
  const userObj = getUserById(data, id)
  if (userObj) {
    if (cluster.isWorker) {
      process.send!(data)
    }
    res.writeHead(200, { 'Content-type': 'application/json' })
    res.end(JSON.stringify(userObj))
  } else {
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.end('User not found')
  }
}

export default getUser
