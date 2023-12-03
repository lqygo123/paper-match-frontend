<template>
  <div class="flex">
    <div class="pdfContainer" ref="pdfContainer">

    </div>
    <div class="res-list">
      <div class="header">
        <div class="title">
          重复率
        </div>
        <div class="content">
          {{ textRepetitionCount }} / {{ pdf1TextTotal }}
        </div>
      </div>
      <div 
        v-for="(item, index) in MockMatchRes" 
        :key="index" 
        class="res-item"
        :class="{active: item.id === activeResId}"
        @click="handleResItemClick(item)"
        :data-id="item.id"
      >
        <div class="index">{{ item.index }}</div>
        <div class="content">{{item.text}}</div>

        <div v-if="item.id === activeResId">
          <div class="content-detail">
            {{item.text}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist/build/pdf.min.mjs";
const data = require("../../jsons/output_digital.json");

export default {
  data() {
    return {
      activeResId: null,
      rendedPages: {},
      MockMatchRes: data.textRepetitions,
      pdf1TextTotal: data.pdf1TextTotal,
      textRepetitionCount: data.textRepetitionCount,
    };
  },
  mounted() {
    // this.loadPdf("http://localhost:3000/static/pdf1.pdf");
    console.log('this.$route', this.$route); // 输出 query 参数
    // 根据这个参数，加载不同的 pdf，请求接口获取信息
    this.loadPdf("http://localhost:3000/pdf1.pdf");
  },
  methods: {
    async loadPdf(url) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min.mjs");
      this.pdfDocument = await pdfjsLib.getDocument(url).promise;
      const numPages = this.pdfDocument.numPages;
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const canvasContainer = document.createElement("div");
        canvasContainer.className = "pdf-page";
        canvasContainer.dataset.pageNum = pageNum;
        const canvas = document.createElement("canvas");
        canvas.dataset.pageNum = pageNum;
        this.$refs.pdfContainer.appendChild(canvasContainer);
        canvasContainer.appendChild(canvas);
        this.setCanvasSize(pageNum, canvas);
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.3) {
            this.renderPage(parseInt(entry.target.dataset.pageNum), entry.target);
            this.renderHighlightBlocks(parseInt(entry.target.dataset.pageNum), entry.target);
          }
        });
      }, { threshold: 0.3 });
      const canvases = this.$refs.pdfContainer.querySelectorAll("canvas");
      canvases.forEach((canvas) => observer.observe(canvas));
    },

    async setCanvasSize(pageNum, canvas) {
      const page = await this.pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
    },

    getHighlightBlocks(pageNum) {
      const blocks = this.MockMatchRes.filter((item) => item.pdf1Page === pageNum);
      return blocks

      // 对于 blocks 中 pdf1CoordStr 相同的，进行去重
      // const pdf1coordMap = {};
      // blocks.forEach((block) => {
      //   const key = block.pdf1CoordStr;
      //   if (!pdf1coordMap[key]) {
      //     pdf1coordMap[key] = block;
      //   }
      // });
      // return Object.values(pdf1coordMap);
    },

    // 在 canvas.parentNode 中，以 absolute 定位渲染高亮块
    renderHighlightBlocks(pageNum, canvas) {
      const blocks = this.getHighlightBlocks(pageNum - 1);
      const container = canvas.parentNode;

      blocks.forEach((block) => {
        const { pdf1coord } = block;
        const [x1, y1, x2, y2] = pdf1coord;
        const width = x2 - x1;
        const height = y2 - y1;
        const div = document.createElement("div");
        div.className = "highlight-block";
        div.style.position = "absolute";
        div.style.left = `${x1}px`;
        div.style.top = `${container.clientHeight - y2}px`;
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        div.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        div.dataset.id = block.id;
        div.dataset.index = block.index;
        div.dataset.pdf1CoordStr = block.pdf1CoordStr;
        div.innerText = block.text;

        // 为 div 添加点击事件，点击时高亮，并 log 当前的 block 信息
        div.addEventListener("click", async () => {
          console.log("hight block click", block.id);
          console.log("hight block click", JSON.stringify(block) );
          this.handleResItemClick(block);
          
          // res-item scroll into view
          const resItemDom = window.document.querySelector(
            `.res-list > [data-id="${block.id}"]`
          );
          resItemDom.scrollIntoView(true);
          
        });

        container.appendChild(div);
      });
    },

    async renderPage(pageNum, canvas) {
      console.log("renderPage", pageNum, canvas)
      if (canvas.isRendered || !canvas) return
      canvas.isRendered = true
      const page = await this.pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise
      canvas.isRendered = true
    },

    scrollToTargetPage(index) {
      console.log("scrollToTargetPage", index);
      const pageDom = window.document.querySelector(
        `.pdfContainer > :nth-child(${index + 1})`
      );
      pageDom.scrollIntoView(true);
    },

    onScroll(pageNum) {
      console.log(`Scrolled to page ${pageNum}`);
      console.log(this.MockMatchRes[pageNum - 1]);

      const resItemDom = window.document.querySelector(
        `.res-list > :nth-child(${pageNum})`
      );
      resItemDom.scrollIntoView(true);
    },

    handleResItemClick(item) {
      console.log("handleResItemClick", item);
      const execHighlightBlock = () => {
        if (this.activeResId) {
          const oldHighlightBlock = window.document.querySelector(
            `.highlight-block[data-id="${this.activeResId}"]`
          );
          oldHighlightBlock.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        }
        this.activeResId = item.id;
        const highlightBlock = window.document.querySelector(
          `.highlight-block[data-id="${item.id}"]`
        );
        highlightBlock.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
      }

      const pageNum = item.pdf1Page;
      this.scrollToTargetPage(pageNum)

      setTimeout(() => {
        execHighlightBlock()
      }, 300);
    },
  },
};
</script>

<style>
.pdfContainer {
  position: relative;
  height: 100%;
  overflow-y: scroll;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex-grow: 1;
  background-color: #f4f5f5;
}
.pdf-page {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 40px 0;
  position: relative;
}
.highlight-block {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.2);
}
.highlight-block::before {
  content: attr(data-index);
  position: absolute;
  left: 0 ;
  bottom: 100%;
  font-size: 12px;
  color: white;
  display: block;
  background: inherit;
  padding: 0 5px;
}
.flex {
  display: flex;
  align-items: start;
  justify-content: start;
  box-sizing: border-box;
  height: 100%;
}
.res-list {
  width: 30%;
  height: 100%;
  flex-shrink: 0;
  overflow-y: scroll;
  box-sizing: border-box;
}

.page-num {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}
.res-item {
  padding-top: 20px;
  border-radius: 4px;
  word-break: break-all;
  padding: 10px;
  /* box-shadow: 0 0 3px rgba(0, 0, 0, 0.2); */
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  border-bottom: 1px dashed #e6e6e6;
}
.res-item .index {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  display: inline-block;
  border: 1px solid #999;
  padding: 5px;
}
.res-item:hover {
  background-color: #f4f5f5;
  cursor: pointer;
}
.res-item.active {
  background-color: #e6f7ff;
}
.res-item .content {
  overflow: hidden;
  width: 80%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.res-item .content-detail {
  word-break: break-all;
  padding: 0 20px;
  margin-top: 10px;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 10px;
  background-color: #f4f5f5;
  /* 支持换行 */
  white-space: pre-wrap;
}
.pos {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  text-align: right;
}
</style>
