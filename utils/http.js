exports.request = ({
    data,
    method,
    url
}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            data,
            header: {
                'Content-Type': 'application/json'
            },
            method,
            success: (res) => {
                resolve(res.data)
            },
            fail: () => {
                reject()
            }
        })
    })
}