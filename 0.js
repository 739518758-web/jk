h5gg.require(7.8);

// ========== 你的四个偏移和原始字节 ==========
var offsets = [
    0x02FF1A00,   // 地址1  原始: E603371E
    0x02FF3080,   // 地址2  原始: C0035FD6
    0x02E8A4F4,   // 地址3  原始: 21208052
    0x062BD138    // 地址4  原始: C0035FD6
];

var originalBytes = [
    "E603371E",
    "C0035FD6",
    "21208052",
    "C0035FD6"
];
// =========================================

function getBase() {
    try {
        var modules = h5gg.getRangesList(0);
        return Number(modules[0].start);
    } catch (e) {
        return 0;
    }
}

function patchBytes(addr, hex) {
    hex = String(hex).replace(/\s+/g, "").toUpperCase();
    for (var i = 0; i < hex.length / 2; i++) {
        var b = parseInt(hex.substr(i * 2, 2), 16);
        h5gg.setValue(addr + i, b, "U8");
    }
}

function safePatch(index, bytes, name) {
    try {
        var base = getBase();
        var addr = base + offsets[index];
        patchBytes(addr, bytes);
        alert("修改成功！\n地址" + (index + 1) + " (" + name + ")\n0x" + addr.toString(16).toUpperCase() + "\n字节: " + bytes);
    } catch (e) {
        alert("修改失败: " + e);
    }
}

function showMenu() {
    var base = getBase();
    var msg = "当前基址: 0x" + base.toString(16).toUpperCase() + "\n\n" +
              "请选择要执行的操作：\n\n" +
              "1 = 地址① → RET\n" +
              "2 = 地址② → RET\n" +
              "3 = 地址③ → RET\n" +
              "4 = 地址④ → RET\n\n" +
              "5 = 地址① 返回真\n" +
              "6 = 地址② 返回真\n" +
              "7 = 地址③ 返回真\n" +
              "8 = 地址④ 返回真\n\n" +
              "9 = 地址① 返回假\n" +
              "10 = 地址② 返回假\n" +
              "11 = 地址③ 返回假\n" +
              "12 = 地址④ 返回假\n\n" +
              "13 = 恢复全部原始字节\n" +
              "14 = 自定义修改某个地址\n" +
              "0 = 取消";

    var choice = prompt(msg, "1");
    if (choice === null || choice === "" || choice === "0") return;

    choice = Number(choice);

    if (choice >= 1 && choice <= 4) {
        safePatch(choice - 1, "C0035FD6", "RET");
    }
    else if (choice >= 5 && choice <= 8) {
        safePatch(choice - 5, "200080D2C0035FD6", "返回真");
    }
    else if (choice >= 9 && choice <= 12) {
        safePatch(choice - 9, "000080D2C0035FD6", "返回假");
    }
    else if (choice === 13) {
        try {
            var base = getBase();
            for (var i = 0; i < 4; i++) {
                patchBytes(base + offsets[i], originalBytes[i]);
            }
            alert("四个地址已全部恢复原始字节");
        } catch (e) {
            alert("恢复失败: " + e);
        }
    }
    else if (choice === 14) {
        var idx = prompt("请输入要修改的地址编号 (1~4):", "1");
        if (!idx) return;
        idx = Number(idx) - 1;
        if (idx < 0 || idx > 3) {
            alert("只能输入 1~4");
            return;
        }
        var bytes = prompt("请输入新的十六进制字节:", originalBytes[idx]);
        if (bytes) {
            safePatch(idx, bytes, "自定义");
        }
    }
    else {
        alert("无效选项");
    }
}

// 点击 H5GG 悬浮按钮就弹出菜单
setButtonAction(function () {
    showMenu();
});

alert("三玖内部 · 一键修改脚本已加载\n点击 H5GG 悬浮按钮即可使用");