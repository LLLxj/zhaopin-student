
const app = getApp()
var API = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    iconpath: app.globalData.iconpath,
    internal: app.globalData.internal,
    other: [],
    club_list: [],
    p: 1,
    prompt_msg: '没有更多了',
    prompt_display: 'block',
    domain: app.globalData.domain,
    userInfo: app.globalData.userInfo,
    internal: '',
    name: '',
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // var mythis = this
    // mythis.setData({
    //   internal: app.globalData.internal
    // })
    
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
    var mythis = this
    mythis.setData({
      internal: app.globalData.internal
    })
    //发起网络请求登录
    mythis.getClubInfo()
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
    mythis.getClubInfo()
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
  // 获取俱乐部信息
  getClubInfo: function () {
    var mythis = this
    wx.request({
      url: app.globalData.apiurl + 'Club/index.html',
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
          // app.showErrorMsg(res.data.msg)
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
  to_club_info: function (res) {
    var id = res.currentTarget.dataset.id;
    // console.log(id);
    wx.navigateTo({
      url: '../clubDetail/clubDetail?id=' + id,
    })
  },
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getTel(e) {
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
    // data.schoolId = this.data.schoolId
    // console.log(data)
    // if(!data.schoolId){
    //   app.showErrorMsg('请选择校区'); return;
    // }
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