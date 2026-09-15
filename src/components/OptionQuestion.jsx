export default function OptionQuestion({ question, answer, onAnswer }) {
  return (
    <div className="options">
      {question.options.map((opt, i) => (
        <label key={i} className={answer === i ? "selected" : ""} onClick={() => onAnswer(i)}>
          <input type="radio" name="opt" readOnly checked={answer === i} />
          {opt}
        </label>
      ))}
    </div>
  );
}
