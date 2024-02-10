import { ServerResponse, IncomingMessage } from 'http'
import data from '../db/db'
import getUserById from '../utils/getUserById'
import { validate as uuidValidate } from 'uuid'

function updateUser(req: IncomingMessage, res: ServerResponse, id: string) {
  let receivedData = ''
  const userObj = getUserById(data, id)
  if (!uuidValidate(id)) {
    res.writeHead(400, { 'Content-type': 'text/plain' })
    res.end('Incorrect ID')
    return
  }
  if (!userObj) {
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.end('User not found')
  }

  req.on('data', function (chunk) {
    receivedData += chunk
  })

  req.on('end', function () {
    try {
      const receivedDataObj = JSON.parse(receivedData)
      if (
        (receivedDataObj.hasOwnProperty('username') &&
          typeof receivedDataObj.username !== 'string') ||
        (receivedDataObj.hasOwnProperty('age') &&
          typeof receivedDataObj.age !== 'number') ||
        (receivedDataObj.hasOwnProperty('hobbies') &&
          typeof receivedDataObj.hobbies !== 'object')
      ) {
        res.writeHead(400, { 'Content-type': 'text/plain' })
        res.end('Incorrect data types')
        return
      }
      if (userObj) {
        userObj.username = receivedDataObj.username
          ? receivedDataObj.username
          : userObj.username
        userObj.age = receivedDataObj.age ? receivedDataObj.age : userObj.age
        userObj.hobbies = receivedDataObj.hobbies
          ? receivedDataObj.hobbies
          : userObj.hobbies
        res.writeHead(200, { 'Content-type': 'text/plain' })
        res.end('User data updated')
      }
    } catch (err) {
      res.writeHead(400, { 'Content-type': 'text/plain' })
      res.end('Request is not valid JSON')
    }
  })
}

export default updateUser
