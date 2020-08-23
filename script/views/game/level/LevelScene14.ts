import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene14 extends LevelBase {
    className_key = "LevelScene14";

    public box_g: Laya.Box;
    public box_z: Laya.Box;

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene14.json";
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

    private skG: Laya.Skeleton;
    private skZ: Laya.Skeleton;

    public async initPlayer() {
        //
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.skG = await this.createSkeleton(this.mapData.bg.ani.url);
        this.skG.x = this.mapData.bg.ani.x;
        this.skG.y = this.mapData.bg.ani.y;
        // this.skG.x = 0;
        // this.skG.y = this.skG.height + 170;
        this.box_g.addChild(this.skG);
        //
        this.skZ = await this.createSkeleton(this.mapData.z.url);
        this.skZ.x = this.mapData.z.x;
        this.skZ.y = this.mapData.z.y;
        // this.skZ.x = 0;
        // this.skZ.y = this.skG.height + this.skG.height /2 + 150;
        this.box_z.addChild(this.skZ);
        //
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
                Laya.Tween.to(this.box_game, { x: -2272 }, 5210);
                Laya.Tween.to(this.box_player, { x: 2272 }, 5210);
                break;
            case "sevent_14-g1_1":
                this.skG.play("14-g1", false);
                break;
            case "sevent_14-g3_1":
                this.skG.play("14-g3", false);
                break;
            case "sevent_14-g2_1":
                this.skG.play("14-g2", false);
                break;
            case "sevent_14-g4_1":
                this.skG.play("14-g4", false);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(2272 + 618 + 518) }, 3750);
                Laya.Tween.to(this.box_player, { x: (2272 + 618 + 518) }, 3750);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(2272 + 618 + 618 + 1236 + 300) }, 3500);
                Laya.Tween.to(this.box_player, { x: (2272 + 618 + 618 + 1236 + 300) }, 3500);
                this.skZ.play("14-z7", false);
                break;
            case "smove4":
                break;
            case "sevent_14-z8_1":
                this.skZ.play("14-z8", false);
                break;
            case "sevent_14-z10_1":
                this.skZ.play("14-z10", false);
                break;
            case "sevent_14-z9_1":
                this.skZ.play("14-z9", false);
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
                // this.box_game_up.x = this.box_game.x = -1775;
            } else if (this.index == 2) {
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