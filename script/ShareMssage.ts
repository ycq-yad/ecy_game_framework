/**
 * 分享消息
 */
export default class ShareMssage {
    /**
     * 标题内容
     */
    static titleInfos: string[] =
        [
            "操作简单秒上手，我弓箭射得贼溜！",
            "据说，全球只有10%的人才能通关！",
            "快拿起手中的武器，和全球玩家一起对决!"
        ];

    /**
     * 默认分享信息
     */
    static defaultMssage = {
        title: ShareMssage.titleInfos[Math.floor(Math.random() * ShareMssage.titleInfos.length)],
        imageUrl: "https://package.32yx.com/ecy_game_small/laya/fruits/qq_res/share" + (Math.floor(Math.random() * 2 + 1)) + ".jpg",
        query: ""
    };
}