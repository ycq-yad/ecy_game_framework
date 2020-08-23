import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene33 extends LevelBase {
    className_key = "LevelScene33";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene33.json";
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

    tv: Laya.Skeleton
    dog: Laya.Skeleton
    door: Laya.Skeleton
  
    box_dog: Laya.Box
    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim = ["tv", "dog", "door"]
    
        for (let k of skAnim){
            let obj = this.mapData[k];
            this[k] = await this.createSkeleton(obj.url);
            this[k].x = obj.x;
            this[k].y = obj.y;
           
            if (k == "tv"){
                this[k].stop();
            } 
            if(k == "dog"){
                this.box_dog.addChild(this[k])
            } else {
                this.box_enb.addChild(this[k]);
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
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
  
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1900 }, 3900);
                Laya.Tween.to(this.box_player, { x: 1580 }, 3900);
                break;
            case "smove1":
                this.box_game.setChildIndex(this.box_dog, 1);
                Laya.Tween.to(this.box_game, { x: -3800 }, 4900);
                Laya.Tween.to(this.box_player, { x: 3500 }, 4900);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -5000 }, 4900);
                Laya.Tween.to(this.box_player, { x: 4700 }, 5100);
                break;
            case "sevent_men_1":
                this.door.play("men", true) 
                break;
            case "sevent_men1_1":
                this.door.play("men1", false) 
                break;
            case "sevent_men2_1":
                this.door.play("men2", false) 
                break;
            case "sevent_gou2_1":
                this.dog.play("gou2", false) 
                break;
            case "sevent_dianshi_1":
                this.tv.play("dianshi", false) 
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
                    this.dog.play("gou1", true) 
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

    public clearData() {
        super.clearData();
        this.box_dog.removeChildren();
    }
}