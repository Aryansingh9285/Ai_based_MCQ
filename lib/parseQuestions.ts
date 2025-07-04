export const parseQuestions = (text: string) => {
  const blocks = text.split(/\n(?=Question: )/); // Split each question block starting with 'Question:'

  return blocks.map((block) => {
    const questionMatch = block.match(/Question:\s*([\s\S]*?)\nA\)/);
    const question = questionMatch ? questionMatch[1].trim() : '';

    const optionMatches = block.match(/A\)\s*([\s\S]*?)\nB\)\s*([\s\S]*?)\nC\)\s*([\s\S]*?)\nD\)\s*([\s\S]*?)\n/);
    const options = optionMatches
      ? [optionMatches[1], optionMatches[2], optionMatches[3], optionMatches[4]].map(opt => opt.trim())
      : ['', '', '', ''];

    const answerMatch = block.match(/Answer:\s*(.+)/);
    const answer = answerMatch ? answerMatch[1].trim() : '';

    const explanationMatch = block.match(/Explanation:\s*([\s\S]*)/);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    return { question, options, answer, explanation };
  });
};
