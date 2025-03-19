/**
 * 2024-01-09 将原本横向的两行表格数据调整为竖向的多行数据，用于数据审核中纵表的显示
 * @param {*} originalList 原本横向的表格数据
 * @param {*} map 字段map
 * @returns
 */
export function setAssemblyList(originalList = [], map) {
  if (!originalList) return;

  let list = [];
  let dataObj = {}; // 保存 map 中的 key，以及 key 在list中的下标
  for (let i = 0; i < originalList.length; i++) {
    const item = originalList[i];

    for (const key in map) {
      if (Object.hasOwnProperty.call(map, key)) {
        const mapItem = map[key];
        // i=0 本次修改为 i=1 上一次记录的内容
        if (i == 0) {
          let temp = {
            fieldKey: key,
            fieldName: "",
            lastValue: "", // 上一次记录的内容
            currValue: item[key], // 本次修改为
            isDifferent: false, // 本次修改为是否与上一次记录的内容有差异
          };
          let data = Object.assign(temp, mapItem);
          list.push(data);
          dataObj[key] = list.length - 1;
        } else if (i == 1) {
          let index = dataObj[key];
          list[index].lastValue = item[key];
          // 对于附件是否有差异的判断，根据文件名称
          if (list[index].isAttachment) {
            let lastAttachNameStr = "";
            let currAttachNameStr = "";
            if (list[index].lastValue) {
              let lastAttachNameList = list[index].lastValue.map((attach) => attach.fileName);
              lastAttachNameList.sort((a, b) => a.localeCompare(b));
              lastAttachNameStr = lastAttachNameList.join(",");
            }
            if (list[index].currValue) {
              let currAttachNameList = list[index].currValue.map((attach) => attach.fileName);
              currAttachNameList.sort((a, b) => a.localeCompare(b));
              currAttachNameStr = currAttachNameList.join(",");
            }
            list[index].isDifferent = lastAttachNameStr != currAttachNameStr;
          } else {
            list[index].isDifferent = list[index].lastValue != list[index].currValue;
          }
        }
      }
    }
  }
  console.log(list, dataObj);
  return list;
}
