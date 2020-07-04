// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'hyx07180913-9kgac'
})
const DB = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const _ = DB.command;
  let { id, comment_content, comment_src, comment_title, time, comment_id } = event;
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  let color= '#' + rgb.join('')
  let res = await DB.collection('Anime_audio_info')
  .where({
    audio_id: id
  }).update({
      data: {
        audio_comment: _.push({
          comment_id: comment_id+1,
          comment_title: comment_title,
          comment_content: comment_content,
          comment_src: comment_src,
          comment_mount: 0,
          color:color,
          time:time+1,
          iszhang:false
        })
      }
    })
  return {
    res
  }
}