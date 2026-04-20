export interface ChatCharacter {
  id: string;
  name: string;
  emoji: string;
  role: string;
  scenario: string;
  scenarioVi: string;
  bgClass: string;
}

export const CHARACTERS: ChatCharacter[] = [
  {
    id: "sarah", name: "Sarah", emoji: "☕", role: "Coffee Shop Barista",
    scenario: "ordering food and drinks",
    scenarioVi: "Gọi đồ ăn / nước uống",
    bgClass: "bg-amber-50 border-amber-200",
  },
  {
    id: "alex", name: "Alex", emoji: "💼", role: "Office Colleague",
    scenario: "workplace small talk",
    scenarioVi: "Tán gẫu nơi công sở",
    bgClass: "bg-blue-50 border-blue-200",
  },
  {
    id: "emily", name: "Emily", emoji: "🏨", role: "Hotel Receptionist",
    scenario: "hotel services",
    scenarioVi: "Dịch vụ khách sạn",
    bgClass: "bg-purple-50 border-purple-200",
  },
  {
    id: "doctor", name: "Dr. Smith", emoji: "🏥", role: "Family Doctor",
    scenario: "medical appointments",
    scenarioVi: "Khám bệnh tại phòng khám",
    bgClass: "bg-green-50 border-green-200",
  },
];
