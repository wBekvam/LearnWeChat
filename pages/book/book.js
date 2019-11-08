let timer
var paraXH = ''
var winHeight = ''
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showNotic: true,
    book_Height: '',
    curNav: 0,
    curTime: "0",
    orderNotic: '',
    Value: [],
    orderDate: [],
    scrollTopId: "a",
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取本地存储学号
    paraXH = wx.getStorageSync("studentID")
    if (!paraXH && paraXH == "") {
      wx.switchTab({
        url: '/pages/bind/bind',
      })
    }
    //若有本地有缓存先渲染
    var orderValue = wx.getStorageSync("orderValue");
    var orderNotic = wx.getStorageSync("orderNotic");
    var orderDate = wx.getStorageSync("orderDate");
    if (orderValue && orderDate && orderNotic) {
      that.setData({
        Value: orderValue,
        orderNotic: orderNotic,
        orderDate: orderDate,
      })
    } 
  },

  onShow:function(){
    var that = this
    // 获取本地存储学号
    paraXH = wx.getStorageSync('studentID')
    if (!paraXH && paraXH =="") {
      wx.switchTab({
        url: '/pages/bind/bind',
      })
    }
    that.setData({
      showNotic: true,
      // curTime: "0",
      book_Height: winHeight - 185
    })
    //获取公告
    wx.request({
      url: "http://jygl.uoh.edu.cn/TmAPI/GetNotice",
      method: 'post',
      data: {},
      header: { "content-type": 'application/json' },
      success: function (res) {
        if (res.data.Success) {
          var orderNotic = res.data.Value.GGNR
          that.setData({  //再次渲染
            orderNotic: orderNotic
          })
          //覆盖缓存
          wx.setStorageSync("orderNotic", orderNotic);
        }
      },
      fail: function (e) {
        console.log("公告获取失败")
      }
    })
    // 获取时段
    wx.request({
      url: "http://jygl.uoh.edu.cn/TmAPI/GetTimeList",
      method: 'post',
      data: {},
      header: { "content-type": 'application/json' },
      success: function (res) {
        if (res.data.Success) {
          var Value = res.data.Value
          var orderDate = []
          for (var i = 0; i < Value.length; i++) {
            var item = {
              "time": Value[i].TheDate,
              "dateId": i
            }
            orderDate.push(item)
          }
          that.setData({
            Value: Value,
            orderDate: orderDate
          })
          //覆盖缓存
          wx.setStorageSync("orderValue", Value);
          wx.setStorageSync("orderDate", orderDate)
        }
      },
      fail: function (e) {
        that.setData({
          Value: that.Value_test,
          bookDate: that.bookDate_test
        })
        console.log("预约时段获取失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取可视区域屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        winHeight = res.windowHeight
      },
    })
  },

  // 左侧点击事件，选择日期
  selectNav: function(event) {
    var that = this;
    let curNav =  parseInt(event.currentTarget.dataset.dateid);
    that.setData({
      curNav: curNav,
      curTime: "0"
    })
    // console.log(event.currentTarget.dataset.dateid);
    // console.log(event.currentTarget);
  },
  //右边点击事件，选择时段
  selectTime: function (e) {
    var that = this;
    let curTime = e.currentTarget.dataset.timeid;
    that.setData({
      curTime: curTime,
    })
  },
  //预约时段，点击预约
  bindBook:function(e){
    var that = this;
    var curTime = e.currentTarget.dataset.timeid;
    //预约
    wx.request({
      url: 'http://jygl.uoh.edu.cn/TmAPI/Order',
      data: { 
        "xh": paraXH, 
        "timeId": curTime,
        "orderXh": paraXH
        },
      header: { "content-type": 'application/json'},
      method: 'POST',
      success: function (res) { 
        var msg = res.data.ErrorMessage
        console.log(res)
        if(res.data.Success){
          wx.setStorageSync('isOrder', true)
          wx.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 1500
          })
          wx.switchTab({
            url: `/pages/help/help?xh=${paraXH}`,
          })
        }else{
          wx.showModal({
            content: msg,
            confirmText: '确定',
            showCancel: false
          })
        }
        
      },
      fail: function (res) { 
        console.log("预约失败")
      },
    })   
  },
  //关闭通知
  closeNotic: function(e){
    var that = this
    console.log(winHeight)
    that.setData({
      showNotic: false,
      book_Height: winHeight - 45
    })
  },

  rightScroll:function(e){
    clearTimeout(timer);
    timer = setTimeout( () => {
      // console.log(e.detail)
    },800)
  }

})