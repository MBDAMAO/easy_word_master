# 一个用来背单词的摸鱼软件（开发中）

# 技术选型

    electron, sqlit3

# 功能&特点

1. 小窗口置顶显示、摸鱼必备
2. 定时滚动播放单词、手动翻页
3. 支持多种词库，网络爬取高质量例句
4. 多种主题样式更换
5. 单机运行、无需联网、进度自动保存
6. 快捷键支持
7. 朗读功能支持

![p1](https://github.com/MBDAMAO/easy_word_master/blob/master/doc/020147.png)
![p2](https://github.com/MBDAMAO/easy_word_master/blob/master/doc/020156.png)
![p3](https://github.com/MBDAMAO/easy_word_master/blob/master/doc/020201.png)
![p4](https://github.com/MBDAMAO/easy_word_master/blob/master/doc/020206.png)
![p5](https://github.com/MBDAMAO/easy_word_master/blob/master/doc/020216.png)
![p6](https://github.com/MBDAMAO/easy_word_master/blob/master/doc/020231.png)

## TODO-LIST

1. 导入、导出
2. 收藏单词
3. 指定项跳转
4. 背单词模式
5. NOT JUST WORDS

# 使用方式

## 以项目启动

```shell
git clone https://github.com/MBDAMAO/easy_word_master.git
cd ./easy_word_master
npm install
npm start
```

### 注意事项

项目依赖 sqlite3, 如果安装失败可检查 win 构建工具是否完整（winSDK 版本选 10）

## release 版本

不久后发布...

# 使用说明

1. 点击单词可发音，图标为黄则正在网络请求资源，为绿则开始播放
2. 可能会存在音标和发音不同的状况
3. 点击序号可打开菜单
4. mp3 语音缓存需要在菜单里手动清除

## 快捷键

| key                   | 功能        |
|-----------------------|-----------|
| PageUp / ArrowLeft    | 跳转到上一项    |
| PageDown / ArrowRight | 跳转到下一项    |
| blank                 | 随机一项      |
| p                     | 暂停/开始播放   |
| r                     | 随机播放开启/关闭 |
| INS                   | 添加到自定义词书  |
| DEL                   | 从自定义词书删除  |