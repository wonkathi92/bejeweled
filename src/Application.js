import device;
import ui.ImageView as ImageView;
import ui.StackView as StackView;

import src.GameScene as GameScene;
import src.MenuScene as MenuScene;
import src.InstructionScene as InstructionScene;
import src.Utils as Utils;
import AudioManager;

var boundswidth = 576,
  boundsHeight = 1024,
  baseWith = boundswidth,
  baseHeight = device.screen.height * (boundswidth/device.screen.width),
  scale = device.screen.width/baseWith,
  rightBoundary = baseWith,
  leftBoundary = 0,
  vx = 0;


exports = Class(GC.Application, function () {

  this.initUI = function () {
    this.view.style.scale = scale;
    var gameScene = new GameScene(),
       menuScene = new MenuScene(),
       instructionScene = new InstructionScene();

    var rootView = new StackView({
      superview: this,
      // x: device.width / 2 - 160,
      // y: device.height / 2 - 240,
      x: 0,
      y: 0,
      width: baseWith,
      height: baseHeight,
      clip: true,
      scal: scale
    });

    // menuScene.on('menuscene:start-moveMode', function () {
    //   this.sound.play('mainGame');
    //   gameScene.mode = Utils.gameMode.CHANLENGE_MODE;
    //   gameScene.playGame();
    //   rootView.push(gameScene);
    //   gameScene.emit('app:start');
    // });

    // menuScene.on('menuscene:start-timerMode', function () {
    //    this.sound.play('mainGame');
    //   gameScene.mode = Utils.gameMode.TIMER_MODE;
    //    gameScene.playGame();
    //   rootView.push(gameScene);
    //   gameScene.emit('app:start');
    // });

    menuScene.on('menuscene:start-endlessMode', function () {
      sound.play('mainGame');
      gameScene.mode = Utils.gameMode.ENDLESS_MODE;
      gameScene.playGame();
      rootView.push(gameScene);
      gameScene.emit('app:start');
    });

     menuScene.on('menuscene:instruction', function () {
      rootView.push(instructionScene);
      instructionScene.emit('app:start');
    });

    instructionScene.on("instruction:end", function() {
        rootView.pop();
    });

    gameScene.on('gamescene:end', function () {
    sound.play('background');
      rootView.pop();
    });

    rootView.push(menuScene);


    var sound = new AudioManager({
      path: "resources/sounds/",
      files: {
        background: { path: 'music', volume: 1, background: true },
        mainGame: { path: 'music', volume: 1, background: true }
      }
    });
    sound.play('background');

  };

  this.launchUI = function () {

  };

});
