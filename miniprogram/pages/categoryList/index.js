//.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    details: [],
    scrollHeight:""
  },

  onLoad: function() {
    let _this = this
    wx.request({
      url:"http://rap2api.taobao.org/app/mock/25013/user/backlists",
      method:"get",
      success:(data)=>{
        console.log(data.data.results)
        _this.setData({
          details : data.data.results.details
        })

        
      }
    })
    // if (!wx.cloud) {
    //   wx.redirectTo({
    //     url: '../chooseLib/chooseLib',
    //   })
    //   return
    // }
    wx.getSystemInfo({
      success(res){
        _this.setData({
          scrollHeight: res.windowHeight - 20 +'px'
        })
        // onsole.log(res.windowHeight)
      }

    })
    wx.getUserInfo({
      success:res => {
        console.log(res)
      }
    })
    // 获取用户信息
    // wx.getSettig({
    //   success: res => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onShareAppMessage:()=>{
    return {
      title:"转发小黑屋列表"
    }
  },
  onbottom:function (){
    console.log(234)
    let _this = this
    wx.request({
      url:"http://rap2api.taobao.org/app/mock/25013/user/backlists",
      method:"get",
      success:(data)=>{
        // this.details = this.
        // var a = this.details
         let datas = this.data.details.concat(data.data.results.details)
         _this.setData({
           details : datas
         })
        console.log(this.data)
      }
    })
  },
 

})
