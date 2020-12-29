import Tetris from "./index";

const el = document.getElementById("tetris");

new Tetris(el, (data) => {
    console.log(data);
});
