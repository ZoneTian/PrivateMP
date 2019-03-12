//categorylist index.js
const app = getApp()

Page({
  data: {
    details: [],
    scrollHeight:""
  },

  onLoad: function() {
    let _this = this
    wx.request({
      url:"http://rap2api.taobao.org/app/mock/25013/user/backlists",
      method:"get",
      success:(data)=>{
        _this.setData({
          details : data.data.results.details
        })
      }
    })
    wx.getSystemInfo({
      success(res){
        _this.setData({
          scrollHeight: res.windowHeight - 20 +'px'
        })
      }
    })
  },
  onShareAppMessage:()=>{
    return {
      title:"转发小黑屋列表"
    }
  },
  onbottom:function (){
    let _this = this
    wx.request({
      url:"http://rap2api.taobao.org/app/mock/25013/user/backlists",
      method:"get",
      success:(data)=>{
         let datas = this.data.details.concat(data.data.results.details)
         _this.setData({
           details : datas
         })
      }
    })
  },
})
