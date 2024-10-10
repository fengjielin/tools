package com.gzzj.system.mapper;

import java.util.List;
import com.gzzj.system.domain.SysMsg;
import org.apache.ibatis.annotations.Param;

/**
 * 通知消息Mapper接口
 * 
 * @author examSys
 * @date 2024-07-05
 */
public interface SysMsgMapper 
{
    /**
     * 查询通知消息
     * 
     * @param msgId 通知消息主键
     * @return 通知消息
     */
    public SysMsg selectSysMsgByMsgId(Long msgId);

    /**
     * 查询通知消息列表
     * 
     * @param sysMsg 通知消息
     * @return 通知消息集合
     */
    public List<SysMsg> selectSysMsgList(SysMsg sysMsg);

    /**
     * 新增通知消息
     * 
     * @param sysMsg 通知消息
     * @return 结果
     */
    public int insertSysMsg(SysMsg sysMsg);

    /**
     * 修改通知消息
     * 
     * @param sysMsg 通知消息
     * @return 结果
     */
    public int updateSysMsg(SysMsg sysMsg);

    /**
     * 删除通知消息
     * 
     * @param msgId 通知消息主键
     * @return 结果
     */
    public int deleteSysMsgByMsgId(Long msgId);

    /**
     * 批量删除通知消息
     * 
     * @param msgIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteSysMsgByMsgIds(Long[] msgIds);

    int batchAdd(@Param("arrMsg") List<SysMsg> arrMsg);

}
