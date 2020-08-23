import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene16 extends LevelBase {
    className_key = "LevelScene16";


    public nIndexTemp: number; //动画移动的基数
    public nAddTemp: number;    //修正的参数
    public nForend: number;

    public box_game_up: Laya.Box;
    public box_game_1: Laya.Box;
    public box_game_up_1: Laya.Box;

    public xtBox: Laya.Box;
    // public bgM_box: Laya.Box;

    constructor(data_) {
        super(data_);
        this.nIndexTemp = 0;
        this.nAddTemp = -490;
        this.nForend = 540;
        this.skin = "game/level/LevelScene16.json";
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

    private xt: Laya.Skeleton;

    private speed_ = 3;//速度

    public get speed() {
        return this.speed_;
    }

    public set speed(s) {
        this.speed_ = s;
        this.resetMoveBg();
    }

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        //
        this.xt = await this.createSkeleton(this.mapData.xt.url);
        this.xt.x = this.mapData.xt.x;
        this.xt.y = this.mapData.xt.y;
        this.xtBox.addChild(this.xt);
        //
        this.kengImg = new Laya.Image();
        this.kengImg.y = 1123;
        this.kengImg.skin = "resource/assets/img/level/16/bg16_hole.png";

        //
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        this.box_game_up.x = this.box_game.x = this.box_game_up_1.x = this.box_game_1.x = 0;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
        this.resetMoveBg();
    }

    private kengImg: Laya.Image;

    public callBack(right: boolean, aniName: string) {
        super.callBack(right, aniName);
        //
        if (aniName == "16-6") {
            this.speed = 3;
            this.addChildAt(this.kengImg, 2);
            this.kengImg.x = 1500;
            Laya.Tween.to(this.kengImg, { x: -1000 }, (1500 + 1000) / 8 / 60 * 1000);
        } else if (aniName == "16-7") {
            this.speed = 3;
            this.addChildAt(this.kengImg, 2);
            this.kengImg.x = 1000;
            Laya.Tween.to(this.kengImg, { x: -1000 }, 11111 / (8 / 3));
        }
        console.log("level 16 callBack!");
    }

    private resetMoveBg(): void {
        this.moveSomeBg(this.box_game);
        this.moveSomeBg(this.box_game_up);
        this.moveSomeBg(this.box_game_1);
        this.moveSomeBg(this.box_game_up_1);
    }

    /**
     * 循环一个背景
     * @param boxBG 
     */
    private moveSomeBg(boxBG: Laya.Box): void {
        Laya.Tween.clearAll(boxBG);
        let toX = -9486;
        let time = 52700;
        if (boxBG.x == toX) {
            boxBG.x = 0;
        } else if (boxBG.x != 0) {
            time = (boxBG.x - toX) / this.speed_ / 60 * 1000;
        }
        Laya.Tween.to(boxBG, { x: toX }, time, null, Laya.Handler.create(this, this.moveSomeBg, [boxBG]));
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "sevent_16-z1_1":
                this.xt.play("16-z1", false);
                break
            case "sevent_16-z2_1":
                this.xt.play("16-z2", false);
                break
            case "sevent_16-z3_1":
                this.xt.play("16-z3", false);
                break
            case "sevent_16-z4_1":
                this.xt.play("16-z4", false);
                break
            case "sevent_16-z5_1":
                this.xt.play("16-z5", false);
                break
            case "sevent_16-z6_1":
                this.xt.play("16-z6", false);
                //\
                this.speed = 8;
                Laya.timer.clearAll(this);
                Laya.timer.once(3000, this, () => {
                    this.speed = 3;
                });
                break
            case "sevent_16-z7_1":
                this.xt.play("16-z7", false);
                break
            case "sevent_16-z8_1":
                this.xt.play("16-z8", false);
                break
            case "sevent_16-z9_1":
                this.xt.play("16-z9", false);
                break
            case "sevent_16-z10_1":
                this.xt.play("16-z10", false);
                break
            //移动场景
            case "smove":
                // Laya.Tween.to(this.box_game, { x: -1192 }, 1790);
                // Laya.Tween.to(this.box_game_up, { x: -1192 }, 1790);
                // Laya.Tween.to(this.xt, { x: -1192 }, 1790, null, Laya.Handler.create(this, () => {//1790表示 播放动画时间与开始移动事件的差ms
                //     this.xt.x = 0;
                // }));
                this.speed = 8;
                Laya.timer.clearAll(this);
                Laya.timer.once(5000, this, () => {
                    this.speed = 3;
                });
                break
            case "smove1":
                // Laya.Tween.to(this.box_game, { x: -1775 }, 2000);
                // Laya.Tween.to(this.box_game_up, { x: -1775 }, 2000);
                // Laya.Tween.to(this.xt, { x: - 500 }, 1000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                //     Laya.Tween.to(this.xt, { x: 0 }, 1000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                //         this.xt.x = 0;
                //     }));
                // }));
                this.speed = 8;
                Laya.timer.clearAll(this);
                Laya.timer.once(6000, this, () => {
                    this.speed = 3;
                });
                break
            case "smove2":
                // Laya.Tween.to(this.box_game, { x: -2824 }, 3620);
                // Laya.Tween.to(this.box_game_up, { x: -2824 }, 3620);
                // Laya.Tween.to(this.xt, { x: - 1000 }, 3000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                //     this.xt.x = 0;
                //     this.xt.play("13-z8-2", false);
                // }));

                break
            case "smove3":
                // Laya.Tween.to(this.box_game, { x: -2824 }, 3620);
                // Laya.Tween.to(this.box_game_up, { x: -2824 }, 3620);
                // Laya.Tween.to(this.xt, { x: - 1000 }, 3000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                //     this.xt.x = 0;
                //     this.xt.play("13-z8-2", false);
                // }));
                this.speed = 8;
                Laya.timer.clearAll(this);
                Laya.timer.once(2000, this, () => {
                    this.speed = 3;
                });
                break
        }
    }

    /**游戏逻辑控制 */
    public startGame() {
        this.clearData();
        super.startGame();
        this.initPlayer();
    }

    /**停止游戏 */
    public stopGame() {

    }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
            this.kengImg.removeSelf();
            // if (this.index == 0) {
            //     this.box_game_up.x = this.box_game.x = 0;
            // } else if (this.index == 1) {
            //     this.box_game_up.x = this.box_game.x = -1775;
            // } else if (this.index == 2) {
            //     this.box_game_up.x = this.box_game.x = -2824;
            //     //
            //     this.xt.play("13-z8-2", false);
            // }
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
        Laya.Tween.clearAll(this.box_game_up);
        Laya.Tween.clearAll(this.box_game_1);
        Laya.Tween.clearAll(this.box_game_up_1);
        this.kengImg && this.kengImg.removeSelf();
    }

}