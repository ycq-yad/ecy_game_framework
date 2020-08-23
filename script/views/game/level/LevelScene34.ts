import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene34 extends LevelBase {
    className_key = "LevelScene34";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene34.json";
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
    zombie: Laya.Skeleton
    door: Laya.Skeleton
    spider: Laya.Skeleton

    public async initPlayer() {

        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["light", "zombie", "door", "spider"];
        for (let k of skAnim){
            let obj = this.mapData[k];
            this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(this[k]);
            this[k].x = obj.x;
            this[k].y = obj.y;
            if (k == "door"){
                this[k].stop();
            }
        }
   
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.box_player.addChild(this.ani_player);

        this.box_player.x = this.box_game.x = 0;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -2200 }, 4500);
                Laya.Tween.to(this.box_player, { x: 2200 }, 4500);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -3180 }, 5000);
                Laya.Tween.to(this.box_player, { x: 2860 }, 5000);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -4200 }, 4800);
                Laya.Tween.to(this.box_player, { x: 3900 }, 4800);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -4700 }, 2800);
                Laya.Tween.to(this.box_player, { x: 5100 }, 2800);
                break;
            case "sevent_men_1":
                this.door.play("men", false) 
                break;
            case "sevent_zhizhu1_1":
                this.spider.play("zhizhu1", true) 
                break;
            case "sevent_zhizhu3_1":
                this.spider.play("zhizhu3", false) 
                break;
            case "sevent_zhizhu2_1":
                this.spider.play("zhizhu2", false) 
                break;
            case "sevent_jiangshi2_1":
                this.zombie.play("jiangshi2", true);
                let zindex = this.box_game.getChildIndex(this.box_enb);
                let pindex = this.box_game.getChildIndex(this.box_player);
                this.box_game.setChildIndex(this.box_enb, pindex); 
                this.box_game.setChildIndex(this.box_player, zindex); 
                Laya.Tween.to(this.zombie, {x: this.zombie.x - 1000}, 3000)
                break;
        }
    }

    public playAni(aniName: any, callBack: Function, isLoop = false){
        if (aniName == "34-9"){this.zombie.visible = false;}

        super.playAni(aniName, callBack, isLoop)
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
                    break;
                case 1:
                    this.spider.play("zhizhu1", true);
                    break;
                case 2:
                    this.zombie.visible = true;
                break;
                default:
            }
        
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }
}