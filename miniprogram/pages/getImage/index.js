//index.js
const app = getApp()

Page({
  data: {
		avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
	},
  onLoad: function() {



	
  },

  onGetUserInfo: function(e) {
    console.log(e)
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onCanvas:function(e){
    // console.log(this.onGetUserInfo(e))
    console.log(e)
    const ctx=wx.createCanvasContext('card')
    ctx.setTextAlign("center");
    ctx.setFillStyle("#000000");
    ctx.setFontSize(16);
    ctx.fillText(e.detail.userInfo.nickName,100,30)
    const size = 80;
    ctx.drawImage(e.detail.userInfo.avatarUrl,60,50,size,size)
    ctx.stroke();
    ctx.draw()
		// wx.login({
		// 	success(res){
		// 		console.log("login",res)
		// 	}

		// })
	},
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
				app.globalData.openid = res.result.openid
				
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
