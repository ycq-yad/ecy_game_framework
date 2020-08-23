import SkinItemView from "./SkinItemView";

export default class SkinView extends BaseSceneUISkinPopView {
    public className_key = "SkinView";

    public imageBtToHome:Laya.Image;
    public panelSkin:Laya.Panel;
    public boxSkins:Laya.HBox;
    public imageBtWatchViceo:Laya.Box;
    public imageShareIcon:Laya.Image;
    public imageShareName:Laya.Image;

    constructor() { 
        super();
        this.skin = "game/uiView/SkinView.json";
     }
    
     protected createChildren(): void {
        super.createChildren();
    }

    protected childrenCreated(): void {
        super.childrenCreated();
    }

    onAddStage(): void{
        this.initView();
        this.addEvent();
    }

    onRemoved(){
        this.removeEvent();
    }

    private initView(){
        //初始化一下皮肤显示(测试用)
        for(let i = 0; i < 4; ++i){
            let stSkinItemView:SkinItemView = this.boxSkins.getChildAt(i) as SkinItemView;
            if(stSkinItemView){
                stSkinItemView.setData(i%2 + 1);
            }else{
                stSkinItemView = new SkinItemView(i%2 + 1);
                this.boxSkins.addChild(stSkinItemView);
            }
        }
    }

    private addEvent(){
        this.imageBtToHome.on(Laya.Event.CLICK,this,this.onClick);
        this.imageBtWatchViceo.on(Laya.Event.CLICK,this,this.onClick);
    }

    private removeEvent(){
        this.imageBtToHome.off(Laya.Event.CLICK,this,this.onClick);
        this.imageBtWatchViceo.off(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(evt:Laya.Event){
        switch(evt.currentTarget){
            case this.imageBtToHome:
                 this.removeSelf();
                 break;
            case  this.imageBtWatchViceo:
                 this.onWatchVideoGetSkin();
                 break;

        }
    }

    private onWatchVideoGetSkin(){

    }
}