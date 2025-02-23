import { Agent } from './Marketplace';

export const strategies: Agent[] = [
  {
    id: 1,
    name: "Agent Alpha",
    avatar: "https://robohash.org/Agentalpha?size=48x48",
    capacity: "High Capacity",
    stats: {
      roi7: 20,
      roi180: 40,
      winRate: 62,
      pnl: 15000,
      copies: 160,
    },
    performance: [
      { value: 5 },
      { value: 15 },
      { value: 8 },
      { value: 22 },
      { value: 30 },
    ],
    isFeatured: true,
    status: "available",
    frequency: "high",
    commission: 12,
    description:
      "Agent Alpha focuses on aggressive growth through high-frequency trades.",
  },
  {
    id: 2,
    name: "Agent Bravo",
    avatar: "https://robohash.org/Agentbravo?size=48x48",
    capacity: "Medium Capacity",
    stats: {
      roi7: 10,
      roi180: 18,
      winRate: 57,
      pnl: 9000,
      copies: 90,
    },
    performance: [
      { value: 12 },
      { value: 7 },
      { value: 15 },
      { value: 10 },
      { value: 13 },
    ],
    isFeatured: false,
    status: "available",
    frequency: "medium",
    commission: 8,
    description:
      "Agent Bravo is built on steady, medium-frequency trades with consistent returns.",
  },
  {
    id: 3,
    name: "Agent Charlie",
    avatar: "https://robohash.org/Agentcharlie?size=48x48",
    capacity: "Low Capacity",
    stats: {
      roi7: 25,
      roi180: 45,
      winRate: 78,
      pnl: 25000,
      copies: 320,
    },
    performance: [
      { value: 20 },
      { value: 30 },
      { value: 25 },
      { value: 35 },
      { value: 40 },
    ],
    isFeatured: true,
    status: "full",
    frequency: "high",
    commission: 15,
    description:
      "Agent Charlie delivers high returns with groundbreaking strategies, currently at full capacity.",
  },
  {
    id: 4,
    name: "Agent Delta",
    avatar: "https://robohash.org/Agentdelta?size=48x48",
    capacity: "High Capacity",
    stats: {
      roi7: 8,
      roi180: 15,
      winRate: 55,
      pnl: 7000,
      copies: 65,
    },
    performance: [
      { value: 3 },
      { value: 8 },
      { value: 6 },
      { value: 10 },
      { value: 12 },
    ],
    isFeatured: false,
    status: "available",
    frequency: "low",
    commission: 5,
    description:
      "Agent Delta is a conservative low-frequency Agent focusing on risk management.",
  },
  {
    id: 5,
    name: "Agent Echo",
    avatar: "https://robohash.org/Agentecho?size=48x48",
    capacity: "Medium Capacity",
    stats: {
      roi7: 15,
      roi180: 25,
      winRate: 68,
      pnl: 11500,
      copies: 130,
    },
    performance: [
      { value: 10 },
      { value: 15 },
      { value: 14 },
      { value: 16 },
      { value: 18 },
    ],
    isFeatured: true,
    status: "available",
    frequency: "medium",
    commission: 10,
    description:
      "Agent Echo offers balanced growth using medium-frequency trading tactics.",
  },
  {
    id: 6,
    name: "Agent Foxtrot",
    avatar: "https://robohash.org/Agentfoxtrot?size=48x48",
    capacity: "Low Capacity",
    stats: {
      roi7: 12,
      roi180: 20,
      winRate: 63,
      pnl: 9500,
      copies: 100,
    },
    performance: [
      { value: 8 },
      { value: 14 },
      { value: 11 },
      { value: 13 },
      { value: 17 },
    ],
    isFeatured: false,
    status: "full",
    frequency: "low",
    commission: 7,
    description:
      "Agent Foxtrot is optimized for low frequency trading and solid returns over time.",
  },
]; 