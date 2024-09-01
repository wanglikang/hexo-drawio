'use strict';

const parseTagArguments = require('hexo-util-parse-tag-arguments');
const fs = require('fs-extra');
const path = require('path');
const he = require('he');
const cheerio = require('cheerio');
const config = require("./lib/config")(hexo);

async function parseBodyFromHtml(sourceContent) {
    const $ = cheerio.load(sourceContent);
    return $('div.mxgraph').attr('data-mxgraph');
}

async function generateTagFromSource(context, sourcePath,  options) {
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

hexo.extend.tag.register('drawio_file_path', async function(args, content) {
    const parsedArgs = parseTagArguments({
        sourceArguments: args,
        defaultKey: 'file',
    });
    const context = this;
    const drawioFilePath = parsedArgs.file;
    if (!drawioFilePath) {
        throw new Error(`No file specified ${drawioFilePath} for tag {% plantuml_from_file %} on file ${context.source}`);
    }

    const drawioFullPath = path.resolve(
        path.dirname(context.full_source),
        drawioFilePath,
    );
    const exists = await fs.pathExists(drawioFullPath);
    if (!exists) {
        throw new Error(`The path ${drawioFullPath} specified for tag {% drawio_file_path %} on file ${context.source} does not exists`);
    }
        
    return await generateTagFromSource(
        context,
        drawioFullPath,
        parsedArgs,
    );
    }, {
        async: true,
    },
);

