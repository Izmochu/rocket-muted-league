import { Challenge } from "@/domain/challenge";

export const challengesMock: Challenge[] = [
  {
    id: "1",
    challenger: "TurboBlaze",
    challenged: "DemoDevil",
    status: "pending",
    createdAt: "2024-01-28",
  },
  {
    id: "2",
    challenger: "ShadowFlick",
    challenged: "RocketNova",
    status: "pending",
    createdAt: "2024-01-26",
  },
  {
    id: "3",
    challenger: "AerialAce",
    challenged: "BoostPhantom",
    status: "accepted",
    createdAt: "2024-01-27",
    scheduledAt: "2024-01-30",
  },
  {
    id: "4",
    challenger: "FlipResetFury",
    challenged: "NitroKing",
    status: "accepted",
    createdAt: "2024-01-25",
    scheduledAt: "2024-01-29",
  },
];
