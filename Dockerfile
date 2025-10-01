FROM node:24.9.0-slim

WORKDIR /home/app

# 设置时区
ENV TZ=Asia/Shanghai

# 复制字体文件
# SIMSUN.TTC 是宋体
# SIMFANG.TTF 是仿宋
# SIMHEI.TTF 是黑体
COPY fonts/* /usr/share/fonts/

# 复制应用文件
COPY app.js package.json /home/app/

# # 仅装生产依赖
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
