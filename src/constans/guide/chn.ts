import { GuideCategory } from "./types";

// 中文 — 分类、主题 id 和顺序与 idn.ts 相同
const chn: GuideCategory[] = [
    {
        id: "start",
        title: "入门",
        topics: [
            {
                id: "login",
                title: "使用 Google 登录",
                summary: "预订房间、点餐和管理订单都需要使用 Google 账户。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "无需登录即可浏览房间和价格。",
                            "进入预订或点餐结账时，点击「Masuk dengan Google」（使用 Google 登录）按钮。",
                            "选择您的 Google 账户，姓名和邮箱会自动填写。",
                        ],
                    },
                    {
                        type: "note",
                        text: "所有预订、积分和点餐订单都保存在您登录的 Google 账户中。请每次使用同一个账户登录。",
                    },
                ],
            },
            {
                id: "language-currency",
                title: "切换语言和货币",
                summary: "以您偏好的语言和货币显示网站。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "点击页面顶部的「菜单」按钮。",
                            "选择语言：Bahasa Indonesia、English、日本語 或 中文。",
                            "选择显示货币：IDR、USD、SGD、JPY 或 CNY。",
                        ],
                    },
                    {
                        type: "warning",
                        text: "以印尼盾以外货币显示的价格仅为估算。实际始终以印尼盾（IDR）收费，付款前会显示印尼盾金额供您确认。",
                    },
                ],
            },
        ],
    },
    {
        id: "booking",
        title: "预订房间",
        topics: [
            {
                id: "booking-search",
                title: "查找房间并选择日期",
                summary: "主要的预订方式，可入住多晚并选择分店。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "打开酒店列表页（首页底部的「Semua Cabang」链接），或直接打开您想要的分店页面。",
                            "填写入住和退房日期，然后点击「查詢空房」。",
                            "只会显示在您入住的每一晚都空闲的房间。可按价格或房间号排序。",
                            "点击「查看客房」查看照片、设施以及所选日期的总价。",
                            "点击「立即预订」进入预订页面。",
                        ],
                    },
                    {
                        type: "tip",
                        text: "每晚价格可能不同（例如周末或促销期间）。显示的总价已经把每晚的价格加在一起。",
                    },
                ],
                cta: { label: "查找房间", href: "/hotel" },
            },
            {
                id: "booking-quick",
                title: "从首页快速预订",
                summary: "通过首页的「预订」按钮直接预订一晚。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "在首页点击顶部的「预订」按钮。",
                            "选择入住日期和宾客人数（可选），然后点击「预订」。",
                            "选择可预订的房型，然后点击「Reserve Now」。",
                        ],
                    },
                    {
                        type: "note",
                        text: "快速预订固定为一晚。如需入住多晚，请使用「查找房间并选择日期」。",
                    },
                ],
            },
            {
                id: "booking-reservation",
                title: "填写预订信息并选择房间",
                summary: "填写住客信息，选择房间号和支付方式。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "在「住宿」部分确认入住和退房日期。",
                            "选择房间号。这些日期已被他人预订的房间不会显示。",
                            "如果还没有登录，请使用 Google 登录。",
                            "填写姓名、电话号码（选择国家代码）、证件类型（KTP、护照或 SIM）和证件号码。",
                            "选择支付方式。各支付方式的说明请见「支付」部分。",
                            "查看右侧的价格明细，然后点击「确认并支付」。",
                        ],
                    },
                    {
                        type: "list",
                        title: "填写规则",
                        items: [
                            "KTP（印尼身份证）号码必须为16位数字。",
                            "护照号码可以包含字母和数字。",
                            "已选择国家代码，电话号码请去掉开头的0。",
                        ],
                    },
                ],
            },
            {
                id: "booking-multi-room",
                title: "预订多间房",
                summary: "在一笔预订中为同一日期预订多间房。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "在预订页面打开房间号选择框。",
                            "勾选所有想要的房间。再次点击可取消选择。",
                            "价格明细会显示每间房的价格，并自动计算总价。",
                            "照常继续付款。所有房间合并为一张账单。",
                        ],
                    },
                    {
                        type: "warning",
                        text: "包含多间房的预订暂时无法改期。如需更改日期，请先取消再重新预订。",
                    },
                    {
                        type: "note",
                        text: "目前，同一笔预订中的房间必须是同一房型。",
                    },
                ],
            },
        ],
    },
    {
        id: "payment",
        title: "支付",
        topics: [
            {
                id: "payment-overview",
                title: "付款期限",
                summary: "选择支付方式前需要了解的事项。",
                blocks: [
                    {
                        type: "list",
                        items: [
                            "虚拟账户和 QRIS 账单在点击「确认并支付」后15分钟内有效。",
                            "在此期间房间会为您保留。超过15分钟后，预订会自动过期，房间将被释放。",
                            "收到付款后，付款页面会自动更新，无需刷新。",
                            "该分店不可用的支付方式会以删除线显示，并标注「（不可用）」。",
                        ],
                    },
                    {
                        type: "warning",
                        text: "请不要支付已过期的账单，请重新预订。",
                    },
                ],
            },
            {
                id: "payment-va",
                title: "虚拟账户（BCA、BNI、BRI、Mandiri）",
                summary: "通过手机银行、网上银行或 ATM 转账到虚拟账户号码。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "选择「虚拟账户」，然后选择银行。",
                            "点击「确认并支付」，页面会跳转到付款页。",
                            "复制虚拟账户号码。Mandiri 请复制付款代码和账单密钥。",
                            "请在「请在此时间前付款」显示的时间之前完成付款。",
                            "收到付款后，页面会自动显示付款成功。",
                        ],
                    },
                    {
                        type: "steps",
                        title: "测试模式（沙盒）",
                        items: [
                            "点击「立即付款」按钮打开 Midtrans 模拟器。",
                            "粘贴虚拟账户号码，然后点击「Inquire」。",
                            "点击「Pay」完成付款。",
                        ],
                    },
                ],
            },
            {
                id: "payment-qris",
                title: "QRIS",
                summary: "使用支持 QRIS 的电子钱包或手机银行付款。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "选择「QRIS」，然后点击「确认并支付」。",
                            "付款页面会显示二维码。",
                            "用电子钱包或手机银行 App 扫描二维码，并在期限前完成付款。",
                        ],
                    },
                    {
                        type: "note",
                        text: "只有当该分店开启 QRIS 时才会显示此选项。",
                    },
                ],
            },
            {
                id: "payment-sgt",
                title: "加密货币（SGT）",
                summary: "使用 Sui 网络上的 Singapore Token（SGT）付款。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "请准备一个 SGT 余额充足的 Sui 钱包（例如 Slush）。",
                            "选择「加密货币」，然后连接钱包。",
                            "点击「确认并支付」。",
                            "在钱包中批准交易。SGT 数量会根据印尼盾总额自动计算。",
                            "交易验证完成后，页面会跳转到付款成功页。",
                        ],
                    },
                    {
                        type: "warning",
                        text: "如果您在钱包中拒绝了交易或交易失败，预订仍未付款。请在付款页面重试。",
                    },
                ],
            },
            {
                id: "payment-credit",
                title: "预订积分",
                summary: "使用退款或改期差额获得的积分付款。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "支付方式选择「积分」。",
                            "点击「Bayar dengan Credit」（使用积分支付）。余额会立即扣除，预订立即完成付款。",
                        ],
                    },
                    {
                        type: "note",
                        text: "积分余额必须足以支付全部金额。余额不足时会显示余额和差额，请选择其他支付方式继续。",
                    },
                ],
                cta: { label: "查看积分余额", href: "/profile" },
            },
        ],
    },
    {
        id: "manage",
        title: "管理预订",
        topics: [
            {
                id: "manage-status",
                title: "查看预订状态",
                summary: "所有进行中的预订都在「最近活动」页面。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "点击「菜单」，然后选择「最近活动」。",
                            "房间订单选择「Hotel Booking」标签，点餐订单选择「Food Order」标签。",
                            "点击某笔预订可查看详情：房间、日期、付款和状态记录。",
                        ],
                    },
                    {
                        type: "list",
                        title: "状态说明",
                        items: [
                            "Pending：等待付款。",
                            "Paid：已付款。",
                            "Confirmed：前台已在您到达当天确认。",
                            "Checked in / Checked out：正在入住 / 已退房。",
                            "Cancelled：已取消，可以申请退款。",
                            "Expired：未在期限前付款。",
                        ],
                    },
                ],
                cta: { label: "打开最近活动", href: "/recent-activity" },
            },
            {
                id: "manage-checkin",
                title: "入住和退房",
                summary: "在「最近活动」页面自助办理入住和退房。",
                blocks: [
                    {
                        type: "steps",
                        title: "入住",
                        items: [
                            "请在入住日期到达酒店，前台会确认您的预订（状态变为 Confirmed）。",
                            "打开「最近活动」并选择该预订。",
                            "点击「Check In」。",
                        ],
                    },
                    {
                        type: "steps",
                        title: "退房",
                        items: [
                            "在退房日期，到「最近活动」打开您的预订。",
                            "点击「Check Out」。",
                        ],
                    },
                    {
                        type: "note",
                        text: "「Check In」按钮仅在前台确认预订后、于入住日期当天可用。「Check Out」按钮仅在退房日期当天可用。",
                    },
                ],
            },
            {
                id: "manage-reschedule",
                title: "改期（更改日期）",
                summary: "无需取消即可把预订改到其他日期。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "打开「最近活动」，选择预订，然后点击「Reschedule」。",
                            "在日历上选择新的入住日期。入住晚数不变，每个日期都会显示每晚价格。",
                            "点击「继续确认 →」。",
                            "查看费用计算：按政策扣除的金额、原预订剩余金额、新预订价格以及差额。您也可以为新日期选择其他房间。",
                            "如果新预订更贵，请为差额选择支付方式并点击「确认并支付」。如果无需补差额，请点击「确认改期」。",
                        ],
                    },
                    {
                        type: "list",
                        title: "规则",
                        items: [
                            "只有状态为 Paid 或 Confirmed 且尚未过入住日期的预订才能改期。",
                            "扣除比例取决于距离入住还有几天。已 Confirmed 的预订适用入住当天的政策。",
                            "如果新预订更便宜，剩余金额会自动存入预订积分。",
                            "在差额付清之前，原预订仍然有效。如果15分钟内未付款，改期将取消，原预订保持不变。",
                            "每笔预订通常只能改期一次。",
                            "包含多间房的预订暂时无法改期。",
                        ],
                    },
                ],
                cta: { label: "打开最近活动", href: "/recent-activity" },
            },
            {
                id: "manage-cancel",
                title: "取消预订",
                summary: "先查看退款金额，再决定是否取消预订。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "打开「最近活动」，选择预订，然后点击「Cancel Booking」。",
                            "查看预览：距离入住的天数、按政策计算的退款比例和退款金额。",
                            "确认取消。预订状态变为 Cancelled，房间会被释放。",
                            "接着申请退款（见「退款」）。",
                        ],
                    },
                    {
                        type: "note",
                        text: "预览在15分钟内有效。过期后请重新开始取消流程。",
                    },
                    {
                        type: "warning",
                        text: "正在等待支付改期差额的预订无法取消。请等该账单付清或过期后再操作。",
                    },
                ],
            },
            {
                id: "manage-refund",
                title: "退款",
                summary: "为已取消的预订申请退款。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "打开「最近活动」，选择状态为 Cancelled 的预订。",
                            "点击「Request Refund」。",
                            "选择退款方式：积分或现金（如可用），并填写原因。",
                            "提交。退款会在管理员批准后处理。",
                        ],
                    },
                    {
                        type: "list",
                        title: "积分与现金",
                        items: [
                            "积分：管理员批准后，退款金额会立即存入您的预订积分，有效期30天。",
                            "现金：管理员批准后汇入您的银行账户，最快在申请后4天到账。",
                            "只有当该预订的退款政策允许时，才会显示现金选项。",
                        ],
                    },
                ],
                cta: { label: "打开最近活动", href: "/recent-activity" },
            },
            {
                id: "manage-history",
                title: "预订记录",
                summary: "查看您做过的所有预订。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "点击「菜单」，然后选择「历史」。",
                            "按状态筛选，查找特定的预订。",
                        ],
                    },
                ],
                cta: { label: "打开历史记录", href: "/history" },
            },
        ],
    },
    {
        id: "credit",
        title: "积分与提现",
        topics: [
            {
                id: "credit-balance",
                title: "预订积分",
                summary: "可用于下次预订的余额。",
                blocks: [
                    {
                        type: "list",
                        title: "积分来源",
                        items: [
                            "选择以积分形式领取的退款。",
                            "改期到更便宜的预订时，原预订的剩余金额。",
                        ],
                    },
                    {
                        type: "steps",
                        title: "查看余额和记录",
                        items: [
                            "点击「菜单」，然后选择「个人资料」。",
                            "在预订积分卡片上查看可用余额和「有效期至」日期。",
                            "点击「查看积分记录」查看所有收入和支出记录。",
                        ],
                    },
                    {
                        type: "warning",
                        text: "积分自最近一次增加起30天内有效。请在过期前用于预订或提现。",
                    },
                ],
                cta: { label: "打开个人资料", href: "/profile" },
            },
            {
                id: "credit-withdraw",
                title: "提现积分",
                summary: "把积分余额以 SGT 形式提现到 Sui 钱包。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "打开个人资料，点击预订积分卡片上的「提现」。",
                            "选择「加密货币」，然后选择 Sui 网络。",
                            "以印尼盾填写金额（最低 Rp 10.000），并填写您的 Sui 钱包地址。",
                            "点击「预览提现」，查看将收到的 SGT 数量、汇率以及提现前后的余额。",
                            "点击「确认并提交」。",
                        ],
                    },
                    {
                        type: "list",
                        title: "规则",
                        items: [
                            "预览在10分钟内有效。",
                            "提交申请后会立即从积分余额中扣除。",
                            "管理员批准申请后，SGT 会发送到您的钱包。",
                            "暂不支持现金提现。",
                        ],
                    },
                    {
                        type: "warning",
                        text: "请仔细核对钱包地址。加密货币一经发送无法撤回。",
                    },
                ],
                cta: { label: "打开个人资料", href: "/profile" },
            },
        ],
    },
    {
        id: "food",
        title: "点餐",
        topics: [
            {
                id: "food-order",
                title: "点餐",
                summary: "从酒店餐厅点餐，送到您的餐桌。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "打开 Food 页面。在首页的设施部分点击「盛大餐厅」卡片。",
                            "搜索菜品，或按分类和餐厅筛选。",
                            "把菜品加入购物车并调整数量。",
                            "打开购物车，继续付款。",
                            "如果还没有登录，请使用 Google 登录。",
                            "填写餐桌位置（必填，例如「2楼3号桌」），如有需要可填写备注（过敏、特殊要求）。",
                            "进入 Midtrans 页面并选择支付方式（根据可用情况选择虚拟账户或 QRIS）。",
                        ],
                    },
                    {
                        type: "steps",
                        title: "查看订单状态",
                        items: [
                            "点击「菜单」，然后选择「最近活动」。",
                            "打开「Food Order」标签，查看订单状态和餐桌位置。",
                        ],
                    },
                ],
                cta: { label: "去点餐", href: "/food" },
            },
        ],
    },
    {
        id: "help",
        title: "帮助",
        topics: [
            {
                id: "help-chat",
                title: "通过聊天咨询",
                summary: "还有疑问？直接在聊天中问我们。",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "点击页面右下角的聊天图标。",
                            "输入关于房间、预订或酒店设施的问题。",
                        ],
                    },
                    {
                        type: "tip",
                        text: "您可以随时通过「菜单」→「使用指南」打开本指南。",
                    },
                ],
            },
        ],
    },
];

export default chn;
