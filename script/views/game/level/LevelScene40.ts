import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene40 extends LevelBase {
    className_key = "LevelScene40";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene40.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public initView() {
        super.initView();
        this.stopAni();
    }

    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        this.stopAni();
    }

    fire: Laya.Skeleton
    wind: Laya.Skeleton
    snow: Laya.Skeleton
    imgFire:    Laya.Image
    public async initPlayer() {
        this.imgFire.visible = false;
        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["fire", "wind","snow"];
        for (let k of skAnim){
            let obj = this.mapData[k];
            let item = this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(this[k]);
            item.x = obj.x;
            item.y = obj.y;
            switch(k){
                case "fire": 
                    item.stop();
                    break;
                case "wind":
                    item.visible = false;
                    break;
                case "snow":
                    item.visible = false;
                    break;
                default:

                break;
            }
        }
        
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.box_player.addChild(this.ani_player);

        this.box_player.x = 0;
        this.box_game.x = 0;
        // this.box_game.x= -5100;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }
    

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        console.log(evt.name)
     
        if (this.checkRepreatEvent(evt.name)) return;
        switch (evt.name) {
            case "sevent_hj_1":
                this.fire.play("hj", false);
                break;
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1410 }, 3300);
                Laya.Tween.to(this.box_player, { x: 1410 }, 3300);
                break;
            case "smove1":
                Laya.Tween.to(this.box_player, { x: 2350 }, 3200);
                break;
        
            case "sevent_ljf1_1":
                this.wind.visible = true;
                this.wind.alpha = 0;
                Laya.Tween.to(this.wind, {alpha: 1}, 1000);
                this.wind.play("ljf1", true);
                this.switchZindex(this.box_player, this.box_enb);
                break;
            case "sevent_ljfx_1":
                Laya.Tween.to(this.wind, {x: 3000}, 2000);
                break;
            case "sevent_ljf2_1":
                Laya.Tween.to(this.wind, {x: 900}, 1800);
                break;
            case "sevent_rain_1":
                this.snow.play("rain", true);
                this.snow.visible = true;
                break;
        }
    }
    
    /**游戏逻辑控制 */
    public startGame() {
        this.clearData();
        super.startGame();
        this.initPlayer();
    }

    /**停止游戏 */
    public stopGame() { }
    
    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        this.objEvent = {};
        this.switchZindex(this.box_player, this.box_enb);
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
            
            switch (this.index){
                case 0: 
                    this.box_player.x =  this.box_game.x = 0;
                    this.wind.visible = false;
                    break;
                case 2:
                    this.wind.x = 3000;
                    break;
            }
        
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }

    // 切换渲染序列
    private switchZindex(pItem1: Laya.Box, pItem2: Laya.Box){
        let zindex = this.box_game.getChildIndex(pItem1);
        let pindex = this.box_game.getChildIndex(pItem2);
        this.box_game.setChildIndex(pItem1, pindex); 
        this.box_game.setChildIndex(pItem2, zindex);
    }

    objEvent: object = {}
    // 检查重复事件
    private checkRepreatEvent(strName){
        if(this.objEvent[strName]){
            return true;
        } else {
            this.objEvent[strName] = 1;
            return false;
        }
    }
}