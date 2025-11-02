export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  timestamp: number;
}
