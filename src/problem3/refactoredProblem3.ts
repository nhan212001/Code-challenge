interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
  priority: number;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    const enrichedBalances = balances.reduce<WalletBalance[]>(
      (acc: WalletBalance[], balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain) ?? -99;
        if (priority > -99 && balance.amount > 0) {
          acc.push({ ...balance, priority });
        }
        return acc;
      },
      []
    );

    return enrichedBalances.sort(
      (lhs: WalletBalance, rhs: WalletBalance) => rhs.priority - lhs.priority
    );
  }, [balances]);

  const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    const key = `${balance.blockchain}-${balance.currency}`;
    return (
      <WalletRow
        className={classes.row}
        key={key}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
