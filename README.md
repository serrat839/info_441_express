# express starter for tug of war api.
## important routes:
### ws::/gaming/queue
This endpoint does not recieve any messages, rather, it listens for enough users to be in this endpoint so that it can redirect them to the proper endpoint. Right now, when there are enough players, it sends them a JSON containing the following:

{
    type: "redirect",
    url: "/gaming",
    gameid: Int
}

This json tells us that we are recieving a redirect to the /gaming endpoint. This endpoint takes in a query param for the gameId to connect users to the proper game. This can be changed to modify how we want to redirect users.

On closing the websocket, the queue attempts to remove them from the queue. Even though the queue removes people who are sent to the game, it won't do anything if it cannot find the user to remove from the queue; Users will always be properly removed from the queue no matter what. 

#### TODO:
Right now, I am concerned with my "gameId" implementation. Ints aren't forever, but within the scope of this project, I doubt we will int overflow, so maybe this is a problem out of our scope...

### ws::/gaming/ingame
This endpoint listens for users and allows them to play tug of war. If the user is not a part of the correct game, (for example I manually enter a url to join a game I'm not a part of) the server will not allow them to see or play the game.

Upon connecting, it assigns users a role, plus or minus in the JSON format:

{
    type: "player",
    msg: "You are Minus"/"You are Plus"
}

The msg is what we want to display to our user and can be ignored ultimately. The server tracks who is pulling in which direction.

Upon sending this endpoint a message (whose contents do not matter, but it MUST be a message), this endpoint will update the score, and then send users an updated score in the format:

{
    type: "play",
    value: Int
}

Value is how we can communicate how close to winning someone is. Once abs(value) == 20, the game is over and a winner is decided. This is conveyed using a json formatted like:

{
    type: "gameover",
    winner: "Plus/Minus wins!"
}