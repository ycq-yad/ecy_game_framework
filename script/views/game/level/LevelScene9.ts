import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene9 extends LevelBase {
    className_key = "LevelScene9";

    public ani_bg: Laya.Skeleton;

    public nIndexTemp: number; //动画移动的基数
    public nAddTemp: number;    //修正的参数

    constructor(data_) {
        super(data_);
        this.nIndexTemp = 1;
        this.nAddTemp = 600;
        this.skin = "game/level/LevelScene9.json";
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

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        this.ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg.x = -240;
        this.ani_bg.y = 640;
        this.ani_bg.play(0, true);
        this.box_enb.addChild(this.ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        this.box_game.x = (this.index) * -1080;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        if ("smove" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) - this.nAddTemp }, 3000);
        } else if ("sevent_9-c1_1" == evt.name) {
            this.ani_bg.play("9-c1", true);
            //this.ani_bg.play(0, true);
        } else if ("sevent_9-c2_1" == evt.name) {
            this.ani_bg.play("9-c2", true);
        } else if ("sevent_9-c3_1" == evt.name) {
            this.ani_bg.play("9-c3", false);
        } else if ("smove2" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) - 1100 }, 3500);
        } else if ("smove3" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) - 1100 + 400 }, 3540 - 750);
        } else if ("smove4" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) - 1540 }, 6080 - 2500);
        } else if ("smove5" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) - 1340 }, 5540);
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
                this.box_game.x = 0;
                this.ani_bg.stop();
            }
            if (this.index == 1) {
                this.box_game.x = (this.index + this.nIndexTemp) * (-1080) - 1100
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