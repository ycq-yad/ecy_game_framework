import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene27 extends LevelBase {
    className_key = "LevelScene27";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene27.json";
    }

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

    public changjing: Laya.Skeleton;
    public keng: Laya.Skeleton;
    public zhiwu: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        this.keng = await this.createSkeleton(this.mapData.keng.url);
        this.keng.x = this.mapData.keng.x;
        this.keng.y = this.mapData.keng.y;
        this.box_enb.addChild(this.keng);
        // this.keng.visible = false;

        this.changjing = await this.createSkeleton(this.mapData.changjing.url);
        this.changjing.x = this.mapData.changjing.x;
        this.changjing.y = this.mapData.changjing.y;
        this.box_enb.addChild(this.changjing);
        // this.changjing.visible = false;

        this.zhiwu = await this.createSkeleton(this.mapData.zhiwu.url);
        this.zhiwu.scale(0.7, 0.7);
        this.zhiwu.x = this.mapData.zhiwu.x;
        this.zhiwu.y = this.mapData.zhiwu.y;
        this.box_enb.addChild(this.zhiwu);
        // this.zhiwu.visible = false;

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
                Laya.Tween.to(this.box_game, { x: -(2130) }, 3380);
                Laya.Tween.to(this.box_player, { x: (2130) }, 3380);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(3200) }, 5500);
                Laya.Tween.to(this.box_player, { x: (3400) }, 5500);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(4250) }, 2780);
                Laya.Tween.to(this.box_player, { x: (4200) }, 2780);
                break;
            case "pmove":
                // Laya.Tween.to(this.box_game, { x: -(4300) }, 2750);
                Laya.Tween.to(this.box_player, { x: (5300) }, 5590);
                break;
            case "pmove1":
                // Laya.Tween.to(this.box_game, { x: -(4300) }, 2750);
                Laya.Tween.to(this.box_player, { x: (3750) }, 2830);
                break;
            case "sevent_zhiwu1_1":
                this.zhiwu.visible = true;
                this.zhiwu.play("zhiwu1", false);
                break;
            case "sevent_zhiwu2_1":
                this.zhiwu.play("zhiwu2", true);
                break;
            case "sevent_zhiwu3_1":
                this.zhiwu.play("zhiwu3", true);
                break;
            case "sevent_changjing_1":
                this.changjing.visible = true
                this.changjing.play("changjing", true);
                break;
            case "sevent_keng1_1":
                this.keng.visible = true
                this.keng.play("keng1", true);
                break;
            case "sevent_keng2_1":
                this.keng.visible = true
                this.keng.play("keng2", false);
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

                this.box_game.x = -3200;
                this.box_player.x = 3400;
                // this.tianpin.visible = true;
                // this.men.visible = true;

            } else if (this.index == 2) {
                this.box_game.x = -4250;
                this.box_player.x = 4200;
                // Laya.timer.once(100, this, () => {
                //     Laya.Tween.to(this.box_game, { x: -(4000) }, 4170);
                //     Laya.Tween.to(this.box_player, { x: (4000) }, 4170);
                //     this.playAni("23-11", () => {
                //         this.onPlayOnce();
                //     });
                // })
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