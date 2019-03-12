//index.js
var WxParse = require('../../wxParse/wxParse.js')

Page({
  data: {},
  onLoad: function() {
    var that = this,
        article = `< !DOCTYPE HTML ><!--注释: wxParse试验文本-->
      <div style="text-align:center;margin-top:10px;">
		
		<h1 style="color:red;">wxParse-微信小程序富文本解析组件</h1>
		<h2 >支持Html及markdown转wxml可视化</h2>
	</div>
		<div style="margin-top:10px;">
		<h3 style="color: #000;">支持的标签</h3>
		<blockquote>wxParse支持70%的html的标签</blockquote>
		<div style="margin-top:10px;">
			<span>span标签</span>
			<strong style="color: red;">strong标签</strong>
		</div>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持的标签ul/li</h3>
		<blockquote>带有内联的li</blockquote>
		<div style="margin-top:10px;">
			<ul>
				<li style="color: red;">我是li 红色</li>
				<li style="color: blue;">我是li 蓝色</li>
				<li style="color: yelloe;">我是li 黄色</li>
			</ul>
		</div>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持内联样式style</h3>
		<blockquote>wxParse可以渲染原html带有的style样式</blockquote>
		<div style="margin-top:10px;">
			<span>span标签</span>
			<strong>strong标签</strong>
		</div>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持class潜入</h3>
		<blockquote>wxParse可以注入html带有的class属性</blockquote>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持emojis小表情</h3>
		<blockquote>wxParse可以解析固定格式的小表情标签</blockquote>
		<div style="margin-top:10px;">
			<p>这里可以解析出emoji的表情[00][01][02][03][04][05][06][07][08][09]</p>
		</div>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持图片自适应</h3>
		<blockquote>wxParse可以动态计算图片大小并进行自适应适配</blockquote>
		<div style="margin-top:10px;">
			<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552286607124&di=9b9bdb6762e515bf09bf0b8345180734&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201603%2F23%2F20160323161700_4mE5j.jpeg" alt="">
			<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552286607124&di=a6cc078ed0bffafb4f39c4756d36a68a&imgtype=0&src=http%3A%2F%2Fimg18.3lian.com%2Fd%2Ffile%2F201711%2F29%2F902e7edae9dc5713e6fe776e4131aa29.png" alt="">
		</div>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持图片点击预览,左右滑动预览</h3>
		<blockquote>wxParse可以讲一篇文章中的几个图片一起预览</blockquote>
		<div style="margin-top:10px;">
			你可以点击上面的图片，将会进入预览视图，同时左右滑动可以切换图片预览
		</div>
	</div>

	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持多数据循环渲染</h3>
		<blockquote>wxParse支持特定设置下的多数据渲染，适用于在评论、多文本分别渲染等</blockquote>
		<div style="margin-top:10px; text-align:center;">
			请继续向下看，循环渲染多条html评论
		</div>
	</div>
	<div style="margin-top:10px;">
		<h3 style="color: #000;">支持短table标签</h3>
		<blockquote>wxParse目前对于table的支持比较有限</blockquote>
		<div style="margin-top:10px; text-align:center;">
			<table>
	  <tr>
			<th>标题1</th>
			<th>标题2</th>
			<th>标题3</th>
			<th>标题4</th>
			<th>标题5</th>
		</tr>
	  <tr>
		  <td>cell1</td>
			<td>cell2</td>
			<td>cell3</td>
			<td>cell4</td>
			<td>cell5</td>
		</tr>
		<tr>
		  <td>cell1</td>
			<td>cell2</td>
			<td>cell3</td>
			<td>cell4</td>
			<td>cell5</td>
		</tr>
	</table>
		</div>
	</div>
	<!--ap-->
    `;
		WxParse.wxParse('article','html',article,that,5)
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

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
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
