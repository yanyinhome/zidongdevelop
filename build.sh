#! /bin/bash
version="1.0.0"

echo STEP-1: 安装依赖模块...
mkdir -p ~/.gitlab-ci-org/npm/node_modules
ln -s ~/.gitlab-ci-org/npm/node_modules
npm install --save
echo STEP-1-1: 日志打印去除...
debug=""
sed -i "" "s/@debug/$debug/g" public/index.html
echo STEP-2: 编译，生成 js 文件
node scripts/build.js
echo STEP-3: 导出代码到指定目录
echo '{"version":"'$version.$(date +%Y%m%d%H%M%S)'","codeVersion":"'$(git describe --always --tags)'","commit":"'$(git log --oneline -1 | cut -c1-7)'"}' >config.txt
mv build 88880000
cp -R config.txt 88880000
