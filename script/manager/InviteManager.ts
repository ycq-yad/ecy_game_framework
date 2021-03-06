import { GameData } from "../common/GameData";
import { netData, localData } from "../common/GameDataType";
import ConfigManager from "../games/ConfigManager";
import { PlayerDataManager } from "../common/GameDataManager";

/**
 * 关联邀请人数据管理
 */
export default class InviteManager {

    private static instance_: InviteManager;
    public static getInstance(): InviteManager {
        if (!InviteManager.instance_) {
            InviteManager.instance_ = new InviteManager();
        }
        return InviteManager.instance_;
    }

    /**请求连接 */
    private URL: string = GameData.getInstance().URL_OF_INVITE;

    /** 邀请人信息 */
    public inviterInfo: netData.Inviter = new netData.Inviter();

    /** 邀请成功的新玩家 */
    public newPlayer: Object[] = [];

    /**
     * 查询信息
     */
    public selectInfo(callF: Function = null, obj: any = null): void {
        let gameId: string = GameData.getInstance().gameId;
        let openId: string = GameData.getInstance().userInfo.openId;
        let msg: any = {};
        msg.msg_type = "16";
        msg.msg_data = {
            "gameid": gameId,
            "openid": openId
        };

        console.log("查询受邀人列表 ->", msg);
        HttpMgr.getInstance().sendHttp(this.URL, msg, (e) => {
            let code: string = e["msg_data"]["error_code"];
            if (code == "0") {
                console.log("查询受邀人列表成功 ->", e);
                if (e["msg_data"]["index_list"] != "") {
                    let newPlayerTemp = e["msg_data"]["index_list"];
                    // if(!this.newPlayer){
                    //     this.newPlayer = [];
                    // }
                    if (newPlayerTemp) {
                        this.newPlayer = newPlayerTemp;
                    }
                    console.log("recvnewplayer = ", this.newPlayer);
                }
            } else {
                // let str: string = GameConst.errorCodeTable[code];
                console.warn("查询受邀人列表失败：", "str");
            }
            if (callF && obj) {
                callF.call(obj, code);
            }
        }, (e) => { });
    }

    /**
     * 增加信息
     */
    public async createInfo(callF: Function = null, obj: any = null) {
        await new Promise((res, rej) => {
            // 关联自己及邀请人
            let inviterOpenId: string = this.inviterInfo.openId;
            let tx_url: string = GameData.getInstance().userInfo.avatarUrl;
            let nick: string = GameData.getInstance().userInfo.nick;
            let gameId: string = GameData.getInstance().gameId;
            let msg: any = {};
            msg.msg_type = "14";
            msg.msg_data = {
                "openid": inviterOpenId,
                "url": tx_url,
                "name": nick,
                "gameid": gameId
            };
            console.log("关联自己及邀请人 ->", msg, " game id = ", GameData.getInstance().gameId);
            HttpMgr.getInstance().sendHttp(this.URL, msg, (e) => {
                let code: string = e["msg_data"]["error_code"];
                if (code == "0") {
                    console.log("关联自己及邀请人成功...");
                } else {
                    let str: string = code.toString();
                    console.warn("关联自己及邀请人失败：", str);
                }
                if (callF && obj) {
                    callF.call(obj, code);
                }
                res();
            }, (e) => { });
        });
    }

    /** 
     * 是否通过分享链接进入游戏
     */
    public judgeInvite() {
        return new Promise(resolve => {
            let res = GameData.getInstance().enterGameInfo;
            console.log("开始关联邀请人", res);
            console.log("自己信息", GameData.getInstance().userInfo);
            if (res) {
                let scene: number = res.scene;
                if (scene == 1007 || scene == 1008 || scene == 1044) { // 1007:好友分享 1008:群分享
                    if (GameData.getInstance().userInfo.openId && res.query && res.query["openid"]) {
                        this.inviterInfo.nick = res.query["nick"];
                        this.inviterInfo.openId = res.query["openid"];
                        if (GameData.getInstance().userInfo.openId != this.inviterInfo.openId) { // 排除自己邀请自己的情况
                            console.log("关联邀请人", res.query);
                            // 关联自己及邀请人
                            this.createInfo();
                        }
                    }
                }
                resolve();
            } else {
                resolve();
            }
        });
    }

    /**得到邀请信息 */
    public getInviteAwardData(): localData.InviteData[] {
        let inviteConfig = ConfigManager.getInstance().getInviteConfigInfo();
        let lingqu = PlayerDataManager.getInstance().stPlayerDataBase.inviteId;
        let invitePlayer = this.newPlayer;
        let dataArr = [];
        for (let i = 0, len = inviteConfig.length; i < len; i++) {
            let invite = inviteConfig[i];
            let awardId = invite.ID;
            let canLingqu = false;
            let lingqued = false;
            let player = null
            if (invitePlayer.length - 1 >= i) {
                player = invitePlayer[i];
            }
            if (lingqu.indexOf(awardId) > -1) lingqued = true;
            if (player) canLingqu = true;
            let data = new localData.InviteData();
            data.id = awardId;
            data.head = player ? player["url"] : "";
            data.reward = invite.nCount;
            data.lingqued = lingqued;
            data.canLingqu = canLingqu;
            dataArr.push(data);
        }
        return dataArr;
    }
}