/**
 * 游戏音效
 */
export default class SoundConst {
    /** 背景音乐 */
    static Bgm: string = "bgm";
    /** 按钮音1 */
    static Btn_1: string = "btn_1";

     /**
     * 通过键值获得全路径下的url
     * 
     * @param key 
     */
    public static getKeyUrl(key: string): string {
        return "resource/assets/sounds/" + key + SoundConst.sufix;
    }

    public static sufix: string = ".mp3";
}