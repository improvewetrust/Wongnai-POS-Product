// ╔══════════════════════════════════════════════════════════════╗
// ║              Wongnai POS Advisor — Rules Config              ║
// ║  แก้ไขไฟล์นี้เพื่ออัปเดต เงื่อนไข / ชื่อแพ็กเกจ / ราคา    ║
// ╚══════════════════════════════════════════════════════════════╝
//
// วิธีอ่าน:
//   s = ข้อมูลที่ผู้ใช้ตอบมาทั้งหมด (state)
//   s.budget        → 'low' | 'high'
//   s.service       → 'QSR' | 'FSR' | 'BUF'
//   s.branch_count  → ตัวเลขจำนวนสาขา (เช่น 1, 2, 3...)
//   s.plan_expand   → true | false (มีแผนขยายสาขา)
//   s.tables        → 'none' | 'few' | 'many'
//   s.zones         → 'few' | 'many'
//   s.avg_price     → 'low' | 'high'
//   s.menu_count    → 'few' | 'many'
//   s.staff         → 'few' | 'many'
//   s.daily_bills   → 'low' | 'high'
//   s.newstore      → 'yes' | 'no'
//   s.pain          → Set ของปัญหาที่เลือก เช่น s.pain.has('long_queue')
//
// ค่า pain ที่เป็นไปได้:
//   'long_queue'    คิวยาวหน้าร้าน
//   'order_error'   รับออเดอร์ผิด/ช้า
//   'staff_overload' พนักงานรับออเดอร์ไม่ทัน
//   'no_repeat'     ลูกค้าไม่กลับมาซื้อซ้ำ
//   'fake_slip'     เช็กสลิปปลอม
//   'credit_card'   รับบัตรเครดิต/เดบิต
//   'booking'       ต้องการระบบจองโต๊ะ
//   'need_mobility' รับออเดอร์ที่โต๊ะ (ถือเครื่อง)
//   'stock_issue'   จัดการสต็อกไม่ได้
//   'report_wrong'  สรุปยอดรายวันไม่ตรง

const POS_RULES = {

  // ══════════════════════════════════════════════════════════════
  // 1. เงื่อนไขการเลือก Platform (Android vs iOS)
  // ══════════════════════════════════════════════════════════════

  platform: {

    // --- บังคับ Android (ถ้าเข้าเงื่อนไขนี้ → Android เสมอ ไม่ต้องดูเงื่อนไขอื่น) ---
    forceAndroid: [
      {
        check: s => s.budget === 'low',
        reason: 'งบต่ำกว่า 25,000 บาท → เลือก Android เพื่อความคุ้มค่า'
      },
      // ➕ เพิ่มเงื่อนไข force Android ใหม่ตรงนี้ได้เลย เช่น:
      // { check: s => s.service === 'QSR' && s.branch_count === 1, reason: 'QSR สาขาเดียว Android เพียงพอ' },
    ],

    // --- สัญญาณชี้ iOS (ถ้ามีอย่างน้อย 1 ข้อ + ไม่ force Android → แนะนำ iOS) ---
    iOSSignals: [
      { check: s => s.branch_count > 1 || s.plan_expand,  reason: 'หลายสาขา / มีแผนขยาย' },
      { check: s => s.service === 'BUF',                   reason: 'ต้องการระบบ Buffet จับเวลา' },
      { check: s => s.staff === 'many',                    reason: 'พนักงานมากกว่า 5 คน ต้องจัดสิทธิ์' },
      { check: s => s.menu_count === 'many',               reason: 'เมนูมากกว่า 25 รายการ' },
      { check: s => s.avg_price === 'high',                reason: 'ราคาเมนูเฉลี่ยสูง (>100 บาท)' },
      { check: s => s.daily_bills === 'high',              reason: 'Transaction สูง (>100 บิล/วัน)' },
      { check: s => s.zones === 'many',                    reason: 'มีโซนที่นั่งมากกว่า 2 โซน' },
      { check: s => s.tables === 'many',                   reason: 'โต๊ะมากกว่า 10 โต๊ะ' },
      // ➕ เพิ่ม iOS signal ใหม่ได้เลย เช่น:
      // { check: s => s.pain.has('booking'), reason: 'ต้องการระบบจองโต๊ะ (รองรับเฉพาะ iOS)' },
    ]
  },


  // ══════════════════════════════════════════════════════════════
  // 2. Hardware
  // ══════════════════════════════════════════════════════════════

  hardware: {

    // --- iOS: มีแค่ตัวเลือกเดียว ---
    ios: {
      name: 'iPad Gen 11 (Silver) 128GB + Stand',
      icon: '📱',
      price_once: 13900,
      desc: 'iOS — Wongnai POS (IPAD) รองรับ Transaction สูง > 100 บิล/วัน สต็อก BOM ขั้นสูง หลายสาขา ใบกำกับภาษี VAT แยก Dine-in/Delivery',
      extras: [
        { name: 'เครื่องพิมพ์ Star BSC (LAN)', price: 7500 },
        { name: 'ลิ้นชักเก็บเงิน LB-405B1',   price: 2500 },
        { name: 'Router TP-Link AX12',          price: 2600 },
      ]
    },

    // --- Android: ไล่เงื่อนไขจากบนลงล่าง ข้อแรกที่ตรงจะถูกเลือก ---
    android: [
      {
        // เงื่อนไข: ต้องการเดินรับออเดอร์ที่โต๊ะ
        check: s => s.pain.has('need_mobility'),
        name: 'Wongnai POS Flex',
        icon: '📲',
        price_once: 10900,
        desc: 'จอ 10.1″ มีแบตเตอรี่ในตัว ใส่ซิมได้ พกพาเดินรับออเดอร์ที่โต๊ะได้'
      },
      {
        // เงื่อนไข: QSR (จ่ายก่อนกิน) → ใช้ Dual Screen ให้ลูกค้าสแกน QR ได้เลย
        check: s => s.service === 'QSR',
        name: 'Wongnai POS Dual Screen',
        icon: '🖥️',
        price_once: 14900,
        desc: 'จอหน้า + จอด้านลูกค้าสแกน QR จ่าย ดูออเดอร์และรับชำระได้ทันที เหมาะกับ QSR'
      },
      {
        // เงื่อนไข: งบน้อย → Lite (สำรอง กรณีหลุดเงื่อนไข force Android บน)
        check: s => s.budget === 'low',
        name: 'Wongnai POS Lite',
        icon: '💻',
        price_once: 5900,
        desc: 'จอ 15.6″ งบประหยัด ไม่มีเครื่องพิมพ์ในตัว เหมาะกับร้านเปิดใหม่งบจำกัด'
      },
      {
        // Default: ทุกกรณีที่เหลือ
        check: () => true,
        name: 'Wongnai POS Single Screen',
        icon: '🖥️',
        price_once: 14900,
        desc: 'จอ 15.6″ เครื่องพิมพ์ Autocut ในตัว พอร์ตครบ เหมาะกับ Casual Dining / FSR'
      },
      // ➕ เพิ่ม hardware รุ่นใหม่ได้ที่นี่ (ใส่ก่อน default)
    ]
  },


  // ══════════════════════════════════════════════════════════════
  // 3. Packages (แยกตาม service × platform)
  // ══════════════════════════════════════════════════════════════
  //
  // แต่ละ entry = { check, package, features }
  // ไล่จากบนลงล่าง — entry แรกที่ check(s) = true จะถูกเลือก

  packages: {

    // ──────────── QSR (จ่ายก่อนกิน / คาเฟ่ / ฟู้ดคอร์ท) ────────────
    QSR: {
      android: [
        {
          // มีปัญหาคิวยาว หรือพนักงานรับออเดอร์ไม่ทัน → Premium
          check: s => s.pain.has('long_queue') || s.pain.has('staff_overload'),
          package: { name: 'QSR Premium (Android)', tier: '⭐ แนะนำ', icon: '📦', monthly: 950, yearly: 11400 },
          features: [
            { icon: '📲', text: 'Wongnai Order & Pay — ลูกค้าสแกนสั่ง+จ่ายเองผ่าน QR ลดคิว' },
            { icon: '📺', text: 'Queue Display & Checker — จอแสดงคิวลูกค้าเช็กเองได้' },
            { icon: '🤝', text: 'Wongnai CRM รวมอยู่ในแพ็กเกจ' },
          ]
        },
        {
          // Default QSR Android
          check: () => true,
          package: { name: 'QSR Basic (Android)', tier: 'เริ่มต้นคุ้มค่า', icon: '📦', monthly: 390, yearly: 4680 },
          features: [
            { icon: '🧾', text: 'จัดการออเดอร์และบิลพื้นฐาน' },
            { icon: '🚚', text: 'เชื่อมต่อ LINE MAN Delivery' },
          ]
        },
      ],
      ios: [
        {
          // คิวยาว / พนักงานล้น / หรือพนักงานเยอะ → Max
          check: s => s.pain.has('long_queue') || s.pain.has('staff_overload') || s.staff === 'many',
          package: { name: 'QSR Max (Wongnai POS IPAD)', tier: '⭐ แนะนำ', icon: '📦', monthly: 1790, yearly: 21480 },
          features: [
            { icon: '📲', text: 'Order & Pay + Queue Display รวมอยู่ในแพ็กเกจ' },
            { icon: '🤝', text: 'Wongnai CRM รวมในแพ็กเกจ' },
            { icon: '⚙️', text: 'จัดการโปรโมชั่นขั้นสูง: Bundle 1 แถม 1, จับคู่, ตั้งเงื่อนไข' },
            { icon: '🏭', text: 'สต็อก BOM แปลงหน่วย 4 ระดับ ออก PO/PR ได้' },
          ]
        },
        {
          // Default QSR iOS
          check: () => true,
          package: { name: 'QSR Standard (Wongnai POS IPAD)', tier: 'เริ่มต้น iOS', icon: '📦', monthly: 1090, yearly: 13080 },
          features: [
            { icon: '🧾', text: 'จัดการออเดอร์และบิลพื้นฐาน + เชื่อมต่อ Delivery หลายเจ้า' },
            { icon: '⚙️', text: 'จัดการโปรโมชั่นพร้อมเงื่อนไข, แยก Dine-in/Delivery' },
          ]
        },
      ]
    },

    // ──────────── FSR (มีโต๊ะนั่งทาน) ────────────
    FSR: {
      android: [
        {
          // ร้านซับซ้อน: โต๊ะเยอะ / โซนเยอะ / พนักงานเยอะ / ออเดอร์ผิดบ่อย → Premium
          check: s => s.tables === 'many' || s.zones === 'many' || s.staff === 'many' || s.pain.has('order_error'),
          package: { name: 'FSR Premium (Android)', tier: '⭐ แนะนำ', icon: '📦', monthly: 1490, yearly: 17880 },
          features: [
            { icon: '📱', text: 'Mobile Staff — พนักงานกดออเดอร์จากมือถือ' },
            { icon: '🪑', text: 'Mobile Order Dynamic — QR แปะโต๊ะ ลูกค้าสั่งเอง' },
            { icon: '🤝', text: 'Wongnai CRM รวมอยู่ในแพ็กเกจ' },
          ]
        },
        {
          // Default FSR Android
          check: () => true,
          package: { name: 'FSR Basic (Android)', tier: 'เริ่มต้น', icon: '📦', monthly: 690, yearly: 8280 },
          features: [
            { icon: '🪑', text: 'ผังโต๊ะ จัดการออเดอร์พื้นฐาน' },
            { icon: '📱', text: 'Mobile Staff Static ซื้อเพิ่มได้ 300/เดือน' },
          ]
        },
      ],
      ios: [
        {
          // ร้านซับซ้อน หรือบิลเยอะ → Max
          check: s => s.tables === 'many' || s.zones === 'many' || s.staff === 'many' || s.pain.has('order_error') || s.daily_bills === 'high',
          package: { name: 'FSR Max (Wongnai POS IPAD)', tier: '⭐ แนะนำ', icon: '📦', monthly: 2690, yearly: 32280 },
          features: [
            { icon: '🗺️', text: 'ผังโต๊ะเสมือนจริง ย้าย/รวมโต๊ะ แยกบิล แบ่งจ่าย' },
            { icon: '📱', text: 'Mobile Staff 6 เครื่อง + Mobile Order Dynamic รวมอยู่' },
            { icon: '📅', text: 'Wongnai Reservations รวมอยู่ในแพ็กเกจ' },
            { icon: '🤝', text: 'Wongnai CRM รวมอยู่ในแพ็กเกจ' },
            { icon: '🔍', text: 'ระบบ Checker ตรวจสอบออเดอร์ที่ลูกค้าสั่งครบหรือยัง' },
          ]
        },
        {
          // Default FSR iOS
          check: () => true,
          package: { name: 'FSR Standard (Wongnai POS IPAD)', tier: 'เริ่มต้น iOS', icon: '📦', monthly: 1790, yearly: 21480 },
          features: [
            { icon: '🗺️', text: 'ผังโต๊ะขั้นสูง ย้ายโต๊ะ แยกบิลได้' },
            { icon: '📱', text: 'Mobile Staff 4 เครื่อง + Mobile Order Static' },
            { icon: '📅', text: 'Wongnai Reservations ซื้อเพิ่มได้ 6,000/ปี' },
          ]
        },
      ]
    },

    // ──────────── BUF (Buffet) ────────────
    BUF: {
      android: [
        {
          // Android ไม่มีระบบ Buffet จริง → แนะนำ QSR Premium แทนพร้อม note
          check: () => true,
          package: { name: 'QSR Premium (Android)', tier: 'ใช้แทน Buffet', icon: '📦', monthly: 950, yearly: 11400 },
          features: [
            { icon: '⚠️', text: 'Android ไม่มีระบบ Buffet จับเวลาโดยเฉพาะ — ใช้ QSR Premium แทนได้ในเบื้องต้น' },
            { icon: '💡', text: 'แนะนำอัพเกรดเป็น Wongnai POS (IPAD) เมื่อมีงบ เพื่อ Buffet Service เต็มรูปแบบ' },
          ]
        },
      ],
      ios: [
        {
          // บุฟเฟต์ใหญ่: โต๊ะเยอะ หรือบิลเยอะ → Max
          check: s => s.tables === 'many' || s.daily_bills === 'high',
          package: { name: 'BSR Max (Wongnai POS IPAD)', tier: '⭐ แนะนำ', icon: '📦', monthly: 2990, yearly: 35880 },
          features: [
            { icon: '⏱️', text: 'จับเวลาถอยหลัง แจ้งเตือนเมื่อใกล้หมดเวลา' },
            { icon: '🍽️', text: 'กำหนดเมนูตามแพ็กเกจ/ราคาที่ลูกค้าเลือก' },
            { icon: '📅', text: 'Wongnai Reservations รวมอยู่ในแพ็กเกจ' },
            { icon: '🤝', text: 'Wongnai CRM รวมอยู่ในแพ็กเกจ' },
            { icon: '🔍', text: 'ระบบ Checker ตรวจสอบออเดอร์ครบหรือยัง' },
          ]
        },
        {
          // Default Buffet iOS
          check: () => true,
          package: { name: 'BSR Standard (Wongnai POS IPAD)', tier: 'เริ่มต้น', icon: '📦', monthly: 2090, yearly: 25080 },
          features: [
            { icon: '⏱️', text: 'จับเวลาถอยหลัง แจ้งเตือนเมื่อใกล้หมดเวลา' },
            { icon: '🍽️', text: 'กำหนดเมนูตามแพ็กเกจที่ลูกค้าเลือก' },
          ]
        },
      ]
    },

    // ➕ เพิ่มประเภทร้านใหม่ได้ที่นี่ เช่น:
    // HOTEL: { android: [...], ios: [...] },
  },


  // ══════════════════════════════════════════════════════════════
  // 4. Add-ons (แนะนำเพิ่มเติมตามปัญหาที่เลือก)
  // ══════════════════════════════════════════════════════════════
  //
  // check(s, featText) = เงื่อนไข
  //   featText('ข้อความ') → true ถ้า feature นี้รวมอยู่ใน package แล้ว (ไม่ต้องแนะนำซ้ำ)

  addons: [
    {
      // CRM: ลูกค้าไม่กลับมาซื้อซ้ำ และยังไม่มีใน package
      check: (s, featText) => s.pain.has('no_repeat') && !featText('CRM รวม'),
      name: 'Wongnai CRM', icon: '🎁', yearly: 6000,
      desc: 'สะสมแต้ม Tier สมาชิก Broadcast โปรโมชั่นผ่าน LINE OA เปลี่ยนลูกค้าขาจรเป็นลูกค้าประจำ'
    },
    {
      // Reservations บน iOS: ต้องการจองโต๊ะ และยังไม่มีใน package
      check: (s, featText) => s.pain.has('booking') && s._platform === 'ios' && !featText('Reservations รวม'),
      name: 'Wongnai Reservations', icon: '📅', yearly: 6000,
      desc: 'จองผ่าน Google Search/Maps 24 ชม. ข้อมูลเด้งเข้า POS อัตโนมัติ (โปร 6,000/ปี จากปกติ 12,000/ปี)'
    },
    {
      // Reservations บน Android: แจ้งว่ายังไม่รองรับ
      check: (s) => s.pain.has('booking') && s._platform === 'android',
      name: 'ℹ️ ระบบจองโต๊ะ (หมายเหตุ)', icon: 'ℹ️', yearly: 0,
      desc: 'Wongnai Reservations รองรับเฉพาะ Wongnai POS (IPAD) — พิจารณาอัพเกรดแพลตฟอร์มหากต้องการฟีเจอร์นี้'
    },
    {
      // Order & Pay: พนักงานล้น + QSR + ยังไม่มีใน package
      check: (s, featText) => s.pain.has('staff_overload') && s.service === 'QSR'
        && !featText('Mobile Staff') && !featText('Mobile Order') && !featText('Order & Pay'),
      name: 'Wongnai Order & Pay', icon: '📲', yearly: 6000,
      desc: 'ลูกค้าสแกนสั่ง+จ่ายเองผ่าน QR ไม่ต้องรอพนักงาน ลดภาระช่วงพีค (500/เดือน)'
    },
    {
      // Mobile Staff: พนักงานล้น + FSR/BUF + ยังไม่มีใน package
      check: (s, featText) => s.pain.has('staff_overload') && s.service !== 'QSR'
        && !featText('Mobile Staff') && !featText('Mobile Order') && !featText('Order & Pay'),
      name: 'Mobile Staff', icon: '📱', yearly: 3600,
      desc: 'พนักงานใช้มือถือรับออเดอร์ส่งตรงเข้าครัวทันที (Static 300/เดือน)'
    },
    {
      // Mobile Order Static: รับออเดอร์ผิด/ช้า + FSR/BUF + ยังไม่มีใน package
      check: (s, featText) => s.pain.has('order_error') && (s.service === 'FSR' || s.service === 'BUF')
        && !featText('Mobile Staff') && !featText('Mobile Order') && !featText('Order & Pay'),
      name: 'Mobile Order Static', icon: '📱', yearly: 3600,
      desc: 'QR แปะโต๊ะ ลูกค้าดูเมนูและสั่งด้วยตัวเอง ลดความผิดพลาด (300/เดือน)'
    },
    {
      // Queue Display: คิวยาว/พนักงานล้น + ยังไม่มีใน package
      check: (s, featText) => (s.pain.has('long_queue') || s.pain.has('staff_overload')) && !featText('Queue Display'),
      name: 'Queue Display & Checker', icon: '📺', yearly: 7200,
      desc: 'จอแสดงสถานะออเดอร์ ลูกค้าเช็กเองได้ ลดความวุ่นวายช่วงพีค (600/เดือน)'
    },
    {
      // Stock iOS: จัดการสต็อกไม่ได้ + iOS (รวมอยู่แล้วในแพ็กเกจ)
      check: (s) => s.pain.has('stock_issue') && s._platform === 'ios',
      name: 'Advanced Inventory ✅ รวมใน IPAD', icon: '🏭', yearly: 0,
      desc: 'Wongnai POS (IPAD) มีสต็อกขั้นสูง BOM แปลงหน่วย 4 ระดับ แจ้งเตือนของใกล้หมด ออก PO/PR รวมในแพ็กเกจแล้ว'
    },
    {
      // Stock Android: จัดการสต็อกไม่ได้ + Android
      check: (s) => s.pain.has('stock_issue') && s._platform === 'android',
      name: 'ระบบสต็อก Wongnai POS', icon: '📦', yearly: 0,
      desc: 'สต็อก Real-time ตัดวัตถุดิบอัตโนมัติ แจ้งเตือนของใกล้หมด รวมในแพ็กเกจ | หากต้องการ BOM ขั้นสูง พิจารณาอัพเกรดเป็น Wongnai POS (IPAD)'
    },
    {
      // Reporting: สรุปยอดไม่ตรง
      check: (s) => s.pain.has('report_wrong'),
      name: 'Reporting & Analytics ✅ รวมใน POS', icon: '📊', yearly: 0,
      desc: 'บันทึกทุกออเดอร์ Real-time ดูสรุปยอดขาย เมนูขายดี ยอดต่อกะ ปิดกะได้จากหน้าเครื่อง'
    },
    // ➕ เพิ่ม add-on ใหม่ได้ที่นี่
  ],


  // ══════════════════════════════════════════════════════════════
  // 5. Payment Options
  // ══════════════════════════════════════════════════════════════

  payments: {

    // POS Pay: แนะนำทุกร้านเสมอ
    pos_pay: {
      type: 'POS Pay', icon: '📲', deposit: 0,
      tag: 'แนะนำทุกร้าน', tagColor: '#16a34a',
      desc: 'สร้าง QR โอนเงินผูกกับบิล ปิดบิลอัตโนมัติเมื่อโอนสำเร็จ ล็อกยอดเปะ ป้องกันสลิปปลอม ลดความคลาดเคลื่อนยอดรายวัน',
      note: 'ใช้งานได้ทั้ง Android และ IPAD — ไม่มีค่าใช้จ่ายรายเดือน'
    },

    // EDC (เต็มรูปแบบ): เงื่อนไขร้านที่ต้องการรูดบัตรและมีปริมาณสูง
    edc: {
      // ถ้าเลือก credit_card และ (FSR/BUF หรือ โต๊ะเยอะ หรือ ราคาเมนูสูง หรือ บิลเยอะ)
      check: s => s.pain.has('credit_card') && (
        s.service === 'FSR' || s.service === 'BUF' ||
        s.tables === 'many' || s.avg_price === 'high' || s.daily_bills === 'high'
      ),
      type: 'EDC', icon: '💳', deposit: 990,
      tag: 'แนะนำสำหรับร้านนี้', tagColor: '#1d4ed8',
      desc: 'รับบัตรเครดิต/เดบิต ทั้งในและต่างประเทศ + e-Wallet รองรับยอดต่อบิลสูงสุด 30,000 บาท (นิติบุคคล)',
      note: 'ยอดรูดเกิน 35,000 บาท/เดือน ฟรีค่าบริการ | MDR บัตรในประเทศ 0% QR PromptPay'
    },

    // Mini EDC: ร้านเล็ก ปริมาณน้อย
    mini_edc: {
      // ถ้าเลือก credit_card แต่ไม่เข้าเงื่อนไข EDC เต็ม
      check: s => s.pain.has('credit_card'),
      type: 'Mini EDC', icon: '💳', deposit: 500,
      tag: 'เหมาะกับร้านขนาดเล็ก', tagColor: '#7c3aed',
      desc: 'รับบัตรและ e-Wallet รองรับยอดต่อบิลสูงสุด 5,000 บาท เหมาะกับ QSR และร้านขนาดเล็ก',
      note: 'ยอดรูดเกิน 20,000 บาท/เดือน ฟรีค่าบริการ | ค่าประกันเครื่อง 500 บาท'
    },

    // Mini EDC แนะนำอ่อนๆ: FSR/BUF โต๊ะเยอะ แต่ไม่ได้เลือก credit_card
    mini_edc_soft: {
      check: s => !s.pain.has('credit_card') && (s.service === 'FSR' || s.service === 'BUF') && s.tables === 'many',
      type: 'Mini EDC (ตัวเลือกเพิ่มเติม)', icon: '💳', deposit: 500,
      tag: 'พิจารณาเพิ่มเติม', tagColor: '#d97706',
      desc: 'ร้านมีหลายโต๊ะ อาจมีลูกค้าต่างชาติหรือลูกค้าที่ต้องการรูดบัตร — Mini EDC เพิ่มช่องทางชำระเงิน',
      note: 'ยอดรูดเกิน 20,000 บาท/เดือน ฟรีค่าบริการ'
    }
  },


  // ══════════════════════════════════════════════════════════════
  // 6. โปรพิเศษร้านใหม่
  // ══════════════════════════════════════════════════════════════

  newstore_tips: [
    '🎉 LINE MAN Delivery — ฟรี GP 0% ช่วงแรกตามแคมเปญ เพิ่มยอดขายออนไลน์ทันทีที่เปิดร้าน',
    '📢 LINE OA ฟรี — ใช้ร่วมกับ CRM Broadcast โปรโมชั่นหาลูกค้าใหม่',
    '⭐ สร้างภาพลักษณ์มืออาชีพตั้งแต่วันแรก ด้วยระบบ POS ครบวงจร',
    '💳 ผ่อน 0% นาน 10 เดือน ทุกธนาคาร (ยกเว้น กสิกร และธนาคารรัฐ)',
    // ➕ เพิ่ม tip ใหม่ได้ที่นี่
  ]

};
