import {Game} from './scenes/game.js';
import {GameOver} from './scenes/gameover.js';
import {Congratulations} from './scenes/congratulations.js';
import { Loader } from './scenes/loader.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    scene: [Loader, Game, GameOver, Congratulations],
    physics: {
        default: 'arcade',
        arcade:{
            // gravity: {y:400},
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

var game = new Phaser.Game(config);