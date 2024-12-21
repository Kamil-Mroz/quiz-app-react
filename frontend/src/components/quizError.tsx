function QuizErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error Loading Quiz</h1>
      <p>{error?.message || "Something went wrong!"}</p>
    </div>
  );
}
export default QuizErrorBoundary;
