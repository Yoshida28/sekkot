import React, { useState } from 'react';
import { Search } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Socket Head Bolt',
    category: 'Bolts',
    description: 'High tensile steel bolt used for precision clamping',
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Hex Flange Nut',
    category: 'Nuts',
    description: 'Self-locking flange nut with serrated bearing surface',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEOywV5QSzNQrNDYRsQc8-YEe6Rcq3eiBhVg&s'
  },
  {
    id: 3,
    name: 'Thread Rolling',
    category: 'Tools',
    description: 'Precision ground dies for thread rolling applications',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlScmllvkK9-KbBMOvhH7GRXeyRsQwMT--kQ&s'
  },
  {
    id: 4,
    name: 'Machined Shaft',
    category: 'Custom',
    description: 'Custom machined shafts for industrial applications',
    image: 'https://images.unsplash.com/photo-1589792923962-537704632910?auto=format&fit=crop&q=80'
  }
];

const categories = ['All', 'Bolts', 'Nuts', 'Tools', 'Custom'];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-300 text-center mb-12">
          Our Products
        </h1>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 bg-gray-900 border border-purple-900 rounded-lg text-white focus:outline-none focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-purple-800'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 hover:border-purple-500 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-200 mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;