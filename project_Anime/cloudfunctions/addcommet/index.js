// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hyx07180913-9kgac'
})
const db = cloud.database();
const _ = db.command;
const commetCollcetion = db.collection('Anime_Commet')
// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id,
    commet_image,
    title,
    navigateto_url,
    commet_name,
    commet,
    hot
  } = event;
  let res;
  let data = []
  data = await commetCollcetion.where({
    id:id
  }).get();
  if(data.data.length !== 0){
    //进行删除
    if(commet === false){
     res = await commetCollcetion.where({id:id}).remove();
    }
    return
  }
   res = await commetCollcetion.add({
    data: {
      id,
      commet_image,
      title,
      commet:true,
      navigateto_url,
      commet_name,
      hot
    }
  })
  return {
    res
  }
}