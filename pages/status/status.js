// job/intention/intention.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    statusarray: ['离职', '在职', '寻找新的机会'],
    status: '',
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/status.html',
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
            status: mythis.data.statusarray[res.data.data]
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


  bindPickerChange: function (res) {
    var mythis = this;
    this.setData({
      status: mythis.data.statusarray[res.detail.value],
      index: res.detail.value
    })
  },
  formSubmit: function (res) {
    var mythis = this;
    var index = res.detail.value.status
    wx.showLoading({
      title: '提交中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/status.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        status: index
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          app.showsuccessMsg(res.data.msg);
          wx.navigateBack();

        } else {
          //登录失败
          app.showErrorMsg(res.data.msg)
        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)


  }
})