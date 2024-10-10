package com.gzzj.system.controller;

import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.gzzj.common.annotation.Log;
import com.gzzj.common.core.controller.BaseController;
import com.gzzj.common.core.domain.AjaxResult;
import com.gzzj.common.enums.BusinessType;
import com.gzzj.system.domain.SysMsg;
import com.gzzj.system.service.ISysMsgService;
import com.gzzj.common.utils.poi.ExcelUtil;
import com.gzzj.common.core.page.TableDataInfo;

/**
 * 通知消息Controller
 * 
 * @author examSys
 * @date 2024-07-05
 */
@RestController
@RequestMapping("/system/msg")
public class SysMsgController extends BaseController
{
    @Autowired
    private ISysMsgService sysMsgService;

    /**
     * 查询通知消息列表
     */
    ////@PreAuthorize("@ss.hasPermi('system:msg:list')")
    @GetMapping("/list")
    public TableDataInfo list(SysMsg sysMsg)
    {
        startPage();
        List<SysMsg> list = sysMsgService.selectSysMsgList(sysMsg);
        return getDataTable(list);
    }

    /**
     * 导出通知消息列表
     */
    //@PreAuthorize("@ss.hasPermi('system:msg:export')")
    @Log(title = "通知消息", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, SysMsg sysMsg)
    {
        List<SysMsg> list = sysMsgService.selectSysMsgList(sysMsg);
        ExcelUtil<SysMsg> util = new ExcelUtil<SysMsg>(SysMsg.class);
        util.exportExcel(response, list, "通知消息数据");
    }

    /**
     * 获取通知消息详细信息
     */
    //@PreAuthorize("@ss.hasPermi('system:msg:query')")
    @GetMapping(value = "/{msgId}")
    public AjaxResult getInfo(@PathVariable("msgId") Long msgId)
    {
        return success(sysMsgService.selectSysMsgByMsgId(msgId));
    }

    /**
     * 新增通知消息
     */
    //@PreAuthorize("@ss.hasPermi('system:msg:add')")
    @Log(title = "通知消息", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody SysMsg sysMsg)
    {
        return toAjax(sysMsgService.insertSysMsg(sysMsg));
    }

    /**
     * 修改通知消息
     */
    //@PreAuthorize("@ss.hasPermi('system:msg:edit')")
    @Log(title = "通知消息", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody SysMsg sysMsg)
    {
        return toAjax(sysMsgService.updateSysMsg(sysMsg));
    }

    /**
     * 删除通知消息
     */
    //@PreAuthorize("@ss.hasPermi('system:msg:remove')")
    @Log(title = "通知消息", businessType = BusinessType.DELETE)
	@DeleteMapping("/{msgIds}")
    public AjaxResult remove(@PathVariable Long[] msgIds)
    {
        return toAjax(sysMsgService.deleteSysMsgByMsgIds(msgIds));
    }
}
