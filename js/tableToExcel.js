import FileSaver from 'file-saver';
import XLSX from 'xlsx';

// npm install -S file-saver@2.0.5 xlsx@0.17.0
/**
 * import { exportTableToExcel } from '@/utils/tableToExcel.js';
 * this.isExporting = false;
 * this.$nextTick(() => {
 *  exportTableToExcel(`推荐名单-${this.activeObj.activityName}`, id);
 *  this.isExporting = true;
 * });
 */

// 导出页面上的表格
export function exportTableToExcel(name, id = 'export_table') {
  // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
  var fix = document.querySelector(`#${id} .el-table__fixed-right`);
  var et;
  if (fix) {
    et = XLSX.utils.table_to_book(document.getElementById(id).removeChild(fix));
    document.getElementById(id).appendChild(fix);
  } else {
    et = XLSX.utils.table_to_book(document.getElementById(id));
  }
  console.log(et);
  for (let key in et.Sheets.Sheet1) {
    if (Object.prototype.toString.call(et.Sheets.Sheet1[key]) === '[object Object]') {
      et.Sheets.Sheet1[key].v = et.Sheets.Sheet1[key].v.toString().replace(/\s+/g, '');
      //在表达的最下面一行会有'暂无筛选结果'，没有找到原因，所以也直接置空。
      if (et.Sheets.Sheet1[key].v == '暂无筛选结果') {
        et.Sheets.Sheet1[key].v = '';
      }
    }
  }
  let etout = XLSX.write(et, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'array',
  });
  try {
    FileSaver.saveAs(
      new Blob([etout], {
        type: 'application/octet-stream',
      }),
      name + '.xlsx',
    ); // 为导出的文件名
  } catch (e) {
    // console.log(e, etout);
  }
  return etout;
}
