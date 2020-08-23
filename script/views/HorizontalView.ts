
/**
 * 测试横屏
 */
export default class HorizontalView extends BaseSceneUISkin {
    public className_key = "HorizontalView";
    private bg_img: Laya.Image;

    constructor() {
        super();
        this.skin = "skins/HorizontalSkinView.json";
    }

    protected childrenCreated(): void {
        DeviceUtil.adaptationBgImg(this.bg_img);
    }
}