import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene22 extends LevelBase {
    className_key = "LevelScene22";

    public box_xiong: Laya.Box;
    public box_xueren: Laya.Box;
    public box_xiong2: Laya.Box;
    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene22.json";
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

    private skXueRen: Laya.Skeleton;
    private skXiong: Laya.Skeleton;
    private skXiong2: Laya.Skeleton;
    private skSg: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        //
        this.skXueRen = await this.createSkeleton(this.mapData.xueren.url);
        this.skXueRen.x = this.mapData.xueren.x;
        this.skXueRen.y = this.mapData.xueren.y;
        this.box_xueren.addChild(this.skXueRen);

        this.skXiong = await this.createSkeleton(this.mapData.xiong.ani.url);
        this.skXiong.x = this.mapData.xiong.ani.x;
        this.skXiong.y = this.mapData.xiong.ani.y;
        this.box_xiong.addChild(this.skXiong);

        this.skXiong2 = await this.createSkeleton(this.mapData.xiong.ani.url);
        this.skXiong2.x = this.mapData.xiong.ani.x;
        this.skXiong2.y = this.mapData.xiong.ani.y;

        //
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
                Laya.Tween.to(this.box_game, { x: -(1324) }, 4380);
                Laya.Tween.to(this.box_player, { x: (1324) }, 4380);
                this.skXueRen.play("22-xr1", false);
                break;
            case "sevent_22-xr1_0":

                break;
            case "sevent_22-xr2_1":
                this.skXueRen.play("22-xr3", false);
                break;
            case "sevent_22-xr3_1":
                this.skXueRen.play("22-xr4", false);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(3594) }, 4460);
                Laya.Tween.to(this.box_player, { x: (3594) }, 4460);
                break;
            case "sevent_22-x5_1":
                this.skXiong.play("22-x5", false);
                break;
            case "sevent_22-x6_1":
                this.skXiong.play("22-x6", false);
                break;
            case "sevent_22-x7_1":
                this.skXiong.play("22-x7", false);
                break;
            case "sevent_22-x9_1":
                if (this.box_xiong2.numChildren <= 0) {
                    this.box_xiong2.addChild(this.skXiong2);
                }
                this.box_xiong2.x = 5290;
                this.skXiong2.play("22-x9", false);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(5290) }, 5200);
                Laya.Tween.to(this.box_player, { x: (5290) }, 5200);
                break;
            case "smove4":
                Laya.Tween.to(this.box_game, { x: -(6200) }, 7543);
                Laya.Tween.to(this.box_player, { x: (6200) }, 7543);
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
            if (this.index == 0) {
                this.box_player.x = this.box_game.x = 0;
            } else if (this.index == 1) {
                // this.box_game_up.x = this.box_game.x = -1775;
            } else if (this.index == 2) {
                this.box_xiong2.removeChild(this.skXiong2);
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