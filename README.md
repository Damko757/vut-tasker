# VUT TASKER

This is production version of **[vut-tasker](https://github.com/Damko757/vut-tasker)**

Self-hostable TODO list, with _shared_ tasks and more simple school responsibilites management. It is themed in a VUT FIT style.

## How it works?

Tasks are defined under (school) subjects, which identified mainly by 3 to 4 letters and number(s). Each task has specific type (Homework, Exam, Project, Registration, ...). Every task is shared between users (if it is not _personal task_), so only one needs to create it (this way it is less probable that some forgets something).

To show tasks on a HomePage (MainPage), you need to subscribe to the subject(s), you want to see and track. The tasks will be shown there, until they are not completed (completed tasks before due_date are still shown - it is handy for project, where you can still re-submit you work)

There are also dots next to tasks. They say, who have already done this task.

### Sanity Bar

On HomePage, there is SanityBar in a upper-right corner. It show, how much of (uncompleted) upcoming tasks there is. There are max 10 points. Each uncompleted task adds number depending on its type:

- Exam: +2
- Project: +1.5
- Homework: +1
- Registration: +0.5

Every development change should be created at **vut-tasker**, and then merged here.

> To add vut-tasker as another remote, type: `git remote add dev https://github.com/Damko757/vut-tasker`
> Current branch can be merged with `dev/main`

## Running

In `./build` are 4. shell scripts (currently), that will run/build/start specified subproject to docker container:

1. Bun (bun-run.sh)
2. Mongo (mongo-run.sh)
3. Web (web-run.sh)
4. All (run.sh)
