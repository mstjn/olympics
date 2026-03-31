interface IndicatorProps {
    total: number,
    text: string, 
    color?: boolean
}
const Indicator = ({total, text, color} : IndicatorProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center mb-2">
      <h3 className="text-xl font-semibold mb-2">{text}</h3>
      <p className={`text-4xl font-bold ${color ? "text-green-400" : "text-blue-400"}`}>{total}</p>
    </div>
  );
};
export default Indicator;
