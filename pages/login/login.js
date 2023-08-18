// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    captchaText: '获取验证码',
    canGetCaptcha: true,
    code:'',
  },
  goRegister(){
    wx.navigateTo({
      url: '../regist/regist',
    })
  },
  getCode(e){
    this.setData({
      code: e.detail.value
    })
  },
  login1(){
    // app.globalData.userInfo.Img = 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLoTTn8QQ1ciagB325SOicmqBbl7dxOHG6TeLZUnlNvbd73Fm1eCAic72uCCbQXFUzTAQAHiaMUm668Ww/132'
    app.globalData.userInfo.Img = 'https://www.zaoxu.com/uploadfile/imgall/18a2cc7cd98d1001e95c732b4cb40e7bec54e79721.jpg'
    app.globalData.userInfo.nickName = '张一师' // 张一师 空痕
    app.globalData.userInfo.phone = '18522019384'
    app.globalData.config.userID = '18522019384'
    app.globalData.userInfo.userRole = 'PHYSICIAN' // PHYSICIAN ORDINARY_USER
    wx.reLaunch({
      url: '../me/me',
    })
  },
  vaildPhone(event){
    console.log('验证手机号是否正确')
    const phone = event.detail.value
    if(phone === ''){
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none'
      })
    } else {
      const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(!reg_tel.test(phone)){
        wx.showToast({
          title: '请填写正确的手机号！',
          icon: 'none'
        })
      }
    }
  },
  login(){
    if(this.data.code === ''){
      wx.showToast({
        title: '验证码不能为空！',
      })
      return
    }
    wx.request({
      url: app.globalData.baseUrl + '/im/login',
      data:{
        phone: this.data.phone,
        code: this.data.code
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        if(res.data.data.resultData.status === 200) {
          wx.showToast({
            title: '登录成功！',
          })
          const result = res.data.data.resultData
          app.globalData.userInfo.Img = result.data.userImage
          app.globalData.userInfo.nickName = result.data.nickName
          app.globalData.userInfo.phone = result.data.phone
          app.globalData.config.userID = result.data.phone
          app.globalData.userInfo.userRole = result.data.userRole
          wx.reLaunch({
            url: '../me/me',
          })
        } else {
          wx.showToast({
            title: res.data.data.resultData.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 获取手机号
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },

  // 验证码倒计时
  getCaptchaCode: function (e) {
    var that = this;
    var num = 120;
    // 修改验证码发送状态及文案
    that.setData({
      canGetCaptcha: false,
      captchaText: `${num}s后重新获取`
    });
    console.log(that.data.captchaText)
    var timer = setInterval(function () {
      num--;
      if (num <= 0) {
        clearInterval(timer)
        that.setData({
          canGetCaptcha: true,
          captchaText: '获取验证码'
        });
      } else {
        that.setData({
          canGetCaptcha: false,
          captchaText: `${num}s后重新获取`
        });
      }
    }, 1000)
  },

  // 获取验证码-按钮点击事件
  getCaptcha() {
    wx.request({
      url: app.globalData.baseUrl + '/im/verifyPhone',
      data:{
        phone: this.data.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        console.log('--------------验证码数据-------------')
        console.log(res)
        console.log('--------------验证码数据-------------')
        const result = res.data.data.resultData
        if(result.status === 200) {
          const {
            phone,
            canGetCaptcha
          } = this.data;
          // 验证码可发
          if (canGetCaptcha) {
            const pattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
            if (!phone || !pattern.test(phone)) {
              wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
              })
              return false;
            }
            // 发送验证码
            this.sendSms({
              phone
            })
          } else {
            return false;
          }
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      },
    })
  },

  // 发送验证码
  sendSms: function (params) {
    this.getCaptchaCode()
    wx.request({
      url: app.globalData.baseUrl + '/im/getSmsCode',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        console.log('------------------发送验证码返回结果---------------')
        console.log(res)
        console.log('------------------发送验证码返回结果---------------')
        // 验证码发送成功，开始倒计时
        if (res.data.data.resultData.status === 200) {
          wx.showToast({
            title: '获取成功',
            icon: 'success',
            duration: 3000
          })
          this.getCaptchaCode()
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'error',
            duration: 3000
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.baseUrl + '/wx/getOpenid',
          data:{
            code: res.code
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success: res =>{
          
          },
          fail: err => {
            wx.showToast({
              title: err.errMsg,
            })
          }
        })
      }
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

  },
})