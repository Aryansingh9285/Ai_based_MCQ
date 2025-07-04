export const parseQuestions = (text: string) => {
  const blocks = text.split('\n\n');
  return blocks.map((block) => {
    const lines = block.split('\n');
    const question = lines[0].replace(/^\d+\.\s*/, '');
    const options = lines.slice(1, 5).map(line => line.replace(/^[A-D]\.\s*/, ''));
    const answer = lines.find(line => line.startsWith('Answer:'))?.replace('Answer:', '').trim() || '';
    const explanation = lines.find(line => line.startsWith('Explanation:'))?.replace('Explanation:', '').trim() || '';
    return { question, options, answer, explanation };
  });
};
