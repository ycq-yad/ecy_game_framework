import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene17 extends LevelBase {
    className_key = "LevelScene17";

    public nIndexTemp: number; //动画移动的基数
    public nAddTemp: number;    //修正的参数
    public nForend: number;

    public box_game_up: Laya.Box;
    public xtBox: Laya.Box;
    public bgM_box: Laya.Box;

    private boxMid: Laya.Box;
    private boxKuang: Laya.Box;

    constructor(data_) {
        super(data_);
        this.nIndexTemp = 0;
        this.nAddTemp = -490;
        this.nForend = 540;
        this.skin = "game/level/LevelScene17.json";
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
    private bgM: Laya.Skeleton;
    public async initPlayer() {
        // //
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.bcjOneFlag = false;
        this.boxKuang = this.box_game.getChildByName("boxKuang") as Laya.Box;
        this.boxMid = this.box_game.getChildByName("boxMid") as Laya.Box;

        this.bgM = await this.createSkeleton(this.mapData.bg.ani.url);
        this.bgM.x = this.mapData.bg.ani.x;
        this.bgM.y = this.mapData.bg.ani.y;
        this.bgM.x = 0;
        this.bgM.y = this.bgM.height * 2 + 100;

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

    private sharkSome(): void {
        this.sharkBox(this.boxKuang);
        this.sharkBox(this.boxMid);
    }

    /**
     * 抖动
     * @param box 
     */
    private sharkBox(box: Laya.Box): void {
        let toXL: number = 25;
        let startX: number = box.x;
        Laya.Tween.to(box, { x: startX - toXL }, 150, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
            Laya.Tween.to(box, { x: startX + toXL }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(box, { x: startX - toXL }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                    Laya.Tween.to(box, { x: startX + toXL * 0.7 }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                        Laya.Tween.to(box, { x: startX - toXL * 0.7 }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                            Laya.Tween.to(box, { x: startX }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, () => {

                            }));
                        }));
                    }));
                }));
            }));
        }));
    }
    public bcjOneFlag: boolean = false;
    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "sevent_17-1cj_1":

                break;
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1080 * this.index }, 3000);
                Laya.Tween.to(this.box_player, { x: 1080 * this.index + 300 }, 3000);
                break;
            case "smove2":
                Laya.Tween.to(this.box_player, { x: 1080 * this.index + 300 }, 3000);
                break;
            case "zd1":
                this.sharkSome();
                if (this.bgM_box.numChildren <= 0) {
                    this.bgM_box.addChild(this.bgM);
                }
                if (!this.bcjOneFlag) {
                    this.bgM.play("17-1cj", false);
                    this.bcjOneFlag = true;
                }
                break;
            case "zd2":
                this.sharkSome();
                break;
            case "zd3":
                this.sharkSome();
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
                //this.box_game_up.x = this.box_game.x = 0;
                this.bcjOneFlag = false;
            } //else if (this.index == 1) {
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
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
        Laya.Tween.clearAll(this.box_game_up);
    }

}