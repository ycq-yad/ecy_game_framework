import { PlayerDataManager } from "../../common/GameDataManager";
import { SkinState } from "../../games/CommonDefine";

export default class SkinItemView  extends BaseSceneUISkin {
    public className_key = "SkinItemView";

    public imageBg:Laya.Image;
    public imageSkinReal:Laya.Image;
    public nSkinIndex:number;
    constructor(data_:any) { 
        super();
        this.nSkinIndex = data_;
        this.width = 233;
        this.height= 312;
        this.skin = "game/uiView/SkinItemView.json";
    }
    
    onEnable(): void {
        super.onEnable();
        this.initView();
    }

    onDisable(): void {
        super.onDisable();
        this.removeEvent();
    }

    public setData(data_:any){
        this.nSkinIndex = data_;
        this.initView();
    }

    protected createChildren(): void {
        super.createChildren();
    }

    protected childrenCreated(): void {  
    }

    /**初始化界面的显示 */
    private initView(){
        this.changeSkinBg(this.nSkinIndex);
        this.changeSkin(this.nSkinIndex);
    }

    /**变更背景 */
    private changeSkinBg(nSkinID:number){
        let nState = PlayerDataManager.getInstance().checkSkinState(nSkinID);
        this.imageBg.skin = "resource/assets/img/ui/skin/skin_baseboard_" + nState.toString() + ".png";
    }

    /**变更皮肤图标*/
    private changeSkin(nSkinID:number){
        this.imageSkinReal.skin = "resource/assets/img/ui/skin/skin_icon_" + nSkinID.toString() + ".png";
    }


    private addEvent(){
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private removeEvent(){
        this.off(Laya.Event.CLICK, this, this.onClick);
    }


    private onClick(){
        //更新下按钮状态
    }
}