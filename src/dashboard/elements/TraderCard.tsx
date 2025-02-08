import { Star, Copy } from 'lucide-react';

interface Trader {
  id: number;
  name: string;
  avatar: string;
  gain: number;
  commission: number;
  investors: number;
  winRate: number;
  profit: number;
  risk: number;
  isFavorite: boolean;
}

interface TraderCardProps {
  trader: Trader;
}

const TraderCard = ({ trader }: TraderCardProps) => {
  return (
    <div className="trader-card">
      <div className="trader-card-header">
        <div className="flex items-center gap-3">
          <img src={trader.avatar} alt={trader.name} className="trader-card-avatar w-10 h-10" />
          <div>
            <div className="font-medium text-gray-900">{trader.name}</div>
            <div className="text-sm text-gray-500">Last seen 1m ago</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="button-icon">
            <Star size={20} />
          </button>
          <button className="button-icon">
            <Copy size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraderCard; 