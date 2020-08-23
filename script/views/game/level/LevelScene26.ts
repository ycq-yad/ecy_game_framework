import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene26 extends LevelBase {
    className_key = "LevelScene26";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene26.json";
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

    public huoba: Laya.Skeleton;
    public jianci: Laya.Skeleton;
    public men: Laya.Skeleton;
    public munaiyi: Laya.Skeleton;
    public shitou: Laya.Skeleton;
    public tianpin: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.huoba = await this.createSkeleton(this.mapData.huoba.url);
        this.huoba.x = this.mapData.huoba.x;
        this.huoba.y = this.mapData.huoba.y;
        this.box_enb.addChild(this.huoba);
        // this.huoba.visible = false;

        this.jianci = await this.createSkeleton(this.mapData.jianci.url);
        this.jianci.x = this.mapData.jianci.x;
        this.jianci.y = this.mapData.jianci.y;
        this.box_enb.addChild(this.jianci);
        this.jianci.visible = false;

        this.men = await this.createSkeleton(this.mapData.men.url);
        this.men.x = this.mapData.men.x;
        this.men.y = this.mapData.men.y;
        this.box_enb.addChild(this.men);
        this.men.visible = false;

        this.munaiyi = await this.createSkeleton(this.mapData.munaiyi.url);
        this.munaiyi.x = this.mapData.munaiyi.x;
        this.munaiyi.y = this.mapData.munaiyi.y;
        this.box_enb.addChild(this.munaiyi);
        this.munaiyi.visible = false;

        this.shitou = await this.createSkeleton(this.mapData.shitou.url);
        this.shitou.x = this.mapData.shitou.x;
        this.shitou.y = this.mapData.shitou.y;
        this.box_enb.addChild(this.shitou);
        this.shitou.visible = false;

        this.tianpin = await this.createSkeleton(this.mapData.tianpin.url);
        this.tianpin.x = this.mapData.tianpin.x;
        this.tianpin.y = this.mapData.tianpin.y;
        this.box_enb.addChild(this.tianpin);
        this.tianpin.visible = false;

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
                Laya.Tween.to(this.box_game, { x: -(800) }, 3380);
                Laya.Tween.to(this.box_player, { x: (800) }, 3380);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(2000) }, 4000);
                Laya.Tween.to(this.box_player, { x: (2400) }, 5200);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(3000) }, 2750);
                Laya.Tween.to(this.box_player, { x: (3000) }, 2750);
                break;
            case "smove4":
                Laya.Tween.to(this.box_game, { x: -(4000) }, 5460);
                Laya.Tween.to(this.box_player, { x: (4200) }, 5460);
                break;
            case "sevent_huo2_1":
                this.huoba.play("huo2", true)

                break;
            case "sevent_jianci2_1":
                this.jianci.visible = true;
                this.jianci.play("jianci2", true)
                break;
            case "sevent_jianci1_1":
                this.jianci.visible = true;
                this.jianci.play("jianci1", false)
                break;
            case "sevent_huo1_1"://
                this.huoba.play("huo1", false)
                break;
            case "sevent_men2_1"://
                this.men.visible = true;
                this.men.play("men2", false)
                break;
            case "sevent_men3_1"://
                this.men.visible = true;
                this.men.play("men3", false)
                break;
            case "sevent_tianping1_1"://
                this.tianpin.visible = true;
                this.tianpin.play("tianping1", false)
                break;
            case "sevent_tianping2_1"://
                this.tianpin.visible = true;
                this.tianpin.play("tianping2", false)
                break;
            case "sevent_munaiyi3_1"://
                this.munaiyi.visible = true;
                this.munaiyi.play("munaiyi3", true)
                break;
            case "sevent_munaiyi1_1"://
                this.munaiyi.visible = true;
                this.munaiyi.play("munaiyi1", false)
                break;
            case "sevent_munaiyi2_1"://
                this.munaiyi.visible = true;
                this.munaiyi.play("munaiyi2", false)
                break;
            case "sevent_26-15_1"://
                this.shitou.visible = true;
                this.shitou.play("26-15", true)
                break;
            case "sevent_26-14_1"://
                this.shitou.visible = true;
                this.shitou.play("26-14", false)
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
                this.box_game.x = -2000;
                this.box_player.x = 2400;
                // this.tianpin.visible = true;
                // this.men.visible = true;
            } else if (this.index == 2) {
                this.box_game.x = -3000;
                this.box_player.x = 3000;
                this.munaiyi.play("munaiyi3", true);
                // Laya.timer.once(100, this, () => {
                //     Laya.Tween.to(this.box_game, { x: -(4000) }, 4170);
                //     Laya.Tween.to(this.box_player, { x: (4000) }, 4170);
                //     this.playAni("23-11", () => {
                //         this.onPlayOnce();
                //     });
                // })
            } else if (this.index == 3) {
                this.box_game.x = -4000;
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