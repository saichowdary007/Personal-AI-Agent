import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useApiClient } from './useApiClient';

export function useCodeHelper() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState<string | null>(null);
  const [codeExplanation, setCodeExplanation] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { fetchFromApi } = useApiClient();

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter code to run');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput(null);
    
    try {
      const response = await fetchFromApi('/assist', {
        method: 'POST',
        body: { 
          type: 'code',
          content: code,
          parameters: {
            language,
            action: 'execute'
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Make sure we're only setting the output, not modifying the code
      setOutput(response.data.content || response.data.output || 'Execution completed successfully.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate code');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCodeExplanation(null);
    
    try {
      const response = await fetchFromApi('/assist', {
        method: 'POST',
        body: { 
          type: 'code',
          content: prompt,
          parameters: {
            language,
            action: 'generate',
            include_explanation: true
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Extract the code and explanation
      const content = response.data.content || response.data.output || '';
      
      // Improved parsing of code blocks and explanations
      const codeBlockMatches = content.match(/```[\w\s]*\n([\s\S]*?)```/g);
      
      if (codeBlockMatches && codeBlockMatches.length > 0) {
        // Extract the code from the first code block
        const codeBlockMatch = codeBlockMatches[0].match(/```[\w\s]*\n([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          const extractedCode = codeBlockMatch[1].trim();
          
          // Set the code in the editor
          setCode(extractedCode);
          
          // Create explanation by removing all code blocks from the content
          let explanation = content;
          codeBlockMatches.forEach((block: string) => {
            explanation = explanation.replace(block, '');
          });
          
          // Clean up and set the explanation
          explanation = explanation.trim();
          if (explanation) {
            setCodeExplanation(explanation);
          }
        } else {
          // If code extraction failed, just set the whole content
          setCode(content);
        }
      } else {
        // If no clear code block, set the whole response as code
        setCode(content);
      }
      
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearOutput = () => {
    setOutput(null);
    setError(null);
  };

  const clearAll = () => {
    setCode('');
    setOutput(null);
    setCodeExplanation(null);
    setError(null);
    setPrompt('');
  };

  return {
    code,
    setCode,
    language,
    setLanguage,
    output,
    isRunning,
    error,
    runCode,
    prompt,
    setPrompt,
    isGenerating,
    generateCode,
    codeExplanation,
    clearOutput,
    clearAll
  };
}

/*
Key Points:
- Handles code input, language, execution, and output.
- Posts to /api/code and returns output or error.
- Type-safe and stateful.
*/
