import { GameData } from "../../common/GameData";
import MoreGameOperReqIndex from "./MoreGameOperReqIndex";
import PlatformDY from "../../../PlatformDY";
import ViewChangeManager from "../../games/ViewChangeManager";
import { MiniManeger } from "../../minigame/MiniManeger";
import FailEntryOneView from "./FailEntryOneView";
import SuccessfulEntryOneView from "./SuccessfulEntryOneView";
import SuccessfulEntryThreeView from "./SuccessfulEntryThreeView";
import ConfigManager from "../../games/ConfigManager";
import FailEntryTwoView from "./FailEntryTwoView";
import { PlayerDataBase, PlayerDataManager } from "../../common/GameDataManager";
import { GoodsType, EnterGameType } from "../../games/CommonDefine";
import AddPsView from "./AddPsView";
import GameStateManager from "../../games/GameStateManager";
import { LevelManager } from "../../manager/LevelManager";
import WeCatOperReqItem713 from "./WeCatOperReqItem713";
import WeCatMoreGameItemOne713 from "./WeCatMoreGameItemOne713";
import MoreGameOperRequestTwo from "./MoreGameOperRequestTwo";
import MoreGameView from "./moregame/MoreGameView";

export default class MoreGameOperRequestTemp extends BaseSceneUISkinPopView {
    className_key = "MoreGameOperRequestTemp";
    public imageBtReturn: Laya.Image;
    public imageBtConGame: Laya.Image;
    public moreGamePanel: Laya.Box;
    public lableTitle: Laya.Label;
    private nRandomIndxe: number;
    private panel_gamelist: Laya.Panel;
    private moreGamePanel2: Laya.Box;

    public static nOpenNum:number;

    constructor() {
        super();
        this.skin = "game/uiView/MoreGameOperRequestTemp.json";
        this.nRandomIndxe = 0;
        MoreGameOperRequestTemp.nOpenNum = 0;
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        // this.moreGamePanel.height = Laya.stage.height - (1920 - 1640);
        this.panel_gamelist.height = Laya.stage.height - (1920 - 1640);
        // this.initView();
        // this.addEvent();
    }

    onAddStage(): void {
        MoreGameOperRequestTemp.nOpenNum += 1;
        super.onAddStage();
        MiniManeger.instance.hideBanner();
        if (this.isCreate) {
            this.initView();
            this.addEvent();
        }

        if ((MoreGameOperRequestTemp.nOpenNum>=2 ||!PlayerDataManager.getInstance().bIsNewPlayer) && BaseConst.infos.gameInfo.openPsAward == 1) {
            this.timerChangerImage();
        } else {
            this.changeImage();
        }
    }

    private bContinue: boolean = false;
     /**5秒后变化图标 */
     private timerChangerImage() {
        this.imageBtConGame.skin = "resource/assets/img/wecat/box_button_2.png";
        this.bContinue = false;
        Laya.timer.clear(this, this.changeImage);
        Laya.timer.once(5000, this, this.changeImage);
    }
    private changeImage() {
        this.imageBtConGame.skin = "resource/assets/img/wecat/box_button_3.png";
        this.bContinue = true;
    }

    private onSpeical() {
        if (this.bContinue) {
           this.removeSelf();
        } else {
            this.goToGame();
        }
    }

    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
    }

    private addEvent() {
        this.imageBtReturn.on(Laya.Event.CLICK, this, this.onBackTemp);
        this.imageBtConGame.on(Laya.Event.CLICK, this, this.onSpeical);
        this.panel_gamelist.on(Laya.Event.MOUSE_DOWN, this, this.mousedown);
    }
    private nStartY: number = 0;
    protected mousedown(evt: Laya.Event) {
        this.nStartY = evt.currentTarget.mouseY;
        let self = this;
        function mouseMove(evt1: Laya.Event) {
            let nYTemp = self.nStartY - evt1.currentTarget.mouseY;
            self.moreGamePanel.y -= nYTemp;
            self.moreGamePanel2.y -= nYTemp;
            self.nStartY = evt1.currentTarget.mouseY;

            if (self.moreGamePanel.y >= 0 && self.moreGamePanel2.y >= 0) {
                self.moreGamePanel.y = 0;
                self.moreGamePanel2.y = self.moreGamePanel.height;
            }
        }
        function mouseUp(evt1: Laya.Event) {
            this.panel_gamelist.off(Laya.Event.MOUSE_MOVE, this, mouseMove);
            this.panel_gamelist.off(Laya.Event.MOUSE_UP, this, mouseUp);
        }
        this.panel_gamelist.on(Laya.Event.MOUSE_MOVE, this, mouseMove);
        this.panel_gamelist.on(Laya.Event.MOUSE_UP, this, mouseUp);
    }

    private removeEvent() {
        this.imageBtReturn.off(Laya.Event.CLICK, this, this.onBackTemp);
        this.imageBtConGame.off(Laya.Event.CLICK, this, this.onSpeical);
    }
  
    //2020.7.13-5
    private initView() {
        Laya.timer.clear(this, this.onMove);
        //ViewChangeManager.getInstance().CommonView.visible = false;
        let nXStart = 0;
        let nYStart = 0;
        let nCount = 3;
        let aryInfo: number[] = [];
        aryInfo = this.getRandomIndex(18);
        this.moreGamePanel.removeChildren();
        this.moreGamePanel.y = 0;
        for (let i = 0; i < aryInfo.length; ++i) {//WeCatMoreGameItemOne MoreGameOperReqIndex
            let pWeCatMoreGameItemOne: WeCatMoreGameItemOne713 = this.moreGamePanel.getChildAt(i) as WeCatMoreGameItemOne713;
            if (pWeCatMoreGameItemOne) {
                pWeCatMoreGameItemOne.setData(aryInfo[i]);
            } else {
                pWeCatMoreGameItemOne = new WeCatMoreGameItemOne713(aryInfo[i]);

                let nAddX = Math.floor(i % nCount);
                let nYAdd = Math.floor(i / nCount);
                pWeCatMoreGameItemOne.x = nXStart + pWeCatMoreGameItemOne.width * nAddX + 30 * nAddX;
                pWeCatMoreGameItemOne.y = nYStart + pWeCatMoreGameItemOne.height * nYAdd + 10 * nYAdd;
                this.moreGamePanel.addChild(pWeCatMoreGameItemOne);
                this.moreGamePanel.height = pWeCatMoreGameItemOne.y + pWeCatMoreGameItemOne.height;
            }
        }
        this.moreGamePanel2.y = this.moreGamePanel.height;
        this.moreGamePanel2.removeChildren();
        for (let i = 0; i < aryInfo.length; ++i) {//WeCatMoreGameItemOne MoreGameOperReqIndex
            let pWeCatMoreGameItemOne: WeCatMoreGameItemOne713 = this.moreGamePanel2.getChildAt(i) as WeCatMoreGameItemOne713;
            if (pWeCatMoreGameItemOne) {
                pWeCatMoreGameItemOne.setData(aryInfo[i]);
            } else {
                pWeCatMoreGameItemOne = new WeCatMoreGameItemOne713(aryInfo[i]);

                let nAddX = Math.floor(i % nCount);
                let nYAdd = Math.floor(i / nCount);
                pWeCatMoreGameItemOne.x = nXStart + pWeCatMoreGameItemOne.width * nAddX + 30 * nAddX;
                pWeCatMoreGameItemOne.y = nYStart + pWeCatMoreGameItemOne.height * nYAdd + 10 * nYAdd;
                this.moreGamePanel2.addChild(pWeCatMoreGameItemOne);
                this.moreGamePanel2.height = pWeCatMoreGameItemOne.y + pWeCatMoreGameItemOne.height
            }
        }

        //2020.6.2运营需求  每次使用后刷新下游戏列表
        if (BaseConst.infos.gameInfo.isDY) {
            PlatformDY.refreshGameList();
        }

        Laya.timer.frameLoop(1, this, this.onMove);
    }

    public onMove() {
        let nHight = this.moreGamePanel.height;
        this.moreGamePanel2.y -= 2;
        this.moreGamePanel.y -= 2;
        if (this.moreGamePanel.y <= -nHight) {
            this.moreGamePanel.y = this.moreGamePanel2.y + nHight;
        }
        if (this.moreGamePanel2.y <= -nHight) {
            this.moreGamePanel2.y = this.moreGamePanel.y + nHight;
        }
    }

    private onBackTemp(){
        MoreGameView.bSpeical = true;
        ViewManager.getInstance().showView(MoreGameView);
    }

    //2020.7.13-5
    private onBack() {
        
    }

    private goToGame() {

        //this.onClickOper();
        if (GameData.getInstance().weCatMiniIconsInfo.length <= 0) {
            return;
        }
        this.nRandomIndxe = Utils.random(0, GameData.getInstance().weCatMiniIconsInfo.length - 1);
        //嘟游
        if (BaseConst.infos.gameInfo.isDY) {
            PlatformDY.clickGame(GameData.getInstance().weCatMiniIconsInfo[this.nRandomIndxe].ad_id);
        }
        let self = this;
        let data = {
            appId: GameData.getInstance().weCatMiniIconsInfo[self.nRandomIndxe].ad_appid,
            path: GameData.getInstance().weCatMiniIconsInfo[self.nRandomIndxe].url,
            success: function () {
                console.log("navigateToMiniProgram success");
                //嘟游
                if (BaseConst.infos.gameInfo.isDY) {
                    console.log("self.nIndex = ", self.nRandomIndxe);
                    PlatformDY.toGame(GameData.getInstance().weCatMiniIconsInfo[self.nRandomIndxe].ad_id);
                }
            },
            fail: function (e) {
                console.log("navigateToMiniProgram fail e =", e); //嘟游
                ViewManager.getInstance().showView(MoreGameOperRequestTemp);
            }
        };
        platform.navigateToMiniProgram(data);
    }

    private getRandomIndex(nMax: number): number[] {
        if (GameData.getInstance().weCatMiniIconsInfo.length - 1 < 0) {
            return [];
        }
        let nRandom = Utils.random(0, GameData.getInstance().weCatMiniIconsInfo.length - 1);
        let nCount = GameData.getInstance().weCatMiniIconsInfo.length % 3;
        if (nCount > 0) {
            nCount = 3 - nCount;
        }

        nCount = GameData.getInstance().weCatMiniIconsInfo.length + nCount;
        if (nCount <= nMax) {
            nCount = nMax;
        }
        let aryInfo: number[] = [];
        for (let i = 0; i < nCount; ++i) {
            aryInfo.push(nRandom);
            nRandom += 1;
            if (nRandom >= GameData.getInstance().weCatMiniIconsInfo.length) {
                nRandom = 0;
            }
        }
        return aryInfo;
    }
}