import {Game} from './scenes/game.js';
import {GameOver} from './scenes/gameover.js';
import {Congratulations} from './scenes/congratulations.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    scene: [Game, GameOver, Congratulations],
    physics: {
        default: 'arcade',
        arcade:{
            // gravity: {y:400},
            debug: false
        }
    }
}

var game = new Phaser.Game(config);