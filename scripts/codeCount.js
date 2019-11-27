const {
  exec
} = require('child_process')


// exec('find src -name "*.ts" |xargs cat|wc -l', (err, stdout, stderr) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })

function countCodeLine(dir, postfix) {
  return new Promise((resolve, reject) => {
    exec(`find ${dir} -name "*${postfix}" |xargs cat|wc -l`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err)
        return;
      }
      resolve(stdout);
      reject(stderr)
    })
  })
}

async function main() {
  const appTs = await countCodeLine('app', '.ts')
  const srcTs = await countCodeLine('src', '.ts')
  const srcTestTs = await countCodeLine('src', '.test.ts')
  const srcTsx = await countCodeLine('src', '.tsx')
  const srcTestTsx = await countCodeLine('src', '.test.tsx')
  console.log('测试代码: ', Number(srcTestTs) + Number(srcTestTsx))
  console.log('功能代码:', Number(appTs) + Number(srcTs) + Number(srcTsx) - Number(srcTestTs) - Number(srcTestTsx))
}

main()