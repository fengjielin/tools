package com.gzzj.system.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.gzzj.common.annotation.Excel;
import com.gzzj.common.core.domain.BaseEntity;

/**
 * 通知消息对象 sys_msg
 * 
 * @author examSys
 * @date 2024-07-05
 */
public class SysMsg extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 消息通知ID */
    private Long msgId;

    /** 业务对象ID */
    @Excel(name = "业务对象ID")
    private Long objectId;

    /** 被通知的用户ID */
    @Excel(name = "被通知的用户ID")
    private Long userId;

    /** 公告标题 */
    @Excel(name = "公告标题")
    private String title;

    /** 内容 */
    @Excel(name = "内容")
    private String content;

    /** 是否已读 */
    @Excel(name = "是否已读")
    private String isRead;

    /** 删除标志（0代表存在 2代表删除） */
    private String delFlag;

    public void setMsgId(Long msgId) 
    {
        this.msgId = msgId;
    }

    public Long getMsgId() 
    {
        return msgId;
    }
    public void setObjectId(Long objectId)
    {
        this.objectId = objectId;
    }

    public Long getObjectId()
    {
        return objectId;
    }
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
    }
    public void setTitle(String title) 
    {
        this.title = title;
    }

    public String getTitle() 
    {
        return title;
    }
    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
    }
    public void setIsRead(String isRead) 
    {
        this.isRead = isRead;
    }

    public String getIsRead() 
    {
        return isRead;
    }
    public void setDelFlag(String delFlag) 
    {
        this.delFlag = delFlag;
    }

    public String getDelFlag() 
    {
        return delFlag;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("msgId", getMsgId())
            .append("objectId", getObjectId())
            .append("userId", getUserId())
            .append("title", getTitle())
            .append("content", getContent())
            .append("isRead", getIsRead())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
