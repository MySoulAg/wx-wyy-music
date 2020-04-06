import {
    request
} from '../utils/http.js'
const baseUrl = 'https://ly.piaoliangnanhai.xyz'

/**获取推荐歌单 */
exports.getRecommendedList = () => {
    return request({
        method: 'get',
        url: baseUrl + '/personalized',
    })
}

/**获取排行榜歌单 */
exports.getRankingList = () => {
    return request({
        method: 'get',
        url: baseUrl + '/toplist/detail',
    })
}

/**获取我的歌单 */
exports.getUserList = (uid) => {
    return request({
        method: 'get',
        url: baseUrl + '/user/playlist',
        data: {
            uid
        }
    })
}

/**获取歌单详情 */
exports.getAlbumDetail = (id) => {
    return request({
        method: 'get',
        url: baseUrl + '/playlist/detail',
        data: {
            id
        }
    })
}

/**获取歌曲Url */
exports.getSongUrl = (id) => {
    return request({
        method: 'get',
        url: baseUrl + '/song/url',
        data: {
            id
        }
    })
}

/**获取歌曲详情 */
exports.getSongDetail = (ids) => {
    return request({
        method: 'get',
        url: baseUrl + '/song/detail',
        data: {
            ids
        }
    })
}

/**获取歌词 */
exports.getLyric = (id) => {
    return request({
        method: 'get',
        url: baseUrl + '/lyric',
        data: {
            id
        }
    })
}