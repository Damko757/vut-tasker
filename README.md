# VUT TASKER

This project is for subject-based TODOs, where every user has his/her own instance of tasks. It is meant for a close group of friends with the same (but very own) responsibilities, so they can track what everyone had already done and what they should do :)

# Development

Project is seperated into two sub-project: [Web]("#dev-web") and [Server/Api](#dev-api). You can clone this project and then enter it:

```bash
git clone https://github.com/Damko757/vut-tasker.git
cd vut-tasker
```

You can run all development severs from root folder with `bun run all` or choose specifically `bun run web|server` (assuming you have [Bun installed](https://bun.sh/docs/installation))

<a id="dev-web"></a>

## Web

### Initialization

To install web modules (dependencies), enter web directory and run `bun i`:

```bash
cd web
bun i
```

### Web-Dev server

To run **Vite Dev Server**, you can run (in /web dir):

```bash
bun run dev
```

> Vite Development Server port is 5000 (http://localhost:5000)

<a id="dev-api"></a>

## API

### Initialization

To install web (server) modules (dependencies), enter server directory and run `bun i`:

```bash
cd server
bun i
```

### Bun-Dev server

To run **Bun Dev Server**, you can run (in /server dir):

```bash
bun run hot
```

> Bun Development Server port is 3000 (http://localhost:3000)

# Building and running in production

To build this project, you need to build web to a bundles and then mount the whole project to Docker

1. Building Server (/dist will be created):

```bash
bun build src/index.ts
```

2. Starting docker

The server sub-project needs to be built from a Dockerfile. The most simple way to run Web&Server is:

```build
sudo docker compose up --build
```

> Note: The WEB and API ports are defined in _.env_ file
