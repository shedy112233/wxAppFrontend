// pages/regist/regist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Img: '../../images/user.png',
    nickName: '昵称',
    phone: '',
    code: '',
    inviteCode: '',
    fromAccount: '',
    show: false,
    isToLogin: false,
    applyReason: '',
    checked: false,
    isOpenAgreement: false,
    confirmBtnTitle: '',
    confirmBtnStyle:'',
    isRead: false,
  },
  onChange(e){
    this.setData({
      checked: !this.data.checked
    })
    // if(this.data.isRead) {
      
    // } else {
    //   wx.showToast({
    //     title: '请先阅读注册协议',
    //     icon: 'error'
    //   })
    // }
  },
  openAgreement(){
    this.setData({
      isOpenAgreement: true
    })
    this.getCaptchaCode()
  },
  getCaptchaCode: function (e) {
    var that = this;
    var num = 10;
    // 修改验证码发送状态及文案
    that.setData({
      confirmBtnStyle: 'gray',
      confirmBtnTitle: `(${num})`
    });
    console.log(that.data.captchaText)
    var timer = setInterval(function () {
      num--;
      if (num <= 0) {
        clearInterval(timer)
        that.setData({
          confirmBtnStyle: 'blue',
          confirmBtnTitle: '同意'
        });
      } else {
        that.setData({
          confirmBtnStyle: 'gray',
          confirmBtnTitle: `(${num})`
        });
      }
    }, 1000)
  },
  fnSure(){
    this.setData({
      isOpenAgreement: false,
      checked: true,
      isRead: true,
      show: true
    })
  },
  fnCancel(){
    this.setData({
      isOpenAgreement: false
    })
    wx.reLaunch({
      url: './../login/login',
    })
  },
  getUserProfile(){
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.baseUrl + '/wx/getOpenid',
          data:{
            code: res.code
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success: res =>{},
          fail: err => {
            wx.showToast({
              title: err.errMsg,
            })
          }
        })
      }
    })
    wx.getUserProfile({
      desc: '微信授权',
      success: res => {
        console.log('res:' , res)
        this.setData({
          Img: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        });
        if(this.data.phone !== '') {
          this.setData({
            show: false
          })
        }
      },
      fail: err =>{
        console.log('err:' , err)
        wx.showToast({
          title: '您取消了微信授权，不能进行注册！',
          icon: 'none'
        })
      }
    })
  },
  getPhoneNumber(e){
    /* ----------------向后端发送请求并将conde传递到后端----------------- */
    wx.request({
      url: app.globalData.baseUrl + '/wx/getPhoneNumber',
      data:{
        code: e.detail.code
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        const result = res.data.data.resultData
        if(result.status === 200){
          const phone = result.data.phone_info.phoneNumber
          this.setData({
            phone: phone
          })
          if(this.data.nickName !== '昵称') {
            this.setData({
              show: false
            })
          }
        }
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  getInviteCode(e){
    this.setData({
      inviteCode: e.detail.value
    })
  },
  onClose(){
    this.setData({
      isToLogin: false
    })
  },
  fnConfirm(){
    wx.navigateTo({
      url: './../login/login',
    })
  },
  register(){
    if(this.data.nickName === '昵称'){
      wx.showToast({
        title: '请进行微信授权！',
        icon: 'none'
      })
      return
    }
    if(this.data.phone === ''){
      wx.showToast({
        title: '请进行手机号授权！',
        icon: 'none'
      })
      return
    }
    if(!this.data.checked){
      wx.showToast({
        title: '请勾选阅读并同意《用户注册协议》',
        icon: 'none'
      })
      return
    }
    if(app.globalData.isScanCodeRegist){
      if(this.data.applyReason != '' && this.data.applyReason.length > 50) {
        wx.showToast({
          title: '输入的申请原因不能大于50个字',
          icon: 'error'
        })
        return
      }
      if(this.data.applyReason === ''){
        wx.showToast({
          title: '申请原因不能为空',
          icon: 'error'
        })
        return
      }
    } else {
      if(this.data.inviteCode === ''){
        wx.showToast({
          title: '邀请码不能为空！',
          icon: 'error'
        })
        return
      }
    }
    wx.request({
      url: app.globalData.baseUrl + '/im/register',
      data:{
        imageUrl: this.data.Img,
        nickName: this.data.nickName,
        phone: this.data.phone,
        inviteCode: this.data.inviteCode,
        fromAccount: this.data.fromAccount,
        isScanCodeRegist: app.globalData.isScanCodeRegist,
        applyReason: this.data.applyReason
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        console.log(res)  
        const result = res.data.data.resultData
        console.log(result)
        if(result.status === 200){
          wx.showToast({
            title: '注册成功',
            icon: 'none'
          })
          app.globalData.userInfo.Img = this.data.Img
          app.globalData.userInfo.nickName = this.data.nickName
          app.globalData.userInfo.phone = this.data.phone
          app.globalData.config.userID = this.data.phone
          if(this.data.inviteCode === ''){
            app.globalData.userInfo.userRole = 'ORDINARY_USER'
          } else {
            app.globalData.userInfo.userRole = 'PHYSICIAN'
          }
          wx.reLaunch({
            url: '../me/me',
          })
        } else {
          this.setData({
            errMsg: result.msg,
            isToLogin: true
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },
  //解析链接地址
	GetwxUrlParam(url) {
	  let theRequest = {};
	  if(url.indexOf("#") != -1){
		  const str=url.split("#")[1];
		  const strs=str.split("&");
		  for (let i = 0; i < strs.length; i++) {
		  	theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		  }
	  }else if(url.indexOf("?") != -1){
		  const str=url.split("?")[1];
		  const strs=str.split("&");
		  for (let i = 0; i < strs.length; i++) {
		  	theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		  }
	  }
	  return theRequest;
  },
  getApplyReason(e){
    const applyReason = e.detail.value
    if(applyReason.length > 50) {
      wx.showToast({
        title: '输入的申请原因不能大于50个字',
        icon: 'none'
      })
      return
    }
    this.setData({
      applyReason: applyReason
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      // show: true
      isOpenAgreement: true
    })
    this.getCaptchaCode()
    // wx.getSetting({
    //   success: res => {
    //     if(!res.authSetting['scope.record']){
    //       // wx.getUserProfile({
    //       //   desc: '微信授权',
    //       //   success: res => {
    //       //     console.log('************微信授权返回参数****************')
    //       //     console.log(res)
    //       //     console.log('************微信授权返回参数****************')
    //       //     this.setData({
    //       //       Img: res.userInfo.avatarUrl,
    //       //       nickName: res.userInfo.nickName
    //       //     });
    //       //   },
    //       //   fail: err =>{
    //       //     console.log(err)
    //       //     wx.showToast({
    //       //       title: '您取消了微信授权，不能进行注册！',
    //       //       icon: 'none'
    //       //     })
    //       //   }
    //       // })
    //       wx.authorize({
    //         scope: 'scope.record',
    //         success() {
    //             // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //             wx.startRecord()
    //         }
    //       })
    //     }
    //   }
    // })
    console.log('---------------------------------------')
    console.log(options)
    console.log('---------------------------------------')
    if(options != "undefined" && options.q && options.q!="undefined"){
      app.globalData.isScanCodeRegist = true
      // 获取到二维码原始链接内容
      const qrUrl = decodeURIComponent(options.q) 
      const list = qrUrl.split('=')
      console.log('*************************')
      console.log(list[1])
      console.log('*************************')
      if(list.length > 0){
        this.setData({
          fromAccount: list[1]
        })
      }
      //此处就是我们要获取的参数 json，通过方法解析
      let jsonUrl = this.GetwxUrlParam(qrUrl);
      console.log('jsonUrl-----------------------:' + jsonUrl)
      //比如我要得到id的值，直接取值即可
      let id = jsonUrl.id;
      console.log("巡逻点ID："+id);		
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
    this.setData({
      isScanCodeRegist: app.globalData.isScanCodeRegist
    })
    // if(!app.globalData.isScanCodeRegist){
    //   wx.request({
    //     url: app.globalData.baseUrl + '/wx/getInviteCode',
    //     data: null,
    //     method: 'POST',
    //     header: { 'content-type': 'application/x-www-form-urlencoded'},
    //     success: res => {
    //       console.log(res)
    //     }
    //   })
    // }
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