import { constants } from "../../_shared/constants.js"
import RoomSocketBuilder from "./util/roomSocket.js"

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespace.room
})

const socket = socketBuilder
  .setOnUserConnected((user) => console.log('user connected', user))
  .setOnUserDisconnected((user) => console.log('user disconnected', user))
  .setOnRoomUpdated((room) => console.log('room list', room))
  .build()

const room = {
  id: '001',
  topic: 'JS Expert Room'
}

const user = {
  img: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/10_avatar-512.png',
  username: 'Daniel Vieira ' + Date.now()
}


socket.emit(constants.events.JOIN_ROOM, {user, room})
