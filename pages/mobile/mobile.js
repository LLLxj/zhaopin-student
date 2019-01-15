const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alert: 'none',
    alertmsg: '',
    iconpath: app.globalData.iconpath,
    mobile: '',
    codemsg: '获取验证码',
    Agreement: '',
    Agreementdisplay: 'none',
    checked: true,
    noSendSms: false,
    mobileCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Login/UserInfo.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        openid: app.globalData.userInfo.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          //登录成功
          try {
            //缓存数据到本地作为登录凭证
            wx.setStorageSync('userinfo', res.data.data);
            //更新用户信息

            app.globalData.userInfo = res.data.data
            // 判断是否绑定手机
            if (res.data.data.mobile) {
              wx.navigateBack();
            }

          } catch (e) {
            //缓存数据失败
            wx.showToast({
              title: '登录失败',
              // icon: 'success',
              image: '../../images/loginerror.png',
              duration: 3000
            })
          }
          wx.hideLoading();
        } else {
          //登录失败
          wx.removeStorageSync('userinfo');
          wx.navigateBack();
          wx.hideLoading();

        }

      },
      fail: function (res) {
        wx.removeStorageSync('userinfo');
        wx.navigateBack();
        wx.hideLoading();

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      noSendSms: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //判断 已经绑定手机 跟新本地缓存
    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'Mobile/isBind.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          //绑定成功
          //更新本地数据 手机
          app.globalData.userInfo.mobile = res.data.data.mobile;
          try {
            wx.setStorageSync('userinfo', app.globalData.userInfo);
          } catch (e) {
            wx.removeStorageSync('userinfo');
          }
          wx.switchTab({
            url: '../personCenter/personCenter',
          })
        }

      },
      fail: function (res) {
        app.showNetworkError();
        setTimeout(function () {
          wx.navigateTo({
            url: '../mobile/mobile',
          }, 1000)
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  formSubmit: function (res) {
    var data = res.detail.value;
    var mobile = data.mobile;
    var mythis = this;
    var code = mythis.data.mobileCode
    //验证手机
    var re = app.globalData.mobile;
    if (!re.test(mobile)) {
      mythis.setData({
        alert: 'block',
        alertmsg: '手机号格式错误！'
      })
      setTimeout(function () {
        mythis.setData({
          alert: 'none'
        })
      }, 2000)
      return;
    }
    if (!code) {
      mythis.setData({
        alert: 'block',
        alertmsg: '验证码不能为空！'
      })
      setTimeout(function () {
        mythis.setData({
          alert: 'none'
        })
      }, 2000)
      return;
    }
    var checked = data.checked
    if (checked == 'false') {
      mythis.setData({
        alert: 'block',
        alertmsg: '请同意用户协议'
      })
      setTimeout(function () {
        mythis.setData({
          alert: 'none'
        })
      }, 2000)
      return;
    } else {
    //发起网络请求
      wx.request({
        url: app.globalData.apiurl + 'Mobile/binding.html',
        method: 'POST',
        dataType: 'json',
        data: {
          validation: app.globalData.validation,//验证
          mobile: mobile,
          user_id: app.globalData.userInfo.user_id,
          code: code
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.code == 200) {
            //绑定成功
            //更新本地数据 手机
            app.globalData.userInfo.mobile = mobile;
            try {
              wx.setStorageSync('userinfo', app.globalData.userInfo);
            } catch (e) {
              wx.removeStorageSync('userinfo');
            }
            wx.switchTab({
              url: '../personCenter/personCenter',
            })

          } else {
            //绑定失败
            wx.showToast({
              title: res.data.msg,
              // icon: 'success',
              image: '../../images/loginerror.png',
              duration: 3000
            })

          }

        },
        fail: function (res) {
          app.showNetworkError()
        }
      })
    }
  },
  yzm: function (res) {
    if (res.target.dataset.msg != '获取验证码') {
      return;
    }
    //获取验证码
    var mobile = res.target.id;
    var mythis = this;
    mythis.setData({
      noSendSms: true
    })
    //验证手机
    var re = /1\d{10}/;
    if (!re.test(mobile)) {
      mythis.setData({
        alert: 'block',
        alertmsg: '手机号格式错误！'
      })
      setTimeout(function () {
        mythis.setData({
          alert: 'none',
          noSendSms: false
        })
      }, 2000)
      return;
    } else {
      mythis.setData({
        alert: 'none',
        noSendSms: false
      })
    }
    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'Sendsms/index.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        mobile: mobile,
        user_id: app.globalData.userInfo.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          //验证码发送成功
          var i = 60;
          var time_ = setInterval(function () {
            mythis.setData({
              codemsg: i + '秒后重新获取'
            })
            i--;
            if (i < 0) {
              mythis.setData({
                codemsg: '获取验证码',
                noSendSms: false
              })
              clearInterval(time_)
            }
          }, 1000)

        } else {
          //验证码发送失败
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            // image: '../../images/loginerror.png',
            duration: 3000
          })

        }

      },
      fail: function (res) {
        mythis.setData({
          noSendSms: false
        })
        app.showNetworkError()


      }
    })

  },
  mobilechange: function (res) {
    var mobile = res.detail.value;
    this.setData({
      mobile: mobile
    })
  },
  mobileCode: function (res) {
    var mobileCode = res.detail.value
    this.setData({
      mobileCode: mobileCode
    })
  },
  agreement: function () {
    //发起网络请求登录
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.apiurl + 'Agreement/index.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          mythis.setData({
            Agreement: res.data.data,
            Agreementdisplay: 'block'
          })


        } else {
          app.showErrorMsg('加载失败')
        }
        wx.hideLoading();


      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading();

      }
    })
  }
  ,
  tongyi: function () {
    this.setData({
      checked: true,
      Agreementdisplay: 'none'
    })
  },
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var val = e.detail.value[0];
    if (val) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
  }
})