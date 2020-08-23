import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";
import { GameData } from "../../../common/GameData";
import { MiniManeger } from "../../../minigame/MiniManeger";

/**
 * 第5关
 */
export class LevelScene5 extends LevelBase {
    className_key = "LevelScene5";

    public constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene5.json";
    }

    public box_enb1: Laya.Box;
    public onAddStage() {
        super.onAddStage();
 
    }

    public initView() {
        super.initView();
        this.stopAni();
    }

    /**
     * 播放一次后结束的
     */
    public onPlayOnce() {
        this.localData = this.mapData.player.ani[this.localAniName];
        if (this.localData) {//弹出选择
            if (this.localData.pop) {
                this.popChoose();
                if (this.localData.loop) {
                    this.playAni(this.localData.aniName, () => {
                    }, true);
                }
            } else {
                if (this.localData.isWin == 1) {//成功
                    this.onSuccess();
                    return
                } else if (this.localData.isWin == 2) {//失败
                    this.pGameView.showResultIcon(false)
                    //按要求延时1秒弹出窗口
                    Laya.timer.once(1000, this, () => {
                        this.onFail();
                    })
                    return;
                }
                if (this.localData.next) {
                    this.playAni(this.localData.next, () => {
                        this.onPlayOnce();
                    });
                } else {
                    if (this.localData.loop) {
                        this.playAni(this.localData.aniName, () => {
                        }, true);
                    }
                }
            }
        }
    }

    public callBack(right: boolean, aniName: string) {
        if (right) {
            this.index++;
            //刷新下进度
            this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
            this.pGameView.showResultIcon(right);
            if (aniName == '5-4') {
                // this.box_player.x = (this.index + 1) * 1080;
                // this.box_game.x = (this.index + 1) * -1080;
            } else if (aniName == '5-7') {
                this.createDog();
                Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 2170);
                Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 2170);
            }
            else if (aniName == '5-15') {
                this.ani_dog && this.ani_dog.play('gou3', false);
                this.dogName = "gou3";
            }
        } else {
            if (aniName == '5-9') {
                this.ani_dog && this.ani_dog.play('gou2', false);
                this.dogName = "gou2";
            }
        }
        this.playAni(aniName, () => {
            this.onPlayOnce();
        });
    }

    public ani_dog: Laya.Skeleton;

    public dogName = null
    public async createDog() {
        this.box_enb1.removeChildren();
        this.ani_dog = await this.createSkeleton("resource/assets/img/ani/level5/checkpoint5g.sk");
        this.ani_dog.x = this.ani_dog.width / 2 + 1080 * 3 - 300;
        this.ani_dog.y = this.ani_dog.height / 2 + 500;
        this.ani_dog.play('gou1', true);
        this.dogName = "gou1";
        this.ani_dog.player.on(Laya.Event.STOPPED, this, this.onDogPlayend);
        this.ani_dog.on(Laya.Event.LABEL, this, this.onDogPlaySound);
        this.box_enb1.addChild(this.ani_dog);
    }

    public onDogPlaySound(evt) {
        super.onPlayLabel(evt)
        this.ani_dog.off(Laya.Event.LABEL, this, this.onDogPlaySound);
    }

    public onDogPlayend() {
        if (this.dogName == 'gou2') {
            this.playAni('5-12', () => {
                this.onPlayOnce();
            })
        } else if (this.dogName == 'gou3') {
            this.playAni('5-14', () => {
                this.onPlayOnce();
            })
        }
        this.ani_dog.player.off(Laya.Event.STOPPED, this, this.onDogPlayend)
    }

    public ani_bg: Laya.Skeleton;

    public box_enb2: Laya.Box

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.ani_bg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.ani_bg.x = this.ani_bg.width + 1080 + 540;
        this.ani_bg.y = this.ani_bg.height / 2;
        this.ani_bg.play(0, true);
        this.box_enb2.addChild(this.ani_bg);

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;

        this.box_game.x = (this.index) * -1080;

        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();

        let ani_rain = await this.createSkeleton('resource/assets/img/ani/common/rain.sk');
        ani_rain.x = ani_rain.width / 2;
        ani_rain.y = ani_rain.height / 2;
        ani_rain.play(0, true);
        this.box_enb.addChild(ani_rain);

        Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 3250);
        Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 3250);
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        // console.log(evt);
        super.onPlayLabel(evt);
        if (evt.name == "sevent_horses2_1") {
        } else if ("showWinAni" == evt.name) {
        } else if ("smove" == evt.name) {
            Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 2500);
            Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 2500);
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
        this.box_enb2.removeChildren();
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
            // this.initPlayer();
            if (this.index == 0) {
                this.box_player.x = 0;
                this.box_game.x = 0;
                Laya.Tween.to(this.box_player, { x: (this.index + 1) * 1080 }, 3250);
                Laya.Tween.to(this.box_game, { x: (this.index + 1) * -1080 }, 3250);
            } else if (this.index == 1 || this.index == 2) {
                this.box_player.x = ((this.index + 1) * 1080);
                this.box_game.x = ((this.index + 1) * (-1080));
                if (this.index == 2) {
                    this.ani_dog.player.on(Laya.Event.STOPPED, this, this.onDogPlayend)
                }
            }
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