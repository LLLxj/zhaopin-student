// job/club1/club1.js
const app = getApp()
var API = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    domain: app.globalData.domain,
    navbar: ['公司简介', '招聘职位'],
    currentTab: 0,
    data: [],
    // 再招职位数据
    data1: [],
    p: 1,
    prompt_msg: '',
    prompt_display: 'block',
    companyname: '',
    pass_vali: '',
    companyId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      companyId: id
    })
    // console.log(id)
    if (!id) {
      wx.navigateBack();
    }
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    // 俱乐部详情
    wx.request({
      url: app.globalData.apiurl + 'Club/clubDetails.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        company_id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          wx.hideLoading();
          var data = mythis.data.data;
          var companyname = mythis.data.companyname;
          mythis.setData({
            data: res.data.data,
            companyname: res.data.data.companyname
          })
          // console.log(mythis.data.data)
        }
      }
    })
    mythis.getPositionList()
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
    var mythis = this;
    mythis.getPositionList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  // 点击图片放大浏览
  delimage: function (res) {
    var mythis = this;
    var src = res.target.dataset.src;
    // console.log(src);
    // console.log(mythis.data.data[2].photo);
    // var photo = mythis.data.data[2].photo;
    // for (var i in photo) {
    //   if (photo[i] == src) {
    //     src = mythis.data.data[2].photo[i];
    //   }
    // }
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: mythis.data.data.photo // 需要预览的图片http链接列表
    })
  },
  // 查看地图
  mymap: function (res) {
    var location = res.currentTarget.dataset.location.split(',');
    var longitude = parseFloat(location[0]);
    var latitude = parseFloat(location[1]);
    var title = res.currentTarget.dataset.title;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })

  },
  url: function (res) {
    var id = res.currentTarget.dataset.id;
    // console.log(id);
    wx.navigateTo({
      url: '../positionDetails/positionDetails?id=' + id,
    })
  },
  // 获取职位列表
  getPositionList: function () {
    var mythis = this
    var id = mythis.data.companyId
    // 再招职位
    wx.request({
      url: app.globalData.apiurl + 'Club/position.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        company_id: id,
        p: mythis.data.p
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        //请求成功
        if (res.data.code == 200) {
          if (res.data.data) {
            mythis.setData({
              p: mythis.data.p + 1
            })
          }
          var data1 = mythis.data.data1;
          for (var index in res.data.data) {
            data1.push(res.data.data[index])
          }
          mythis.setData({
            data1: data1
          })
        } else {
          mythis.setData({
            prompt_display: 'block',
            prompt_msg: res.data.msg
          })
        }
      }

    })
  }
})