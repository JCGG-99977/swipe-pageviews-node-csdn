const express = require('express')
const request = require('request')
const router = express.Router()
const util = require('util');
router.post('/go', (req, res) => {
    if (req.body.id === '' || req.body.id === null || req.body.id === undefined) {
        res.send({
            code: 400,
            msg: '用户ID无效，请仔细检查'
        })
    } else {
        // 博客数据链接
        var url = `https://blog.csdn.net/community/home-api/v1/get-tab-total?username=${req.body.id}`
        // 请求博客的数量
        request(url, (err, resp, body) => {
            var result1
            if (err) {
                console.log(err)
            } else {
                if (resp.statusCode === 200) {
                    // 将str转化为json
                    let obj = JSON.parse(body)
                    console.log("数量获取完成...")
                    res.send({
                        code: 200,
                        msg: '数量获取完成',
                        data: obj
                    })
                }
            }
        })
    }

})
// 获取具体博文数据
router.post('/user/blog', (req, res) => {
    var arr = [], arr1 = []
    // 循环数量
    var promise = new Promise((rej, resolve) => {
        for (let i = 1; i < (req.body.blog) / 20 + 1; i++) {
            // 通过另一接口访问对应页数和总数，获取相应的博文
            var url = `https://blog.csdn.net/community/home-api/v1/get-business-list?page=${i}&size=20&businessType=lately&noMore=false&username=${req.body.id}`
            request(url, (err, resp1, body) => {
                if (err) {
                    console.log(err)
                    resolve(err)
                } else {
                    if (resp1.statusCode === 200) {
                        // 将str转化为json
                        let obj = JSON.parse(body)
                        // 添加到数组中以便于下次的循环操作
                        arr.push(obj.data.list)

                    }
                }
            })
        }
        setTimeout(() => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === null) {
                    console.log(`第${i}项异常`)
                } else {
                    for (let j = 0; j < arr[i].length; j++) {
                        if (arr[i][j].type === "blog") {
                            arr1.push(
                                {
                                    title: arr[i][j].title,
                                    url: arr[i][j].url
                                }
                            )
                            rej(arr1)
                        }
                    }
                }
            }
        }, 3000)
    })
    setTimeout(() => {
        promise.then(res1 => {
            res.send({
                code: 200,
                data: res1,
                count: res1.length
            })
            arr = []
            arr1 = []
        }).catch(e => {
            res.send({
                code: 400,
                msg: e
            })
        })
    }, 5000)


})

router.post('/user/blog/go', (req, res) => {
    // // 代理服务器ip和端口,由快代理提供
    // let proxy_ip = '47.115.36.94';
    // let proxy_port = 16816;
    // // 完整代理服务器url
    // let proxy = util.format('http://%s:%d', proxy_ip, proxy_port);
    request(req.body.url,  (err, resp) => {
        if (err) {
            res.send({
                code: 400,
                mag: '访问错误' + err
            })
        } else {
            if (res.statusCode === 200) {
                res.send({
                    code: 200,
                    url: req.body.url
                })
            }
        }
    })
})

// //开始请求
// router.post('/user_blog/browser', (req, res) => {
//     // 链接
//     var UserUrl = req.body.List
//     // 随机的索引
//     var index;
//     // 记录总和
//     var count = 0;
//     var result1
//     // 随机打开某一链接
//     return new Promise((resolve, reject) => {
//         setInterval(() => {
//             index = Math.floor(Math.random() * UserUrl.length)
//             try {
//                 request(UserUrl[index].url, (err, resp) => {
//                     if (err) {
//                         reject("访问错误" + err)
//                     } else {
//                         if (resp.statusCode === 200) {
//                             // 总和增加
//                             count += 1    
//                             resolve(result1=({
//                                 code: 200,
//                                 index: index,
//                                 title: UserUrl[index].title,
//                                 url: UserUrl[index].url,
//                                 msg: '成功,第' + count + "次访问"
//                             }))
//                         }
//                     }
//                 })
//             } catch (e) {
//                 console.log("异常" + err)
//             }
//         }, 1000);
//     }).then(res1=>{
//         setInterval(()=>{
//             res.send(
//                 res1
//             )
//         },1000)

//     })

// })

module.exports = router