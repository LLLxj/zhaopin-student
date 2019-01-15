// job/learning/learning.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    multiArray: [],
    xxdate: '',
    alert: 'none',
    alertmsg: '',
    learningarray: [],
    learning: '',
    certificatearray: [],
    certificate: '',
    data: null


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date;
    var yyyy = date.getFullYear();//当前年
    var datearray = [[], [], ['至'], [], []];

    // 开始日期
    //年
    var y = yyyy - 40;
    for (var i = 0; i <= 40; i++) {
      datearray[0].push(y + i + '年');
    }


    //月
    var m = 1;
    for (var i = 0; i < 12; i++) {
      datearray[1].push(m + i + '月');
    }

    //结束日期
    //年
    var y = yyyy - 40;
    for (var i = 0; i <= 43; i++) {
      datearray[3].push(y + i + '年');
    }


    //月
    var m = 1;
    for (var i = 0; i < 12; i++) {
      datearray[4].push(m + i + '月');
    }


    this.setData({
      multiArray: datearray
    })

    //获取信息
    var learning_id = options.learning_id || '';
    //发起网络请求
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/learning.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        learning_id: learning_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          mythis.setData({
            certificatearray: res.data.data.certificate,
            learningarray: res.data.data.learning,
            data: res.data.data.data
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


  bindMultiPickerChange: function (event) {
    var mythis = this;
    var start = mythis.data.multiArray[0][event.detail.value[0]] + mythis.data.multiArray[1][event.detail.value[1]];
    var stop = mythis.data.multiArray[3][event.detail.value[3]] + mythis.data.multiArray[4][event.detail.value[4]];
    if (start.replace(/[^0-9]/ig, "") >= stop.replace(/[^0-9]/ig, "")) {
      mythis.setData({
        alert: 'block',
        alertmsg: '日期格式错误！',
      })
      setTimeout(function () {
        mythis.setData({
          alert: 'none'
        })
      }, 3000)
      return;
    }

    start = start.replace('年', '.').replace('月', '')
    stop = stop.replace('年', '.').replace('月', '')
    this.setData({
      xxdate: start + ' - ' + stop
    })
  },
  bindlearningChange: function (res) {
    var mythis = this;
    mythis.setData({
      learning: mythis.data.learningarray[res.detail.value]
    })
  },
  bindcertificateChange: function (res) {
    var mythis = this;
    mythis.setData({
      certificate: mythis.data.certificatearray[res.detail.value]
    })
  },
  formSubmit: function (res) {
    var learning_id = res.detail.value.learning_id || '';
    //验证数据
    var data = res.detail.value;
    if (!data.school) {
      app.showErrorMsg('请填写学校名称'); return;
    }
    if (!data.degree) {
      app.showErrorMsg('请选择当前学历'); return;
    }
    if (!data.certificate) {
      app.showErrorMsg('请选择资格证书'); return;
    }
    if (!data.schooldate) {
      app.showErrorMsg('请选择学习时间'); return;
    }

    //发起网络请求
    var mythis = this;
    wx.showLoading({
      title: '提交中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/learning.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        learning_id: learning_id,
        data: data
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          console.log(res)
          app.showsuccessMsg(res.data.msg);
          wx.hideLoading();
          wx.navigateBack();
        } else {
          app.showErrorMsg(res.data.msg);
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
  del: function (res) {
    //删除
    var learning_id = res.currentTarget.dataset.id;
    //发起网络请求
    var mythis = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function (res) {

        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...',
          })

          //发起网络请求登录
          wx.request({
            url: app.globalData.apiurl + 'Resume/delLearning.html',
            method: 'get',
            dataType: 'json',
            data: {
              validation: app.globalData.validation,//验证
              user_id: app.globalData.userInfo.user_id,
              learning_id: learning_id,
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
                app.showErrorMsg(res.data.msg);
              }
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)

            },
            fail: function (res) {
              //请求失败
              app.showNetworkError();
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            }
          })
        } else if (res.cancel) {
          // console.log('no')

        }
      }
    })

  }
})