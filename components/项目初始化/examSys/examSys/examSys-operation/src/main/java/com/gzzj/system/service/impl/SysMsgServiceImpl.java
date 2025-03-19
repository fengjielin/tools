package com.gzzj.system.service.impl;

import java.util.List;
import com.gzzj.common.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.gzzj.system.mapper.SysMsgMapper;
import com.gzzj.system.domain.SysMsg;
import com.gzzj.system.service.ISysMsgService;

/**
 * 通知消息Service业务层处理
 * 
 * @author examSys
 * @date 2024-07-05
 */
@Service
public class SysMsgServiceImpl implements ISysMsgService 
{
    @Autowired
    private SysMsgMapper sysMsgMapper;

    /**
     * 查询通知消息
     * 
     * @param msgId 通知消息主键
     * @return 通知消息
     */
    @Override
    public SysMsg selectSysMsgByMsgId(Long msgId)
    {
        return sysMsgMapper.selectSysMsgByMsgId(msgId);
    }

    /**
     * 查询通知消息列表
     * 
     * @param sysMsg 通知消息
     * @return 通知消息
     */
    @Override
    public List<SysMsg> selectSysMsgList(SysMsg sysMsg)
    {
        return sysMsgMapper.selectSysMsgList(sysMsg);
    }

    /**
     * 新增通知消息
     * 
     * @param sysMsg 通知消息
     * @return 结果
     */
    @Override
    public int insertSysMsg(SysMsg sysMsg)
    {
        sysMsg.setCreateTime(DateUtils.getNowDate());
        return sysMsgMapper.insertSysMsg(sysMsg);
    }

    /**
     * 修改通知消息
     * 
     * @param sysMsg 通知消息
     * @return 结果
     */
    @Override
    public int updateSysMsg(SysMsg sysMsg)
    {
        sysMsg.setUpdateTime(DateUtils.getNowDate());
        return sysMsgMapper.updateSysMsg(sysMsg);
    }

    /**
     * 批量删除通知消息
     * 
     * @param msgIds 需要删除的通知消息主键
     * @return 结果
     */
    @Override
    public int deleteSysMsgByMsgIds(Long[] msgIds)
    {
        return sysMsgMapper.deleteSysMsgByMsgIds(msgIds);
    }

    /**
     * 删除通知消息信息
     * 
     * @param msgId 通知消息主键
     * @return 结果
     */
    @Override
    public int deleteSysMsgByMsgId(Long msgId)
    {
        return sysMsgMapper.deleteSysMsgByMsgId(msgId);
    }
}
