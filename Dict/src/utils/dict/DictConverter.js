import DictOptions from './DictOptions'
import DictData from './DictData'

export default function(dict, dictMeta) {
  const label = determineDictField(dict, dictMeta.labelField, ...DictOptions.DEFAULT_LABEL_FIELDS)
  const value = determineDictField(dict, dictMeta.valueField, ...DictOptions.DEFAULT_VALUE_FIELDS)
  return new DictData(dict[label], dict[value], dict)
}

/**
 * 确定字典字段
 * @param {DictData} dict
 * @param  {...String} fields
 */
function determineDictField(dict, ...fields) {
  // Object.prototype.hasOwnProperty.call() 用于检查一个对象（object）是否具有一个指定属性（key）的方法，它返回一个布尔值
  return fields.find(f => Object.prototype.hasOwnProperty.call(dict, f))
}
