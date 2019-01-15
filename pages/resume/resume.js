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
    switch_: 0,
    icon: '',
    photosdisplay: 'none',
    background: '',
    slecount: '',
    count: '',
    start: 0,
    stop: 0,
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userinfo')
    this.setData({
      userInfo: userInfo
    })
    if (!app.reuser()) {
      return;
    }

    var mythis = this;
    wx.showLoading({
      title: '加载中...',
    })
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/index.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: userInfo.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          mythis.setData({
            data: res.data.data,
            switch_: res.data.data.resume.switch
          })
          if (res.data.data.resume) {
            mythis.setData({
              photos: res.data.data['resume']['photos']
            })
          }

        } else {
          //登录失败
          app.showErrorMsg('加载失败')
        }

      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();

      }
    })
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     path: '/pages/resumeDetail/resumeDetail?userid=' + app.globalData.userInfo.userid
  //   };
  // },
  userinfo: function () {
    // 跳转到编辑个人信息
    wx.navigateTo({
      url: '../userinfo/userinfo',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  restatus: function () {
    wx.navigateTo({
      url: '../status/status',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  upload: function (res) {
    
    var mythis = this;
    // var userInfo = mythis.data.userInfo
    // console.log(userInfo)
    //获取还可以上传的数量
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/getPhotoNum.html',
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
          var num = res.data.data.count
          //上传图片
          wx.chooseImage({
            count: num, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              var tempFiles = res.tempFiles;
              var count = tempFilePaths.length;
              var ii = 0;
              // 上传图片
              wx.showLoading({
                title: '上传中...',
              })
              for (var i = 0; i < tempFilePaths.length; i++) {
                const uploadTask = wx.uploadFile({
                  url: app.globalData.apiurl + 'Upload/images.html',
                  filePath: tempFilePaths[i],
                  name: 'coverurl',
                  formData: {
                    validation: app.globalData.validation,//验证
                    user_id: app.globalData.userInfo.user_id
                  },
                  success: function (res) {
                    wx.hideLoading()
                    var data = JSON.parse(res.data)
                    if (data.code == 200) {
                      var photos = mythis.data.photos;
                      photos.push(data.data)
                      mythis.setData({
                        photos: photos
                      })

                    } else {
                      wx.hideLoading()
                      wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  },
                  fail: function (res) {
                    wx.hideLoading()
                    // 上传失败
                    wx.showToast({
                      title: '上传失败',
                      // icon: 'success',
                      image: '../../images/loginerror.png',
                      duration: 3000
                    })
                  }
                })
                //上传
                uploadTask.onProgressUpdate((res) => {
                  if (res.progress >= 100) {
                    wx.showToast({
                      title: '上传成功',
                      icon: 'success',
                      // image: '../../images/loginerror.png',
                      duration: 1000
                    })
                    ii = ii + 1;
                    if (ii >= count) {
                      wx.hideLoading()
                    }
                  }
                  // console.log('上传进度', res.progress)
                  // console.log('已经上传的数据长度', res.totalBytesSent)
                  // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                })
              }
            }
          })
        } else {
          app.showErrorMsg('网络异常');
          wx.hideLoading()
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
  uploadViedo: function (res) {
    wx.chooseVideo({
      //album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
      sourceType: ['album', 'camera'],
      //拍摄视频最长拍摄时间，单位秒。最长支持60秒
      maxDuration: 60000000000000,
      //前置或者后置摄像头，默认为前后都有，即：['front', 'back']
      camera: ['front', 'back'],
      //接口调用成功，返回视频文件的临时文件路径，详见返回参数说明
      success: function (res) {

        console.log(res.tempFilePath)
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath)

        const uploadTask = wx.uploadFile({
          url: app.globalData.apiurl + 'Upload/images.html', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'coverurl',
          formData: {
            validation: app.globalData.validation,//验证
            user_id: userInfo.user_id,
          },
          success: function (res) {
            // var data = res.data
            // console.log(res)
            //do something
          }
        })

      }
    })
  },
  delimage: function (res) {
    var mythis = this;
    var src = res.target.dataset.src;
    var photos = mythis.data.photos;
    var count = photos.length;//总张数
    //计算当前是第几张
    for (var index in photos) {
      if (photos[index] == src) {
        var slecount = Math.floor(index) + 1;
      }
    }
    mythis.setData({
      photosdisplay: 'block',
      background: src,
      slecount: slecount,
      count: count
    })

    // wx.previewImage({
    //   current: src, // 当前显示图片的http链接
    //   urls: mythis.data.photos // 需要预览的图片http链接列表
    // })
  },
  guanbi: function (res) {
    this.setData({
      photosdisplay: 'none',
    })
  },
  fabu: function (res) {
    var mythis = this;
    // wx.showLoading({
    //   title: '正则检测简历完善度...',
    // }) 
    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/switch.html',
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
          console.log(res)
          app.showsuccessMsg(res.data.msg);
          mythis.setData({
            switch_: res.data.data.switch
          })
        } else {
          app.showErrorMsg(res.data.msg)
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
      }
    })
    // wx.hideLoading()
   
  },
  uploadIcon: function (res) {
    //上传头像
    var mythis = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // 上传图片
        wx.showLoading({
          title: '上传中...',
        })
        const uploadTask = wx.uploadFile({
          url: app.globalData.apiurl + 'Upload/uploadIcon.html', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'coverurl',
          formData: {
            validation: app.globalData.validation,//验证
            user_id: app.globalData.userInfo.user_id,
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.code == 200) {
              mythis.setData({
                icon: data.data.filePath
              })
              
              app.showsuccessMsg(data.msg);
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
        wx.hideLoading()
      }
    })
  },
  touchS: function (res) {
    this.setData({
      start: res.changedTouches[0].clientX
    })
  }
  ,
  touchM: function (res) {

  }
  ,
  touchE: function (res) {
    var mythis = this;
    var photos = mythis.data.photos;
    var stop = res.changedTouches[0].clientX;
    if (mythis.data.start - 20 > stop) {
      for (var index in photos) {
        if (photos[index] == mythis.data.background) {
          var background = photos[Math.floor(index) + 1];
          if (!background) return;
          mythis.setData({
            background: background,
            slecount: Math.floor(index) + 2
          })
          break;
        }
      }

    } else if (mythis.data.start + 20 < stop) {
      for (var index in photos) {
        if (photos[index] == mythis.data.background) {
          var background = photos[Math.floor(index) - 1];
          if (!background) return;
          mythis.setData({
            background: background,
            slecount: Math.floor(index)
          })
          break;
        }
      }

    }
  },
  delete: function (res) {
    var mythis = this;
    var src = mythis.data.background;
    wx.showLoading({
      title: '删除中...',
    })

    //发起网络请求登录
    wx.request({
      url: app.globalData.apiurl + 'Resume/delphoto.html',
      method: 'get',
      dataType: 'json',
      data: {
        validation: app.globalData.validation,//验证
        user_id: app.globalData.userInfo.user_id,
        src: src
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //请求成功
        if (res.data.code == 200) {
          var photos = mythis.data.photos;
          var photos2 = [];
          for (var index in photos) {
            if (photos[index] != src) {
              photos2.push(photos[index]);
            }
          }
          mythis.setData({
            photos: photos2,
            photosdisplay: 'none'

          })
          

        } else {
          app.showErrorMsg(res.data.msg);
        }
      },
      fail: function (res) {
        //请求失败
        app.showNetworkError();
        wx.hideLoading();
      }
    })
    wx.hideLoading();
  }

})