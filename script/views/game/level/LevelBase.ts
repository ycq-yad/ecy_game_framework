import AnimationManager from "../../../manager/AnimationManager";
import SoundManager from "../../../common/SoundManager";
import { PopChooseScene } from "../PopChooseScene";
import GameHomeView from "../../GameHomeView";
import ViewChangeManager from "../../../games/ViewChangeManager";
import FailEntryTwoView from "../FailEntryTwoView";
import GameStateManager from "../../../games/GameStateManager";
import { EnterGameType } from "../../../games/CommonDefine";
import SuccessfulEntryThreeView from "../SuccessfulEntryThreeView";
import { PlayerDataManager } from "../../../common/GameDataManager";
import GameView from "../../GameView";
import { LevelManager } from "../../../manager/LevelManager";
import FailEntryOneView from "../FailEntryOneView";
import ConfigManager from "../../../games/ConfigManager";
import SuccessfulEntryOneView from "../SuccessfulEntryOneView";
import { MiniManeger } from "../../../minigame/MiniManeger";
import GameLogicProcessingManager from "../../../games/GameLogicProcessingManager";
import ShareRecordVideoView from "../ShareRecordVideoView";
import { GameData } from "../../../common/GameData";
import MoreGameOperRequest from "../MoreGameOperRequest";
import SuccessfulEntryOneViewTwo from "../SuccessfulEntryOneViewTwo";
import VentonesangerView from "../VentonesangerView";
import MoreGameView from "../moregame/MoreGameView";

/**
 * 第一关
 */
export class LevelBase extends BaseSceneUISkin {
    className_key = "LevelScene";

    public constructor(data_) {
        super();
        this.viewData_ = this.mapData = data_;
        // this.skin = 'game/Level1Scene.json';
    }
    public box_player: Laya.Box;
    public boxDialog: Laya.Box;
    //场景的动画
    public box_enb: Laya.Box;

    //是否返回了主界面
    public bReturbToHome: boolean;

    //动画是否已经销毁
    public bAniDestory: boolean = false;

    //场景移动的动画
    public box_game: Laya.Box;
    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated(): void {
        console.log(this.className_key + " childrenCreated!!");
        this.createLabelIcon();
        this.initView();
        this.addEvent();
    }

    /**
     * 初始化角色播放状态
     */
    public async initPlayerStatus() {
        if (this.mapData.player.status) {
            (!this.ani_player) && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
            if (this.box_player.getChildIndex(this.ani_player) == -1) {
                this.ani_player.x = this.mapData.player.status.x;
                this.ani_player.y = this.mapData.player.status.y;
                this.box_player.addChild(this.ani_player);
                this.ani_player.play(this.mapData.player.status.aniN, this.mapData.player.status.loop);
            }
        }
    }

    public icon_showLabel: Laya.Image;
    public lableValue: Laya.Label;
    public createLabelIcon() {
        let skin = 'resource/assets/img/ui/game/gameinterface_baseboard_8.png';
        this.icon_showLabel = new Laya.Image();
        this.icon_showLabel.skin = skin;
        // icon_showLabel.centerY = -300;
        // icon_showLabel.x = 190;
        this.icon_showLabel.visible = false;
        //this.icon_showLabel.zOrder = 10;

        this.lableValue = new Laya.Label();
        this.lableValue.centerX = 0;
        this.lableValue.centerY = -25;
        this.lableValue.fontSize = 30;
        this.lableValue.wordWrap = true;
        this.lableValue.width = 250;
        this.icon_showLabel.addChild(this.lableValue);
        //this.box_game.addChild(this.icon_showLabel)
        this.boxDialog.addChild(this.icon_showLabel)
    }
    /**
     * 节点索引
     */
    public index: number = 0;

    public mapData: any;
    public setData(data) {
        this.viewData_ = data;
        this.mapData = data;
    }
    /**
     * 展示对话框的场景
     */
    public showLabelObj = {};
    /**
     * 声音
     */
    public showSoundObj = {};

    /**已经播放的音效名称 */
    public listPlayedSoundName = [];


    public aniArr: Laya.Skeleton[] = [];

    /**GameView */
    public pGameView: GameView;

    /**初始化游戏相关信息 */
    public initView() {
        this.bReturbToHome = false;
        this.index = 0;
        this.box_player.x = (this.index) * 1080;
        this.box_game.x = (this.index) * -1080;
        //清理动画
        this.destroyAni();
        //清理声音
        this.showSoundObj = [];
        this.listPlayedSoundName = [];
        if (this.pGameView) {
            this.pGameView.removeSelf();
        }
        this.pGameView = null;
        // if (this.popChooseScene == null) {
        //     this.popChooseScene = new PopChooseScene();
        //     this.addChild(this.popChooseScene);
        // }
        // this.popChooseScene.visible = false;

        this.box_player.removeChildren();
        this.box_enb.removeChildren();

        ViewChangeManager.getInstance().CurLevelBase = this;
        this.refreshViewInLevel();
        this.bAniDestory = false;
    }

    public localAniName: string = null;

    public ani_player: Laya.Skeleton;

    /**
     * 播放动画
     */
    public playAni(aniName: any, callBack: Function, isLoop = false) {
        //console.log("aniName>>>>>>>>>>>>", aniName, "curtime = ", GameLogicProcessingManager.GetCurTime());
        this.localAniName = aniName;
        if (this.ani_player != null) {
            // this.ani_player.player.stop() ;
            this.ani_player.visible = true;
            if (callBack) {
                this.ani_player.player.off(Laya.Event.STOPPED, this, this.onComplete)
                this.ani_player.player.once(Laya.Event.STOPPED, this, this.onComplete, [aniName, callBack])
            }
            this.ani_player.play(aniName, isLoop);

        } else {
            callBack && callBack(aniName)

        }
    }
    public onComplete(aniName: string, callBack: Function) {
        //console.log("onComplete aniName =", aniName, "curtime = ", GameLogicProcessingManager.GetCurTime());
        callBack && callBack(aniName);
    }

    /**
     * 创建龙骨动画
     * @param url 1
     */
    public async createSkeleton(url: string): Promise<Laya.Skeleton> {
        return new Promise<Laya.Skeleton>((resolve) => {
            AnimationManager.instance.showSkeletonAnimation(url, (boomAnimation: Laya.Skeleton) => {
                // this.addChild(boomAnimation);
                boomAnimation.player.playbackRate = 1;
                boomAnimation.autoSize = true;
                // boomAnimation.pivotX = boomAnimation.width / 2;
                // boomAnimation.pivotY = boomAnimation.height / 2;
                boomAnimation.scale(1, 1);
                // boomAnimation.play(0, true);
                this.aniArr.push(boomAnimation);
                resolve(boomAnimation);
            }, 1);
        })

    }
    public localData = null
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
                    //alert('win');
                    this.onSuccess();
                    return
                } else if (this.localData.isWin == 2) {//失败
                    // this.popChooseScene.showResultIcon(false)
                    this.pGameView.showResultIcon(false);
                    /// alert('fail');
                    //按要求延时1秒弹出窗口
                    Laya.timer.once(1000, this, () => {

                        this.onFail();
                    })

                    return

                }
                this.playAni(this.localData.next, () => {
                    this.onPlayOnce();
                });

            }
        }
    }
    //public popChooseScene: PopChooseScene;
    /**
     * 弹出选择框
     */
    public popChoose() {
        console.log("int pop choose!")
        if (!this.pGameView) {
            return;
        }
        let self = this;
        // this.popChooseScene.visible = true;
        // this.mouseEnabled = true;
        // this.popChooseScene.setData({
        //     data: this.mapData.player.choose, callBack: (right: boolean, aniName: string) => {
        //         self.callBack(right, aniName);
        //     }
        // })
        this.pGameView.showChoseView({
            data: this.mapData.player.choose[this.index], callBack: (right: boolean, aniName: string) => {
                self.callBack(right, aniName);
            }
        })
    }

    /**
     * 游戏开始
     */
    public onStart() {
        let start = this.mapData.player.start;
        this.localData = this.mapData.player.ani[start[this.index]];
        //console.log("11111 this.index = ", this.index, "this.localData = ", this.localData);
        let bFlag = false;
        // if(this.localData.loop){
        //     bFlag = this.localData.loop;
        // // }
        this.playAni(this.localData.aniName, () => {
            this.onPlayOnce();
        }, bFlag);
    }

    /**
     *选择回调
     */
    public callBack(right: boolean, aniName: string) {
        if (right) {
            //this.popChooseScene.showResultIcon(right)
            if (this.index < this.mapData.player.choose.length) {
                this.index++;
            }
            //刷新下进度
            this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
            this.pGameView.showResultIcon(right);
        } else {

        }
        this.playAni(aniName, () => {
            this.onPlayOnce();
        });
    }

    public onPlayLabel(evt: { audioValue: string, floatValue: number, intValue: number, name: string, stringValue: number, time: number }) {
        if (this.bAniDestory) return;
        // sound_girlafraid_1
        if (evt.name != 'undefined' || evt.name != undefined || evt.name != null) {
            // console.log(evt.name);
            if (evt.name.indexOf('sound') > -1) {
                let soundArr = evt.name.split('_');
                let count = soundArr[2];
                let soundName = soundArr[1];
                let index = null
                let soundObj = this.showSoundObj[this.localAniName];
                if (soundObj == null) {
                    soundObj = {}
                    index = 1;
                    if (Number(count) == 0) {
                        (count) = 1 + '';
                    }
                } else {
                    index = soundObj[soundName];
                    if (index == null) {
                        index = 1;
                        if (Number(count) == 0) {
                            (count) = 1 + '';
                        }
                    } else {
                        if (Number(count) == 0) {
                            (count) = 1 + '';
                        } else {
                            return;
                        }
                    }
                }
                //没有播过的音效记录下名称
                let pData = soundObj[soundName];
                if (!pData) {
                    this.listPlayedSoundName.push(soundName);
                }
                soundObj[soundName] = index
                this.showSoundObj[this.localAniName] = soundObj

                //console.log('播放声音', count, soundName);
                // Laya.SoundManager.playSound();
                SoundManager.getInstance().playEffect(soundName, Number(count))
            } else if (evt.name.indexOf('show') > -1) {
                let showArr = evt.name.split("_");
                let id = showArr[1];
                if (!this.showLabelObj[id]) {
                    this.showLabelObj[id] = true;
                    this.showLabelView(parseInt(id));
                }
            }
        }
    }

    /**
     * 展示对话框
     */
    public showLabelView(id: number) {
        let self = this;
        if (self.icon_showLabel) {
            Laya.timer.clearAll(self.icon_showLabel);
            let stAnyData = ConfigManager.getInstance().getDialogInfo(id);
            if (stAnyData) {

                if (stAnyData.nR == 1) {
                    self.icon_showLabel.scaleX = -1;
                    self.lableValue.scaleX = -1;
                } else {
                    self.icon_showLabel.scaleX = 1;
                    self.lableValue.scaleX = 1;
                }

                self.icon_showLabel.x = stAnyData.nX;
                self.icon_showLabel.y = stAnyData.nY;
                console.log("len = ", stAnyData.desc.length);
                let nWith = stAnyData.desc.length * 30;
                if (nWith > 250) {
                    nWith = 250;
                }
                self.lableValue.width = nWith;
                self.lableValue.text = stAnyData.desc;
                self.icon_showLabel.visible = true;

                Laya.timer.once(1000, self.icon_showLabel, (icon_showLabel) => {
                    icon_showLabel.visible = false;
                }, [self.icon_showLabel]);
            }
        }
    }
    /**
     * 销毁动画
     */
    public destroyAni() {
        this.bAniDestory = true;
        let aniArr = this.aniArr;
        let len = aniArr.length;
        for (let i = 0; i < len; i++) {
            let ani = aniArr[i];
            if (ani) {
                Laya.loader.clearRes(ani.url);
                ani.stop();
                ani.removeSelf();
                ani.destroy(true);
            }
            ani = null;
        }
        aniArr.splice(0, len);
        this.showLabelObj = {};
        this.ani_player = null;
    }

    /**摧毁音效 */
    public destorySound() {
        let nLen = this.listPlayedSoundName.length;
        for (let i = 0; i < nLen; ++i) {
            SoundManager.getInstance().destoryOneSound(this.listPlayedSoundName[i]);
        }
    }

    public addEvent() {

    }

    public removeEvent() {

    }

    public removeSelf() {
        // GameManager.instance.showTopBar(ShowType.showAll)
        return super.removeSelf();
    }
    /**
    * 当从父节点移除时候
    */
    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
        //增加销毁动画
        this.destroyAni();
        //增加销毁音效
        //this.destorySound();
    }

    /**显示GameHome游戏界面 */
    public showGameHome() {
        this.initPlayerStatus();
        ViewManager.getInstance().showView(GameHomeView);
    }

    /**显示Game*/
    public showGameView() {

    }

    /**游戏逻辑控制 */
    public startGame() {
        ViewChangeManager.getInstance().CommonView.removeBtEvent();
        //开启录制视频
        MiniManeger.instance.StartRecorderVideo();
        this.bReturbToHome = false;
        this.pGameView = ViewManager.getInstance().showView(GameView) as GameView;
        this.pGameView.startVideoImage();
        this.pGameView.refreshChoose();
        this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
        if (!PlayerDataManager.getInstance().checkDyLogIndexrecorded(PlayerDataManager.getInstance().getCurLevelToChallenge())) {
            ViewChangeManager.getInstance().startGame();
        }
    }

    /**停止游戏 */
    public stopGame() {

    }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        //开启录制视频
        MiniManeger.instance.StartRecorderVideo();
        this.bReturbToHome = false;
        this.showSoundObj = [];
        this.showLabelObj = [];
        //this.pGameView  = ViewManager.getInstance().showView(GameView) as GameView;
        if (this.pGameView) {
            this.pGameView.startVideoImage();
            this.pGameView.hideChoseView();
            this.pGameView.refreshChoose();
            this.pGameView.refreshUpIndeInfo(this.index, this.mapData.player.choose.length);
        } else {
            console.error("can not find pGameView!");
        }
    }


    /**返回主页 */
    public returnToGameHome() {
        MiniManeger.instance.StopVideo();
        this.bReturbToHome = true;
        //Laya.Tween.clearAll(this);
        //增加销毁动画
        this.destroyAni();
        //返回主界面关闭对话框
        if (this.icon_showLabel) {
            this.icon_showLabel.visible = false;
        }
        //如果当前就是最大关卡
        if (PlayerDataManager.getInstance().getCurLevelToChallenge() == PlayerDataManager.getInstance().getLevelToChangeMaxLevel()) {
            this.initView();
        } else {
            //打开别的界面前先删除自己的游戏界面
            if (this.pGameView) {
                this.pGameView.removeSelf();
            }
            this.pGameView = null;
            GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_GameHome;
            LevelManager.getInstance().createLevelScene(PlayerDataManager.getInstance().getLevelToChangeMaxLevel());
        }
    }

    /**一些必要的数据清理 */
    public clearData() {
        this.box_player.removeChildren();
        this.box_enb.removeChildren();
    }

    /**游戏成功 */
    public onSuccess() {
        if (DeviceUtil.isTTMiniGame()) {
            MiniManeger.instance.saveCallF = () => {
                if (MiniManeger.instance.strVideoPatch && MiniManeger.instance.strVideoPatch != "") {
                    ViewChangeManager.getInstance().showBufferLoadingView();
                    ResUtil.getIntance().loadGroups(["share"], () => {
                        ViewChangeManager.getInstance().hideBufferLoadingView();
                        ViewManager.getInstance().showView(ShareRecordVideoView);
                    });
                } else {
                    if (BaseConst.infos.gameInfo.openPsAward == 1 && ConfigManager.getInstance().getTreasureByCurLevel() == 1) {
                        ViewManager.getInstance().showView(SuccessfulEntryOneView);
                    } else {
                        ViewManager.getInstance().showView(SuccessfulEntryThreeView);
                    }
                }
                MiniManeger.instance.saveCallF = null;
            };
        }
        //关闭录制视频
        MiniManeger.instance.StopVideo();
        if (this.bReturbToHome) {
            return;
        }
        console.log("Level Success!")
        // if(PlayerDataManager.getInstance().getCurLevel() >= PlayerDataManager.getInstance().getCurLevelMax()){
        if (DeviceUtil.isQQMiniGame()) {
            let nRealIndex = PlayerDataManager.getInstance().getCurLevel();
            if (BaseConst.infos.gameInfo.ventonesLevel != 0 && nRealIndex % BaseConst.infos.gameInfo.ventonesLevel == 0) {
                ViewManager.getInstance().showView(VentonesangerView);
            } else if (ConfigManager.getInstance().getTreasureByCurLevel() == 1) {
                if (Math.random() < BaseConst.infos.gameInfo.boxWDJ) {//qq使用概率配置
                    ViewManager.getInstance().showView(SuccessfulEntryOneView);
                } else {
                    ViewManager.getInstance().showView(SuccessfulEntryThreeView);
                }
            } else {
                ViewManager.getInstance().showView(SuccessfulEntryThreeView);
            }

        } else if (DeviceUtil.isTTMiniGame()) {
            // 等待保存当前录制视频完成后执行回调
            // 特殊处理录制时间达上限的情况
            if (MiniManeger.instance.nRecordTimeReal >= MiniManeger.instance.nRecordTime * 1000) {
                MiniManeger.instance.saveCallF && MiniManeger.instance.saveCallF();
            }
        } else {
            // if(DeviceUtil.isWXMiniGame()){
            //     MoreGameOperRequest.bOperFlag = true;
            //     MoreGameOperRequest.bSuccess  = true;

            // }else{
            //2020.7.13-1-1  1.从第4关后，每关开始游戏都会弹砸金蛋误点。
            if (!MiniManeger.instance.isWxMiniGameForOperReq()) {
                if (BaseConst.infos.gameInfo.openPsAward == 1 && ConfigManager.getInstance().getTreasureByCurLevel() == 1) {
                    ViewManager.getInstance().showView(SuccessfulEntryOneView);
                } else {
                    if (PlayerDataManager.getInstance().getCurLevelToChallenge() % 2 == 1) {
                        console.log("PlayerDataManager.getInstance().getCurLevelToChallenge() = ", PlayerDataManager.getInstance().getCurLevelToChallenge());
                        ViewManager.getInstance().showView(SuccessfulEntryOneViewTwo);
                    } else {
                        ViewManager.getInstance().showView(SuccessfulEntryThreeView);
                    }
                }
            } else {
                //2020.7.13-5
                if (LevelManager.getInstance().nCurLevel >= 3) {
                    MoreGameView.bSuccess = true;
                    ViewManager.getInstance().showView(MoreGameView);
                } else {
                    ViewManager.getInstance().showView(SuccessfulEntryThreeView);
                }
                //2020.7.13-2
                this.pGameView.closeWeCatMoreGameView();
                PlayerDataManager.getInstance().nGotoLevel = 0;
            }

            //}
        }
        if (!PlayerDataManager.getInstance().checkDyLogIndexrecorded(PlayerDataManager.getInstance().getCurLevelToChallenge())) {
            ViewChangeManager.getInstance().endGame();
            PlayerDataManager.getInstance().recordDyLogIndex(PlayerDataManager.getInstance().getCurLevelToChallenge());
        }

    }

    /**游戏失败 */
    public onFail() {
        //关闭录制视频
        MiniManeger.instance.StopVideo();
        if (this.bReturbToHome) {
            return;
        }
        //2020.7.13-2
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.pGameView.closeWeCatMoreGameView();
            PlayerDataManager.getInstance().nGotoLevel = 0;
        }
        console.log("Level Fail!");
        ViewManager.getInstance().showView(FailEntryOneView);
        if (!PlayerDataManager.getInstance().checkDyLogIndexrecorded(PlayerDataManager.getInstance().getCurLevelToChallenge())) {
            ViewChangeManager.getInstance().endGame();
            PlayerDataManager.getInstance().recordDyLogIndex(PlayerDataManager.getInstance().getCurLevelToChallenge());
        }
    }

    /**关闭游戏界面 */
    public closeGameView() {
        if (this.pGameView) {
            this.pGameView.removeSelf();
            this.pGameView = null;
        }
    }

    /**刷新关卡中的界面 */
    public refreshViewInLevel() {
        let nCurState = GameStateManager.getInstance().levelState;
        if (nCurState == EnterGameType.enum_EnterGameType_GameHome) {
            this.showGameHome();
            if (this.pGameView) {
                this.pGameView.removeSelf();
            }
        } else {
            if (nCurState == EnterGameType.enum_EnterGameType_Next
                || nCurState == EnterGameType.enum_EnterGameType_ChooseLevel) {
                this.startGame();
            }
        }
    }

    /**获取当前的选择信息 */
    public getCurChooseInfo(): any {
        return this.mapData.player.choose[this.index];
    }

    /**关卡显示*/
    public levelOnShow() {

    }

    /**关卡隐藏 */
    public levelOnHide() {

    }
}