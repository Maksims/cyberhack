cyberhack
=========
Is a beginning of a project based on proof of idea on Mozilla Hack Day, 24 hours game called cyberhack: http://moka.co:443/  
The core element of the game that it is multiplayer game with open client side logic code, that can be modified by player the way he wants.

Only results of "input" from client are sent to server side, where this data is processed and validated, and after sent to stact of user input data to affect player controlled entities in the world.
Server side simulates all game logic, and then sends potential world states to clients that way they extrapolate data after and render.

The **setting** of the game is **Sci-Fi**, with element of **Cyberpunk**.  
**Genre** is **MMO TDS** - Hackable Massive Multiplayer Online Top-Down Shooter.

State of the project
=========
This is very early state of the project, and is sketch of future architecture of the server side and client side.

It uses node.js, mootools, mongodb, socket.io, and some other libraries on server side.

Client side use html5-canvas, socket.io, mootools.

Right now there is world initialisation with clustering and gamepad controls on client side to fly around the world.  
Development is happening using Google Chrome, so gamepad will work probably only in Chrome as it is very specific API.
