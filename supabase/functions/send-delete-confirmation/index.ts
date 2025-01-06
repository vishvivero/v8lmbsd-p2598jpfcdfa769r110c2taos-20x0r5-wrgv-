import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, userName } = await req.json() as EmailRequest;
    console.log("Sending delete confirmation email to:", to);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Debt Free <onboarding@resend.dev>", // Using Resend's testing domain
        to: ["rv.rajvishnu@gmail.com"], // Always send to your email in testing mode
        reply_to: to, // Add the user's email as reply-to
        subject: "Account Deletion Confirmation",
        html: `
          <h2>Account Deletion Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>This email confirms that your account (${to}) and all associated data have been successfully deleted from our system.</p>
          <p>We're sorry to see you go. If you change your mind, you're always welcome to create a new account.</p>
          <p>Best regards,<br>The Debt Free Team</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Error response from Resend:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending delete confirmation email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);