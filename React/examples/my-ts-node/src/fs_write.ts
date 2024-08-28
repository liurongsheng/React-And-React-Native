const fs = require('fs');
const path = require('path');

console.log(process.env.FILE_NAME)

// 要写入的目录和文件
const dirPath = './src/output';
const filePath = `./src/output/${process.env.FILE_NAME}.txt`;

// 建立文件夹
try {
  fs.mkdirSync(dirPath, { recursive: true });
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

fs.writeFile(filePath, 'hello world', (err: any) => {
  if (err) throw err;
  console.log('文本已写入文件1');
});

fs.writeFile(path.join(__dirname, `./${process.env.FILE_NAME}_test.txt`),'hello world', (err: any) => {
  if (err) throw err;
  console.log('文本已写入文件2');
});