import { inngest } from "@/lib/inngest";
import analyzeTicket from "@/inngest/agents/ticketAgent";
import Ticket from "@/models/Ticket";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

export const onTicketCreated = inngest.createFunction(
  {
    id: "on-ticket-create",
    name: "AI Ticket Triage Assistant",
  },
  {
    event: "ticket/created",
  },
  async ({ event, step }) => {
    await connectDB();
    try {
      const { ticketId } = event.data;

      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw Error("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "IN_PROGRESS" });
      });

      const aiResponse = await analyzeTicket(ticket);

      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            summary: aiResponse.summary,
aiAnswer: `
Overview:
${aiResponse.helpfulNotes?.overview ?? "Not provided"}

Steps:
${
  aiResponse.helpfulNotes?.steps?.length
    ? aiResponse.helpfulNotes.steps
        .map((s: string, i: number) => `${i + 1}. ${s}`)
        .join("\n")
    : "No steps provided"
}

Code Example:
${aiResponse.helpfulNotes?.codeExample ?? "No code example provided"}

Next Steps:
${aiResponse.helpfulNotes?.nextSteps ?? "No further guidance"}
`,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = await step.run("assign-moderator", async () => {
        const db = mongoose.connection.db!;

        const skills = relatedskills.map((s: string) => s.toLowerCase());

        // console.log("❤️❤️❤️❤️❤️❤️❤️❤️", skills)
        let user = await db.collection("user").findOne({
          role: "moderator",
          skills: {
            $in: skills,
          },
        });
        // console.log("❤️❤️❤️❤️❤️❤️❤️❤️ assigned to", user)
        if (!user) {
          user = await db.collection("user").findOne({
            role: "admin",
          });
        }
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });
      return { success: true };
    } catch (error) {
      console.error("❌ Error running the step", error);
      return { success: false };
    }
  }
);
