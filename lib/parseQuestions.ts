export const parseQuestions = (text: string) => {
  if (!text || typeof text !== 'string') {
    console.error('Invalid input text:', text);
    return [];
  }

  // Normalize line endings and trim
  const normalizedText = text.replace(/\r\n/g, '\n').trim();
  
  console.log('=== PARSER START ===');
  console.log('Input length:', normalizedText.length);

  const questions: any[] = [];

  // Split by "Question: " or "Question 1." patterns
  // This regex captures everything between "Question:" markers
  const questionPattern = /Question:\s*([\s\S]*?)(?=(?:Question:|$))/gi;
  let match;

  while ((match = questionPattern.exec(normalizedText)) !== null) {
    const questionBlock = match[1].trim();
    
    if (!questionBlock) continue;

    console.log(`\n--- Processing Question Block ${questions.length + 1} ---`);
    console.log('Block preview:', questionBlock.substring(0, 100));

    // Extract question text (everything before first option)
    const questionMatch = questionBlock.match(/^([\s\S]*?)(?=\n[A-D]\s*[\)\.])/m);
    const question = questionMatch ? questionMatch[1].trim() : '';

    if (!question || question.length < 5) {
      console.log('❌ No valid question text found');
      continue;
    }

    console.log('✓ Question:', question.substring(0, 60) + '...');

    // Extract all options
    const options: string[] = [];
    const optionsRegex = /\n[A-D]\s*[\)\.\)]\s*(.+?)(?=\n[A-D]\s*[\)\.]|\nAnswer:|\nExplanation:|$)/gs;
    let optMatch;

    while ((optMatch = optionsRegex.exec(questionBlock)) !== null) {
      let optionText = optMatch[1].trim();
      // Take only the first line
      optionText = optionText.split('\n')[0].trim();
      // Clean up markdown
      optionText = optionText
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .trim();

      if (optionText && optionText.length > 1) {
        options.push(optionText);
      }
    }

    console.log('✓ Options found:', options.length, options);

    if (options.length !== 4) {
      console.log(`❌ Expected 4 options, got ${options.length}. Skipping.`);
      continue;
    }

    // Extract answer
    let answer = '';
    const answerMatch = questionBlock.match(/Answer:\s*\*?([A-D])\*?/i);
    if (answerMatch) {
      answer = answerMatch[1].toUpperCase();
    }

    if (!answer) {
      console.log('❌ No answer found. Skipping.');
      continue;
    }

    console.log('✓ Answer:', answer);

    // Extract explanation
    const explanationMatch = questionBlock.match(/Explanation:\s*([\s\S]*?)$/i);
    const explanation = explanationMatch 
      ? explanationMatch[1].trim()
      : '';

    console.log('✓ Explanation length:', explanation.length);

    questions.push({
      question: question.trim(),
      options: options,
      answer: answer,
      explanation: explanation,
    });
  }

  console.log(`\n=== FINAL: Parsed ${questions.length} questions ===\n`);

  return questions;
};

