import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  // Determine which mode was selected
  const mode = buttonIndex === 1 ? 'classic' : 'degenerate';
  const fee = buttonIndex === 1 ? '$0.41' : '$0.69';

  // Return frame with game instructions
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/frame-image?mode=${mode}" />
        <meta property="fc:frame:button:1" content="Play on Web" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL}?mode=${mode}" />
        <meta property="fc:frame:button:2" content="View Leaderboard" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL}/leaderboard" />
      </head>
      <body>
        <h1>Flipr - ${mode === 'classic' ? 'Classic' : 'Degenerate'} Mode</h1>
        <p>Entry fee: ${fee}</p>
        <p>Click "Play on Web" to start flipping!</p>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
