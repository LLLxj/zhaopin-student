// job/intention/intention.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    intentionarry: [],
    intention: '',
    salaryarray: [],
    salary: ''
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
      url: app.globalData.apiurl + 'Resume/intention.html',
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
            intentionarry: res.data.data.position,
            intention: res.data.data.sel.position,
            salaryarray: res.data.data.salary,
            salary: res.data.data.sel.salary,
          })


        } else {
          //登录失败
          app.showErrorMsg('加载失败！');

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


  bindPickerChange1: function (res) {
    var mythis = this;
    this.setData({
      intention: mythis.data.intentionarry[res.detail.value]
    })
  },
  bindPickerChange2: function (res) {
    var mythis = this;
    this.setData({
      salary: mythis.data.salaryarray[res.detail.value]
    })
  },
  formSubmit: function (res) {
    var data = res.detail.value;
    var mythis = this;
    wx.showLoading({
      title: '提交中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/intention.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        data: data
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          app.showsuccessMsg(res.data.msg);
          setTimeout(function () {
            wx.navigateBack();
          }, 2000)
        } else {
          //登录失败
          app.showErrorMsg(res.data.msg);
        }
        


      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()


      }
    })
    wx.hideLoading();

  }
})