var OrderXH = ""
var TimeID = ""
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    SlaveOrderInfos: {},
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取参数：绑定学号，预约时段ID
    var xh = options.xh
    TimeID = options.timeid
    OrderXH = options.xh
   
  },
  onShow:function(){
    var that = this
    wx.request({
      url: app.globalData.URL +'/GetOrderInfo',
      data: {
        "xh": OrderXH
      },
      header: { "content-type": 'application/json' },
      method: 'POST',
      success: function (res) {
        var data = res.data.Value
        // 查询预约成功
        if (res.data.Success) {
          if (data.IsMaster) {  //如果是预约提交着
            that.setData({
              SlaveOrderInfos: data.SlaveOrderInfos
            })
          } else {
            that.setData({
              Value: data
            })
          }
          var OrderCount = res.data.Value.SlaveOrderInfos.length
          // 最多只能帮领4人
          if(OrderCount == 4){
            that.setData({
              disabled: true
            })
          }
        }
      },
      fail: function (res) {
        console.log(res);
       },
    })
  }, 
  // 取消带领
  cancleOrder: (e) => {
    // 接收取消带领学号
    var cancleXH = e.currentTarget.dataset.xh
    wx.request({
      url: app.globalData.URL +'/CancelOrder',
      data: {
        "xh": cancleXH, 
      },
      header: { "content-type": 'application/json' },
      method: 'POST',
      success: function (res) {
        if (res.data.Success) {
        wx.redirectTo({
          url: `/pages/add/add?xh=${OrderXH}&timeid=${TimeID}`
        })
        } else {
          wx.showModal({
            content: '取消预约失败',
            confirmText: '确定',
            confirmColor: '#09bb07',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log("取消预约接口访问失败")
      },
    })
  },
  //添加带领
  OrderSubmit: function (e) {
    var that = this;
    var xh = e.detail.value.xh
    if(xh !="" && xh.length==12){
      //预约
      wx.request({
        url: app.globalData.URL +'/Order',
        data: {
          "xh": xh,
          "timeId": TimeID,
          "orderXh": OrderXH
        },
        header: { "content-type": 'application/json' },
        method: 'POST',
        success: function (res) {
          var msg = res.data.ErrorMessage
          if (res.data.Success) {
            wx.redirectTo({
              url: `/pages/add/add?xh=${OrderXH}&timeid=${TimeID}`,
            })
          } else {
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
    }
  }

})