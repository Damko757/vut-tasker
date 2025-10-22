# VUT TASKER

This is production version of **[vut-tasker](https://github.com/Damko757/vut-tasker)**

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
- Other: 0.25

Every development change should be created at **vut-tasker**, and then merged here.

> To add vut-tasker as another remote, type: `git remote add dev https://github.com/Damko757/vut-tasker`
> Current branch can be merged with `dev/main`

## Running

In `./build` are 4. shell scripts (currently), that will run/build/start specified subproject to docker container:

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

You also need to run at least Mongo Database to store tasks. Simply run:
```bash
sudo docker compose up -d mongodb 
```

# Building and running in production

To run in production, just use provided docker-compose.yml file, that will automatically build `api` and `web` image 

```bash
sudo docker compose up -d --build --force-recreate
```

> Note: The WEB and API ports are defined in _.env_ file
