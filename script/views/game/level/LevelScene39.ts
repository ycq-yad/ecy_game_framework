import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene39 extends LevelBase {
    className_key = "LevelScene39";
    public image_special: Laya.Image;
    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene39.json";
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

    dianxian: Laya.Skeleton
    qiangti: Laya.Skeleton
    shiwu: Laya.Skeleton
    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["dianxian", "qiangti", "shiwu"];
        for (let k of skAnim) {
            let obj = this.mapData[k];
            let item = this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(this[k]);
            item.x = obj.x;
            item.y = obj.y;
            if(k == "qiangti"){
                item.stop();
            }
        }

        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.box_player.addChild(this.ani_player);

        this.box_player.x = -500;
        this.box_game.x = 0;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }


    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        console.log(evt.name)

        if (this.checkRepreatEvent(evt.name)) return;
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_player, { x: 0 }, 1670);
                break;
            case "sevent_39dianxian2_1":
                this.image_special.visible = false;
                this.dianxian.play("39dianxian2", false);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -1176 }, 2580);
                break;
            case "sevent_39qiangti1_1":
                this.qiangti.play("39qiangti1", false);
                break;
            case "sevent_39qiangti2_1":
                this.qiangti.play("39qiangti2", true);
                break;
            case "sevent_39qiangti3_1":
                this.image_special.visible = true;
                this.qiangti.play("39qiangti3", false);
                break;
            case "sevent_39qiangti4_1":
                this.qiangti.play("39qiangti4", false);
                break;
            case "sevent_39qiangti5_1":
                this.qiangti.play("39qiangti5", false);
                break;
            case "sevent_39shiwu1_1":
                this.shiwu.play("39shiwu1", true);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -2352 }, 2500);
                Laya.Tween.to(this.box_player, { x: 100 }, 2500);
                break;
            case "smove3":
                Laya.Tween.to(this.box_player, { x: 1080 }, 2500);
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
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();

            switch (this.index) {
                case 0:
                    this.box_player.x = -500;
                    break;
                case 1:
                    this.image_special.visible = false;
                    break;
                case 2:
            }

            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }

    objEvent: object = {}
    // 检查重复事件
    private checkRepreatEvent(strName) {
        if (this.objEvent[strName]) {
            return true;
        } else {
            this.objEvent[strName] = 1;
            return false;
        }
    }

}