# Collaborative Code Editor

A real-time collaborative code editor. Multiple users can join, edit the same document at the same time, see each other's cursors, and view who is online.

https://code-editor-fawn-five.vercel.app/

<img width="1898" height="907" alt="image" src="https://github.com/user-attachments/assets/d61ced5a-e0c1-4ad9-8dc3-870d7b668360" />
<img width="1905" height="888" alt="image" src="https://github.com/user-attachments/assets/230a22da-9e95-43e5-916d-bf5fabd265bf" />


## Features

- Real-time collaborative editing with conflict-free syncing (CRDT)
- Monaco Editor (the editor that powers VS Code)
- Live remote cursors and selections
- Online users list powered by Yjs awareness
- Simple join screen using a username

## Tech Stack

**Client**
- React
- Monaco Editor (`@monaco-editor/react`)
- Yjs, `y-monaco`, `y-socket.io`
- Tailwind CSS

**Server**
- Node.js and Express
- Socket.IO
- `y-socket.io` (Yjs sync server)

## How It Works

```
Monaco Editor <-> MonacoBinding <-> Y.Doc <-> SocketIOProvider <-> Socket.IO server
```

- `Y.Doc` holds the shared document.
- `MonacoBinding` keeps the editor and the shared text in sync.
- `SocketIOProvider` sends updates to the server, which relays them to other clients.
- Awareness shares temporary info such as usernames and cursors.

## Project Structure

```
.
├── client/ --Frontend     # React app
└── server/ --Backend   # Express + Socket.IO server
```

## You can Ignore the Docker File , as its only for creating an Image and then Deploy on server (can use AWS services ECR,ECS).
