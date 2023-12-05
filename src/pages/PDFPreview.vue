<template>
  <div class="flex">
    <!-- <div class="wrap"> -->
    <div class="pdfContainer" id="pdfContainer" ref="pdfContainer"></div>
    <div
      class="download"
      id="download"
      :style="'right:' + (leftWidth + 20) + 'px'"
    >
      下载
    </div>
    <!-- </div> -->

    <div class="res-list" id="right" :style="'width:' + leftWidth + 'px'">
      <div class="line" v-drag></div>
      <div class="header">
        <div class="title">重复率</div>
        <div class="content">
          {{ textRepetitionCount }} / {{ pdf1TextTotal }}
        </div>
      </div>
      <div
        v-for="(item, index) in MockMatchRes"
        :key="index"
        class="res-item"
        :class="{ active: item.id === highlightedBlock.id }"
        @click="handleResItemClick(item)"
        :data-id="item.id"
      >
        <div class="res-item_title">
          <div class="index">{{ item.index }}</div>
          <div class="content">{{ item.text }}</div>
          <div class="icon"></div>
        </div>

        <div class="res-item_card" v-if="item.id === highlightedBlock.id">
          <div>重复内容：</div>
          <div>
            {{ item.text }}
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
      leftWidth: document.documentElement.clientWidth * 0.3,
      highlightedBlock: {},
      rendedPages: {},
      MockMatchRes: data.textRepetitions,
      pdf1TextTotal: data.pdf1TextTotal,
      textRepetitionCount: data.textRepetitionCount,
    };
  },
  //注册局部自定义指令
  directives: {
    //el：指令所绑定的元素
    drag(el) {
      //鼠标按下事件

      el.onmousedown = function (e) {
        let timer = null;

        // 获取鼠标在元素上的位置
        let disX = e.clientX - el.offsetLeft;
        const container = document.getElementById("right");
        const containerWidth = parseFloat(container.style.width);
        // const pdfContainerWidth =
        //   document.getElementById("pdfContainer").clientWidth;
        const maxWidth = window.innerWidth - 842;
        const download = document.getElementById("download");
        //鼠标移动事件
        document.onmousemove = function (e) {
          if (timer) {
            return false;
          }
          timer = setTimeout(function () {
            const distance = e.clientX - disX;
            const width = containerWidth - distance;
            if (width >= maxWidth) {
              container.style.width = maxWidth + "px"; //设置定位元素的左部位置
              download.style.right = maxWidth + 20 + "px";
            } else {
              container.style.width = containerWidth - distance + "px"; //设置定位元素的左部位置
              download.style.right = containerWidth - distance + 20 + "px";
            }
            timer = null;
          }, 100);
        };
        //鼠标松开事件
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        };
      };
    },
  },
  mounted() {
    this.loadPdf("http://localhost:3000/pdf1.pdf");
    console.log("this.$route", this.$route); // 输出 query 参数
    // 根据这个参数，加载不同的 pdf，请求接口获取信息
    // this.loadPdf("http://127.0.0.1:50721/1.pdf");
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

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0.3) {
              this.renderPage(
                parseInt(entry.target.dataset.pageNum),
                entry.target
              );
              this.renderHighlightBlocks(
                parseInt(entry.target.dataset.pageNum),
                entry.target
              );
            }
          });
        },
        { threshold: 0.3 }
      );
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
      const blocks = this.MockMatchRes.filter(
        (item) => item.pdf1Page === pageNum
      );
      // return blocks;

      // 对于 blocks 中 pdf1CoordStr 相同的，进行去重
      const pdf1coordMap = {};
      blocks.forEach((block) => {
        const key = `${block.pdf1Page}-${block.pdf1BlockIdx}`
        if (!pdf1coordMap[key]) {
          pdf1coordMap[key] = block;
        }
      });
      return Object.values(pdf1coordMap);
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
        div.dataset.blockIdx = `${block.pdf1Page}-${block.pdf1BlockIdx}`;
        div.innerText = block.text;

        // 为 div 添加点击事件，点击时高亮，并 log 当前的 block 信息
        div.addEventListener("click", async () => {
          console.log("hight block click", block.id);
          console.log("hight block click", JSON.stringify(block));
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
      console.log("renderPage", pageNum, canvas);
      if (canvas.isRendered || !canvas) return;
      canvas.isRendered = true;
      const page = await this.pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      canvas.isRendered = true;
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
        if (this.highlightedBlock) {
          const oldHighlightBlock = window.document.querySelector(
            `.highlight-block[data-block-idx="${this.highlightedBlock.pdf1Page}-${this.highlightedBlock.pdf1BlockIdx}"]`
          );
          if (oldHighlightBlock) oldHighlightBlock.style.backgroundColor = "rgba(255, 0, 0, 0.2)";

        }
        this.highlightedBlock = item;
        const highlightBlock = window.document.querySelector(
          `.highlight-block[data-block-idx="${this.highlightedBlock.pdf1Page}-${this.highlightedBlock.pdf1BlockIdx}"]`
        );
        if (highlightBlock) highlightBlock.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
      };

      const pageNum = item.pdf1Page;
      this.scrollToTargetPage(pageNum);

      setTimeout(() => {
        execHighlightBlock();
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
/* .pdfContainer {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
} */
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
  left: 0;
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
  position: relative;
  width: 30%;
  height: 100%;
  min-width: 303px;
  flex-shrink: 0;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 20px 14px 0 16px;
}
.line {
  position: absolute;
  z-index: 2020000;
  top: 0;
  bottom: 0;
  left: 0px;
  width: 6px;
  /* background: red; */
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  cursor: ew-resize;
}

.page-num {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}
.res-item {
  width: 100%;
  transition: all cubic-bezier(0.39, 0.575, 0.565, 1);
  background: #fafafb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}
.res-item * {
  box-sizing: border-box;
}
.res-item_title .icon {
  width: 16px;
  height: 16px;
  /* background: #007bff; */
  background: url(../assets/down.svg) no-repeat;
}
.res-item.active .res-item_title .icon {
  background: url(../assets/up.svg) no-repeat;
}
.res-item_title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgb(227, 228, 229);
  border-radius: 4px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-size: 16px;
  color: #303133;
  line-height: 24px;
  padding: 13px 20px 12px;
  cursor: pointer;
}
.res-item_card {
  width: -webkit-fill-available;
  background: #ffffff;
  padding: 20px 16px;
  font-size: 14px;
  border-radius: 4px;
  box-shadow: 0 2px 8px #0000001a;
  cursor: pointer;
  margin: 0 16px 16px 16px;
}
.res-item_card div:nth-child(1) {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #606366;
}
.res-item_card div:nth-child(2) {
  color: #222;
  max-height: 60px;
  /* height: 60px; */
  overflow-y: auto;
}
.res-item .index {
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  background: #007bff;
  font-size: 12px;
  color: #fff;
  /* margin-bottom: 10px; */
  display: inline-block;
  /* border: 1px solid #999; */
  /* padding: 5px; */
}
.res-item:hover:not(.active) {
  background-color: #f4f5f5;
  cursor: pointer;
}
.res-item.active {
  /* background-color: #e6f7ff; */
}

.res-item.active .res-item_title {
  color: #007bff;
  background: #eaf0ff;
  margin-bottom: 16px;
  border: none;
}
.res-item .content {
  overflow: hidden;
  /* width: 80%; */
  flex: 1;
  padding-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: bottom;
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
/* add -12-03*/
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}
.title {
  font-size: 32px;
  font-weight: 500;
  /* color: #007bff; */
  color: #303133;
  line-height: 32px;
}
.header .content {
  font-size: 14px;
  font-weight: 400;
  color: #606366;
  line-height: 22px;
  margin-right: 10px;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #e8ebf2;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #a7a8a9;
}
.download {
  position: fixed;
  right: 20px;
  bottom: 20px;
  line-height: 1;
  width: 90px;
  height: 32px;
  cursor: pointer;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  background-color: #007bff;
  padding: 8px 15px;
  font-size: 16px;
  border-radius: 4px;
}
</style>
