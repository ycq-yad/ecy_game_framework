import { LevelBase } from "./LevelBase";
import { PopChooseScene } from "../PopChooseScene";
import GameStateManager from "../../../games/GameStateManager";
import { EnterGameType } from "../../../games/CommonDefine";
import GameView from "../../GameView";
import ViewChangeManager from "../../../games/ViewChangeManager";

/**第六关 */
export class LevelScene6 extends LevelBase {
    className_key = "LevelScene6";

    public box_game: Laya.Box;
    public box_enb: Laya.Box;
    public box_enb1: Laya.Box;
    public box_player: Laya.Box;
    public box_enbyan2: Laya.Box;
    public box_enbyan3: Laya.Box;
    public box_enbyan4: Laya.Box;
    public box_enbhuo3: Laya.Box;
    public box_enbhuo2: Laya.Box;

    //过场动画的ui
    public box_Animatedscenes: Laya.Box;
    public imageBg: Laya.Image;
    public imageMot: Laya.Image;
    public imageShip: Laya.Image;
    public imageWaterBotton1: Laya.Image;
    public imageWaterBotton2: Laya.Image;
    public imageWaterBlue1: Laya.Image;
    public imageWaterBlue2: Laya.Image;
    public boxBg: Laya.Box;

    //public ani_bgTem:Laya.Skeleton;
    public ani_bg: Laya.Skeleton;
    public ani_bg2: Laya.Skeleton;
    public ani_bg3: Laya.Skeleton;
    public ani_bg4: Laya.Skeleton;

    private nAddTemp: number;

    public constructor(data_) {
        super(data_);
        this.nAddTemp = 0;
        this.skin = "game/level/LevelScene6.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public initView() {
        this.stopAni();
        super.initView();
        this.nAddTemp = 0;
        this.box_enb.removeChildren();
        this.box_enb1.removeChildren();
        this.box_player.removeChildren();
        this.box_enbyan2.removeChildren();
        this.box_enbyan3.removeChildren();
        this.box_enbyan4.removeChildren();
        this.box_enbhuo3.removeChildren();
        this.box_enbhuo2.removeChildren();
    }

    public onRemoved() {
        super.onRemoved();
        this.stopAni();
        this.box_enb.removeChildren();
        this.box_enb1.removeChildren();
        this.box_player.removeChildren();
        this.box_enbyan2.removeChildren();
        this.box_enbyan3.removeChildren();
        this.box_enbyan4.removeChildren();
        this.box_enbhuo3.removeChildren();
        this.box_enbhuo2.removeChildren();
    }

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg.x = this.ani_bg.width / 2 + 280;
        this.ani_bg.y = this.ani_bg.height / 2 + 400;
        this.ani_bg.scaleX = 0.35;
        this.ani_bg.scaleY = 0.35;
        this.ani_bg.play("huo1", true);
        this.box_enb.addChild(this.ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = (this.index) * 1080;
        this.box_game.x = (this.index) * -1080;
        // this.ani_bg.on(Laya.Event.LABEL, this, this.onPlayLabel);

        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();

        //播放几个其他的烟
        this.ani_bg2 = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg3 = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg4 = await this.createSkeleton(this.mapData.bg.ani.url);

        this.box_enbyan2.removeChildren();
        this.box_enbyan3.removeChildren();
        this.box_enbyan4.removeChildren();

        this.ani_bg2.x = 0;
        this.ani_bg2.y = this.ani_bg.height / 2 + 600
        this.ani_bg2.play('yan3', true);
        this.box_enbyan2.addChild(this.ani_bg2);

        this.ani_bg3.x = 0;
        this.ani_bg3.y = this.ani_bg.height / 2 + 700
        this.ani_bg3.play('yan4', true);
        this.box_enbyan3.addChild(this.ani_bg3);

        this.ani_bg4.x = 0;
        this.ani_bg4.y = this.ani_bg.height / 2 + 700
        this.ani_bg4.play('yan4', true);
        this.box_enbyan4.addChild(this.ani_bg4);
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        // console.log(evt);\
        super.onPlayLabel(evt);
        if (this.ani_bg && evt.name == "sevent_huo2_1") {
            this.ani_bg.scaleX = 1;
            this.ani_bg.scaleY = 1;
            this.ani_bg.x = this.ani_bg.width / 2 - 66;
            this.ani_bg.y = this.ani_bg.height / 2 + 500;
            this.ani_bg.play('huo2', false);
        }

        if (this.ani_bg2 && evt.name == "sevent_huo2_2") {
            this.ani_bg2.scaleX = 1;
            this.ani_bg2.scaleY = 1;
            this.ani_bg2.x = 0;
            this.ani_bg2.y = this.ani_bg.height / 2 + 150;
            this.ani_bg2.play('huo2', false);
            this.box_enbhuo2.addChild(this.ani_bg2);
        }

        if (this.ani_bg && evt.name == "sevent_huo3_1") {
            this.ani_bg.scaleX = 1;
            this.ani_bg.scaleY = 1;
            this.ani_bg.x = 0;
            this.ani_bg.y = this.ani_bg.height / 2 + 150 + this.nAddTemp;
            this.ani_bg.play('huo3', false);
            this.box_enbhuo3.addChild(this.ani_bg);
        }

        if (this.ani_bg && evt.name == "sevent_yan2_1") {
            this.ani_bg.scaleX = 1;
            this.ani_bg.scaleY = 1;
            this.ani_bg.x = 0;
            this.ani_bg.y = this.ani_bg.height / 2 + 400;
            this.ani_bg.play('yan2', false);
            this.box_enb1.addChild(this.ani_bg);
        }

        if (evt.name == "smove") {
            Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 2500);
            Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 2500);
        }

        if (evt.name == "smove2") {
            Laya.Tween.to(this.box_player, { x: (this.index + 2) * 1080 }, 4880);
            Laya.Tween.to(this.box_game, { x: (this.index + 2) * -1080 }, 4880);
        }
    }

    public callBack(right: boolean, aniName: string) {
        if (right) {
            this.index++;
            //this.popChooseScene.showResultIcon(right);
            //刷新下进度
            this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
            this.pGameView.showResultIcon(right);
            if (aniName == "6-3") {
                Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 + 100 }, 4000);
                Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 4000);
            }
        }
        this.playAni(aniName, () => {
            this.onPlayOnce();
        });
    }

    /**过场动画 */
    private Animatedscenes() {
        this.box_Animatedscenes.visible = true;
        this.box_game.visible = false;
        this.boxBg.alpha = 0;
        this.imageBg.scaleX = 1;
        this.imageBg.scaleY = 1;
        this.imageBg.x = 540;
        this.imageBg.y = -350;

        this.imageMot.scaleX = 1;
        this.imageMot.scaleY = 1;
        this.imageMot.x = 540;
        this.imageMot.bottom = 700;

        this.imageShip.scaleX = 1;
        this.imageShip.scaleY = 1;
        this.imageShip.x = 562;
        this.imageMot.bottom = 750;

        this.imageWaterBlue1.scaleX = 1;
        this.imageWaterBlue1.scaleY = 1;
        this.imageWaterBlue1.x = 540;
        this.imageWaterBlue1.bottom = 500;

        this.imageWaterBlue2.scaleX = 1;
        this.imageWaterBlue2.scaleY = 1;
        this.imageWaterBlue2.x = 1620;
        this.imageWaterBlue2.bottom = 500;

        this.imageWaterBotton1.scaleX = 1;
        this.imageWaterBotton1.scaleY = 1;
        this.imageWaterBotton1.x = 540;
        this.imageWaterBotton1.bottom = 0;

        this.imageWaterBotton2.scaleX = 1;
        this.imageWaterBotton2.scaleY = 1;
        this.imageWaterBotton2.x = 1620;
        this.imageWaterBotton2.bottom = 0;
        let scaleNum = 1.3;
        Laya.Tween.to(this.imageBg, { scaleX: scaleNum, scaleY: scaleNum }, 2000);
        Laya.Tween.to(this.imageMot, { scaleX: scaleNum, scaleY: scaleNum }, 2000);
        Laya.Tween.to(this.imageShip, { scaleX: scaleNum, scaleY: scaleNum }, 2000);
        Laya.Tween.to(this.imageWaterBlue1, { x: -540 }, 2000);
        Laya.Tween.to(this.imageWaterBlue2, { x: 540 }, 2000);
        Laya.Tween.to(this.imageWaterBotton1, { x: -540 }, 2000);
        Laya.Tween.to(this.imageWaterBotton2, { x: 540 }, 2000);

        Laya.timer.once(1800, this, () => {
            Laya.Tween.to(this.boxBg, { alpha: 1 }, 500, null, Laya.Handler.create(this, (args) => {
                this.box_Animatedscenes.visible = false;
                this.boxBg.alpha = 0;
                this.box_game.visible = true;
                this.pGameView = ViewManager.getInstance().showView(GameView) as GameView;
                //刷新下进度
                this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
                this.initPlayer();
            }));
        });
    }

    /**游戏逻辑控制 */
    public startGame() {
        super.startGame();
        this.clearData();
        this.Animatedscenes();
    }

    /**停止游戏 */
    public stopGame() { }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            super.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
            if (this.index == 0) {
                this.box_player.x = ((this.index) * 1080);
                this.box_game.x = ((this.index) * (-1080));
                this.box_enb.removeChildren();
                this.ani_bg.x = this.ani_bg.width / 2 - 270;
                this.ani_bg.y = this.ani_bg.height / 2 - 70;
                this.ani_bg.scaleX = 0.35;
                this.ani_bg.scaleY = 0.35;
                this.ani_bg.play("huo1", true);
                this.box_enb.addChild(this.ani_bg);

                this.box_enbhuo2.removeChildren();
                this.box_enb1.removeChildren();
            } else if (this.index == 1) {
                this.box_enbhuo3.removeChildren();
                this.nAddTemp = 250;
            }
            //场景移动
            this.onStart();
        }
    }

    /**一些必要的数据清理 */
    public clearData() {
        this.box_player.removeChildren();
        this.box_enb.removeChildren();
        this.box_enb1.removeChildren();
        this.box_player.removeChildren();
        this.box_enbhuo3.removeChildren();
        this.box_enbhuo2.removeChildren();
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }
}