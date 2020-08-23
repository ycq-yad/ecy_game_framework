import { GameData } from "../../common/GameData";
import PlatformDY from "../../../PlatformDY";

export default class MoreGameOperReqIndex extends BaseSceneUISkin {
    className_key = "MoreGameOperReqIndex";
    public imageIcon:Laya.Image;
    public lableGameName:Laya.Label;
    public lableCount:Laya.Label;
    private nIndex:number;
    private stGameIndex:any;
    constructor(data:any) { 
        super(); 
        this.nIndex = data;
        // this.width  = 300;
        // this.height = 380;
        this.skin = "game/uiView/MoreGameOperReqIndex.json";
        this.width  = 300;
        this.height = 380;
    }
    
    onAddStage(): void {
        super.onAddStage();
        this.initView();
        this.addEvent();
    }

    onRemoved(){
        this.removeEvent();
    }

    setData(data: any): void{
        this.nIndex = data;
        this.initView();
    }

    /**初始化界面 */
    private initView(){
        if(this.nIndex < 0 || this.nIndex >= GameData.getInstance().weCatMiniIconsInfo.length){
            this.nIndex = GameData.getInstance().weCatMiniIconsInfo.length - 1;
            if(this.nIndex < 0) return;
        }
        this.lableGameName.text = GameData.getInstance().weCatMiniIconsInfo[this.nIndex].name;
        this.imageIcon.skin     = GameData.getInstance().weCatMiniIconsInfo[this.nIndex].ad_img;
        let nCount =  Utils.random(100000,200000);
        this.lableCount.text = nCount.toString() + "人正在玩";
        this.stGameIndex = GameData.getInstance().weCatMiniIconsInfo[this.nIndex];
    }

    private addEvent(){
        this.on(Laya.Event.CLICK, this, this.gotoGame);
    }

    private removeEvent(){
        this.off(Laya.Event.CLICK, this, this.gotoGame);
    }

    private  gotoGame(){
        if (!DeviceUtil.isWXMiniGame()) return;
        //判断下数据是否存在
        // if(this.nIndex < 0 ||　this.nIndex　>= GameData.getInstance().weCatMiniIconsInfo.length){
        //     return;
        // }
        // let stData = GameData.getInstance().weCatMiniIconsInfo[this.nIndex];
        // if(!stData){
        //     return;
        // }
        //嘟游
        if(BaseConst.infos.gameInfo.isDY){
            PlatformDY.clickGame(this.stGameIndex.ad_id);
        }
        let self = this;
        let data = {
            appId: this.stGameIndex.ad_appid,
            path:this.stGameIndex.url,
            success: function() {
                console.log("navigateToMiniProgram success");
                //嘟游
                if(BaseConst.infos.gameInfo.isDY){
                    console.log("self.nIndex = ",self.nIndex);
                    PlatformDY.toGame(self.stGameIndex.ad_id);
                }
            },
            fail: function(e) {
                console.log("navigateToMiniProgram fail e =",e); //嘟游
            }
        };
        platform.navigateToMiniProgram(data);
    }
}