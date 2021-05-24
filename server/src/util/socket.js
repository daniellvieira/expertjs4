import http from 'http'
import { Server } from 'socket.io'
import { constants } from './constants.js'

export default class SocketServer {
  #io // membro privado

  constructor({port}) {
    this.port = port
    this.namespace = {}
  }

  attachEvents({routeConfig}) {
    for(const routes of routeConfig) {
      for(const [namespace, {events, eventEmmiter}] of Object.entries(routes)) {
        const route = this.namespace[namespace] = this.#io.of(`/${namespace}`)
        route.on('connection', socket => {
          for(const [functionName, functionValue] of events) {
            socket.on(functionName, (...args) => functionValue(socket, ...args))
          }

          eventEmmiter.emit(constants.events.USER_CONNECTED, socket)
        })
      }
    }
  }

  async start() {
    const server = http.createServer((request, response) => {
      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
      })

      response.end('hey there!!')
    })

    this.#io = new Server(server, {
      cors: {
        origin: '*',
        credentials: false
      }
    })

    // const room = this.#io.of('/room')
    // room.on('connection', socket => {
    //   socket.emit('userConnection', 'socket id se conectou ' + socket.id)
    //   socket.on('joinRoom', (dados) => {
    //     console.log('dados recebidos', dados)
    //   })
    // })

    return new Promise((resolve, reject) => {
      server.on('error', reject)

      server.listen(this.port, () => resolve(server))
    })
  }
}