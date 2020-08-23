import { LevelBase } from "./LevelBase";
import { PopChooseScene } from "../PopChooseScene";
import GameStateManager from "../../../games/GameStateManager";
import { EnterGameType } from "../../../games/CommonDefine";
import ViewChangeManager from "../../../games/ViewChangeManager";

/**
 * 第一关
 */
export class LevelScene1 extends LevelBase {
    className_key = "LevelScene1";

    public constructor(data_) {
        super(data_);
        this.skin = 'game/level/LevelScene1.json';// + this.mapData.skin;
    }

    public icon_bg: Laya.Image;
    public onAddStage() {
        super.onAddStage();
    }

    /**游戏逻辑控制 */
    public startGame() {
        super.startGame();
        this.initPlayer();
    }

    /**停止游戏 */
    public stopGame() { }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            super.initView();
            super.startGame();
            this.initPlayer();
            console.log("restart level1!", bReStartAll)
        } else {
            //this.destroyAni();
            super.restartGame();
            // this.initPlayer();
            this.box_player.x = ((this.index) * 1080);
            this.box_game.x = ((this.index) * (-1080));
            console.log("restart level1!", bReStartAll);
            //场景移动
            this.onStart();
        }
    }

    /**初始化玩家 */
    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        let ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        ani_bg.x = ani_bg.width / 2;
        ani_bg.y = ani_bg.height / 2;
        ani_bg.play(0, true);
        this.icon_bg.addChild(ani_bg);
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public addEvent() {}

    public removeEvent() {}

    public removeSelf() {
        return super.removeSelf();
    }
    
    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        super.clearData();
        this.removeEvent();
        this.icon_bg.removeChildren();
        console.log("level 1 on Removed!")
    }
}