// pages/friend/components/selectUser/selectUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    friendList: []
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

  cancle(){
    wx.navigateBack({
      delta: 1,
    })
  },
  submit(){
    console.log(this.data.result)
    wx.setStorageSync('result', this.data.result)
    wx.navigateTo({
      url: './../save/save',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const friendList = wx.getStorageSync('friendList')
    const result = wx.getStorageSync('result')
    this.setData({
      friendList: friendList,
      result: result
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