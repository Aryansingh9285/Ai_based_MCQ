// components/AnalysisResult.tsx

type Props = {
  htmlContent: string;
};

const AnalysisResult = ({ htmlContent }: Props) => {
  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-semibold text-purple-700 mb-2">Assignment:</h2>
      <div
        className="prose prose-sm text-gray-800"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default AnalysisResult;
