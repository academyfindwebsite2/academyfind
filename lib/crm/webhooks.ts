import { prisma } from "@/lib/prisma";

type WebhookEvent = "ENQUIRY" | "USER_SAVE" | "USER_VISIT";

export async function triggerCRMWebhooks(
  instituteId: string,
  eventType: WebhookEvent,
  payload: any
) {
  try {
    // Determine which flag to check based on event type
    const flagField = 
      eventType === "ENQUIRY" ? "sendEnquiries" :
      eventType === "USER_SAVE" ? "sendUserSaves" :
      "sendUserVisits";

    // Find active integrations for this institute that have this event enabled
    const integrations = await prisma.cRMIntegration.findMany({
      where: {
        instituteId,
        isActive: true,
        [flagField]: true,
      },
    });

    if (!integrations.length) return;

    const fullPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: payload,
    };

    // Fire webhooks in background (fire-and-forget style)
    integrations.forEach(async (integration) => {
      try {
        await fetch(integration.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullPayload),
        });
        console.log(`[Webhook Success] Sent ${eventType} to ${integration.provider}`);
      } catch (err: any) {
        console.error(`[Webhook Failed] ${integration.provider}: ${err.message}`);
      }
    });

  } catch (error) {
    console.error("Error triggering CRM webhooks:", error);
  }
}
