export default function DeposList({ deposits = [], renderItem }) {
  return <>{deposits.map(renderItem)}</>;
}
