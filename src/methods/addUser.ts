import { ServerResponse, IncomingMessage } from 'http'
// import data from '../db/db.js'
import { v4 as uuidv4 } from 'uuid'
import { DataType } from '../types/types'

function addUser(req: IncomingMessage, res: ServerResponse, data: DataType[]) {
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
        return
      } else {
        if (
          typeof receivedDataObj.username === 'string' &&
          typeof receivedDataObj.age === 'number' &&
          typeof receivedDataObj.hobbies === 'object'
        ) {
          res.writeHead(201, { 'Content-type': 'text/plain' })
          data.push({
            id: id,
            username: receivedDataObj.username,
            age: receivedDataObj.age,
            hobbies: receivedDataObj.hobbies,
          })
          res.end('User added')
          return
        } else {
          res.writeHead(400, { 'Content-type': 'text/plain' })
          res.end('Incorrect data')
          return
        }
      }
    } catch (err) {
      res.writeHead(400, { 'Content-type': 'text/plain' })
      res.end('Request body is not valid JSON')
      return
    }
  })
}

export default addUser
