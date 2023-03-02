module.exports={
    devServer: {
        host: 'localhost',
        port: 80,
        proxy: {
            '/': {
                // websocket
                ws: false,
                secure: false,
                // 目标地址
                target: 'http://localhost:8898',
                // 发送请求头host 会被设置为target
                changeOrigin: true,
                // 不重写请求地址
                pathRewrite: {
                    '^/':''
                }
            }
        },
    },
    css: {
        loaderOptions: {
            css: {},
            postcss: {
                plugins: [
                    require("postcss-px2rem")({
                        remUnit: 192, //  设计图宽度/10
                        exclude:/node_modules|element-ui/ , //此目录下的文件中的px不会被转换为rem
                    })
                ]
            }
        }
    },
}