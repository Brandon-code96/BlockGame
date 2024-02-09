import { LiveCounter } from "../components/live-counter.js";
import { PhaseConstructor } from "./phases/phaseconstructor.js";

export class Game extends Phaser.Scene{
    constructor(){
        super({key: 'game'});
    }
    init(){
        this.phaseConstructor = new PhaseConstructor(this);
        this.score = 0;
        this.liveCounter = new LiveCounter(this, 3);
    }
    preload() {
        this.load.image('background', 'images/background.png');
        this.load.image('platform', 'images/platform.png');
        this.load.image('ball', 'images/ball.png');
        this.load.image('bluebrick', 'images/brickBlue.png');
        this.load.image('orangebrick', 'images/brickOrange.png');
        this.load.image('greenbrick', 'images/brickGreen.png');
        this.load.image('blackbrick', 'images/brickBlack.png');
        this.load.image('greybrick', 'images/brickGrey.png');
        this.load.image('yellowbrick', 'images/brickYellow.png');

        this.load.audio('platformimpactsample', 'sounds/sounds_platform-impact.ogg');
        this.load.audio('brickimpactsample', 'sounds/sounds_brick-impact.ogg');
        this.load.audio('gameoversample', 'sounds/sounds_gameover.ogg');
        this.load.audio('winsample', 'sounds/sounds_you_win.ogg');
        this.load.audio('startgamesample', 'sounds/sounds_start-game.ogg');
        this.load.audio('livelostsample', 'sounds/live-lost.ogg');
        this.load.audio('phaseChangeSample', 'sounds/phasechange.ogg')
        this.load.audio('fixedBrickImpactSample', 'sounds/fixed-brick-impact.ogg')

        this.load.spritesheet('bluediamond', 'images/blue_diamond-sprites.png', {frameWidth: 48, frameHeight: 48});
    }
    create(){
        this.add.image(410,250,'background');

        this.platform = this.physics.add.image(400,460,'platform').setImmovable();
        this.platform.body.allowGravity = false;
        this.platform.setCollideWorldBounds(true);

        this.ball = this.physics.add.image(385,430,'ball');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
        this.ball.setData('glue', true);

        this.physics.world.setBoundsCollision(true,true,true,false);

        this.physics.add.collider(this.ball, this.platform, this.platformImpact, null, this);

        this.scoreText = this.add.text(16, 16, 'PUNTOS:0',{
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

        /*this.bricks = this.physics.add.staticGroup({
            key:['bluebrick', 'orangebrick', 'greenbrick', 'blackbrick'],
            frameQuantity: 10,
            gridAlign: {
                width: 10,
                height: 4,
                cellWidth: 67,
                cellHeight: 34,
                x: 112,
                y: 100
            },
        }); */
        //this.physics.add.collider(this.ball, this.bricks, this.brickImpact, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.platformImpactSample = this.sound.add('platformimpactsample');
        this.brickImpactSample = this.sound.add('brickimpactsample');
        this.gameOverSample = this.sound.add('gameoversample');
        this.winSample = this.sound.add('winsample');
        this.startGameSample = this.sound.add('startgamesample');
        this.liveLostSample = this.sound.add('livelostsample');
        this.phaseChangeSample = this.sound.add('phaseChangeSample');
        this.fixedBrickImpactSample = this.sound.add('fixedBrickImpactSample')

        this.liveCounter.create();

        this.phaseConstructor.create();

        this.miSprite = this.add.sprite(40,40, 'bluediamond');
        this.miSprite.anims.play('bluediamondanimation');
        this.physics.add.collider(this.ball, this.miSprite);
        this.anims.create({
            key: 'bluediamondanimation',
            frames: this.anims.generateFrameNumbers('bluediamond', {start:0, end: 7}),
            frameRate: 10,
            repeat: -1,
            yoyo: true,
        });

        this.diamonds = this.relatedScene.physics.add.group();
        this.relatedScene.physics.add.collider(this.ball, this.diamonds, this.ballImpact, null, this);
        let diamond = this.diamonds.create(x, y, sprite);
        diamond.setScale(0.6);
        diamond.anims.play(sprite + 'animation');
        diamond.body.setAllowRotation();
        diamond.body.setAngularVelocity(100);
        diamond.body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        diamond.setBounce(1);
        diamond.setCollideWorldBounds(true);
    }

    platformImpact(){
        let relativeImpact = this.ball.x - this.platform.x;
        if(relativeImpact > 0 ){
            this.ball.setVelocityX(10 * relativeImpact);
        }else if(relativeImpact < 0 ){
            this.ball.setVelocityX(10 * relativeImpact);
        }else{
            this.ball.setVelocityX(Phaser.Math.Between(-10,10))
        }
        //agregamos audio
        this.platformImpactSample.play();
    }

    brickImpact(ball, brick){
        brick.disableBody(true, true);
        this.increasePoints(10);
        /*if (this.bricks.countActive()===0) {
            this.endGame(true);
            this.winSample.play();
        }*/
        if (this.phaseConstructor.isPhaseFinished()) {
            this.phaseChangeSample.play();
            this.phaseConstructor.nextLevel();
            this.setInitialPlatformState();
        }

        //agregamos audio
        this.brickImpactSample.play();
    }

    fixedBrickImpact(ball, brick){
        this.fixedBrickImpactSample.play();
    }

    increasePoints(points){
        this.score += points;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }

    endGame(completed = false){
        this.scene.pause();
        if (!completed) {
            this.gameOverSample.play();
            this.scene.start('gameover');
        }else {
            this.scene.start('congratulations');
        }
    }

    setInitialPlatformState(){
        this.liveLostSample.play();
        this.platform.x = 400;
        this.platform.y = 460;
        this.ball.setVelocity(0,0);
        this.ball.x = 385;
        this.ball.y = 430;
        this.ball.setData('glue', true);
    }

    update(){
        if(this.cursors.left.isDown){
            this.platform.setVelocityX(-500);
            if(this.ball.getData('glue')){
                this.ball.setVelocityX(-500)
            }
        }
        else if(this.cursors.right.isDown){
            this.platform.setVelocityX(500);
            if(this.ball.getData('glue')){
                this.ball.setVelocityX(500)
            }
        }
        else{
            this.platform.setVelocityX(0);
            if(this.ball.getData('glue')){
                this.ball.setVelocityX(0)
            }
        }

        if(this.ball.y > 500 && this.ball.active){
            //this.scene.pause();
            //this.bricks.setVisible(false);
            //this.endGame();
            //this.gameOverSample.play();
            let gameNotFinished = this.liveCounter.liveLost();
            if(gameNotFinished){
                this.setInitialPlatformState();
            }
        }

        if(this.cursors.up.isDown){
            if(this.ball.getData('glue')){
                this.startGameSample.play();
                this.ball.setVelocity(-60, -300);
                this.ball.setData('glue', false);
            }
        }
    }
}