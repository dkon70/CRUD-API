import { ServerResponse, IncomingMessage } from 'http'
import data from '../db/db'
import { v4 as uuidv4 } from 'uuid'

function addUser(req: IncomingMessage, res: ServerResponse) {
  const id = uuidv4()
  let recievedData = ''

  req.on('data', function (chunk) {
    recievedData += chunk
  })

  req.on('end', function () {
    try {
      const receivedDataObj = JSON.parse(recievedData)
      if (
        !receivedDataObj.hasOwnProperty('username') ||
        !receivedDataObj.hasOwnProperty('age') ||
        !receivedDataObj.hasOwnProperty('hobbies')
      ) {
        res.writeHead(400, { 'Content-type': 'text/plain' })
        res.end('Incorrect data')
      } else {
        if (
          typeof receivedDataObj.username === 'string' &&
          typeof receivedDataObj.age === 'number' &&
          typeof receivedDataObj.hobbies === 'object'
        ) {
          res.writeHead(201, { 'Content-type': 'text/plain' })
          data.push({ id: id, ...receivedDataObj })
          res.end('User added')
        } else {
          res.writeHead(400, { 'Content-type': 'text/plain' })
          res.end('Incorrect data')
        }
      }
    } catch (err) {
      res.writeHead(400, { 'Content-type': 'text/plain' })
      res.end('Request body is not valid JSON')
    }
  })
}

export default addUser
