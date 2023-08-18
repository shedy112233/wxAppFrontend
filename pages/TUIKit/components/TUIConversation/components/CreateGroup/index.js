// miniprogram/pages/TUI-Group/create-group/create.js
import logger from '../../../../utils/logger';
const app = getApp();
Component({
  properties: {

  },
  data: {
    groupTypeList: [
    ],
    groupType: '',
    Type: '',
    name: '',
    groupID: '',
  },
  methods: {
    goBack() {
      this.triggerEvent('showConversation');
    },
    // 展示群列表
    showGroupTypeList() {
      this.setData({
        popupToggle: true,
      });
    },
    // 获取输入的群ID
    bindGroupIDInput(e) {
      const id = e.detail.value;
    },
   randomString(e) {    
      e = e || 32;
      var t = "123456789",
      a = t.length,
      n = "";
      for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
      return n
    },
    // 获取输入的群名称
    bindGroupNameInput(e) {
      const groupname = e.detail.value;
      this.setData({
        name: groupname,
      });
    },
    // 创建群聊时，传点击事件对应的值
    click(e) {
      this.setData({
        groupType: e.currentTarget.dataset.value.groupType,
        Type: e.currentTarget.dataset.value.Type,
        name: e.currentTarget.dataset.value.name,
        popupToggle: false,
      });
    },
    // 确认创建群聊
    bindConfirmCreate() {
      logger.log(`| TUI-Group | create-group | bindConfirmCreate | groupID: ${this.randomString(8)}`);
      wx.$TUIKit.createGroup({
        type: wx.$TUIKitTIM.TYPES.GRP_WORK,
        name: this.data.name,
        groupID: this.randomString(8),
      }).then((imResponse) => { // 创建成功
        console.log('imResponse:',imResponse)
        wx.request({
          url: app.globalData.baseUrl + '/im/insertGroup',
          data:{
            groupId: imResponse.data.group.groupID,
            conversationId: `GROUP${imResponse.data.group.groupID}`
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success: res => {
            console.log(res)
          },
          fail: err => {

          }
        })
        this.triggerEvent('createGroupID', { createGroupID: `GROUP${imResponse.data.group.groupID}` });
        // 创建的群的资料
        wx.aegis.reportEvent({
          name: 'conversationType',
          ext1: 'conversationType-group',
          ext2: wx.$chat_reportType,
          ext3: wx.$chat_SDKAppID,
        });
      })
        .catch((imError) => {
          if (imError.code === 10021) {
            wx.showToast({
              title: '该群组ID被使用，请更换群ID',
              icon: 'none',
            });
          }
        });
    },
    // 点击空白区域关闭弹窗
    handleChooseToggle() {
      this.setData({
        popupToggle: false,
      });
    },
  },
  created() {

  },
  attached() {

  },
  /**
   * 创建群的类型
   */
  ready() {
    const groupTypeList = [
      { groupType: '品牌客户群（Work)', Type: wx.$TUIKitTIM.TYPES.GRP_WORK },
      { groupType: 'VIP专属群（Public)', Type: wx.$TUIKitTIM.TYPES.GRP_PUBLIC },
      { groupType: '临时会议群 (Meeting)', Type: wx.$TUIKitTIM.TYPES.GRP_MEETING },
      { groupType: '直播群（AVChatRoom）', Type: wx.$TUIKitTIM.TYPES.GRP_CHATROOM },
    ];
    this.setData({
      groupTypeList,
    });
  },
  moved() {

  },
  detached() {

  },
});
