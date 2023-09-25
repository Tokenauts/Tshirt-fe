import React from "react";

const Categories = () => {
  return (
    <div>
      <section className="flex items-center w-full bg-gray-900 shadow-xl shadow-black">
        <div className="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-20 max-w-4xl">
          <div className="grid grid-row-1 gap-5 py-12 md:grid-cols-row-1 lg:grid-row-1">
            <img
              src="Category-1.png"
              className="rounded-xl hover:scale-110 duration-500 shadow-xl hover:shadow-black "
            />
            <img
              src="Category-2.png"
              className="rounded-xl hover:scale-110 duration-500 shadow-xl hover:shadow-black "
            />
            <img
              src="Category-3.png"
              className="rounded-xl hover:scale-110 duration-500 shadow-xl hover:shadow-black "
            />
            <img
              src="Category-4.png"
              className="rounded-xl hover:scale-110 duration-500 shadow-xl hover:shadow-black "
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
