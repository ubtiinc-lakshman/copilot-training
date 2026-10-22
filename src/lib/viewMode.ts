import { cookies } from "next/headers";
import { isFacilitator } from "@/auth";

// Facilitators can switch to "participant view" (cookie) to see what participants see, e.g. locked days.
export const isParticipantView = async () => (await cookies()).get("view-as")?.value === "participant";

// Facilitator powers that apply to content: off while in participant view.
export const actingFacilitator = async (email?: string | null) => isFacilitator(email) && !(await isParticipantView());
