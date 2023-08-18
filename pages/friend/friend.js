// pages/friend/friend.js
const app = getApp();
Page({
/**
   * 组件的属性列表
   */
  properties: {
    config: {
      type: Object,
      value: {},
      observer(config) {
      },
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    friendList:[],
    show: false,
    index: null,
    showMenu: false,
  },
  toTag(e){
    wx.setStorageSync('friendList', this.data.friendList)
    wx.navigateTo({
      url: './components/tags/tags',
    })
  },
  showInfo(e){
    const index = e.currentTarget.dataset.index
    wx.setStorageSync('selectPerson', this.data.friendList[index])
    wx.navigateTo({
      // url: '../person/person?avatarUrl=' + this.data.friendList[e.currentTarget.dataset.index].avatarUrl + '&nickName=' +
      // this.data.friendList[e.currentTarget.dataset.index].nickName + '&phone=' + this.data.friendList[e.currentTarget.dataset.index].phone + '&bz=' + this.data.friendList[e.currentTarget.dataset.index].bz,
      url: '../person/person'
    })
  },
  openMenu(e){
    this.setData({
      showMenu: !this.data.showMenu
    })
  },
  initiveSession(e) {
    console.log(e);
  },
  onClose() {
    this.setData({ show: false });
  },
  toGroupChat(){
    wx.setStorageSync('friendList', this.data.friendList)
    wx.setStorageSync('eventType', 'groupChat')
    wx.navigateTo({
      url: './components/common/common',
    })
  },
  sendGroupMsg(){
    wx.setStorageSync('friendList', this.data.friendList)
    wx.setStorageSync('eventType', 'sendGroupMsg')
    wx.navigateTo({
      url: './components/common/common',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const res = wx.getMenuButtonBoundingClientRect()

    console.log(res.width)
    console.log(res.height)
    console.log(res.top)
    console.log(res.right)
    console.log(res.bottom)
    console.log(res.left)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.request({
      url: app.globalData.baseUrl + '/im/getFriendInfo',
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
                url: app.globalData.baseUrl + '/im/getUserInfo',
                data:{
                  phone: friendId,
                  operator: app.globalData.userInfo.phone
                },
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded'},
                success: res => {
                  console.log(res)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})