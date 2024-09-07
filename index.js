'use strict';

const parseTagArguments = require('hexo-util-parse-tag-arguments');
const fs = require('fs-extra');
const path = require('path');
const he = require('he');
const cheerio = require('cheerio');
const config = require("./lib/config")(hexo);

const xml2js = require('xml2js');

async function parseBodyFromHtml(sourceContent) {
    const $ = cheerio.load(sourceContent);
    return $('div.mxgraph').attr('data-mxgraph');
}

async function generateTagFromSource(context, drawioFilePath,  options) {
    const sourcePath = path.resolve(path.dirname(context.full_source), drawioFilePath,);

    const start = performance.now();
    const drawioFilePathInPost = options.file;
    const drawioContentBuffer = await fs.readFile(sourcePath);
    const source = drawioContentBuffer.toString('utf-8');
    let encode = '';
    if(sourcePath.endsWith(".drawio")){
        let wrapData = {}
        wrapData.highlight = '#0000ff';
        wrapData.nav = true;
        wrapData.resize = true;
        wrapData.toolbar = 'zoom layers tags lightbox';
        wrapData.xml = source;
        //此处一定要把\n 给转义掉，否则，可能引起页面上的js不完整，坑
        encode = he.encode(JSON.stringify(wrapData)).replaceAll('\n',"");
    }else{
        const dataMxgraph = await parseBodyFromHtml(source);
        encode = he.encode(dataMxgraph);
    }

    const end = performance.now();
    console.info(`INFO\thexo-drawio:\t解析drawio文件耗时: ${context.source} -> ${drawioFilePathInPost}:\t${end - start} ms`);

    return `
        <div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="${encode}" ></div>
        <script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>
`;
}

async function drawioFileCheck(context,drawioFilePath,parsedArgs){
    if (!drawioFilePath) {
        throw new Error(`No file specified ${drawioFilePath} for tag {% plantuml_from_file %} on file ${context.source}`);
    }

    const drawioFullPath = path.resolve(path.dirname(context.full_source), drawioFilePath,);
    const exists = await fs.pathExists(drawioFullPath);
    if (!exists) {
        throw new Error(`The path ${drawioFullPath} specified for tag {% drawio_file_path %} on file ${context.source} does not exists`);
    }

    if(parsedArgs.needCheck && drawioFilePath.endsWith(".drawio")) {
        // drawio文件合理性校验：
        // 1、一定是合法的xml文件
        // 2、根元素一定要是mxfile
        var xmlParser = new xml2js.Parser();
        console.log(`drawioFile check start :\t${drawioFullPath} `)
        var data = fs.readFileSync(drawioFullPath);
        let hasError = false;
        xmlParser.parseString(data, function (err, result) {
            var mxfile = result.mxfile
            if (err != null) {
                hasError = true;
            }
            if (mxfile == null) {
                hasError = true;
            }
        });
        if(hasError) {
            throw new Error(`drawio file has broken. please recheck  ${drawioFullPath}  file to make sure it is a correct drawio file`);
        }
        console.log(`drawioFile check ok :\t${drawioFullPath} `)
    }else{
        console.log(`drawioFile check skip:\t${drawioFullPath} `)
    }
}

hexo.extend.tag.register('drawio_file_path', async function(args, content) {
        const parsedArgs = parseTagArguments({
            sourceArguments: args,
            defaultKey: 'file',
        });
        const context = this;
        const drawioFilePath = parsedArgs.filePath || parsedArgs.file;
        let needCheck = parsedArgs.needCheck || true;
        try {
            // 文件是否存在、drawo文件合理性校验
            drawioFileCheck(context,drawioFilePath,parsedArgs);

            //解析，转化drawio内容
            return await generateTagFromSource(context, drawioFilePath, parsedArgs,);
        }catch (e){
            console.log("drawioFile error happened when processing:"+drawioFullPath)
            throw e;
        }
    }, {
        async: true,
    },
);

