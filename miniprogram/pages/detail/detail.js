// pages/detail/detail.js
const db=wx.cloud.database() 
const app=getApp()
function pd(a,b){
  for(let i=0;i<a.length;i++){
    if(b==a[i]){
      return true
    }
  }
 return false
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    isFriend:false,
    isHidden:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options)
    let userId=options.userId
    db.collection('users').doc(userId).get().then((res)=>{
      this.setData({
        detail:res.data
      })
      let friendList=res.data.friendList;
      if(pd(friendList,app.userInfo._id)){
        this.setData({
          isFriend:true
        })
      }
      else{
        this.setData({
          isFriend:false,
        },()=>{
          if(userId==app.userInfo._id){
            this.setData({
              isFriend:true,
              isHidden:true
            })
          }
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  handleAddFriend(){
    if( app.userInfo._id ){
      db.collection('message').where({
        userId : this.data.detail._id
      }).get().then((res)=>{
        if (res.data.length){   // 更新
          // console.log(res.data)
          if (pd(res.data[0].list,app.userInfo._id)){
            wx.showToast({
              title: '已申请过!'
            })
          }
          else{
            wx.cloud.callFunction({
              name : 'update',
              data : {
                collection : 'message',
                where : {
                  userId : this.data.detail._id
                },
                data : `{list : _.unshift('${app.userInfo._id}')}`
              }
            }).then((res)=>{
              wx.showToast({
                title: '申请成功~'
              })
            });
          }
        }
        else{   // 添加 
          db.collection('message').add({
            data : {
              userId : this.data.detail._id,
              list : [ app.userInfo._id ]
            }
          }).then((res)=>{
            wx.showToast({
              title: '申请成功'
            })
          });
        }
      });
    }
    else{
      wx.showToast({
        title: '请先登录',
        duration : 2000,
        icon : 'none',
        success: ()=>{
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/user/user'
            })
          },2000);
        }
      })
    }
  },
  
})