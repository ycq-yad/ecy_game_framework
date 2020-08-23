import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene8 extends LevelBase {
    className_key = "LevelScene8";

    public imageBg1: Laya.Image;
    public imageBg2: Laya.Image;
    public imageBg3: Laya.Image;
    public imageBg4: Laya.Image;
    public imageBg5: Laya.Image;
    public box_watorUp: Laya.Box;
    public boxWaterUp1: Laya.Box;
    public imageWaterUp1: Laya.Image;
    public imageWaterUp2: Laya.Image;
    public boxWaterUp2: Laya.Box;
    public imageWaterUp1After: Laya.Image;
    public imageWaterUp2After: Laya.Image;
    public box_watorDown: Laya.Box;
    public boxWaterDown1: Laya.Box;
    public imageWaterDown1: Laya.Image;
    public imageWaterDown2: Laya.Image;
    public boxWaterDown2: Laya.Box;
    public imageWaterDown2After1: Laya.Image;
    public imageWaterDown2After2: Laya.Image;

    private nIndexMax: number;
    private nIndexCur: number;

    /**水流动画播放的时间 */
    private nWaterTime: number;
    private bAniOpen: boolean;
    private openui2Flag: boolean;

    private nXSub: number;

    public ani_bg: Laya.Skeleton;
    public nIndexTemp: number; //动画移动的基数

    //创建的动画对象
    public roleAniTweenUp1: Laya.Tween = null;
    public roleAniTweenUp2: Laya.Tween = null;
    public roleAniTweenDown1: Laya.Tween = null;
    public roleAniTweenDown2: Laya.Tween = null;

    constructor(data_) {
        super(data_);
        this.nIndexTemp = 2;
        this.nIndexCur = 0;
        this.nWaterTime = 8000;
        this.nXSub = 540;
        this.bAniOpen = false;
        this.openui2Flag = false;
        this.skin = "game/level/LevelScene8.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    /**
    * 当从父节点移除时候
    */
    public onRemoved() {
        super.onRemoved();
        this.stopWaterAni();
    }

    public initView() {
        this.nIndexMax = 2;
        this.openui2Flag = false;
        this.stopWaterAni();
        this.initWaterPos();
        super.initView();
    }

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg.x = -5;
        this.ani_bg.y = 610;
        this.ani_bg.play(0, true);
        this.box_enb.addChild(this.ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index + this.nIndexTemp) * 1080;
        this.box_game.x = (this.index) * -1080;

        // //移动结束弹出选择框
        //Laya.Tween.to(this.box_player, { x: (this.index + this.nIndexTemp) * 1080 }, 3250);
        Laya.Tween.to(this.box_watorUp, { x: (this.index + this.nIndexTemp) * 1080 }, 3250);
        Laya.Tween.to(this.box_watorDown, { x: (this.index + this.nIndexTemp) * 1080 }, 3250);
        Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp - 1) * -1080 }, 1625, null, Laya.Handler.create(this, (args) => {
            //播放玩家动画
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * -1080 }, 1625);
            this.onStart();
        }));
        ViewChangeManager.getInstance().hideBufferLoadingView();

    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        if ("openui1" == evt.name) {
            this.popChoose();
        } else if ("openui2" == evt.name) {
            this.nIndexCur += 1
            if (this.nIndexCur >= this.nIndexMax) {
                this.popChoose();
            }
        } else if ("smove2" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.index + this.nIndexTemp) * (-1080) - this.nXSub }, 1000);
            Laya.Tween.to(this.box_watorUp, { x: (this.index + 1) * 1080 + this.nXSub }, 1000);
            Laya.Tween.to(this.box_watorDown, { x: (this.index + 1) * 1080 + this.nXSub }, 1000);
        } else if ("smove3" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) }, 3000);
            Laya.Tween.to(this.box_watorUp, { x: (this.index + this.nIndexTemp) * 1080 }, 3000);
            Laya.Tween.to(this.box_watorDown, { x: (this.index + this.nIndexTemp) * 1080 }, 3000);
        } else if ("smove4" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * (-1080) - this.nXSub }, 4000);
            Laya.Tween.to(this.box_watorUp, { x: (this.index + this.nIndexTemp) * 1080 }, 4000);
            Laya.Tween.to(this.box_watorDown, { x: (this.index + this.nIndexTemp) * 1080 }, 4000);
        }
    }

    /**游戏逻辑控制 */
    public startGame() {
        this.clearData();
        super.startGame();
        this.initPlayer();
        //初始化水的位置
        this.initWaterPos();
        //开启流水的动画
        this.openWaterAni();
    }

    /**停止游戏 */
    public stopGame() { }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            this.initWaterPos();
            this.initView();
            super.startGame();
            this.initPlayer();
            //开启流水的动画
            this.openWaterAni();
        } else {
            //this.destroyAni();
            super.restartGame();
            //初始化水的位置
            if (this.index == 0) {
                this.initWaterPos();
                this.box_player.x = (this.index + this.nIndexTemp) * 1080;
                this.box_game.x = (this.index) * -1080;
                Laya.Tween.to(this.box_watorUp, { x: (this.index + this.nIndexTemp) * 1080 }, 3250);
                Laya.Tween.to(this.box_watorDown, { x: (this.index + this.nIndexTemp) * 1080 }, 3250);
                Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp - 1) * -1080 }, 1625, null, Laya.Handler.create(this, (args) => {
                    //播放玩家动画
                    Laya.Tween.to(this.box_game, { x: (this.index + this.nIndexTemp) * -1080 }, 1625);
                    this.onStart();
                }));
            } else if (this.index == 1) {
                this.openui2Flag = false;
                this.nIndexMax = 1;
                this.nIndexCur = 0;
                this.onStart();
            } else if (this.index == 2) {
                this.onStart();
            }
        }
    }

    /**初始化水的位置 */
    private initWaterPos() {
        this.box_watorUp.x = 0;
        this.box_watorDown.x = 0;
        this.boxWaterUp1.x = 0;
        this.boxWaterUp2.x = 1700;
        this.boxWaterDown1.x = 0;
        this.boxWaterDown2.x = 1700;
    }

    /**停止动画 */
    private stopWaterAni() {
        this.bAniOpen = false;
        Laya.Tween.clearAll(this.boxWaterUp1);
        Laya.Tween.clearAll(this.boxWaterUp2);
        Laya.Tween.clearAll(this.boxWaterDown1);
        Laya.Tween.clearAll(this.boxWaterDown2);

        this.roleAniTweenUp1 = null;
        this.roleAniTweenUp2 = null;
        this.roleAniTweenDown1 = null;
        this.roleAniTweenDown2 = null;

        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_watorUp);
        Laya.Tween.clearAll(this.box_watorDown);
        Laya.Tween.clearAll(this.box_game);
    }

    /**启动水流的动画 */
    private openWaterAni() {
        this.bAniOpen = true;
        this.nWaterTime = 8000;
        //开启上面第一张图的动画
        this.boxWaterUp1Start();
        this.waterAniUp2Loop();

        //下面的流水动画
        this.boxWaterDown1Start();
        this.waterAniDown2Loop();
    }

    private boxWaterUp1Start() {
        if (!this.bAniOpen) {
            return;
        }
        this.roleAniTweenUp1 = Laya.Tween.to(this.boxWaterUp1, { x: -1720 }, this.nWaterTime / 2, null, Laya.Handler.create(this, (args) => {
            this.waterAniUp1Loop();
        }));
    }

    /**上方的水流动画第一张图 */
    private waterAniUp1Loop() {
        if (!this.bAniOpen) {
            return;
        }
        this.boxWaterUp1.x = this.boxWaterUp2.x + 1700; //1700;
        this.roleAniTweenUp1 = Laya.Tween.to(this.boxWaterUp1, { x: -1720 }, this.nWaterTime, null, Laya.Handler.create(this, (args) => {
            Laya.timer.once(0, this, this.waterAniUp1Loop);
        }));
    }

    /**上方流水第二张图 */
    private waterAniUp2Loop() {
        if (!this.bAniOpen) {
            return;
        }
        this.boxWaterUp2.x = this.boxWaterUp1.x + 1700;//1700;
        this.roleAniTweenUp2 = Laya.Tween.to(this.boxWaterUp2, { x: -1720 }, this.nWaterTime, null, Laya.Handler.create(this, (args) => {
            Laya.timer.once(0, this, this.waterAniUp2Loop);
        }));
    }

    private boxWaterDown1Start() {
        if (!this.bAniOpen) {
            return;
        }
        this.roleAniTweenDown1 = Laya.Tween.to(this.boxWaterDown1, { x: -1720 }, this.nWaterTime / 2, null, Laya.Handler.create(this, (args) => {
            this.waterAniDown1Loop();
        }));
    }

    /**上方的水流动画第一张图 */
    private waterAniDown1Loop() {
        if (!this.bAniOpen) {
            return;
        }
        this.boxWaterDown1.x = this.boxWaterDown2.x + 1700; //1700;
        this.roleAniTweenDown1 = Laya.Tween.to(this.boxWaterDown1, { x: -1720 }, this.nWaterTime, null, Laya.Handler.create(this, (args) => {
            Laya.timer.once(0, this, this.waterAniDown1Loop);
        }));
    }

    /**上方流水第二张图 */
    private waterAniDown2Loop() {
        if (!this.bAniOpen) {
            return;
        }
        this.boxWaterDown2.x = this.boxWaterDown1.x + 1700;//1700
        this.roleAniTweenDown2 = Laya.Tween.to(this.boxWaterDown2, { x: -1720 }, this.nWaterTime, null, Laya.Handler.create(this, (args) => {
            Laya.timer.once(0, this, this.waterAniDown2Loop);
        }));
    }

    /**on hide */
    public levelOnHide() {
        // //初始化水的位置
        // this.initWaterPos();
        // this.stopWaterAni();
        // //开启流水的动画
        // this.openWaterAni();
        this.roleAniTweenUp1 && this.roleAniTweenUp1.pause();
        this.roleAniTweenUp2 && this.roleAniTweenUp2.pause();
        this.roleAniTweenDown1 && this.roleAniTweenDown1.pause();
        this.roleAniTweenDown2 && this.roleAniTweenDown2.pause();
        console.log("levelOnHide");
    }

    public levelOnShow() {
        this.roleAniTweenUp1 && this.roleAniTweenUp1.resume();
        this.roleAniTweenUp2 && this.roleAniTweenUp2.resume();
        this.roleAniTweenDown1 && this.roleAniTweenDown1.resume();
        this.roleAniTweenDown2 && this.roleAniTweenDown2.resume();
        console.log("levelOnShow");
    }
}