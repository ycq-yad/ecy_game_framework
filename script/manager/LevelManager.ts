
import { GameManager } from "./GameManager";
import { LevelScene1 } from "../views/game/level/LevelScene1";
import { LevelScene2 } from "../views/game/level/LevelScene2";
import { LevelScene3 } from "../views/game/level/LevelScene3";
import { LevelScene4 } from "../views/game/level/LevelScene4";
import { LevelScene5 } from "../views/game/level/LevelScene5";
import { LevelScene6 } from "../views/game/level/LevelScene6";
import LevelScene7 from "../views/game/level/LevelScene7";
import LevelScene8 from "../views/game/level/LevelScene8";
import LevelScene9 from "../views/game/level/LevelScene9";
import LevelScene10 from "../views/game/level/LevelScene10";
import LevelScene11 from "../views/game/level/LevelScene11";
import LevelScene12 from "../views/game/level/LevelScene12";
import { PlayerDataManager } from "../common/GameDataManager";
import ViewChangeManager from "../games/ViewChangeManager";
import { MiniManeger } from "../minigame/MiniManeger";
import LevelScene13 from "../views/game/level/LevelScene13";
import LevelScene14 from "../views/game/level/LevelScene14";
import LevelScene16 from "../views/game/level/LevelScene16";
import LevelScene17 from "../views/game/level/LevelScene17";
import LevelScene18 from "../views/game/level/LevelScene18";
import LevelScene19 from "../views/game/level/LevelScene19";
import LevelScene15 from "../views/game/level/LevelScene15";
import { LevelBase } from "../views/game/level/LevelBase";
import LevelScene21 from "../views/game/level/LevelScene21";
import LevelScene22 from "../views/game/level/LevelScene22";
import LevelScene20 from "../views/game/level/LevelScene20";
import { GameData } from "../common/GameData";
import MiniEventConst from "../minigame/MiniEventConst";
import LevelScene23 from "../views/game/level/LevelScene23";
import LevelScene24 from "../views/game/level/LevelScene24";
import LevelScene25 from "../views/game/level/LevelScene25";
import LevelScene26 from "../views/game/level/LevelScene26";
import LevelScene27 from "../views/game/level/LevelScene27";
import LevelScene28 from "../views/game/level/LevelScene28";
import LevelScene29 from "../views/game/level/LevelScene29";
import LevelScene30 from "../views/game/level/LevelScene30";
import LevelScene31 from "../views/game/level/LevelScene31";
import LevelScene32 from "../views/game/level/LevelScene32";
import LevelScene33 from "../views/game/level/LevelScene33";
import LevelScene34 from "../views/game/level/LevelScene34";
import LevelScene35 from "../views/game/level/LevelScene35";
import LevelScene36 from "../views/game/level/LevelScene36";
import LevelScene37 from "../views/game/level/LevelScene37";
import LevelScene40 from "../views/game/level/LevelScene40";
import LevelScene39 from "../views/game/level/LevelScene39";
import LevelScene38 from "../views/game/level/LevelScene38";


export class LevelManager {
    private static ins: LevelManager;

    public static getInstance(): LevelManager {
        if (!this.ins) this.ins = new LevelManager();
        return this.ins;
    }

    /**当前场景 */
    public currentGameScence: LevelBase;

    private levelBaseUrl = 'resource/assets/configs/map/map';

    /*当前关卡 */
    public nCurLevel: number = 0;

    /**修改 */
    /**
     * 创建关卡
     */
    public async createLevelScene(level: number) {
        let classKey: any;
        switch (level) {
            case 1:
                classKey = LevelScene1;
                break
            case 2:
                classKey = LevelScene2;
                break
            case 3:
                classKey = LevelScene3;
                break
            case 4:
                classKey = LevelScene4;
                break
            case 5:
                classKey = LevelScene5;
                break
            case 6:
                classKey = LevelScene6;
                break;
            case 7:
                classKey = LevelScene7;
                break;
            case 8:
                classKey = LevelScene8;
                break;
            case 9:
                classKey = LevelScene9;
                break;
            case 10:
                classKey = LevelScene10;
                break;
            case 11:
                classKey = LevelScene11;
                break;
            case 12:
                classKey = LevelScene12;
                break;
            case 13:
                classKey = LevelScene13;
                break;
            case 14:
                classKey = LevelScene14;
                break;
            case 15:
                classKey = LevelScene15;
                break;
            case 16:
                classKey = LevelScene16;
                break;
            case 17:
                classKey = LevelScene17;
                break;
            case 18:
                classKey = LevelScene18;
                break;
            case 19:
                classKey = LevelScene19;
                break;
            case 21:
                classKey = LevelScene21;
                break;
            case 20:
                classKey = LevelScene20;
                break;
            case 22:
                classKey = LevelScene22;
                break;
            case 23:
                classKey = LevelScene23;
                break;
            case 24:
                classKey = LevelScene24;
                break;
            case 25:
                classKey = LevelScene25;
                break
            case 26:
                classKey = LevelScene26;
                break
            case 27:
                classKey = LevelScene27;
                break
            case 28:
                classKey = LevelScene28;
                break
            case 29:
                classKey = LevelScene29;
                break;
            case 30:
                classKey = LevelScene30;
                break;
            case 31:
                classKey = LevelScene31;
                break;
            case 32:
                classKey = LevelScene32;
                break;
            case 33:
                classKey = LevelScene33;
                break;
            case 34:
                classKey = LevelScene34;
                break;
            case 35:
                classKey = LevelScene35;
                break;
            case 36:
                classKey = LevelScene36;
                break;
            case 37:
                classKey = LevelScene37;
                break;
            case 38:
                classKey = LevelScene38;
                break;
            case 39:
                classKey = LevelScene39;
                break;
            case 40:
                classKey = LevelScene40;
                break;
            default:
                classKey = LevelScene1;
                break
        }
        PlayerDataManager.getInstance().setCurLevel(level - 1);
        MiniManeger.instance.reportMonitorSome(MiniEventConst.GAME_PLAY_LEVEL + "_" + level, 1);//记录每一关玩的次数
        //为了头条的提审 隐藏binner可能会有延迟 
        if (DeviceUtil.isTTMiniGame()) {
            MiniManeger.instance.hideBanner();
        }
        // let mapLevelStr = level;
        // if (mapLevelStr >= 24) {//24关用25关代替
        //     mapLevelStr += 1;
        // }
        let jsonPath = this.levelBaseUrl + level + '.json';
        console.log("jsonPath: ", jsonPath);
        let data = await GameManager.instance.loadCongigs(jsonPath)
        let stGroup = [];
        stGroup.push(level.toString())
        ViewChangeManager.getInstance().showBufferLoadingView();
        let self = this;
        ResUtil.getIntance().loadGroups(stGroup, () => {

            if (self.currentGameScence) {
                self.currentGameScence.destroyAni();
                if (this.nCurLevel != 0) {
                    self.currentGameScence.destroy();
                    //下一关清理上一关卡   //为了一关动画问题的奇怪修改2020.5.29
                    if (this.nCurLevel != level) {
                        let lastLevel = this.nCurLevel;//level - 1;
                        ResUtil.getIntance().destoryGroup("" + lastLevel);
                        Laya.Resource.destroyUnusedResources();
                    }
                }
                self.currentGameScence = null;
            }
            this.nCurLevel = level;
            self.currentGameScence = new classKey(data);
            self.currentGameScence.viewData_ = data;
            self.currentGameScence.mapData = data;
            SceneManager.getInstance().openSceneInstance(self.currentGameScence);
            // SceneManager.getInstance().openGameScene(classKey, data);
            ViewChangeManager.getInstance().hideBufferLoadingView();

            if (DeviceUtil.isQQMiniGame()) {
                if (GameData.getInstance().isNewPlayer && GameData.getInstance().gameQQInfo.levelOpenVideoOpen && level == GameData.getInstance().gameQQInfo.levelOpenVideoOrder) {
                    MiniManeger.instance.playViderAd({
                        successFun: () => {
                            GameData.getInstance().gameQQInfo.levelOpenVideoOpen = false;
                        }
                    })
                }
            }
        });
        Laya.timer.once(2000, this, () => {//进游戏后2s后加载下关资源
            //加载下一关的场景 
            if (level < PlayerDataManager.getInstance().getLevelNumMakeOver()) {
                stGroup = [];
                //为了一关动画问题的奇怪修改2020.5.29
                let nNextLevel = level + 1;
                stGroup.push((nNextLevel).toString());
                ResUtil.getIntance().loadGroups(stGroup);
            }
        });
    }
}