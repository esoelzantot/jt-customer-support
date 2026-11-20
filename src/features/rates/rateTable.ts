/**
 * Rates & delivery days — GENERATED from "Rates Calculator & DD.xlsx" (Sheet1) by parsing its IFS formulas.
 * Don't hand-edit numbers here: regenerate from the sheet when prices change.
 *   firstKilo / additionalKilo  ← G2 / G3   (from zone × to zone, EGP)
 *   ZONES                       ← A11:B14  ("Qaluybia" in the sheet normalised to "Qalyubia")
 *   DELIVERY_DAYS               ← L3:L28   (origin governorate × destination; 'closed' = Temporarily Closed)
 */

export type ZoneId = 1 | 2 | 3 | 4
export type ToZone = ZoneId | 'same'

export type Governorate = { id: string; ar: string; zone: ZoneId | null }

/** Destination list order from the sheet (K3:K28 validation source). North Sinai has no zone. */
export const GOVERNORATES: Governorate[] = [
  { id: "Cairo", ar: "القاهرة", zone: 1 },
  { id: "Giza", ar: "الجيزة", zone: 1 },
  { id: "Alexandria", ar: "الإسكندرية", zone: 1 },
  { id: "Ismailia", ar: "الإسماعيلية", zone: 2 },
  { id: "Suez", ar: "السويس", zone: 2 },
  { id: "Port Said", ar: "بورسعيد", zone: 2 },
  { id: "Dakahlia", ar: "الدقهلية", zone: 2 },
  { id: "Qalyubia", ar: "القليوبية", zone: 2 },
  { id: "Monufia", ar: "المنوفية", zone: 2 },
  { id: "Sharkia", ar: "الشرقية", zone: 2 },
  { id: "Gharbia", ar: "الغربية", zone: 2 },
  { id: "Beheira", ar: "البحيرة", zone: 2 },
  { id: "Kafr ElSheikh", ar: "كفر الشيخ", zone: 2 },
  { id: "Damietta", ar: "دمياط", zone: 2 },
  { id: "Beni Suef", ar: "بني سويف", zone: 3 },
  { id: "Fayoum", ar: "الفيوم", zone: 3 },
  { id: "Minya", ar: "المنيا", zone: 3 },
  { id: "Asyut", ar: "أسيوط", zone: 3 },
  { id: "Qena", ar: "قنا", zone: 3 },
  { id: "Luxor", ar: "الأقصر", zone: 3 },
  { id: "Aswan", ar: "أسوان", zone: 3 },
  { id: "Sohag", ar: "سوهاج", zone: 3 },
  { id: "Red Sea", ar: "البحر الأحمر", zone: 3 },
  { id: "Matrouh", ar: "مطروح", zone: 4 },
  { id: "New Valley", ar: "الوادي الجديد", zone: 4 },
  { id: "South Sinai", ar: "جنوب سيناء", zone: 4 },
  { id: "North Sinai", ar: "شمال سيناء", zone: null },
]

/** Origins available in the delivery-days table (J3:J28). */
export const ORIGIN_IDS: string[] = ["Cairo", "Giza", "Alexandria", "Ismailia", "Suez", "Port Said", "Dakahlia", "Qalyubia", "Monufia", "Sharkia", "Gharbia", "Beheira", "Kafr ElSheikh", "Damietta", "Beni Suef", "Fayoum", "Minya", "Asyut", "Qena", "Luxor", "Aswan", "Sohag", "Red Sea", "Matrouh", "New Valley", "South Sinai"]

export const FIRST_KILO: Record<ZoneId, Record<ToZone, number>> = {
  1: { same: 94, 1: 94, 2: 106, 3: 137, 4: 225 },
  2: { same: 94, 1: 106, 2: 119, 3: 137, 4: 225 },
  3: { same: 94, 1: 119, 2: 119, 3: 137, 4: 225 },
  4: { same: 188, 1: 225, 2: 225, 3: 225, 4: 225 },
}

export const ADDITIONAL_KILO: Record<ZoneId, Record<ToZone, number>> = {
  1: { same: 5, 1: 5, 2: 7, 3: 10, 4: 15 },
  2: { same: 7, 1: 7, 2: 7, 3: 10, 4: 15 },
  3: { same: 10, 1: 10, 2: 10, 3: 10, 4: 15 },
  4: { same: 15, 1: 15, 2: 15, 3: 15, 4: 15 },
}

export const DELIVERY_DAYS: Record<string, Record<string, number | 'closed'>> = {
  "Cairo": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Giza": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Alexandria": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Ismailia": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Suez": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Port Said": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Dakahlia": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Qalyubia": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Monufia": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Sharkia": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Gharbia": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Beheira": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Kafr ElSheikh": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Damietta": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Beni Suef": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Fayoum": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Minya": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Asyut": { "Giza": 1, "Alexandria": 1, "Ismailia": 1, "Cairo": 1, "Suez": 1, "Port Said": 1, "Dakahlia": 1, "Qalyubia": 1, "Monufia": 1, "Sharkia": 1, "Gharbia": 1, "Beheira": 1, "Kafr ElSheikh": 1, "Damietta": 1, "Beni Suef": 1, "Fayoum": 1, "Minya": 1, "Asyut": 1, "Qena": 2, "Luxor": 1, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 2, "South Sinai": 2, "New Valley": 4, "North Sinai": "closed" },
  "Qena": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 2, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 3, "South Sinai": 3, "New Valley": 4, "North Sinai": "closed" },
  "Luxor": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 1, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 3, "South Sinai": 3, "New Valley": 4, "North Sinai": "closed" },
  "Aswan": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 2, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 3, "South Sinai": 3, "New Valley": 4, "North Sinai": "closed" },
  "Sohag": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 2, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 3, "South Sinai": 3, "New Valley": 4, "North Sinai": "closed" },
  "Red Sea": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 2, "Qena": 2, "Luxor": 2, "Aswan": 2, "Sohag": 2, "Red Sea": 2, "Matrouh": 3, "South Sinai": 3, "New Valley": 4, "North Sinai": "closed" },
  "Matrouh": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 2, "Qena": 3, "Luxor": 3, "Aswan": 3, "Sohag": 3, "Red Sea": 3, "Matrouh": 2, "South Sinai": 3, "New Valley": 5, "North Sinai": "closed" },
  "New Valley": { "Giza": 4, "Alexandria": 4, "Ismailia": 4, "Cairo": 4, "Suez": 4, "Port Said": 4, "Dakahlia": 4, "Qalyubia": 4, "Monufia": 4, "Sharkia": 4, "Gharbia": 4, "Beheira": 4, "Kafr ElSheikh": 4, "Damietta": 4, "Beni Suef": 4, "Fayoum": 4, "Minya": 4, "Asyut": 3, "Qena": 4, "Luxor": 4, "Aswan": 4, "Sohag": 4, "Red Sea": 4, "Matrouh": 5, "South Sinai": 5, "New Valley": 3, "North Sinai": "closed" },
  "South Sinai": { "Giza": 2, "Alexandria": 2, "Ismailia": 2, "Cairo": 2, "Suez": 2, "Port Said": 2, "Dakahlia": 2, "Qalyubia": 2, "Monufia": 2, "Sharkia": 2, "Gharbia": 2, "Beheira": 2, "Kafr ElSheikh": 2, "Damietta": 2, "Beni Suef": 2, "Fayoum": 2, "Minya": 2, "Asyut": 2, "Qena": 3, "Luxor": 3, "Aswan": 3, "Sohag": 3, "Red Sea": 3, "Matrouh": 3, "South Sinai": 1, "New Valley": 5, "North Sinai": "closed" },
}

export const SAME_ZONE_DEFINITION = "The pickup and delivery addresses are in the same Governorate, and the shipment will not go through the HUB"
