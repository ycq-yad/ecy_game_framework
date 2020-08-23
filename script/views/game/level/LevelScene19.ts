import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene19 extends LevelBase {
    className_key = "LevelScene19";


    public boxDialog: Laya.Box;
    private box_dianti: Laya.Box;
    private box_dog: Laya.Box;
    private box_qiqiu: Laya.Box;

    private dogEventFlag: boolean = true;
    private qiQiuEventFlag: boolean = true;

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene19.json";
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

    private skDianTi: Laya.Skeleton;
    private skDog: Laya.Skeleton;
    private skQiQiu: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.skDianTi = await this.createSkeleton(this.mapData.c.ani.url);
        this.skDianTi.x = this.mapData.c.ani.x;
        this.skDianTi.y = this.mapData.c.ani.y;
        this.box_dianti.addChild(this.skDianTi);

        this.skDog = await this.createSkeleton(this.mapData.g.url);
        this.skDog.x = this.mapData.g.x;
        this.skDog.y = this.mapData.g.y;

        this.skQiQiu = await this.createSkeleton(this.mapData.q.url);
        this.skQiQiu.x = this.mapData.q.x;
        this.skQiQiu.y = this.mapData.q.y;
        this.box_qiqiu.addChild(this.skQiQiu);
        this.skQiQiu.visible = false;

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
            case "zd":

                break;
            case "sevent_19-3n_1":
                this.skDianTi.play("19-3n", false);
                break;
            case "sevent_19-1g_1":
                if (this.dogEventFlag == false) return;
                this.dogEventFlag = false;
                if (this.box_dog.numChildren <= 0) this.box_dog.addChild(this.skDog);
                this.skDog.play("19-1g", false);
                break;
            case "sevent_19-2g_1":
                this.skDog.play("19-2g", false);
                break;
            case "sevent_19-3g_1":
                this.skDog.play("19-3g", false);
                break;
            case "sevent_19-1q_1":
                // if (this.qiQiuEventFlag == false) return;
                this.skQiQiu.visible = true;
                this.skQiQiu.play("19-1q", false);
                break;
            case "sevent_19-2q_1":
                this.skQiQiu.visible = true;
                this.skQiQiu.play("19-2q", false);
                Laya.timer.once(1500, this, () => { this.skQiQiu.visible = false; });
                break;
            case "sevent_19-2n_1":
                this.skDianTi.play("19-2n", false);
                break;
            case "sevent_19_door_close":
                this.skDianTi.play("19-2n", false, true, 0, 0.1);
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
                this.dogEventFlag = true;
                this.qiQiuEventFlag = true;
                this.skDog.play("19-1g", false, true, 0, 0.3);
            } else if (this.index == 1) {
                // this.box_game_up.x = this.box_game.x = -1775;
                this.skQiQiu.visible = false;
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