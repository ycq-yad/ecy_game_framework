import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene29 extends LevelBase {
    className_key = "LevelScene29";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene29.json";
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

    public dengshen: Laya.Skeleton;
    public shixiang: Laya.Skeleton;
    public daoju: Laya.Skeleton;
    public shandian: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.dengshen = await this.createSkeleton(this.mapData.dengshen.url);
        this.dengshen.x = this.mapData.dengshen.x;
        this.dengshen.y = this.mapData.dengshen.y;
        this.box_enb.addChild(this.dengshen);
        this.dengshen.visible = false;

        this.shixiang = await this.createSkeleton(this.mapData.daoju1.url);
        this.shixiang.x = this.mapData.daoju1.x;
        this.shixiang.y = this.mapData.daoju1.y;
        this.box_enb.addChild(this.shixiang);
        this.shixiang.visible = false;

        this.daoju = await this.createSkeleton(this.mapData.daoju.url);
        this.daoju.x = this.mapData.daoju.x;
        this.daoju.y = this.mapData.daoju.y;
        this.box_enb.addChild(this.daoju);
        this.daoju.visible = false;

        // this.shandian = await this.createSkeleton(this.mapData.shandian.url);
        // this.shandian.x = this.mapData.shandian.x;
        // this.shandian.y = this.mapData.shandian.y;
        // this.box_enb.addChild(this.shandian);
        //this.shandian.visible = false;

       // this.ani_player = await this.createSkeleton(this.mapData.player.url);

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

    /**
  * 播放动画
  */
    public playAni(aniName: any, callBack: Function, isLoop = false) {
        //console.log("aniName>>>>>>>>>>>>", aniName, "curtime = ", GameLogicProcessingManager.GetCurTime());
        this.localAniName = aniName;
        if (this.ani_player != null) {
            // this.ani_player.player.stop() ;
            this.ani_player.visible = true;
            if (callBack) {
                this.ani_player.player.off(Laya.Event.STOPPED, this, this.onComplete)
                this.ani_player.player.once(Laya.Event.STOPPED, this, this.onComplete, [aniName, callBack])
            }
            if (aniName == '29-2') {
                Laya.timer.once(20, this, () => {
                    this.ani_player.play(aniName, isLoop);
                })
            } else {
                this.ani_player.play(aniName, isLoop);
            }

            // if (aniName == "29-7") {
            //     this.shandian.play("29_3",false);
            //     this.shandian.visible = true;
            // }

        } else {
            callBack && callBack(aniName)

        }
    }

    public isLoop = false;
    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -(1450) }, 3000);
                Laya.Tween.to(this.box_player, { x: (1450) }, 3000);
                break;

            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(4000) }, 5000);
                Laya.Tween.to(this.box_player, { x: (3880) }, 5000);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(6300) }, 5000);
                Laya.Tween.to(this.box_player, { x: (6300) }, 5000);
                break;

            case "sevent_chuxian_1":
                this.dengshen.visible = true;

                // console.log("chuxian");
                this.dengshen.play("chuxian", false);
                break;

            case "sevent_shifaxiaoshi_1":
                this.dengshen.visible = true;
                this.dengshen.play("shifaxiaoshi", false);
                break;
            case "sevent_daiji_1":
                if (this.isLoop) { return }
                this.isLoop = true;
                this.dengshen.visible = true;
                this.dengshen.play("daiji", true);
                break;
            case "sevent_29_1_1x":
                this.daoju.visible = true;
                this.daoju.play("29-1x", false);
                break;
            case "sevent_29-2_1x":
                this.daoju.visible = true;
                this.daoju.play("29-2x", false);
                break;
            case "sevent_29-5x_1":
                this.shixiang.visible = true;
                this.shixiang.play("29-5x", false);
                break;
            case "sevent_29-4x_1":
                this.shixiang.visible = true;
                this.shixiang.play("29-4x", false);
                break;
            case "sevent_29-3x_1":
                this.shixiang.visible = true;
                this.shixiang.play("29-3x", false);
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
                this.daoju.visible = false;
                this.dengshen.visible = false;
                this.isLoop = false;
                this.box_player.x = this.box_game.x = 0;
            } else if (this.index == 1) {

                this.box_game.x = -4000;
                this.box_player.x = 3880;
                this.shixiang.play("29-5x", false);
                // this.tianpin.visible = true;
                // this.men.visible = true;
                this.dengshen.play("daiji", true);
            } else if (this.index == 2) {
                this.box_game.x = -6300;
                this.box_player.x = 6300;
                // this.dengshen.play("daiji", true);

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