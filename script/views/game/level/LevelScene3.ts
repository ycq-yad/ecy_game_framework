import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

/**
 * 第3关
 */
export class LevelScene3 extends LevelBase {
    className_key = "LevelScene3";

    public constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene3.json";
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
        } else {
            //this.destroyAni();
            super.restartGame();
            // this.initPlayer();
            this.box_player.x = ((this.index) * 1080);
            this.box_game.x = ((this.index) * (-1080));
            //场景移动
            this.onStart();
        }
    }

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        let ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        ani_bg.x = ani_bg.width / 2 + 450;
        ani_bg.y = ani_bg.height / 2 + 250;
        ani_bg.play(0, true);
        this.box_enb.addChild(ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();

    }

    public onPlayLabel(evt: { audioValue: string, floatValue: number, intValue: number, name: string, stringValue: number, time: number }) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
    }

    public addEvent() { }

    public removeEvent() { }

    public removeSelf() {
        // GameManager.instance.showTopBar(ShowType.showAll)
        return super.removeSelf();
    }

    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
    }
}