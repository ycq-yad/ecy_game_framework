import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene23 extends LevelBase {
    className_key = "LevelScene23";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene23.json";
    }

    public icon_changjing: Laya.Image;
    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public initView() {
        super.initView();
        this.stopAni();
    }

    /**
    * 当从父节点移除时候
    */
    public onRemoved() {
        super.onRemoved();
        this.stopAni();
    }

    /**
     * 场景
     */
    private ani_changjing: Laya.Skeleton;
    /**
     * 狗
     */
    private ani_dog: Laya.Skeleton;

    public box_enb1: Laya.Box;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        //
        this.ani_changjing = await this.createSkeleton(this.mapData.changjing.url);
        this.ani_changjing.x = this.mapData.changjing.x;
        this.ani_changjing.y = this.mapData.changjing.y;
        this.box_enb.addChild(this.ani_changjing);
        this.ani_changjing.visible = false;

        this.ani_dog = await this.createSkeleton(this.mapData.dog.url);
        this.ani_dog.x = this.mapData.dog.x;
        this.ani_dog.y = this.mapData.dog.y;
        this.box_enb1.addChild(this.ani_dog);
        this.ani_dog.visible = false;

        //
        this.icon_changjing.visible = false;

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        this.box_game.x = (this.index) * 1080;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -(1700) }, 4300);
                Laya.Tween.to(this.box_player, { x: (1700) }, 4300);
                break;
            case "smove2":
                this.icon_changjing.visible = true;
                Laya.Tween.to(this.box_game, { x: -(2800) }, 4380);
                Laya.Tween.to(this.box_player, { x: (2800) }, 4380);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(4000) }, 4170);
                Laya.Tween.to(this.box_player, { x: (4000) }, 4170);
                break;
            case "sevent_22-x5_1":
                this.ani_changjing.visible = true;
                this.ani_changjing.play('22-x5', false);
                break;
            case "sevent_24-01_1":
                this.ani_dog.visible = true;
                this.ani_dog.play('24-01', true);
                break;
            case "sevent_24-02_1":
                this.ani_dog.visible = true;
                this.ani_dog.play('24-02', false);
                break;
            case "sevent_24-3_1"://人狗合一
                this.ani_dog.visible = true;
                this.ani_dog.play('24-3', false);
                //人和狗一起移动
                Laya.Tween.to(this.box_player, { x: (4800) }, 4000);
                Laya.Tween.to(this.ani_dog, { x: (this.ani_dog.x + 800) }, 4000);
                break;
        }
    }

    /**游戏逻辑控制 */
    public startGame() {
        this.clearData();
        super.startGame();
        this.initPlayer();
    }

    /**停止游戏 */
    public stopGame() { }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
            if (this.index == 0) {
                this.box_player.x = this.box_game.x = 0;
            } else if (this.index == 1) {
                this.box_game.x = -2800;
                this.box_player.x = 2800;
            } else if (this.index == 2) {
                this.box_game.x = -2800;
                this.box_player.x = 2800;
                Laya.timer.once(100, this, () => {
                    Laya.Tween.to(this.box_game, { x: -(4000) }, 4170);
                    Laya.Tween.to(this.box_player, { x: (4000) }, 4170);
                    this.playAni("23-11", () => {
                        this.onPlayOnce();
                    });
                });
                this.ani_dog.play("24-01", true);
            }
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
        //Laya.Tween.clearAll(this.box_game_up);
    }

}