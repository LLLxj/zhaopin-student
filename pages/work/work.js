// job/learning/learning.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    startdate: '',
    stopdate: '',
    textlen: 0,
    workstartarray: [],
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var work_id = options.work_id || '';
    var date = new Date;
    var yyyy = date.getFullYear();//当前年
    var datearray = [[], []];
    //年
    var y = yyyy - 40;
    for (var i = 0; i <= 43; i++) {
      datearray[0].push(y + i + '年');
    }


    //月
    var m = 1;
    for (var i = 0; i < 12; i++) {
      datearray[1].push(m + i + '月');
    }


    this.setData({
      workstartarray: datearray
    })
    wx.showLoading({
      title: '加载中',
    })

    var mythis = this;
    //查询数据
    if (work_id) {
      //发起网络请求登录
      wx.request({
        url: app.globalData.apiurl + 'Resume/work.html',
        method: 'GET',
        dataType: 'json',
        data: {
          validation: app.globalData.validation,//验证
          user_id: app.globalData.userInfo.user_id,
          work_id: work_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //请求成功
          if (res.data.code == 200) {
            mythis.setData({
              data: res.data.data
            })
          }
          

        },
        fail: function (res) {
          //请求失败
          app.showNetworkError();
        }
      })
     
    }
    wx.hideLoading();

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

  workstart: function (evenv) {
    var startdate = this.data.workstartarray[0][evenv.detail.value[0]].replace('年', '.') + this.data.workstartarray[1][evenv.detail.value[1]].replace('月', '');

    this.setData({
      startdate: startdate
    })
  },
  workstop: function (evenv) {
    var stopdate = this.data.workstartarray[0][evenv.detail.value[0]].replace('年', '.') + this.data.workstartarray[1][evenv.detail.value[1]].replace('月', '');
    this.setData({
      stopdate: stopdate
    })
  },
  textchange: function (event) {
    //个人简介
    var mythis = this;
    mythis.setData({
      textlen: event.detail.cursor
    })
  },
  formSubmit: function (res) {
    var work_id = res.detail.value.work_id || '';
    var mythis = this;
    var data = res.detail.value;
    if (!data.company) {
      app.showErrorMsg('请填写公司名称'); return;
    }
    if (!data.position) {
      app.showErrorMsg('请填写职位'); return;
    }
    if (!data.starttime) {
      app.showErrorMsg('请选择入职时间'); return;
    }
    if (!data.stoptime) {
      app.showErrorMsg('请选择离职时间'); return;
    }
    if (data.stoptime <= data.starttime) {
      app.showErrorMsg('请正确选择时间'); return;
    }
    if (data.results.length < 10) {
      // app.showErrorMsg('工作业绩必须大于10个字符');
      wx.showToast({
        title: '工作业绩必须大于10个字符',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/work.html',
      method: 'POST',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        data: data,
        work_id: work_id
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
          app.showErrorMsg(res.data.msg)
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
    var work_id = res.target.dataset.id;
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
            url: app.globalData.apiurl + 'Resume/delWork.html',
            method: 'POST',
            dataType: 'json',
            data: {
              validation: app.globalData.validation,//验证
              user_id: app.globalData.userInfo.user_id,
              work_id: work_id
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
        } else if (res.cancel) {
          // console.log('no')

        }
      }
    })
  }
})