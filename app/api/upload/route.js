import crypto from 'crypto';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const webhookUrl = process.env.WEBHOOK_URL;
    const jwtSecret = process.env.JWT_SECRET;

    if (!webhookUrl || !jwtSecret) {
      return new Response('Server not configured', { status: 500 });
    }

    // ----- JWT GENERATION (HS256) -----
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const base64url = (obj) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');

    const encodedHeader = base64url(header);
    const encodedPayload = base64url(payload);
    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', jwtSecret)
      .update(data)
      .digest('base64url');

    const token = `${data}.${signature}`;

    // ----- FORWARD TO n8n -----
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return new Response('Upload failed', { status: 500 });
  }
}
