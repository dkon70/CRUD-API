import { ServerResponse } from 'http'
import data from '../db/db'
import getUserById from '../utils/getUserById'
import { validate as uuidValidate } from 'uuid'

function getUser(res: ServerResponse, id: string) {
  if (!uuidValidate(id)) {
    res.writeHead(400, { 'Content-type': 'text/plain' })
    res.end('Incorrect ID')
    return
  }
  const userObj = getUserById(data, id)
  if (userObj) {
    res.writeHead(200, { 'Content-type': 'application/json' })
    res.end(JSON.stringify(userObj))
  } else {
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.end('User not found')
  }
}

export default getUser
