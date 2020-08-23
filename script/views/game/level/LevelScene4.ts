import { LevelBase } from "./LevelBase";
import { PopChooseScene } from "../PopChooseScene";
import ViewChangeManager from "../../../games/ViewChangeManager";

/**
 * 第4关
 */
export class LevelScene4 extends LevelBase {
    className_key = "LevelScene4";

    public constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene4.json";
    }
    public box_enb1: Laya.Box;
    public onAddStage() {
        super.onAddStage();
    }

    public initView() {
        super.initView();
        this.stopAni();
    }

    public callBack(right: boolean, aniName: string) {
        if (right) {
            this.index++;
            //刷新下进度
            this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
            this.pGameView.showResultIcon(right)
        } else {
            if (aniName == "4-5") {
            }
        }
        this.playAni(aniName, () => {
            this.onPlayOnce();
        });
    }
    public async playShandian1() {
        let ani_shandian1 = await this.createSkeleton('resource/assets/img/ani/common/shandian1.sk');
        ani_shandian1.x = ani_shandian1.width + 1080;
        ani_shandian1.y = ani_shandian1.height - 100;
        ani_shandian1.player.once(Laya.Event.STOPPED, this, () => {
            ani_shandian1.visible = false;
        })
        ani_shandian1.play(0, false);
        this.box_enb1.addChild(ani_shandian1);
    }

    public ani_bg: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg.x = this.ani_bg.width;
        this.ani_bg.y = this.ani_bg.height - 100;
        this.ani_bg.play(0, true);
        this.box_enb.addChild(this.ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_player.x = this.index * 1080;
        this.box_game.x = this.index * -1080;
        // this.ani_bg.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();

        let ani_rain = await this.createSkeleton('resource/assets/img/ani/common/rain.sk');
        ani_rain.x = ani_rain.width / 2 + 1080;
        ani_rain.y = ani_rain.height / 2;
        ani_rain.play(0, true);

        this.box_enb.addChild(ani_rain);

        let ani_shandian2 = await this.createSkeleton('resource/assets/img/ani/common/shandian2.sk');
        ani_shandian2.x = ani_shandian2.width + 1080 + 400;
        ani_shandian2.y = 300
        ani_shandian2.play(0, true);
        this.box_enb.addChild(ani_shandian2);
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        // console.log(evt);\
        super.onPlayLabel(evt);
        if (evt.name == "sevent_horses2_1") {
            this.ani_bg.play('horses2', false);
        } else if ("showWinAni" == evt.name) {
            this.ani_bg.play('horses3', false);
        } else if ("sevent_shandian1_1" == evt.name) {
            this.playShandian1()

        }
        else if ("smove" == evt.name) {
            Laya.Tween.to(this.box_player, { x: 1080 }, 5500);
            Laya.Tween.to(this.box_game, { x: -1080 }, 5500);
        }
    }

    public addEvent() { }

    public removeEvent() {
        if (this.ani_player) {
            this.ani_player.off(Laya.Event.LABEL, this, this.onPlayLabel);
        }
    }

    public removeSelf() {
        return super.removeSelf();
    }

    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
        this.stopAni();
        this.box_enb1.removeChildren();
    }

    /**游戏逻辑控制 */
    public startGame() {
        super.startGame();
        this.initPlayer();
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
            //this.destroyAni();
            super.restartGame();
            if (this.index == 0) {
                this.ani_bg.play('horses1', false);
            }
            // this.initPlayer();
            this.box_player.x = ((this.index) * 1080);
            this.box_game.x = ((this.index) * (-1080));
            //场景移动
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }
}