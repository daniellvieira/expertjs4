import RoomsController from './controllers/roomsController.js'
import SocketServer from './util/socket.js'
import Event from 'events'
import { constants } from './util/constants.js'


const port = process.env.PORT || 3000
const socketServer = new SocketServer({ port })
const server = await socketServer.start()

const roomsController = new RoomsController()

const namespaces = {
  room: { controller: roomsController, eventEmmiter: new Event() }
}

// namespaces.room.eventEmmiter.on(
//   'userConnected', 
//   namespaces.room.controller.onNewConnection.bind(namespaces.room.controller)
// )
// namespaces.room.eventEmmiter.emit('userConnected', { id: '001' })

const routeConfig = Object.entries(namespaces)
  .map(([namespace, { controller, eventEmmiter}]) => {
    const controllerEvents = controller.getEvents()
    eventEmmiter.on(
      constants.events.USER_CONNECTED,
      controller.onNewConnection.bind(controller)
    )

    return {
      [namespace]: { events: controllerEvents, eventEmmiter }
    }
  })

socketServer.attachEvents({routeConfig})

console.log('socket server is running at', server.address().port)