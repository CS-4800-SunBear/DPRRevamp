export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json({ message: 'hello from gabe' });
    } else {
      res.status(405).json({ error: 'use get' });
    }
  }