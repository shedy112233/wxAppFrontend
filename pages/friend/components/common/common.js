// pages/friend/components/selectUser/selectUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    friendList: [],
    eventType: '',
    show: false,
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
    wx.navigateBack({
      delta: 1,
    })
  },
  submit(){
    switch(this.data.eventType) {
      case 'groupChat':
        break
      case 'sendGroupMsg':
        this.setData({
          show: true
        })
        break
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const friendList = wx.getStorageSync('friendList')
    const eventType = wx.getStorageSync('eventType')
    const result = wx.getStorageSync('result')
    this.setData({
      friendList: friendList,
      result: result,
      eventType: eventType
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