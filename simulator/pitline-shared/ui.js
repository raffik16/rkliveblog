// Pitline's product UI. Copied from the simulator skill's airport kit (sims/airport-shared/ui.js, MIT,
// Nyxera0x/simulator) and given a race team's cards: live telemetry with a speed trace, the strategy engine's call,
// the pit stop clock and the wind tunnel's numbers. The kit's description follows.
//
// The toy airport's product UI, laid out after the reference frame for frame: a 74 px top bar (cube logo, search, the site switcher with its dropdown, live clock, bell,
// operator), three big KPI cards, a zoom/rotate tool column, a detail card with the object's thumbnail and three
// buttons, the turnaround tracker with icon steps and a shipment card, the fleet table with a segmented control,
// map pins, a dark selection pill, the cursor. Sizes are the reference's proportions at a 1600 x 900 CSS frame.
// update(state) fills it; nothing here moves the scene.

const B = '#3166ea';
const CSS = `
.wt{position:absolute;inset:0;pointer-events:none;font-family:Inter,system-ui,sans-serif;color:#0f1730;font-feature-settings:"tnum"}
.wt *{box-sizing:border-box}
.wt .bar{position:absolute;left:0;right:0;top:0;height:74px;background:rgba(255,255,255,.94);border-bottom:1px solid #e4e8f3;display:flex;align-items:center;padding:0 28px;gap:16px}
.wt .logo{display:flex;align-items:center;gap:12px;font-weight:800;font-size:21px;letter-spacing:-.02em;width:260px}
.wt .search{width:450px;height:44px;border:1px solid #dfe4ef;border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 14px;color:#7b849b;font-size:14.5px;background:#fff}
.wt .search .k{margin-left:auto;border:1px solid #d9deea;border-radius:6px;font-size:11px;padding:1px 6px;color:#8b93a6}
.wt .sw{margin-left:auto;display:flex;align-items:stretch;height:48px;border:1px solid #dfe4ef;border-radius:12px;background:#fff;overflow:hidden}
.wt .sw .main{display:flex;align-items:center;gap:10px;padding:0 12px 0 7px;font-size:14px;font-weight:700;width:262px}
.wt .sw .main small{display:block;font-size:12px;font-weight:500;color:#6f7891;margin-top:1px}
.wt .sw .chip{min-width:42px;padding:0 6px;white-space:nowrap;height:34px;border-radius:8px;background:${B};color:#fff;font-size:12px;font-weight:800;display:grid;place-items:center;box-shadow:inset 0 -2px 0 rgba(0,0,0,.12)}
.wt .sw .gt{margin-left:auto;color:#9aa2b6;font-size:15px}
.wt .sw .dd{width:40px;border-left:1px solid #e6eaf3;display:grid;place-items:center}
.wt .sw .dd.on{background:#eef3ff}
.wt .live{display:flex;align-items:center;gap:8px;background:#e8f7ee;color:#18884d;font-weight:700;font-size:14px;border-radius:10px;padding:8px 12px}
.wt .live i{width:9px;height:9px;border-radius:50%;background:#21b35f}
.wt .bell{position:relative;width:40px;display:grid;place-items:center}
.wt .bell i{position:absolute;top:2px;right:8px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:2px solid #fff}
.wt .user{display:flex;align-items:center;gap:11px;font-size:14.5px;font-weight:700;padding-left:10px;border-left:1px solid #e6eaf3;height:44px}
.wt .user small{display:block;font-size:12.5px;color:#6f7891;font-weight:500}
.wt .ava{width:44px;height:44px;border-radius:50%;background-size:cover;background-position:center;box-shadow:0 0 0 2px #fff,0 2px 6px rgba(20,30,60,.18)}
.wt .card{position:absolute;background:rgba(255,255,255,.97);border:1px solid #e7ebf4;border-radius:16px;box-shadow:0 10px 30px rgba(32,48,110,.10)}
.wt .kpis{position:absolute;left:34px;top:94px;display:flex;gap:12px}
.wt .kpi{position:relative;width:236px;height:78px;display:flex;align-items:center;gap:14px;padding:0 16px}
.wt .kpi .ic{width:46px;height:46px;border-radius:12px;background:#edf2ff;display:grid;place-items:center;flex:none}
.wt .kpi .k{font-size:12.5px;color:#2b3550;font-weight:600}
.wt .kpi .v{font-size:24px;font-weight:800;letter-spacing:-.02em;display:flex;align-items:center;gap:8px;line-height:1.15}
.wt .kpi .d{font-size:12.5px;color:#18884d;font-weight:700;display:flex;align-items:center;gap:3px}
.wt .kpi .s{font-size:11.5px;color:#7b849b}
.wt .tools{position:absolute;right:420px;top:94px;width:42px;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:2px}
.wt .tools b{width:34px;height:34px;border-radius:9px;display:grid;place-items:center}
.wt .tools b.on{background:#eef3ff}
.wt .tools hr{width:22px;border:0;border-top:1px solid #e8ecf4;margin:3px 0}
.wt .det{right:30px;top:94px;width:374px;padding:16px 18px 10px}
.wt .det .hd{display:flex;gap:12px;align-items:center}
.wt .det .th{width:54px;height:54px;border-radius:12px;background:#eef2fb;display:grid;place-items:center;overflow:hidden;flex:none;background-size:cover;background-position:center}
.wt .det .org{font-size:10.5px;font-weight:800;letter-spacing:.08em;color:${B}}
.wt .det .ti{font-size:17px;font-weight:800;letter-spacing:-.01em;margin-top:1px}
.wt .det .su{font-size:12px;color:#6f7891;margin-top:1px}
.wt .det .btns{margin-left:auto;display:flex;gap:6px;align-self:flex-start}
.wt .det .btns b{width:30px;height:30px;border:1px solid #e1e6f0;border-radius:8px;display:grid;place-items:center}
.wt .det .stat{display:flex;align-items:center;gap:10px;margin-top:14px;font-size:12px;color:#4b5570}
.wt .pillg{display:inline-block;font-size:12.5px;font-weight:700;border-radius:8px;padding:5px 11px}
.wt .go{background:#e6f6ec;color:#18884d}.wt .in{background:#e9efff;color:#2448c8}.wt .wait{background:#fff1e0;color:#c2690a}
.wt .pgr{display:flex;align-items:center;gap:12px;margin-top:12px;font-size:12px;color:#4b5570}
.wt .pgr .pb{flex:1;height:7px;border-radius:5px;background:#e9edf5;overflow:hidden}
.wt .pgr .pb i{display:block;height:100%;border-radius:5px;background:#22b35f}
.wt .det .rows{margin-top:10px;border-top:1px solid #eef1f6}
.wt .det .rw{display:flex;justify-content:space-between;font-size:13px;padding:7px 0;border-bottom:1px solid #eef1f6}
.wt .det .rw:last-child{border:0}
.wt .det .rw span:first-child{color:#4b5570}.wt .det .rw span:last-child{font-weight:600}
.wt .det .rw .ln{color:${B}}
.wt .det .sg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.wt .det .sb{background:#f4f6fb;border-radius:10px;padding:8px 10px}
.wt .det .sb small{display:block;font-size:11px;color:#4b5570}
.wt .det .sb b{display:block;font-size:15px;font-weight:800;margin:1px 0 4px}
.wt .det .sb b em{font-style:normal;font-size:12px;color:#6f7891;font-weight:600}
.wt .det .sb .pb{height:4px;border-radius:3px;background:#e2e7f2;overflow:hidden}.wt .det .sb .pb i{display:block;height:100%;background:${B}}
.wt .det .sb .pb.g i{background:#22b35f}
.wt .det .ih{display:flex;justify-content:space-between;font-size:11.5px;font-weight:800;color:#0f1730;margin-top:12px}.wt .det .ih span{color:#6f7891;font-weight:600}
.wt .det .iv{display:grid;grid-template-columns:26px 1fr 54px 76px;align-items:center;gap:8px;font-size:12.5px;padding:6px 0;border-bottom:1px solid #eef1f6}
.wt .det .iv:last-child{border:0}
.wt .det .iv i{width:24px;height:24px;border-radius:7px;display:grid;place-items:center}
.wt .det .iv b{font-weight:700;text-align:right}
.wt .det .iv .tg{font-size:11.5px;font-weight:700;border-radius:7px;padding:3px 8px;text-align:center}
.wt .det .fl{margin-top:10px;border-top:1px solid #eef1f6;padding-top:8px}
.wt .det .fl .fh{display:flex;justify-content:space-between;font-size:11.5px;font-weight:800}.wt .det .fl .fh span{color:#6f7891;font-weight:600}
.wt .det .fl .fr{display:grid;grid-template-columns:48px 1fr 60px 30px;gap:8px;align-items:center;font-size:12px;margin-top:6px}
.wt .det .fl .fr b{font-weight:800}.wt .det .fl .fr .pb{height:5px;border-radius:3px;background:#e9edf5;overflow:hidden}.wt .det .fl .fr .pb i{display:block;height:100%;background:#22b35f}
.wt .trk{left:34px;bottom:30px;width:958px;height:136px;padding:16px 20px;display:flex;gap:18px}
.wt .trk .l{flex:1}
.wt .trk .hd{display:flex;align-items:center;gap:10px;font-size:15.5px;font-weight:800}
.wt .trk .hd span{margin-left:auto;font-size:12px;color:#4b5570;font-weight:600}
.wt .stp{display:flex;justify-content:space-between;position:relative;margin-top:14px}
.wt .stp:before{content:"";position:absolute;left:30px;right:30px;top:16px;height:3px;background:#e6eaf3}
.wt .stp .fl{position:absolute;left:30px;top:16px;height:3px;background:${B}}
.wt .st{position:relative;width:110px;text-align:center;font-size:12.5px;font-weight:700}
.wt .st b{width:34px;height:34px;margin:0 auto 6px;border-radius:50%;display:grid;place-items:center;background:#eef1f7;border:2px solid #fff}
.wt .st.done b{background:${B}}
.wt .st.on b{background:${B};box-shadow:0 0 0 4px rgba(49,102,234,.18)}
.wt .st small{display:block;font-size:11px;color:#6f7891;font-weight:500;margin-top:1px}
.wt .st.fut{color:#8b93a6}
.wt .shp{width:300px;background:#f4f6fb;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:center}
.wt .shp .th{width:62px;height:62px;border-radius:10px;background:#fff;display:grid;place-items:center;flex:none;background-size:cover;background-position:center}
.wt .shp b{font-size:14px;font-weight:800}
.wt .shp .to{font-size:12px;color:#4b5570;margin:2px 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:180px}
.wt .shp .m{font-size:11.5px;color:#6f7891;margin-top:5px}
.wt .tbl{right:30px;bottom:30px;width:480px;padding:14px 18px 8px}
.wt .tbl .hd{display:flex;align-items:center;gap:10px}
.wt .seg{display:flex;background:#f0f3f9;border-radius:10px;padding:3px;font-size:13px;font-weight:700;color:#4b5570}
.wt .seg span{padding:5px 11px;border-radius:8px}.wt .seg span.a{background:#fff;color:#0f1730;box-shadow:0 1px 4px rgba(20,30,60,.12)}
.wt .seg em{font-style:normal;color:${B};margin-left:4px}
.wt .tbl .site{margin-left:auto;font-size:12px;color:#4b5570;font-weight:600}
.wt .tr{display:grid;grid-template-columns:96px 1fr 104px 66px 12px;align-items:center;font-size:13px;padding:7px 0;border-bottom:1px solid #f0f2f7}
.wt .tr:last-child{border:0}
.wt .tr b{font-weight:800;display:block}.wt .tr small{display:block;font-size:11px;color:#6f7891}
.wt .tr .wh{display:flex;align-items:center;gap:7px;color:#2b3550}.wt .tr .wh i{width:8px;height:8px;border-radius:50%}
.wt .tr .pp{font-size:12px;color:#4b5570}.wt .tr .pp .pb{height:5px;width:44px;border-radius:3px;background:#e9edf5;overflow:hidden;margin-bottom:3px}.wt .tr .pp .pb i{display:block;height:100%;background:#22b35f}
.wt .tags{position:absolute;inset:0}
.wt .pin{position:absolute;transform:translate(-50%,-100%)}
.wt .pin .h{width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${B};display:grid;place-items:center;box-shadow:0 6px 14px rgba(32,60,160,.35)}
.wt .pin .h i{width:13px;height:13px;border-radius:50%;background:#fff}
.wt .sel{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center}
.wt .sel .p{display:flex;align-items:center;gap:8px;background:#2547c9;color:#fff;font-size:13px;font-weight:800;border-radius:9px;padding:6px 11px;white-space:nowrap;box-shadow:0 8px 18px rgba(32,60,160,.35)}
.wt .sel .p small{font-weight:600;color:#c4d3ff;font-size:12px}
.wt .sel .t{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #2547c9}
.wt .drop{right:412px;top:80px;width:360px;padding:10px;transform-origin:top right}
.wt .drop .h{font-size:11px;font-weight:800;letter-spacing:.08em;color:#6f7891;padding:4px 8px 8px}
.wt .drop .it{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;font-size:13.5px;font-weight:700}
.wt .drop .it.on{background:#eef3ff}
.wt .drop .it .chip{width:38px;height:28px;border-radius:7px;background:${B};color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.wt .drop .it small{display:block;font-size:11.5px;color:#6f7891;font-weight:500}
.wt .drop .it .mb{margin-left:auto;width:64px;height:5px;border-radius:3px;background:#e9edf5;overflow:hidden}.wt .drop .it .mb i{display:block;height:100%;background:${B}}
.wt .tele{margin-top:10px;border-top:1px solid #eef1f6;padding-top:10px}
.wt .tele .big{display:flex;align-items:center;gap:12px}
.wt .tele .spd{font-size:34px;font-weight:800;letter-spacing:-.03em;line-height:1;width:118px}
.wt .tele .spd small{font-size:12.5px;color:#6f7891;font-weight:600;margin-left:3px;letter-spacing:0}
.wt .tele .gear{width:42px;height:42px;border-radius:10px;background:#0f1730;color:#fff;font-weight:800;font-size:22px;display:grid;place-items:center;flex:none}
.wt .tele .bars{flex:1;display:grid;gap:6px}
.wt .tele .b2{display:grid;grid-template-columns:50px 1fr 32px;align-items:center;font-size:11.5px;color:#4b5570;gap:7px}
.wt .tele .b2 .pb{height:7px;border-radius:4px;background:#e9edf5;overflow:hidden}
.wt .tele .b2 .pb i{display:block;height:100%;border-radius:4px}
.wt .tele .b2 b{text-align:right;font-weight:700;color:#0f1730}
.wt .tele .trace{margin-top:10px;background:#f4f6fb;border-radius:10px;padding:7px 10px 3px}
.wt .tele .trace .tth{display:flex;justify-content:space-between;font-size:11px;color:#4b5570;font-weight:700}
.wt .tele .trace .tth span{color:#6f7891;font-weight:600}
.wt .chips{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap}
.wt .chip2{font-size:11.5px;font-weight:800;border-radius:7px;padding:4px 9px;background:#f0f3f9;color:#6f7891}
.wt .chip2.on{background:#2547c9;color:#fff}
.wt .chip2.warn{background:#fff1e0;color:#c2690a}
.wt .tyres{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:9px}
.wt .tyres div{background:#f4f6fb;border-radius:8px;padding:5px 4px;font-size:10.5px;color:#4b5570;text-align:center;border-top:3px solid var(--c)}
.wt .tyres b{display:block;font-size:13px;color:#0f1730}
.wt .strat{margin-top:10px}
.wt .strat .run{display:flex;align-items:center;gap:10px;background:#0f1730;color:#fff;border-radius:12px;padding:9px 12px}
.wt .strat .run b{font-size:23px;font-weight:800;letter-spacing:-.02em;width:76px}
.wt .strat .run span{font-size:12px;color:#c4d3ff;line-height:1.35}
.wt .strat .run span em{font-style:normal;color:#fff;font-weight:700}
.wt .strat .oh{display:flex;justify-content:space-between;font-size:11.5px;font-weight:800;margin-top:11px}.wt .strat .oh span{color:#6f7891;font-weight:600}
.wt .strat .opt{display:grid;grid-template-columns:1fr 64px 92px;gap:8px;align-items:center;font-size:12.5px;padding:6px 0;border-bottom:1px solid #eef1f6;color:#4b5570}
.wt .strat .opt b{color:#0f1730;font-weight:700}
.wt .strat .opt .pb{height:6px;border-radius:3px;background:#e9edf5;overflow:hidden}.wt .strat .opt .pb i{display:block;height:100%;background:#9aa9d6}
.wt .strat .opt.best b{font-weight:800}.wt .strat .opt.best .pb i{background:#22b35f}
.wt .strat .call{margin-top:10px;display:flex;align-items:center;justify-content:center;gap:10px;height:40px;border-radius:10px;font-weight:800;font-size:14.5px;letter-spacing:.08em}
.wt .stop{margin-top:10px;border-top:1px solid #eef1f6;padding-top:8px}
.wt .stop .clk{display:flex;align-items:baseline;gap:8px}
.wt .stop .clk b{font-size:40px;font-weight:800;letter-spacing:-.03em;line-height:1.05}
.wt .stop .clk span{font-size:12px;color:#6f7891;font-weight:600}
.wt .stop .cn{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
.wt .stop .cn div{display:flex;align-items:center;gap:8px;background:#f4f6fb;border-radius:9px;padding:6px 9px;font-size:12px;color:#4b5570}
.wt .stop .cn div b{color:#0f1730;font-weight:800;width:24px}
.wt .stop .cn div i{margin-left:auto;font-style:normal;font-weight:700}
.wt .stop .cn div.ok i{color:#18884d}
.wt .aero .chart{margin-top:10px;background:#f4f6fb;border-radius:10px;padding:7px 10px 4px}
.wt .aero .chart .tth{display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#4b5570}
.wt .aero .chart .tth span{color:#6f7891;font-weight:600}
.wt .aero .lg{display:flex;gap:12px;font-size:11px;color:#4b5570;font-weight:600;margin-top:2px}.wt .aero .lg i{display:inline-block;width:10px;height:3px;border-radius:2px;margin-right:5px;vertical-align:middle}
.wt .cur{position:absolute;width:26px;height:26px;margin:-3px 0 0 -3px;z-index:9}
.wt .ring{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid ${B};opacity:0;z-index:8}
`;

const sv = (d, w = 18, col = '#5b6680', sw = 2) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
// the reference's logo and KPI glyphs are small 3D-looking blue solids: three shades per shape
const CUBE = (s = 34) => `<svg viewBox="0 0 40 40" width="${s}" height="${s}"><path d="M20 3l15 8.5v17L20 37 5 28.5v-17z" fill="#2448c8"/><path d="M20 3l15 8.5L20 20 5 11.5z" fill="#6f98f7"/><path d="M20 20l15-8.5v17L20 37z" fill="#3166ea"/><path d="M20 20v17L5 28.5v-17z" fill="#2448c8"/></svg>`;
export const ICONS = {
  cube: CUBE(26),
  plane: `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 22l14-3 8-13h4l-4 13 7 1 3-3h3l-2 6 2 6h-3l-3-3-7 1 4 13h-4l-8-13-14-3z" fill="#3166ea"/><path d="M18 19l8-13h4l-4 13z" fill="#6f98f7"/></svg>`,
  bag: `<svg viewBox="0 0 40 40" width="26" height="26"><rect x="7" y="12" width="26" height="22" rx="5" fill="#3166ea"/><rect x="7" y="12" width="26" height="7" rx="3" fill="#6f98f7"/><path d="M15 12V7h10v5" stroke="#2448c8" stroke-width="3" fill="none"/></svg>`,
  clock: `<svg viewBox="0 0 40 40" width="26" height="26"><circle cx="20" cy="20" r="15" fill="#3166ea"/><circle cx="20" cy="20" r="11" fill="#6f98f7"/><path d="M20 12v9l6 4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  truck: `<svg viewBox="0 0 40 40" width="26" height="26"><rect x="3" y="10" width="21" height="17" rx="3" fill="#6f98f7"/><path d="M24 15h7l6 6v6H24z" fill="#3166ea"/><circle cx="11" cy="29" r="4" fill="#1a2440"/><circle cx="30" cy="29" r="4" fill="#1a2440"/></svg>`,
  // race glyphs in the same three-shade language
  flag: `<svg viewBox="0 0 40 40" width="26" height="26"><rect x="7" y="5" width="3.4" height="31" rx="1.7" fill="#2448c8"/><path d="M10 7h22v16H10z" fill="#3166ea"/><path d="M10 7h5.5v4H10zM21 7h5.5v4H21zM15.5 11H21v4h-5.5zM26.5 11H32v4h-5.5zM10 15h5.5v4H10zM21 15h5.5v4H21zM15.5 19H21v4h-5.5zM26.5 19H32v4h-5.5z" fill="#cfdcfd"/></svg>`,
  gap: `<svg viewBox="0 0 40 40" width="26" height="26"><circle cx="20" cy="22" r="14" fill="#3166ea"/><circle cx="20" cy="22" r="10" fill="#6f98f7"/><rect x="17" y="3" width="6" height="5" rx="1.5" fill="#2448c8"/><path d="M20 22l6-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
  tyre: `<svg viewBox="0 0 40 40" width="26" height="26"><circle cx="20" cy="20" r="16" fill="#1a2440"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#3166ea" stroke-width="2.6"/><circle cx="20" cy="20" r="7.5" fill="#6f98f7"/><circle cx="20" cy="20" r="2.6" fill="#2448c8"/></svg>`,
  car: `<svg viewBox="0 0 40 40" width="26" height="26"><rect x="4" y="17" width="32" height="7" rx="3" fill="#3166ea"/><rect x="2" y="25" width="8" height="3" rx="1" fill="#2448c8"/><rect x="30" y="13" width="7" height="3" rx="1" fill="#2448c8"/><path d="M14 17l4-5h6l2 5z" fill="#6f98f7"/><circle cx="10" cy="26" r="5" fill="#1a2440"/><circle cx="30" cy="26" r="5" fill="#1a2440"/></svg>`,
};
const STEP_IC = {
  doc: sv('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>', 16, '#fff'),
  box: sv('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>', 16, '#fff'),
  load: sv('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M10 14h4"/>', 16, '#fff'),
  truck: sv('<rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>', 16, '#fff'),
  check: sv('<path d="M5 12l5 5 9-10"/>', 16, '#fff', 2.6),
  plane: sv('<path d="M3 13l7-1 4-7h2l-1 7 5 1 1-2h2l-1 3 1 3h-2l-1-2-5 1 1 7h-2l-4-7-7-1z"/>', 16, '#fff', 1.8),
  radio: sv('<path d="M4 10a12 12 0 0116 0M7 13a7.5 7.5 0 0110 0"/><circle cx="12" cy="17" r="2"/>', 16, '#fff'),
  entry: sv('<path d="M4 12h12M12 7l5 5-5 5M20 4v16"/>', 16, '#fff'),
  wrench: sv('<path d="M14.5 5.5a4 4 0 005 5L13 17l-3 3-3-3 3-3 6.5-6.5a4 4 0 00-2-2z"/>', 16, '#fff'),
  exit: sv('<path d="M4 4v16M8 12h12M15 7l5 5-5 5"/>', 16, '#fff'),
  flag: sv('<path d="M6 21V4M6 4h12l-3 4 3 4H6"/>', 16, '#fff'),
};
const greyIc = (k) => STEP_IC[k].replace(/stroke="#fff"/, 'stroke="#9aa2b6"');
// inventory glyphs: small solid shapes, the reference's language
const INV_BG = {box: '#fbefdc', bin: '#e6eeff', helmet: '#fff1d6', tape: '#fbefdc', frozen: '#e9f6ff', water: '#e6eeff', gloves: '#e6eeff', pallet: '#fbefdc'};
const INV = {
  box: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" fill="#d9a35f"/><path d="M4 7.5l8 4.5 8-4.5L12 3z" fill="#ecc28a"/><path d="M12 12v9" stroke="#b9853f" stroke-width="1.2"/></svg>',
  bin: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 8h16l-1.6 11H5.6z" fill="#3166ea"/><rect x="3" y="5" width="18" height="4" rx="1.5" fill="#6f98f7"/></svg>',
  helmet: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 16a8 8 0 0116 0z" fill="#f2b33a"/><rect x="2.5" y="15.5" width="19" height="3" rx="1.5" fill="#d9952a"/></svg>',
  tape: '<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="8" fill="#d9a35f"/><circle cx="12" cy="12" r="3.4" fill="#fbefdc"/></svg>',
  frozen: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" stroke="#3b8fe0" stroke-width="2.2" stroke-linecap="round"/></svg>',
  water: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" fill="#3166ea"/></svg>',
  gloves: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 21V9a1.5 1.5 0 013 0V5a1.5 1.5 0 013 0v4a1.5 1.5 0 013 0v2a1.5 1.5 0 013 0v5a5 5 0 01-5 5z" fill="#3166ea"/></svg>',
  pallet: '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="4" y="5" width="16" height="11" rx="1.5" fill="#d9a35f"/><rect x="3" y="17" width="18" height="3" rx="1" fill="#b9853f"/></svg>',
};
const CURSOR = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2.5l14.5 8.6-6.6 1.8-3 6.6z" fill="#0f1730" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const HAND = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M9 11V4.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v5c0 3.5-2.5 6-6 6h-1c-2.6 0-4-1.3-5.3-3.2L4.6 14.4a1.6 1.6 0 012.6-1.8L9 14.5" fill="#fff" stroke="#0f1730" stroke-width="1.6" stroke-linejoin="round"/></svg>';

// paint: an optional recolour applied to the CSS and the markup (the Claude look passes warmCss)
export function createToyUI(app, W, {paint = (x) => x} = {}) {
  const st = document.createElement('style');
  st.textContent = paint(CSS);
  document.head.appendChild(st);
  const el = document.createElement('div');
  el.className = 'wt';
  const kpi = (c) => `<div class="card kpi"><div class="ic">${ICONS[c.ic] ?? ''}</div><div><div class="k">${c.k}</div><div class="v"><span data-k="kv_${c.key}">${c.v}</span><span class="d" data-k="kc_${c.key}"><b data-k="ka_${c.key}" style="display:flex">${sv('<path d="M12 19V5M6 11l6-6 6 6"/>', 13, 'currentColor', 2.6)}</b><span data-k="kd_${c.key}">${c.d}</span></span></div><div class="s" data-k="ks_${c.key}">${c.s}</div></div></div>`;
  el.innerHTML = `
  <div class="bar">
    <div class="logo">${CUBE(34)}${W.brand}</div>
    <div class="search">${sv('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 19, '#0f1730')}<span data-k="search">${W.search}</span><span class="k">/</span></div>
    <div class="sw"><div class="main"><div class="chip" data-k="swChip"></div><div><span data-k="swName"></span><small data-k="swSub"></small></div><span class="gt">›</span></div><div class="dd" data-k="dd">${sv('<path d="M6 9l6 6 6-6"/>', 16, '#0f1730')}</div></div>
    <div class="live"><i></i><span data-k="clock">Live 09:46</span></div>
    <div class="bell">${sv('<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>', 22, '#0f1730')}<i></i></div>
    <div class="user"><div class="ava" style="background-image:url(${W.avatar})"></div><div>${W.user[0]}<small>${W.user[1]}</small></div>${sv('<path d="M6 9l6 6 6-6"/>', 16, '#0f1730')}</div>
  </div>
  <div class="kpis">${W.kpis.map(kpi).join('')}</div>
  <div class="card tools" data-k="tools">${['<path d="M12 5v14M5 12h14"/>', '<path d="M5 12h14"/>', 'hr', '<path d="M4 12a8 8 0 108-8H8"/><path d="M8 1v6h6" transform="translate(-4 0)"/>', '<path d="M20 12a8 8 0 11-8-8h4"/><path d="M16 1v6h-6" transform="translate(4 0)"/>', 'hr', '<path d="M4 11l8-7 8 7v9H4z"/>'].map((d, i) => (d === 'hr' ? '<hr>' : `<b data-k="tool${i}">${sv(d, 18, '#0f1730')}</b>`)).join('')}</div>
  <div class="card det" data-k="det">
    <div class="hd"><div class="th" data-k="dThumb"></div><div><div class="org" data-k="dOrg"></div><div class="ti" data-k="dTitle"></div><div class="su" data-k="dSub"></div></div>
      <div class="btns"><b>${sv('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>', 15, '#0f1730')}</b><b>${sv('<path d="M7 17L17 7M9 7h8v8"/>', 15, '#0f1730')}</b><b>${sv('<path d="M6 6l12 12M18 6L6 18"/>', 15, '#0f1730')}</b></div></div>
    <div class="stat"><span class="pillg" data-k="dStat"></span><span data-k="dStatText"></span></div>
    <div class="pgr"><div class="pb"><i data-k="dBar"></i></div><span data-k="dProg"></span></div>
    <div class="rows" data-k="dRows"></div>
    <div data-k="dExtra"></div>
  </div>
  <div class="card trk">
    <div class="l"><div class="hd">${ICONS[W.trackIcon ?? 'truck']}<span style="margin:0;font-size:15.5px;color:#0f1730;font-weight:800" data-k="tTitle"></span><span data-k="tMeta"></span></div>
      <div class="stp" data-k="steps"></div></div>
    <div class="shp"><div class="th" data-k="sThumb"></div><div><b data-k="sId"></b><div class="to" data-k="sTo"></div><span class="pillg" data-k="sStat" style="font-size:11.5px;padding:3px 9px"></span><div class="m" data-k="sMeta"></div></div><span style="margin-left:auto;color:#0f1730;font-size:18px">›</span></div>
  </div>
  <div class="card tbl"><div class="hd"><div style="width:28px;height:28px;border-radius:8px;background:#edf2ff;display:grid;place-items:center">${sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>', 15, B)}</div><div class="seg" data-k="seg"></div><span class="site" data-k="tSite"></span></div><div data-k="rows"></div></div>
  <div class="card drop" data-k="drop"><div class="h">${W.dropTitle ?? 'NETWORK OVERVIEW'}</div><div data-k="dropList"></div></div>
  <div class="tags" data-k="tags"></div>
  <div class="ring" data-k="ring"></div>
  <div class="cur" data-k="cur">${CURSOR}</div>`;
  el.innerHTML = paint(el.innerHTML);
  app.appendChild(el);
  const q = (k) => el.querySelector(`[data-k="${k}"]`);
  const set = (k, v) => {
    const n = q(k);
    if (n && n.textContent !== String(v)) n.textContent = v;
  };
  const html = (k, v) => {
    const n = q(k);
    if (n && n.dataset.v !== v) {
      n.innerHTML = v;
      n.dataset.v = v;
    }
  };
  const thumb = (k, url) => {
    const n = q(k);
    const v = url ? `url(${url})` : '';
    if (n.style.backgroundImage !== v) n.style.backgroundImage = v;
  };
  return {
    el,
    /**
     * s: {clock, site: [chip, name, sub], kpi: {key: [v, d, s?]}, card: {thumb, org, title, sub, stat, statCls, statText,
     *  prog (0..1), progText, rows: [[k, v, link?]], pop}, track: {title, meta, steps: [[name, time, icon, state]], fill,
     *  ship: {thumb, id, to, stat, statCls, meta}}, table: {tabs: [[name, n]], active, site, rows: [{id, org, dot, where,
     *  stat, cls, p, pt}]}, drop: {open 0..1, sites: [[chip, name, sub, pct]], on}, tool (index pressed or -1),
     *  tags: [{kind: 'pin' | 'sel', x, y, text, sub, a}], cursor: [x, y], hand, click (0..1)}
     */
    update(s) {
      set('clock', `Live ${s.clock}`);
      set('swChip', s.site[0]);
      set('swName', s.site[1]);
      set('swSub', s.site[2]);
      for (const [k, v] of Object.entries(s.kpi ?? {})) {
        set(`kv_${k}`, v[0]);
        set(`kd_${k}`, v[1]);
        if (v[2]) set(`ks_${k}`, v[2]);
        // v[3]: 'up' (green), 'down' (orange, arrow down) or 'flat' (grey, no arrow)
        const dir = v[3] ?? 'up';
        const a = q(`ka_${k}`);
        if (a) {
          a.style.display = dir === 'flat' ? 'none' : 'flex';
          a.style.transform = dir === 'down' ? 'rotate(180deg)' : '';
        }
        const kc = q(`kc_${k}`);
        if (kc) kc.style.color = dir === 'down' ? '#c2690a' : dir === 'flat' ? '#6f7891' : '#18884d';
      }
      const c = s.card;
      thumb('dThumb', c.thumb);
      set('dOrg', c.org);
      set('dTitle', c.title);
      set('dSub', c.sub);
      const ps = q('dStat');
      ps.className = `pillg ${c.statCls}`;
      set('dStat', c.stat);
      set('dStatText', c.statText);
      q('dBar').style.width = `${(100 * c.prog).toFixed(1)}%`;
      set('dProg', c.progText);
      html('dRows', (c.rows ?? []).map(([k, v, ln]) => `<div class="rw"><span>${k}</span><span${ln ? ' class="ln"' : ''}>${v}</span></div>`).join(''));
      // a depot card: a 2x2 stat grid, an inventory list and the forklift fleet in place of the rows
      q('dBar').parentElement.parentElement.style.display = c.stats ? 'none' : '';
      let ex = '';
      if (c.stats) ex += `<div class="sg">${c.stats.map(([k, v, of, p, g]) => `<div class="sb"><small>${k}</small><b>${v}${of ? ` <em>${of}</em>` : ''}</b>${p == null ? '' : `<div class="pb${g ? ' g' : ''}"><i style="width:${(100 * p).toFixed(1)}%"></i></div>`}</div>`).join('')}</div>`;
      if (c.inv) ex += `<div class="ih">Inventory<span>units</span></div>` + c.inv.map(([ic, name, n, tag, cls]) => `<div class="iv"><i style="background:${INV_BG[ic] ?? '#eef2fb'}">${INV[ic] ?? ''}</i><span>${name}</span><b>${n}</b><span class="tg ${cls}">${tag}</span></div>`).join('');
      if (c.fleet) ex += `<div class="fl"><div class="fh">${c.fleet.title}<span>${c.fleet.meta}</span></div>${c.fleet.rows.map(([id, txt, p]) => `<div class="fr"><b>${id}</b><span>${txt}</span><div class="pb"><i style="width:${(100 * p).toFixed(0)}%"></i></div><span>${Math.round(100 * p)}%</span></div>`).join('')}</div>`;
      if (c.tele) {
        const T = c.tele;
        ex += `<div class="tele"><div class="big"><div class="spd">${T.speed}<small>km/h</small></div><div class="gear">${T.gear}</div><div class="bars">`;
        ex += `<div class="b2">Throttle<div class="pb"><i style="width:${(100 * T.throttle).toFixed(0)}%;background:#22b35f"></i></div><b>${Math.round(100 * T.throttle)}%</b></div>`;
        ex += `<div class="b2">Brake<div class="pb"><i style="width:${(100 * T.brake).toFixed(0)}%;background:#ef4444"></i></div><b>${Math.round(100 * T.brake)}%</b></div></div></div>`;
        ex += `<div class="trace"><div class="tth">Speed trace<span>${T.traceLabel}</span></div><svg viewBox="0 0 320 54" width="100%" height="54" preserveAspectRatio="none">${T.trace}</svg></div>`;
        ex += `<div class="chips">${T.chips.map(([txt, cls]) => `<span class="chip2 ${cls ?? ''}">${txt}</span>`).join('')}</div>`;
        ex += `<div class="tyres">${T.tyres.map(([k, v, col]) => `<div style="--c:${col}">${k}<b>${v}</b></div>`).join('')}</div></div>`;
      }
      if (c.strat) {
        const S = c.strat;
        ex += `<div class="strat"><div class="run"><b>${S.ms}</b><span>${S.runText}</span></div>`;
        ex += `<div class="oh">Options<span>finish · ahead of car 3</span></div>`;
        ex += S.options.map(([name, fin, p, best]) => `<div class="opt${best ? ' best' : ''}"><b>${name}</b><span>${fin}</span><div style="display:flex;align-items:center;gap:6px"><div class="pb" style="flex:1"><i style="width:${(100 * p).toFixed(0)}%"></i></div>${Math.round(100 * p)}%</div></div>`).join('');
        ex += `<div class="call" style="background:${S.callOn ? '#2547c9' : '#eef1f7'};color:${S.callOn ? '#fff' : '#8b93a6'}">${S.call}</div></div>`;
      }
      if (c.stop) {
        const P = c.stop;
        ex += `<div class="stop"><div class="clk"><b>${P.clock}</b><span>${P.clockText}</span></div><div class="cn">${P.corners.map(([k, txt, ok]) => `<div class="${ok ? 'ok' : ''}"><b>${k}</b>${txt}<i>${ok ? '✓' : '…'}</i></div>`).join('')}</div></div>`;
      }
      if (c.aero) {
        const A = c.aero;
        ex += `<div class="aero"><div class="chart"><div class="tth">Wing sweep<span>${A.chartLabel}</span></div><svg viewBox="0 0 320 70" width="100%" height="70" preserveAspectRatio="none">${A.chart}</svg><div class="lg"><span><i style="background:#3166ea"></i>Downforce</span><span><i style="background:#ff8a3d"></i>Drag</span></div></div></div>`;
      }
      html('dExtra', paint(ex));
      q('det').style.transform = `translateY(${((1 - c.pop) * 10).toFixed(1)}px)`;
      q('det').style.opacity = (0.25 + 0.75 * c.pop).toFixed(3);
      const t = s.track;
      set('tTitle', t.title);
      set('tMeta', t.meta);
      html('steps', paint(`<div class="fl" style="width:calc((100% - 60px) * ${t.fill.toFixed(3)})"></div>` + t.steps.map(([n, tm, ic, stt]) => `<div class="st ${stt || 'fut'}"><b>${stt === 'on' ? STEP_IC.check : stt === 'done' ? STEP_IC[ic] : greyIc(ic)}</b>${n}<small>${tm}</small></div>`).join('')));
      thumb('sThumb', t.ship.thumb);
      set('sId', t.ship.id);
      set('sTo', t.ship.to);
      q('sStat').className = `pillg ${t.ship.statCls}`;
      set('sStat', t.ship.stat);
      set('sMeta', t.ship.meta);
      const tb = s.table;
      html('seg', tb.tabs.map(([n, k], i) => `<span${i === tb.active ? ' class="a"' : ''}>${n}<em>${k}</em></span>`).join(''));
      set('tSite', tb.site);
      html('rows', paint(tb.rows.map((r) => `<div class="tr"><div><b>${r.id}</b><small>${r.org}</small></div><div class="wh"><i style="background:${r.dot}"></i>${r.where}</div><div><span class="pillg ${r.cls}" style="font-size:12px;padding:4px 10px">${r.stat}</span></div><div class="pp">${r.p == null ? r.pt : `<div class="pb"><i style="width:${r.p}%"></i></div>${r.pt}`}</div><span style="color:#0f1730">›</span></div>`).join('')));
      const d = s.drop ?? {open: 0, sites: []};
      const dr = q('drop');
      dr.style.opacity = d.open.toFixed(3);
      dr.style.transform = `translateY(${((1 - d.open) * -8).toFixed(1)}px) scale(${(0.97 + 0.03 * d.open).toFixed(3)})`;
      q('dd').className = d.open > 0.05 ? 'dd on' : 'dd';
      html('dropList', d.sites.map(([ch, n, sb, p], i) => `<div class="it${i === d.on ? ' on' : ''}"><div class="chip">${ch}</div><div>${n}<small>${sb}</small></div><div class="mb"><i style="width:${p}%"></i></div></div>`).join(''));
      for (let i = 0; i < 7; i++) {
        const b = q(`tool${i}`);
        if (b) b.className = s.tool === i ? 'on' : '';
      }
      const tg = q('tags');
      const tags = s.tags ?? [];
      while (tg.children.length < tags.length) tg.appendChild(document.createElement('div'));
      [...tg.children].forEach((n, i) => {
        const g = tags[i];
        if (!g) {
          n.style.display = 'none';
          return;
        }
        n.style.display = '';
        const cls = g.kind === 'pin' ? 'pin' : 'sel';
        const h = g.kind === 'pin' ? '<div class="h"><i></i></div>' : `<div class="p">${g.text}<small>${g.sub ?? ''}</small></div><div class="t"></div>`;
        if (n.dataset.v !== cls + h) {
          n.className = cls;
          n.innerHTML = h;
          n.dataset.v = cls + h;
        }
        n.style.left = `${g.x.toFixed(1)}px`;
        n.style.top = `${g.y.toFixed(1)}px`;
        n.style.opacity = (g.a ?? 1).toFixed(3);
      });
      const cu = q('cur');
      const want = s.hand ? HAND : CURSOR;
      if (cu.dataset.v !== want) {
        cu.innerHTML = want;
        cu.dataset.v = want;
      }
      cu.style.left = `${s.cursor[0]}px`;
      cu.style.top = `${s.cursor[1]}px`;
      const rg = q('ring');
      rg.style.left = `${s.cursor[0]}px`;
      rg.style.top = `${s.cursor[1]}px`;
      rg.style.opacity = ((s.click ?? 0) * 0.9).toFixed(3);
      rg.style.transform = `scale(${(0.4 + (1 - (s.click ?? 0)) * 1.2).toFixed(3)})`;
    },
  };
}
