// job/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    p: 1,
    data: [],
    domain: app.globalData.domain,
    prompt_msg: '没有更多了',
    prompt_display: 'none',
    noData: false,
    hasData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.reuser()) {
      return;
    }
    var mythis = this
    mythis.setData({
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight,
    })
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Positionlist/deliverylog.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        p: mythis.data.p
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          var data = mythis.data.data;
          for (var index in res.data.data) {
            data.push(res.data.data[index])
          }
          mythis.setData({
            data: data,
            hasData: true
          });
          if (res.data.prompt) {
            mythis.setData({
              prompt_msg: res.data.prompt,
              prompt_display: 'block'

            })
          }
          wx.hideLoading();

        } else {
          // app.showErrorMsg(res.data.msg);
          mythis.setData({
            prompt_msg: res.data.msg,
            prompt_display: 'block',
            noData: true
          })
          wx.hideLoading();

        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
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
    app.onShow();
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
    var mythis = this;
    mythis.setData({
      p: mythis.data.p + 1
    })
    mythis.onLoad()
  },

  repostion: function (res) {
    var id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../positiondetails/positiondetails?id=' + id,
    })

  }
})