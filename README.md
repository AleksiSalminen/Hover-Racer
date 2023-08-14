# Hover Racer

## About

A futuristic hover-craft -style 3D racing game

![Main Menu Image](https://github.com/AleksiSalminen/Hover-Racer/blob/main/github-images/main_menu.png "Main Menu Image")

![Game Image](https://github.com/AleksiSalminen/Hover-Racer/blob/main/github-images/game.png "Game Image")

Game modes: time attack

This project is based on a racing game called [HexGL](https://hexgl.bkcore.com/) -> source code: [GitHub](https://github.com/BKcore/HexGL) -> license: [MIT License](https://github.com/AleksiSalminen/Hover-Racer/blob/main/client/LICENSE)

## Installation

1. Install Node.js and NPM to your system and add them to PATH
2. Download the project folder from GitHub (probably .zip-file) and extract contents to your chosen folder

or

2. Clone the project using Git to your chosen folder
3. Open a terminal window and navigate to the folder where the project root is

#### Starting the client-side application
4. Navigate to folder called "client"
5. Install required modules by running command "npm install"
6. Start client by running "npm run dev"
7. The game can now be accessed in the address shown in the terminal

## How to play

In the main menu, you can change the game settings to what you prefer (difficulty, graphics quality, etc)

Start the game by pressing "START"

Your goal is to complete laps as fast as you can

### Controls

Throttle: "UP" arrow key

Brake: Release the throttle button

Steer left: "LEFT" arrow key

Steer right: "RIGHT" arrow key

Airbrake left: "A"

Airbrake right: "D"

Use steering + airbrakes to turn very sharply

You can get boost from the boost platforms in certain points of the tracks

## Details

### Frontend

This project uses HexGL as a base for the frontend game engine. It improves and updates the base engine so that it is more modular and utilizes good modern tools like TypeScript. There will probably also be quite big changes and addons to the base engine during development.

For the user interface, this project uses React + TypeScript + Vite

### Backend
This project will (eventually) add server functionality to the application. A server side application is needed, for example, to make multiplayer possible through the use of WebSockets.

### Progression / improvements / changes
Current improvements made to the existing engine:
+ Now uses modules instead of basic scripts.
  + Modules are always executed in strict mode
  + Modules can be imported and exported to other modules when needed. Makes it easier to understand the relationships and dependencies between modules
  + All variables, objects etc are private unless explicitly exported. Other modules can only access what has been specified in the module
+ Separated the game engine from the game content (game content can be changed/added without touching the engine code)
+ More game options to tweak in the main menu. Overall easier to change game and engine options and setup
+ Better separation of concerns
+ Improved file/folder structure
+ Partially converted JavaScript files to TypeScript files

Todo:
+ Fix a bug where the game cannot load the resources properly without reloading the window
+ Finish TypeScript conversion
+ Make importing and using new 3D models easier
+ Simplify the creation of new tracks
+ Overall simplify the process of adding new content to the game
+ Add multiplayer functionality and lobbies
