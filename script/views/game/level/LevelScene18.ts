import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene18 extends LevelBase {
    className_key = "LevelScene18";

    public box_dx: Laya.Box;
    public box_hp: Laya.Box;
    public box_sg: Laya.Box;
    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene18.json";
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

    private skDx: Laya.Skeleton;
    private skHp: Laya.Skeleton;
    private skSg: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        //
        this.skDx = await this.createSkeleton(this.mapData.dx.ani.url);
        this.skDx.x = this.mapData.dx.ani.x;
        this.skDx.y = this.mapData.dx.ani.y;
        // this.skG.x = 0;
        this.skDx.y = this.skDx.height + 120;
        this.box_dx.addChild(this.skDx);
        //
        this.skHp = await this.createSkeleton(this.mapData.hp.url);
        this.skHp.x = this.mapData.hp.x;
        this.skHp.y = this.mapData.hp.y;
        // this.skZ.x = 0;
        this.skHp.y = this.skHp.height + this.skHp.height / 2 + 150;
        this.box_hp.addChild(this.skHp);

        this.skSg = await this.createSkeleton(this.mapData.sg.url);
        this.skSg.x = this.mapData.hp.x;
        this.skSg.y = this.mapData.hp.y;
        // this.skZ.x = 0;
        this.skSg.y = this.skSg.height + 50;
        this.box_sg.addChild(this.skSg);

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
                Laya.Tween.to(this.box_game, { x: -(1350) }, 4170);
                Laya.Tween.to(this.box_player, { x: (1350) }, 4170);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(4250) }, 8130);
                Laya.Tween.to(this.box_player, { x: (4250) }, 8130);
                this.skHp.play("18-hp6", false);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(6450) }, 3600);
                Laya.Tween.to(this.box_player, { x: (6450) }, 3600);
                this.skHp.play("18-sg9", true);
                break;
            case "sevent_18-sg10_1":
                this.skSg.play("18-sg10", false);
                break;
            case "sevent_18-hp7_1":
                this.skHp.play("18-hp7", false);
                break;
            case "smove4":
                Laya.Tween.to(this.box_game, { x: -(8000) }, 3660);
                Laya.Tween.to(this.box_player, { x: (8000) }, 3660);
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