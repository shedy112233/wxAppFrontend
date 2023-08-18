// pages/friend/components/save/save.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: [],
    tagName: '',
    param: null,
  },
  addUser(){
    wx.navigateTo({
      url: './../selectUser/selectUser',
    })
  },
  submit(){
    wx.request({
      url: app.globalData.baseUrl + '/tag/insertGroupTags',
      data:{
        tagName: this.data.tagName,
        toolsImGroupTagUserVos:this.data.member,
        operateUser: app.globalData.userInfo.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/json'},
      success: res => {
        console.log(res)
        const result = res.data.data.resultData
        if(result.status === 200){
          wx.setStorageSync('result', '')
          wx.navigateTo({
            url: './../tags/tags',
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let arr = []
    const result = wx.getStorageSync('result')
    const friendList = wx.getStorageSync('friendList')
    result.forEach(item => {
      let index = friendList.findIndex(obj => obj.phone === item)
      if(index !== -1 && this.data.member.findIndex(mumber => mumber.phone === item)=== -1){
        arr.push(friendList[index])
      }
    })
    this.setData({
      member: arr,
      param: options.param
    })
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