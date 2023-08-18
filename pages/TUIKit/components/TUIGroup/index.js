import logger from '../../utils/logger';
// eslint-disable-next-line no-undef
const app = getApp()
Component({
  /**
 * 组件的属性列表
 */
  properties: {
    conversation: {
      type: Object,
      value: '',
      observer(newVal) {
        if (newVal.type === 'GROUP');
        console.log('****************************')
        console.log(newVal)
        console.log('****************************')
        this.setData({
          conversation: newVal,
        });
      },
    },
    count: {
      type: Number,
      value: '',
      observer(newVal) {
        this.setData({
          memberCount: newVal,
        });
      },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    personalProfile: {
    },
    getMemberCount: 30,
    count: '',
    userID: '',
    conversation: {},
    memberCount: '',
    groupMemberProfile: [],
    groupMemberAvatar: [],
    groupMemberNick: [],
    hidden: true,
    notShow: true,
    isShow: false,
    showMore: false,
    addShow: false,
    popupToggle: false,
    quitPopupToggle: false,
    addPopupToggle: false,
    showText: '退出群聊',
    showOwner: false,
    noRepateOwner: [],
    showOwnerName: {},
    showGetMore: false,
    offsetNumber: 0,
    selectedUserIDList: [],
    showGroupCall: false,
    type: 0,
    Profile: {},
    callStatus: false,
    list: [],
    currentUserID: '',
    callGroupMemberProfile: [],
    show: false,
    result: [],
    friendList: [],
  },
  lifetimes: {
    attached() {
      wx.$TUIKit.getGroupProfile({
        groupID: this.data.conversation.groupProfile.groupID,
      }).then((imResponse) => {
        this.setData({
          Profile: imResponse,
        });
      });
      this.setData({
        currentUserID: wx.$chat_userID,
        memberCount: this.data.conversation.groupProfile.memberCount,
        userRole: app.globalData.userInfo.userRole
      });
      wx.request({
        url: 'https://eicos.com.cn:8085/im/getFriendInfo',
        data:{
          userId: app.globalData.userInfo.phone,
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded'},
        success: res => {
          if(res.data.errors.length>0){
            wx.showToast({
              title: '获取好友数据失败！',
              icon: 'none'
            })
            return
          }
          const result = res.data.data.resultData
          if(result.status === 200) {
            const userItems = result.data.UserDataItem
            console.log(userItems)
            if(userItems.length !== 0){
              userItems.forEach((item,index) => {
                const friendId = item.To_Account
                // 用户头像昵称等信息通过数据库查询
                wx.request({
                  url: 'https://eicos.com.cn:8085/im/getUserInfo',
                  data:{
                    phone: friendId,
                    operator: app.globalData.userInfo.phone
                  },
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded'},
                  success: res => {
                    if(res.data.errors.length > 0){
                      wx.showToast({
                        title: res.data.errors[0].msg,
                        icon: 'none'
                      })
                      return
                    }
                    const resData = res.data.data.resultData
                    if(resData.status === 200){
                      console.log(resData.data)
                      const userInfo = resData.data
                      const user = {
                        avatarUrl: userInfo.userImage,
                        nickName: userInfo.nickName,
                        phone: userInfo.phone,
                        bz: userInfo.bz
                      }
                      if(this.data.friendList.findIndex(item=>item.avatarUrl === user.avatarUrl&&item.nickName===user.nickName&&item.phone===user.phone) === -1){
                        this.setData({
                          friendList: [...this.data.friendList,user]
                        })
                      }
                      wx.setStorageSync('friendList', this.data.friendList)
                    }
                  }
                })
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }
        }
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 展示更多群成员
    showMore() {
      const { group } = this.data.Profile.data;
      const currentMemberCount = group.memberCount;
      this.setData({
        showGetMore: currentMemberCount  > this.data.getMemberCount,
        showText: group.selfInfo.role === 'Owner' ? '解散群聊' : '退出群聊',
      });
      wx.$TUIKit.getGroupMemberList({
        groupID: this.data.conversation.groupProfile.groupID,
        count: this.data.getMemberCount, offset: 0,
      })
        .then((imResponse) => {
          logger.log(`| TUI-group-profile | getGroupMemberList | getGroupMemberList-length: ${imResponse.data.memberList.length}`);
          if (this.data.conversation.groupProfile.type === 'Private') {
            this.setData({
              addShow: true,
            });
          }
          if (imResponse.data.memberList.length > 3) {
            this.setData({
              showMore: true,
            });
          }
          this.setData({
            groupMemberProfile: imResponse.data.memberList,
            hidden: !this.data.hidden,
            notShow: !this.data.notShow,
            isShow: !this.data.isShow,
          });
        });
    },
    // 拉取更多成员进行展示
    getMoreMember() {
      const offset = this.data.offsetNumber + this.data.getMemberCount;
      this.setData({
        offsetNumber: offset,
      });
      wx.$TUIKit.getGroupMemberList({
        groupID: this.data.conversation.groupProfile.groupID,
        count: this.data.getMemberCount, offset,
      }).then((imResponse) => {
        this.setData({
          groupMemberProfile: this.data.groupMemberProfile.concat(imResponse.data.memberList),
        });
        if (this.data.groupMemberProfile.length === this.data.memberCount) {
          this.setData({
            showGetMore: false,
          });
        }
      });
    },
    // 关闭显示showmore
    showLess() {
      this.setData({
        isShow: false,
        notShow: true,
        hidden: true,
      });
    },
    // 展示更多群成员弹窗
    showMoreMember() {
      this.setData({
        popupToggle: true,
        callStatus: false,
      });
    },
    // 通话展示更多群成员
    callShowMoreMember(event) {
      if (this.data.groupMemberProfile.length === 0) {
        wx.$TUIKit.getGroupMemberList({
          groupID: this.data.conversation.groupProfile.groupID,
          count: this.data.getMemberCount,
          offset: 0,
        })
          .then((imResponse) => {
            const index =  imResponse.data.memberList.findIndex((member) => member.userID === this.data.currentUserID);
            imResponse.data.memberList.splice(index, 1);
            this.setData({
              callGroupMemberProfile: imResponse.data.memberList,
              showGetMore: this.data.Profile.data.group.memberCount  > this.data.getMemberCount,
            });
          });
      } else {
        const currentGroupMemberProfile = this.data.groupMemberProfile;
        const index = currentGroupMemberProfile.findIndex((member)=>  member.userID === this.data.currentUserID);
        currentGroupMemberProfile.splice(index, 1);
        this.setData({
          callGroupMemberProfile: currentGroupMemberProfile,
        });
      }
      this.setData({
        type: event.detail.type,
        popupToggle: true,
        callStatus: true,
      });
    },
    // 关闭显示弹窗
    close() {
      this.setData({
        selectedUserIDList: [],
        showGroupCall: false,
        popupToggle: false,
        addPopupToggle: false,
        quitPopupToggle: false,
      });
    },
    quitGroup() {
      if (this.data.showText === '退出群聊') {
        this.setData({
          quitPopupToggle: true,
          popupToggle: false,
        });
      } else if (this.data.showText === '解散群聊') {
        this.setData({
          dismissPopupToggle: true,
          popupToggle: false,
        });
      }
    },
    // 解散群聊
    dismissGroupConfirm() {
      wx.$TUIKit.dismissGroup(this.data.conversation.groupProfile.groupID)
        .then(() => {
          this.triggerEvent('showConversationList');
        })
        .catch((imError) => {
          wx.showToast({
            title: '群主不能解散好友工作群',
            icon: 'none',
          });
          this.setData({
            dismissPopupToggle: false,
          });
          logger.warn('dismissGroup error:', imError);
        });
    },
    // 解散群聊的按钮提示
    dismissGroupAbandon() {
      this.setData({
        dismissPopupToggle: false,
      });
    },
    // 主动退群
    quitGroupConfirm() {
      wx.$TUIKit.quitGroup(this.data.conversation.groupProfile.groupID)
        .then(() => {
          this.triggerEvent('showConversationList');
        })
        .catch((imError) => {
          wx.showToast({
            title: '该群不允许群主主动退出',
            icon: 'none',
          });
          this.setData({
            quitPopupToggle: false,
          });
          logger.warn('quitGroup error:', imError); // 退出群组失败的相关信息
        });
    },
    // 退出群聊的按钮显示
    quitGroupAbandon() {
      this.setData({
        quitPopupToggle: false,
      });
    },
    // 添加群成员按钮显示
    addMember() {
      this.setData({
        // addPopupToggle: true,
        show: true
      });
    },
    // 获取输入的用户ID
    binduserIDInput(e) {
      const id = e.detail.value;
      this.setData({
        userID: id,
      });
    },
    // work群主动添加群成员
    submit() {
      wx.$TUIKit.addGroupMember({
        groupID: this.data.conversation.groupProfile.groupID,
        // userIDList: [this.data.userID],
        userIDList: this.data.result,
      }).then((imResponse) => {
        if (imResponse.data.successUserIDList.length > 0) {
          wx.showToast({ title: '添加成功', duration: 800 });
          this.userID = '';
          this.addMemberModalVisible = false;
          this.setData({
            addPopupToggle: false,
          });
        }
        if (imResponse.data.existedUserIDList.length > 0) {
          wx.showToast({ title: '该用户已在群中', duration: 800, icon: 'none' });
        }
      })
        .catch((imError) => {
          console.warn('addGroupMember error:', imError); // 错误信息
          wx.showToast({ title: '添加失败，请确保该用户存在', duration: 800, icon: 'none' });
        });
    },
    // 实时更新群成员个数
    updateMemberCount(groupOperationType) {
      if (groupOperationType === 1) { // 1是有成员加群
        wx.$TUIKit.getGroupMemberList({
          groupID: this.data.conversation.groupProfile.groupID,
          count: this.data.getMemberCount, offset: 0,
        }).then((imResponse) => {
          this.setData({
            groupMemberProfile: imResponse.data.memberList,
            memberCount: this.data.memberCount + 1,
          });
          if (this.data.memberCount > 3) {
            this.setData({
              showMore: true,
            });
          }
        });
      }
      if (groupOperationType === 2) { // 2是有成员退群
        wx.$TUIKit.getGroupMemberList({
          groupID: this.data.conversation.groupProfile.groupID,
          count: this.data.getMemberCount, offset: 0,
        }).then((imResponse) => {
          this.setData({
            groupMemberProfile: imResponse.data.memberList,
            memberCount: this.data.memberCount - 1,
          });
          if (this.data.memberCount <= 3) {
            this.setData({
              showMore: false,
            });
          }
        });
      }
    },
    // 复制群ID
    copyGroupID() {
      wx.setClipboardData({
        data: this.data.conversation.groupProfile.groupID,
        success() {
          wx.getClipboardData({
            success(res) {
              logger.log(`| TUI-chat | tui-group | copyGroupID: ${res.data} `);
            },
          });
        },
      });
    },
    // 获取群通话ID
    handleGroupCallUserIDList(e) {
      if (!this.data.callStatus) return;
      const  { selectedUserIDList } = this.data ;
      const { userID } = e.currentTarget.dataset.value;
      const index = selectedUserIDList.indexOf(userID);
      if (index > -1) {
        selectedUserIDList.splice(index, 1);
      } else {
        selectedUserIDList.push(userID);
      }
      this.setData({
        selectedUserIDList,
        showGroupCall: selectedUserIDList.length > 0,
      });
    },
    // 父组件传值
    handleGroupCall() {
      const { selectedUserIDList, type } = this.data;
      const  { groupID } = this.data.conversation.groupProfile;
      this.triggerEvent('groupCall', { selectedUserIDList, type, groupID });
      this.setData({
        popupToggle: false,
        showGroupCall: false,
        selectedUserIDList: []
      });
    },
    onChange(event) {
      this.setData({
        result: event.detail,
      });
    },
  
    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },
  
    noop() {},
    onChange(event) {
      this.setData({
        result: event.detail,
      });
    },
    cancle(){
      this.setData({
        show: false
      })
    },
    searchInfo(e){
      const value = e.detail.value
      const friendList = wx.getStorageSync('friendList')
      if(value != ""){
        const list = friendList.filter(item => item.bz === value || item.nickName === value || item.phone === value)
        this.setData({
          friendList: list
        })
      } else {
        this.setData({
          friendList: friendList
        })
      }
    },
  },
});
