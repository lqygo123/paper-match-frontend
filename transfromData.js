const fs = require('fs-extra')

const data = require('./output_1_3.json')

const transfromData = (data) => {
  const pages = []
  data.text.forEach((page, pageIndex) => {
    const pageItem = []
    page.forEach((block, blockIndex) => { 
      if (block.matchIndex > -1) {
        pageItem.push(block)
      }
    })
    pages.push(pageItem)
  })
  data.image.forEach((page, pageIndex) => {
    const pageItem = []
    page.forEach((block, blockIndex) => { 
      if (block.matchIndex > -1) {
        pageItem.push(block)
      }
    })
    pages[pageIndex] = pages[pageIndex].concat(pageItem)
  })

  fs.writeFileSync('./res_1_3.json', JSON.stringify(pages))
}

transfromData(data)