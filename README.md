# hexo-drawio



A Hexo plugin, used to embed drawio files everywhere locally


# Usage

## Integrated into Hexo

use hexo's tag **drawio_file_path** 
```
{% drawio_file_path filePath=../drawioSources/Redis.drawio needCheck=true %}
```

![使用示意图](./imgs/usage_01.png)


# Detail
## filePath参数
drawio文件相对路径，相对于当前编辑中的文章的(../_post/xxxx.md) 的相对路径

## needCheck参数
针对.drawio文件，进行文件合理性校验
+ 是否为合法的xml文件
+ xml的根节点是否为 mxfile


see detail : https://github.com/wanglikang/hexo-drawio
