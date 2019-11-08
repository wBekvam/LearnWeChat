var QRCode = require('../../utils/weapp-qrcode.js')
var app = getApp()
var paraXH = ""
var isOrder = ""
var TimeID = ""
Page({
  data: {
    Value: {},
    SlaveOrderInfos: {},
    isMaster: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    try{
      var OrderInfo = wx.getStorageSync("OrderInfo")
      if (OrderInfo.IsMaster) {
        // 预约提交者
        that.setData({
          Value: OrderInfo,
          SlaveOrderInfos: OrderInfo.SlaveOrderInfos,
          isMaster: true
        })
      } else {
        // 不是预约提交者
        that.setData({
          Value: OrderInfo,
          isMaster: false,
        })
      }
    }catch(e){
      console.log(e)
    }
  },
  onShow: function () {
    var that = this
    // 获取本地存储学号,预约状态
    paraXH = wx.getStorageSync('studentID')
    isOrder = wx.getStorageSync("isOrder")
    if(!paraXH && paraXH == ""){
      wx.switchTab({
        url: '/pages/bind/bind',
      })
      return;
    }else if(!isOrder){
      wx.switchTab({
        url: '/pages/book/book',
      })
    }
    var qrcode = new QRCode('canvas', {
      usingIn: this,
      text: paraXH,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    // 判断当前登陆的学号是否有预约时段
    wx.request({
      url: 'http://jygl.uoh.edu.cn/TmAPI/GetOrderInfo',
      data: {
        "xh": paraXH
      },
      header: { "content-type": 'application/json' },
      method: 'POST',
      success: function (res) {
        var data = res.data.Value
        // 查询预约成功
        if (res.data.Success) {
          if (data.IsMaster) {
            //如果是预约提交者
            that.setData({
              Value: data,
              SlaveOrderInfos: data.SlaveOrderInfos,
              isMaster: true
            })
            // 存储预约时段ID
            TimeID = data.OrderInfo.TimeID
            wx.setStorageSync("OrderInfo", data)
          } else {
            // 不是预约提交者
            that.setData({
              Value: data,
              isMaster: false,
            })
          }
        } else {
          // 没有预约
          wx.switchTab({
            url: '/pages/book/book',
          })
        }
      },
      fail: function (res) {
        console.log("预约查询失败")
       },
    })
  },
 
  //取消预约
  cancelOrder: (res) => {
    wx.request({
      url: 'http://jygl.uoh.edu.cn/TmAPI/CancelOrder',
      data: { "xh": paraXH },
      header: { "content-type": 'application/json'},
      method: 'POST',
      success: function(res) {
        if(res.data.Success){
          wx.showModal({
            content: '你已经取消预约领教材',
            confirmText: '确定',
            showCancel: false,
            confirmColor: '#09bb07',
            success: function (res) { 
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/book/book',
                })
              }
            },
          })
          wx.setStorageSync("isOrder", false)
        }else{
          wx.showModal({
            content: '取消预约失败',
            confirmText: '确定',
            confirmColor: '#09bb07',
            showCancel: false
          })
        }
      },
      fail: function(res) {
        console.log("查询预约失败")
      },
    })
  },
  //添加预约
  add:function(){
    console.log(paraXH)
    wx.navigateTo({
      url: `/pages/add/add?xh=${paraXH}&timeid=${TimeID}`,
    })
  }
})