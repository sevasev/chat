# chat

A simple localhost chat written on Javascript (Node.js Express) & Socket.IO

## Now main features working:

- Minimum lenght of message = 1 col
- As many participiants as you wish
- Messages are being stored for one session

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
1. Ubuntu
2. Node.js & npm
3. Socket.IO Library
4. git
```

### Installing

A step by step series of examples that tell you have to get a development env running

First, make sure you are running Ubuntu on your PC. For this purpose visit ```https://www.ubuntu.com/``` and follow installation instructions.

Second, run these scripts to get Node.js installed:

```
$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
```
$ sudo apt-get install -y build-essential  // this will install additional building tools
```
Third, download Socket.IO lib by running:

```
$ npm install socket.io
```

Finally, install git by typing:

```
$ sudo apt-get install git
```
### Running 

To make this large powerful machine working, write script below in your terminal and open ```http://localhost:8080/```:
```
$ node server.js
```

## Built With

* [Node.js](https://nodejs.org/) - The web framework used
* [npm](https://www.npmjs.com/) - Dependency Management
* [EJS Templates](www.embeddedjs.com/) - Used to generate .EJS views

## Authors

* **Mishanya & Seva Bro-Team** - *Initial work* - [Seva](https://vk.com/clwrg)
