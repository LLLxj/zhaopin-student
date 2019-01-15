// job/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    userInfo: app.globalData.userInfo,
    internal: app.globalData.internal,
    confimtop: 'none',
    showOrDisplay: false,
    width: '',
    height: '',
    tempUserInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight
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

  myresume: function () {
    //跳转 我的简历
    wx.navigateTo({
      url: '../resume/resume',
    })
  },
  onGotUserInfo: function(res) {
    var mythis = this
    if (res.detail.errMsg == "getUserInfo:ok") {
      //同意授权
      var userinfo = res.detail
      mythis.setData({
        showOrDisplay: true,
        tempUserInfo: userinfo
      })
    } else {
      //不同意授权
      mythis.setData({
        showOrDisplay: false
      })
    }
  },
  reuserinfo: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },
  unlogin: function () {
    //退出登录
    var mythis = this;
    wx.showModal({
      title: '提示',
      content: '您确定要退出登录吗',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('userinfo')
          wx.removeStorageSync('internal')
          mythis.setData({
            userInfo: null,
            internal: ''
          })
          app.onLaunch()
        } else if (res.cancel) {

        }
      }
    })


  },
  deliverylog: function (res) {
    wx.navigateTo({
      url: '../record/record',
    })
  },
  feedback: function (res) {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  getPhoneNumber: function (e) {
    var mythis = this
    var userInfo = this.data.tempUserInfo
    wx.login({
      success: res => {
        mythis.setData({
          code: res.code
        })
        wx.request({
          url: app.globalData.apiurl + 'Login/mobileLogin.html',
          data: {
            'validation': app.globalData.validation,
            'encryptedData': e.detail.encryptedData,
            'iv': e.detail.iv,
            'code': res.code,
            'userinfo': userInfo
          },
          method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data && res.data.code == 200) {
              console.log(res)
              mythis.setData({
                showOrDisplay: false,
                userInfo: res.data.data,
                internal: res.data.data.internal
              })
              //存入缓存即可
              wx.setStorage({
                key: "internal",
                data: res.data.data.internal,
                success(res) {
                  // console.log(res)
                },
                fail(err) {
                  // console.log(err)
                }
              })
              wx.setStorage({
                key: "userinfo",
                data: res.data.data,
                success(res) {
                  // console.log(res)
                },
                fail(err) {
                  // console.log(err)
                }
              })
              wx.setStorage({
                key: "token",
                data: res.data.data,
                success(res) {
                  console.log(res)
                },
                fail(err) {
                  console.log(err)
                }
              })
              app.onLaunch()
              app.showsuccessMsg('登录成功')
            } else {
              app.showErrorMsg(res.data.msg)
            }
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }
    })
  }, 
  // 取消弹窗
  calcleLogin() {
    this.setData({
      showOrDisplay: false
    })
  }, 
})
