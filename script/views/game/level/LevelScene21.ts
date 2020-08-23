import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene21 extends LevelBase {
    className_key = "LevelScene21";

    private box_bg_top: Laya.Box;
    private box_bg_bottom: Laya.Box;
    private box_brokenBridge: Laya.Box;
    private box_gopher: Laya.Box;
    private box_iceHole: Laya.Box;
    private img_hole: Laya.Image;
    private img_iceHole: Laya.Image;

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene21.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public initView() {
        super.initView();
        this.box_bg_top.x = 0;
        this.box_bg_bottom.x = 0;
        this.box_gopher.x = 140;
        this.box_iceHole.x = 140;
        this.img_hole.visible = false;
        if (this.skGopher) this.skGopher.visible = false;
        this.img_iceHole.visible = false;
        if (this.skIceHole) this.skIceHole.visible = false;
        if (this.skBrokenBridge) this.skBrokenBridge.visible = false;
        this.stopAni();
    }

    /**
    * 当从父节点移除时候
    */
    public onRemoved() {
        super.onRemoved();
        this.stopAni();
    }

    private skBrokenBridge: Laya.Skeleton;
    private skGopher: Laya.Skeleton;
    private skIceHole: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.skBrokenBridge = await this.createSkeleton(this.mapData.brokenBridge.url);
        this.skBrokenBridge.x = this.mapData.brokenBridge.x;
        this.skBrokenBridge.y = this.mapData.brokenBridge.y;
        this.box_iceHole.addChild(this.skBrokenBridge);
        this.skBrokenBridge.visible = false;

        this.skGopher = await this.createSkeleton(this.mapData.gopher.url);
        this.skGopher.x = this.mapData.gopher.x;
        this.skGopher.y = this.mapData.gopher.y;
        this.box_gopher.addChild(this.skGopher);
        this.skGopher.visible = false;

        this.skIceHole = await this.createSkeleton(this.mapData.bucket.url);
        this.skIceHole.x = this.mapData.bucket.x;
        this.skIceHole.y = this.mapData.bucket.y;
        this.box_iceHole.addChild(this.skIceHole);
        this.skIceHole.visible = false;

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();

    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_bg_top, { x: -1700 }, 2500, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_top);
                }));
                Laya.Tween.to(this.box_bg_bottom, { x: -1700 }, 2500, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_bottom);
                }));
                break;
            case "sevent_21-tubis1_1":
                this.skGopher.visible = true;
                this.skGopher.play("21-tubis1", false);
                break;
            case "sevent_21-tubis2_1":
                this.skGopher.play("21-tubis2", false);
                break;
            case "sevent_21-tubis3_1":
                this.skGopher.play("21-tubis3", false);
                Laya.timer.once(1460, this, () => {
                    this.img_hole.visible = true;
                    this.skGopher.visible = false;
                });
                break;
            case "smove2":
                Laya.Tween.to(this.box_bg_top, { x: -5300 }, 3420, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_top);
                }));
                Laya.Tween.to(this.box_bg_bottom, { x: -5300 }, 3420, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_bottom);
                }));
                Laya.Tween.to(this.box_gopher, { x: -1760 }, 3420, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_gopher);
                }));
                this.box_iceHole.x = 2040;
                this.img_iceHole.visible = true;
                Laya.Tween.to(this.box_iceHole, { x: 140 }, 3420, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_iceHole);
                }));
                break;
            case "sevent_cement_1":
                this.skIceHole.visible = true;
                this.skIceHole.play("cement", false);
                break;
            case "smove3":
                Laya.Tween.to(this.box_bg_top, { x: -5600 }, 1040, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_top);
                }));
                Laya.Tween.to(this.box_bg_bottom, { x: -5600 }, 1040, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_bottom);
                }));
                Laya.Tween.to(this.box_iceHole, { x: -160 }, 1040, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_iceHole);
                }));
                break;
            case "smove4":
                Laya.Tween.to(this.box_bg_top, { x: -6600 }, 4960, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_top);
                }));
                Laya.Tween.to(this.box_bg_bottom, { x: -6600 }, 4960, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_bottom);
                }));
                Laya.Tween.to(this.box_iceHole, { x: -1160 }, 4960, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_iceHole);
                }));
                break;
            case "smove5":
                Laya.Tween.to(this.box_bg_top, { x: -3400 }, 3460, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_top);
                }));
                Laya.Tween.to(this.box_bg_bottom, { x: -3400 }, 3460, null, Laya.Handler.create(this, () => {
                    Laya.Tween.clearAll(this.box_bg_bottom);
                }));
                break;
            case "sevent_3-3_1":
                this.skBrokenBridge.visible = true;
                this.skBrokenBridge.play("3-3", false);
                this.img_iceHole.visible = false;
                break;
        }
    }

    /**游戏逻辑控制 */
    public startGame() {
        this.clearData();
        super.startGame();
        this.initPlayer();
    }

    /** 停止游戏 */
    public stopGame() {

    }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            this.initView();
            this.startGame();
            // super.startGame();
            // this.initPlayer();
        } else {
            super.restartGame();
            if (this.index == 0) {
                this.box_bg_top.x = 0;
                this.box_bg_bottom.x = 0;
            } else if (this.index == 1) {
                this.skGopher.play("21-tubis1", false);
            } else if (this.index == 2) {
                this.box_iceHole.x = 140;
                this.box_bg_top.x = -5300;
                this.box_bg_bottom.x = -5300;
                this.img_iceHole.visible = true;
                this.skBrokenBridge.visible = false;
                this.skIceHole.visible = false;
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