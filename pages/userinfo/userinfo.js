// job/userinfo/userinfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconpath: app.globalData.iconpath,
    sexarray: ['女', '男'],
    workdatearray: ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '10年以上'],
    sex: '',//性别
    birthday: '',//生日
    workdate: '',//工作年限
    area: '',//工作城市
    textlen: 0,
    userinfo: [],
    alert: 'none',
    alertmsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })

    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'User/userInfo.html',
      method: 'GET',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          //成功
          mythis.setData({
            userinfo: res.data.data,
            textlen: res.data.data.introduction.length
          })

        } else {
          //失败
          wx.showToast({
            title: res.data.msg,
            // icon: 'success',
            image: '../../images/loginerror.png',
            duration: 3000
          })

        }

        wx.hideLoading();


      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常！',
          // icon: 'success',
          image: '../../images/loginerror.png',
          duration: 3000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/job/user/user',
          }, 1000)
        })


      }


    })
    wx.hideLoading();


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    //显示正在登录

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
  bindPickerChange: function (event) {
    // 选择性别
    var mythis = this;
    mythis.setData({
      sex: mythis.data.sexarray[event.detail.value]
    })
    // console.log(event)
  },

  birthdayChange: function (event) {
    console.log(event)
    // 出生日期
    var mythis = this;
    mythis.setData({
      birthday: event.detail.value
    })
    console.log(event)

  },
  workdateChange: function (event) {
    //工作年限
    var mythis = this;
    mythis.setData({
      workdate: mythis.data.workdatearray[event.detail.value]
    })
  },
  areaChange: function (event) {
    //工作城市
    var mythis = this;
    mythis.setData({
      area: event.detail.value[0] + '-' + event.detail.value[1] + '-' + event.detail.value[2]
    })
  },
  textchange: function (event) {
    //个人简介
    var mythis = this;
    mythis.setData({
      textlen: event.detail.cursor
    })
  },
  showmsg: function (msg) {
    var mythis = this;
    mythis.setData({
      alert: 'block',
      alertmsg: msg
    })
    setTimeout(function () {
      mythis.setData({
        alert: 'none',
      })
    }, 2000)

  },
  formSubmit: function (res) {
    //提交
   
    var data = res.detail.value
    var mythis = this
    console.log(res)
    //验证
    if (!data.username) {
      app.showErrorMsg('请填写姓名');
      return
    }
    if (!data.borndate || data.borndate == '0000-00-00') {
      app.showErrorMsg('请选择出生年月');
      return;
    }
    if (!data.worktime) {
      app.showErrorMsg('请选择工作年限');
      return;
    }
    if (!data.city) {
      app.showErrorMsg('请选择所在城市');
      return;
    }
    if (!data.mobile) {
      app.showErrorMsg('请输入联系方式');
      return;
    }

    if (!app.globalData.mobile.test(data.mobile)) {
      app.showErrorMsg('手机格式错误');
      return;
    }

    if (data.introduction.length < 10) {
      app.showErrorMsg('简介不能小于10字符');
      return;
    }
    if (data.sex == '男') {
      data.sex = 1;
      
    } else {
      data.sex = 0;

    }
    wx.showLoading({
      title: '提交中...',
    })
    //发起网络请求
    wx.request({
      url: app.globalData.apiurl + 'User/userInfo.html',
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
        console.log(res)
        if (res.data.code == 200) {
          //成功
          wx.hideLoading()
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack();



        } else {
          //失败
          wx.showToast({
            title: res.data.msg,
            // icon: 'success',
            image: '../../images/loginerror.png',
            duration: 3000
          })

        }
        wx.hideLoading();
      },
      fail: function (res) {
        app.showNetworkError();
        wx.hideLoading();
      }
    })


  }
})