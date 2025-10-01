import express from 'express';
import cors from 'cors';
import * as echarts from 'echarts';
import sharp from 'sharp';

const supported = ["svg", "jpeg", "png", "webp", "gif", "jp2", "tiff", "avif", "heif", "jxl"];

const app = express();

// 默认允许所有跨域请求，并自动处理预检请求 (OPTIONS)返回正确的响应头
// 此外，cors 也可以配置为限制特定的域名和方法，比如开发环境下需要暴露到公网时。
app.use(cors());
// 解析 application/x-www-form-urlencoded 格式。extended: true 支持嵌套对象解析
app.use(express.urlencoded({ extended: true }));
// 解析 application/json 格式
app.use(express.json());

// 为路径“/” 的 GET 请求定义路由处理程序
app.post('/', (req, res) => {
    // 从查询参数中获取 type 参数，默认值为 'png'
    let imageType = req.query.type?.toLowerCase() || 'png';
    let width = req.query.width || 1200;
    let height = req.query.height || 900;
    const data = req.body;

    const svg = renderSVG(width, height, data);
    let svgBuffer = Buffer.from(svg);
    const fileName = `echarts-server-${Date.now()}.${imageType}`; 

    res.set({ 
        'Content-Type': `image/${imageType}`,
        'Content-Disposition': `attachment; filename="${fileName}"`, 
        'Cache-Control': 'no-cache'
    });

    if (imageType === 'svg') {
        res.set({ 'Content-Type': 'image/svg+xml;charset=utf-8' });
        // 向请求客户端发送 HTTP 响应消息（返回的是 SVG 字符串）
        res.send(svgBuffer);
    } else if (supported.includes(imageType)) {
        sharp(svgBuffer).toFormat(imageType).toBuffer()
        .then( data => { 
            res.send(data);
        })
        .catch( err => { 
            res.status(500).send('Failed to generate a ' + imageType + ' image! ' + err.message); 
        });
    } else {
        res.status(400).send('Unsupported image format: ' + imageType);
    }
})

app.listen(3000, () => {
    console.log('ECharts server listening on port 3000')
})

// 服务端 SVG 渲染的整体代码结构
function renderSVG(width, height, options) {
    // 在服务端 SVG 渲染模式下第一个参数不需要再传入 DOM 对象
    const chart = echarts.init(null, null, {
        renderer: 'svg',    // 指定使用 SVG 模式
        ssr: true,          // 开启 SSR
        width: width,       // 需要指明高和宽
        height: height
    })
    // 正常使用 setOption
    chart.setOption(options);
    // 使用 renderToSVGString 将当前的图表渲染成 SVG 字符串
    return chart.renderToSVGString();
}
