# My OSM — Design System

ใช้เป็นแหล่งอ้างอิงเดียวของสี ตัวอักษร ระยะห่าง และขนาด control สำหรับ Angular + Tailwind CSS

## สีและ Contrast

| Token | ค่า | ใช้กับ |
|---|---|---|
| `brand-800` | `#14532D` | ปุ่มหลัก/ลิงก์บนพื้นสว่าง; contrast สูง |
| `brand-700` | `#166534` | active state, focus accent |
| `brand-50` | `#F0FDF4` | พื้นหลังเน้นสถานะ |
| `ink-900` | `#17211B` | หัวข้อ |
| `ink-800` | `#25332A` | เนื้อหาหลัก |
| `ink-700` | `#34443A` | label/เนื้อหารอง |
| `ink-600` | `#4B5B50` | helper text ที่ต้องอ่าน |
| `surface` | `#FFFFFF` | การ์ด/ช่องกรอก |
| `canvas` | `#F5F7F5` | พื้นหลังหน้า |
| `line` | `#C9D3CB` | เส้นขอบช่องกรอก/ตัวคั่น |
| `danger-800` | `#8F1D16` | ปุ่มลบ/ข้อผิดพลาด |
| `success-800` | `#17633A` | สถานะสำเร็จ |

ข้อกำหนด: ข้อความทั่วไป contrast อย่างน้อย 4.5:1; ข้อความใหญ่และองค์ประกอบ UI อย่างน้อย 3:1 ตาม WCAG 2.2 AA. ห้ามใช้สีอย่างเดียวระบุสถานะ—เพิ่มข้อความหรือไอคอนที่มี accessible name

## Typography

| บทบาท | ขนาด/น้ำหนัก | line-height |
|---|---|---|
| Body หลัก | 18px / 400 | 1.6 |
| Body เน้น/label | 18px / 600 | 1.45 |
| Helper text | 16px / 400 | 1.5 |
| Page title | 28px / 700 | 1.35 |
| Section title | 22px / 650 | 1.4 |
| Metric/ตัวเลขสรุป | 30px / 700 | 1.2 |

ฟอนต์: `Noto Sans Thai`, fallback `Tahoma`, `sans-serif`; ห้ามใช้ข้อความสำคัญต่ำกว่า 16px. รองรับการ zoom 200% โดยไม่ล็อกขนาด viewport หรือซ่อนเนื้อหา

## Sizing และ spacing

- ปุ่มหลัก/รอง: สูงอย่างน้อย 60px, padding แนวนอนอย่างน้อย 20px
- ช่องกรอก/Select: สูงอย่างน้อย 60px, พื้นที่ภายในไม่เบียดข้อความ
- พื้นที่กดขั้นต่ำ 44×44px; เป้าหมายหลัก 56×56px ขึ้นไป
- เว้นระหว่างปุ่มที่ทำงานต่างกันอย่างน้อย 12px; ระหว่างปุ่มลบกับบันทึกอย่างน้อย 16px
- spacing scale: 8, 12, 16, 24, 32, 40px
- card radius 12px; input/button radius 10px; border 1px
- focus ring หนาอย่างน้อย 3px และแยกจาก border ได้ชัด

## Component states

- Button: default, hover, focus-visible, disabled, loading; loading ปิดการกดซ้ำและประกาศสถานะ
- Field: default, focus, invalid, disabled; error มีข้อความใต้ช่องและ `aria-describedby`
- Search: ว่าง, กำลังพิมพ์, มีผล, ไม่พบ; มีปุ่มล้างที่ระบุชื่อชัด
- Dialog: มี heading, คำอธิบาย, ปุ่มยกเลิก และปุ่มยืนยันที่ชัดเจน
- Toast/inline feedback: ข้อความสั้น อ่านได้ และไม่หายเร็วเกินไป; สถานะสำคัญใช้ `role="status"` หรือ `aria-live`
- Navigation: active มีทั้งสีและ marker/ข้อความ ไม่พึ่งสีเพียงอย่างเดียว

## Tailwind CSS tokens

แปลงค่าหลักเป็น CSS variables ใน `@theme` ของ Tailwind v4 เช่น `--color-brand-800`, `--color-ink-900`, `--text-body: 18px`, `--size-control: 60px`, `--spacing-page: 24px`; shared components อ้าง token เหล่านี้เพื่อให้แก้ครั้งเดียวมีผลทั้งระบบ

## Motion

- ไม่ใช้ gradient ตกแต่งและ animation ที่ไม่ช่วยให้เข้าใจผลลัพธ์
- transition เฉพาะสถานะกด/โฟกัส ระยะสั้น และเคารพ `prefers-reduced-motion`
