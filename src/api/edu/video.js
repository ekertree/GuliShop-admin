import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video) {
      return request({
        url: `/eduservice/video/addVideo`,
        method: 'put',
        data: video
      })
    },
    //根据id删除小节
    deleteVideo(id) {
        return request({
          url: `/eduservice/video/${id}`,
          method: 'delete',
        })
    },
    //根据id获取小节信息
    getVideoInfo(id) {
      return request({
        url: `/eduservice/video/getVideoInfo/${id}`,
        method: 'get'
      })
    },
    //修改小节
    updateVideo(video){
      return request({
        url: `/eduservice/video/updateVideo`,
        method: 'put',
        data: video
      })
    },
    //删除视频
    removeAliYunVideo(id){
      return request({
        url: `/eduvod/video/removeAliYunVideo/${id}`,
        method: 'delete',
      })
    },
}