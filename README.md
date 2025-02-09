# VUT TASKER

Self-hostable TODO list, with _shared_ tasks and more simple school responsibilites management. It is themed in a VUT FIT style.

## How it works?

Tasks are defined under (school) subjects, which identified mainly by 3 to 4 letters and number(s). Each task has specific type (Homework, Exam, Project, Registration, ...). Every task is shared between users (if it is not _personal task_), so only one needs to create it (this way it is less probable that some forgets something).

To show tasks on a HomePage (MainPage), you need to subscribe to the subject(s), you want to see and track. The tasks will be shown there, until they are not completed (completed tasks before due_date are still shown - it is handy for project, where you can still re-submit you work)

There are also dots next to tasks. They say, who have already done this task.

### Sanity Bar

On HomePage, there is SanityBar in a upper-right corner. It shows, how much of (uncompleted) upcoming tasks there is. There are max 10 points. Each uncompleted task, that is due in 14 days (technically 15) adds number depending on its type:

- Exam: +2
- Project: +1.5
- Homework: +1
- Registration: +0.5

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
