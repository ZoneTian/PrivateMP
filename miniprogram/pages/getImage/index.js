//getimage index.js
const app = getApp()
const regeneratorRuntime = require('../../util/runtime')

Page({
  data: {
		avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    imgpath:"",
    show:true
	},
  onLoad: function() {
	
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  procanvasToTempFilePath:()=>{
    return new Promise((res,rej)=>{
      wx.canvasToTempFilePath({
        canvasId:"card",
        quality:1,
        success:res,
        fail:rej
      })
    })
  },
  saveImage(rs){
    let that = this 
    return new Promise((res,rej)=>{
      wx.saveImageToPhotosAlbum({
        filePath:that.data.imgpath,
        success:res,
        fail:rej
      })
    })
  },
  downloadA(url){
    return new Promise((res,rej)=>{
      wx.downloadFile({
        url:url,
        success:res,
        fail:rej
      }) 
    })
  },
  opensetting(res){
   let that = this
   return new Promise((res,rej)=>{
     wx.openSetting({
       success(data){
         if(data.authSetting['scope.writePhotosAblum']){
           res(data)
         }else{
          that.saveImage()
         }
       },
       fail(err){
         rej(err)
       }
     })
   })
  },
  showmodal(){
    let that = this
    return  new Promise((res,rej)=>{
      wx.showModal(
        {
          content:"请授权",
          success(data){
            if(data.confirm){
              that.opensetting().then(()=>{
                res()
              })
            }else{
              // that.saveImage(res)
            }
          }
        }
      )
    })
  },
  async onCanvas(e){
    let that = this
    const ctx=wx.createCanvasContext('card')
    ctx.setTextAlign("center");
    ctx.setFillStyle("#000000");
    ctx.setFontSize(16);
    ctx.fillText(e.detail.userInfo.nickName,100,30)
    const size = 80;
    let res = await this.downloadA(e.detail.userInfo.avatarUrl);
    ctx.drawImage(res.tempFilePath,60,50,size,size)
    ctx.stroke();
    ctx.draw(false,async ()=>{
      let res = await this.procanvasToTempFilePath()
      that.setData({
        imgpath:res.tempFilePath,
        show:false
      })
      try{
        await this.saveImage(res)
        wx.showToast({
          title:"图片生成成功",
          icon:"none"
        })
      }catch(e){
        if(e.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' ||
        e.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
          await that.showmodal()
        }

        // wx.sshowToast({
        //   title:"图片生成失败",
        //   icon:"none"
        // })
       
        // wx.setting
      }
    })
    // wx.downloadFile({
    //   url:e.detail.userInfo.avatarUrl,
    //   success:(res)=>{
    //     // ctx.drawImage(res.tempFilePath,60,50,size,size)
    //     // ctx.stroke();
    //     ctx.draw(false,()=>{
    //       wx.canvasToTempFilePath({
    //         canvasId:"card",
    //         quality:1,
    //         success(rs){
    //           that.setData({
    //             imgpath:rs.tempFilePath,
    //             show:false
    //           })
    //           wx.saveImageToPhotosAlbum({
    //             filePath:rs.tempFilePath,
    //             success(mes){
    //               wx.showToast({
    //                 title:"图片生成成功",
    //                 icon:"none"
    //               })
    //             },
    //             fail(res){
    //               wx.showToast({
    //                 title:"图片生成失败",
    //                 icon:"none"
    //               })
    //             }
    //           }) 
        
    //         }
    //       })
         
    //     })
    //     }
    // })
	},
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
				app.globalData.openid = res.result.openid		
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  onShareAppMessage:function(opt){
    return {
      title:"转发我的名片",
    }
  },

})
