import type { NextApiRequest, NextApiResponse } from 'next';
import { jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, domain, answers } = req.body;

  if (!name || !domain || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing or invalid input' });
  }

  try {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Quiz Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 14, 30);
    doc.text(`Domain: ${domain}`, 14, 37);
    doc.text(`Total Questions: ${answers.length}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [['Question', 'Answer']],
      body: answers.map((ans: string, i: number) => [`Q${i + 1}`, ans]),
    });

    const pdfBuffer = doc.output('arraybuffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}_quiz_report.pdf"`);
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
