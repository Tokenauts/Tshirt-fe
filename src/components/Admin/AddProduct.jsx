import React, { useState } from "react";
import { useContractWrite } from "wagmi";
import ABI from "../../utils/abi.json";

const AddProduct = () => {
  const pinataApiKey = "108cc1670185cc3651d6";
  const pinataSecretApiKey =
    "10ba300f81944bcec510d3bd8380de5c7ef04a02c29dcfba097a38e495c1aa41";
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const contractaddress = "0xBba11Ec5cc2e1B04f92457Ac0a7736162EBBFE5A";
  const handleInputChange = (field, value, productIndex) => {
    const newProducts = [...products];
    newProducts[productIndex][field] = value;
    setProducts(newProducts);
  };

  // State for adding products
  const [products, setProducts] = useState([
    {
      name: "",
      description: "",
      price: "",
      files: [null], // Ensure a file input is rendered initially
      fileTypes: [null],
      category: "",
      collection: "",
      fileHashLinks: [null],
    },
  ]);

  const uploadToIPFS = async (file) => {
    let data = new FormData();
    data.append("file", file);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
      body: data,
    });

    if (res.ok) {
      const result = await res.json();
      return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } else {
      console.error("Failed to upload to IPFS");
      return null;
    }
  };
  const handleFileChange = (e, index, fileIndex) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const newProducts = [...products];
      newProducts[index].files[fileIndex] = selectedFile;
      newProducts[index].fileTypes[fileIndex] = selectedFile.type.startsWith(
        "image/"
      )
        ? "image"
        : "video";
      newProducts[index].fileHashLinks[fileIndex] = null;
      setProducts(newProducts);
    }
  };

  const handleUploadToIPFS = async (productIndex) => {
    const newProducts = [...products];
    for (let i = 0; i < products[productIndex].files.length; i++) {
      const fileHashLink = await uploadToIPFS(products[productIndex].files[i]);
      newProducts[productIndex].fileHashLinks[i] = fileHashLink;
    }
    setProducts(newProducts);
  };

  const { write: addProductsWrite } = useContractWrite({
    address: contractaddress,
    abi: ABI,
    functionName: "addProducts",
  });

  const handleAddProducts = async () => {
    // Extract relevant fields from products to submit to the smart contract
    const formattedProducts = products.map((product) => ({
      id: 0,
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
      fileHashes: product.fileHashLinks, // this is now an array
      fileTypes: product.fileTypes, // this is now an array
      category: product.category,
      collectionId: 0,
    }));

    try {
      console.log(formattedProducts);
      await addProductsWrite({ args: [formattedProducts] });
      console.log("Products added successfully!");
    } catch (error) {
      console.error("Error adding products:", error);
    }
  };

  const handleAddProductField = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        name: "",
        description: "",
        price: "",
        category: "",
        collection: "",
        files: [null], // Start with one file input field
        fileHashLinks: [null],
        fileTypes: [null],
      },
    ]);
  };
  const handleAddFileField = (productIndex) => {
    const newProducts = [...products];
    // Pushing a null value to show a new file input field
    newProducts[productIndex].files.push(null);
    newProducts[productIndex].fileTypes.push(null);
    newProducts[productIndex].fileHashLinks.push(null);
    setProducts(newProducts);
  };

  return (
    <div className="p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      {/* Section for adding products */}
      <section className="mb-10 p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Add Products</h2>
        {products.map((product, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-medium mb-4">
              Product {index + 1} Details
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Other input fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value, index)
                  }
                  placeholder="Product Name"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value, index)
                  }
                  placeholder="Product Description"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    handleInputChange("price", e.target.value, index)
                  }
                  placeholder="Product Price"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value, index)
                  }
                  placeholder="Product Category"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Collection
                </label>
                <input
                  type="text"
                  value={product.collection}
                  onChange={(e) =>
                    handleInputChange("collection", e.target.value, index)
                  }
                  placeholder="Product Collection"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              {/* Upload File Section */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Files (Images/Videos)
                </label>
                {product.files.map((file, fileIndex) => (
                  <div key={fileIndex} className="flex items-center mb-2">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleFileChange(e, index, fileIndex)}
                      className="mt-1 p-2 border rounded-md mr-2"
                    />

                    <button
                      onClick={() => handleUploadToIPFS(index, fileIndex)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                    >
                      Upload to IPFS
                    </button>
                    {product.fileHashLinks[fileIndex] && (
                      <a
                        href={product.fileHashLinks[fileIndex]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 underline"
                      >
                        {product.fileTypes[fileIndex] === "video"
                          ? "View Video"
                          : "View Image"}
                      </a>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleAddFileField(index)}
                  className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md"
                >
                  Add Another File
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddProductField}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
        >
          Add Another Product
        </button>
        <button
          onClick={handleAddProducts}
          className="ml-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
        >
          Submit Products
        </button>
      </section>
    </div>
  );
};

export default AddProduct;
