import { ServerResponse } from 'http'

function notFound(res: ServerResponse) {
  res.writeHead(404, { 'Content-type': 'text/plain' })
  res.end('404, not found')
}

export default notFound
