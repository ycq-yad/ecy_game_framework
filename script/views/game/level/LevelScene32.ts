import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene32 extends LevelBase {
    className_key = "LevelScene32";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene32.json";
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

    skCar:  Laya.Skeleton;      // 小车
    skPit:  Laya.Skeleton;      // 坑洞
    skMoor: Laya.Skeleton;      // 沼泽

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        this.skCar = await this.createSkeleton(this.mapData.car.url);
        this.skCar.x = this.mapData.car.x;
        this.skCar.y = this.mapData.car.y;
        this.box_enb.addChild(this.skCar);

        this.skMoor = await this.createSkeleton(this.mapData.moor.url);
        this.skMoor.x = this.mapData.moor.x;
        this.skMoor.y = this.mapData.moor.y;
        this.box_enb.addChild(this.skMoor);

        this.skPit = await this.createSkeleton(this.mapData.pit.url);
        this.skPit.x = this.mapData.pit.x;
        this.skPit.y = this.mapData.pit.y;
        this.box_enb.addChild(this.skPit);

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
                Laya.Tween.to(this.box_game, { x: -1400 }, 3800);
                Laya.Tween.to(this.box_player, { x: 1400 }, 3800);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -3650 }, 4900);
                Laya.Tween.to(this.box_player, { x: 3340 }, 4900);
                break;
            case "sevent_keng2_1":
                this.skPit.play("keng2", false);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -5700 }, 4300);
                Laya.Tween.to(this.box_player, { x: 5700 }, 4300);
                break;
            case "smove4":
                Laya.Tween.to(this.box_player, { x: 6400 }, 1800);
                Laya.Tween.to(this.box_game, { x: -6400 }, 1800);
                this.skMoor.visible = true;
                break;
            case "pmove":
                this.skCar.visible = true;
                this.skCar.x = this.box_player.x + 600;
                Laya.Tween.to(this.box_player, { x: 8000 }, 4000);
                Laya.Tween.to(this.box_game, { x: -6700 }, 2000);
                break;
        }
    }
    public playAni (aniName: any, callBack: Function, isLoop = false){
        switch (aniName){
            case "32-2": 
                this.skCar.visible = false;
            break;
            case "32-9":
                this.skMoor.visible = false;
            break;
        }
      
        super.playAni(aniName, callBack, isLoop);
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
            if (this.index == 0) {
                this.skCar.visible = true;
                this.box_player.x = this.box_game.x = 0;
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