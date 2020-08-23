import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene38 extends LevelBase {
    className_key = "LevelScene38";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene38.json";
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

    light: Laya.Skeleton
    fire: Laya.Skeleton
    monitoring: Laya.Skeleton
    door: Laya.Skeleton
    water: Laya.Skeleton
    smog: Laya.Skeleton
    public async initPlayer() {

        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["light", "fire","monitoring","door","water","smog"];
        for (let k of skAnim){
            let obj = this.mapData[k];
            let item = this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(item);
            item.x = obj.x;
            item.y = obj.y;
            switch (k){
                case "light":
                    item.play("deng2", true);
                    break;
                case "water":
                    item.visible = false;
                    break;
                case "smog":
                case "fire":
                    item.stop();
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
    
    imgMask:   Laya.Image
    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        console.log(evt.name)
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1600 }, 3700);
                Laya.Tween.to(this.box_player, { x: 1340 }, 3700);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -2650 }, 3900);
                Laya.Tween.to(this.box_player, { x: 2420 }, 3900);
                break;
            case "smove2":
                this.switchZindex(this.box_player, this.box_enb);
                Laya.Tween.to(this.box_game, { x: -3700 }, 5400);
                Laya.Tween.to(this.box_player, { x: 3500 }, 5400);
                break;
            case "smove3":
                this.switchZindex(this.box_player, this.box_enb);
                Laya.Tween.to(this.box_game, { x: -5300 }, 5800);
                Laya.Tween.to(this.box_player, { x: 5500 }, 5800);
            case "sevent_jiankong1_1":
                this.monitoring.play("jiankong1", true);
                break;
            case "sevent_jiankong2_1":
                this.monitoring.play("jiankong2", false);
                break;
            case "sevent_jiankong3_1":
                this.monitoring.play("jiankong3", false);
                break;
            case "sevent_deng_1":
                this.light.play("deng", true)
                break;
            case "sevent_yanwu1_1":
                this.smog.once(Laya.Event.STOPPED, this, ()=>{
                    this.smog.visible = false;
                })
                this.smog.play("yanwu1", false)
                break;
            case "sos":
                this.imgMask.alpha = 0.6;
                break;
            case "sos1":
            case "sos2":
                Laya.Tween.to(this.imgMask, {alpha: 0}, 600);
                break;
            case "sevent_men1_1": 
                break;
            case "sevent_shui_1":
                this.water.visible = true;
                break;
            case "sevent_huojian_1":
                this.fire.play("huojian", false);
                Laya.timer.once(500, this, ()=>{
                    Laya.Tween.to(this.fire, {y: (this.mapData.fire.y - 2400 )}, 1400, Laya.Ease.circIn);
                })
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
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
         
            switch (this.index){
                case 0: 
                    this.box_player.x = this.box_game.x = 0;
                    this.light.play("deng2", true);
                    break;
                case 2:
                    this.water.visible = false;
                    this.imgMask.alpha = 0.6;
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
}