import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene30 extends LevelBase {
    className_key = "LevelScene30";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene30.json";
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

    //火
    private box_huo: Laya.Box;
    private skHuo: Laya.Skeleton;
    //龙
    private box_long: Laya.Box;
    private skLong: Laya.Skeleton;

    //石头
    private box_shitou: Laya.Box;
    public skShiTou: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        //火
        this.skHuo = await this.createSkeleton(this.mapData.huo.url);
        this.skHuo.x = this.mapData.huo.x;
        this.skHuo.y = this.mapData.huo.y;
        this.box_huo.addChild(this.skHuo);
        this.skHuo.visible = false;
        //long
        this.skLong = await this.createSkeleton(this.mapData.long.url);
        this.skLong.x = this.mapData.long.x;
        this.skLong.y = this.mapData.long.y;
        this.skLong.play("konglong1", true);
        this.box_long.addChild(this.skLong);
        //石头
        this.skShiTou = await this.createSkeleton(this.mapData.shitou.url);
        this.skShiTou.x = this.mapData.shitou.x;
        this.skShiTou.y = this.mapData.shitou.y;
        this.skShiTou.play("shitou1", true);
        this.box_shitou.addChild(this.skShiTou);

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
                Laya.Tween.to(this.box_game, { x: -(1176) }, 2500);
                Laya.Tween.to(this.box_player, { x: (1176) }, 2500);
                break;
            case "sevent_huo_1":
                this.skHuo.visible = true;
                this.skHuo.play("huo", true);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -(2455) }, 2540);
                Laya.Tween.to(this.box_player, { x: (2315) }, 2540);
                break;
            case "sevent_konglong2_1":
                this.skLong.play("konglong2", false);
                break;
            case "sevent_konglong3_1":
                this.skLong.play("konglong3", false);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(3400) }, 3330);
                Laya.Tween.to(this.box_player, { x: (3600) }, 3330);
                break;
            case "sevent_shitou2_1":
                this.skShiTou.play("shitou2", false);
                break;
            case "sevent_shitou3_1":
                this.skShiTou.play("shitou3", false);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(4625) }, 5750);
                Laya.Tween.to(this.box_player, { x: (4650) }, 5750);
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
                this.box_player.x = (this.index) * 1080;
                this.box_game.x = (this.index) * 1080;
            } else if (this.index == 1) {
                this.skLong.play("konglong1", true);
            } else if (this.index == 2) {
                this.skShiTou.play("shitou1", true);
            }
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);

    }
}