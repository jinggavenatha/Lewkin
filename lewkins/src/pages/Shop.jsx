import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'T-Shirts & Sweats',
    image: 'https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-premium-black-t-shirt-mockup-png-image_14226805.png',
    slug: 't-shirts',
  },
  {
    name: 'Shirts & Polos',
    image: 'https://i.pinimg.com/474x/8a/0b/1e/8a0b1eda15f8aab343fd8ade6c2c92ce.jpg',
    slug: 'shirts',
  },
  {
    name: 'Sweaters & Cardigans',
    image: 'https://png.pngtree.com/png-vector/20240202/ourmid/pngtree-black-sweater-mockup-hanging-png-file-png-image_11588651.png',
    slug: 'sweaters',
  },
  {
    name: 'Dresses & Skirts',
    image: 'https://parspng.com/wp-content/uploads/2023/08/clothespng.parspng.com-10.png',
    slug: 'bottoms',
  },
  {
    name: 'Outerwear',
    image: 'https://png.pngtree.com/png-vector/20240613/ourmid/pngtree-blue-jean-jacket-free-png-image_12715682.png',
    slug: 'outerwear',
  },
  {
    name: 'Innerwear & Underwear',
    image: 'https://static.vecteezy.com/system/resources/previews/059/040/992/non_2x/a-black-tank-top-on-a-black-background-free-png.png',
    slug: 'underwear',
  },
  {
    name: 'Loungewear & Home',
    image: 'https://image.uniqlo.com/UQ%2FCMS%2Fnavi%2Fimage%2FNAVI_476052_67.jpg',
    slug: 'loungewear',
  },
  {
    name: 'Accessories',
    image: 'Canvas_tote_1.png',
    slug: 'accessories',
  },
];

export default function Shop() {
  return (
    <div className="px-4 py-8">

      <section>
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of high-quality clothing
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 place-items-center">
          {categories.map((category) => (
            <Link
              to={`/products/category/${category.slug}`}
              key={category.slug}
              className="flex flex-col items-center group transition-transform duration-200 hover:scale-105"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 object-contain mb-2"
              />
              <span className="text-base font-medium group-hover:underline text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
