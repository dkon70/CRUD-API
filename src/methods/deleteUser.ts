import { ServerResponse } from 'http'
import getUserById from '../utils/getUserById.js'
import { validate as uuidValidate } from 'uuid'
import { DataType } from '../types/types.js'
// import data from '../db/db.js'
import cluster from 'cluster'

function deleteUser(res: ServerResponse, id: string, data: DataType[]) {
  const userObj = getUserById(data, id)
  if (!uuidValidate(id)) {
    res.writeHead(400, { 'Content-type': 'text/plain' })
    res.end('Incorrect ID')
    return
  }
  if (!userObj) {
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.end('User not found')
    return
  }
  data.splice(data.indexOf(userObj), 1)
  res.writeHead(204)
  if (cluster.isWorker) {
    process.send!(data)
  }
  res.end()
}

export default deleteUser
