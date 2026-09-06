import { Link } from "react-router-dom";

export function Brand() {
  const logoUrl = `${import.meta.env.BASE_URL}images/rsi-market-mascot.png`;

  return (
    <Link to="/" className="brand" aria-label="RSI Component Market home">
      <img src={logoUrl} alt="" aria-hidden="true" />
      <span>
        <strong>RSI</strong> Component Market
      </span>
    </Link>
  );
}
