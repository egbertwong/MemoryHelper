# Memory Helper
Ebbinghaus memory method helper

I need a todo list to make my daily review plan. But Mircosoft ToDo can only do planning, not repeat and statistics for the same task. So I wrote a todo application using the logic of M$ ToDo as a template to make my review plans.

**The functions are as follow:**

- Add type or subjects
- Add tasks with different types
- Add plans to review tasks
- Edit or delete types, tasks or plans
- Just show today's and expired plans
- Record the number of task review and overdue, record the review time and stage

**Features not yet supported:**

Time is tight, some non-urgent functions can only be realized in the future. So:

(现在用着好像还行，反正这个版本代码不大改了，明年再重构的时候再弄吧，老懒狗了)

- Multi-Language
- Any settings function
- Refactored to class structure

## Screenshots

![eba4b438c2894be3a24d19986451059](https://user-images.githubusercontent.com/16863417/91711910-570a6e80-ebb9-11ea-96dc-73aaf7c740a0.png)


## Install

This project uses node and npm. Go check them out if you don't have them locally installed.

```shell
# Install npm packages
npm install
```

## Usage

You can run or build release after install packages.

```shell
# Start project
npm start

# Using nodemon to watch any change of main.js.
# to restart at any time, enter `rs`
rs

# Generate release. Remember to close devTool in main.js
npm run dist
```

## License

[MIT](https://github.com/egbertwong/MemoryHelper/blob/master/LICENSE.md)