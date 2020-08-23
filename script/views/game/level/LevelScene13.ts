import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene13 extends LevelBase {
    className_key = "LevelScene13";

    public nIndexTemp: number; //动画移动的基数
    public nAddTemp: number;    //修正的参数
    public nForend: number;

    public box_game_up: Laya.Box;
    public xtBox: Laya.Box;
    public bgM_box: Laya.Box;

    constructor(data_) {
        super(data_);
        this.nIndexTemp = 0;
        this.nAddTemp = -490;
        this.nForend = 540;
        this.skin = "game/level/LevelScene13.json";
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
    private xj: Laya.Skeleton;
    private kg: Laya.Skeleton;
    private bgM: Laya.Skeleton;

    public async initPlayer() {
        //
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.bgM = await this.createSkeleton(this.mapData.bg.ani.url);
        this.bgM.x = this.mapData.bg.ani.x; this.bgM.y = this.mapData.bg.ani.y;
        this.bgM_box.addChild(this.bgM);
        //
        this.xt = await this.createSkeleton(this.mapData.xt.url);
        this.xt.x = this.mapData.xt.x;
        this.xt.y = this.mapData.xt.y;
        this.xtBox.addChild(this.xt);
        //
        this.xj = await this.createSkeleton(this.mapData.xj.url);
        this.xj.x = this.mapData.xj.x;
        this.xj.y = this.mapData.xj.y;
        //
        this.kg = await this.createSkeleton("resource/assets/img/ani/level13/checkpoint13kaiguan.sk");
        this.kg.y = 530 + 680;
        this.kg.x = 2824;
        this.box_game.addChild(this.kg);
        this.kg.stop();
        //
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        this.box_game_up.x = this.box_game.x = (this.index) * 1080;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "sevent_13-z1-1_1":
                this.xt.play("13-z1-1", false);
                break
            case "sevent_13-z1-2_1":
                // this.xt.x = 720;
                this.xt.play("13-z1-2", false);
                break
            case "sevent_13-z3_1":
                this.xt.play("13-z3", false);
                break
            case "sevent_13-z4_1":
                this.xt.play("13-z4", false);
                break
            case "sevent_13-z5_1":
                //this.xt.x = 1775;
                this.xt.play("13-z5", false);
                break
            case "sevent_13-z6_1":
                this.xt.play("13-z6", false);
                break
            case "sevent_13-z8-1_1":
                this.xt.play("13-z8", false);
                break
            case "sevent_13-xj8_1"://香蕉
                this.box_player.addChild(this.xj);
                this.xj.play("13-xj8", false);
                break
            case "sevent_13-z8-2_1":
                this.xt.play("13-z8-1", false);
                Laya.timer.once(200, this, () => {
                    this.xj.stop();
                    this.xj.removeSelf();
                });
                break
            //sevent_13-11kg_1 开关
            case "sevent_13-11kg_1":
                this.kg.play("13-11kg", false);
                break
            case "sevent_13-z10_1":
                this.xt.x = 0;
                this.xt.play("13-z10", false);
                break
            case "sevent_13-z11_1":
                this.xt.x = 0;
                this.xt.play("13-z11", false);
                break
            case "sevent_win_stop":
                this.bgM.stop();
                break
            //移动场景
            case "smove":
                Laya.Tween.to(this.box_game, { x: - 720 }, 1790);
                Laya.Tween.to(this.box_game_up, { x: - 720 }, 1790);
                Laya.Tween.to(this.xt, { x: - 720 }, 1790, null, Laya.Handler.create(this, () => {//1790表示 播放动画时间与开始移动事件的差ms
                    this.xt.x = 0;
                }));
                break
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -1775 }, 2000);
                Laya.Tween.to(this.box_game_up, { x: -1775 }, 2000);
                Laya.Tween.to(this.xt, { x: - 500 }, 1000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                    Laya.Tween.to(this.xt, { x: 0 }, 1000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                        this.xt.x = 0;
                    }));
                }));
                break
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -2824 }, 3620);
                Laya.Tween.to(this.box_game_up, { x: -2824 }, 3620);
                Laya.Tween.to(this.xt, { x: - 1000 }, 3000, null, Laya.Handler.create(this, () => {//2000表示 播放动画时间与开始移动事件的差ms
                    this.xt.x = 0;
                    this.xt.play("13-z8-2", false);
                }));
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
                this.box_game_up.x = this.box_game.x = 0;
            } else if (this.index == 1) {
                this.box_game_up.x = this.box_game.x = -1775;
            } else if (this.index == 2) {
                this.box_game_up.x = this.box_game.x = -2824;
                //
                this.xt.play("13-z8-2", false);
            }
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
        Laya.Tween.clearAll(this.box_game_up);
    }

}