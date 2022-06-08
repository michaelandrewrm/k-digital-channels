# **Getting Started**

::: warning Compatible note
This project requires **Node v12.4.0+**
:::

# **Installation**

::: warning
To clone the repository you have to be connected to the given VPN
:::

## **Cloning Vuesoma Project**

The entire project is located in a repository on the following url: [http://172.16.5.142:3010/Caminos/vuesoma](http://172.16.5.142:3010/Caminos/vuesoma) so we just need to clone it.

```bash
$ git clone http://172.16.5.142:3010/Caminos/vuesoma.git
```

<br/>

## **Installing Dependencies**

::: tip Tips
Make sure to have a compatible command prompt to run git bash commands :scream:
<br/>
We recommend to use git bash, you can download it [here](https://git-scm.com/downloads)
:::

After a successfully cloning, access to the vuesoma folder using `cd vuesoma` and install the dependencies with your prefer node package manager

<br/>

```bash
$ npm run install
```

or

```bash
$ yarn install
```

<br/>

**Yarn** is a package manager for your code. It allows you to use and share code with other developers from around the world. Yarn does this quickly, securely, and reliably so you don’t ever have to worry.

Yarn allows you to use other developers’ solutions to different problems, making it easier for you to develop your software. If you have problems, you can report issues or contribute back, and when the problem is fixed, you can use Yarn to keep it all up to date.

Code is shared through something called a package (sometimes referred to as a module). A package contains all the code being shared as well as a package.json file which describes the package [info+](https://yarnpkg.com)

<br/>

## **Project Scripts**

### **Command line interface**

Use `start` to select a project to serve.

```bash
$ npm start
```

or

```bash
$ yarn start
```

### **Build a project**

Use `build:<project-name>` or use the command line interface.

```bash
$ npm build:<project-name>
```

or

```bash
$ yarn build:<project-name>
```

### **Check the project files**

Use `lint` for checking the files syntax.

```bash
$ npm lint
```

or

```bash
$ yarn lint
```

### **Run the tests**

Use `test:unit` for running all the tests.

```bash
$ npm test:unit
```

or

```bash
$ yarn test:unit
```
