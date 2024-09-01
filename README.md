# hexo-drawio



A Hexo plugin, used to embed drawio files everywhere locally


# Usage

## Integrated into Hexo

use hexo's tag **drawio_file_path** 
```
{% drawio_file_path ../drawioSources/Redis.drawio %}
```

![img.png](./imgs/usage_01.png)

## Example

after generate static files. it looks like

![img.png](./imgs/example_01.png)

# Detail

see detail : https://github.com/wanglikang/hexo-drawio

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
