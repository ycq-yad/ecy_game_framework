import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene15 extends LevelBase {
    className_key = "LevelScene15";

    public box_enb1: Laya.Box;

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene15.json";
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

    public bg1: Laya.Skeleton;
    public bg2: Laya.Skeleton;
    public bg3: Laya.Skeleton;
    public xiaotou: Laya.Skeleton;

    public async initPlayer() {
        //
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.bg1 = await this.createSkeleton(this.mapData.bg.ani.url);
        //skG.x = this.mapData.bg.ani.x; skG.y = this.mapData.bg.ani.y;
        this.bg1.x = 1456 + this.bg1.width + 52;
        this.bg1.y = this.bg1.height + 200;
        this.bg1.play('15-cj0', true);
        this.box_enb.addChild(this.bg1);

        this.bg2 = await this.createSkeleton(this.mapData.bg.ani.url);
        //skG.x = this.mapData.bg.ani.x; skG.y = this.mapData.bg.ani.y;
        this.bg2.x = 2898 + this.bg2.width / 2 + 52;
        this.bg2.y = this.bg2.height + 200;
        // this.bg3.play(0, true);
        this.bg2.play('15-cj0', true);

        this.box_enb.addChild(this.bg2);

        this.xiaotou = await this.createSkeleton(this.mapData.z.url);
        // this.skZ.x = this.mapData.xt.x;
        // this.skZ.y = this.mapData.xt.y;
        this.xiaotou.x = 2200;
        this.xiaotou.y = this.xiaotou.height + this.xiaotou.height / 3;
        this.box_enb.addChild(this.xiaotou);


        this.bg3 = await this.createSkeleton(this.mapData.bg.ani.url);
        //skG.x = this.mapData.bg.ani.x; skG.y = this.mapData.bg.ani.y;
        this.bg3.x = 2898 + this.bg2.width / 2 + 52;
        this.bg3.y = this.bg2.height + 200;
        this.bg3.y = this.bg3.height + 200;

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        // this.box_game_up.x = 
        this.box_game.x = (this.index) * 1080;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1500 }, 3750);
                Laya.Tween.to(this.box_player, { x: 1500 }, 3750);
                break;
            case "sevent_15-1_1":
                this.xiaotou.play("15-1", true);
                break;
            case "sevent_15-3_1":
                this.xiaotou.play("15-3", false);
                break;
            case "sevent_15-4_1":
                this.xiaotou.play("15-4", false);
                break;
            case "sevent_15-5_1":
                this.xiaotou.play("15-5", false);
                break;
            case "sevent_15-6_1":
                this.xiaotou.play("15-6", false);
                break;
            case "sevent_15-7_1":
                this.xiaotou.play("15-7", false);
                break;
            case "sevent_15-8_1":
                this.xiaotou.play("15-8", false);
                break;
            case "sevent_15-9_1":
                this.xiaotou.play("15-9", false);
                break;
            case "sevent_15-10_1":
                this.xiaotou.play("15-10", false);
                break;
            case "sevent_15-cj1_1":
                this.bg1.play("15-cj1", false);
                break;
            case "sevent_15-cj2_1":
                this.bg2.play("15-cj2", false);
                break;
            case "sevent_15-cj4_1":
                this.bg2.play("15-cj4", false);
                break;
            case "sevent_15-cj3_1":
                this.bg3.play("15-cj3", false);
                break;
            case "ssmove":
                Laya.Tween.to(this.box_game, { x: -(2550) }, 2700);
                Laya.Tween.to(this.xiaotou, { x: 2200 + (1000) }, 2700);
                // 6.13-3.75
                break;
            case "ssmove2":
                Laya.Tween.to(this.box_game, { x: -(3550) }, 1800);
                Laya.Tween.to(this.xiaotou, { x: 2200 + (2000) }, 1800);
                // 6.13-3.75
                break;
            case "ssmove3":
                Laya.Tween.to(this.box_game, { x: -(4400) }, 2700);
                Laya.Tween.to(this.xiaotou, { x: 2200 + (4000) }, 2700);
                // 6.13-3.75
                break;
            case "smove2":
                Laya.Tween.to(this.box_player, { x: (2550) }, 2200);
                break;
            case "smove3":
                // Laya.Tween.to(this.box_game, { x: -(3400) }, 2120);
                Laya.Tween.to(this.box_player, { x: (3550) }, 2120);
                this.box_enb1.addChild(this.bg3);
                break;
            case "smove4":
                // Laya.Tween.to(this.box_game, { x: -(4500) }, 3290);
                Laya.Tween.to(this.box_player, { x: (5700) }, 3290);
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
            this.bg1.play('15-cj0', true);
            // this.bg2.play('15-cj0', true);
            this.bg3.play('15-cj0', true);
            this.bg3.removeSelf();
            if (this.index == 0) {
                this.box_player.x = this.box_game.x = 0;
                this.xiaotou.x = 2200;
            } else if (this.index == 1) {
                // this.bg2.play('15-cj4', false);
                this.bg2.paused();
                this.xiaotou.x = 3200;
                this.box_player.x = 2550
                this.box_game.x = -2550;
                // this.box_game_up.x = this.box_game.x = -1775;
            } else if (this.index == 2) {
                this.xiaotou.x = 4200;
                this.box_player.x = 3550
                this.box_game.x = -3550;
                this.box_enb.addChild(this.bg3);
                // this.box_game_up.x = this.box_game.x = -2824;
                //
                //this.xt.play("13-z8-2", false);
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