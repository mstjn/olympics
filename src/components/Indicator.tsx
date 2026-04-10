interface IndicatorProps {
    total: number,
    text: string, 
    color?: boolean
}
const Indicator = ({total, text} : IndicatorProps) => {
  return (
    <div className="bg-white px-6 py-2 rounded-lg border-3 border-teal-600 shadow-lg text-center mb-2">
      <h3 className="text-xl text-gray-500">{text}</h3>
      <p className={`text-2xl font-bold text-black`}>{total}</p>
    </div>
  );
};
export default Indicator;
