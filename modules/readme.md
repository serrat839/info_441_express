# Queue Code
This class is created to handle game creation and queue updates.

## Constructor
_params_
    - gameSize -> Int: The number of people needed to start a game

## enqueue
Adds a user to the game queue. This implementation uses maps, so objects may be used as keys.
_params_
    - userData -> Obj: Anything to uniquely identify users.

## dequeue
Removes a user from the game queue. If the user is not found, will not throw an error.
_params_
    -userData -> Obj: Anything to uniquely identify users.

## popQueue() 
Checks the queue to see if there are enough people to start a game
_returns_ 
    players -> An array of size(gameSize) that contains the userData used to uniquely identify players added to the queue. If there are not players, this will return an empty array.