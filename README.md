# tetris-ts

[![NPM version](https://badge.fury.io/js/badge-list.svg)](https://npmjs.org/tetris-ts)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

A simple Tetris clone written in plain Typescript.

![](screenshot.gif)

## Installation

#### Yarn

```bash
yarn add tetris-ts
```

#### NPM

```bash
npm install tetris-ts --save
```

## Usage

```javascript
// ES6 Import
import Tetris from "tetris-ts";

// CommonJS Require
const Tetris = require("tetris-ts");
```

The library takes 2 parameters in the constructor

-   DOM Element to attach to
-   Callback function invoked when a game finishes

_Important: The width of the DOM element determines the size of the game._

```HTML
<div id="tetris" style="width: 275px;">
```

```javascript
const el = document.getElementById("tetris");

const callback = function(data) {
    // Do something with the data returned from the game
};

const tetris = new Tetris(el, callback);
```

Data is returned as an object with the following properties:
| Property | Data Type | Description |
| -------- | :-------: | --------------------- |
| points | Number | Total points earned |
| lines | Number | Total lines cleared |
| level | Number | Highest level achieved|

## About

I had two primary goals when writing this library. The first was to learn Typescript. Tutorials are great, but I wanted to go through the process of what its really like to develop a project in the language - the syntax, the semantics, and the tooling. The second goal was to write without using any dependencies in the code itself. No lodash, no jQuery; just pure Typescript.

That being said - this is by no means a 100% accurate clone of Tetris. I kept as much of the essence of the game as I could without making the project overly complicated.

This will be my first project in Typescript, as well as my first package published to NPM, so by all means, r/RoastMe.
