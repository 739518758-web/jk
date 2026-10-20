h5gg.require(7.8);

/* ========== 配置区 ========== */
var 悬浮按钮标题 = "基址";
var 菜单位置X = 50;
var 菜单位置Y = 150;

var offset1 = 0x02FF1A00;
var offset2 = 0x02FF3080;
var offset3 = 0x02E8A4F4;
var offset4 = 0x062BD138;
/* =========================== */

function 获取基址() {
    var modules = h5gg.getRangesList(0);
    return Number(modules[0].start);
}

function 计算地址() {
    var base = 获取基址();
    return {
        base: base,
        addr: [
            base + offset1,
            base + offset2,
            base + offset3,
            base + offset4
        ]
    };
}

function 读取数值(地址, 类型) {
    try {
        return h5gg.getValue(地址, 类型);
    } catch (e) {
        return "读取失败";
    }
}

function 修改数值(地址, 类型) {
    var 当前值 = 读取数值(地址, 类型);
    var 新值 = prompt("当前值: " + 当前值 + "\n请输入新数值:", 当前值);
    
    if (新值 === null || 新值 === "") return;  // 取消或空值
    
    try {
        h5gg.setValue(地址, 新值, 类型);
        alert("修改成功！\n地址: 0x" + 地址.toString(16) + "\n新值: " + 新值);
    } catch (e) {
        alert("修改失败: " + e);
    }
}

function 显示主菜单() {
    var a = 计算地址();
    
    var 文本 = "当前基址: 0x" + a.base.toString(16) + "\n\n" +
               "① 0x" + a.addr[0].toString(16) + "\n" +
               "② 0x" + a.addr[1].toString(16) + "\n" +
               "③ 0x" + a.addr[2].toString(16) + "\n" +
               "④ 0x" + a.addr[3].toString(16);

    var 选择 = h5gg.choice([
        "查看当前数值",
        "修改地址①",
        "修改地址②",
        "修改地址③",
        "修改地址④",
        "刷新地址",
        "关闭"
    ], "越南服 · 基址菜单\n\n" + 文本);

    if (选择 === 0) {
        // 查看当前数值
        var 类型选择 = h5gg.choice(["Int32 (整数)", "Float (单精度)", "Double (双精度)"], "选择读取类型");
        if (类型选择 === null) return 显示主菜单();
        
        var 类型 = ["I32", "F32", "F64"][类型选择];
        var 内容 = "类型: " + 类型 + "\n\n";
        for (var i = 0; i < 4; i++) {
            内容 += "地址" + (i+1) + ": " + 读取数值(a.addr[i], 类型) + "\n";
        }
        alert(内容);
        显示主菜单();
    }
    else if (选择 >= 1 && 选择 <= 4) {
        // 修改某个地址
        var 类型选择 = h5gg.choice(["Int32 (整数)", "Float (单精度)", "Double (双精度)"], "选择修改类型");
        if (类型选择 === null) return 显示主菜单();
        
        var 类型 = ["I32", "F32", "F64"][类型选择];
        修改数值(a.addr[选择 - 1], 类型);
        显示主菜单();
    }
    else if (选择 === 5) {
        // 刷新
        显示主菜单();
    }
    // 选择6或取消则关闭
}

/* 创建悬浮按钮 */
h5gg.setFloatButton({
    title: 悬浮按钮标题,
    x: 菜单位置X,
    y: 菜单位置Y,
    onClick: function() {
        显示主菜单();
    }
});

alert("越南服基址菜单已加载\n点击「" + 悬浮按钮标题 + "」按钮打开菜单\n可查看/修改四个地址的数值");