// job/intention/intention.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    userInfo: app.globalData.userInfo,
    internal: app.globalData.internal,
    validation: app.globalData.validation,
    data: [],
    other: [],
    p: 1,
    domain: app.globalData.domain,
    prompt_msg: '没有更多了',
    prompt_display: 'none',
    adlist: [
      // { 'src': app.globalData.iconpath + 'jlbanner.gif' }
    ],
    // index: 0,
    // array: ['全部', '海珠校区', '天河校区', '白云校区'],
    name: '',
    tel: '',
    // schoolId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    this.getPostionList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    
    var mythis = this
    mythis.setData({
      internal: app.globalData.internal
    })
    mythis.getad()
    mythis.getPostionList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    var mythis = this
    mythis.setData({
      p: 1,
      data: [],
    })
    mythis.getPostionList()
    wx.stopPullDownRefresh()
  },
  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var mythis = this;
    mythis.onShow()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  url: function (res) {
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '../positionDetails/positionDetails?id=' + id,
    })
  },
  // 查询职位列表
  getPostionList: function () {
    var mythis = this
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Positionlist/index.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        p: mythis.data.p
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          var data = mythis.data.data
          if (res.data.data) {
            mythis.setData({
              p: mythis.data.p + 1
            })
          }
          for (var index in res.data.data) {
            data.push(res.data.data[index])
          }
          mythis.setData({
            data: data,
          })
          if (res.data.prompt) {
            mythis.setData({
              prompt_msg: res.data.prompt,
              prompt_display: 'block'

            })
          }
        } else {
          mythis.setData({
            prompt_msg: res.data.msg,
            prompt_display: 'block'

          })
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError()
      }
    })
  },
  jump: function (res) {
    var id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../clubDetail/clubDetail?id=' + id,
    })
  },
  getad: function () {
    var mythis = this;
    //获取轮播图广告
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Positionlist/jobad.html',
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
            adlist: res.data.data
          })
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();

      }
    })
  },
  // bindPickerChange(e) {
  //   this.setData({
  //     schoolId: e.detail.value,
  //     index: e.detail.value
  //   })
  // },
  getName (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getTel (e) {
    var tel = e.detail.value 
    var re = app.globalData.mobile
    this.setData({
      tel: tel
    })
    
  },
  formSubmit(res) {
    var data = [];
    data.name = this.data.name
    data.tel = this.data.tel
    if (!data.name) {
      app.showErrorMsg('请填写姓名'); return;
    }
    var re = app.globalData.mobile;
    if (!re.test(data.tel)) {
      app.showErrorMsg('电话号码格式错误'); return;
      if (!data.tel) {
        app.showErrorMsg('请填写电话号码'); return;
      }
    }

    app.showsuccessMsg('提交成功'); return;
  }
}) 