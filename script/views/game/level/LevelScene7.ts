import { LevelBase } from "./LevelBase";
import SoundManager from "../../../common/SoundManager";
import ViewChangeManager from "../../../games/ViewChangeManager";

/**
 * 第七关
 */
export default class LevelScene7 extends LevelBase {
    className_key = "LevelScene7";

    public image3up: Laya.Image;
    public image2Temp: Laya.Image;
    public image2up: Laya.Image;
    public image2yun: Laya.Image;
    public image2yunTemp: Laya.Image;
    public imageSun: Laya.Image;
    public box_watorUp: Laya.Box;
    public boxWaterUp1: Laya.Box;
    public imageWaterUp1: Laya.Image;
    public imageWaterUp2: Laya.Image;
    public imageWaterUp1Temp: Laya.Image;
    public imageWaterUp2Temp: Laya.Image;
    public boxWaterUp2: Laya.Box;
    public imageWaterUp1After: Laya.Image;
    public imageWaterUp2After: Laya.Image;
    public imageWaterUp1AfterTemp: Laya.Image;
    public imageWaterUp2AfterTemp: Laya.Image;
    public box_fire: Laya.Box;
    public box_watorDown: Laya.Box;
    public boxWaterDown1: Laya.Box;
    public imageWaterDown1: Laya.Image;
    public imageWaterDown2: Laya.Image;
    public imageWaterDown1Temp: Laya.Image;
    public imageWaterDown2Temp: Laya.Image;
    public boxWaterDown2: Laya.Box;
    public imageWaterDown2After1: Laya.Image;
    public imageWaterDown2After2: Laya.Image;
    public imageWaterDown2After1Temp: Laya.Image;
    public imageWaterDown2After2Temp: Laya.Image;
    public box_enb1: Laya.Box;

    public ani_bg: Laya.Skeleton;

    /**水流动画播放的时间 */
    private nWaterTime: number;

    private bAniOpen: boolean;

    //创建的动画对象
    public roleAniTweenUp1: Laya.Tween = null;
    public roleAniTweenUp2: Laya.Tween = null;
    public roleAniTweenDown1: Laya.Tween = null;
    public roleAniTweenDown2: Laya.Tween = null;

    constructor(data_) {
        super(data_);
        this.nWaterTime = 8000;
        this.bAniOpen = false;
        this.skin = "game/level/LevelScene7.json";
        
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
        this.roleAniTweenUp1 = null;
        this.roleAniTweenUp2 = null;
        this.roleAniTweenDown1 = null;
        this.roleAniTweenDown2 = null;
    }

    public initView() {
        this.stopWaterAni();
        this.initChangeColor();
        this.initWaterPos();
        super.initView();
    }

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg.x = -5;
        this.ani_bg.y = 610;
        this.ani_bg.play("huo71", false);
        this.box_fire.addChild(this.ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        this.box_game.x = (this.index) * -1080;

        let ani_rain = await this.createSkeleton('resource/assets/img/ani/common/rain.sk');
        ani_rain.x = ani_rain.width / 2;
        ani_rain.y = ani_rain.height / 2;
        ani_rain.play(0, true);
        this.box_enb.addChild(ani_rain);

        let ani_rain2 = await this.createSkeleton('resource/assets/img/ani/common/rain.sk');
        ani_rain2.x = ani_rain.width / 2;
        ani_rain2.y = ani_rain.height / 2;
        ani_rain2.play(0, true);
        this.box_enb1.addChild(ani_rain2);

        // //移动结束弹出选择框
        Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 3250);
        Laya.Tween.to(this.box_watorUp, { x: (this.index + 1) * 1080 }, 3250);
        Laya.Tween.to(this.box_watorDown, { x: (this.index + 1) * 1080 }, 3250);
        Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 3250, null, Laya.Handler.create(this, (args) => {
            //手动弹出选择框
            this.popChoose();
        }));

        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        if ("sevent_shandian1_1" == evt.name) {
            this.playShandian1()
        } if ("smove2" == evt.name) {
            // Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 2500);
            Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 3000);
            Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 3000);
            Laya.Tween.to(this.box_watorUp, { x: (this.index + 1) * 1080 }, 3000);
            Laya.Tween.to(this.box_watorDown, { x: (this.index + 1) * 1080 }, 3000);
        } else if ("smove3" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 3000);
            Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 3000);
            Laya.Tween.to(this.box_watorUp, { x: (this.index + 1) * 1080 }, 3000);
            Laya.Tween.to(this.box_watorDown, { x: (this.index + 1) * 1080 }, 3000);
        } else if ("smove5" == evt.name) {
            Laya.Tween.to(this.box_game, { x: (this.index + 2) * -1080 }, 6000);
            Laya.Tween.to(this.box_player, { x: (this.index + 2) * 1080 }, 6000);
            Laya.Tween.to(this.box_watorUp, { x: (this.index + 2) * 1080 }, 6000);
            Laya.Tween.to(this.box_watorDown, { x: (this.index + 2) * 1080 }, 6000);
        } else if ("sevent_bs_1" == evt.name) {
            this.changeColorAni();
            this.box_enb1.removeChildren();
            SoundManager.getInstance().soundOpen = false;
            SoundManager.getInstance().soundOpen = true;
        }
    }

    public async playShandian1() {
        let ani_shandian1 = await this.createSkeleton('resource/assets/img/ani/common/shandian1.sk');
        ani_shandian1.x = ani_shandian1.width;
        ani_shandian1.y = ani_shandian1.height;
        ani_shandian1.player.once(Laya.Event.STOPPED, this, () => {
            ani_shandian1.visible = false;
        })
        ani_shandian1.play(0, false);
        this.box_enb1.addChild(ani_shandian1);
    }

    public callBack(right: boolean, aniName: string) {
        if (right) {
            this.index++;
            //this.popChooseScene.showResultIcon(right);
            //刷新下进度
            this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
            this.pGameView.showResultIcon(right);
        }
        this.playAni(aniName, () => {
            this.onPlayOnce();
        });
    }

    /**游戏逻辑控制 */
    public startGame() {
        //初始化水的位置
        this.initChangeColor();
        this.initWaterPos();
        this.clearData();
        super.startGame();
        this.initPlayer();
        this.stopWaterAni();
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
            this.stopWaterAni();
            this.openWaterAni();
        } else {
            //this.destroyAni();
            super.restartGame();
            if (this.index == 0) {
                this.ani_bg.play("huo71", false);
                this.box_player.x = 0;
                this.box_game.x = 0;
                //初始化水的位置
                this.initWaterPos();
                // //开启流水的动画
                this.stopWaterAni();
                this.openWaterAni();
                Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 3250);
                Laya.Tween.to(this.box_watorUp, { x: (this.index + 1) * 1080 }, 3250);
                Laya.Tween.to(this.box_watorDown, { x: (this.index + 1) * 1080 }, 3250);
                Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 3250, null, Laya.Handler.create(this, (args) => {
                    //手动弹出选择框
                    this.popChoose();
                }));
            }
            //场景移动
            this.onStart();
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
        console.log("this.boxWaterUp2.x = ",this.boxWaterUp2.x,"this.box_watorUp.x = ",this.box_watorUp.x);
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
        console.log("this.boxWaterUp1.x = ",this.boxWaterUp1.x,"this.box_watorUp.x = ",this.box_watorUp.x);
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

    /**变色图片初始化 */
    private initChangeColor() {
        //背景和云
        this.image2Temp.alpha = 0;
        this.image2up.alpha = 1;
        this.image2yun.alpha = 1;
        this.image2yunTemp.alpha = 0;

        //水
        this.imageWaterUp1.alpha = 1;
        this.imageWaterUp2.alpha = 1;
        this.imageWaterUp1Temp.alpha = 0;
        this.imageWaterUp2Temp.alpha = 0;

        this.imageWaterUp1After.alpha = 1;
        this.imageWaterUp2After.alpha = 1;
        this.imageWaterUp1AfterTemp.alpha = 0;
        this.imageWaterUp2AfterTemp.alpha = 0;

        this.imageWaterDown1.alpha = 1;
        this.imageWaterDown2.alpha = 1;
        this.imageWaterDown1Temp.alpha = 0;
        this.imageWaterDown2Temp.alpha = 0;

        this.imageWaterDown2After1.alpha = 1;
        this.imageWaterDown2After2.alpha = 1;
        this.imageWaterDown2After1Temp.alpha = 0;
        this.imageWaterDown2After2Temp.alpha = 0;
    }

    /**变色图片的动画 */
    private changeColorAni() {
        let nTimeOver = 0;
        //背景和云
        Laya.Tween.to(this.image2up, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.image2yun, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.image2Temp, { alpha: 1 }, nTimeOver);
        Laya.Tween.to(this.image2yunTemp, { alpha: 1 }, nTimeOver);
        //水
        Laya.Tween.to(this.imageWaterUp1, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterUp2, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterUp1Temp, { alpha: 1 }, nTimeOver);
        Laya.Tween.to(this.imageWaterUp2Temp, { alpha: 1 }, nTimeOver);

        Laya.Tween.to(this.imageWaterUp1After, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterUp2After, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterUp1AfterTemp, { alpha: 1 }, nTimeOver);
        Laya.Tween.to(this.imageWaterUp2AfterTemp, { alpha: 1 }, nTimeOver);

        Laya.Tween.to(this.imageWaterDown1, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterDown2, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterDown1Temp, { alpha: 1 }, nTimeOver);
        Laya.Tween.to(this.imageWaterDown2Temp, { alpha: 1 }, nTimeOver);

        Laya.Tween.to(this.imageWaterDown2After1, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterDown2After2, { alpha: 0 }, nTimeOver);
        Laya.Tween.to(this.imageWaterDown2After1Temp, { alpha: 1 }, nTimeOver);
        Laya.Tween.to(this.imageWaterDown2After2Temp, { alpha: 1 }, nTimeOver);
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