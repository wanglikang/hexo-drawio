
# 备忘
本地链接本插件
```shell
npm link
```

在本地的其他项目中引用
```shell
npm link hexo-drawio
```

## 发布

发布的时候，可以去npm上申请一个publish的token，然后配置到项目的.npmrc里
```shell
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```
这样，就不用每次发布都需要输入用户名和密码了

***发布命令***
```shell
npm publish
```