import { useState } from "react";

function ProductCategoryRow({category}) {
  return(
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>

  return(
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      )
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name}
      />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Price</td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, isStockOnly, onFilterTextChange, onIsStockOnlyChange }) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search....."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <br/>
      <label>
        <input
          type="checkbox"
          onChange={(e) => onIsStockOnlyChange(e.target.checked)} />
        {' '}
        Only show product in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [isStockOnly, setIsStockOnly] = useState(false);
  return (
    <div>
      <SearchBar 
        filterText={filterText}
        isStockOnly={isStockOnly}
        onFilterTextChange={setFilterText}
        onIsStockOnlyChange={setIsStockOnly} />
      <ProductTable
        filterText={filterText}
        isStockOnly={isStockOnly}
        products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function ProductList() {
  return <FilterableProductTable products={PRODUCTS} />;
}
