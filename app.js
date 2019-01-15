//app.js
App({
  onLaunch: function () {
    var mythis = this;
    var userInfo = wx.getStorageSync('userinfo')
    mythis.globalData.userInfo = userInfo
    var internal = wx.getStorageSync('internal')
    mythis.globalData.internal = internal
    // console.log(userInfo)
  },
  // typedetection: function () {
  //   var mythis = this;
  //   var userInfo = this.globalData.userInfo;
  //   if (userInfo) {
  //     //发起网络请求登录
  //     wx.request({
  //       url: mythis.globalData.apiurl + 'User/getUserTtype.html',
  //       method: 'get',
  //       dataType: 'json',
  //       data: {
  //         validation: mythis.globalData.validation,//验证
  //         user_id: userInfo.user_id,
  //       },
  //       header: {
  //         'content-type': 'application/json' // 默认值
  //       },
  //       success: function (res) {
  //         //请求成功
  //         if (res.data.code == 200) {
  //           var utype = res.data.utype;
  //           if (utype == 2) {
  //             // wx.redirectTo({
  //             //   url: '/enterprise/user/user'
  //             // })
  //           }

  //         } else {
  //         }

  //       },
  //       fail: function (res) {
  //         //请求失败
  //         app.showNetworkError();
  //         wx.removeStorageSync('userinfo');
  //       }
  //     })
  //   }

  // },
  reuser: function () {
    //如果没有登录跳转到user
    if (!this.globalData.userInfo) {
      wx.switchTab({
        url: '../personCenter/personCenter',
      })
      this.showErrorMsg('请登录！');
      return;
    }
    return 1;

  },

  onShow: function () {
    var userInfo = wx.getStorageSync('userinfo')

    //登录后 如果没有绑定手机 跳转到绑定手机页面
    // if (this.globalData.userInfo) {
    //   if (!this.globalData.userInfo.mobile) {
    //     wx.redirectTo({
    //       url: '../mobile/mobile'
    //     })
    //   }
    // }
  },
  globalData: {
    userInfo: null,
    islogin: false,
    validation: 'kc5RyOttNzNsmPSxSvSANQCM7S3GcfgBnDxbNbXXH3UYkObtV4Apo5EBPo4R1sn8',
    domain: "https://zhaopin.heigrace.com",
    iconpath: "https://zhaopin.heigrace.com/public/static/xiaochengxu/icon/",
    apiurl: 'https://zhaopin.heigrace.com/xcx/',
    alert: null,
    mobile: /1\d{10}/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  },
  showErrorMsg: function (msg) {
    wx.showToast({
      title: msg,
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 3000
    })
  },
  showsuccessMsg: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    })
  },
  showNetworkError: function () {
    wx.showToast({
      title: '网络异常',
      // icon: 'success',
      image: '../../images/loginerror.png',
      duration: 3000
    })
    setTimeout(function () {
      wx.switchTab({
        url: '../personCenter/personCenter',
      })
    }, 3000)

  }
})