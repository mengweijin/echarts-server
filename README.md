# echarts-server

<p align="center">
    <a target="_blank" href="https://github.com/mengweijin/echarts-server">
		<img src="https://img.shields.io/badge/repo-Github-purple" />
	</a>
    <a target="_blank" href="https://gitee.com/mengweijin/echarts-server">
		<img src="https://img.shields.io/badge/repo-码云 Gitee-purple" />
	</a>
    <a target="_blank" href="https://hub.docker.com/r/mengweijin/echarts-server/tags">
		<img src="https://img.shields.io/docker/v/mengweijin/echarts-server?label=docker image version" />
	</a>
    <a target="_blank" href="javascript:">
		<img src="https://img.shields.io/badge/docker architecture-linux/amd64, linux/arm64-green.svg" />
	</a>
    <a target="_blank" href="https://hub.docker.com/r/mengweijin/echarts-server">
		<img src="https://img.shields.io/docker/pulls/mengweijin/echarts-server" />
	</a>
    <a target="_blank" href="https://hub.docker.com/r/mengweijin/echarts-server">
		<img src="https://img.shields.io/docker/image-size/mengweijin/echarts-server?label=docker image size" />
	</a>
    <a target="_blank" href="https://hub.docker.com/r/mengweijin/echarts-server">
		<img src="https://img.shields.io/docker/stars/mengweijin/echarts-server" />
	</a>
</p>

一个 NodeJS 服务，提供后台接口（SSR渲染）生成 ECharts 图片。可 Docker 启动。

## Docker 启动

docker 镜像版本的前面部分和使用的 echarts 版本保持一致，镜像版本的最后一个部分为额外 echarts-server 小版本。

比如镜像版本 `6.0.0.1` 版本，表示使用 `echarts` 版本为 `6.0.0`，最后面的 `1` 为 `echarts-server` 的第一个版本。

```shell
docker pull mengweijin/echarts-server:6.0.0.1

docker run \
--name echarts-server \
-p 3000:3000 \
--restart=on-failure:3 \
-d mengweijin/echarts-server:6.0.0.1

```

## 源码启动

前提：需要 NodeJS 环境。

```sh
# 安装依赖
npm install

# 启动服务
npm start
```

## 请求说明

访问 3000 端口即可。

```text
POST 携带 RequestBody 参数请求 http://localhost:3000

# 或者（指定图片格式和大小）
POST 携带 RequestBody 参数请求 http://localhost:3000?type=svg&width=800&height=600
```

### 请求参数

|参数名称|是否必选|默认值|描述|
|----|----|----|----|
|type|否|png|图片类型。可选以下值：["svg", "jpeg", "png", "webp", "gif", "jp2", "tiff", "avif", "heif", "jxl"]|
|width|否|1200||
|height|否|900||

### 请求体（RequestBody。格式为 JSON，必填）

请求体同 echarts 中的 options 参数，与在 javascript 中不同的是，在 JSON 中，**key** 值需**要被双引号包裹**起来。

```json
{
    "xAxis": {
        "type": "category",
        "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "yAxis": {
        "type": "value"
    },
    "series": [
        {
            "data": [120, 200, 150, 80, 70, 110, 130],
            "type": "bar"
        }
    ]
}
```

### 请求示例一（不指定查询参数）

```shell
curl -X POST http://localhost:3000 -o echarts.png \
    -d '{
        "xAxis": {
            "type": "category",
            "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
                "data": [120, 200, 150, 80, 70, 110, 130],
                "type": "bar"
            }
        ]
    }'
```

### 请求示例二（指定查询参数）

```shell
curl -X POST http://localhost:3000?type=svg&width=800&height=600 -o echarts.png \
    -d '{
        "xAxis": {
            "type": "category",
            "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
                "data": [120, 200, 150, 80, 70, 110, 130],
                "type": "bar"
            }
        ]
    }'
```

## Echarts Options 的构建

请求体要符合 echarts 的格式的 JSON 对象，其中东西比较多，那么如何更方便的构建呢？提供以下几个思路。

1. 使用 JSONObject 直接手动构建，这个有点费劲。
2. 应用后端准备 *.json 文件模板，由应用后端读取后，替换关键数据参数，再调用 echarts-server 服务接口，以实现后端生成图片。
3. 使用 ECharts-Java 组件构建 Options：<https://github.com/ECharts-Java/ECharts-Java>

## 其它

echarts SSR 参考文档：<https://echarts.apache.org/handbook/zh/how-to/cross-platform/server/>

私有镜像：

```shell
docker pull registry.cn-hangzhou.aliyuncs.com/mengweijin/echarts-server:6.0.0.1
```
