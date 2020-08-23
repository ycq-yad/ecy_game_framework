import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene31 extends LevelBase {
    className_key = "LevelScene31";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene31.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public box_rope: Laya.Box;
    public initView() {
        super.initView();
        this.stopAni();
        this.box_rope.visible = true;
    }

    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        this.stopAni();
    }


    public nanyeren: Laya.Skeleton;
    public nvyeren: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        
        this.nanyeren = await this.createSkeleton(this.mapData.nanyeren.url);
        this.nanyeren.x = this.mapData.nanyeren.x;
        this.nanyeren.y = this.mapData.nanyeren.y;
        this.box_enb.addChild(this.nanyeren);
        this.nanyeren.visible = false;

        this.nvyeren = await this.createSkeleton(this.mapData.nvyeren.url);
        this.nvyeren.x = this.mapData.nvyeren.x;
        this.nvyeren.y = this.mapData.nvyeren.y;
        this.box_enb.addChild(this.nvyeren);
        this.nanyeren.visible = false;

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.box_player.addChild(this.ani_player);

        this.box_player.x = (this.index) * 1300;
        this.box_game.x = (this.index) * 1300;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -(1500) }, 3000);
                Laya.Tween.to(this.box_player, { x: (1300) }, 3000);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -(2800) }, 5200);
                Laya.Tween.to(this.box_player, { x: (2600) }, 5200);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(4100) }, 5000);
                Laya.Tween.to(this.box_player, { x: (3900) }, 5000);
                break;
            case "smove3":
                Laya.Tween.to(this.box_player, { x: (5000) }, 3000);
                break;
            case "tot":
                this.box_rope.visible = false;
                break;
            case "sevent_nanyeren1_1":
                this.nanyeren.visible = true;
                this.nanyeren.play("nanyeren1", true);
                break;
            case "sevent_nanyeren2_1":
                this.nanyeren.visible = true;
                this.nanyeren.play("nanyeren2", false);
                break;
            case "sevent_nanyeren3_1":
                this.nanyeren.visible = true;
                this.nanyeren.play("nanyeren3", false);
                break;
            case "sevent_nvyeren1_1":
                this.nvyeren.visible = true;
                this.nvyeren.play("nvyeren1", true);
                break;
            case "sevent_nvyeren2_1":
                this.nvyeren.visible = true;
                this.nvyeren.play("nvyeren2", false);
                break;
            case "sevent_nvyeren3_1":
                this.nvyeren.visible = true;
                this.nvyeren.play("nvyeren3", false);
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
                this.box_rope.visible = true;
            } else if (this.index == 1) {
                this.box_rope.visible = false;
            } else if (this.index == 2) {
                this.nvyeren.play("nvyeren1", true);
                this.box_rope.visible = false;
            }
            this.box_player.x = this.index * 1300;
            this.box_game.x = -this.index * 1300;
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }

}