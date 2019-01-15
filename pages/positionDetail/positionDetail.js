const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    buttonbg: '#6ac4d2',
    buttoncolor: '#fff',
    buttontext: '发送简历',
    domain: app.globalData.domain,
    data: [],
    send: 'login',
    pass_vali: app.globalData.userInfo.utype,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if (!id) {
      wx.navigateBack();
    }
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Positionlist/positiondetails.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        //请求成功
        if (res.data.code == 200) {
          mythis.setData({
            data: res.data.data,

          })
          if (res.data.data.isdelivery) {
            mythis.setData({
              buttonbg: '#dfdfdf',
              buttontext: '已投递'
            })
          } else if (res.data.data.deliverynum >= res.data.data.deliverycount) {
            mythis.setData({
              buttonbg: '#dfdfdf',
              buttontext: '今日投递次数已达上限'
            })
          }

          if (!res.data.data.isdelivery && res.data.data.deliverynum < res.data.data.deliverycount) {
            mythis.setData({
              send: 'send'
            })
          }



          wx.hideLoading();



        } else {
          app.showErrorMsg(res.data.msg);
          wx.hideLoading();

          wx.navigateBack();

        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
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
  send: function (res) {
    var id = res.currentTarget.dataset.id;
    if (!id) {
      app.showErrorMsg('职位异常'); return;
    }
    if (!app.globalData.userInfo.user_id) {
      // app.showErrorMsg('请登录');
      wx.showModal({
        title: '您还没有登录！',
        // content: '这是一个模态弹窗',
        confirmText: '去登录',
        confirmColor: '#6ac4d2',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../personCenter/personCenter'
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })

      return;
    }

    var mythis = this;
    wx.showLoading({
      title: '投递中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Positionlist/delivery.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          app.showsuccessMsg(res.data.msg);
          mythis.setData({
            buttonbg: '#dfdfdf',
            buttontext: '已投递',
            send: ''
          })
          wx.hideLoading();



        } else {
          if (res.data.code == 40058) {
            wx.showModal({
              title: res.data.msg,
              // content: '这是一个模态弹窗',
              confirmText: '去发布',
              confirmColor: '#6ac4d2',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../resume/resume',
                  })

                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
          } else {
            app.showErrorMsg(res.data.msg);

          }
          wx.hideLoading();

        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading();

      }
    })


  },
  login: function () {
    if (!app.globalData.userInfo.user_id) {
      wx.showModal({
        title: '您还没有登录！',
        // content: '这是一个模态弹窗',
        confirmText: '去登录',
        confirmColor: '#6ac4d2',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../personCenter/personCenter'
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return;
    }
  },
  delimage: function (res) {
    var mythis = this;
    var src = res.target.dataset.src;
    // console.log(src);
    var photo = mythis.data.data.company.photo;
    for (var i in photo) {
      if (photo[i] == src) {
        src = mythis.data.data.company.photo2[i];
      }
    }
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: mythis.data.data.company.photo2 // 需要预览的图片http链接列表
    })
  }
})