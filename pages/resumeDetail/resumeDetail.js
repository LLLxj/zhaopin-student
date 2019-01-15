// job/resume/resume.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    domain: app.globalData.domain,
    data: null,
    photos: [],
    photos2: [],
    phone: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userid = options.userid;
    if (!userid) {
      wx.navigateBack();
      return;
    }

    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/showresume.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        userid: userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          console.log(res)
          res.data.data.resume.mobile2 = res.data.data.resume.mobile.substr(0, 3) + '****' + res.data.data.resume.mobile.substr(7);
          mythis.setData({
            data: res.data.data,
            photos: res.data.data['resume']['photos'],
            photos2: res.data.data['resume']['photos2']
          })

        } else {
          //登录失败
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  delimage: function (res) {
    var mythis = this;
    var src = res.target.dataset.src;
    var photo = mythis.data.photos;
    for (var i in photo) {
      if (photo[i] == src) {
        src = mythis.data.photos2[i];
      }
    }
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: mythis.data.photos2 // 需要预览的图片http链接列表
    })
  }
  ,
  send: function () {
    this.setData({
      phone: 'block'
    })
  },
  quxiao: function () {
    this.setData({
      phone: 'none'
    })
  },
  call: function (res) {
    var phoneNumber = res.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
  }
})