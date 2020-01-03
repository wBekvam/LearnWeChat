let time;
var app = getApp()
Page({
   data: {
     loading: false,
     studentID: '',
     password: '',
     showTipMsg: false,
     tipMsg: '',
     xh_input_style: ''
  },
  onShow:function(){
    var that = this
    var stuID = wx.getStorageSync("studentID")
    if(stuID){
      that.setData({
        showTipMsg: true,
        tipMsg: `你已绑定学号 ${stuID}`,
        studentID: stuID
      })
    }
  },
  formSubmit: function (e) {
    var that = this
    // 获取用户输入的学号，密码
    var xh = e.detail.value.xh
    var pwd = e.detail.value.pwd
    if(xh == '' || pwd == ''){
      this.showTipMsg("学号或密码不能为空")
      return;
    }
    var existXH = wx.getStorageSync("studentID");
    if(existXH != ""){
      wx.setStorageSync("studentID", "")
    } 
    // 教务系统认证
    wx.request({
      url: app.globalData.URL+'/CheckLogin',
      data: {
        "xh": xh,
        "pwd": pwd
      },
      header: { "content-type": 'application/json' },
      method: 'POST',
      success: function(res) {
        if(res.data.Success){
          //学号密码验证成功,将学号本地存储
          try {
            wx.setStorageSync('studentID', xh)
          } catch (e) { 
            console.log(e)
          }
          that.setData({
            studentID: xh,
            password: '',
            showTipMsg: true,
            tipMsg: `你已绑定学号 ${xh} `
          })
          app.globalData.isLogin = true
          // 判断当前登陆的学号是否有预约时段
          wx.request({
            url: app.globalData.URL +'/GetOrderInfo',
            data: {
              "xh": xh
            },
            header: { "content-type": 'application/json'},
            method: 'POST',
            success: function(res) {
              if (res.data.Success) {
                /*有预约时段，跳转到带领页面
                * 参数：学号：xh
                */
                //有预约时段，将预约信息本地存储
                try {
                  wx.setStorageSync('isOrder', true);
                  wx.setStorageSync("OrderInfo", res.data.Value);
                } catch (e) {
                  console.log(e)
                }
                wx.switchTab({
                  url: '/pages/help/help'
                })
              } else {
                /*没有预约时段，跳转到预约
                * 参数：学号：xh
                */
                wx.switchTab({
                  url: '/pages/book/book',
                })
              }
            },
            fail: function(res) {
              console.log("查询预约失败")
            },
          })
        }else{
          app.globalData.isLogin = false
          that.showTipMsg("密码不正确")
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  //学号验证
  bindStudentID: function(e){
    var that = this
    var xh = e.detail.value
    if(xh.length !== 12){
      that.setData({
        xh_input_style: 'red'
      })
      this.showTipMsg("请输入正确的学号")
    }else{
      that.setData({
        xh_input_style: ''
      })
    }
  },
  // 提示弹框
  showTipMsg: function(msg){
    var that = this
    that.setData({
      showTipMsg: true,
      tipMsg: msg
    })
    setTimeout(() => {
      that.setData({
        showTipMsg: false,
      })
    }, 1500)
  }
  
})