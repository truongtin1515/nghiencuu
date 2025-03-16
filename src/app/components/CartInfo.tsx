"use client"

import { useState } from "react";
import QuantitySelector from "./QuantitySelector";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
  discount?: number;
  outOfStock?: boolean;
}

const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Chuột Gaming Không Dây Attack Shark X11",
    image: "mouse.jpg",
    price: 499000,
    quantity: 1,
    category: "X11 Trắng dock",
  },
  {
    id: 2,
    name: "Chuột Gaming Không Dây Attack Shark X11 (Đen dock sạc)",
    image: "mouse_black.jpg",
    price: 499000,
    quantity: 1,
    category: "X11 Đen dock sạc",
    outOfStock: true,
  },
];

export default function ShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: number, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Giỏ Hàng</h2>
      {cart.map((item) => (
		<div key={item.id} className="mb-4 border p-2 flex items-center gap-4 rounded-lg shadow-sm">
			<div className="">
			<img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
			</div>
			<div className="flex-1">
				<p className="font-semibold">{item.name}</p>
				<p className="text-gray-500 text-sm">{item.category}</p>
				<p className={`text-red-500 ${item.outOfStock ? "opacity-50" : ""}`}>
					{item.outOfStock ? "Hết hàng" : `${item.price.toLocaleString()} VND`}
				</p>
				<div className="justify-items-start">
					<QuantitySelector
						defaultValue={item.quantity} 
						onValueChange={(newQuantity) => updateQuantity(item.id, newQuantity - item.quantity)}
					/>
				</div>
			</div>
			<button 
			className="p-2 bg-red-500 rounded hover:bg-red-600"
			onClick={() => removeItem(item.id)}
			>
			❌
			</button>
		</div>
		))}
    </div>
  );
}
