// The events that we will allow to be emitted by the clients, otherwise disconnect it. 
enum AllowedEventsForEmit {
    'join_room' = 'join_room',
    'message' = 'message',
    'isTyping' = 'isTyping',
    'healthCheck' = 'healthCheck'
}


export default AllowedEventsForEmit